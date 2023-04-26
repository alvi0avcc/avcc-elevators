export function getCurvePoints( ControlPoint, tension, isClosed, numOfSegments) {

    // use input value if provided, or use a default value   
    tension = (typeof tension != 'undefined') ? tension : 0.5;
    isClosed = isClosed ? isClosed : false;
    numOfSegments = numOfSegments ? numOfSegments : 10;

    let _ControlPoint = [], res = [],    // clone array
        x, y,           // our x,y coords
        t1x, t2x, t1y, t2y, // tension vectors
        c1, c2, c3, c4,     // cardinal points
        st, t, i;       // steps based on num. of segments

    // clone array so we don't change the original
    //
    _ControlPoint = ControlPoint.slice(0);

    // The algorithm require a previous and next point to the actual point array.
    // Check if we will draw closed or open curve.
    // If closed, copy end points to beginning and first points to end
    // If open, duplicate first points to befinning, end points to end
    if (isClosed) {
        _ControlPoint.unshift(ControlPoint[ControlPoint.length - 1]);
        _ControlPoint.unshift(ControlPoint[ControlPoint.length - 2]);
       // _pts.unshift(pts[pts.length - 1]);
        //_pts.unshift(pts[pts.length - 2]);
        _ControlPoint.push(ControlPoint[0]);
        _ControlPoint.push(ControlPoint[1]);
        _ControlPoint.push(ControlPoint[2]);
        _ControlPoint.push(ControlPoint[3]);
    }
    else {
        _ControlPoint.unshift(ControlPoint[1]);   //copy 1. point and insert at beginning
        _ControlPoint.unshift(ControlPoint[0]);
        _ControlPoint.push(ControlPoint[ControlPoint.length - 2]); //copy last point and append
        _ControlPoint.push(ControlPoint[ControlPoint.length - 1]);
    }

    // 1. loop goes through point array
    // 2. loop goes through each segment between the 2 pts + 1e point before and after
    for (i=2; i < (_ControlPoint.length - 4); i+=2) {
        for (t=0; t <= numOfSegments; t++) {

            // calc tension vectors
            t1x = (_ControlPoint[i+2] - _ControlPoint[i-2]) * tension;
            t2x = (_ControlPoint[i+4] - _ControlPoint[i]) * tension;

            t1y = (_ControlPoint[i+3] - _ControlPoint[i-1]) * tension;
            t2y = (_ControlPoint[i+5] - _ControlPoint[i+1]) * tension;

            // calc step
            st = t / numOfSegments;

            // calc cardinals
            c1 =   2 * Math.pow(st, 3)  - 3 * Math.pow(st, 2) + 1; 
            c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2); 
            c3 =       Math.pow(st, 3)  - 2 * Math.pow(st, 2) + st; 
            c4 =       Math.pow(st, 3)  -     Math.pow(st, 2);

            // calc x and y cords with common control vectors
            x = c1 * _ControlPoint[i]    + c2 * _ControlPoint[i+2] + c3 * t1x + c4 * t2x;
            y = c1 * _ControlPoint[i+1]  + c2 * _ControlPoint[i+3] + c3 * t1y + c4 * t2y;

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

export function getPoints_by_Y( y , points_xy ){
    let curve = points_xy;
    let xy = [];
    //console.log('level y = ',y);
    //console.log('type y = ', typeof(y));
    for ( let i = 0;  i < curve.length-1; i+=2 ){
        if ( curve[i+1] <= y && ( y < curve[i+3] || y == curve[i+3] ) ) { // y1 <= y < y2
            xy.push( [ curve[i], curve[i+1], curve[i+2], curve[i+3] ] ); // [ x1,y1, x2,y2 ]
            break;
        }
    }
    //console.log('xy = ',xy);
    return xy;
}

export function get_Max_Y_3D_full( points_xy ){
    let curve = points_xy;
    let max = 0;
    for ( let i = 0;  i < curve.length; i+=4 ){
        if ( max <= curve[i+2] ) {max = curve[i+2];}
    }
    return max;
}

export function get_Max_Y_3D( points_xy ){
    let curve = points_xy;
    let max = 0;
    for ( let i = 0;  i < curve.length/2; i+=4 ){
        if ( max <= curve[i+2] ) {max = curve[i+2];}
    }
    return max;
}

