import React, { useRef, useEffect } from 'react';
import { Elevators } from './elevators.js';
import { Isometric, IsometricArr, Matrix, DecartToSphereArr, SphereToDecartArr } from './calc.js';
//import { mat4 } from 'gl-matrix';
import * as Calc from './calc.js';
import cgPile from './pile_class.js'
import { get_Max_Y_3D, getCurvePoints, drawLines, drawCurve, getPoint, drawPoint, drawPoints, getSlice, drawSlice, drawContur, getContur, getPoints_by_Y } from './spline.js';
import { MoveMatrix, MoveMatrixAny, RotateMatrix_X, RotateMatrix_X_any, RotateMatrix_Y, RotateMatrix_Y_any, RotateMatrix_Z, RotateMatrix_Z_any, ScaleMatrix, ScaleMatrixAny, ScaleMatrixAny1zoom } from './3d-matrix.js';
import { draw_Line_3D, draw_PLine_3D, draw_PLine_3D_between, draw_underBase, draw_Point_3D } from './draw.js';


const PileViewCanvas = props => {

    const [ mode, setMode ] = React.useState( props.mode );
    const [ mesh, setMesh ] = React.useState([]);

    const calcMesh = () => {
        setMesh(Elevators.get_Volume_Piles(Elevators.WarehouseSelected).mesh);
        console.log('calcMesh = ',mesh);
    };


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
    //let mode = true;
    //let mode = props.mode;

    let pile = Elevators.PileGet( props.index );

//-------------------------------------------------------------
  const draw = (ctx, frameCount) => {

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);


    if ( mode == 'model' ) { Pile_Draw( ctx, +props.index, mode, +props.index, mesh ); 
    } else {
            for (let index = 0; index < Elevators.PileFound; index ++ ) {

                Pile_Draw( ctx, +index, mode, +props.index, mesh  );
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
  
/*
  <div class="container">
  <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }}/>
      <div id="overlay">
          <div>Volume: <span id="floor_volume">{ Elevators.get_Pile_Volume( +props.index ) } (m³)</span></div>
      </div>
  </div>
*/

  return (
    <div>
        <div style={{ display: 'flex', flexDirection: 'row', height: 570 }}>

            <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }}/>

            <div className='block' style={{ marginLeft: -91, padding: 1, zIndex: 1 }} >
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
                        onClick={ ()=>{ setMode('model') } }
                        >Model</button>

                    <button
                        className='myButton'
                        style={{ width: 80, height: 30 }}
                        onClick={ ()=>{ setMode('location') } }
                        >Location</button>

                    <button
                        className='myButton'
                        hidden
                        style={{ width: 80, height: 30 }}
                        onClick={ calcMesh }
                        >Calc</button>
                </div>
        </div> 
    </div>
  )
};

export default PileViewCanvas;

//----------------------------------------------------------------------

function Pile_Draw( ctx, index, mode, boss_index, mesh ){

    ctx.setLineDash([]);

    let boss_pile = Elevators.PileGet( boss_index );
    let pile = Elevators.PileGet( index );

    let gPile = new cgPile();

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
    if ( mode == 'location' && index != boss_index ) {
        numOfSegments = 5;
        slice_step = 10;
    }



    gPile.set_Initial_Data_Complex ( pile, numOfSegments );//initialisation Pile

    //get & put calculated Volume
    let volume = 0;
    volume = gPile.get_Volume;
    Elevators.set_Pile_Volume( boss_index, volume.volume );

    let x_center  = ( ctx.canvas.clientWidth - 90 ) / 2;
    let y_center = ctx.canvas.clientHeight/2;
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

    let zoom_L = 1;
    let zoom_W = 1;
    let zoom_H = 1;

    let x_location = pile.X;
    let y_location = pile.Y;
    let z_location = 0;


    if ( pile.angle == undefined  ) pile.angle = 0;
    let angle = -pile.angle;

    if ( mode == 'model' ) {

        angle = 0;

        zoom_L = ( ctx.canvas.clientWidth ) / l;
        zoom_W = ctx.canvas.clientHeight / w;
        zoom_H = ctx.canvas.clientHeight / h;
        zoom = Math.min( zoom_L, zoom_W, zoom_H );
        zoom = zoom * 0.8 ;

        

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

        zoom_L = ( ctx.canvas.clientWidth ) / floor_lenght;
        zoom_W = ctx.canvas.clientHeight / floor_width;
        zoom_H = ctx.canvas.clientHeight / floor_height;
        zoom = Math.min( zoom_L, zoom_W, zoom_H );
        zoom = zoom * 0.8 ;
        

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
            //floor_points  = ScaleMatrixAny( floor_points, zoom_L, zoom_W, zoom_H );
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
        slices  = RotateMatrix_Z_any( slices, angle );
        slices  = MoveMatrixAny( slices, x_location, y_location, dh + z_location );
        slices  = ScaleMatrixAny1zoom( slices, zoom );
        //slices  = ScaleMatrixAny( slices, zoom_L, zoom_W, zoom_H );
        slices  = RotateMatrix_X_any( slices, angle_X );
        slices  = RotateMatrix_Y_any( slices, angle_Y );
        slices  = RotateMatrix_Z_any( slices, angle_Z );
        slices  = MoveMatrixAny( slices, x_center, y_center, z_center );
        ctx.strokeStyle  = 'blue';
        if ( i == 0 ) ctx.strokeStyle  = 'magenta';
        if ( i == 0 ) {
            // draw Base contur
            ctx.lineWidth = line_width * 2; draw_PLine_3D( ctx, slices );
            //console.log('slices (2d) = ',slices);
        }
        if ( i == slice_step && mode == 'location' ) { // draw names of Piles
            let text_place_Y = 0;
            let text_place_X = 0;
                if ( index < 17 ) { 
                    text_place_Y  = 25;
                    text_place_X  = 60*index;
                } else {
                    text_place_Y = 560;
                    text_place_X  = 60*( index -17 );
                }
                let p1 = [ 10+text_place_X, text_place_Y ];
                let p2 = slices.slice( 0, 2 );
                ctx.strokeStyle  = 'lime';
                ctx.lineWidth = 1;
                ctx.setLineDash([10, 10])
                draw_Line_3D( ctx, p1, p2 );
                p2 = [ 10+text_place_X+45, text_place_Y ];
                ctx.setLineDash([]);
                draw_Line_3D( ctx, p1, p2 );
                ctx.fillStyle   = 'blue';
                ctx.font = "18px serif";
                ctx.fillText( 'Pile '+ ( index + 1 ), 10+text_place_X, text_place_Y-2 );
        }

        if ( i > 0) { 
            ctx.strokeStyle  = 'blue';
            ctx.lineWidth = line_width / 2;
            if ( i != 0 & i != slice_step ) draw_PLine_3D( ctx, slices );
            draw_PLine_3D_between( ctx, slices, slices_old );
        }
        slices_old = slices.slice(0);

    };

    if ( mode == 'model' ){
        slices  = gPile.get_Slice_Base( h );
        slices  = RotateMatrix_Z_any( slices, angle );
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
        contur  = RotateMatrix_Z_any( contur, angle );
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
        contur  = RotateMatrix_Z_any( contur, 90 + angle )   
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
            underBaseContur  = RotateMatrix_Z_any( underBaseContur, angle );
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

        // mesh Piles
        /*let gMesh = [];
        if ( mesh.length > 0 ){
            ctx.strokeStyle  = 'lime'
            ctx.lineWidth = line_width;
            gMesh  = MoveMatrixAny( mesh, x_location-25, y_location-10, dh );
            gMesh  = ScaleMatrixAny1zoom( gMesh, zoom );
            gMesh  = RotateMatrix_X_any( gMesh, angle_X );
            gMesh  = RotateMatrix_Y_any( gMesh, angle_Y );
            gMesh  = RotateMatrix_Z_any( gMesh, angle_Z );
            gMesh  = MoveMatrixAny( gMesh, x_center, y_center, z_center );
            draw_Point_3D( ctx, gMesh );
        }*/
    
};