function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
    } : null;
}

export default class Visualizer {
    
    constructor(audioContext, canvasCtx, canvas, width, height, backgroundColor, strokeColor) {
        this.analyser = audioContext.getAnalyser();
        this.canvasCtx = canvasCtx;
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.backgroundColor = backgroundColor;
        this.strokeColor = strokeColor;
        this.drawVisual = null;
    }
    
    
    visualizeSineWave() {
        this.analyser.fftSize = 2048;
        
        const bufferLength = this.analyser.fftSize;
        const dataArray = new Uint8Array(bufferLength);
        
        this.canvasCtx.clearRect(0, 0, this.width, this.height);
        
        const draw = () => {
            this.drawVisual = requestAnimationFrame(draw);
            
            this.analyser.getByteTimeDomainData(dataArray);
            
            this.canvasCtx.fillStyle = this.backgroundColor;
            this.canvasCtx.fillRect(0, 0, this.width, this.height);
            
            this.canvasCtx.lineWidth = 2;
            this.canvasCtx.strokeStyle = this.strokeColor;
            
            this.canvasCtx.beginPath();
            
            const sliceWidth = this.width * 1.0 / bufferLength;
            let x = 0;
            
            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = v * this.height / 2;
                
                if (i === 0) {
                    this.canvasCtx.moveTo(x, y);
                } else {
                    this.canvasCtx.lineTo(x, y);
                }
                
                x += sliceWidth;
            }
            
            this.canvasCtx.lineTo(this.canvas.width, this.canvas.height / 2);
            this.canvasCtx.stroke();
        };
        
        draw();
    }
    
    visualizeFrequencyBars() {
        this.analyser.fftSize = 256;
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        this.canvasCtx.clearRect(0, 0, this.width, this.height);
        
        const draw = () => {
            this.drawVisual = requestAnimationFrame(draw);
            
            this.analyser.getByteFrequencyData(dataArray);
            
            this.canvasCtx.fillStyle = this.backgroundColor;
            this.canvasCtx.fillRect(0, 0, this.width, this.height);
            
            const barWidth = (this.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;
            
            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i];
                
                const rgb = hexToRgb(this.strokeColor);
                
                this.canvasCtx.fillStyle = this.strokeColor;
                this.canvasCtx.fillRect(x, this.height - barHeight / 2, barWidth, barHeight / 2);
                
                x += barWidth + 1;
            }
        };
        
        draw();
    }
    
}
