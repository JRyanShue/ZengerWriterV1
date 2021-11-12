
import * as THREE from '../../build/three.module.js';

import { SetPositionCommand } from './commands/SetPositionCommand.js';

function SnapDown( editor ) {

    const absoluteBounds = new THREE.Box3();

    console.log("snapping down");
    var object = editor.selected;  // works like a THREE.Mesh()
    var geometry = object.geometry;
    geometry.computeBoundingBox();

    absoluteBounds.copy( geometry.boundingBox ).applyMatrix4( object.matrixWorld );  // Absolute bounding box

    var newPosition = new THREE.Vector3(object.position.x, object.position.y, object.position.z - absoluteBounds.min.z)
    
    editor.execute( new SetPositionCommand( editor, object, newPosition ) );

}

export { SnapDown };