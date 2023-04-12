import React, { useRef, useEffect } from 'react';
import { Elevators } from './elevators.js';
//import { Matrix4 } from 'three';
import { mat4 } from 'gl-matrix';






const FloorViewCanvas = props => {

    
    const canvasRef = useRef(null)

    let data = Elevators.FloorCurrentDimensions;
    let Length = data.Length;
    let Width = data.Width;
    let Height = data.Height;
    let data_draw = [   -Length/2, -Width/2, -Height/2,
                        -Length/2, -Width/2, Height/2,
                        -Length/2, Width/2, Height/2,
                        -Length/2, Width/2, -Height/2,

                        Length/2, -Width/2, -Height/2,
                        Length/2, -Width/2, Height/2,
                        Length/2, Width/2, Height/2,
                        Length/2, Width/2, -Height/2,

                        -Length/2, -Width/2, -Height/2,
                        -Length/2, Width/2, -Height/2,
                        Length/2, Width/2, -Height/2,
                        Length/2, -Width/2, -Height/2,

                        -Length/2, -Width/2 ,Height/2,
                        -Length/2, Width/2, Height/2,
                        Length/2, Width/2, Height/2,
                        Length/2, -Width/2, Height/2
                    ];
    let zoom = 1/Length;
    /*data_draw[0] = ;
    data_draw[0] = ;
    data_draw[0] = ;*/
    //Length: 0, Width: 0, Height: 0, Conus_height: 0, Conus_L: 0, Conus_W: 0, Conus_X :0, Conus_Y:0 }

    const draw = (gl) => {

        // Инициализация данных
                    let vertexBuffer = gl.createBuffer();

                    let vertices = [0, 0, 0,
                                    0, 1, 0,
                                    1, 1, 0,
                                    1, 0, 0,
                                    
                                    0, 0, 1,
                                    0, 1, 1,
                                    1, 1, 1,
                                    1, 0, 1,
                                    ];

        vertices = data_draw;
        // матрица перспективы

        /*Метод mat4.perspective(matrix, fov, aspect, near, far) принимает пять параметров:
        matrix — матрица, которую необходимо изменить;
        fov — угл обзора в радианах;
        aspect — cоотношение сторон экрана;
        near — минимальное расстояние до объектов, которые будут видны;
        far — максимальное расстояние до объектов, которые будут видны.*/

        let cameraMatrix = mat4.create();
        //mat4.perspective(cameraMatrix, 1, 1, 0.1, 1000);
        mat4.ortho(cameraMatrix, 0, 100, 0, 100, 0.1, 1000);
        mat4.translate(cameraMatrix, cameraMatrix, [50, 50, -100]);

        // Создадим единичную матрицу положения куба
        let cubeMatrix = mat4.create();
        //mat4.translate(cubeMatrix, cubeMatrix, [0, 0, 0]);
        // Запомним время последней отрисовки кадра
        let lastRenderTime = Date.now();

        // Устанавливаем вьюпорт у WebGL
        gl.viewport(0, 0, 400, 400);

       // Инициализация шейдеров
        const vertexShaderSource =
            `attribute vec3 a_position;
            attribute vec3 a_color;
            uniform mat4 u_cube;
            uniform mat4 u_camera;
            varying vec3 v_color;
            void main(void) {
                v_color = a_color;
                gl_Position = u_camera * u_cube * vec4(a_position, 1.0);
            }`;

        //Use the createShader function from the example above
        const vertexShader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);

        const fragmentShaderSource =
            `precision mediump float;
            varying vec3 v_color;
            void main(void) {
                gl_FragColor = vec4(v_color.rgb, 1.0);
            }`;

        //Use the createShader function from the example above
        const fragmentShader = createShader( gl, fragmentShaderSource, gl.FRAGMENT_SHADER );

        let program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);


            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices),  gl.STATIC_DRAW);
            
            let colorBuffer = gl.createBuffer();
            let colors = [1, 0, 0, 0, 1, 0, 0, 0, 1];
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
            
            // Получим местоположение переменных в программе шейдеров
            
            let uCube = gl.getUniformLocation(program, 'u_cube');
            let uCamera = gl.getUniformLocation(program, 'u_camera');
            
            let aPosition = gl.getAttribLocation(program, 'a_position');
            let aColor = gl.getAttribLocation(program, 'a_color');
//----------------------------------------------------------------------
        function render() {
            // Запрашиваем рендеринг на следующий кадр
            requestAnimationFrame(render);
        
            // Получаем время прошедшее с прошлого кадра
            var time = Date.now();
            var dt = lastRenderTime - time;
        
            // Вращаем куб относительно оси Y
            mat4.rotateY(cubeMatrix, cubeMatrix, dt / 2000);
            // Вращаем куб относительно оси Z
            mat4.rotateZ(cubeMatrix, cubeMatrix, dt / 2000);
            // Вращаем куб относительно оси X
            //mat4.rotateX(cubeMatrix, cubeMatrix, dt / 1000);
        
            // Очищаем сцену, закрашивая её в белый цвет
            gl.clearColor(1.0, 1.0, 1.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
            // Включаем фильтр глубины
            gl.enable(gl.DEPTH_TEST);
        
            gl.useProgram(program);
        
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.enableVertexAttribArray(aPosition);
            gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
        
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            gl.enableVertexAttribArray(aColor);
            gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);
        
            gl.uniformMatrix4fv(uCube, false, cubeMatrix);
            gl.uniformMatrix4fv(uCamera, false, cameraMatrix);
        
            //l.drawArrays(gl.TRIANGLES, 0, 36);
            gl.drawArrays(gl.LINE_LOOP, 0, 4);
            gl.drawArrays(gl.LINE_LOOP, 4, 4);
            gl.drawArrays(gl.LINE_LOOP, 8, 4);
            gl.drawArrays(gl.LINE_LOOP, 12, 4);
        
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
      
      const canvas = canvasRef.current
      canvas.height = 400;
      canvas.width = 400;
      const gl = canvas.getContext('webgl')
  
        draw(gl)
  
      }, [draw])
    
    return <canvas ref={canvasRef} {...props}/>
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