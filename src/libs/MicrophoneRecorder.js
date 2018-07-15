import AudioContext from './AudioContext';

let onDataCallback, onStopCallback, onStartCallback, blobObject, mediaOptions, stream, analyser, audioCtx,
    mediaRecorder, startTime, chunks = [];

const constraints = {audio: true, video: false}; // constraints - only audio needed

export default class MicrophoneRecorder {
    constructor(onStart, onStop, onData, options) {
        
        navigator.getUserMedia = (navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);
        
        onStartCallback = onStart;
        onStopCallback = onStop;
        mediaOptions = options;
        onDataCallback = onData;
    }
    
    startRecording() {
        startTime = Date.now();
        
        if (mediaRecorder) {
            
            if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            
            if (mediaRecorder && mediaRecorder.state === 'paused') {
                mediaRecorder.resume();
                return;
            }
            
            if (audioCtx && mediaRecorder && mediaRecorder.state === 'inactive') {
                mediaRecorder.start(10);
                const source = audioCtx.createMediaStreamSource(stream);
                source.connect(analyser);
                if (onStartCallback) {
                    onStartCallback();
                }
            }
        } else {
            if (navigator.mediaDevices) {
                console.log('getUserMedia supported.');
                navigator.mediaDevices.getUserMedia(constraints).then(str => {
                    
                    stream = str;
                    console.log('stream',stream)
                    
                    if (MediaRecorder.isTypeSupported(mediaOptions.mimeType)) {
                        mediaRecorder = new MediaRecorder(str, mediaOptions);
                    } else {
                        mediaRecorder = new MediaRecorder(str);
                    }
                    
                    if (onStartCallback) {
                        onStartCallback();
                    }
                    
                    
                    mediaRecorder.onstop = () => this.onStop();
                    mediaRecorder.ondataavailable = e => {
                        chunks.push(e.data);
                        if (onDataCallback) {
                            onDataCallback(e.data);
                        }
                    };
                    
                    audioCtx = AudioContext.getAudioContext();
                    analyser = AudioContext.getAnalyser();
                    
                    mediaRecorder.start(10);
                    
                    const source = audioCtx.createMediaStreamSource(stream);
                    source.connect(analyser);
                    
                });
            } else {
                alert('Your browser does not support audio recording');
            }
        }
        
    }
    
    stopRecording() {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            stream.getTracks()[0].stop();
            mediaRecorder = null;
            audioCtx.suspend();
        }
    }
    
    onStop() {
        const blob = new Blob(chunks, {'type': mediaOptions.mimeType});
        chunks = [];
        
        const blobObject = {
            blob,
            startTime,
            stopTime: Date.now(),
            options: mediaOptions,
            blobURL: window.URL.createObjectURL(blob)
        };
        
        if (onStopCallback) {
            onStopCallback(blobObject);
        }
        
    }
    
}