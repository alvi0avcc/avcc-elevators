import React, { useRef, useEffect } from 'react';
import { Elevators } from './elevators.js';
import * as matrix from './3d-matrix.js';
import { mat3, mat4, vec3, vec4 } from 'gl-matrix';
import * as Calc from './calc.js';
import cgPile from './pile_class.js'
import { get_Max_Y_3D, getCurvePoints, drawLines, drawCurve, getPoint, drawPoint, drawPoints, getSlice, drawSlice, drawContur, getContur, getPoints_by_Y } from './spline.js';
import { transformVector, MoveMatrix, MoveMatrixAny, RotateMatrix_X, RotateMatrix_X_any, RotateMatrix_Y, RotateMatrix_Y_any, RotateMatrix_Z, RotateMatrix_Z_any, ScaleMatrix, ScaleMatrixAny, ScaleMatrixAny1zoom } from './3d-matrix.js';
import { draw_Line_3D, draw_PLine_3D, draw_PLine_3D_between, draw_underBase, draw_Point_3D } from './draw.js';





const PilesViewCanvas = props => {

    const canvasRef = useRef(null);
    const canvasTextRef = useRef(null);
    const offscreen = new OffscreenCanvas(500, 500);
    //const canvasOffScreenRef = useRef(null);
    const newImg = document.createElement("img");

    //const [ update, setUpdate ] = React.useState( true );

    const [ currPosMouse, setCurPosMouse ] = React.useState( { x: 0, y: 0 } );
    const [ pileUnderMouse, setPileUnderMouse ] = React.useState( -1 );
    const [ posMouse, setPosMouse ] = React.useState( { x: 0, y: 0, angle: 0 } );
    const [ initPosMouse, setInitPosMouse ] = React.useState( { x: 0, y: 0, angle: 0 } );
    const [ changePilePos, setChangePilePos] = React.useState( false );

    let currentPile = 0;
    let report = false;
    report = props.report;
    if ( report ) currentPile = props.currentPile
    else currentPile = Elevators.get_Pile_Selected;


    let mode = props.mode;

    let Pile_x = 0;
    let Pile_y = 0;
    let Pile_angle = 0;
/*
    function a11yProps(index) {
        return {
          id: `pile-label-${index}`,
          'aria-controls': `Pile-labell-${index}`,
        };
      }
    
    function a11yPropsButton(index) {
        return {
          id: `pile-button-${index}`,
          'aria-controls': `Pile-button-${index}`,
          name: `${index}`
        };
    }
*/
    const pileMove = (event) => {
        //props.callbackPile( Number(event.target.name) - 1 );
        //props.callback( !props.updatePiles );
        setCurPosMouse( { x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY } );

        if ( mode == 'location' )
        if ( event.buttons == 1 ) {
            let d_angle = 0;
            let d_x = 0;
            let d_y  =0;
            setChangePilePos( true );
            if ( event.ctrlKey ) {
                d_angle = ( event.nativeEvent.offsetX - initPosMouse.x ) * 0.2 + ( event.nativeEvent.offsetY - initPosMouse.y ) * 0.2;
            } else {
                d_x = event.nativeEvent.offsetX - initPosMouse.x;
                d_y = event.nativeEvent.offsetY - initPosMouse.y
            }
            //console.log('event = ', event )
            setPosMouse( { x: d_x, y: d_y, angle: d_angle } );
        }
    }

    const pileStartMove = (event) => {
        setInitPosMouse({ x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY, angle: 0 });
        if ( pileUnderMouse != -1 && mode == 'location' ) {
            Elevators.set_Pile_Selected = pileUnderMouse;
            props.callbackPile( pileUnderMouse );
        }

    }

    const pileEndMove = (event) => {
        if ( changePilePos ) 
            if ( window.confirm('Accept new position for Pile?') ) {
                Elevators.setPile_Location( props.currentPile, Calc.MyRound( Pile_x, 2 ), Calc.MyRound( Pile_y, 2 ), Calc.MyRound( Pile_angle, 2 ) );
                //props.callback( !props.updatePiles );
                //props.callbackPileInfo( !props.changePileInfo );
            }
        setChangePilePos( false );
        setInitPosMouse( { x: 0, y: 0 } );
        setPosMouse( { x: 0, y: 0 } );

        props.callback( !props.updatePiles );
        props.callbackPileInfo( !props.changePileInfo );
    }
    function PileSelectButtonCheck( x, y ){
        let dx = x - currPosMouse.x;
        let dy = y - currPosMouse.y;
        let r = Math.sqrt( dx**2 + dy**2 );
        return r;
    }
/*
    //------------------------------------
    function PileSelectButton( propsPileSelect ){
        let index = propsPileSelect.index + 1;

        const pileSelect = (event) => {
            let index = Number(event.target.name) - 1;
            Elevators.set_Pile_Selected = index;
            props.callbackPile( index );
            props.callback( !props.updatePiles );
        }

        

        return (
        <div className = 'overlay-control' {...a11yProps(index)} hidden style={{ zIndex: 2 }}>
            <button 
                className='myButtonPile'
                key = { index } 
                {...a11yPropsButton(index)}
                onClick={ pileSelect }
                >
                { index }
            </button>
         </div>
        )
    }*/

    //------------------------------------

   
   

    //let pile_label_position = [];

    //let pile_label = [];
    //let pos = { x: 0, y: 0, name: '' };



    //if ( currentPile >= Elevators.PileFound ) currentPile = 0;

    let floor = Elevators.FloorCurrentDimensions;

    let meshView = true;
    let houseView =true;
    let colorMulti = true;

    let Length = floor.Length;
    let Width = floor.Width;
    let Height = floor.Height;
    let Conus_height = floor.Conus_height;
    let Conus_L = floor.Conus_L;
    let Conus_W = floor.Conus_W;
    let Conus_X = floor.Conus_X;
    let Conus_Y = floor.Conus_Y;

    let step_xy = 50;
    step_xy = Elevators.get_Floor_MeshStep;

    

    //let mesh = [];
    //mesh = Elevators.get_Floor_Mesh_3D;
    //mesh = matrix.MoveMatrixAny( mesh, -Length/2, -Width/2, -Height/2 );

    //let strip = [];
    //strip = Elevators.get_Floor_Strip;

    // Korpus                
    let korpus_draw = [ -Length/2, -Width/2, 0, 1,
                        -Length/2,  Width/2, 0, 1,
                        -Length/2,  Width/2,  Height, 1,
                        -Length/2, -Width/2,  Height, 1,

                         Length/2, -Width/2, 0, 1,
                         Length/2,  Width/2, 0, 1,
                         Length/2,  Width/2,  Height, 1,
                         Length/2, -Width/2,  Height, 1,

                        -Length/2, -Width/2, 0, 1,
                        -Length/2, -Width/2,  Height, 1,
                         Length/2, -Width/2,  Height, 1,
                         Length/2, -Width/2, 0, 1,

                        -Length/2,  Width/2, 0, 1,
                        -Length/2,  Width/2,  Height, 1,
                         Length/2,  Width/2,  Height, 1,
                         Length/2,  Width/2, 0, 1
                        ];

    let ruler_X = [];
    for ( let x = 0; x < Length; x++ ){
        ruler_X.push( -Length/2 + x, -Width/2, 0, 1,
                    -Length/2 + x, Width/2, 0, 1 );
    }
    let ruler_Y = [];
    for ( let y = 0; y < Width; y++ ){
        ruler_Y.push( -Length/2, -Width/2 + y, 0, 1,
                    Length/2, -Width/2 + y, 0, 1 );
    }
    //console.log('ruler_X = ',ruler_X);

    let vertices = [];

    let colors = [];
    let normal = [];
    /*
    for ( let i = 0; i < 36; i++ ){
        //normal = normal.concat( [ 0, 0, 1 ] );
        normal.push( 0, 0, 1 );
    }*/

    //let normal = [];
    let _normal = [];
    /*
    for ( let i = 0; i < mesh.length; i+=4 ) {
        //colors = colors.concat( Math.random(), Math.random(), Math.random(), 1 );
        colors.push( Math.random(), Math.random(), Math.random(), 1 );
        _normal = Calc.Normal_from_3points( mesh.slice( i, i + 3 ), mesh.slice( i+4, i + 3+4 ), mesh.slice( i+8, i + 3+8 ) );
        //vec3.normalize( _normal, _normal );
        //normal = normal.concat( _normal );
        normal.push( _normal[0], _normal[1], _normal[2] );
    }
*/
    //normal = normal.concat( [ 0,0,0 ] );
    //console.log('normal = ', normal);

    //--------------------------------------
/*
    // look up the divcontainer
    let divContainerElement = document.querySelector("#divcontainer");

    // make the div
    let div = document.createElement("div");
    // assign it a CSS class
    div.className = "floating-div";
    // make a text node for its content
    let textNode = document.createTextNode("");
    div.appendChild(textNode);

    // add it to the divcontainer
    divContainerElement.appendChild(div);*/
    /*var divContainerElement = document.getElementById('divcontainer');
    console.log('divContainerElement =',divContainerElement);
    var div = document.createElement("div");
    div.innerHTML = "new div";*/
   // divContainerElement.appendChild(div);

    //addDiv();


    //---------------------------------------

    let gPile = new cgPile();
    let piles = [];
    //let result = { mesh: [], x: 0, y: 0 };
    let gPiles = [];
    let count = Elevators.PileFound;
    let slice_step = 25;

    let angle_X = props.view.x;
    let angle_Y = props.view.y;
    let angle_Z = props.view.z;

    

    if ( mode == 'location' ) {
        for ( let index = 0; index < count; index++ ) {

            let pile = Elevators.PileGet( index );
            //let pile = structuredClone( Elevators.PileGet( index ) );
            if ( pile.numOfSegments == undefined ) pile.numOfSegments = 10;

            if ( changePilePos )
            if ( currentPile == index ){
                let zoom = 0.1;
                let x = posMouse.x * zoom;
                let y = posMouse.y * zoom;
                let angle = posMouse.angle;
                pile.X += x;
                pile.Y -= y;
                pile.angle += angle;
                Pile_x = pile.X;
                Pile_y = pile.Y;
                Pile_angle = pile.angle;
            }
            piles.push ( pile );

            gPile.set_Initial_Data_Complex ( pile, pile.numOfSegments );//initialisation Pile

            //get & put calculated Volume current Pile
            if ( index == currentPile ) {
                let volume = 0;
                volume = gPile.get_Volume_by_Slice;
                Elevators.set_Pile_Volume( currentPile, volume.volume_total );
            }

            let mesh = gPile.get_Mesh( slice_step );
            gPiles.push( mesh ) ;

            //pos.x = mesh.x;
            //pos.y = mesh.y;
            //pos.name = index + 1 ;


        }
    } else {
        let pile = Elevators.PileGet( currentPile );
        if ( pile.numOfSegments == undefined ) pile.numOfSegments = 10;
        piles.push ( pile );

        gPile.set_Initial_Data_Complex ( pile, pile.numOfSegments );//initialisation Pile

        //get & put calculated Volume current Pile
        let volume = 0;
        volume = gPile.get_Volume_by_Slice;
        Elevators.set_Pile_Volume( currentPile, volume.volume_total );
        gPiles.push( gPile.get_Mesh( slice_step ) ) ;
    }

    let l = Number(piles[0].Base.length);
    let w = Number(piles[0].Base.width);
    let h = Number(piles[0].Height);

    //---------------------------------------

    const draw = ( gl, ctx ) => {

    // Запомним время последней отрисовки кадра
    let lastRenderTime = Date.now();

    // Инициализация шейдеров
    const vertexShaderSource =`
        attribute vec4 a_position;
        attribute vec3 a_normal;
        //attribute vec3 a_color;

        varying vec3 v_surfaceToLight;
        varying vec3 v_surfaceToView;

        //uniform mat4 u_world;
        //uniform mat4 u_worldViewProjection;
        //uniform mat4 u_worldInverseTranspose;

        uniform mat4 u_modelView;
        uniform mat4 u_projection;

        uniform vec3 u_lightWorldPosition;
        uniform vec3 u_viewWorldPosition;

        //varying vec3 v_color;
        varying vec3 v_normal;

        void main(void) {
            //v_color = a_color;
            gl_Position = u_projection * u_modelView * a_position;

            // Pass the normal to the fragment shader
            //v_normal = mat3(u_modelView) * a_normal;
            //v_normal = a_normal;

            // compute the world position of the surface
            vec3 surfaceWorldPosition = (u_modelView * a_position).xyz;

            // compute the vector of the surface to the light
            // and pass it to the fragment shader
            //v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;

            // compute the vector of the surface to the view/camera
            // and pass it to the fragment shader
            //v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;
        }`;

    const fragmentShaderSource =`
        precision mediump float;

        // Passed in from the vertex shader.
        varying vec3 v_normal;
        uniform vec3 u_reverseLightDirection;

        varying vec3 v_surfaceToLight;
        varying vec3 v_surfaceToView;

        uniform vec4 u_color;
        uniform float u_shininess;

        void main() {

            // because v_normal is a varying it's interpolated
            // so it will not be a unit vector. Normalizing it
            // will make it a unit vector again
            vec3 normal = normalize(v_normal);

            //vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
            //vec3 surfaceToViewDirection = normalize(v_surfaceToView);
            //vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

            //float light = dot(normal, surfaceToLightDirection);
            //float specular = 0.0;
            //if (light > 0.0) {
            //    specular = pow(dot(normal, halfVector), u_shininess);
            //}

            gl_FragColor = u_color;

            // Lets multiply just the color portion (not the alpha)
            // by the light
            //gl_FragColor.rgb *= light;

            // Just add in the specular
            //gl_FragColor.rgb += specular;
        }`;
    //use the compileShader function for create Shaders
    const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader( gl, fragmentShaderSource, gl.FRAGMENT_SHADER );

    // create program from Shaders
    let program = createProgram(gl, vertexShader, fragmentShader)

    //--------------------------------------------Инициализация шейдеров
        //var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        //perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    //--------------------------------------------Устанавливаем вьюпорт у WebGL
        //gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    //--------------------------------------------Получим местоположение переменных в программе шейдеров
        let uModelView = gl.getUniformLocation(program, 'u_modelView');
        let uProjection = gl.getUniformLocation(program, 'u_projection');
        let aPosition = gl.getAttribLocation(program, 'a_position');
       // let normalLocation = gl.getAttribLocation(program, "a_normal");
        //let aColor = gl.getAttribLocation(program, 'a_color');
        let colorUniformLocation = gl.getUniformLocation(program, "u_color");
        //let reverseLightDirectionLocation = gl.getUniformLocation(program, "u_reverseLightDirection");
        //let shininessLocation = gl.getUniformLocation(program, "u_shininess");
        //let lightWorldPositionLocation = gl.getUniformLocation(program, "u_lightWorldPosition");
       // var viewWorldPositionLocation = gl.getUniformLocation(program, "u_viewWorldPosition");
        //let texcoordLocation = gl.getAttribLocation(program, "a_texcoord");
        //let textureLocation = gl.getUniformLocation(program, "u_texture");

    //--------------------------------------------
    //vertices = gPiles[0];
 /*   vertices = [];
    for ( let index = 0; index < gPiles.length; index++ ) {
        vertices = vertices.concat( gPiles[ index ] );
    }*/
    //vertices = gPiles[ 0 ];
    //console.log('vertices = ',vertices);
    //--------------------------------------------
        let vertexBuffer = gl.createBuffer();
     //   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
     //   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices),  gl.STATIC_DRAW);
            
        let colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        let normalBuffer = gl.createBuffer();
            

            /*let textures = [];
            let _textures = [];
            for ( let i = 0; i < normal.length; i++ ) {
                _textures = [   0, 0, 
                                0, 1, 
                                1, 0, 
                                0, 1, 
                                1, 0 ];
                textures = textures.concat( _textures );
               //_normal = Calc.Normal_from_3points( vertices.slice( i, i + 3 ), vertices.slice( i+1, i + 3+1 ), vertices.slice( i+2, i + 3+2 ) );
               //vec3.normalize( _normal, _normal );
               //normal = normal.concat( _normal );
            }*/
        //--------------------------------------------
            let projectionMatrix = mat4.create();

            //var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            //var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            //mat4.perspective(projectionMatrix, 3, 1, -50, 1000);
            //gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
            //mat4.translate(projectionMatrix, projectionMatrix, [ 35, 30, -100 ]);

            let modelMatrix = mat4.create();
            //mat4.scale(modelMatrix, modelMatrix, [ 10, 10, 10 ]);
            let zoom = 1;
            if ( mode == 'location' && !report ) {
                let zoom_L = gl.drawingBufferWidth / Length;
                let zoom_W = gl.drawingBufferHeight / Width;
                let zoom_H = gl.drawingBufferHeight / Height;
                zoom = Math.min( zoom_L, zoom_W, zoom_H );
            } else {
                let zoom_L = gl.drawingBufferWidth / l;
                let zoom_W = gl.drawingBufferHeight / w;
                let zoom_H = gl.drawingBufferHeight / h;
                zoom = Math.min( zoom_L, zoom_W, zoom_H );
            }

            zoom = zoom * 0.9;

            mat4.ortho(projectionMatrix, 0, gl.drawingBufferWidth, 0, gl.drawingBufferHeight, -500, 500);
            if ( mode == 'location') {
                mat4.translate(projectionMatrix, projectionMatrix, [ gl.drawingBufferWidth / 2, gl.drawingBufferHeight / 2, 0 ]);
            } else mat4.translate(projectionMatrix, projectionMatrix, [ gl.drawingBufferWidth / 2, gl.drawingBufferHeight / 2, 0 ]);

            mat4.scale( modelMatrix, modelMatrix, [ zoom, zoom, zoom ] );
            mat4.rotateX(modelMatrix, modelMatrix, angle_X);
            mat4.rotateZ(modelMatrix, modelMatrix, angle_Z);

//----------------------------------------------------------------------
        function render() {

            //houseView = Elevators.get_Floor_ShowHouse;
            //meshView = Elevators.get_Floor_MeshStyle;
            //colorMulti = Elevators.get_Floor_Multicolor;

        // Запрашиваем рендеринг на следующий кадр
            //requestAnimationFrame(render);
        
        // Получаем время прошедшее с прошлого кадра
            //var time = Date.now();
            //var dt = lastRenderTime - time;

        //--------------------------------------------  Вращаем куб относительно оси Z
          // mat4.rotateZ(modelMatrix, modelMatrix, dt / 4000);
        //----------------------------------------------------------------------
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

            gl.clearColor(1.0, 1.0, 1.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            ctx.clearRect(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        //----------------------------------------------------------------------
            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            //gl.enable(gl.CULL_FACE);

        //----------------------------------------------------------------------
            gl.useProgram(program);
        //----------------------------------------------------------------------



        //----------------------------------------------------------------------
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.enableVertexAttribArray(aPosition);
            gl.vertexAttribPointer(aPosition, 4, gl.FLOAT, false, 0, 0);

            // Bind the normal buffer.
            //gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
            //gl.enableVertexAttribArray(normalLocation);
            //gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);
        //----------------------------------------------------------------------
        /*
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            gl.enableVertexAttribArray(aColor);
            gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);
        */
        //----------------------------------------------------------------------

            gl.uniformMatrix4fv(uModelView, false, modelMatrix);
            gl.uniformMatrix4fv(uProjection, false, projectionMatrix);

            //let light_vector = [0.5, 0.7, 1];
            //let light_vector = [ 0, 0, 1];
            //vec3.normalize( light_vector, light_vector )
            //gl.uniform3fv(reverseLightDirectionLocation, light_vector );

            // set the light position
            //gl.uniform3fv(lightWorldPositionLocation, [20, 30, 60]);
            //gl.uniform3fv(lightWorldPositionLocation, [ 0, 300, 300 ]);

            // set the shininess
            //let shininess = 50;
            //gl.uniform1f(shininessLocation, shininess);

            //------------------------------- corpus draw

            if ( mode == 'location' && !report ) {
                vertices = korpus_draw;
                vertices = MoveMatrixAny( vertices , 0, 0, -Height/2 );

                gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices),  gl.STATIC_DRAW);
        
                gl.uniform4f(colorUniformLocation, 0, 1, 0.5, 1);
                gl.drawArrays(gl.LINE_LOOP, 0, 4);
                gl.drawArrays(gl.LINE_LOOP, 4, 4);
                gl.drawArrays(gl.LINE_LOOP, 8, 4);
                gl.drawArrays(gl.LINE_LOOP, 12, 4);
            }

            //------------------------------- ruler_X draw
            if ( mode == 'location' && !report ) {
                vertices = ruler_X;
                vertices = MoveMatrixAny( vertices , 0, 0, -Height/2 );

                gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices),  gl.STATIC_DRAW);
        
                gl.uniform4f(colorUniformLocation, 0.753, 0.753, 0.753, 0.9);
                for ( let i = 0; i <= Length; i+=2) {
                    gl.drawArrays(gl.LINES, i, i+2);
                }
            }
            //------------------------------- ruler_Y draw
            if ( mode == 'location' && !report ) {
                vertices = ruler_Y;
                vertices = MoveMatrixAny( vertices , 0, 0, -Height/2 );

                gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices),  gl.STATIC_DRAW);
        
                gl.uniform4f(colorUniformLocation, 0.753, 0.753, 0.753, 0.9);
                for ( let i = 0; i <= Width; i+=2) {
                    gl.drawArrays(gl.LINES, i, i+2);
                }
            }

            //vertices = [];

            //let pile_position = [];


            if ( mode == 'location' ) {
                //----------------------piles draw
                for ( let i = 0; i < gPiles.length; i++ ) {
                    //vertices = gPiles[ i ].slices;
                    let x = gPiles[ i ].x;
                    let y = gPiles[ i ].y;
                    let box = gPiles[ i ].box;
                    let angle = gPiles[ i ].angle;
                    let count = gPiles[ i ].count;
                    let base_countur = gPiles[ i ].slices.slice( 0, count );
                    vertices = gPiles[ i ].mesh;
                    if ( !report ) {
                        vertices = RotateMatrix_Z_any( vertices , angle, 4 );
                        vertices = MoveMatrixAny( vertices , x - Length / 2, y - Width / 2, box - Height/2 );
                    }

                    let xx = x - Length / 2;
                    let yy = y - Width / 2;
                    let zz = box - Height/2;
                    //let matrix_text = [ xx, yy, zz, 1 ];

                    let mat = mat4.create();
                    mat4.multiply( mat, projectionMatrix, modelMatrix );
                    // compute a clipspace position
                    var clipspace = transformVector( mat, [ xx, yy, zz, 1 ]);
                    // divide X and Y by W just like the GPU does.
                    clipspace[0] /= clipspace[3];
                    clipspace[1] /= clipspace[3];
                    // convert from clipspace to pixels
                    var pixelX = (clipspace[0] *  0.5 + 0.5) * gl.canvas.width;
                    var pixelY = (clipspace[1] * -0.5 + 0.5) * gl.canvas.height;
                    //pile_position.push( { x: pixelX, y: pixelY } );

                    //gl.drawingBufferWidth, gl.drawingBufferHeight
                   // let x_center = ctx.canvas.clientWidth / 2;
                   // let y_center = ctx.canvas.clientHeight / 2;
/*
                    //matrix_text  = MoveMatrixAny( matrix_text, x, y, 0 );
                    let ax = angle_X * 180 / 3.14;
                    let ay = angle_Y * 180 / 3.14;
                    let az = angle_Z * 180 / 3.14;
                    matrix_text  = ScaleMatrixAny1zoom( matrix_text, zoom );
                    matrix_text  = RotateMatrix_X_any( matrix_text, ax );
                    matrix_text  = RotateMatrix_Y_any( matrix_text, ay );
                    matrix_text  = RotateMatrix_Z_any( matrix_text, -az );
                    matrix_text  = MoveMatrixAny( matrix_text, x_center, 0, zz );*/

                    //if moved - show coordinates
                    if ( i == props.currentPile && changePilePos == true ) {
                        ctx.fillStyle = 'red';
                        ctx.font = "18px serif";
                        ctx.fillText( 'Position X = '+ Calc.MyRound( x , 2 ) +' m', 20, 20);
                        ctx.fillText( 'Position Y = '+ Calc.MyRound( y , 2 ) +' m', 20, 40);
                        ctx.fillText( 'angle = '+ Calc.MyRound( angle , 2 ) +' deg', 20, 60);
                    }
/*
                    // set position for html button
                    let div = document.getElementById('pile-label-'+(i+1));
                    if ( div ) {
                        div.style.left = Math.floor(pixelX) + "px";
                        div.style.top  = Math.floor(pixelY) + "px";
                        if ( currentPile == i ) { div.hidden = true;
                        } else div.hidden = false;
                        //if ( currentPile == i ) { div.style.cursor = 'move'}
                        //div.hidden = false
                    }*/



                    // graph button for selecting Piles

                    if ( PileSelectButtonCheck( pixelX, pixelY ) <= 15 ) {
                        setPileUnderMouse( i );
                        //Elevators.set_Pile_Selected = i;
                        //props.callbackPile( i );
                        ctx.fillStyle = 'rgba(255, 255, 0, 1)';

                    } 
                    else {
                        //setPileUnderMouse( -1 );
                        ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
                    }

                    if ( i != props.currentPile ) {
                        ctx.beginPath();
                        ctx.lineWidth = 2;
                        ctx.strokeStyle  = 'red';
                        ctx.arc( pixelX, pixelY, 15, 0, 2*3.14, false );
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.lineWidth = 2;
                        ctx.strokeStyle  = 'green';
                        ctx.arc( pixelX, pixelY, 13, 0, 2*3.14, false );
                        ctx.fill();
                        ctx.stroke();

                        ctx.fillStyle = 'red';
                        ctx.font = "18px serif";
                        ctx.fillText( i + 1, pixelX-4, pixelY+5 );
                    }
                    //-----------------------------------------------graph button for selecting Piles

                    let PileVisible = 1;
                    if ( report ) { PileVisible = 0.9 
                    } else 
                        {
                            if ( currentPile == i ) { PileVisible = 0.9;
                            } else PileVisible = 0.5 ;
                        }

                    if ( !report ) {
                        base_countur = RotateMatrix_Z_any( base_countur , angle, 4 );
                        base_countur = MoveMatrixAny( base_countur , x - Length / 2, y - Width / 2, box - Height/2 );
                    }

                    // box
                    gl.uniform4f(colorUniformLocation, 1, 0, 1, PileVisible );
                    if ( box > 0 ) {
                        for ( let i = 0; i <= 5; i++ ) {
                            let vertices_box = MoveMatrixAny( base_countur , 0, 0, -box / 5 * i );
                            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
                            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices_box),  gl.STATIC_DRAW);
                            //mesh
                            gl.drawArrays(gl.LINE_STRIP, 0, count / 4 );
                            //solid
                        // gl.drawArrays(gl.TRIANGLE_STRIP, 0, count * 2 / 4 );
                        }
                    }

                    // base contur
                    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(base_countur),  gl.STATIC_DRAW);
                    gl.drawArrays(gl.LINE_STRIP, 0, count / 4 );

                    //normal = gPiles[ i ].normal;
/*
                    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);
*/
                    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices),  gl.STATIC_DRAW);
                    gl.uniform4f(colorUniformLocation, 0, 0, 1, PileVisible );

                    // mesh - hat
                    if ( gPiles[ i ].height > 0 ) {
                        for ( let i =0; i < slice_step; i++ ) {
                            gl.drawArrays(gl.LINE_STRIP, i * count /2, count *2 / 4 +1 );
                        }
                        //upper plate
                        vertices = gPiles[ i ].slices.slice( - count, gPiles[ i ].slices.length );
                        vertices = RotateMatrix_Z_any( vertices , angle, 4 );
                        vertices = MoveMatrixAny( vertices , x - Length / 2, y - Width / 2, box - Height/2 );
                        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
                        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices),  gl.STATIC_DRAW);
                        gl.uniform4f(colorUniformLocation, 0, 0, 1, PileVisible );
                        gl.drawArrays(gl.TRIANGLE_FAN, 0, count / 4 );
                        } else {
                            //vertices = [ 0, 0, 0, 1 ];
                            //vertices = vertices.concat( gPiles[ i ].slices.slice( 0, count ) );
                            //vertices = MoveMatrixAny( vertices , 0, 0, box - h/2 );
                            //vertices = base_countur;

                            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
                            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( base_countur ),  gl.STATIC_DRAW);
                            gl.uniform4f(colorUniformLocation, 0, 0, 1, PileVisible );

                            gl.drawArrays(gl.TRIANGLE_FAN, 0, count / 4 );
                        }


/*
                    //----------------------------------------------------------------------
                    // choose a point in the local space of the 'F'.
                    var point = [100, 0, 0, 1];  // this is the front top right corner

                    // compute a clipspace position
                    // using the matrix we computed for the F
                    //var clipspace = m4.transformVector(matrix, [100, 0, 0, 1]);

                    var clipspace = point;

                    // divide X and Y by W just like the GPU does.
                    clipspace[0] /= clipspace[3];
                    clipspace[1] /= clipspace[3];

                    // convert from clipspace to pixels
                    var pixelX = (clipspace[0] *  0.5 + 0.5) * gl.canvas.width;
                    var pixelY = (clipspace[1] * -0.5 + 0.5) * gl.canvas.height;

                    // position the div
                    div.style.left = Math.floor(pixelX) + "px";
                    div.style.top  = Math.floor(pixelY) + "px";
*/
                    //----------------------------------------------------------------------
/*
                    // solid - hat
                    for ( let i =0; i < slice_step; i++ ) {
                        gl.drawArrays(gl.TRIANGLE_STRIP, i * count /2, count *2 / 4 +1 );
                    }*/

                    //report
                    if ( report ) {
                        //let one = document.getElementById('canvas-pile-' + i ).getContext("bitmaprenderer");
                        let one = document.getElementById('img-pile-' + i );
                        //const bitmapOne = offscreen.transferToImageBitmap();
                        offscreen.convertToBlob().then((blob) => ( one.src = URL.createObjectURL( blob ) ) );
                        
                        //one.transferFromImageBitmap(bitmapOne);
                        
                        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                    }


                } 
            } else { // only current Pile
/*
                for ( let i = 0; i < Elevators.PileFound; i++ ) {
                    let div = document.getElementById('pile-label-'+(i+1));
                    if ( div ) {
                        div.hidden = true;
                    }
                }*/

                //let x = gPiles[ 0 ].x;
                //let y = gPiles[ 0 ].y;
                let box = gPiles[ 0 ].box;
                //let angle = gPiles[ 0 ].angle;
                let count = gPiles[ 0 ].count;
                let base_countur = gPiles[ 0 ].slices.slice( 0, count );
               

                let PileVisible = 0.9;

                let _base_countur = MoveMatrixAny( base_countur ,0, 0, box - h/2 );

                // box
                gl.uniform4f(colorUniformLocation, 1, 0, 1, PileVisible );
                if ( box > 0 ) {
                        for ( let i = 0; i <= 5; i++ ) {
                            let vertices_box = MoveMatrixAny( _base_countur , 0, 0, -box / 5 * i );
                            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
                            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices_box),  gl.STATIC_DRAW);
                            //mesh
                            gl.drawArrays(gl.LINE_STRIP, 0, count / 4 );
                            //solid
                        // gl.drawArrays(gl.TRIANGLE_STRIP, 0, count * 2 / 4 );
                        }
                }

                // base contur
                gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_base_countur),  gl.STATIC_DRAW);
                gl.drawArrays(gl.LINE_STRIP, 0, count / 4 );

                    //normal = gPiles[ i ].normal;
/*
                    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);
*/

                // mesh - hat
                if ( gPiles[ 0 ].height > 0 ) {
                    //console.log('H = ', gPiles[ 0 ].height);
                    vertices = gPiles[ 0 ].mesh;
                    vertices = MoveMatrixAny( vertices , 0, 0, box - h/2 );

                    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices),  gl.STATIC_DRAW);
                    gl.uniform4f(colorUniformLocation, 0, 0, 1, PileVisible );

                    for ( let i =0; i < slice_step; i++ ) {
                        gl.drawArrays(gl.LINE_STRIP, i * count /2, count *2 / 4 +1 );
                    }
                    //upper plate
                    vertices = gPiles[ 0 ].slices.slice( - count, gPiles[ 0 ].slices.length );
                    vertices = MoveMatrixAny( vertices , 0, 0, box - h/2 );
                    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices),  gl.STATIC_DRAW);
                    gl.uniform4f(colorUniformLocation, 0, 0, 1, PileVisible );
                    gl.drawArrays(gl.TRIANGLE_FAN, 0, count / 4 );

                } else {
                    //vertices = [ 0, 0, 0, 1 ];
                    //vertices = vertices.concat( gPiles[ 0 ].slices.slice( 0, count ) );
                    vertices = MoveMatrixAny( base_countur , 0, 0, box - h/2 );
                    //vertices = base_countur;

                    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices),  gl.STATIC_DRAW);
                    gl.uniform4f(colorUniformLocation, 0, 0, 1, PileVisible );

                    gl.drawArrays(gl.TRIANGLE_FAN, 0, count / 4 );

                }
            }
            //----------------------
            
            //lastRenderTime = time;
            
            //if ( report ) {
            //if ( mode == 'model' ) {
                //var canvas = document.getElementById("canvasFlor");
                //        canvas.toBlob( (blob) => { saveBlob( blob, `screencapture-${canvas.width}x${canvas.height}.png` ); })
                //    }
                //canvasRef.current.toBlob( (blob) => { saveBlob( blob, `screencapture-${currentPile}.png` ); });

                //let one = document.getElementById("canvasPile").getContext("bitmaprenderer");
            //    let one = document.getElementById('canvas-pile-' + currentPile).getContext("bitmaprenderer");
            //    const bitmapOne = offscreen.transferToImageBitmap();
            //    one.transferFromImageBitmap(bitmapOne);

/*
                canvasRef.current.toBlob((blob) => {
                    //newImg = document.createElement("img");
                    const url = URL.createObjectURL(blob);
                  
                    newImg.onload = () => {
                      URL.revokeObjectURL(url);
                    };
                  
                    newImg.src = url;
                    //console.log('newImg = ',newImg);
                    //Elevators.set_Pile_Image( currentPile, newImg );
                    //document.body.appendChild(Elevators.get_Pile_Image(currentPile));
                    let doc = document.getElementById( 'img-pile-' + currentPile );
                    //doc.append( Elevators.get_Pile_Image(currentPile) );
                    //doc.appendChild( newImg );

                    //let doc = document.getElementById("canvasPile").getContext("bitmaprenderer");
                    console.log('doc = ',doc);

                    //const bitmapOne = offscreen.transferToImageBitmap();
                    //doc.transferFromImageBitmap(bitmapOne);

                    doc.src = newImg.src;

                    //console.log('Elevators = ',Elevators);

                });
                */
            //}
            
        }
 //----------------------------------------------------------------------       

render();


if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.log(gl.getShaderInfoLog(vertexShader));
}

if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.log(gl.getShaderInfoLog(fragmentShader));
}

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log('Could not initialize shaders');
}

    }
    
    useEffect(() => {
      
        let gl;
        const canvas = canvasRef.current;
        const { width, height } = canvas.getBoundingClientRect();
        canvas.height = height;
        canvas.width = width;

        const canvasText = canvasTextRef.current;
        canvasText.height = height;
        canvasText.width = width;
        const ctx = canvasText.getContext( '2d', { antialias: true } )

        //const offscreen = canvasOffScreenRef.current;
        //const offscreen = new OffscreenCanvas(1000, 1000);
        //offscreen.height = 1000;
        //offscreen.width = 1000;

      if ( report ) {
        //const offscreen = new OffscreenCanvas(1000, 1000);
        gl = offscreen.getContext( 'webgl', { antialias: true, alpha: true, preserveDrawingBuffer: true } );
        //const one = document.getElementById("canvasPile").getContext("bitmaprenderer");
        //const bitmapOne = offscreen.transferToImageBitmap();
        //one.transferFromImageBitmap(bitmapOne);
      } else {
        gl = canvas.getContext('webgl', { antialias: true, alpha: true, preserveDrawingBuffer: true  } );
      }

        draw( gl, ctx );
  
      }, [draw])
    
    return (
        <div className="container" style={{ height: 'inherit' }} >
            
            <canvas 
                id="canvasPile" 
                ref={canvasRef} 
                style={{ height: '100%', width: '100%', backgroundColor: 'transparent', zIndex: 0 }} 
                />
            <canvas 
                id="canvasText" 
                ref={canvasTextRef} 
                onMouseMove={ pileMove }
                onMouseDown={ pileStartMove }
                onMouseUp={ pileEndMove }
                style={{ display: ( report ? 'none' : 'block' ), height: '100%', width: '100%', zIndex: 1, backgroundColor: 'transparent', position: 'absolute', left: '0px', top: '0px' }} 
                />
            
            <div id="overlay" style={{ display: ( report ? 'none' : 'block' ) }}>
                <div>Volume of selected Pile: <span id="floor_volume">{Elevators.get_Pile_Volume( Elevators.get_Pile_Selected )} (m³)</span></div>
                <div>Weigth of selected Pile: <span id="floor_volume">{Elevators.get_Pile_Weight( Elevators.get_Pile_Selected )} (MT)</span></div>
            </div>

        </div>

    );
  }
 
  export default PilesViewCanvas;
//-----------------------------------------------------------------




  /**
 * Создание и компиляция шейдера
 *
 * @param {!WebGLRenderingContext} gl Контекст WebGL
 * @param {string} shaderSource Исходный код шейдера на языке GLSL
 * @param {number} shaderType Тип шейдера, VERTEX_SHADER или FRAGMENT_SHADER.
 * @return {!WebGLShader} Шейдер
 */
  function compileShader( gl, shaderSource, shaderType ) {
    // Compiles either a shader of type gl.VERTEX_SHADER or gl.FRAGMENT_SHADER

    // создаём объект шейдера
    const shader = gl.createShader(shaderType);
    // устанавливаем исходный код шейдера
    gl.shaderSource( shader, shaderSource );
    // компилируем шейдер
    gl.compileShader( shader );

    // проверяем результат компиляции
    if (!gl.getShaderParameter( shader, gl.COMPILE_STATUS) ) {
      const info = gl.getShaderInfoLog ( shader );
      throw `Could not compile WebGL program. \n\n${info}`;
    }
    return shader;
  }


  /**
 * Создаём программу из 2 шейдеров
 *
 * @param {!WebGLRenderingContext} gl Контекст WebGL
 * @param {!WebGLShader} vertexShader Вершинный шейдер
  * @param {!WebGLShader} fragmentShader Фрагментный шейдер
  * @return {!WebGLProgram} Программа
  */
 function createProgram(gl, vertexShader, fragmentShader) {
   // создаём программу
   let program = gl.createProgram();
  
   // прикрепляем шейдеры
   gl.attachShader(program, vertexShader);
   gl.attachShader(program, fragmentShader);
  
   // компонуем программу
   gl.linkProgram(program);
  
   // проверяем результат компоновки
   let success = gl.getProgramParameter(program, gl.LINK_STATUS);
   if (!success) {
       // что-то пошло не так на этапе компоновки
       throw ("ошибка компоновки программы:" + gl.getProgramInfoLog (program));
   }
  
   return program;
 };

/*
 function addDiv() {
    var objTo = document.getElementById('container');
    var divtest = document.createElement("div");
    divtest.innerHTML = "new div";
    objTo.appendChild(divtest);
}

function AddLabelPile( props ){
    let x = props.left+'px';
    let y = props.bottom+'px';
    let name = props.name;
    console.log('name=',name);
    console.log('x=',x);
    console.log('y=',y);
    return (
        <div 
            id = 'overlay'
            style={{ left: x, bottom: y }}
            left = '50px'
        >{name}</div>
    )
}
*/

const saveBlob = (function() {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    return function saveData(blob, fileName) {
       const url = window.URL.createObjectURL(blob);
       a.href = url;
       a.download = fileName;
       a.click();
    };
  }())
