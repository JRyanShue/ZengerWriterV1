
import { CreateID } from './libs/ID.js';

const api_port = ":8080";

async function SetEditorInfo ( editor ) {  // Get/set info of editor, including name and settings

    var headers = new Headers();
    headers.append('path', 'Users/' + editor.username + '/projects/' + editor.editorID + '/info.json');
    headers.append('Content-Type', 'application/json');

    const response = await fetch( 'http://' + editor.IP + api_port + '/get_info', {

        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: headers,
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url

    }).then(

        (response) => response.json()

    ).then(

        data => {

            // Set editor info
            for (var item in data) {
                editor.editorInfo[item] = data[item]
            }
            
            return "OK"

        }

    );

}

async function Save ( editor ) {  // Saves editor to cloud

    var data = editor.toJSON();

    // Headers
    var headers = new Headers(); 
    headers.append('path', 'Users/' + editor.username + '/projects/' + editor.editorID + '/editor.json');
    headers.append('isfile', 'false');
    headers.append('Content-Type', 'application/json');

    const response = await fetch( 'http://' + editor.IP + api_port + '/put_object', {

        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: headers,
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header

    }).then(

        (response) => { 

            console.log(response);
            editor.signals.savingFinished.dispatch();

        }

    );

}

async function Move ( origin_path, destination_path, editor ) {  // Move object from one path to another

    // Headers
    var headers = new Headers(); 
    headers.append('origin_path', origin_path);
    headers.append('destination_path', destination_path);

    console.log( "moving object from", origin_path, "to", destination_path )

    await fetch( 'http://' + editor.IP + api_port + '/move', {
        
        method: "POST",
        headers: headers,

    }).then(

        (response) => { 

            console.log(response);

        }

    );

}

async function Delete ( path, editor ) {  // Move object from one path to another

    // Headers
    var headers = new Headers(); 
    headers.append('path', path);

    await fetch( 'http://' + editor.IP + api_port + '/delete', {
        
        method: "POST",
        headers: headers,

    }).then(

        (response) => { 

            console.log(response);

        }

    );

}

// Saves file ( in blob format ) to preview path for given editor
async function SavePreview( blob, editor ) {

    // Build FormData object from data
    let formData = new FormData();
    console.log("BLOB:", blob);
    // File is appended
    formData.append( 'file', blob, "preview.png" );
    console.log("FORM:", formData);

    // Headers
    var headers = new Headers(); 
    headers.append('path', 'Users/' + editor.username + '/projects/' + editor.editorID + '/preview.png');
    headers.append('isfile', 'true');
    // headers.append('Content-Type', 'application/octet-stream');
    // headers.append('Content-Type', 'image/png');

    const response = await fetch( 'http://' + editor.IP + api_port + '/put_image', {

        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: headers,
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: formData  // JSON.stringify(data) // body data type must match "Content-Type" header

    });

}

// Saves name to json to path for given editor
// Saves to current (not new) editor ID because it will get moved later
async function SaveInfo( info_json, editor ) {

    // Headers
    var headers = new Headers(); 
    headers.append('path', 'Users/' + editor.username + '/projects/' + editor.oldID + '/info.json');
    headers.append('Content-Type', 'application/json');

    const response = await fetch( 'http://' + editor.IP + api_port + '/put_json', {

        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: headers,
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(info_json)  // JSON.stringify(data) // body data type must match "Content-Type" header

    });

}

async function Slice( editor, IP, saveString ) {

    // Use to ensure changes register
    console.log( "\(v1.1\) Slicing STL..." );

    // Generate STL blob from build plate
    var { STLExporter } = await import( '../../examples/jsm/exporters/STLExporter.js' );
    var exporter = new STLExporter();
    var buffer = exporter.parse( editor.scene, { binary: true } );
    var blob = new Blob( [ buffer ], { type: 'application/octet-stream' } );

    // Build FormData object
    let formData = new FormData();
    await buildFormData ( editor, formData, blob );
    await sliceSTL( IP, formData );
    fetchGcode( IP, saveString );

}

// Sets variable
async function GetGcode( editor, IP ) {

    // Use to ensure changes register
    console.log( "\(v1.1\) Slicing STL..." );

    // Generate STL blob from build plate
    var { STLExporter } = await import( '../../examples/jsm/exporters/STLExporter.js' );
    var exporter = new STLExporter();
    var buffer = exporter.parse( editor.scene, { binary: true } );
    var blob = new Blob( [ buffer ], { type: 'application/octet-stream' } );

    // Build FormData object
    let formData = new FormData();
    await buildFormData ( editor, formData, blob );
    await sliceSTL( IP, formData );
    await pullGcode( IP, editor );
    return "OK"

}

async function buildFormData ( editor, formData, blob ) {

    formData.append( 'stl', blob, 'modelSTL.stl' );
    formData.append( 'action', "slice" );
    formData.append( 'path', 'Users/' + editor.username + '/projects/' + editor.editorID + '/plate.gcode' );

    editor.settings.set( formData );

}

async function sliceSTL ( IP, formData ) {

    console.log("sending to put_stl:", formData)

    // Send FormData to backend for slicing
    console.log(IP);
    const response = await fetch( 'http://' + IP + api_port + '/put_stl',
    {
        method: 'POST',
        body: formData
    } );

}

// Return gcode in variable
async function pullGcode( IP, editor ) {

    await fetch( 'http://' + IP + api_port + '/get_gcode' ) // get_gcode
        .then( response => response.text() )  // use .text() because it's a gcode file, not JSON
        .then( value => {
            editor.gcode = value;
        })  // callback for handling gcode value)

}

// Return gcode in download
async function fetchGcode( IP, saveString ) {

    await fetch( 'http://' + IP + api_port + '/get_gcode' ) // get_gcode
        .then( response => response.text() )  // use .text() because it's a gcode file, not JSON
        .then( value => {
            returnGcode( value, saveString );
        })  // callback for handling gcode value)

}

function returnGcode( gcode, saveString ) {

    console.log( gcode );
    saveString( gcode, "model.gcode" );

}

export { GetGcode, SetEditorInfo, Save, Move, Delete, SavePreview, Slice, SaveInfo };