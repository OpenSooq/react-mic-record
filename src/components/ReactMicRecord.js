import React, {Component} from 'react';
import MicrophoneRecorder from '../libs/MicrophoneRecorder';
import AudioContext from '../libs/AudioContext';
import AudioPlayer from '../libs/AudioPlayer';
import Visualizer from '../libs/Visualizer';


export default class ReactMicRecord extends Component {
    
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
        this.state = {
            analyser: null,
            microphoneRecorder: null,
            canvas: null,
            canvasCtx: null
        }
    }
    
    componentDidMount() {
        const {onStop, onStart, onData, audioElem, audioBitsPerSecond, mimeType} = this.props;
        const canvas = this.visualizer;
        const canvasCtx = canvas.getContext("2d");
        const options = {
            audioBitsPerSecond: audioBitsPerSecond,
            mimeType: mimeType
        };
        
        if (audioElem) {
            const analyser = AudioContext.getAnalyser();
            
            AudioPlayer.create(audioElem);
            
            this.setState({
                analyser,
                canvas,
                canvasCtx
            }, () => {
                this.visualize();
            });
        } else {
            const analyser = AudioContext.getAnalyser();
            
            this.setState({
                analyser,
                microphoneRecorder: new MicrophoneRecorder(onStart, onStop, onData, options),
                canvas,
                canvasCtx
            }, () => {
                this.visualize();
            });
        }
        
    }
    
    componentWillUnmount() {
        const {microphoneRecorder} = this.state;
        if (microphoneRecorder) {
            microphoneRecorder.stopRecording();
            this.clear();
        }
    }
    
    visualize() {
        const {backgroundColor, strokeColor, width, height, visualSetting} = this.props;
        const {canvas, canvasCtx, analyser} = this.state;
        
        if (visualSetting === 'sinewave') {
            Visualizer.visualizeSineWave(analyser, canvasCtx, canvas, width, height, backgroundColor, strokeColor);
            
        } else if (visualSetting === 'frequencyBars') {
            Visualizer.visualizeFrequencyBars(analyser, canvasCtx, canvas, width, height, backgroundColor, strokeColor);
        }
    }
    
    clear() {
        const {canvasCtx, width, height} = this.state;
        canvasCtx.clearRect(0, 0, width, height);
    }
    
    render() {
        const {record, width, height, className} = this.props;
        const {microphoneRecorder} = this.state;
        
        if (record) {
            if (microphoneRecorder) {
                microphoneRecorder.startRecording();
            }
        } else {
            if (microphoneRecorder) {
                microphoneRecorder.stopRecording();
                this.clear();
            }
        }
        
        return <canvas ref={c => this.visualizer = c} height={height} width={width} className={className}/>;
    }
}
