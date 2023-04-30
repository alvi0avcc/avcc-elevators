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
    const [ houseView, setHouseView] = React.useState(true);
    const [ colorMulti, setColorMulti] = React.useState(true);
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

        let cameraMatrix = mat4.create();

        mat4.ortho(cameraMatrix, 0, 70, 0, 70, 0, 200);
        mat4.translate(cameraMatrix, cameraMatrix, [ 35, 20, -100 ]);

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

             attribute vec2 a_texcoord;

             varying vec2 v_texcoord;

            varying vec3 v_surfaceToLight;
            varying vec3 v_surfaceToView;

            uniform mat4 u_world;
            uniform mat4 u_worldViewProjection;
            uniform mat4 u_worldInverseTranspose;

             uniform mat4 u_model;
             uniform mat4 u_camera;

             uniform vec3 u_lightWorldPosition;
             uniform vec3 u_viewWorldPosition;

             varying vec3 v_color;
             varying vec3 v_normal;

             void main(void) {
                 v_color = a_color;
                 gl_Position = u_camera * u_model * a_position;

                 // Pass the normal to the fragment shader
                //v_normal = a_normal;
                v_normal = mat3(u_camera) * a_normal;

                // compute the world position of the surface
                vec3 surfaceWorldPosition = (u_model * a_position).xyz;

                // compute the vector of the surface to the light
                // and pass it to the fragment shader
                v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;

                // compute the vector of the surface to the view/camera
                // and pass it to the fragment shader
                v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;

                // Pass the texcoord to the fragment shader.
                v_texcoord = a_texcoord;

             }`;

        //Use the createShader function from the example above
        const vertexShader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);

        const fragmentShaderSource =`
            precision mediump float;

            // Passed in from the vertex shader.
            varying vec3 v_normal;
            uniform vec3 u_reverseLightDirection;

            varying vec3 v_surfaceToLight;
            varying vec3 v_surfaceToView;

            uniform vec4 u_color;
            uniform float u_shininess;

            // Passed in from the vertex shader.
            varying vec2 v_texcoord;

            // The texture.
            uniform sampler2D u_texture;

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
                //gl_FragColor = vec4(0.0,  0.0,  1.0,  1.0);
                //gl_FragColor = texture2D(u_texture, v_texcoord);

                // Lets multiply just the color portion (not the alpha)
                // by the light
                //gl_FragColor.rgb *= light;

                // Just add in the specular
                //gl_FragColor.rgb += specular;

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
            let colors = [];
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

            let normal = [];
            let _normal = [];
            for ( let i = 0; i < vertices.length; i+=4 ) {
                colors = colors.concat( Math.random(), Math.random(), Math.random(), 1 );
               _normal = Calc.Normal_from_3points( vertices.slice( i, i + 3 ), vertices.slice( i+1, i + 3+1 ), vertices.slice( i+2, i + 3+2 ) );
               vec3.normalize( _normal, _normal );
               normal = normal.concat( _normal );
            }

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

            //mat4.rotateX(normal, normal, -3.14/4);

            // Create a buffer to put normals in
            let normalBuffer = gl.createBuffer();
            // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = normalBuffer)
            gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
            // Put normals data into buffer
            // Записываем данные в буфер
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);
/*
            // provide texture coordinates for the rectangle.
            var texcoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
            // Set Texcoords.
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textures), gl.STATIC_DRAW);

             // Create a texture.
            var texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            // Fill the texture with a 1x1 blue pixel.
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255]));
            // Asynchronously load an image
            var image = new Image();
            image.crossOrigin = 'anonymous';
            image.src = 'https://webglfundamentals.org/webgl/resources/f-texture.png';
            //image.src = 'http://localhost:3000/wwheat-grain.png';
            image.addEventListener('load', function() {
            // Now that the image has loaded make copy it to the texture.
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
            });
*/

            
            // Получим местоположение переменных в программе шейдеров
            
            let uModel = gl.getUniformLocation(program, 'u_model');
            let uCamera = gl.getUniformLocation(program, 'u_camera');
            
            let aPosition = gl.getAttribLocation(program, 'a_position');
            let normalLocation = gl.getAttribLocation(program, "a_normal");
            let aColor = gl.getAttribLocation(program, 'a_color');
            let colorUniformLocation = gl.getUniformLocation(program, "u_color");
            let reverseLightDirectionLocation = gl.getUniformLocation(program, "u_reverseLightDirection");

            let shininessLocation = gl.getUniformLocation(program, "u_shininess");
            let lightWorldPositionLocation = gl.getUniformLocation(program, "u_lightWorldPosition");
           // var viewWorldPositionLocation = gl.getUniformLocation(program, "u_viewWorldPosition");

           var texcoordLocation = gl.getAttribLocation(program, "a_texcoord");
           var textureLocation = gl.getUniformLocation(program, "u_texture");

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
           /* let light_vector = [ 0, 0, 1];
            vec3.normalize( light_vector, light_vector )
            gl.uniform3fv(reverseLightDirectionLocation, light_vector );*/

            // set the light position
            //gl.uniform3fv(lightWorldPositionLocation, [20, 30, 60]);
            //gl.uniform3fv(lightWorldPositionLocation, [ 0, -100, 0 ]);

            // set the shininess
            //let shininess = 100;
            //gl.uniform1f(shininessLocation, shininess);


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

            <div className='block' style={{ marginLeft: -100, padding: 1 }}>
                <button
                    className='myButton'
                    style={{ width: 90 }}
                    onClick={ meshCalc }
                    >calc</button>
                <div className='block'>
                <label className='myText' >Mesh Step</label>
                <input 
                    className='inputPile'
                    id="meshStep" name="meshStep"
                    type='number'
                    value={ step_xy }
                    onChange={ changeMeshStep }
                    />
                </div>
                
                <div className='block' >
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

                <div className='block'>
                <label className='myText' for="houseView">Show warehouse</label>
                <input 
                    className='inputPile'
                    type='checkbox'
                    value={ houseView }
                    defaultChecked
                    id="houseView" name="houseView"
                    onChange={ ()=>{ setHouseView( !houseView ) } }
                    />
                
                </div>

                <div className='block'>
                <label className='myText' for="colorMulti">Multicolor</label>
                <input 
                    className='inputPile'
                    type='checkbox'
                    value={ colorMulti }
                    defaultChecked
                    id="colorMulti" name="colorMulti"
                    onChange={ ()=>{ setColorMulti( !colorMulti ) } }
                    />
                
                </div>

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