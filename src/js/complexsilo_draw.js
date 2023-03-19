import React, { useRef, useEffect } from 'react';
import { Elevators } from './elevators.js';

const Canvas = props => {
  
  const canvasRef = useRef(null);

  const draw = (ctx) => {
    let Complex = Elevators.ComplexAll;
    let row     = Complex.Silo.length;
    let items   = 0;
    console.log('Complex=',Complex);
    //let height = Complex.TotalDimension.height;
    let length = Number( Complex.TotalDimension.Length );
    let width =  Number( Complex.TotalDimension.Width );
    let xc = ctx.canvas.width;
    let yc = ctx.canvas.height;
    let z1      = 1; //zoom width
    let z2      = 1; //zoom length
    let z      = 1; //zoom
    z1 = ( xc - 10 )  / length ;
    z2 = ( yc - 10 ) /  width ;
    if ( z1 > z2 ) { z = z2 } else z = z1;
    console.log('zoom=',z); 
    console.log('xc=',xc);
    console.log('yc=',yc);   
    console.log('length=',length);
    console.log('width=',width);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.strokeStyle  = 'black';
    ctx.lineWidth = 2.0;
    //общий габирит комплекса
    ctx.strokeRect(  5, yc-5, length*z, -width*z );
    //прямоугольный силос
    let x, y = 0; //размеры прямоугольнпго силоса
    for ( let i = 0; i < row; i++ ) {
        items = Complex.Silo[ i ].length; 
        for ( let ii = 0; ii < items; ii++ ) {
            //console.log('Complex.Silo.Dimensions=',Complex.Silo[0][0].Dimensions);
            x = Complex.Silo[i][ii].Dimensions.Length;
            y = Complex.Silo[i][ii].Dimensions.Width;
            ctx.strokeRect(  10+ii*x*z+ii*z*0.5, yc-10-i*y*z-i*z*0.5, x*z, -y*z );
        }
    }
    //ctx.strokeRect(  10, y -5, 3*z, -3*z );
    //круглый силос
    //ctx.beginPath();
    //ctx.arc(75,75,50,0,Math.PI*2);
    //ctx.stroke();
  }
  
  useEffect(() => {
    
    const canvas = canvasRef.current
    canvas.height = 300;
    canvas.width = 1000;
    const context = canvas.getContext('2d')

      draw(context)

    }, [draw])
  
  return <canvas ref={canvasRef} {...props}/>
}

export default Canvas

