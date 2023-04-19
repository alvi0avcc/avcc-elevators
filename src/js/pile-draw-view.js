import React, { useRef, useEffect } from 'react';
import { Elevators } from './elevators.js';
import { Isometric, IsometricArr, Matrix, DecartToSphereArr, SphereToDecartArr } from './calc.js';
import { mat4 } from 'gl-matrix';
import * as Calc from './calc.js';
import cPile from './pile_class.js'
import { getCurvePoints, drawLines, drawCurve, getPoint, drawPoint, drawPoints, getSlice, drawSlice, drawContur, getContur, getPoints_by_Y, interpolation } from './spline.js';
import { MoveMatrix, MoveMatrixAny, RotateMatrix_X, RotateMatrix_X_any, RotateMatrix_Y, RotateMatrix_Y_any, RotateMatrix_Z, RotateMatrix_Z_any, ScaleMatrix, ScaleMatrixAny, ScaleMatrixAny1zoom } from './3d-matrix.js';
import { draw_PLine_3D } from './draw.js';


const PileViewCanvas = props => {
  
  const canvasRef = useRef(null);

  let pile = Elevators.PileGet( props.index );
  let gPile = new cPile();
  let numOfSegments = 10;
  gPile.set_Initial_Data_Complex ( pile, numOfSegments );//initialisation Pile

  const draw = (ctx, frameCount) => {

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    let x_center = ctx.canvas.width/2;
    let y_center = ctx.canvas.height/2;
    let zoom;
    if ( ctx.canvas.height / pile.Height > ctx.canvas.width / pile.Base.length ) {
        zoom = ctx.canvas.width / pile.Base.length
    } else zoom = ctx.canvas.height / pile.Height;
    zoom = zoom * 0.8;

    let l = Number(pile.Base.length);
    let w = Number(pile.Base.width);
    let h = Number(pile.Height);
    let Tension_Base = Number( pile.Tension_Base );
    let Tension_Volume = Number( pile.Tension_Volume );
    

    let Points_level = [  -l/2,    0, 
                               0, -w/2, 
                             l/2,    0, 
                               0,  w/2 ];

     let ll = Number(pile.Top.length);
     let l_left = Number(pile.Top.length_left);
     let l_right = Number(pile.Top.length_right);
     let ww = Number(pile.Top.width);
     let w_front = Number(pile.Top.width_front);
     let w_aft = Number(pile.Top.width_aft);
     

let Points_contur_L = [ -l/2, 0, 
                       -ll/2, h, 
                        ll/2, h, 
                        l/2,  0 ];

let Points_contur_W = [ -w/2, 0, 
                        -ww/2, h, 
                         ww/2, h, 
                         w/2,  0 ];

//-------------------------------------Corner 1
   /* let corner_b = [];
    let corner_t = [];
    if ( pile.Base.r1t == 'true' ) {
            //arc
        corner_b = Calc.Corner_Arc_arr( base[0], base[1], base[28], base[29], pile.Base.r1, z1, 5, 4 );
    }else {
        corner_b = Calc.Corner_Line_arr( base[0], base[1], base[28], base[29], z1, 5 );
    }
    if ( pile.Top.r1t == 'true' ) {
            //arc
            corner_t = Calc.Corner_Arc_arr( top[0], top[1], top[28], top[29], pile.Top.r1, zz1, 5, 4 );
    }else {
        corner_t = Calc.Corner_Line_arr( top[0], top[1], top[28], top[29], zz1, 5 );
    }
       
    corner_b  = ScaleMatrixAny1zoom( corner_b, zoom );
    corner_b  = RotateMatrix_X_any( corner_b, -100 );
    corner_b  = RotateMatrix_Y_any( corner_b, frameCount/4 );
    corner_b  = RotateMatrix_Z_any( corner_b, 0 );
    corner_b  = MoveMatrixAny( corner_b, x_center, y_center, 0 );

    corner_t  = ScaleMatrixAny1zoom( corner_t, zoom );
    corner_t  = RotateMatrix_X_any( corner_t, -100 );
    corner_t  = RotateMatrix_Y_any( corner_t, frameCount/4 );
    corner_t  = RotateMatrix_Z_any( corner_t, 0 );
    corner_t  = MoveMatrixAny( corner_t, x_center, y_center, 0 );

   /* ctx.strokeStyle  = 'magenta';
    ctx.fillStyle   = 'magenta';
    ctx.font = "18px serif";
    ctx.beginPath();
    ctx.fillText("Corner 1", corner_b[12], corner_b[13]);
    for ( let i = 4; i < corner_b.length; i=i+4 ){
        ctx.moveTo( corner_b[i-4], corner_b[i+1-4] ); ctx.lineTo( corner_b[i], corner_b[i+1] );  
        ctx.lineTo( corner_t[i], corner_t[i+1] ); ctx.lineTo( corner_t[i-4], corner_t[i+1-4] ); 
    }
    ctx.stroke();*/
//-------------------------------------
//-------------------------------------Corner 2
/*if ( pile.Base.r2t == 'true' ) {
        //arc
        corner_b = Calc.Corner_Arc_arr( base[4], base[5], base[8], base[9], pile.Base.r2, z1, 5, 1 );
}else {
    corner_b = Calc.Corner_Line_arr( base[8], base[9], base[4], base[5], z1, 5 );
}
if ( pile.Top.r2t == 'true' ) {
        //arc
        corner_t = Calc.Corner_Arc_arr( top[4], top[5], top[8], top[9], pile.Top.r2, zz1, 5, 1 );
}else {
    corner_t = Calc.Corner_Line_arr( top[8], top[9], top[4], top[5], zz1, 5 );
}
   
corner_b  = ScaleMatrixAny1zoom( corner_b, zoom );
corner_b  = RotateMatrix_X_any( corner_b, -100 );
corner_b  = RotateMatrix_Y_any( corner_b, frameCount/4 );
corner_b  = RotateMatrix_Z_any( corner_b, 0 );
corner_b  = MoveMatrixAny( corner_b, x_center, y_center, 0 );

corner_t  = ScaleMatrixAny1zoom( corner_t, zoom );
corner_t  = RotateMatrix_X_any( corner_t, -100 );
corner_t  = RotateMatrix_Y_any( corner_t, frameCount/4 );
corner_t  = RotateMatrix_Z_any( corner_t, 0 );
corner_t  = MoveMatrixAny( corner_t, x_center, y_center, 0 );

/*ctx.strokeStyle  = 'green';
ctx.fillStyle   = 'green';
ctx.font = "18px serif";
ctx.beginPath();
ctx.fillText("Corner 2", corner_b[12], corner_b[13]);
ctx.beginPath();
for ( let i = 0; i < corner_b.length; i=i+4 ){
    ctx.moveTo( corner_b[i-4], corner_b[i+1-4] ); ctx.lineTo( corner_b[i], corner_b[i+1] );  
    ctx.lineTo( corner_t[i], corner_t[i+1] ); ctx.lineTo( corner_t[i-4], corner_t[i+1-4] );   
}
ctx.stroke();*/
//-------------------------------------
//-------------------------------------Corner 3
/*if ( pile.Base.r3t == 'true' ) {
    //arc
    corner_b = Calc.Corner_Arc_arr( base[16], base[17], base[12], base[13], pile.Base.r3, z1, 5, 2 );
}else {
corner_b = Calc.Corner_Line_arr( base[16], base[17], base[12], base[13], z1, 5 );
}
if ( pile.Top.r3t == 'true' ) {
    //arc
    corner_t = Calc.Corner_Arc_arr( top[16], top[17], top[12], top[13], pile.Top.r3, zz1, 5, 2 );
}else {
corner_t = Calc.Corner_Line_arr( top[16], top[17], top[12], top[13], zz1, 5 );
}

corner_b  = ScaleMatrixAny1zoom( corner_b, zoom );
corner_b  = RotateMatrix_X_any( corner_b, -100 );
corner_b  = RotateMatrix_Y_any( corner_b, frameCount/4 );
corner_b  = RotateMatrix_Z_any( corner_b, 0 );
corner_b  = MoveMatrixAny( corner_b, x_center, y_center, 0 );

corner_t  = ScaleMatrixAny1zoom( corner_t, zoom );
corner_t  = RotateMatrix_X_any( corner_t, -100 );
corner_t  = RotateMatrix_Y_any( corner_t, frameCount/4 );
corner_t  = RotateMatrix_Z_any( corner_t, 0 );
corner_t  = MoveMatrixAny( corner_t, x_center, y_center, 0 );

/*ctx.strokeStyle  = 'purple';
ctx.fillStyle   = 'purple';
ctx.font = "18px serif";
ctx.beginPath();
ctx.fillText("Corner 3", corner_b[12], corner_b[13]);
ctx.beginPath();
for ( let i = 0; i < corner_b.length; i=i+4 ){
    ctx.moveTo( corner_b[i-4], corner_b[i+1-4] ); ctx.lineTo( corner_b[i], corner_b[i+1] );  
    ctx.lineTo( corner_t[i], corner_t[i+1] ); ctx.lineTo( corner_t[i-4], corner_t[i+1-4] );   
}
ctx.stroke();*/
//-------------------------------------
//-------------------------------------Corner 4
/*if ( pile.Base.r4t == 'true' ) {
    //arc
    corner_b = Calc.Corner_Arc_arr( base[20], base[21], base[24], base[25], pile.Base.r4, z1, 5, 3 );
}else {
corner_b = Calc.Corner_Line_arr( base[24], base[25], base[20], base[21], z1, 5 );
}
if ( pile.Top.r4t == 'true' ) {
    //arc
    corner_t = Calc.Corner_Arc_arr( top[20], top[21], top[24], top[25], pile.Top.r4, zz1, 5, 3 );
}else {
corner_t = Calc.Corner_Line_arr( top[24], top[25], top[20], top[21], zz1, 5 );
}

corner_b  = ScaleMatrixAny1zoom( corner_b, zoom );
corner_b  = RotateMatrix_X_any( corner_b, -100 );
corner_b  = RotateMatrix_Y_any( corner_b, frameCount/4 );
corner_b  = RotateMatrix_Z_any( corner_b, 0 );
corner_b  = MoveMatrixAny( corner_b, x_center, y_center, 0 );

corner_t  = ScaleMatrixAny1zoom( corner_t, zoom );
corner_t  = RotateMatrix_X_any( corner_t, -100 );
corner_t  = RotateMatrix_Y_any( corner_t, frameCount/4 );
corner_t  = RotateMatrix_Z_any( corner_t, 0 );
corner_t  = MoveMatrixAny( corner_t, x_center, y_center, 0 );

/*ctx.strokeStyle  = 'red';
ctx.fillStyle   = 'red';
ctx.font = "18px serif";
ctx.beginPath();
ctx.fillText("Corner 4", corner_b[12], corner_b[13]);
ctx.beginPath();
for ( let i = 0; i < corner_b.length; i=i+4 ){
    ctx.moveTo( corner_b[i-4], corner_b[i+1-4] ); ctx.lineTo( corner_b[i], corner_b[i+1] );  
    ctx.lineTo( corner_t[i], corner_t[i+1] ); ctx.lineTo( corner_t[i-4], corner_t[i+1-4] );   
}
ctx.stroke();*/
//-------------------------------------
               
   /* base  = ScaleMatrixAny1zoom( base, zoom );
    base  = RotateMatrix_X_any( base, -100 );
    base  = RotateMatrix_Y_any( base, frameCount/4 );
    base  = RotateMatrix_Z_any( base, 0 );
    base  = MoveMatrixAny( base, x_center, y_center, 0 );
    

    top  = ScaleMatrixAny1zoom( top, zoom );
    top  = RotateMatrix_X_any( top, -100 );
    top  = RotateMatrix_Y_any( top, frameCount/4 );
    top  = RotateMatrix_Z_any( top, 0 );
    top  = MoveMatrixAny( top, x_center, y_center, 0 );*/

   /* ctx.strokeStyle  = 'black';
    ctx.beginPath();
    ctx.moveTo( base[0], base[1] ); ctx.lineTo( base[4], base[5] );
    ctx.moveTo( base[8], base[9] ); ctx.lineTo( base[12], base[13] );
    ctx.moveTo( base[16], base[17] ); ctx.lineTo( base[20], base[21] );
    ctx.moveTo( base[24], base[25] ); ctx.lineTo( base[28], base[29] );
    ctx.stroke();

    ctx.strokeStyle  = 'blue';
    ctx.beginPath();
    ctx.moveTo( top[0], top[1] ); ctx.lineTo( top[4], top[5] );
    ctx.moveTo( top[8], top[9] ); ctx.lineTo( top[12], top[13] );
    ctx.moveTo( top[16], top[17] ); ctx.lineTo( top[20], top[21] );
    ctx.moveTo( top[24], top[25] ); ctx.lineTo( top[28], top[29] );
    ctx.stroke();*/

    /*for ( let i = 0; i < base.length; i+=4) {
        if ( i == 0 || i == 28 ) ctx.strokeStyle  = 'magenta';
        if ( i == 4 || i == 8 ) ctx.strokeStyle  = 'green';
        if ( i == 12 || i == 16 ) ctx.strokeStyle  = 'purple';
        if ( i == 20 || i == 24 ) ctx.strokeStyle  = 'red';
        ctx.beginPath();
        ctx.moveTo( base[i], base[i+1] );ctx.lineTo( top[i], top[i+1] );
        ctx.stroke();
    };*/
// bottom text
    ctx.fillStyle   = 'black';
    ctx.font = "18px serif";
    ctx.fillText( Elevators.volume_Pile_base(props.index), 25, ctx.canvas.height - 25 );
  
// splines
    ctx.strokeStyle  = 'blue';

    let tension = Tension_Base;
    let step = 10;

    let slices;
    let slice_step = 10;

    for ( let i = 0; i <= slice_step; i ++ ){
       // slices = getSlice( h/slice_step*i, Points_level, Tension_Base, Tension_Volume, true, step, Points_contur_L, Points_contur_W );
        //slices = gPile.get_Slice_Base( Number(pile.Height) / slice_step * i ); 
        slices = gPile.get_Slice_Base( h / slice_step * i );
        slices  = MoveMatrixAny( slices, 0, 0, -h/2 );
        slices  = ScaleMatrixAny1zoom( slices, zoom );
        slices  = RotateMatrix_X_any( slices, -100 );
        slices  = RotateMatrix_Y_any( slices, frameCount/4 );
        slices  = RotateMatrix_Z_any( slices, 0 );
        slices  = MoveMatrixAny( slices, x_center, y_center, 0 );
        draw_PLine_3D( ctx, slices );
    }

    let contur = gPile.get_Contur_Arc_Length;
        contur  = MoveMatrixAny( contur, 0, 0, -h/2 );
        contur  = ScaleMatrixAny1zoom( contur, zoom );
        contur  = RotateMatrix_X_any( contur, -100 );
        contur  = RotateMatrix_Y_any( contur, frameCount/4 );
        //contur  = RotateMatrix_Z_any( contur, 0 );
        contur  = MoveMatrixAny( contur, x_center, y_center, 0 );
        draw_PLine_3D( ctx, contur );

        //contur by widht*/
        contur  = gPile.get_Contur_Arc_Widht; 
        contur  = RotateMatrix_Z_any( contur, 90 )   
        contur  = MoveMatrixAny( contur, 0, 0, -h/2 );
        contur  = ScaleMatrixAny1zoom( contur, zoom );
        contur  = RotateMatrix_X_any( contur, -100 );
        contur  = RotateMatrix_Y_any( contur, frameCount/4 );
       // contur  = RotateMatrix_Z_any( contur, 0 );
        contur  = MoveMatrixAny( contur, x_center, y_center, 0 );
        draw_PLine_3D( ctx, contur );

    }

  useEffect(() => {
    
    const canvas = canvasRef.current
    const { width, height } = canvas.getBoundingClientRect()
    canvas.height = 545;
    canvas.width = width;
    const context = canvas.getContext('2d')
    let frameCount = 0
    let animationFrameId
    
    //Our draw came here
    const render = () => {
      frameCount++
      draw(context, frameCount)
      animationFrameId = window.requestAnimationFrame(render)
    }
    render()
    
    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [draw])
  
  return <canvas ref={canvasRef} {...props}/>
}

export default PileViewCanvas;

