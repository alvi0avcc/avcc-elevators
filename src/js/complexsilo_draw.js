import React, { useRef, useEffect } from 'react';
import { Elevators } from './elevators.js';

var Zoom = 1;

const Canvas = props => {
  
  const canvasRef = useRef(null);

  const draw = (ctx) => {
    let Complex = Elevators.ComplexAll;
    let row     = Complex.Silo.length;
    let items   = 0;
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
    Zoom = z;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.strokeStyle  = 'black';
    ctx.lineWidth = 2.0;
    //общий габирит комплекса
    //ctx.strokeRect(  5, 5, length*z, width*z );
    //прямоугольный силос
    let x=0, y = 0; //размеры прямоугольного силоса
    let x1,x2,y1,y2;
    let l=0,w=0;
    let d = 0; //диаметр силоса
    let mesh = MeshSilo();
    let grid = mesh.Mesh;
    let delta = mesh.delta*Zoom;
    for ( let i = 0; i < row; i++ ) {
        items = Complex.Silo[ i ].length; 
        for ( let ii = 0; ii < items; ii++ ) {
            //x = x + Complex.Silo[i][ii].Dimensions.Length;
            //y = y + Complex.Silo[i][ii].Dimensions.Width;
            //d = Complex.Silo[i][ii].Dimensions.Diameter;
            l = Complex.Silo[i][ii].Dimensions.Length * Zoom;
            w = Complex.Silo[i][ii].Dimensions.Width * Zoom;
            x1 = grid[i][ii+1] - delta/2 - l;
            x2 = l;
            y1 = grid[i][0] - delta/2 - w;
            y2 = w;
            if ( Complex.Silo[ i ][ ii ].Type == 'square' )
                ctx.strokeRect( x1, y1, x2, y2 );
                ctx.font = "12px serif";
                ctx.fillText(Complex.Silo[ i ][ ii ].Name, x1, y1 );
                //ctx.fillText("CargoName", 10+ii*x*z+ii*z*0.5, 20+i*y*z+i*z*0.5);
                //ctx.fillText("Ullage", 10+ii*x*z+ii*z*0.5, 30+i*y*z+i*z*0.5);
                //ctx.fillText("Massa", 10+ii*x*z+ii*z*0.5, 40+i*y*z+i*z*0.5);
            if ( Complex.Silo[ i ][ ii ].Type == 'circle' ){   
                ctx.beginPath();
                ctx.arc( 10+ii*x*z+ii*z*0.5 + d/2*z , 10+i*y*z+i*z*0.5 + d/2*z , d/2*z , 0 , Math.PI*2 );
                ctx.stroke();
            }
            if ( Complex.Silo[ i ][ ii ].Type == 'star' ){   
                ctx.beginPath();
                ctx.arc( 10+ii*x*z+ii*z*0.5 + d/2*z , 10+i*y*z+i*z*0.5 + d*z , d/2*z , 3.14*1.5 , 0 );
                ctx.arc( 10+ii*x*z+ii*z*0.5 + d*z + d/2*z , 10+i*y*z+i*z*0.5 + d*z , d/2*z , 3.14 , 3.14*1.5 );
                ctx.arc( 10+ii*x*z+ii*z*0.5 + d*z + d/2*z , 10+i*y*z+i*z*0.5 , d/2*z , 3.14/2 , 3.14 );
                ctx.arc( 10+ii*x*z+ii*z*0.5 + d/2*z  , 10+i*y*z+i*z*0.5 , d/2*z , 0 , 3.14/2 );
                ctx.stroke();
            }
        }
    }
    ctx.strokeStyle  = 'green';
    ctx.beginPath();
    for ( let i =0 ; i < grid.length; i++ ) {
    for ( let ii =1 ; ii < grid[i].length; ii++ ) {
        ctx.moveTo(  0 , grid[i][0] );
        ctx.lineTo( grid[i][ii], grid[i][0] );
        if ( i == 0 ) { ctx.moveTo(  grid[i][ii], 0 ) }
            else { ctx.moveTo(  grid[i][ii], grid[i-1][0] ) }
        ctx.lineTo(  grid[i][ii], grid[i][0] );
    }
    }   
    ctx.stroke();
  }
  
  useEffect(() => {
    
    const canvas = canvasRef.current
    canvas.height = 300;
    canvas.width = 1000;
    const context = canvas.getContext('2d')

    if ( Elevators.ComplexSiloFound > 0 ) { draw(context) };

    }, [draw])
  
  return <canvas ref={canvasRef} {...props}/>
}

export default Canvas

export function findComplexSilo( X, Y ){
    let result;
    let ix = 0;
    let iy = 0;
    if ( Elevators.ComplexSiloFound > 0 ) {
        let info = Elevators.ComplexAll;
        let array_Silo = MeshSilo().Mesh;
        for ( let row = 0; row < array_Silo.length; row++ ) { if ( Y >= array_Silo[row][0] ) { iy = row + 1; } }
        if ( iy > Elevators.ComplexAll.Silo.length-1 ) iy = Elevators.ComplexAll.Silo.length-1;

        for ( let col = 1; col < array_Silo[iy].length; col++ ) { if ( X >= array_Silo[iy][col] ) { ix = col ; } }
        if ( ix > Elevators.ComplexAll.Silo[iy].length-1 ) ix = Elevators.ComplexAll.Silo[iy].length-1;
        result = info.Silo[iy][ix];
    }
    return {result, row: iy, col: ix };
}

function MeshSilo (){
    let array_Silo = [];
    let x = 0;
    let y = 0;
    let d =2; // условная дистанция между силосами в метрах
    if ( Elevators.ComplexSiloFound > 0 ) {
    let info = Elevators.ComplexAll.Silo;
    for ( let row = 0; row < info.length; row++ ) {
        y = y + Number( info[row][0].Dimensions.Width ) * Zoom + d * Zoom; //выбрать наибольший
        array_Silo.push( [] )
        array_Silo[row].push([]);
        array_Silo[row][0] = y;
        x = 0;
        for ( let col = 0; col < info[row].length; col++ ) {
                x = x + Number( info[row][col].Dimensions.Length ) * Zoom + d * Zoom;
                array_Silo[ row ].push( x );
            }
    }
    }
return { Mesh: array_Silo, max_X: x, max_Y: y , delta: d } ;
};