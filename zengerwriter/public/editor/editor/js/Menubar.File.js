import * as THREE from '../../build/three.module.js';

import { zipSync, strToU8 } from '../../examples/jsm/libs/fflate.module.js';

import { UIPanel, UIRow, UIHorizontalRule } from './libs/ui.js';

function MenubarFile( editor ) {

	var strings = editor.strings;

	var container = new UIPanel();
	container.setClass( 'menu' );

	var title = new UIPanel();
	title.setClass( 'title' );
	title.setTextContent( strings.getKey( 'menubar/file' ) );
	container.add( title );

	var options = new UIPanel();
	options.setClass( 'options' );
	container.add( options );

	// Save

	var option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/save' ) );
	option.onClick( function () {

		// Save
		editor.signals.homeButtonClicked.dispatch();

	} );
	options.add( option );

	// // New

	// var option = new UIRow();
	// option.setClass( 'option' );
	// option.setTextContent( strings.getKey( 'menubar/file/new' ) );
	// option.onClick( function () {

	// 	if ( confirm( 'Any unsaved data will be lost. Are you sure?' ) ) {

	// 		editor.clear();

	// 	}

	// } );
	// options.add( option );

	// //

	// options.add( new UIHorizontalRule() );

	// // Import

	// var form = document.createElement( 'form' );
	// form.style.display = 'none';
	// document.body.appendChild( form );

	// var fileInput = document.createElement( 'input' );
	// fileInput.multiple = true;
	// fileInput.type = 'file';
	// fileInput.addEventListener( 'change', function () {

	// 	editor.loader.loadFiles( fileInput.files );
	// 	form.reset();

	// } );
	// form.appendChild( fileInput );

	// var option = new UIRow();
	// option.setClass( 'option' );
	// option.setTextContent( strings.getKey( 'menubar/file/import' ) );
	// option.onClick( function () {

	// 	fileInput.click();

	// } );
	// options.add( option );

	return container;

}

export { MenubarFile };
