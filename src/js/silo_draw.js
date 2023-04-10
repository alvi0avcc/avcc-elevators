import React, { useRef, useEffect } from 'react';
import { Elevators } from './elevators.js';

const Canvas = props => {
  
  const canvasRef = useRef(null)
  
  const draw = (ctx) => {
    let d      = Number( Elevators.SiloDimension.Diameter );
    let h1     = Number( Elevators.SiloDimension.h1 );
    let h2     = Number( Elevators.SiloDimension.h2 );
    let h3     = Number( Elevators.SiloDimension.h3 );
    let out     = Number( Elevators.SiloDimension.out );
    out = Math.sqrt( out );
    let sound  = Number( Elevators.SiloDimension.Sound );
    let ullage = Number( Elevators.SiloUllage );
    let z      = 1; //zoom
    if ( (h1+h2) >= d ) {
         z =  ( ctx.canvas.height - 40 )  / ( h1 + h2 );
        }
        else { 
            z = ( ctx.canvas.height -40 ) /  d ; 
        }
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.strokeStyle  = 'black';
    ctx.lineWidth = 2.0;
    //цилиндр
    ctx.strokeRect(  400/2-d*z/2 , 260, d*z, -h1*z )
    //конус
    ctx.beginPath();
    ctx.moveTo(  400/2-d*z/2 , 260 - h1*z );
    ctx.lineTo( 400/2, 260 - (h1+h2)*z ) ;
    ctx.lineTo( 400/2+d*z/2, 260 - h1*z ) ;
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
    ctx.moveTo( 370 , 260 - sound * z );
    ctx.lineTo( 370 , 260 );
    ctx.moveTo( 370-5, 260 - sound * z + 15);
    ctx.lineTo( 370 , 260 - sound * z );
    ctx.lineTo( 370+5 , 260 - sound * z + 15);
    ctx.stroke();
    ctx.fillStyle   = 'red';
    ctx.font = "18px serif";
    ctx.fillText("Measuring point level", 220, 260 - sound * z -2 );
    //уровень груза
    ctx.lineWidth = 1.0;
    ctx.setLineDash([2, 2])
    ctx.strokeStyle  = 'green';
    ctx.beginPath();
    ctx.moveTo(  5 , 260 - (sound-ullage) * z );
    ctx.lineTo( 200+d/2*z, 260 - (sound-ullage) * z );
    ctx.stroke();
    ctx.fillStyle   = 'green';
    ctx.font = "18px serif";
    ctx.fillText("Ullage (level of cargo)", 30, 260 - (sound-ullage) * z -2);
    ctx.lineWidth = 0.5;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo( 20 , 260 - (sound-ullage) * z );
    ctx.lineTo( 20 , 260 - sound * z );
    ctx.moveTo( 20-5, 260 - (sound-ullage) * z - 15);
    ctx.lineTo( 20 , 260 - (sound-ullage) * z );
    ctx.lineTo( 20+5 , 260 - (sound-ullage) * z - 15);
    ctx.stroke();
    // base
    ctx.strokeStyle  = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(  400/2-d*z/2 - 5*z , 260, (d+10)*z, 4*z )
    // bottom conus
    ctx.strokeStyle  = 'blue';
    ctx.beginPath();
    ctx.moveTo(  400/2-d*z/2 , 260 );
    ctx.lineTo( 400/2-out/2*z, 260 + h3*z ) ;
    ctx.lineTo( 400/2+out/2*z, 260 + h3*z ) ;
    ctx.lineTo( 400/2+d*z/2, 260 ) ;
    ctx.stroke();
    // level bottom conus
    ctx.lineWidth = 1.0;
    ctx.setLineDash([2, 2])
    ctx.strokeStyle  = 'blue';
    ctx.beginPath();
    ctx.moveTo(  5 , 260 + h3 * z );
    ctx.lineTo( 200+d/2*z, 260 + h3 * z );
    ctx.stroke();

    ctx.lineWidth = 0.5;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.fillStyle   = 'blue';
    ctx.font = "18px serif";
    ctx.fillText("Level bottom conus", 35, 260 + h3 * z -2);
    ctx.moveTo( 20 , 260 + h3 * z );
    ctx.lineTo( 20 , 260 );
    ctx.moveTo( 20-5, 260 + h3 * z - 15);
    ctx.lineTo( 20 , 260 + h3 * z );
    ctx.lineTo( 20+5 , 260 + h3 * z - 15);
    ctx.stroke();
  }
  
  useEffect(() => {
    
    const canvas = canvasRef.current
    canvas.height = 300;
    canvas.width = 400;
    const context = canvas.getContext('2d')

      draw(context)

    }, [draw])
  
  return <canvas ref={canvasRef} {...props}/>
}

export default Canvas