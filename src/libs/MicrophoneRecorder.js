const constraints = {audio: true, video: false}; // constraints - only audio needed

export default class MicrophoneRecorder {
    constructor(onStart, onStop, onData, options, audioContext) {
        
        navigator.getUserMedia = (navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);
        
        this.audioCtx = audioContext.getAudioContext();
        this.analyser = audioContext.getAnalyser();
        this.stream = null;
        this.onStartCb = onStart;
        this.onStopCb = onStop;
        this.mediaOptions = options;
        this.onData = onData;
        this.chunks = [];
        this.startTime = null;
    }
    
    startRecording() {
        this.startTime = Date.now();
        
        if (this.mediaRecorder) {
            
            if (this.audioCtx && this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }
            
            if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
                this.mediaRecorder.resume();
                return;
            }
            
            if (this.audioCtx && this.mediaRecorder && this.mediaRecorder.state === 'inactive') {
                this.mediaRecorder.start(10);
                const source = this.audioCtx.createMediaStreamSource(this.stream);
                source.connect(this.analyser);
                if (this.onStartCb) {
                    this.onStartCb();
                }
            }
        } else {
            if (navigator.mediaDevices) {
                console.log('getUserMedia supported.');
                navigator.mediaDevices.getUserMedia(constraints).then(str => {
                    
                    this.stream = str;
                    
                    if (MediaRecorder.isTypeSupported(this.mediaOptions.mimeType)) {
                        this.mediaRecorder = new MediaRecorder(this.stream, this.mediaOptions);
                    } else {
                        this.mediaRecorder = new MediaRecorder(this.stream);
                    }
                    
                    if (this.onStartCb) {
                        this.onStartCb();
                    }
                    
                    this.mediaRecorder.onstop = () => this.onStop();
                    this.mediaRecorder.ondataavailable = e => {
                        this.chunks.push(e.data);
                        if (this.onData) {
                            this.onData(e.data);
                        }
                    };
                    
                    this.mediaRecorder.start(10);
                    
                    const source = this.audioCtx.createMediaStreamSource(this.stream);
                    source.connect(this.analyser);
                    
                });
            } else {
                alert('Your browser does not support audio recording');
            }
        }
        
    }
    
    stopRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
            this.audioCtx.suspend();
        }
    }
    
    unMount() {
        this.stream && this.stream.getTracks()[0].stop();
        this.mediaRecorder = null;
    }
    
    onStop() {
        const blob = new Blob(this.chunks, {'type': this.mediaOptions.mimeType});
        this.chunks = [];
        
        const blobObject = {
            blob,
            startTime: this.startTime,
            stopTime: Date.now(),
            options: this.mediaOptions,
            blobURL: window.URL.createObjectURL(blob)
        };
        
        if (this.onStopCb) {
            this.onStopCb(blobObject);
        }
        
    }
    
}