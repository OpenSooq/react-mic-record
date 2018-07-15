import React, {Component} from 'react';
import {render} from 'react-dom';
import {ReactMicRecord, saveRecording} from '../../src';

require('./styles.scss');

export default class Demo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            record: false,
            blobObject: null,
            isRecording: false
        }
    }
    
    startRecording() {
        this.setState({
            record: true,
            isRecording: true
        });
    }
    
    stopRecording() {
        this.setState({
            record: false,
            isRecording: false
        });
    }
    
    onStart() {
        console.log('You can tap into the onStart callback');
    }
    
    onStop(blobObject) {
        this.setState({
            blobURL: blobObject.blobURL
        });
    }
    
    render() {
        const {isRecording, blobURL} = this.state;
        
        return (
            <React.Fragment>
                <ReactMicRecord
                    className="oscilloscope"
                    record={this.state.record}
                    backgroundColor="#2885c7"
                    audioBitsPerSecond={128000}
                    onStop={blobObject => this.onStop(blobObject)}
                    onStart={() => this.onStart()}
                    strokeColor="#ffffff"
                />
                {!isRecording ?
                    <React.Fragment>
                        <button
                            className="btn"
                            disabled={isRecording}
                            onClick={() => this.startRecording()}>
                            Record
                        </button>
                        <audio ref="audioSource" controls="controls" src={blobURL}/>
                    </React.Fragment>
                    :
                    <div>
                        <button
                            className="btn"
                            disabled={!isRecording}
                            onClick={() => this.stopRecording()}>
                            Send
                        </button>
                        <button
                            className="btn"
                            disabled={!isRecording}
                            onClick={() => this.stopRecording()}>
                            Cancel
                        </button>
                    </div>
                }
            </React.Fragment>
        );
    }
}

render(<Demo/>, document.querySelector('#demo'))
