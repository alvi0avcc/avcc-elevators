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

export function draw_Line_3D(ctx, point_1, point_2 ) {
    ctx.beginPath();
    ctx.moveTo(point_1[0], point_1[1]);
    ctx.lineTo(point_2[0], point_2[1]);
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
    draw_PLine_3D_between(ctx, points1, points2 );

    draw_Line_3D(ctx, [ points1[0], points1[1] ], [ points2[4], points2[5] ] );
    draw_Line_3D(ctx, [ points1[4], points1[5] ], [ points2[8], points2[9] ] );
    draw_Line_3D(ctx, [ points1[8], points1[9] ], [ points2[12], points2[13] ] );
    draw_Line_3D(ctx, [ points1[12], points1[13] ], [ points2[16], points2[17] ] );

    draw_Line_3D(ctx, [ points2[0], points2[1] ], [ points1[4], points1[5] ] );
    draw_Line_3D(ctx, [ points2[4], points2[5] ], [ points1[8], points1[9] ] );
    draw_Line_3D(ctx, [ points2[8], points2[9] ], [ points1[12], points1[13] ] );
    draw_Line_3D(ctx, [ points2[12], points2[13] ], [ points1[16], points1[17] ] );
}
