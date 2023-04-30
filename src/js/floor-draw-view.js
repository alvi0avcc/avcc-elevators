import React, { useRef, useEffect } from 'react';
import { Elevators } from './elevators.js';
import * as matrix from './3d-matrix.js';
import { mat3, mat4, vec3, vec4 } from 'gl-matrix';
import * as Calc from './calc.js';

const FloorViewCanvas = props => {

    
    const canvasRef = useRef(null)

    let floor = Elevators.FloorCurrentDimensions;

    const [ mesh, setMesh] = React.useState([]);
    const [ meshView, setMeshView] = React.useState(true);
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
        let modelMatrix = mat4.create();
        //mat4.translate(cubeMatrix, cubeMatrix, [0, 0, 0]);
        // Запомним время последней отрисовки кадра
        let lastRenderTime = Date.now();

        // Устанавливаем вьюпорт у WebGL
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.width);

       // Инициализация шейдеров
       /* const vertexShaderSource =
            `attribute vec3 a_position;
            attribute vec3 a_color;
            uniform mat4 u_model;
            uniform mat4 u_camera;
            varying vec3 v_color;
            void main(void) {
                v_color = a_color;
                gl_Position = u_camera * u_model * vec4(a_position, 1.0);
            }`;*/

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

        const vertexShaderSource =
            `attribute vec4 a_position;
             attribute vec3 a_normal;
             attribute vec3 a_color;

             uniform mat4 u_model;
             uniform mat4 u_camera;

             varying vec3 v_color;
             varying vec3 v_normal;

             void main(void) {
                 v_color = a_color;
                 gl_Position = u_camera * u_model * a_position;

                 // Pass the normal to the fragment shader
                //v_normal = a_normal;
                v_normal = mat3(u_model) * a_normal;
             }`;

        /*const vertexShaderSource =
            `attribute vec4 position;
                void main() {
                    gl_Position = position;
                    }`;*/

        //Use the createShader function from the example above
        const vertexShader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);

        const fragmentShaderSource =`
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

 /*       const fragmentShaderSource = `
            void main() {
                gl_FragColor = vec4(0.0,  0.0,  1.0,  1.0);
                }`;*/

        //Use the createShader function from the example above
        const fragmentShader = createShader( gl, fragmentShaderSource, gl.FRAGMENT_SHADER );

        let program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);


            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices),  gl.STATIC_DRAW);

            
            
            let colorBuffer = gl.createBuffer();
            let colors = [1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1 ];
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

            let normal = [];
            let _normal = [];
            for ( let i = 0; i < vertices.length; i+=4 ) {
               colors = colors.concat( Math.random(), Math.random(), Math.random() );
               _normal = Calc.Normal_from_3points( vertices.slice( i, i + 3 ), vertices.slice( i+1, i + 3+1 ), vertices.slice( i+2, i + 3+2 ) );
               vec3.normalize( _normal, _normal );
               normal = normal.concat( _normal );
            }

            //mat4.rotateX(normal, normal, -3.14/4);

            // Create a buffer to put normals in
            let normalBuffer = gl.createBuffer();
            // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = normalBuffer)
            gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
            // Put normals data into buffer
            // Записываем данные в буфер
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);

            
            // Получим местоположение переменных в программе шейдеров
            
            let uModel = gl.getUniformLocation(program, 'u_model');
            let uCamera = gl.getUniformLocation(program, 'u_camera');
            
            let aPosition = gl.getAttribLocation(program, 'a_position');
            let normalLocation = gl.getAttribLocation(program, "a_normal");
            let aColor = gl.getAttribLocation(program, 'a_color');
            let colorUniformLocation = gl.getUniformLocation(program, "u_color");
            let reverseLightDirectionLocation = gl.getUniformLocation(program, "u_reverseLightDirection");

            mat4.rotateX(modelMatrix, modelMatrix, -3.14/4);
            

//----------------------------------------------------------------------
        function render() {
            // Запрашиваем рендеринг на следующий кадр
            requestAnimationFrame(render);
        
            // Получаем время прошедшее с прошлого кадра
            var time = Date.now();
            var dt = lastRenderTime - time;
        
            // Вращаем куб относительно оси Z
            mat4.rotateZ(modelMatrix, modelMatrix, dt / 4000);

            // Очищаем сцену, закрашивая её в белый цвет
            gl.clearColor(1.0, 1.0, 1.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
            // Включаем фильтр глубины
            gl.enable(gl.DEPTH_TEST);
        
            gl.enable(gl.CULL_FACE);

            gl.useProgram(program);
        
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.enableVertexAttribArray(aPosition);
            gl.vertexAttribPointer(aPosition, 4, gl.FLOAT, false, 0, 0);



            // Turn on the normal attribute
            gl.enableVertexAttribArray(normalLocation);

            // Bind the normal buffer.
            gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

            gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);

        /*
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            gl.enableVertexAttribArray(aColor);
            gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);
        */
            gl.uniformMatrix4fv(uModel, false, modelMatrix);
            gl.uniformMatrix4fv(uCamera, false, cameraMatrix);

            //let light_vector = [0.5, 0.7, 1];
            let light_vector = [ 0, 0, 1];
            vec3.normalize( light_vector, light_vector )
            gl.uniform3fv(reverseLightDirectionLocation, light_vector );

        
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

            //piles
            //gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);
            gl.uniform4f(colorUniformLocation, 0, 0, 1, 1);
            //gl.uniform4f(colorUniformLocation, 1, 1, 0, 1);
            //gl.drawArrays(gl.LINE_STRIP, 36, mesh.length/4 );
            //gl.drawArrays(gl.TRIANGLE_STRIP, 36, mesh.length/4 );
            for ( let i = 36; i < mesh.length; i+= ( step_xy + 2 ) * 2 ) {
                if ( meshView ) { gl.drawArrays(gl.LINE_STRIP,  i, ( step_xy + 1 ) * 2 ); 
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

                
                <div style={{ marginTop: 10 }}><hr/></div>
                <label className='myText' >View:</label>

                <button
                    className='myButton'
                    style={{ width: 80 }}
                    onClick={ ()=>{ setMeshView(true); } }
                    >Mesh</button>

                <button
                    className='myButton'
                    style={{ width: 80 }}
                    onClick={ ()=>{ setMeshView(false); } }
                    >Solid</button>

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