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

    const canvasRef = useRef(null)
    const canvasTextRef = useRef(null)

    const [ update, setUpdate ] = React.useState( true );
    //const [ pos, setPos  ] = React.useState( { x: 0, y: 0 } );
    let pos = { x: 0, y: 0, name: '' };

    let currentPile = 0;
    currentPile = props.currentPile;

    let mode = props.mode;

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
    let result = { mesh: [], x: 0, y: 0 };
    let gPiles = [];
    let count = Elevators.PileFound;
    let slice_step = 25;

    let angle_X = props.view.x;
    let angle_Y = props.view.y;
    let angle_Z = props.view.z;

    if ( mode == 'location' ) {
        for ( let index = 0; index < count; index++ ) {

            let pile = Elevators.PileGet( index );
            if ( pile.numOfSegments == undefined ) pile.numOfSegments = 10;
            piles.push ( pile );

            gPile.set_Initial_Data_Complex ( pile, pile.numOfSegments );//initialisation Pile

            //get & put calculated Volume current Pile
            if ( index == currentPile ) {
                let volume = 0;
                volume = gPile.get_Volume;
                Elevators.set_Pile_Volume( currentPile, volume.volume );
            }

            let mesh = gPile.get_Mesh( slice_step );
            gPiles.push( mesh ) ;

            pos.x = mesh.x;
            pos.y = mesh.y;
            pos.name = index + 1 ;


        }
    } else {
        let pile = Elevators.PileGet( currentPile );
        if ( pile.numOfSegments == undefined ) pile.numOfSegments = 10;
        piles.push ( pile );

        gPile.set_Initial_Data_Complex ( pile, pile.numOfSegments );//initialisation Pile

        //get & put calculated Volume current Pile
        let volume = 0;
        volume = gPile.get_Volume;
        Elevators.set_Pile_Volume( currentPile, volume.volume );
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
            if ( mode == 'location' ) {
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

            zoom = zoom * 0.7;

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

            if ( mode == 'location') {
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

            //vertices = [];

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
                    vertices = RotateMatrix_Z_any( vertices , angle, 4 );
                    vertices = MoveMatrixAny( vertices , x - Length / 2, y - Width / 2, box - Height/2 );

                    let xx = x - Length / 2;
                    let yy = y - Width / 2;
                    let zz = -box + Height/2;
                    let matrix_text = [ xx, yy, zz, 1 ];

                    // compute a clipspace position
                    // using the matrix we computed for the F
                    var clipspace = transformVector(vertices, [ 0, 0, 0, 1 ]);
                    console.log('clipspace 1= ',clipspace);
                    // divide X and Y by W just like the GPU does.
                    clipspace[0] /= clipspace[3];
                    clipspace[1] /= clipspace[3];
                    console.log('clipspace 2= ',clipspace);
                    // convert from clipspace to pixels
                    var pixelX = (clipspace[0] *  0.5 + 0.5) * gl.canvas.width;
                    var pixelY = (clipspace[1] * -0.5 + 0.5) * gl.canvas.height;
                    console.log('pixelX = ',pixelX);
                    console.log('pixelY = ',pixelY);

                    //gl.drawingBufferWidth, gl.drawingBufferHeight
                    let x_center = ctx.canvas.clientWidth / 2;
                    let y_center = ctx.canvas.clientHeight / 2;

                    //matrix_text  = MoveMatrixAny( matrix_text, x, y, 0 );
                    let ax = angle_X * 180 / 3.14;
                    let ay = angle_Y * 180 / 3.14;
                    let az = angle_Z * 180 / 3.14;
                    matrix_text  = ScaleMatrixAny1zoom( matrix_text, zoom );
                    matrix_text  = RotateMatrix_X_any( matrix_text, ax );
                    matrix_text  = RotateMatrix_Y_any( matrix_text, ay );
                    matrix_text  = RotateMatrix_Z_any( matrix_text, -az );
                    matrix_text  = MoveMatrixAny( matrix_text, x_center, 0, zz );
                    //matrix_text  = MoveMatrixAny( matrix_text, x_center, y_center, 0 );
                    //let p2 = slices.slice( 0, 2 );

                    //matrix_text = MoveMatrixAny( matrix_text , x - Length / 2, y - Width / 2, box );
                    //mat4.rotateZ(matrix_text, matrix_text, angle_Z);
                    console.log('matrix_text = ',matrix_text);
                    console.log('matrix_text = ',matrix_text);
                    console.log('matrix_text = ',matrix_text);
                    console.log('matrix_text = ',matrix_text);
                    //console.log('vertices = ',vertices);

                    ctx.fillStyle = 'red';
                    ctx.font = "18px serif";
                    //ctx.fillText("Pile "+ (i+1), matrix_text[0], 610/2 - matrix_text[1]);
                    ctx.fillText("Pile "+ (i+1), pixelX, 610/2 - pixelY);


                    let PileVisible = 1;
                    if ( currentPile == i ) { PileVisible = 1;
                    } else PileVisible = 0.2 ;

                    base_countur = RotateMatrix_Z_any( base_countur , angle, 4 );
                    base_countur = MoveMatrixAny( base_countur , x - Length / 2, y - Width / 2, box - Height/2 );

                    // box
                    gl.uniform4f(colorUniformLocation, 1, 0, 1, PileVisible );
                    if ( box > 0 ) {
                        for ( let i = 0; i < 5; i++ ) {
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
                    for ( let i =0; i < slice_step; i++ ) {
                        gl.drawArrays(gl.LINE_STRIP, i * count /2, count *2 / 4 +1 );
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

                }
            } else { // only current Pile
                let x = gPiles[ 0 ].x;
                let y = gPiles[ 0 ].y;
                let box = gPiles[ 0 ].box;
                let angle = gPiles[ 0 ].angle;
                let count = gPiles[ 0 ].count;
                let base_countur = gPiles[ 0 ].slices.slice( 0, count );
                vertices = gPiles[ 0 ].mesh;
                //vertices = RotateMatrix_Z_any( vertices , angle, 4 );
                //vertices = MoveMatrixAny( vertices , x - Length / 2, y - Width / 2, box );
                vertices = MoveMatrixAny( vertices , 0, 0, box - h/2 );

                let PileVisible = 1;

                //base_countur = RotateMatrix_Z_any( base_countur , angle, 4 );
                base_countur = MoveMatrixAny( base_countur ,0, 0, box - h/2 );

                // box
                gl.uniform4f(colorUniformLocation, 1, 0, 1, PileVisible );
                if ( box > 0 ) {
                        for ( let i = 0; i < 5; i++ ) {
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
                for ( let i =0; i < slice_step; i++ ) {
                    gl.drawArrays(gl.LINE_STRIP, i * count /2, count *2 / 4 +1 );
                }
            }
            //----------------------
            //lastRenderTime = time;
            
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
      
      const canvas = canvasRef.current;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.height = height;
      canvas.width = width;
      const gl = canvas.getContext('webgl', { antialias: true } );

      const canvasText = canvasTextRef.current;
      canvasText.height = height;
      canvasText.width = width;
      const ctx = canvasText.getContext( '2d', { antialias: true } );
  
        draw( gl, ctx )
  
      }, [draw])
    
    return (
        <div class="container" style={{ height: 610 }} >
            
            <canvas id="canvasPile" ref={canvasRef} style={{ height: '100%', width: '100%', backgroundColor: 'transparent' }} />
            <canvas id="canvasText" ref={canvasTextRef} style={{ height: '100%', width: '100%', zIndex: 10, backgroundColor: 'transparent', position: 'absolute', left: '0px', top: '0px' }} />
            
            <div id="overlay">
                <div>Volume of selected Pile: <span id="floor_volume">{Elevators.get_Pile_Volume( props.currentPile )} (m³)</span></div>
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