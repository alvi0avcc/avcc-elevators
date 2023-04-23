import React, { useRef, useEffect } from 'react';
import { Elevators } from './elevators.js';
import { Isometric, IsometricArr, Matrix, DecartToSphereArr, SphereToDecartArr } from './calc.js';
//import { mat4 } from 'gl-matrix';
import * as Calc from './calc.js';
import cPile from './pile_class.js'
import { get_Max_Y_3D, getCurvePoints, drawLines, drawCurve, getPoint, drawPoint, drawPoints, getSlice, drawSlice, drawContur, getContur, getPoints_by_Y, interpolation } from './spline.js';
import { MoveMatrix, MoveMatrixAny, RotateMatrix_X, RotateMatrix_X_any, RotateMatrix_Y, RotateMatrix_Y_any, RotateMatrix_Z, RotateMatrix_Z_any, ScaleMatrix, ScaleMatrixAny, ScaleMatrixAny1zoom } from './3d-matrix.js';
import { draw_PLine_3D, draw_PLine_3D_between, draw_underBase } from './draw.js';
import { ContactlessOutlined } from '@mui/icons-material';


const PileViewCanvas = props => {

    //const [value, setValue] = React.useState(true);

    const changeAngleX = (event) => {
        pile.angle_X = event.target.value;
        Elevators.setAngleView( props.index, pile.angle_X, pile.angle_Y, pile.angle_Z );
        //setValue(!value);
    };

    const changeAngleX_minus = (event) => {
        pile.angle_X = pile.angle_X - 5;
        Elevators.setAngleView( props.index, pile.angle_X, pile.angle_Y, pile.angle_Z );
        //setValue(!value);
    };

    const changeAngleX_plus = (event) => {
        pile.angle_X = pile.angle_X + 5;
        Elevators.setAngleView( props.index, pile.angle_X, pile.angle_Y, pile.angle_Z );
        //setValue(!value);
    };

    const changeAngleY_minus = (event) => {
        pile.angle_Y = pile.angle_Y - 5;
        Elevators.setAngleView( props.index, pile.angle_X, pile.angle_Y, pile.angle_Z );
        //setValue(!value);
    };

    const changeAngleY_plus = (event) => {
        pile.angle_Y = pile.angle_Y + 5;
        Elevators.setAngleView( props.index, pile.angle_X, pile.angle_Y, pile.angle_Z );
        //setValue(!value);
    };

    const changeAngleZ = (event) => {
        pile.angle_Z = event.target.value;
        Elevators.setAngleView( props.index, pile.angle_X, pile.angle_Y, pile.angle_Z );
        //setValue(!value);
    };
  
    const canvasRef = useRef(null);

    let mode = props.mode;

    let pile = Elevators.PileGet( props.index );

//-------------------------------------------------------------
  const draw = (ctx, frameCount) => {

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);


    if ( mode ) { Pile_Draw( ctx, props.index, mode, props.index ); 
    } else {
            for (let i = 0; i < Elevators.PileFound; i ++ ) {

                Pile_Draw( ctx, i, mode, props.index  );
            }
        }

  }
//-------------------------------------------------------------

  useEffect(() => {
    
    const canvas = canvasRef.current;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.height = height;
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
  
  return (
    <div>
        <div style={{ display: 'flex', flexDirection: 'row', height: 570 }}>
        
        <canvas ref={canvasRef} {...props} style={{ width: '100%', height: '100%' }}/>

            <div className='block' style={{ marginLeft: -91, padding: 1 }} >
                <button
                className='myButton'
                style={{ width: 80 }}
                onClick={ ()=> { pile.angle_X = 0; pile.angle_Y = 0; pile.angle_Z = 0; Elevators.setAngleView( props.index, pile.angle_X, pile.angle_Y, pile.angle_Z ); } }
                >
                Up
                </button>

                <button 
                className='myButton'
                style={{ width: 80 }}
                onClick={ ()=> { pile.angle_X = -90; pile.angle_Y = 0; pile.angle_Z = 0; Elevators.setAngleView( props.index, pile.angle_X, pile.angle_Y, pile.angle_Z ); } }
                >
                Front
                </button>

                <button 
                className='myButton'
                style={{ width: 80 }}
                onClick={ ()=> { pile.angle_X = -90; pile.angle_Y = 90; pile.angle_Z = 0; Elevators.setAngleView( props.index, pile.angle_X, pile.angle_Y, pile.angle_Z ); } }
                >
                Side
                </button>
            
                <button 
                className='myButton'
                style={{ width: 80 }}
                onClick={ ()=> { pile.angle_X = -70; pile.angle_Y = 15; pile.angle_Z = -10; Elevators.setAngleView( props.index, pile.angle_X, pile.angle_Y, pile.angle_Z ); } }
                >
                3D
                </button>

                <div><hr/></div>
                
                <div style={{ margin: -3 }}>

                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                        <button
                        className='myButtonRound'
                        style={{ width: 30, height: 30 }}
                        onClick={changeAngleX_minus}
                        >▲</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: -7, marginBottom: -7 }}>   
                    
                        <button
                            className='myButtonRound'
                            style={{ width: 30, height: 30 }}
                            onClick={changeAngleY_plus}
                        >◄</button>

                        <button
                            className='myButtonRound'
                            style={{ width: 30, height: 30 }}
                            onClick={changeAngleY_minus}
                        >►</button>
                            
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                        <button
                        className='myButtonRound'
                        style={{ width: 30, height: 30 }}
                        onClick={changeAngleX_plus}
                        >▼</button>
                    </div>

                </div>

                <div><hr/></div>

                <label className='myText'>View Mode:</label>

                <button
                        className='myButton'
                        style={{ width: 80, height: 30 }}
                        onClick={ ()=>{ props.callback( true ); } }
                        >Model</button>

                    <button
                        className='myButton'
                        style={{ width: 80, height: 30 }}
                        onClick={ ()=>{ props.callback( false ); } }
                        >Location</button>

                </div>
        </div> 
    </div>
  )
};

export default PileViewCanvas;

//----------------------------------------------------------------------

function Pile_Draw( ctx, index, mode, boss_index ){

    let boss_pile = Elevators.PileGet( boss_index );
    let pile = Elevators.PileGet( index );

    let gPile = new cPile();

    if ( boss_pile.angle_X == undefined ) boss_pile.angle_X = -70;
    if ( boss_pile.angle_Y == undefined ) boss_pile.angle_Y = 15;
    if ( boss_pile.angle_Z == undefined ) boss_pile.angle_Z = -10;
    let angle_X = boss_pile.angle_X;
    let angle_Y = boss_pile.angle_Y;
    let angle_Z = boss_pile.angle_Z;

    let line_width = 1;
    let slice_step = 25;

    if ( boss_pile.numOfSegments == undefined ) boss_pile.numOfSegments = 10;
    let numOfSegments = boss_pile.numOfSegments;
    if ( !mode & index != boss_index ) {
        numOfSegments = 5;
        slice_step = 10;
    }



    gPile.set_Initial_Data_Complex ( pile, numOfSegments );//initialisation Pile

    let x_center  = ( ctx.canvas.width - 90 ) / 2;
    let y_center = ctx.canvas.height/2;
    let z_center = 0;

    let l = Number(pile.Base.length);
    let w = Number(pile.Base.width);
    let h = Number(pile.Height);
    let uH = Number(pile.underBase_Height);
    let dh = 0;
    let total_H = uH + h;

    dh = -h/2 + uH/2;

    let floor_lenght = Elevators.FloorCurrentDimensions.Length;
    let floor_width = Elevators.FloorCurrentDimensions.Width;
    let floor_height = Elevators.FloorCurrentDimensions.Height;

    let zoom = 1;

    let volume;

    let x_location = pile.X;
    let y_location = pile.Y;
    let z_location = 0;
    let angle = pile.angle;

    if ( mode ) {
        let zoom_L = ( ctx.canvas.width - 90 ) / l;
        let zoom_W = ctx.canvas.height / w;
        let zoom_H = ctx.canvas.height / total_H;
        zoom = Math.min( zoom_L, zoom_W, zoom_H );
        zoom = zoom * 0.9 ;

        x_location = 0;
        y_location = 0;
        z_location = 0;

        line_width = 1;

        // bottom text
        ctx.fillStyle   = 'black';
        ctx.font = "18px serif";
        volume = gPile.get_Volume;
        ctx.fillText( 'Upper Pile Volume = '+ volume.volume2 +' (m3)', 25, ctx.canvas.height - 65 );
        ctx.fillText( 'Base Pile Volume = '+ volume.volume1 +' (m3)', 25, ctx.canvas.height - 45 );
        ctx.fillText( 'Internal Pile Volume = '+ volume.volume3 +' (m3)', 25, ctx.canvas.height - 25 );
        ctx.fillText( 'Total Volume = '+ volume.volume +' (m3)', 25, ctx.canvas.height - 5 );

    } else {

        let zoom_L = ( ctx.canvas.width - 90 ) / floor_lenght;
        let zoom_W = ctx.canvas.height / floor_width;
        let zoom_H = ctx.canvas.height / floor_height;
        zoom = Math.min( zoom_L, zoom_W, zoom_H );
        zoom = zoom * 0.9 ;

        x_location = pile.X - floor_lenght / 2;
        y_location = floor_width / 2 - pile.Y;
        z_location = total_H / 2 - floor_height / 2;

        line_width = 0.2;

        if ( index == boss_index ) {

            line_width = 2;

            let floor_points = [-floor_lenght /2, -floor_width / 2, 0, 1,
                                -floor_lenght /2,  floor_width / 2, 0, 1,
                                 floor_lenght /2,  floor_width / 2, 0, 1,
                                 floor_lenght /2, -floor_width / 2, 0, 1,
                                -floor_lenght /2, -floor_width / 2, 0, 1];
            floor_points  = MoveMatrixAny( floor_points, 0, 0, -floor_height / 2 );
            floor_points  = ScaleMatrixAny1zoom( floor_points, zoom );
            floor_points  = RotateMatrix_X_any( floor_points, angle_X );
            floor_points  = RotateMatrix_Y_any( floor_points, angle_Y );
            floor_points  = RotateMatrix_Z_any( floor_points, angle_Z );
            floor_points  = MoveMatrixAny( floor_points, x_center, y_center, z_center );
            ctx.strokeStyle  = 'green';
            ctx.lineWidth = 4;
            draw_PLine_3D( ctx, floor_points );
        }
    }


    

// Pile (splines)
if ( pile.Height > 0 ){

    let slices;
    let slices_old;
    let max = get_Max_Y_3D( gPile.get_Contur_Arc_Length ) - 0.0001;
    let level = 0;

    for ( let i = 0; i <= slice_step; i ++ ){
        level = max / slice_step * i;
        slices = gPile.get_Slice_Base( level );
        slices  = MoveMatrixAny( slices, x_location, y_location, dh + z_location );
        slices  = ScaleMatrixAny1zoom( slices, zoom );
        slices  = RotateMatrix_X_any( slices, angle_X );
        slices  = RotateMatrix_Y_any( slices, angle_Y );
        slices  = RotateMatrix_Z_any( slices, angle_Z );
        slices  = MoveMatrixAny( slices, x_center, y_center, z_center );
        ctx.strokeStyle  = 'blue';
        if ( i == 0 ) ctx.strokeStyle  = 'magenta';
        if ( i == 0 ) { ctx.lineWidth = line_width * 2; draw_PLine_3D( ctx, slices ); }
        if ( i > 0) { 
            ctx.strokeStyle  = 'blue';
            ctx.lineWidth = line_width / 2;
            if ( i != 0 & i != slice_step ) draw_PLine_3D( ctx, slices );
            draw_PLine_3D_between( ctx, slices, slices_old );
        }
        slices_old = slices.slice(0);

    };

    if ( mode ){
        slices  = gPile.get_Slice_Base( h );
        slices  = MoveMatrixAny( slices, x_location, y_location, dh + z_location );
        slices  = ScaleMatrixAny1zoom( slices, zoom );
        slices  = RotateMatrix_X_any( slices, angle_X );
        slices  = RotateMatrix_Y_any( slices, angle_Y );
        slices  = RotateMatrix_Z_any( slices, angle_Z );
        slices  = MoveMatrixAny( slices, x_center , y_center , z_center );
        ctx.strokeStyle  = 'red';
        ctx.lineWidth = line_width * 2;
        draw_PLine_3D( ctx, slices );

        let contur = gPile.get_Contur_Arc_Length;
        contur  = MoveMatrixAny( contur, x_location, y_location, dh + z_location );
        contur  = ScaleMatrixAny1zoom( contur, zoom );
        contur  = RotateMatrix_X_any( contur, angle_X );
        contur  = RotateMatrix_Y_any( contur, angle_Y );
        contur  = RotateMatrix_Z_any( contur, angle_Z );
        contur  = MoveMatrixAny( contur, x_center , y_center , z_center );
        ctx.strokeStyle  = 'blue'
        ctx.lineWidth = line_width;
        draw_PLine_3D( ctx, contur );

        //contur by widht
        contur  = gPile.get_Contur_Arc_Widht; 
        contur  = RotateMatrix_Z_any( contur, 90 )   
        contur  = MoveMatrixAny( contur, x_location, y_location, dh + z_location );
        contur  = ScaleMatrixAny1zoom( contur, zoom );
        contur  = RotateMatrix_X_any( contur, angle_X );
        contur  = RotateMatrix_Y_any( contur, angle_Y );
        contur  = RotateMatrix_Z_any( contur, angle_Z );
        contur  = MoveMatrixAny( contur, x_center, y_center, z_center );
        ctx.lineWidth = line_width;
        draw_PLine_3D( ctx, contur );
    }

}// Pile (splines)

        //under Base box
        if ( pile.underBase_Height > 0 ) {
            let underBaseContur  = gPile.get_Contur_under_Base.xyz3d;
            underBaseContur  = MoveMatrixAny( underBaseContur, x_location, y_location, -uH+dh + z_location );
            underBaseContur  = ScaleMatrixAny1zoom( underBaseContur, zoom );
            underBaseContur  = RotateMatrix_X_any( underBaseContur, angle_X );
            underBaseContur  = RotateMatrix_Y_any( underBaseContur, angle_Y );
            underBaseContur  = RotateMatrix_Z_any( underBaseContur, angle_Z );
            underBaseContur  = MoveMatrixAny( underBaseContur, x_center , y_center , z_center );
            ctx.strokeStyle  = 'blue'
            ctx.lineWidth = line_width;
            draw_underBase( ctx, underBaseContur );
        }
    
};