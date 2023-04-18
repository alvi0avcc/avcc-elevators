export default function getCurvePoints(pts, tension, isClosed, numOfSegments) {

    // use input value if provided, or use a default value   
    tension = (typeof tension != 'undefined') ? tension : 0.5;
    isClosed = isClosed ? isClosed : false;
    numOfSegments = numOfSegments ? numOfSegments : 16;

    let _pts = [], res = [],    // clone array
        x, y,           // our x,y coords
        t1x, t2x, t1y, t2y, // tension vectors
        c1, c2, c3, c4,     // cardinal points
        st, t, i;       // steps based on num. of segments

    // clone array so we don't change the original
    //
    _pts = pts.slice(0);

    // The algorithm require a previous and next point to the actual point array.
    // Check if we will draw closed or open curve.
    // If closed, copy end points to beginning and first points to end
    // If open, duplicate first points to befinning, end points to end
    if (isClosed) {
        _pts.unshift(pts[pts.length - 1]);
        _pts.unshift(pts[pts.length - 2]);
       // _pts.unshift(pts[pts.length - 1]);
        //_pts.unshift(pts[pts.length - 2]);
        _pts.push(pts[0]);
        _pts.push(pts[1]);
        _pts.push(pts[2]);
        _pts.push(pts[3]);
    }
    else {
        _pts.unshift(pts[1]);   //copy 1. point and insert at beginning
        _pts.unshift(pts[0]);
        _pts.push(pts[pts.length - 2]); //copy last point and append
        _pts.push(pts[pts.length - 1]);
    }

    // 1. loop goes through point array
    // 2. loop goes through each segment between the 2 pts + 1e point before and after
    for (i=2; i < (_pts.length - 4); i+=2) {
        for (t=0; t <= numOfSegments; t++) {

            // calc tension vectors
            t1x = (_pts[i+2] - _pts[i-2]) * tension;
            t2x = (_pts[i+4] - _pts[i]) * tension;

            t1y = (_pts[i+3] - _pts[i-1]) * tension;
            t2y = (_pts[i+5] - _pts[i+1]) * tension;

            // calc step
            st = t / numOfSegments;

            // calc cardinals
            c1 =   2 * Math.pow(st, 3)  - 3 * Math.pow(st, 2) + 1; 
            c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2); 
            c3 =       Math.pow(st, 3)  - 2 * Math.pow(st, 2) + st; 
            c4 =       Math.pow(st, 3)  -     Math.pow(st, 2);

            // calc x and y cords with common control vectors
            x = c1 * _pts[i]    + c2 * _pts[i+2] + c3 * t1x + c4 * t2x;
            y = c1 * _pts[i+1]  + c2 * _pts[i+3] + c3 * t1y + c4 * t2y;

            //store points in array
            res.push(x);
            res.push(y);

        }
    }

    return res;
}

export function getPoint( nPoint, pts, tension, isClosed, numOfSegments ){
    let x, y;
    let points = getCurvePoints(pts, tension, isClosed, numOfSegments);
    let number = (nPoint-1)*2;
    x = points[number];
    y = points[number+1];
    return { x, y };
}

export function drawPoint(ctx, xy = { x:0,y:0 } ) {
    ctx.beginPath();
    ctx.rect(xy.x - 2, xy.y - 2, 4, 4);
    ctx.stroke();
  }

export function drawLines(ctx, points) {
    ctx.moveTo(points[0], points[1]);
    for( let i=2; i < points.length-1; i+=2 ) ctx.lineTo(points[i], points[i+1]);
  }

export function drawCurve(ctx, pts, tension, isClosed, numOfSegments, showPoints) {
    ctx.beginPath();
    drawLines(ctx, getCurvePoints(pts, tension, isClosed, numOfSegments));
    if (showPoints) {
        for( let i = 0; i < pts.length-1; i+=2 ) 
        ctx.rect(pts[i] - 2, pts[i+1] - 2, 4, 4);
    }
    ctx.stroke();
}

export function drawSlice(ctx, points ) {
    ctx.beginPath();
    ctx.moveTo(points[0], points[1]);
    for( let i=4; i < points.length; i+=4 ) ctx.lineTo(points[i], points[i+1]);
    ctx.stroke();
  }

export function getSlice(z, points, tension_base, tension_volume, isClosed, numOfSegments, Points_contur_L, Points_contur_W ) {
    let xyz = [];
    if ( tension_base == null ) tension_base = 1;
    if ( tension_volume == null ) tension_volume = 0.5;
    if ( tension_volume <= 0 ) tension_volume = 0.01;
    /*points[0]+= z*0.4;//l
    points[3]+= z*0.2;//w
    points[4]-= z*0.4;//l
    points[7]-= z*0.2;//w*/

    let contur_L = getCurvePoints( Points_contur_L, tension_volume, false, numOfSegments );
    let contur_W = getCurvePoints( Points_contur_W, tension_volume, false, numOfSegments );

    let xy_L = getPoints_by_Y( z , contur_L );
    let xy_W = getPoints_by_Y( z , contur_W );

    let x1 = interpolation( z , xy_L[0][0], xy_L[0][1], xy_L[0][2], xy_L[0][3] );
    let x2 = interpolation( z , xy_W[0][0], xy_W[0][1], xy_W[0][2], xy_W[0][3] );

    points[0] = -x1;//l
    points[3] = -x2;//w
    points[4] = x1;//l
    points[7] = x2;//w

    let xy = getCurvePoints( points, tension_base, isClosed, numOfSegments );
    
    for ( let i = 0; i < xy.length; i+=2 ){
        xyz = xyz.concat( [ xy[i], xy[i+1], z, 1 ] );
    }
    return xyz;
}

export function getContur( points, tension, isClosed, numOfSegments ) {
    let xyz = [];

    let xy = getCurvePoints( points, tension, isClosed, numOfSegments );
    for ( let i = 0; i < xy.length; i+=2 ){
        xyz = xyz.concat( [ xy[i], 0, xy[i+1], 1 ] );
    }
    return xyz;
}

export function getPoints_by_Y( y , points_xy ){
    let curve = points_xy;
    let x = [];
    for ( let i = 0;  i < curve.length-1; i+=2 ){
        if ( curve[i+1] <= y & y < curve[i+3] ) { // y1 <= y < y2
            x.push( [ curve[i], curve[i+1], curve[i+2], curve[i+3] ] ); // [ x1,y1, x2,y2 ]
        }
    }
    return x;
}

export function interpolation( y , x1,y1, x2,y2 ){
    let x = ( x2 - x1 ) * ( y - y1 ) / ( y2 - y1 ) + x1;
return x;
}
