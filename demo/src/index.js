import React, {Component}          from 'react';
import { render }                  from 'react-dom';
import { ReactMicRecord, saveRecording } from '../../src';

require ('./styles.scss');

export default class Demo extends Component {
  constructor(props){
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

  onStart(){
    console.log('You can tap into the onStart callback');
  }

  onStop(blobObject){
    this.setState({
      blobURL : blobObject.blobURL
    });
  }

  render() {
    const { isRecording } = this.state;
    
    return(
        <div>
           <ReactMicRecord
            className="oscilloscope"
            record={this.state.record}
            backgroundColor="#2885c7"
            audioBitsPerSecond= {128000}
            onStop={(blobObject)=>this.onStop(blobObject)}
            onStart={()=>this.onStart()}
            strokeColor="#ffffff" 
          />
          {!isRecording?
          <div>
            <button 
              className="btn"
              disabled={isRecording}
              onClick={()=>this.startRecording()}>
                Record
            </button>
            <audio ref="audioSource" controls="controls" src={this.state.blobURL}></audio>
          </div>
          :
          <div>
          <button 
          className="btn"
          disabled={!isRecording}
          onClick={()=>this.stopRecording()}>
            Send
          </button>
          <button 
            className="btn"
            disabled={!isRecording}
            onClick={()=>this.stopRecording()}>
              X Cancle
            </button>
          </div>
          }
        </div>
    );
  }
}

render(<Demo/>, document.querySelector('#demo'))
