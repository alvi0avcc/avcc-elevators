import React, { useRef, useEffect } from 'react';
import { Elevators } from './elevators.js';
import { Isometric, IsometricArr, Matrix, DecartToSphereArr, SphereToDecartArr } from './calc.js';
import { mat4 } from 'gl-matrix';
import { multiplyMatrices, translationMatrix, RotationX, RotationY, RotationZ, multiply, scaleMatrix } from './3d-matrix.js';

const PileViewCanvas = props => {
  
  const canvasRef = useRef(null)
  //let lastRenderTime = Date.now();
  let pile = Elevators.PileGet( props.index );

  const draw = (ctx, frameCount) => {

    let d      = Number( Elevators.SiloDimension.Diameter );
    let h1     = Number( Elevators.SiloDimension.h1 );
    let h2     = Number( Elevators.SiloDimension.h2 );
    let h3     = Number( Elevators.SiloDimension.h3 );
    let out     = Number( Elevators.SiloDimension.out );
    out = Math.sqrt( out );
    let sound  = Number( Elevators.SiloDimension.Sound );
    let ullage = Number( Elevators.SiloUllage );
    let z      = 10; //zoom
    /*if ( (h1+h2) >= d ) {
         z =  ( ctx.canvas.height - 60 )  / ( h1 + h2 );
        }
        else { 
            z = ( ctx.canvas.height -40 ) /  d ; 
        }*/
   
    //3d
    //let angle = [ 0.5, 0.5, 0.5 ];
    let angle = [ 0.5*frameCount/50, 0.5*frameCount/50, 0.5*frameCount/50 ];
      
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    
    let x1,y1,z1;
    x1 = pile.Base.length / 2;
    y1 = pile.Base.width / 2;
    z1 = pile.Height / 2;

    let base = [-x1,  -y1,  -z1, 1,
                -x1,   y1,  -z1, 1,
                 x1,   y1,  -z1, 1,
                 x1,  -y1,  -z1, 1 ];
               /* 0,  pile.Base.width,    0,
                pile.Base.length,pile.Base.width,0,
                pile.Base.length,0,0,
                0,0,0];*/

    let x2,y2,z2;
    x2 = pile.Top.length / 2;
    y2 = pile.Top.width / 2;
    z2 = pile.Height / 2;

    let top = [ -x2,  -y2,  z2, 1,
                -x2,   y2,  z2, 1,
                 x2,   y2,  z2, 1,
                 x2,  -y2,  z2, 1 ];
               

    let rotateX = RotationX( -100 );
    let rotateY = RotationY( frameCount/4 );
    let rotateZ = RotationZ( 0 );
    let scale = scaleMatrix ( 10, 10, 10 );
    let move = translationMatrix( 20, 15, 0 );
    //console.log('rotate= ', rotate  );
    base  = multiplyMatrices( rotateX, base );
    base  = multiplyMatrices( rotateY, base );
    base  = multiplyMatrices( rotateZ, base );
    base  = multiplyMatrices( move, base );
    base  = multiplyMatrices( scale, base );

    top  = multiplyMatrices( rotateX, top );
    top  = multiplyMatrices( rotateY, top );
    top  = multiplyMatrices( rotateZ, top );
    top  = multiplyMatrices( move, top );
    top  = multiplyMatrices( scale, top );

    ctx.strokeStyle  = 'green';
    ctx.beginPath();
    ctx.moveTo( base[0], base[1] );
    ctx.lineTo( base[4], base[5] );
    ctx.lineTo( base[8], base[9] ); 
    ctx.lineTo( base[12], base[13] );
    ctx.lineTo( base[0], base[1] );
    ctx.stroke();

    ctx.strokeStyle  = 'blue';
    ctx.beginPath();
    ctx.moveTo( top[0], top[1] );
    ctx.lineTo( top[4], top[5] );
    ctx.lineTo( top[8], top[9] ); 
    ctx.lineTo( top[12], top[13] );
    ctx.lineTo( top[0], top[1] );
    ctx.stroke();

    ctx.strokeStyle  = 'red';
    ctx.beginPath();
    ctx.moveTo( base[0], base[1] );
    ctx.lineTo( top[0], top[1] );
    ctx.moveTo( base[4], base[5] );
    ctx.lineTo( top[4], top[5] );
    ctx.moveTo( base[8], base[9] );
    ctx.lineTo( top[8], top[9] );
    ctx.moveTo( base[12], base[13] );
    ctx.lineTo( top[12], top[13] );
    ctx.stroke();
    

  }
  
  useEffect(() => {
    
    const canvas = canvasRef.current
    canvas.height = 300;
    canvas.width = 400;
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