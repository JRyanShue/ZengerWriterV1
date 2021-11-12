import React from 'react';
import './App.css';
import { GcodePreview } from './EditorList.js';
import { EditorHeader } from './EditorHeader.js';


class Prepare extends React.Component {

  constructor( props ) {

    super(props);
    this.IP = props.serverIP;
    this.username = props.username;

  }

  render() {

    return (
      
      <div>

        <EditorHeader IP={this.IP} username={this.username} />
        <GcodePreview IP={this.IP} username={this.username} />

      </div>

    );

  }
  

}

export default Prepare;
