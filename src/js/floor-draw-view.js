import React, { useRef, useEffect } from 'react';
import { Elevators } from './elevators.js';
import * as matrix from './3d-matrix.js';
import { mat3, mat4, vec3, vec4 } from 'gl-matrix';
import * as Calc from './calc.js';

const FloorViewCanvas = props => {

    let time1 = new Date().getTime(); //time control
    
    const canvasRef = useRef(null)

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
    let mesh = [];

    mesh = Elevators.get_Floor_Mesh_3D;
    mesh = matrix.MoveMatrixAny( mesh, -Length/2, -Width/2, -Height/2 );

    // Korpus                
    let korpus_draw = [ -Length/2, -Width/2, -Height/2, 1,
                        -Length/2,  Width/2, -Height/2, 1,
                        -Length/2,  Width/2,  Height/2, 1,
                        -Length/2, -Width/2,  Height/2, 1,

                         Length/2, -Width/2, -Height/2, 1,
                         Length/2,  Width/2, -Height/2, 1,
                         Length/2,  Width/2,  Height/2, 1,
                         Length/2, -Width/2,  Height/2, 1,

                        -Length/2, -Width/2, -Height/2, 1,
                        -Length/2, -Width/2,  Height/2, 1,
                         Length/2, -Width/2,  Height/2, 1,
                         Length/2, -Width/2, -Height/2, 1,

                        -Length/2,  Width/2, -Height/2, 1,
                        -Length/2,  Width/2,  Height/2, 1,
                         Length/2,  Width/2,  Height/2, 1,
                         Length/2,  Width/2, -Height/2, 1
                        ];
    // Head                
    let head_up = Height/3;
    let head_draw = [  -Length/2,    -Width/2,           Height/2, 1,
                       -Length/2,           0, Height/2 + head_up, 1,
                        Length/2,           0, Height/2 + head_up, 1,
                        Length/2,    -Width/2,           Height/2, 1,

                       -Length/2,     Width/2,           Height/2, 1,
                       -Length/2,           0, Height/2 + head_up, 1,
                        Length/2,           0, Height/2 + head_up, 1,
                        Length/2,     Width/2,           Height/2, 1    
                    ];
    // Bottom Conus                
    let conus_draw = [ -Length/2,                                               Width/2,                -Height/2, 1,
                        Length/2,                                               Width/2,                -Height/2, 1,
                       -Length/2 + Conus_X + Conus_L/2 , -Width/2 + Conus_Y + Conus_W/2, -Height/2 - Conus_height, 1,
                       -Length/2 + Conus_X - Conus_L/2 , -Width/2 + Conus_Y + Conus_W/2, -Height/2 - Conus_height, 1,

                       -Length/2,                                              -Width/2,                -Height/2, 1,
                        Length/2,                                              -Width/2,                -Height/2, 1,
                       -Length/2 + Conus_X + Conus_L/2 , -Width/2 + Conus_Y - Conus_W/2, -Height/2 - Conus_height, 1,
                       -Length/2 + Conus_X - Conus_L/2 , -Width/2 + Conus_Y - Conus_W/2, -Height/2 - Conus_height, 1,

                       -Length/2 + Conus_X - Conus_L/2 , -Width/2 + Conus_Y + Conus_W/2, -Height/2 - Conus_height, 1,
                       -Length/2 + Conus_X + Conus_L/2 , -Width/2 + Conus_Y + Conus_W/2, -Height/2 - Conus_height, 1,
                       -Length/2 + Conus_X + Conus_L/2 , -Width/2 + Conus_Y - Conus_W/2, -Height/2 - Conus_height, 1,
                       -Length/2 + Conus_X - Conus_L/2 , -Width/2 + Conus_Y - Conus_W/2, -Height/2 - Conus_height, 1
                ];

    //let vertices = mesh.concat( korpus_draw, head_draw, conus_draw  );
    let vertices = korpus_draw.concat( head_draw, conus_draw, mesh );
    //let vertices = mesh ;

    let colors = [];
    let normal = [];
    for ( let i = 0; i < 36; i++ ){
        //normal = normal.concat( [ 0, 0, 1 ] );
        normal.push( 0, 0, 1 );
    }

    //let normal = [];
    let _normal = [];
    for ( let i = 0; i < mesh.length; i+=4 ) {
        //colors = colors.concat( Math.random(), Math.random(), Math.random(), 1 );
        colors.push( Math.random(), Math.random(), Math.random(), 1 );
        _normal = Calc.Normal_from_3points( mesh.slice( i, i + 3 ), mesh.slice( i+4, i + 3+4 ), mesh.slice( i+8, i + 3+8 ) );
        //vec3.normalize( _normal, _normal );
        //normal = normal.concat( _normal );
        normal.push( _normal[0], _normal[1], _normal[2] );
    }

    //normal = normal.concat( [ 0,0,0 ] );
    //console.log('normal = ', normal);

    let time2 = new Date().getTime(); // time control
    console.log('floor - canvas init - (time working) = ', time2 - time1, ' ms');

    const draw = (gl) => {

        let time1 = new Date().getTime(); //time control draw 

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
            v_normal = mat3(u_modelView) * a_normal;
            //v_normal = a_normal;

            // compute the world position of the surface
            vec3 surfaceWorldPosition = (u_modelView * a_position).xyz;

            // compute the vector of the surface to the light
            // and pass it to the fragment shader
            v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;

            // compute the vector of the surface to the view/camera
            // and pass it to the fragment shader
            v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;
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

            vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
            vec3 surfaceToViewDirection = normalize(v_surfaceToView);
            vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

            float light = dot(normal, surfaceToLightDirection);
            float specular = 0.0;
            if (light > 0.0) {
                specular = pow(dot(normal, halfVector), u_shininess);
            }

            gl_FragColor = u_color;

            // Lets multiply just the color portion (not the alpha)
            // by the light
            gl_FragColor.rgb *= light;

            // Just add in the specular
            //gl_FragColor.rgb += specular;

        }`;
    //use the compileShader function for create Shaders
    const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader( gl, fragmentShaderSource, gl.FRAGMENT_SHADER );

    // create program from Shaders
    let program = createProgram(gl, vertexShader, fragmentShader)

    //--------------------------------------------Инициализация шейдеров
        var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        //perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    //--------------------------------------------Устанавливаем вьюпорт у WebGL
        //gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)

    //--------------------------------------------Получим местоположение переменных в программе шейдеров
        let uModelView = gl.getUniformLocation(program, 'u_modelView');
        let uProjection = gl.getUniformLocation(program, 'u_projection');
        let aPosition = gl.getAttribLocation(program, 'a_position');
        let normalLocation = gl.getAttribLocation(program, "a_normal");
        //let aColor = gl.getAttribLocation(program, 'a_color');
        let colorUniformLocation = gl.getUniformLocation(program, "u_color");
        let reverseLightDirectionLocation = gl.getUniformLocation(program, "u_reverseLightDirection");
        let shininessLocation = gl.getUniformLocation(program, "u_shininess");
        let lightWorldPositionLocation = gl.getUniformLocation(program, "u_lightWorldPosition");
       // var viewWorldPositionLocation = gl.getUniformLocation(program, "u_viewWorldPosition");
        //let texcoordLocation = gl.getAttribLocation(program, "a_texcoord");
        //let textureLocation = gl.getUniformLocation(program, "u_texture");

    //--------------------------------------------
        let vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices),  gl.STATIC_DRAW);
            
        let colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        let normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);    

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
            mat4.ortho(projectionMatrix, 0, 70, 0, 70, 0, 200);
            mat4.translate(projectionMatrix, projectionMatrix, [ 35, 30, -100 ]);

            let modelMatrix = mat4.create();
            mat4.rotateX(modelMatrix, modelMatrix, -3.14/4);


            let time2 = new Date().getTime(); // time control draw
            console.log('floor - draw - (time working) = ', time2 - time1, ' ms');
//----------------------------------------------------------------------
        function render() {

            houseView = Elevators.get_Floor_ShowHouse;
            meshView = Elevators.get_Floor_MeshStyle;
            colorMulti = Elevators.get_Floor_Multicolor;

        // Запрашиваем рендеринг на следующий кадр
            requestAnimationFrame(render);
        
        // Получаем время прошедшее с прошлого кадра
            var time = Date.now();
            var dt = lastRenderTime - time;

        //--------------------------------------------  Вращаем куб относительно оси Z
           mat4.rotateZ(modelMatrix, modelMatrix, dt / 4000);
        //----------------------------------------------------------------------
            gl.clearColor(1.0, 1.0, 1.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        //----------------------------------------------------------------------
            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.CULL_FACE);
        //----------------------------------------------------------------------
            gl.useProgram(program);
        //----------------------------------------------------------------------
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.enableVertexAttribArray(aPosition);
            gl.vertexAttribPointer(aPosition, 4, gl.FLOAT, false, 0, 0);

            // Bind the normal buffer.
            gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
            gl.enableVertexAttribArray(normalLocation);
            gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);
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
            let light_vector = [ 0, 0, 1];
            vec3.normalize( light_vector, light_vector )
            gl.uniform3fv(reverseLightDirectionLocation, light_vector );

            // set the light position
            //gl.uniform3fv(lightWorldPositionLocation, [20, 30, 60]);
            gl.uniform3fv(lightWorldPositionLocation, [ 0, 25, 50 ]);

            // set the shininess
            let shininess = 50;
            gl.uniform1f(shininessLocation, shininess);

            if ( houseView ) {
                //korpus
                gl.uniform4f(colorUniformLocation, 0, 0, 1, 1);
                gl.drawArrays(gl.LINE_LOOP, 0, 4);
                gl.drawArrays(gl.LINE_LOOP, 4, 4);
                gl.drawArrays(gl.LINE_LOOP, 8, 4);
                gl.drawArrays(gl.LINE_LOOP, 12, 4);
                //head
                gl.uniform4f(colorUniformLocation, 0, 1, 0, 1);
                gl.drawArrays(gl.LINE_LOOP, 16, 4);
                gl.drawArrays(gl.LINE_LOOP, 20, 4);
                //conus
                gl.uniform4f(colorUniformLocation, 1, 0, 0, 1);
                gl.drawArrays(gl.LINE_LOOP, 24, 4);
                gl.drawArrays(gl.LINE_LOOP, 28, 4);
                gl.drawArrays(gl.LINE_LOOP, 31, 4);
                }

            //piles
            for ( let i = 36; i < mesh.length; i+= ( step_xy + 2 ) * 2 ) {

                if ( colorMulti ) { gl.uniform4f(colorUniformLocation, colors[i], colors[i+1], colors[i+2], colors[i+3]); 
                } else { gl.uniform4f(colorUniformLocation, 0.0,  0.0,  1.0,  1.0); };

                if ( meshView == 'mesh' ) { gl.drawArrays(gl.LINE_STRIP,  i, ( step_xy + 1 ) * 2 ); 
                } else { gl.drawArrays(gl.TRIANGLE_STRIP, i, ( step_xy + 1 ) * 2 ); }
            }

            lastRenderTime = time;

            
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
      const gl = canvas.getContext('webgl')
  
        draw(gl)
  
      }, [draw])
    
    return (
    <div style={{ display: 'flex', flexDirection: 'row', height: 450 }}>

            <canvas ref={canvasRef} {...props} style={{ width: '100%', height: '100%' }} />

    </div>
    );
  }
  
  export default FloorViewCanvas




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