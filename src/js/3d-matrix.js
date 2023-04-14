
//------------------------------------------------------------------------------------------------
export let identityMatrix = [ 1, 0, 0, 0,
                       0, 1, 0, 0, 
                       0, 0, 1, 0, 
                       0, 0, 0, 1 ];
//------------------------------------------------------------------------------------------------

export function translationMatrix( x, y, z){
  let result = [ 1, 0, 0, 0,
                 0, 1, 0, 0, 
                 0, 0, 1, 0, 
                 x, y, z, 1 ];
  return result;
}

//------------------------------------------------------------------------------------------------

export function scaleMatrix( x, y, z){
  let result = [x, 0, 0, 0, 
                0, y, 0, 0, 
                0, 0, z, 0, 
                0, 0, 0, 1 ];
  return result;
}
//------------------------------------------------------------------------------------------------
export function RotationX(angle) {
  const rad = Math.PI / 180 * angle;
  let result =[1, 0, 0, 0,
              0, Math.cos(rad), -Math.sin(rad), 0,
              0, Math.sin(rad), Math.cos(rad), 0,
              0, 0, 0, 1];
  return result;
}

export function RotationY(angle) {
  const rad = Math.PI / 180 * angle;
  let result =[Math.cos(rad), 0, Math.sin(rad), 0,
              0, 1, 0, 0,
              -Math.sin(rad), 0, Math.cos(rad), 0,
              0, 0, 0, 1];

  return result;
}

export function RotationZ(angle) {
  const rad = Math.PI / 180 * angle;
  let result =[Math.cos(rad), -Math.sin(rad), 0, 0,
              Math.sin(rad), Math.cos(rad), 0, 0,
              0, 0, 1, 0,
              0, 0, 0, 1];
  return result;
}
//------------------------------------------------------------------------------------------------

// point • matrix   Multiplying a matrix and a point
export function multiplyMatrixAndPoint(matrix, point) {
  // Give a simple variable name to each part of the matrix, a column and row number
  let c0r0 = matrix[0],
    c1r0 = matrix[1],
    c2r0 = matrix[2],
    c3r0 = matrix[3];
  let c0r1 = matrix[4],
    c1r1 = matrix[5],
    c2r1 = matrix[6],
    c3r1 = matrix[7];
  let c0r2 = matrix[8],
    c1r2 = matrix[9],
    c2r2 = matrix[10],
    c3r2 = matrix[11];
  let c0r3 = matrix[12],
    c1r3 = matrix[13],
    c2r3 = matrix[14],
    c3r3 = matrix[15];

  // Now set some simple names for the point
  let x = point[0];
  let y = point[1];
  let z = point[2];
  let w = point[3];

  // Multiply the point against each part of the 1st column, then add together
  let resultX = x * c0r0 + y * c0r1 + z * c0r2 + w * c0r3;

  // Multiply the point against each part of the 2nd column, then add together
  let resultY = x * c1r0 + y * c1r1 + z * c1r2 + w * c1r3;

  // Multiply the point against each part of the 3rd column, then add together
  let resultZ = x * c2r0 + y * c2r1 + z * c2r2 + w * c2r3;

  // Multiply the point against each part of the 4th column, then add together
  let resultW = x * c3r0 + y * c3r1 + z * c3r2 + w * c3r3;

  return [resultX, resultY, resultZ, resultW];
}
//------------------------------------------------------------------------------------------------

//matrixB • matrixA    Multiplying two matrices
export function multiplyMatrices(matrixA, matrixB) {
  // Slice the second matrix up into rows
  //console.log('matrixA= ', matrixA  );
  //console.log('matrixB= ', matrixB  );
  let row0 = [matrixB[0], matrixB[1], matrixB[2], matrixB[3]];
  let row1 = [matrixB[4], matrixB[5], matrixB[6], matrixB[7]];
  let row2 = [matrixB[8], matrixB[9], matrixB[10], matrixB[11]];
  let row3 = [matrixB[12], matrixB[13], matrixB[14], matrixB[15]];

  // Multiply each row by matrixA
  let result0 = multiplyMatrixAndPoint(matrixA, row0);
  let result1 = multiplyMatrixAndPoint(matrixA, row1);
  let result2 = multiplyMatrixAndPoint(matrixA, row2);
  let result3 = multiplyMatrixAndPoint(matrixA, row3);

  // Turn the result rows back into a single matrix
  return [
    result0[0],
    result0[1],
    result0[2],
    result0[3],
    result1[0],
    result1[1],
    result1[2],
    result1[3],
    result2[0],
    result2[1],
    result2[2],
    result2[3],
    result3[0],
    result3[1],
    result3[2],
    result3[3],
  ];
}
//------------------------------------------------------------------------------------------------
export function multiply(a, b) {
  const m = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let i = 0 ; i < 4 ; i++) {
    for(let j = 0 ; j < 4 ; j++) {
      m[i][j] = a[i][0] * b[0][j] +
        a[i][1] * b[1][j] +
        a[i][2] * b[2][j] +
        a[i][3] * b[3][j];
    }
  }

  return m;
}
//------------------------------------------------------------------------------------------------




class Vector {
  x = 0;
  y = 0;
  z = 0;
  w = 1;

  constructor(x, y, z, w = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  multiplyByScalar(s) {
    this.x *= s;
    this.y *= s;
    this.z *= s;

    return this;
  }

  static add(v1, v2) {
    return new Vector(
      v1.x + v2.x,
      v1.y + v2.y,
      v1.z + v2.z,
    );
  }

  getLength() {
    return Math.sqrt(
      this.x * this.x + this.y * this.y + this.z * this.z
    );
  }

  normalize() {
    const length = this.getLength();

    this.x /= length;
    this.y /= length;
    this.z /= length;

    return this;
  }
}


export class Matrix {
  multiply(a, b) {
    const m = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    for (let i = 0 ; i < 4 ; i++) {
      for(let j = 0 ; j < 4 ; j++) {
        m[i][j] = a[i][0] * b[0][j] +
          a[i][1] * b[1][j] +
          a[i][2] * b[2][j] +
          a[i][3] * b[3][j];
      }
    }

    return m;
  }

  getRotationX(angle) {
    const rad = Math.PI / 180 * angle;

    return [
      [1, 0, 0, 0],
      [0, Math.cos(rad), -Math.sin(rad), 0],
      [0, Math.sin(rad), Math.cos(rad), 0],
      [0, 0, 0, 1],
    ];
  }

  getRotationY(angle) {
    const rad = Math.PI / 180 * angle;

    return [
      [Math.cos(rad), 0, Math.sin(rad), 0],
      [0, 1, 0, 0],
      [-Math.sin(rad), 0, Math.cos(rad), 0],
      [0, 0, 0, 1],
    ];
  }

  getRotationZ(angle) {
    const rad = Math.PI / 180 * angle;

    return [
      [Math.cos(rad), -Math.sin(rad), 0, 0],
      [Math.sin(rad), Math.cos(rad), 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];
  }

  getTranslation(dx, dy, dz) {
    return [
      [1, 0, 0, dx],
      [0, 1, 0, dy],
      [0, 0, 1, dz],
      [0, 0, 0, 1],
    ];
  }

  getScale(sx, sy, sz) {
    return [
      [sx, 0, 0, 0],
      [0, sy, 0, 0],
      [0, 0, sz, 0],
      [0, 0, 0, 1],
    ];
  }

  multiplyVector(m, v) {
    return new Vector(
      m[0][0] * v.x + m[0][1] * v.y + m[0][2] * v.z + m[0][3] * v.w,
      m[1][0] * v.x + m[1][1] * v.y + m[1][2] * v.z + m[1][3] * v.w,
      m[2][0] * v.x + m[2][1] * v.y + m[2][2] * v.z + m[2][3] * v.w,
      m[3][0] * v.x + m[3][1] * v.y + m[3][2] * v.z + m[3][3] * v.w,
    );
  }
}
/*
class Drawer {
  surface = null;
  width = 0;
  height = 0;

  constructor(surface, width, height) {
    this.surface = surface;
    this.width = width;
    this.height = height;
  }

  drawPixel(x, y, r, g, b) {
    const offset = (this.width * -y + x) * 4;

    if (x >= 0 && x < this.width && -y >= 0 && -y < this.height) {
      this.surface[offset] = r;
      this.surface[offset + 1] = g;
      this.surface[offset + 2] = b;
      this.surface[offset + 3] = 255;
    }
  }
  drawLine(x1, y1, x2, y2, r = 0, g = 0, b = 0) {
    const round = Math.trunc;
    x1 = round(x1);
    y1 = round(y1);
    x2 = round(x2);
    y2 = round(y2);

    const c1 = y2 - y1;
    const c2 = x2 - x1;

    const length = Math.max(
      Math.abs(c1),
      Math.abs(c2)
    );

    const xStep = c2 / length;
    const yStep = c1 / length;

    for (let i = 0 ; i <= length ; i++) {
      this.drawPixel(
        Math.trunc(x1 + xStep * i),
        Math.trunc(y1 + yStep * i),
        r, g, b,
      );
    }
  }

  clearSurface() {
    const surfaceSize = this.width * this.height * 4;
    for (let i = 0; i < surfaceSize; i++) {
      this.surface[i] = 0;
    }
  }
}

export const drawer = new Drawer(
  imageData.data,
  imageData.width,
  imageData.height
);

// Cube vertices
const vertices = [
  new Vector(-1, 1, 1), // 0 вершина
  new Vector(-1, 1, -1), // 1 вершина
  new Vector(1, 1, -1), // 2 вершина
  new Vector(1, 1, 1), // 3 вершина
  new Vector(-1, -1, 1), // 4 вершина
  new Vector(-1, -1, -1), // 5 вершина
  new Vector(1, -1, -1), // 6 вершина
  new Vector(1, -1, 1), // 7 вершина
];

// Cube edges
const edges = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],

  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],

  [4, 5],
  [5, 6],
  [6, 7],
  [7, 4],
];

let angle = 0;
setInterval(() => {
  let matrix = Matrix.getRotationX(20);

  matrix = Matrix.multiply(
    Matrix.getRotationY(angle += 1),
    matrix
  );

  matrix = Matrix.multiply(
    Matrix.getScale(100, 100, 100),
    matrix,
  );

  matrix = Matrix.multiply(
    Matrix.getTranslation(400, -300, 0),
    matrix,
  );

  const sceneVertices = [];
  for(let i = 0 ; i < vertices.length ; i++) {
    let vertex = Matrix.multiplyVector(
      matrix,
      vertices[i]
    );

    sceneVertices.push(vertex);
  }

  drawer.clearSurface();

  for (let i = 0, l = edges.length ; i < l ; i++) {
    const e = edges[i];

    drawer.drawLine(
      sceneVertices[e[0]].x,
      sceneVertices[e[0]].y,
      sceneVertices[e[1]].x,
      sceneVertices[e[1]].y,
      0, 0, 255
    );
  }

  const center = new Vector(400, -300, 0)
  drawer.drawLine(
    center.x, center.y,
    center.x, center.y + 200,
    150, 150, 150
  );

  drawer.drawLine(
    center.x, center.y,
    center.x + 200, center.y,
    150, 150, 150
  );

  const zVector = new Vector(-1, -1, 0, 0);
  const zCoords = Vector.add(
    center,
    zVector.normalize().multiplyByScalar(150)
  );
  drawer.drawLine(
    center.x, center.y,
    zCoords.x, zCoords.y,
    150, 150, 150
  );

  ctx.putImageData(imageData, 0, 0);
}, 100);
*/