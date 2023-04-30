import React, { useRef, useEffect } from 'react';
import { Elevators } from './elevators.js';
import * as matrix from './3d-matrix.js';
import { mat3, mat4, vec3, vec4 } from 'gl-matrix';
import * as Calc from './calc.js';

const FloorViewCanvas = props => {

    
    const canvasRef = useRef(null)

    let floor = Elevators.FloorCurrentDimensions;

    const [ mesh, setMesh] = React.useState([]);
    const [ step_xy, setStep_xy] = React.useState( 50 );

    const meshCalc = ()=>{
        let a = Elevators.get_Volume_Piles_v2( Elevators.WarehouseSelected, step_xy ).mesh_3D;
        a = matrix.MoveMatrixAny( a, -Length/2, -Width/2, -Height/2 );
        setMesh( a );
    }

    const changeMeshStep = (event)=>{
        setStep_xy( Number ( event.target.value ) );
    }

    let Length = floor.Length;
    let Width = floor.Width;
    let Height = floor.Height;
    let Conus_height = floor.Conus_height;
    let Conus_L = floor.Conus_L;
    let Conus_W = floor.Conus_W;
    let Conus_X = floor.Conus_X;
    let Conus_Y = floor.Conus_Y;
    ;

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

    const draw = (gl) => {

        // Инициализация данных
        let vertexBuffer = gl.createBuffer();

        let vertices = korpus_draw.concat(head_draw, conus_draw, mesh );

        // матрица перспективы

        /*Метод mat4.perspective(matrix, fov, aspect, near, far) принимает пять параметров:
        matrix — матрица, которую необходимо изменить;
        fov — угл обзора в радианах;
        aspect — cоотношение сторон экрана;
        near — минимальное расстояние до объектов, которые будут видны;
        far — максимальное расстояние до объектов, которые будут видны.*/

        let cameraMatrix = mat4.create();
        //mat4.perspective(cameraMatrix, 1, 1, 0.5, 1000);
        //mat4.translate(cameraMatrix, cameraMatrix, [0, 0, -100]);
        mat4.ortho(cameraMatrix, 0, 70, 0, 70, 0, 200);
        mat4.translate(cameraMatrix, cameraMatrix, [ 35, 15, -100 ]);

        // Создадим единичную матрицу положения куба
        let cubeMatrix = mat4.create();
        //mat4.translate(cubeMatrix, cubeMatrix, [0, 0, 0]);
        // Запомним время последней отрисовки кадра
        let lastRenderTime = Date.now();

        // Устанавливаем вьюпорт у WebGL
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.width);

       // Инициализация шейдеров

        /*const vertexShaderSource =
           `attribute vec3 a_position;
            attribute vec3 a_color;
            uniform mat4 u_cube;
            uniform mat4 u_camera;
            varying vec3 v_color;
            void main(void) {
                v_color = a_color;
                gl_Position = u_camera * u_cube * vec4(a_position, 1.0);
            }`;*/

            //attribute vec3 a_color;
            //varying vec3 v_color;
// v_color = a_color;
        const vertexShaderSource = `
        attribute vec4 a_position;
        attribute vec3 a_normal;
        
        uniform mat4 u_matrix;
        
        varying vec3 v_normal;
        
        void main() {
          // Multiply the position by the matrix.
          gl_Position = u_matrix * a_position;
        
          // Pass the normal to the fragment shader
          v_normal = a_normal;
             }`;

        //Use the createShader function from the example above
        const vertexShader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);

        /*const fragmentShaderSource =
            `precision mediump float;
            varying vec3 v_color;
            void main(void) {
                gl_FragColor = vec4(v_color.rgb, 1.0);
            }`;*/

        const fragmentShaderSource = `
        precision mediump float;

        // Passed in from the vertex shader.
        varying vec3 v_normal;
        
        uniform vec3 u_reverseLightDirection;
        uniform vec4 u_color;
        
        void main() {
          // because v_normal is a varying it's interpolated
          // so it will not be a unit vector. Normalizing it
          // will make it a unit vector again
          vec3 normal = normalize(v_normal);
        
          float light = dot(normal, u_reverseLightDirection);
        
          gl_FragColor = u_color;
        
          // Lets multiply just the color portion (not the alpha)
          // by the light
          gl_FragColor.rgb *= light;
                }`;
//gl_FragColor = vec4(0.0,  0.0,  1.0,  1.0);
        //Use the createShader function from the example above
        const fragmentShader = createShader( gl, fragmentShaderSource, gl.FRAGMENT_SHADER );

        let program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);


            //gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices),  gl.STATIC_DRAW);
            
            //let colorBuffer = gl.createBuffer();
            //let colors = [1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1 ];
            let colors = [];
            let normal = [];
            let _normal = [];
            for ( let i = 0; i < vertices.length; i+=4 ) {
               colors = colors.concat( Math.random(), Math.random(), Math.random() );
               _normal = Calc.Normal_from_3points( vertices.slice( i, i + 3 ), vertices.slice( i+1, i + 3+1 ), vertices.slice( i+2, i + 3+2 ) );
               vec3.normalize( _normal, _normal );
               normal = normal.concat( _normal );
            }
            //console.log('normal = ',normal);
            //gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
            /*
            // Создаём буфер для нормалей
            let normalBuffer = gl.createBuffer();
            // Привязываем его к ARRAY_BUFFER (условно говоря, ARRAY_BUFFER = normalBuffer)
            gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
            // Записываем данные в буфер
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);
            //setNormals(gl);
*/

            // look up where the vertex data needs to go.
  var positionLocation = gl.getAttribLocation(program, "a_position");
  var normalLocation = gl.getAttribLocation(program, "a_normal");

  // lookup uniforms
  var matrixLocation = gl.getUniformLocation(program, "u_matrix");
  var colorLocation = gl.getUniformLocation(program, "u_color");
  var reverseLightDirectionLocation =
      gl.getUniformLocation(program, "u_reverseLightDirection");

       // Create a buffer to put positions in
  var positionBuffer = gl.createBuffer();
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // Put geometry data into buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices),  gl.STATIC_DRAW);;

  // Create a buffer to put normals in
  var normalBuffer = gl.createBuffer();
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = normalBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  // Put normals data into buffer
  // Записываем данные в буфер
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);



      /*
            // Получим местоположение переменных в программе шейдеров
            
            let uCube = gl.getUniformLocation(program, 'u_cube');
            let uCamera = gl.getUniformLocation(program, 'u_camera');
            
            let aPosition = gl.getAttribLocation(program, 'a_position');
            //let aColor = gl.getAttribLocation(program, 'a_color');
            let normalLocation = gl.getAttribLocation(program, "a_normal");

            let colorLocation  = gl.getUniformLocation(program, "u_color");
            let reverseLightDirectionLocation = gl.getUniformLocation(program, "u_reverseLightDirection");
*/
            mat4.rotateX(cubeMatrix, cubeMatrix, -3.14/4);



//----------------------------------------------------------------------
        function render() {
            // Запрашиваем рендеринг на следующий кадр
            requestAnimationFrame(render);
        
            // Получаем время прошедшее с прошлого кадра
            let time = Date.now();
            let dt = lastRenderTime - time;
        
            // Вращаем куб относительно оси X
            //mat4.rotateX(cubeMatrix, cubeMatrix, -3.14/4);
            // Вращаем куб относительно оси Y
            //mat4.rotateY(cubeMatrix, cubeMatrix, dt / 4000);
            // Вращаем куб относительно оси Z
            mat4.rotateZ(cubeMatrix, cubeMatrix, dt / 4000);
            // Вращаем куб относительно оси X
            //mat4.rotateX(cubeMatrix, cubeMatrix, 1);
        
            // Очищаем сцену, закрашивая её в белый цвет
            gl.clearColor(1.0, 1.0, 1.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
            gl.enable(gl.CULL_FACE)

            // Включаем фильтр глубины
            gl.enable(gl.DEPTH_TEST);
        
            gl.useProgram(program);

            // Turn on the position attribute
    gl.enableVertexAttribArray(positionLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    gl.vertexAttribPointer(positionLocation, 4, gl.FLOAT, false, 0, 0);

    // Turn on the normal attribute
    gl.enableVertexAttribArray(normalLocation);

    // Bind the normal buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

    gl.vertexAttribPointer(normalLocation, 4, gl.FLOAT, false, 0, 0);

    // Compute the projection matrix
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var zNear = 1;
    var zFar = 2000;
    //var projectionMatrix = mat4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

    
    
/*
    // Compute the camera's matrix
    var camera = [100, 150, 200];
    var target = [0, 35, 0];
    var up = [0, 1, 0];
    var cameraMatrix = m4.lookAt(camera, target, up);
*/
    // Make a view matrix from the camera matrix.
    //var viewMatrix = m4.inverse(cameraMatrix);
    //var viewMatrix = mat4.invert( cameraMatrix, cameraMatrix);
    let viewMatrix = mat4.create();
    //mat4.translate(viewMatrix, viewMatrix, [ 35, 15, -100 ]);
    

    // Compute a view projection matrix
    //var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
    //var viewProjectionMatrix = mat4.multiply(projectionMatrix, viewMatrix);
    //var viewProjectionMatrix = mat4.perspective(viewMatrix, 1, 1, 0.5, 1000);
    let viewProjectionMatrix = mat4.create();
    mat4.perspective(viewProjectionMatrix, 1, 1, 0.5, 1000);

    //mat4.ortho(cameraMatrix, 0, 70, 0, 70, 0, 200);

    // Draw a F at the origin
    //var worldMatrix = m4.yRotation(fRotationRadians);

    // Multiply the matrices.
    //var worldViewProjectionMatrix = m4.multiply(viewProjectionMatrix, worldMatrix);
    let worldViewProjectionMatrix = mat4.create();
    //var worldViewProjectionMatrix = mat4.rotateY(viewProjectionMatrix, viewProjectionMatrix, dt / 4000 );
    mat4.rotateY(worldViewProjectionMatrix, viewProjectionMatrix, dt / 4000 );

    // Set the matrix.
    gl.uniformMatrix4fv(matrixLocation, false, worldViewProjectionMatrix);

    // Set the color to use
    gl.uniform4fv(colorLocation, [0.2, 1, 0.2, 1]); // green

    // set the light direction.
    //gl.uniform3fv(reverseLightDirectionLocation, vec3.normalize([0.5, 0.7, 1]));
    let light_vector = [0.5, 0.7, 1];
            vec3.normalize( light_vector, light_vector )
    gl.uniform3fv(reverseLightDirectionLocation, light_vector );



        /*
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.enableVertexAttribArray(aPosition);
            gl.vertexAttribPointer(aPosition, 4, gl.FLOAT, false, 0, 0);*/
        /*
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            gl.enableVertexAttribArray(aColor);
            gl.vertexAttribPointer(aColor, 3, gl.FLOAT, true, 0, 0);
        */
            // Включаем атрибут нормалей
          /*  gl.enableVertexAttribArray(normalLocation);
            // Привязываем буфер нормалей
            gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
            gl.vertexAttribPointer(normalLocation, 4, gl.FLOAT, false, 0, 0);


            gl.uniformMatrix4fv(uCube, false, cubeMatrix);
            gl.uniformMatrix4fv(uCamera, false, cameraMatrix);
        

            // Устанавливаем цвет
            gl.uniform4fv(colorLocation, [1, 1, 0.2, 1]); // зелёный
 
            // Задаём направление света
            let light_vector = [ 0, -1, 1];
            vec3.normalize( light_vector, light_vector )
            gl.uniform3fv(reverseLightDirectionLocation, light_vector );

            //gl.drawArrays(gl.TRIANGLES, 0, 24);
            //gl.drawElements(gl.LINE_LOOP, 36, gl.UNSIGNED_SHORT, 0);

            // Set a random color.
            //gl.uniform4f(uColor, Math.random(), Math.random(), Math.random(), 1);
*/
            //korpus
            //gl.uniform4f(uColor, 1, 0, 0, 1);
            gl.drawArrays(gl.LINE_LOOP, 0, 4);
            gl.drawArrays(gl.LINE_LOOP, 4, 4);
            gl.drawArrays(gl.LINE_LOOP, 8, 4);
            gl.drawArrays(gl.LINE_LOOP, 12, 4);
            //head
            //gl.uniform4f(uColor, 0, 1, 0, 1);
            gl.drawArrays(gl.LINE_LOOP, 16, 4);
            gl.drawArrays(gl.LINE_LOOP, 20, 4);
            //conus
            //gl.uniform4f(uColor, 0, 0, 1, 1);
            gl.drawArrays(gl.LINE_LOOP, 24, 4);
            gl.drawArrays(gl.LINE_LOOP, 28, 4);
            gl.drawArrays(gl.LINE_LOOP, 31, 4);

            //piles
            //gl.uniform4f(uColor, 0, 0.5, 1, 1);
            //gl.drawArrays(gl.LINE_STRIP, 36, mesh.length/4 );
            gl.drawArrays(gl.TRIANGLE_STRIP, 36, mesh.length/4 );
            /*for ( let i = 36; i < mesh.length/4; i+= step_xy ) {
                gl.drawArrays(gl.LINE_STRIP, i, step_xy );
            }*/
        
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

            <div className='block' style={{ marginLeft: -91, padding: 1 }}>
                <button
                    className='myButton'
                    style={{ width: 80 }}
                    onClick={ meshCalc }
                    >calc</button>

                <label className='myText' >Mesh Step</label>
                <input 
                    className='inputPile'
                    type='number'
                    value={ step_xy }
                    onChange={ changeMeshStep }
                    />
            </div>
    </div>
    );
  }
  
  export default FloorViewCanvas




  
  function createShader(gl, sourceCode, type) {
    // Compiles either a shader of type gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
    const shader = gl.createShader(type);
    gl.shaderSource(shader, sourceCode);
    gl.compileShader(shader);
  
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader);
      throw `Could not compile WebGL program. \n\n${info}`;
    }
    return shader;
  }