
import * as THREE from '../../build/three.module.js';
import { UIPanel, UIDiv } from './libs/ui.js';

// Wrapper for g-code preview

function Preview( editor ) {

    var container = new UIPanel();

    this.preview = new UIDiv();
    this.preview.dom.id = 'Preview';
    this.preview.dom.style.display = 'none';

    // For toggling layer view on/off

    var signals = editor.signals;
    signals.partView.add( () => {

        this.preview.dom.style.display = 'none';

    } )
    signals.layerView.add( () => {

        this.preview.dom.style.display = 'block';

    } )

    // Renderer 

    var renderer = new THREE.WebGLRenderer( {

        antialias: true,
        preserveDrawingBuffer: true

    } ); 
    renderer.setClearColor(0xffffff, 0);
    renderer.setSize( window.innerWidth, window.innerHeight );

    // Scene

    var scene = new THREE.Scene();

    // CAMERA 

    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.x = 17;
    camera.position.y = 12;
    camera.position.z = 13;
    camera.lookAt(scene.position);

    // GEOMETRY & MATERIALS

    var cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
    var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff55ff});
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(cube);
    cube.position.z = 4;

    var ballGeometry = new THREE.SphereGeometry(3, 16, 16);
    var ballMaterial = new THREE.MeshPhongMaterial({color: 0x33aaff});
    var ball = new THREE.Mesh(ballGeometry, ballMaterial);
    scene.add(ball);
    ball.position.z = -5;

    var floorGeometry = new THREE.BoxGeometry(30, 1, 30);
    var floorMaterial = new THREE.MeshBasicMaterial({color: 0x656587});
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    scene.add(floor);
    floor.position.y = -3;
    floor.receiveShadow = true;

    // LIGHT

    var spot1 = new THREE.SpotLight(0xffffff);
    spot1.position.set(10, 100, -50);
    scene.add(spot1);

    renderer.render( scene, editor.viewportCamera );

    this.preview.dom.appendChild( renderer.domElement );
    container.add( this.preview );

    return container;

}


export { Preview }
