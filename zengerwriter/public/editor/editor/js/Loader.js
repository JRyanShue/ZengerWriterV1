import * as THREE from '../../build/three.module.js';

import { TGALoader } from '../../examples/jsm/loaders/TGALoader.js';

import { AddObjectCommand } from './commands/AddObjectCommand.js';

import { LoaderUtils } from './LoaderUtils.js';

function Loader( editor ) {

	var scope = this;

	this.texturePath = '';

	this.loadItemList = function ( items ) {

		LoaderUtils.getFilesFromItemList( items, function ( files, filesMap ) {

			scope.loadFiles( files, filesMap );

		} );

	};

	this.loadFiles = function ( files, filesMap ) {

		if ( files.length > 0 ) {

			var filesMap = filesMap || LoaderUtils.createFilesMap( files ); // gets the first truthy value to make map of files

			var manager = new THREE.LoadingManager();
			manager.setURLModifier( function ( url ) {

				url = url.replace( /^(\.?\/)/, '' ); // remove './' // ^: global search, n?: zero or one of n, .: single character

				var file = filesMap[ url ];

				if ( file ) {

					console.log( 'Loading', url );

					return URL.createObjectURL( file );

				}

				return url;

			} );

			manager.addHandler( /\.tga$/i, new TGALoader() );

			for ( var i = 0; i < files.length; i ++ ) {

				scope.loadFile( files[ i ], manager );

			}

		}

	};

	this.loadFile = function ( file, manager ) {

		var filename = file.name;
		var extension = filename.split( '.' ).pop().toLowerCase();

		var reader = new FileReader();
		reader.addEventListener( 'progress', function ( event ) {

			var size = '(' + Math.floor( event.total / 1000 ).format() + ' KB)';
			var progress = Math.floor( ( event.loaded / event.total ) * 100 ) + '%';

			console.log( 'Loading', filename, size, progress );

		} );

		switch ( extension ) {

			case '3mf':

				reader.addEventListener( 'load', async function ( event ) {

					var { ThreeMFLoader } = await import( '../../examples/jsm/loaders/3MFLoader.js' );

					var loader = new ThreeMFLoader();
					var object = loader.parse( event.target.result );

					editor.execute( new AddObjectCommand( editor, object ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			case 'obj':

				reader.addEventListener( 'load', async function ( event ) {

					var contents = event.target.result;

					var { OBJLoader } = await import( '../../examples/jsm/loaders/OBJLoader.js' );

					var object = new OBJLoader().parse( contents );
					object.name = filename;

					editor.execute( new AddObjectCommand( editor, object ) );

				}, false );
				reader.readAsText( file );

				break;

			case 'stl':

				reader.addEventListener( 'load', async function ( event ) {

					var contents = event.target.result;
					console.log("Finished Loading.");

					var { STLLoader } = await import( '../../examples/jsm/loaders/STLLoader.js' );

					var geometry = new STLLoader().parse( contents );
					var material = new THREE.MeshStandardMaterial();

					var mesh = new THREE.Mesh( geometry, material );
					mesh.name = filename;
					console.log("Created Mesh.");

					editor.execute( new AddObjectCommand( editor, mesh ) );

				}, false );

				// Below blocks are not called if above block is successful. 
				if ( reader.readAsBinaryString !== undefined ) {

					console.log("reading as binary string");
					reader.readAsBinaryString( file );

				} else {

					console.log("reading as array buffer");
					reader.readAsArrayBuffer( file );

				}

				break;

		}

	};

}

export { Loader };