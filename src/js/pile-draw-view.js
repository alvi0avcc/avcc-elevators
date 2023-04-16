import React, { useRef, useEffect } from 'react';
import { Elevators } from './elevators.js';
import { Isometric, IsometricArr, Matrix, DecartToSphereArr, SphereToDecartArr } from './calc.js';
import { mat4 } from 'gl-matrix';
import * as Calc from './calc.js';
import { MoveMatrix, MoveMatrixAny, RotateMatrix_X, RotateMatrix_X_any, RotateMatrix_Y, RotateMatrix_Y_any, RotateMatrix_Z, RotateMatrix_Z_any, ScaleMatrix, ScaleMatrixAny, ScaleMatrixAny1zoom } from './3d-matrix.js';

const PileViewCanvas = props => {
  
  const canvasRef = useRef(null);

  let pile = Elevators.PileGet( props.index );

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
    let c1 = Number(pile.Base.r1);
    let c2 = Number(pile.Base.r2);
    let c3 = Number(pile.Base.r3);
    let c4 = Number(pile.Base.r4);
    let x1 = -l/2 + c1;
    let x2 =  l/2 - c2;
    let x3 =  l/2;
    let x4 =  x3;
    let x5 =  l/2 - c3;
    let x6 = -l/2 + c4;
    let x7 = -l/2;
    let x8 =  x7;
    let y1 = -w/2;
    let y2 =  y1;
    let y3 = -w/2 + c2;
    let y4 =  w/2 - c3;
    let y5 =  w/2;
    let y6 =  y5;
    let y7 =  w/2 - c4;
    let y8 = -w/2 + c1;
    let z1 = -h/2;

    let base = [ x1, y1, z1, 1,
                 x2, y2, z1, 1,
                 x3, y3, z1, 1,
                 x4, y4, z1, 1, 
                 x5, y5, z1, 1,
                 x6, y6, z1, 1,
                 x7, y7, z1, 1,
                 x8, y8, z1, 1
                ];

     let ll = Number(pile.Top.length);
     let l_left = Number(pile.Top.length_left);
     let l_right = Number(pile.Top.length_right);
     let ww = Number(pile.Top.width);
     let w_front = Number(pile.Top.width_front);
     let w_aft = Number(pile.Top.width_aft);
     let cc1 = Number(pile.Top.r1);
     let cc2 = Number(pile.Top.r2);
     let cc3 = Number(pile.Top.r3);
     let cc4 = Number(pile.Top.r4);
     let xx1 = -l/2 + l_left + cc1;
     let xx2 =  l/2 - l_right - cc2;
     let xx3 =  l/2 - l_right;
     let xx4 =  xx3;
     let xx5 =  l/2 - l_right - cc3;
     let xx6 = -l/2 + l_left + cc4;
     let xx7 = -l/2 + l_left;
     let xx8 =  xx7;
     let yy1 = -w/2 + w_aft;
     let yy2 =  yy1;
     let yy3 = -w/2  + w_aft + cc2;
     let yy4 =  w/2 - w_front - cc3;
     let yy5 =  w/2 - w_front;
     let yy6 =  yy5;
     let yy7 =  w/2 - w_front - cc4;
     let yy8 = -w/2 + w_aft + cc1;
     let zz1 = h/2;

    let top = [ xx1, yy1, zz1, 1,
                xx2, yy2, zz1, 1,
                xx3, yy3, zz1, 1,
                xx4, yy4, zz1, 1, 
                xx5, yy5, zz1, 1,
                xx6, yy6, zz1, 1,
                xx7, yy7, zz1, 1,
                xx8, yy8, zz1, 1
                ];
//-------------------------------------Corner 1
    let corner_b = [];
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

    ctx.strokeStyle  = 'magenta';
    ctx.beginPath();
    for ( let i = 4; i < corner_b.length; i=i+4 ){
        ctx.moveTo( corner_b[i-4], corner_b[i+1-4] ); ctx.lineTo( corner_b[i], corner_b[i+1] );  
        ctx.lineTo( corner_t[i], corner_t[i+1] ); ctx.lineTo( corner_t[i-4], corner_t[i+1-4] ); 
    }
    ctx.stroke();
//-------------------------------------
//-------------------------------------Corner 2
if ( pile.Base.r2t == 'true' ) {
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

ctx.strokeStyle  = 'green';
ctx.beginPath();
for ( let i = 0; i < corner_b.length; i=i+4 ){
    ctx.moveTo( corner_b[i-4], corner_b[i+1-4] ); ctx.lineTo( corner_b[i], corner_b[i+1] );  
    ctx.lineTo( corner_t[i], corner_t[i+1] ); ctx.lineTo( corner_t[i-4], corner_t[i+1-4] );   
}
ctx.stroke();
//-------------------------------------
//-------------------------------------Corner 3
if ( pile.Base.r3t == 'true' ) {
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

ctx.strokeStyle  = 'purple';
ctx.beginPath();
for ( let i = 0; i < corner_b.length; i=i+4 ){
    ctx.moveTo( corner_b[i-4], corner_b[i+1-4] ); ctx.lineTo( corner_b[i], corner_b[i+1] );  
    ctx.lineTo( corner_t[i], corner_t[i+1] ); ctx.lineTo( corner_t[i-4], corner_t[i+1-4] );   
}
ctx.stroke();
//-------------------------------------
//-------------------------------------Corner 4
if ( pile.Base.r4t == 'true' ) {
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

ctx.strokeStyle  = 'red';
ctx.beginPath();
for ( let i = 0; i < corner_b.length; i=i+4 ){
    ctx.moveTo( corner_b[i-4], corner_b[i+1-4] ); ctx.lineTo( corner_b[i], corner_b[i+1] );  
    ctx.lineTo( corner_t[i], corner_t[i+1] ); ctx.lineTo( corner_t[i-4], corner_t[i+1-4] );   
}
ctx.stroke();
//-------------------------------------
               
    base  = ScaleMatrixAny1zoom( base, zoom );
    base  = RotateMatrix_X_any( base, -100 );
    base  = RotateMatrix_Y_any( base, frameCount/4 );
    base  = RotateMatrix_Z_any( base, 0 );
    base  = MoveMatrixAny( base, x_center, y_center, 0 );
    

    top  = ScaleMatrixAny1zoom( top, zoom );
    top  = RotateMatrix_X_any( top, -100 );
    top  = RotateMatrix_Y_any( top, frameCount/4 );
    top  = RotateMatrix_Z_any( top, 0 );
    top  = MoveMatrixAny( top, x_center, y_center, 0 );

    ctx.strokeStyle  = 'black';
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
    ctx.stroke();

    for ( let i = 0; i < base.length; i=i+4) {
        if ( i == 0 || i == 28 ) ctx.strokeStyle  = 'magenta';
        if ( i == 4 || i == 8 ) ctx.strokeStyle  = 'green';
        if ( i == 12 || i == 16 ) ctx.strokeStyle  = 'purple';
        if ( i == 20 || i == 24 ) ctx.strokeStyle  = 'red';
        ctx.beginPath();
        ctx.moveTo( base[i], base[i+1] );ctx.lineTo( top[i], top[i+1] );
        ctx.stroke();
    };

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

