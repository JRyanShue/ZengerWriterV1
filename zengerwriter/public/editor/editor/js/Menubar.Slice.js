
import { UIPanel, UIRow } from './libs/ui.js';

import { Slice } from './API.js';

function MenubarSlice( editor ) {

	const IP = editor.IP;

	var config = editor.config;
	var strings = editor.strings;

	var container = new UIPanel();
	container.setClass( 'menu' );

	var title = new UIPanel();
	title.setClass( 'title' );
	title.setTextContent( strings.getKey( 'menubar/slice' ) );
	container.add( title );

	var options = new UIPanel();
	options.setClass( 'options' );
	container.add( options );

	// Slice
	var option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/slice/slice' ) );
	option.onClick( async function () {

		Slice( editor, IP, saveString );
		
	})
	options.add( option );

    //

    var link = document.createElement( 'a' );
	function save( blob, filename ) {

		if ( link.href ) {

			URL.revokeObjectURL( link.href );

		}

		link.href = URL.createObjectURL( blob );
		link.download = filename || 'data.json';
		link.dispatchEvent( new MouseEvent( 'click' ) );

	}

    function saveString( text, filename ) {

		save( new Blob( [ text ], { type: 'text/plain' } ), filename );

	}

    //

	return container;

}

export { MenubarSlice };
