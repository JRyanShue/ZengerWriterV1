import React from 'react';
import './App.css';
// import { SliceQueue, SliceItem } from './API_Slice.js'
import { SpliceQueue } from './API.js'

class Slice extends React.Component {

  constructor( props ) {

    super(props);
    this.IP = props.serverIP;
    this.username = props.username;

    this.drop = ( ev ) => {

        const droppedItem = ev.dataTransfer.getData("application/json");
        if (droppedItem) {

            sliceItem( droppedItem, this.IP );

        }

    }

    this.dragOver = (ev) => {

        ev.preventDefault();

    }

  }

  render() {

    return (
      
      <div>

        <div className="sliceBox">
            
            <div className="sliceText">
                <p className="noselect">
                    SLICE
                </p>
            </div>
            <div id="sliceBucket" className="sliceBucket" onDragOver={this.dragOver} onDrop={this.drop}>

            </div>

        </div>        

      </div>

    );

  }
  
}

function sliceItem( item, IP ) {

    var queue = JSON.parse( item );
    console.log("Slicing queue:", queue);

    // Create an array of pure elements to slice
    var queueArr = []
    for ( var index in queue["queueElements"] ) {

        var element = queue["queueElements"][index];
        console.log("Slicing item:", element);
        queueArr.push( element );

    }
    // SliceQueue( JSON.stringify( queueArr ) );

    var jsonQueue = JSON.stringify( {
        "queue": queueArr
    } )

    SpliceQueue( jsonQueue, IP );

}

export default Slice;
