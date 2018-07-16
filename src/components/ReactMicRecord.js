import React from 'react';
import MicrophoneRecorder from '../libs/MicrophoneRecorder';
import AudioContext from '../libs/AudioContext';
import AudioPlayer from '../libs/AudioPlayer';
import Visualizer from '../libs/Visualizer';

function isBrowserSupported() {
    return window.AudioContext || window.webkitAudioContext;
}


export default class ReactMicRecord extends React.Component {
    
    static defaultProps = {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        strokeColor: '#000000',
        className: 'visualizer',
        audioBitsPerSecond: 128000,
        mimeType: 'audio/webm;codecs=opus',
        record: false,
        width: 640,
        height: 100,
        visualSetting: 'sinewave'
    };
    
    constructor(props) {
        super(props);
        this.audioContext = null;
        this.microphoneRecorder = null;
        this.state = {
            canvas: null,
            canvasCtx: null
        }
    }
    
    componentDidMount() {
        if (!isBrowserSupported()) {
            return;
        }
        const {onStop, onStart, onData, audioElem, audioBitsPerSecond, mimeType} = this.props;
        const canvas = this.visualizerRef;
        const canvasCtx = canvas.getContext("2d");
        const options = {audioBitsPerSecond, mimeType};
        
        this.audioContext = new AudioContext();
        
        if (audioElem) {
            this.audioPlayer = new AudioPlayer(audioElem, this.audioContext);
        } else {
            this.microphoneRecorder = new MicrophoneRecorder(onStart, onStop, onData, options, this.audioContext);
        }
        
        this.setState({canvas, canvasCtx}, () => this.visualize());
    }
    
    componentWillUnmount() {
        if (this.microphoneRecorder) {
            this.microphoneRecorder.unMount();
            this.clear();
        }
    }
    
    visualize() {
        const {backgroundColor, strokeColor, width, height, visualSetting} = this.props;
        const {canvas, canvasCtx} = this.state;
        
        this.visualizer = new Visualizer(this.audioContext, canvasCtx, canvas, width, height, backgroundColor, strokeColor);
        
        if (visualSetting === 'sinewave') {
            this.visualizer.visualizeSineWave();
            
        } else if (visualSetting === 'frequencyBars') {
            this.visualizer.visualizeFrequencyBars();
        }
    }
    
    clear() {
        const {canvasCtx, width, height} = this.state;
        canvasCtx.clearRect(0, 0, width, height);
    }
    
    render() {
        if (!isBrowserSupported()) {
            console.log('Browser not supported');
            return null;
        }
        const {record, width, height, className} = this.props;
        
        if (record) {
            if (this.microphoneRecorder) {
                this.microphoneRecorder.startRecording();
                this.visualize();
            }
        } else {
            if (this.microphoneRecorder) {
                this.microphoneRecorder.stopRecording();
                this.clear();
            }
        }
        
        return <canvas ref={c => this.visualizerRef = c} height={height} width={width} className={className}/>;
    }
}
