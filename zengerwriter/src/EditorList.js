import React, { useState } from 'react';
import './App.css';
import { GetEditorPreviewUrl, GetEditors } from './API.js';
import { Preview } from './EditorPreview.js';

class GcodePreview extends React.Component {

    constructor (props) {

        // Initialize
        super(props);
        this.IP = props.IP;
        this.username = props.username;
        
        this.editorNumbers = [];

        this.previews = {};

        this.listItems = <div>Loading...</div>;

        this.state = {

            numbersList: <div></div>,
            mounted: false

        }

        // setPreview method gets passed into callbacks
        this.setPreview = function(id, name, url, gcodepreviews) {

            gcodepreviews.previews[id] = {'name': name, 'url': url};
            console.log("URL set:", gcodepreviews.previews[id])

        }

        this.enterEditor = function ( editorURL, username, editorID, editorName ) {
            window.location = "/editor/editor?editorURL=" + editorURL + "&username=" + username + "&editorID=" + editorID + "&editorName=" + editorName;
        }

        this.getEditorNumbers().then(
            response =>
            {
                
                console.log('Editor numbers pulled:', this.editorNumbers);

                // Sort editor ID's backwards to get the most recent documents first
                this.editorNumbers.sort();
                this.editorNumbers.reverse();

                // After promise has been resolved:
                var numbers = this.editorNumbers;

                // Object with preview URLs
                for (var i = 0; i < numbers.length; i++) {
                    this.previews[numbers[i]] = SetEditorPreview(this.IP, this.username, numbers[i], this);
                }

                // Wait for all editor previews to be obtained
                console.log("All promises:", Object.values(this.previews));
                Promise.all( Object.values(this.previews) ).then( (values) => {

                    // Create elements with preview URLs
                    this.listItems = numbers.map((numbers) =>

                        // set component
                        {
                            let url = "url(" + this.previews[numbers]['url'] + ")";
                            let name = this.previews[numbers]['name'];
                            return (

                                <Preview 
                                    gcodelist={this}
                                    key={numbers.toString()} 
                                    backgroundImage={url}
                                    id = {numbers}
                                    name = {name} 
                                    onClick={function(){console.log("click")}}
                                />

                            )
                        }

                    );

                    console.log('items:', this.listItems);
                    this.state = {

                        numbersList: this.listItems,
                        mounted: this.state.mounted

                    };

                    // Prevent setState before component is mounted
                    console.log('mounted?', this.state.mounted)
                    if (this.state.mounted) {

                        this.setState({
                            numbersList: this.listItems,
                            mounted: this.state.mounted
                        });

                    }
                });

            }
        );

    }

    componentDidMount() {

        this.setState({

            numbersList: this.listItems,
            mounted: true

        });

    }

    update () {
        
    }

    async getEditorNumbers() {
        
        await GetEditors(this.IP, this.username)  // API.js function to pull from S3
        .then(

            editors => {  // push S3 response into this.editorNumbers

                for (var i = 0; i < editors.length; i++) {

                    console.log(editors[i]);
                    this.editorNumbers.push(editors[i]);

                }

            }

        );
        
        return this.editorNumbers;  // Return to resolve promise

    }

    render () {

        return (
            
            <div id="EditorList">
            
                <p className="noselect">
                    Ordered by last modified
                </p>

                {this.state.numbersList}

            </div>            

        );

    }
  
}

async function SetEditorPreview( IP, User, EditorID, gcodepreviews ) {

    // Get the preview of the specified editor ID
    var url;
    url = await GetEditorPreviewUrl( IP, User, EditorID, gcodepreviews ).then(response => {

        return "OK";

    })

}

export { GcodePreview };
