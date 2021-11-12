
import React from 'react';
import { SaveInfo } from './API.js';
import { QueuePlateElement } from './QueuePlateElement.js'
import { PreciseID, RandomID } from './ID.js'

class QueueElement extends React.Component {

    /*
        Returns a component with the info of a queue.
    */

    constructor( props ) {
        
        super( props );
        this.key = props.key;

        this.id = props.id;
        this.name = props.name;

        this.className="queue";

        this.queuelist = props.queuelist;

        this.elements = props.elements;

        console.log("this.elements:", this.elements)

        // INFO ON ELEMENTS
        this.elementsInfo = {}

        // CALLBACK FOR SETTING INFO. Needed to change the amount of an item in the queue, because props is static. 
        this.setInfo = ( queueOrder, number ) => {

            this.elements[queueOrder]["number"] = number;

        }

        

        // Create dropdown containing this.elements
        var elementsArr = this.elementsArray();
        this.elementsDiv = elementsArr.map((element) => {

            return (

                <QueuePlateElement
                    queueOrder={elementsArr.indexOf( element )}
                    gcodelist={this}
                    key={element["plateName"]} 
                    id = {element["ID"]}  
                    rootID = {element["rootID"]}  // ID of the element
                    plateName = {element["plateName"]} 
                    number = {element["number"]}
                    setInfo = {this.setInfo} // Callback for changing number of item
                />

            )

        })

        this.state = {

            numbersList: <div></div>,
            mounted: false,
            display: "none"

        }

        this.handleClick = function () {

            // Toggle dropdown items on and off
            if (this.state.mounted) {

                console.log(this.state.display)

                if ( this.state.display == "none" ) {

                    console.log(this.state.display)

                    this.setState({

                        numbersList: this.elementsDiv,
                        mounted: true,
                        display: "block"
            
                    });

                }
                else {

                    this.setState({

                        numbersList: this.elementsDiv,
                        mounted: true,
                        display: "none"
            
                    });
                    
                }

            }

            console.log(this.elementsDiv);
            for ( var key in this.elementsDiv ) {

                var order = key; 

                console.log("ID", this.elementsDiv[key]["props"]["id"]);

                // Number can be changed
                var number;
                if (this.elementsInfo[this.elementsDiv[key]["props"]["id"]]) {
                    number = this.elementsInfo[this.elementsDiv[key]["props"]["id"]]["number"];
                }
                else {
                    number = this.elementsDiv[key]["props"]["number"];
                }
                console.log("Number", number);

                console.log("plateName", this.elementsDiv[key]["props"]["plateName"]);
                console.log("rootID", this.elementsDiv[key]["props"]["rootID"]);

            }

            this.save();

        };

        this.dragOver = (ev) => {

            ev.preventDefault();
    
        }        
          
        this.drop = (ev) => {
    
            const droppedItem = ev.dataTransfer.getData("application/json");
            if (droppedItem) {

                var newID = PreciseID();
                var plateName = JSON.parse(droppedItem)["name"];
                var rootID = JSON.parse(droppedItem)["id"].toString();

                // Update elements info
                ////////////
                this.elements[Object.keys(this.elements).length] = {
                    "ID": newID,
                    "number": "1",
                    "plateName": plateName,
                    "rootID": rootID
                };

                // Update elements with dropped item's data
                this.elementsDiv.push(

                    <QueuePlateElement 
                        queueOrder={Object.keys(this.elementsDiv).length}
                        gcodelist={this}
                        key={plateName.toString()} 
                        id = {newID}  // Completely unique ID
                        rootID = {rootID}  // ID of the element
                        plateName = {plateName} 
                        number = "1"
                        setInfo = {this.setInfo} // Callback for changing number of item
                    />

                )

                // Update internal state
                this.setState({

                    numbersList: this.elementsDiv

                })

            }
    
        }

        this.startDrag = ( ev ) => {

            let transferObject = {
                "queueName": this.name,
                "queueID": this.id,
                "queueElements": this.elements
            };
            ev.dataTransfer.setData("application/json", JSON.stringify(transferObject));
    
        }

        
        
    }

    elementsArray() {
        // Convert elements object to array of same order
        var elementsArr = [];
        for (var element in this.elements) {

            elementsArr.push(this.elements[element]);

        }
        return elementsArr;
    }


    componentDidMount() {

        this.setState({

            numbersList: this.elementsDiv,
            mounted: true,
            display: "none"

        });

        // Use vanilla JS to control textField
        var titleField = document.getElementById("titleField" + this.id);
        titleField.innerHTML = this.name;

    }

    save() {

        // Convert all necessary data into JSON
        var queueData = {};
        var data = {};

        for ( var key in this.elementsDiv ) {

            var order = key; 

            var ID = this.elementsDiv[key]["props"]["id"];

            // Number can be changed
            var number;
            if (this.elementsInfo[this.elementsDiv[key]["props"]["id"]]) {
                number = this.elementsInfo[this.elementsDiv[key]["props"]["id"]]["number"];
            }
            else {
                number = this.elementsDiv[key]["props"]["number"];
            }

            var plateName = this.elementsDiv[key]["props"]["plateName"];
            var rootID = this.elementsDiv[key]["props"]["rootID"];

            // add to data
            queueData[order] = {
                "ID": ID,
                "number": number,
                "plateName": plateName,
                "rootID": rootID
            }

        }

        data = {
            "name": this.name,
            "id": this.id,
            "queues": queueData
        }
    
        // console.log( "IP:", this.queuelist.IP )
        SaveInfo( data, this.queuelist.username, this.id, this.queuelist.IP );
        // console.log("SAVING:", this);
    }

    

    render() {

        return( 

            <div>

                <div draggable onDragStart={this.startDrag} onDragOver={this.dragOver} onDrop={this.drop} className="queue-box" onClick={this.handleClick.bind(this)}>
                    <div 
                        className={this.className}
                        key={this.key}
                    >
                        <div id={"titleField" + this.id}></div>
                        {/* <i className="arrow" style={{marginBottom: "5px", right: "10px"}}></i> */}
                    </div>
                    {/* <div className="arrow" style={{marginBottom: "5px", right: "10px"}}></div> */}
                </div>

                <div style={{display: this.state.display}}>
                    {this.state.numbersList}
                </div>

            </div>
            
            
        )

    }

}

export { QueueElement }