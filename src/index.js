import ReactMicRecord from './components/ReactMicRecord';

export function browserSupportsAudio() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
        return false;
    }
    const tmp = new AudioContextClass();
    return !!tmp.createAnalyser;
    
}


export default ReactMicRecord;
