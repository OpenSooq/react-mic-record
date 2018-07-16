export default class AudioPlayer {
    constructor(audioElem, audioContext) {
        const audioCtx = audioContext.getAudioContext();
        const analyser = audioContext.getAnalyser();
        
        this.audioSource = audioCtx.createMediaElementSource(audioElem);
        this.audioSource.connect(analyser);
        analyser.connect(audioCtx.destination);
    }
    
}