
export function MyRound(value, decimal){
    let MyPow;
    let result;
    MyPow = Math.pow(10,decimal);
    result = Math.round( value*MyPow ) / MyPow;
    return Number(result);
}

export function Isometric( [x, y, z] , [ angle_X, angle_Y, angle_Z ] ){
    //let XX = x * cos(α) + y * cos(α + 120° ) + z * cos( α - 120° );
    //let YY = x * sin(α) + y * sin( α + 120° ) + z * sin( α - 120° );
    let xx = x * Math.cos( angle_X ) + y * Math.cos( angle_Y +2.09 ) + z * Math.cos( angle_Z-2.09 );
    let yy = x * Math.sin( angle_X ) + y * Math.sin( angle_Y +2.09 ) + z * Math.sin( angle_Z-2.09 );
    return { xx, yy };
}

export function IsometricArr( arr=[] , [ angle_X, angle_Y, angle_Z ] ){
    let result = [];
    let x,y,z;
    let xx, yy;
    //let XX = x * cos(α) + y * cos(α + 120° ) + z * cos( α - 120° );
    //let YY = x * sin(α) + y * sin( α + 120° ) + z * sin( α - 120° );
    for ( let i = 0; i < arr.length; i=i+3 ) {
        x = arr[ i ];
        y = arr[ i + 1 ];
        z = arr[ i + 2 ];
        xx = x * Math.cos( angle_X ) + y * Math.cos( angle_Y +2.09 ) + z * Math.cos( angle_Z-2.09 );
        yy = x * Math.sin( angle_X ) + y * Math.sin( angle_Y +2.09) + z * Math.sin( angle_Z-2.09 );

        result.push( xx );
        result.push( yy );
    }
    return result;
}

export function DecartToSphere ( x, y, z ){
    let r;
    if ( x == 0 & y == 0 & z == 0 ) { r = 0 }
    else { r = Math.sqrt( x*x + y*y+ z*z ); };
    let tetta;  
    let gamma;
    if ( x == 0 & y == 0 & z == 0 ) { tetta = 0; gamma = 0 }
    else {
        tetta = Math.acos( z / Math.sqrt( x*x + y*y + z*z ) );
        gamma = Math.atan( y / x );
    }
    return [ r, tetta, gamma ];
}

export function DecartToSphereArr ( arr=[] ){
    let result = [];
    for ( let i  = 0; i < arr.length; i=i+3 ) {
        result = result.concat( DecartToSphere ( arr[i], arr[i+1], arr[i+2] ));
    }
    return result;
}

export function SphereToDecart ( r, tetta, gamma ){
    let x = r * Math.sin( tetta ) * Math.cos( gamma );
    let y = r * Math.sin( tetta ) * Math.sin( gamma );
    let z = r * Math.cos( tetta );
    return [ x, y, z ];
}

export function SphereToDecartArr ( arr=[], tetta, gamma ){
    let result = [];
    for ( let i  = 0; i < arr.length; i=i+3 ) {
        if ( !tetta ) tetta = arr[i+1];
        if ( !gamma ) gamma = arr[i+2];
        result = result.concat( SphereToDecart ( arr[i], tetta, gamma ));
    }
    return result;
}

export function Mass(w) {
        let S_Osnovaniya;
        let S_Vershini;
        let SS;
        let Scobka;
        let V1, V2;
        let UdPogrV;
        S_Osnovaniya = w.dx2 * w.dy2;
        S_Vershini = w.ux *w.uy;
        SS = S_Osnovaniya * S_Vershini;
        Scobka = S_Osnovaniya + S_Vershini + Math.sqrt(SS);
        V1 = w.dx1 * w.dy1 * w.dh1;
        V2 = w.dh2 * Scobka / 3;
        w.Result.V = V1 + V2;
        UdPogrV = 1000 / w.Natura;
        w.Result.M = w.Result.V / UdPogrV;
    return w;
}