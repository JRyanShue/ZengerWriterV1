import React from 'react';
import './App.css';
import { GcodePreview } from './EditorList.js';
import { QueueHeader } from './QueueHeader.js';
import { QueueList } from './QueueList.js';

class Queue extends React.Component {

  constructor( props ) {

    super(props);
    this.IP = props.serverIP;
    this.username = props.username;

  }

  render() {

    return (
      
      <div>

        {/*  QueueList is a child of QueueHeader so that QueueHeader can modify QueueList */}
        <QueueHeader IP={this.IP} username={this.username} />
        

      </div>

    );

  }
  

}

export default Queue;
