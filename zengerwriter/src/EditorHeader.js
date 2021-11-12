import React from 'react';
import './App.css';
import { SetEditorURL } from './API.js';
import { CreateID } from './ID.js';
// import { NewEditorButton } from './NewEditorButton.js';

class EditorHeader extends React.Component {

    constructor (props) {

        // Initialize
        super(props);
        this.IP = props.IP;
        this.username = props.username;

        this.editorName = "Untitled Plate"

        this.setURL = function( editorURL ) {
            this.editorURL = editorURL;
        }

        var username = this.username;
        var IP = this.IP;

        // New, blank, editor
        this.newEditor = function() {
            
            // Create new ID
            var editorID = CreateID();

            // Get standard editor template URL
            SetEditorURL( username, IP, editorID, this.setURL.bind(this) )
            .then( () => { 

                console.log("URL::", this.editorURL)
                window.location = "/editor/editor?editorURL=" + this.editorURL + "&username=" + this.username + "&editorID=" + editorID + "&editorName=" + this.editorName;
                
            } );

        }

    }

    componentDidMount() {

        this.setState({

            numbersList: this.listItems,
            mounted: true

        });

    }

    render () {

        return (

            <div id="EditorHeader">

                <div className="neweditorlabel">
                    <p className="noselect">
                        Prepare Models
                    </p>
                </div>
                <div className="neweditorbutton" onClick={this.newEditor.bind(this)}>
                    <p className="noselect">
                        +
                    </p>
                </div>

            </div>

        );

    }
  
}

export { EditorHeader };
