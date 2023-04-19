import { getCurvePoints } from "./spline";

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

export function drawCurve(ctx, points, tension, isClosed, numOfSegments, showPoints) {
    ctx.beginPath();
    draw_PLine(ctx, getCurvePoints(points, tension, isClosed, numOfSegments));
    if (showPoints) {
        for( let i = 0; i < points.length-1; i+=2 ) 
        ctx.rect(points[i] - 2, points[i+1] - 2, 4, 4);
    }
    ctx.stroke();
}