import * as THREE from '../../build/three.module.js';

import { TransformControls } from '../../examples/jsm/controls/TransformControls.js';

import { UIPanel } from './libs/ui.js';

import { EditorControls } from './EditorControls.js';

// import { ViewportCamera } from './Viewport.Camera.js';
// import { ViewportInfo } from './Viewport.Info.js';
import { ViewHelper } from './Viewport.ViewHelper.js';
import { VR } from './Viewport.VR.js';

import { SetPositionCommand } from './commands/SetPositionCommand.js';
import { SetRotationCommand } from './commands/SetRotationCommand.js';
import { SetScaleCommand } from './commands/SetScaleCommand.js';

import { SnapDown } from './ObjectUtils.js';

import { RoomEnvironment } from '../../examples/jsm/environments/RoomEnvironment.js';

import { SavePreview, GetGcode } from './API.js';

import { ViewSelection } from './ViewSelection.js';

import { AddObjectCommand } from './commands/AddObjectCommand.js';
import { RemoveObjectCommand } from './commands/RemoveObjectCommand.js';

// import { SidebarProjectRenderer } from './Sidebar.Project.Renderer.js';

function Viewport( editor, size, height ) {

	var signals = editor.signals;

	var container = new UIPanel();
	container.setId( 'viewport' );
	container.setPosition( 'absolute' );

	// container.add( new ViewportCamera( editor ) );
	// container.add( new ViewportInfo( editor ) );

	// Size of build plate x and y in mm
	var sidelen = size;
	var buildheight = height;

	//

	var renderer = null;
	var pmremGenerator = null;

	var camera = editor.camera;
	var scene = editor.scene;
	var sceneHelpers = editor.sceneHelpers;
	var showSceneHelpers = true;

	var objects = [];

	// helpers

	var grid = new THREE.Group();

	var grid1 = new THREE.GridHelper( sidelen, sidelen/10, 0x888888 );
	grid1.rotateX(Math.PI / 2);  // Follow coordinate convention
	grid1.material.color.setHex( 0x888888 );
	grid1.material.vertexColors = false;
	grid.add( grid1 );

	var grid2 = new THREE.GridHelper( sidelen, sidelen/10, 0x222222 );
	grid2.rotateX(Math.PI / 2);  // Follow coordinate convention
	grid2.material.color.setHex( 0x222222 );
	grid2.material.depthFunc = THREE.AlwaysDepth;
	grid2.material.vertexColors = false;
	grid.add( grid2 );

	// Build volume box
	const mesh = new THREE.Mesh(
		new THREE.BoxGeometry( sidelen, sidelen, buildheight ),
		new THREE.MeshBasicMaterial()
	);

	mesh.translateZ(buildheight/2);

	var volBox = new THREE.BoxHelper( mesh, 0x121e6b );

	grid.add( volBox );

	var viewHelper = new ViewHelper( camera, container );
	var vr = new VR( editor );

	//

	var box = new THREE.Box3();

	var selectionBox = new THREE.BoxHelper();
	selectionBox.material.depthTest = false;
	selectionBox.material.transparent = true;
	selectionBox.visible = false;
	sceneHelpers.add( selectionBox );

	var objectPositionOnDown = null;
	var objectRotationOnDown = null;
	var objectScaleOnDown = null;

	var transformControls = new TransformControls( camera, container.dom );
	transformControls.addEventListener( 'change', function () {

		var object = transformControls.object;

		if ( object !== undefined ) {

			selectionBox.setFromObject( object );

			var helper = editor.helpers[ object.id ];

			if ( helper !== undefined && helper.isSkeletonHelper !== true ) {

				helper.update();

			}

			signals.refreshSidebarObject3D.dispatch( object );

		}

		render();

	} );
	transformControls.addEventListener( 'mouseDown', function () {

		var object = transformControls.object;

		objectPositionOnDown = object.position.clone();
		objectRotationOnDown = object.rotation.clone();
		objectScaleOnDown = object.scale.clone();

		controls.enabled = false;

	} );
	transformControls.addEventListener( 'mouseUp', function () {

		var object = transformControls.object;

		if ( object !== undefined ) {

			switch ( transformControls.getMode() ) {

				case 'translate':

					if ( ! objectPositionOnDown.equals( object.position ) ) {

						editor.execute( new SetPositionCommand( editor, object, object.position, objectPositionOnDown ) );

					}

					break;

				case 'rotate':

					if ( ! objectRotationOnDown.equals( object.rotation ) ) {

						editor.execute( new SetRotationCommand( editor, object, object.rotation, objectRotationOnDown ) );

					}

					break;

				case 'scale':

					if ( ! objectScaleOnDown.equals( object.scale ) ) {

						editor.execute( new SetScaleCommand( editor, object, object.scale, objectScaleOnDown ) );

					}

					break;

			}

			// Automatically snap to build plate
			SnapDown( editor );

		}

		controls.enabled = true;

	} );

	sceneHelpers.add( transformControls );

	// object picking

	var raycaster = new THREE.Raycaster();
	var mouse = new THREE.Vector2();

	// events

	function updateAspectRatio() {

		camera.aspect = container.dom.offsetWidth / container.dom.offsetHeight;
		camera.updateProjectionMatrix();

	}

	function getIntersects( point, objects ) {

		mouse.set( ( point.x * 2 ) - 1, - ( point.y * 2 ) + 1 );

		raycaster.setFromCamera( mouse, camera );

		return raycaster.intersectObjects( objects );

	}

	var onDownPosition = new THREE.Vector2();
	var onUpPosition = new THREE.Vector2();
	var onDoubleClickPosition = new THREE.Vector2();

	function getMousePosition( dom, x, y ) {

		var rect = dom.getBoundingClientRect();
		return [ ( x - rect.left ) / rect.width, ( y - rect.top ) / rect.height ];

	}

	function handleClick() {

		if ( onDownPosition.distanceTo( onUpPosition ) === 0 ) {

			var intersects = getIntersects( onUpPosition, objects );

			if ( intersects.length > 0 ) {

				var object = intersects[ 0 ].object;

				if ( object.userData.object !== undefined ) {

					// helper

					editor.select( object.userData.object );

				} else {

					editor.select( object );

				}

			} else {

				editor.select( null );

			}

			render();

		}

	}

	function onMouseDown( event ) {

		// event.preventDefault();

		var array = getMousePosition( container.dom, event.clientX, event.clientY );
		onDownPosition.fromArray( array );

		document.addEventListener( 'mouseup', onMouseUp, false );

	}

	function onMouseUp( event ) {

		var array = getMousePosition( container.dom, event.clientX, event.clientY );
		onUpPosition.fromArray( array );

		handleClick();

		document.removeEventListener( 'mouseup', onMouseUp, false );

	}

	function onTouchStart( event ) {

		var touch = event.changedTouches[ 0 ];

		var array = getMousePosition( container.dom, touch.clientX, touch.clientY );
		onDownPosition.fromArray( array );

		document.addEventListener( 'touchend', onTouchEnd, false );

	}

	function onTouchEnd( event ) {

		var touch = event.changedTouches[ 0 ];

		var array = getMousePosition( container.dom, touch.clientX, touch.clientY );
		onUpPosition.fromArray( array );

		handleClick();

		document.removeEventListener( 'touchend', onTouchEnd, false );

	}

	function onDoubleClick( event ) {

		var array = getMousePosition( container.dom, event.clientX, event.clientY );
		onDoubleClickPosition.fromArray( array );

		var intersects = getIntersects( onDoubleClickPosition, objects );

		if ( intersects.length > 0 ) {

			var intersect = intersects[ 0 ];

			signals.objectFocused.dispatch( intersect.object );

		}

	}

	container.dom.addEventListener( 'mousedown', onMouseDown, false );
	container.dom.addEventListener( 'touchstart', onTouchStart, false );
	container.dom.addEventListener( 'dblclick', onDoubleClick, false );

	// controls need to be added *after* main logic,
	// otherwise controls.enabled doesn't work.

	var controls = new EditorControls( camera, container.dom );
	controls.addEventListener( 'change', function () {

		signals.cameraChanged.dispatch( camera );
		signals.refreshSidebarObject3D.dispatch( camera );

	} );
	viewHelper.controls = controls;

	// signals

	// Toggle editor on/off with the ViewSelection controls

	signals.partView.add( () => {

		editor.viewMode = 'Part';
		container.dom.style.display = 'block';

		removeLayerView( editor ); 
		addObjects( editor ); 

	} )
	signals.layerView.add( async function() {

		// Switch to layer view
		if ( editor.viewMode = 'Part' ) {

			editor.viewMode = 'Layer';

			await addLayerView( editor );
			removeObjects( editor );
			
			render();

		}

	} )

	
	async function addLayerView( editor ) {

		// Slice into editor.gcode
		await GetGcode( editor, editor.IP );

		// Parse
		editor.gcodelines = editor.gcode.split( '\n' );
		console.log( "Parsing gcode..." );
		var layer = []; 
		// var lastLoc = editor.gcodelines[0];

		// Initialize z
		var zVal = editor.settings.dict["quality"]["initial_layer_height"] || 0.2;

		

		for ( var index in editor.gcodelines ) {  // .slice( 1 )

			var currentLine = editor.gcodelines[ index ];

			// Extrusion commands. Assume lines are equal width
			if ( currentLine.includes(" E") ) {

				var xVal = getXVal( currentLine );
				var yVal = getYVal( currentLine );
				
				layer.push( new THREE.Vector3( xVal - sidelen/2, yVal - sidelen/2, zVal ) );		
				
			}
			// if layer is done (signaled by a change in z), flush the layer into the scene. 
			else if ( currentLine.includes(" Z") && !currentLine.includes(";") ) {

				zVal += editor.settings.dict["quality"]["layer_height"];

				// Add z lift
				var xVal = getXVal( currentLine );
				var yVal = getYVal( currentLine );
				
				layer.push( new THREE.Vector3( xVal - sidelen/2, yVal - sidelen/2, zVal ) );	

				// Must have new material each time to edit layers individually
				var material = new THREE.LineBasicMaterial( { color: 0x0000ff, transparent: true, opacity: editor.layerOpacity } );
				var geometry = new THREE.BufferGeometry( { boundingSphere: null } ).setFromPoints( layer );
				var line = new THREE.Line( geometry, material );

				console.log( line )
				editor.layers.push( line );
				editor.scene.add( line );
				
				layer = [];
				
			}

		}

		// Remove first layer ( it is the line on the side )
		editor.layers.splice( 0, 1 )

		render();
		signals.gcodeLoaded.dispatch();
		console.log( editor.layers );

	}


	function getXVal( line ) {

		var xIndex = line.indexOf( "X" )
		var firstSpaceIndex = xIndex + line.slice( xIndex ).indexOf( " " )
		return line.slice( xIndex + 1, firstSpaceIndex );

	}
	function getYVal( line ) {

		var yIndex = line.indexOf( "Y" )
		var firstSpaceIndex = yIndex + line.slice( yIndex ).indexOf( " " )
		return line.slice( yIndex + 1, firstSpaceIndex );

	}


	function removeLayerView( editor ) {

		var removeObjects = [];
		editor.scene.traverse( ( object ) => {

			if ( object.type == "Line" ) {

				removeObjects.push( object );

			}
			
		} )
		for ( var index in removeObjects ) {

			editor.removeObject(removeObjects[ index ] );

		}
		editor.layers = [];
		render();

	}


	function addObjects( editor ) {

		// Add back all objects in part view
		for ( var index in editor.parts ) {

			editor.execute( new AddObjectCommand( editor, editor.parts[ index ] ) );

		}
		editor.deselect();

	}


	// Remove objects and save them to add back later. 
	function removeObjects( editor ) {

		var removeObjects = [];
		editor.scene.traverse( ( object ) => {

			if ( object.type == "Mesh" ) {

				editor.parts.push( object );

				removeObjects.push( object );

			}
			
		} )
		for ( var index in removeObjects ) {

			removeObjects[ index ].geometry.dispose();
			removeObjects[ index ].material.dispose();

			editor.execute( new RemoveObjectCommand( editor, removeObjects[ index ] ) );

		}

	}


	// For saving image

	signals.save.add( function () {

		// var strDownloadMime = "image/octet-stream";  // For downloading image directly (good for testing)
		// var strMime = "image/png"; // jpeg

		// var saveFile = function (strData, filename) {
		// 	var link = document.createElement('a');
		// 	if (typeof link.download === 'string') {
		// 		document.body.appendChild(link); //Firefox requires the link to be in the body
		// 		link.download = filename;
		// 		link.href = strData;
		// 		link.click();
		// 		document.body.removeChild(link); //remove the link when done
		// 	} 
		// 	// else {
		// 	// 	location.replace(uri);
		// 	// }
		// }
		
		// var imgData;

		try {

			// Convert scene image into blob and send to REST API
			renderer.domElement.toBlob( function( blob ) {

				SavePreview( blob, editor );

			} )
			

		} catch (e) {

			console.log(e);
			return;
			
		}

	} )

	signals.editorCleared.add( function () {

		controls.center.set( 0, 0, 0 );
		render();

	} );

	signals.transformModeChanged.add( function ( mode ) {

		transformControls.setMode( mode );

	} );

	signals.snapChanged.add( function ( dist ) {

		transformControls.setTranslationSnap( dist );

	} );

	signals.spaceChanged.add( function ( space ) {

		transformControls.setSpace( space );

	} );

	signals.rendererUpdated.add( function () {

		scene.traverse( function ( child ) {

			if ( child.material !== undefined ) {

				child.material.needsUpdate = true;

			}

		} );

		render();

	} );

	signals.rendererCreated.add( function ( newRenderer ) {

		if ( renderer !== null ) {

			renderer.setAnimationLoop( null );
			renderer.dispose();
			pmremGenerator.dispose();

			container.dom.removeChild( renderer.domElement );

		}

		renderer = newRenderer;

		renderer.setAnimationLoop( animate );
		renderer.setClearColor( 0xffffff );

		if ( window.matchMedia ) {

			var mediaQuery = window.matchMedia( '(prefers-color-scheme: dark)' );
			mediaQuery.addListener( function ( event ) {

				renderer.setClearColor( event.matches ? 0x333333 : 0xffffff );
				updateGridColors( grid1, grid2, event.matches ? [ 0x222222, 0x888888 ] : [ 0x888888, 0x282828 ] );

				render();

			} );

			renderer.setClearColor( mediaQuery.matches ? 0x333333 : 0xffffff );
			updateGridColors( grid1, grid2, mediaQuery.matches ? [ 0x222222, 0x888888 ] : [ 0x888888, 0x282828 ] );

		}

		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( container.dom.offsetWidth, container.dom.offsetHeight );

		pmremGenerator = new THREE.PMREMGenerator( renderer );
		pmremGenerator.compileEquirectangularShader();

		container.dom.appendChild( renderer.domElement );

		render();

	} );

	signals.sceneGraphChanged.add( function () {

		render();

	} );

	signals.cameraChanged.add( function () {

		render();

	} );

	signals.objectSelected.add( function ( object ) {

		selectionBox.visible = false;
		transformControls.detach();

		if ( object !== null && object !== scene && object !== camera ) {

			box.setFromObject( object );

			if ( box.isEmpty() === false ) {

				selectionBox.setFromObject( object );
				selectionBox.visible = true;

			}

			transformControls.attach( object );

		}

		render();

	} );

	signals.objectFocused.add( function ( object ) {

		controls.focus( object );

	} );

	signals.geometryChanged.add( function ( object ) {

		if ( object !== undefined ) {

			selectionBox.setFromObject( object );

		}

		render();

	} );

	signals.objectAdded.add( function ( object ) {

		object.traverse( function ( child ) {

			objects.push( child );

		} );

	} );

	signals.objectChanged.add( function ( object ) {

		if ( editor.selected === object ) {

			selectionBox.setFromObject( object );

		}

		if ( object.isPerspectiveCamera ) {

			object.updateProjectionMatrix();

		}

		if ( editor.helpers[ object.id ] !== undefined ) {

			editor.helpers[ object.id ].update();

		}

		render();

	} );

	signals.objectRemoved.add( function ( object ) {

		controls.enabled = true; // see #14180
		if ( object === transformControls.object ) {

			transformControls.detach();

		}

		object.traverse( function ( child ) {

			objects.splice( objects.indexOf( child ), 1 );

		} );

	} );

	signals.helperAdded.add( function ( object ) {

		var picker = object.getObjectByName( 'picker' );

		if ( picker !== undefined ) {

			objects.push( picker );

		}

	} );

	signals.helperRemoved.add( function ( object ) {

		var picker = object.getObjectByName( 'picker' );

		if ( picker !== undefined ) {

			objects.splice( objects.indexOf( picker ), 1 );

		}

	} );

	signals.materialChanged.add( function () {

		render();

	} );

	signals.animationStopped.add( function () {

		render();

	} );

	// background

	signals.sceneBackgroundChanged.add( function ( backgroundType, backgroundColor, backgroundTexture, backgroundEquirectangularTexture ) {

		switch ( backgroundType ) {

			case 'None':

				scene.background = null;

				break;

			case 'Color':

				scene.background = new THREE.Color( backgroundColor );

				break;

			case 'Texture':

				if ( backgroundTexture ) {

					scene.background = backgroundTexture;

				}

				break;

			case 'Equirectangular':

				if ( backgroundEquirectangularTexture ) {

					backgroundEquirectangularTexture.mapping = THREE.EquirectangularReflectionMapping;
					scene.background = backgroundEquirectangularTexture;

				}

				break;

		}

		render();

	} );

	// environment

	signals.sceneEnvironmentChanged.add( function ( environmentType, environmentEquirectangularTexture ) {

		switch ( environmentType ) {

			case 'None':

				scene.environment = null;

				break;

			case 'Equirectangular':

				scene.environment = null;

				if ( environmentEquirectangularTexture ) {

					scene.environment = pmremGenerator.fromEquirectangular( environmentEquirectangularTexture ).texture;

				}

				break;

			case 'ModelViewer':

				scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture;

				break;

		}

		render();

	} );

	// fog

	signals.sceneFogChanged.add( function ( fogType, fogColor, fogNear, fogFar, fogDensity ) {

		switch ( fogType ) {

			case 'None':
				scene.fog = null;
				break;
			case 'Fog':
				scene.fog = new THREE.Fog( fogColor, fogNear, fogFar );
				break;
			case 'FogExp2':
				scene.fog = new THREE.FogExp2( fogColor, fogDensity );
				break;

		}

		render();

	} );

	signals.sceneFogSettingsChanged.add( function ( fogType, fogColor, fogNear, fogFar, fogDensity ) {

		switch ( fogType ) {

			case 'Fog':
				scene.fog.color.setHex( fogColor );
				scene.fog.near = fogNear;
				scene.fog.far = fogFar;
				break;
			case 'FogExp2':
				scene.fog.color.setHex( fogColor );
				scene.fog.density = fogDensity;
				break;

		}

		render();

	} );

	signals.viewportCameraChanged.add( function () {

		var viewportCamera = editor.viewportCamera;

		if ( viewportCamera.isPerspectiveCamera ) {

			viewportCamera.aspect = editor.camera.aspect;
			viewportCamera.projectionMatrix.copy( editor.camera.projectionMatrix );

		} else if ( viewportCamera.isOrthographicCamera ) {

			// TODO

		}

		// disable EditorControls when setting a user camera

		controls.enabled = ( viewportCamera === editor.camera );

		render();

	} );

	signals.exitedVR.add( render );

	//

	signals.windowResize.add( function () {

		updateAspectRatio();

		renderer.setSize( container.dom.offsetWidth, container.dom.offsetHeight );

		render();

	} );

	signals.showGridChanged.add( function ( showGrid ) {

		grid.visible = showGrid;
		render();

	} );

	signals.showHelpersChanged.add( function ( showHelpers ) {

		showSceneHelpers = showHelpers;
		transformControls.enabled = showHelpers;

		render();

	} );

	signals.cameraResetted.add( updateAspectRatio );

	// animations

	var clock = new THREE.Clock(); // only used for animations

	function animate() {

		var mixer = editor.mixer;
		var delta = clock.getDelta();

		var needsUpdate = false;

		if ( mixer.stats.actions.inUse > 0 ) {

			mixer.update( delta );
			needsUpdate = true;

		}

		if ( viewHelper.animating === true ) {

			viewHelper.update( delta );
			needsUpdate = true;

		}

		if ( vr.currentSession !== null ) {

			needsUpdate = true;

		}

		if ( needsUpdate === true ) render();

	}

	//

	var startTime = 0;
	var endTime = 0;

	function render() {

		startTime = performance.now();

		// Adding/removing grid to scene so materials with depthWrite false
		// don't render under the grid.

		scene.add( grid );
		renderer.setViewport( 0, 0, container.dom.offsetWidth, container.dom.offsetHeight );
		renderer.render( scene, editor.viewportCamera );
		scene.remove( grid );

		if ( camera === editor.viewportCamera ) {

			renderer.autoClear = false;
			if ( showSceneHelpers === true ) renderer.render( sceneHelpers, camera );
			if ( vr.currentSession === null ) viewHelper.render( renderer );
			renderer.autoClear = true;

		}

		endTime = performance.now();
		editor.signals.sceneRendered.dispatch( endTime - startTime );

	}	

	return container;

}

function updateGridColors( grid1, grid2, colors ) {

	grid1.material.color.setHex( colors[ 0 ] );
	grid2.material.color.setHex( colors[ 1 ] );

}

export { Viewport };
