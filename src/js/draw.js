import { getCurvePoints } from "./spline";
import { interpolation } from "./calc";

export function drawPoint(ctx, xy = { x:0,y:0 } ) {
    ctx.beginPath();
    ctx.rect(xy.x - 2, xy.y - 2, 4, 4);
    ctx.stroke();
}

export function draw_PLine(ctx, points) {
    ctx.moveTo(points[0], points[1]);
    for( let i=2; i < points.length-1; i+=2 ) ctx.lineTo(points[i], points[i+1]);
}

export function draw_PLine_3D(ctx, points ) {
    ctx.beginPath();
    ctx.moveTo(points[0], points[1]);
    for( let i=4; i < points.length; i+=4 ) ctx.lineTo(points[i], points[i+1]);
    ctx.stroke();
}

export function draw_PLine_3D_between(ctx, points1, points2 ) {
    ctx.beginPath();
    for( let i=0; i < points1.length; i+=4 ) {
        ctx.moveTo(points1[i], points1[i+1]);
        ctx.lineTo(points2[i], points2[i+1]);
    }
    ctx.stroke();
}

export function drawCurve(ctx, points, tension, isClosed, numOfSegments, showPoints) {
    ctx.beginPath();
    draw_PLine(ctx, getCurvePoints(points, tension, isClosed, numOfSegments));
    if (showPoints) {
        for( let i = 0; i < points.length-1; i+=2 ) 
        ctx.rect(points[i] - 2, points[i+1] - 2, 4, 4);
    }
    ctx.stroke();
}

export function draw_underBase(ctx, points ) {
    let points1 = points.slice( 0, 16 );
    points1 = points1.concat( points1.slice( 0, 4 ) );
    let points2 = points.slice( 16 );
    points2 = points2.concat( points2.slice( 0, 4 ) );
    draw_PLine_3D(ctx, points1 );
    draw_PLine_3D(ctx, points2 );
    let x =0;
    let y =0;
    let step = 10;
    let x1,y1,x2,y2;
    let points3 = [];
    let points4 = [];
    for ( let j = 0; j < points1.length; j+=4 ) {
        x1 = points1[0+j];
        y1 = points1[1+j];
        x2 = points1[4+j];
        y2 = points1[5+j];
        for ( let i = 0; i <= step; i++ ) {
            y = y1 + ( y2 - y1 ) / step * i;
            if ( y1 == y2  ) {
                x = x1 + ( x2 - x1 ) / step  * i; 
            } else x = interpolation( y , x1,y1, x2,y2 );
            points3 = points3.concat( [ x, y, points1[3+j], 1 ] );
        }
        x1 = points2[0+j];
        y1 = points2[1+j];
        x2 = points2[4+j];
        y2 = points2[5+j];
        for ( let i = 0; i <= step; i++) {
            y = y1 + ( y2 - y1 ) / step * i;
            if ( y1 == y2  ) {
                x = x1 + ( x2 - x1 ) / step  * i; 
            } else x = interpolation( y , x1,y1, x2,y2 );
            points4 = points4.concat( [ x, y, points2[3+j], 1 ] );
        }
    };
    draw_PLine_3D_between(ctx, points3, points4 );

}