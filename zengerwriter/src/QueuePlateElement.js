
import React from 'react';
import { GetEditorData, GetEditorURL } from './API.js';

class QueuePlateElement extends React.Component {

    /*
        Returns a component with the info of a queue.
    */

    constructor( props ) {
        
        super( props );
        this.key = props.key;

        this.id = props.id;

        this.queueOrder = props.queueOrder;

        // console.log("IDID:", this.id)

        if (props.name){

            this.name = props.name;

        }

        // Separate number from plate name
        this.number = props.number;
        this.plateName = props.plateName;

        // console.log("NUMBER:", this.number, " PlateName:", this.plateName);

        this.className = "queue";

        this.queuelist = props.queuelist;

        this.setInfo = props.setInfo;

        console.log("SETINFO:", this.setInfo)

        this.handleClick = () => {

            // console.log("queue plate clicked.");

        };

        this.onChange = () => {

            // console.log("newvalue", document.getElementById("queueText" + this.id).value)
            this.setInfo( this.queueOrder, document.getElementById("queueText" + this.id).value );

        }
        
    }

    componentDidMount() {

        // Use vanilla JS to control textField
        var textField = document.getElementById("queueText" + this.id);
        textField.value = this.number;
        textField.addEventListener( "change", () => {

			this.onChange();

		})

    }

    render() {

        return( 

            <div className="queue-box" onClick={this.handleClick.bind(this)}>
                <input id={"queueText" + this.id} type="text" defaultValue />
                <div className="queue-input">
                    <div className="noselect">
                        {this.plateName}
                    </div>
                </div>
            </div>
            
        )

    }

}

export { QueuePlateElement }