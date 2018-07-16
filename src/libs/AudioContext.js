export default class AudioContext {
    
    constructor() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioCtx.createAnalyser();
    }
    
    
    getAudioContext() {
        return this.audioCtx;
    }
    
    getAnalyser() {
        return this.analyser;
    }
    
}
