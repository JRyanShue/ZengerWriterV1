import * as THREE from '../../build/three.module.js';

/* Modify x/y position of vector to orbit around vector origin at dT speed. 
Relies on dx of mouse right-click drag. */
function eulerX(vector, dT1) {

    // For calculations, not modification of the reference
    let x = vector.x;
    let y = vector.y;

    let pythagoreanXY = Math.sqrt( Math.pow(x, 2) + Math.pow( y, 2 ) );

    let dT = dT1 * ( pythagoreanXY / 300 );  // adjust for distance from center
    
    // Use Euler's method to determine the next point to jump to

    let dx;
    let yFlip = 2 * ( +( y > 0 ) ) - 1;  // Either 1 or -1 to negate effects of crossing midpoint
    let xFlipIs = -yFlip *(Math.atan(x/y)+(Math.PI/2)) > 0;  // Whether or not dx should be offset by pi and negated. Happens pi/2 rad after yflip
    
    if (xFlipIs) {
        dx = -yFlip *(Math.atan(x/y)+(Math.PI/2));
    } else {
        dx = -( -yFlip *(Math.atan(x/y)+(Math.PI/2)) + Math.PI );
    }
    
    // Without the below, since dx is offset by pi/2 rad, dx will go from pi/2 to pi instead of going from pi/2 to 0. 
    if (dx < -Math.PI/2) {
        vector.x += ( -Math.PI - dx ) * dT;
    } 
    else if (dx > Math.PI/2) {
        vector.x += ( Math.PI - dx ) * dT;
    }
    else {
        vector.x += dx * dT;
    } 

    // dY is not offset, so works as it should after negatives in arctan are accounted for with yFlip. 
    let dy = yFlip * Math.atan( x / y );
    vector.y += dy * dT;

    // Use Pythagorean distance to compensate for Euler's method error by pulling the viewpoint toward the center
    let newpythagoreanXY = Math.sqrt( Math.pow( vector.x, 2 ) + Math.pow( vector.y, 2 ) );
    let scaleDown = pythagoreanXY / newpythagoreanXY;
    vector.x *= scaleDown;
    vector.y *= scaleDown;
    
}

/* Modify z/xy position of vector to orbit around vector origin at dT speed.  
Relies on dy of mouse right-click drag. 
Slows down at poles (bug) */
function eulerY(vector, dT2) {

    // For calculations, not modification of the reference
    let x = vector.x;
    let y = vector.y;
    let z = vector.z;

    let pythagoreanXY = Math.sqrt( Math.pow(x, 2) + Math.pow( y, 2 ) );
    let pythagoreanZXY = Math.sqrt( Math.pow(z, 2) + Math.pow( pythagoreanXY, 2 ) );

    let dT = dT2 * ( pythagoreanZXY / 300 );  // adjust for distance from center
    // console.log("dT", dT);

    // Use Euler's method to determine the next point to jump to

    let dx;
    // let yFlip = 2 * ( +( y > 0 ) ) - 1;
    // let xFlipIs = -yFlip *(Math.atan(x/y)+(Math.PI/2)) > 0;
    
    dx = (-Math.atan(x/z));  // +(Math.PI/2)
    // if (xFlipIs){
    //     dx = -yFlip *(Math.atan(x/y)+(Math.PI/2));
    // } else {
    //     dx = -( -yFlip *(Math.atan(x/y)+(Math.PI/2)) + Math.PI );
    // }
    
    if (dx < - Math.PI/2) {
        vector.x += ( -Math.PI - dx ) * dT;
    } 
    else if (dx > Math.PI/2) {
        vector.x += -( Math.PI - dx ) * dT;
    }
    else{
        vector.x += dx * -dT;
    } 

    // dY
    let dy;
    // dy = yFlip * Math.atan( x / y );
    dy = (-Math.atan(y/z));  // +(Math.PI/2)

    if (dy < - Math.PI/2) {
        vector.y += ( -Math.PI - dy ) * dT;
    } 
    else if (dy > Math.PI/2) {
        vector.y += -( Math.PI - dy ) * dT;
    }
    else{
        vector.y += dy * -dT;
    } 

    // dZ
    let dz;
    dz = Math.abs ( Math.atan(pythagoreanXY/z) );
    vector.z += dz * -dT;

    // console.log("x", x.toPrecision(4), "y", y.toPrecision(4), "xy", pythagoreanXY.toPrecision(4), "xyz", pythagoreanZXY.toPrecision(4), "z", z.toPrecision(4), "dx", dx.toPrecision(2), "dy", dy.toPrecision(2), "dz", dz.toPrecision(2));

    // Use Pythagorean distance to compensate for Euler's method error by pulling the viewpoint toward the center
    let newPythagoreanXY = Math.sqrt( Math.pow(vector.x, 2) + Math.pow( vector.y, 2 ) );
    let newPythagoreanZXY = Math.sqrt( Math.pow(vector.z, 2) + Math.pow( newPythagoreanXY, 2 ) );
    let scaleDown = pythagoreanZXY / newPythagoreanZXY;
    vector.x *= scaleDown;
    vector.y *= scaleDown;
    vector.z *= scaleDown;

}

export { eulerX, eulerY };