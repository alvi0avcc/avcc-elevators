import React, { useRef, useEffect } from 'react';
import { Elevators } from './elevators.js';

const Canvas = props => {
  
  const canvasRef = useRef(null)
  
  const draw = (ctx) => {
    let d      = Number( Elevators.SiloDimension.Diameter );
    let h1     = Number( Elevators.SiloDimension.h1 );
    let h2     = Number( Elevators.SiloDimension.h2 );
    let sound  = Number( Elevators.SiloDimension.Sound );
    let ullage = Number( Elevators.SiloUllage );
    let z      = 1; //zoom
    if ( (h1+h2) >= d ) {
         z =  ( ctx.canvas.height - 10 )  / ( h1 + h2 );
        }
        else { 
            z = ( ctx.canvas.height -10 ) /  d ; 
        }
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.strokeStyle  = 'black';
    ctx.lineWidth = 2.0;
    //цилиндр
    ctx.strokeRect(  265/2-d*z/2 , 260, d*z, -h1*z )
    //конус
    ctx.beginPath();
    ctx.moveTo(  265/2-d*z/2 , 260 - h1*z );
    ctx.lineTo( 265/2, 260 - (h1+h2)*z ) ;
    ctx.lineTo( 265/2+d*z/2, 260 - h1*z ) ;
    ctx.stroke();
    //уровень замерной точки
    ctx.lineWidth = 1.0;
    ctx.strokeStyle  = 'red';
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(  5 , 260 - sound * z );
    ctx.lineTo( 395, 260 - sound * z );
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo( 350 , 260 - sound * z );
    ctx.lineTo( 350 , 260 );
    ctx.moveTo( 350-5, 260 - sound * z + 15);
    ctx.lineTo( 350 , 260 - sound * z );
    ctx.lineTo( 350+5 , 260 - sound * z + 15);
    ctx.stroke();
    ctx.fillStyle   = 'red';
    ctx.font = "18px serif";
    ctx.fillText("Measuring point level", 225, 260 - sound * z -2 );
    //уровень груза
    ctx.lineWidth = 1.0;
    ctx.setLineDash([2, 2])
    ctx.strokeStyle  = 'green';
    ctx.beginPath();
    ctx.moveTo(  5 , 260 - (sound-ullage) * z );
    ctx.lineTo( 280, 260 - (sound-ullage) * z );
    ctx.stroke();
    ctx.fillStyle   = 'green';
    ctx.font = "18px serif";
    ctx.fillText("Ullage (level of cargo)", 40, 260 - (sound-ullage) * z -2);
    ctx.lineWidth = 0.5;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo( 270 , 260 - (sound-ullage) * z );
    ctx.lineTo( 270 , 260 - sound * z );
    ctx.moveTo( 270-5, 260 - (sound-ullage) * z - 15);
    ctx.lineTo( 270 , 260 - (sound-ullage) * z );
    ctx.lineTo( 270+5 , 260 - (sound-ullage) * z - 15);
    ctx.stroke();
  }
  
  useEffect(() => {
    
    const canvas = canvasRef.current
    canvas.height = 265;
    canvas.width = 400;
    const context = canvas.getContext('2d')

      draw(context)

    }, [draw])
  
  return <canvas ref={canvasRef} {...props}/>
}

export default Canvas