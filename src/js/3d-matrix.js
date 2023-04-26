import { CommentsDisabledOutlined } from "@mui/icons-material";

//------------------------------------------------------------------------------------------------
export let identityMatrix = [ 1, 0, 0, 0,
                              0, 1, 0, 0, 
                              0, 0, 1, 0, 
                              0, 0, 0, 1 ];
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
let ZeroMatrix = [0, 0, 0, 1,
                  0, 0, 0, 1, 
                  0, 0, 0, 1, 
                  0, 0, 0, 1 ];
//------------------------------------------------------------------------------------------------

export function getTranslationMatrix( x, y, z){
  let result = [ 1, 0, 0, 0,
                 0, 1, 0, 0, 
                 0, 0, 1, 0, 
                 x, y, z, 1 ];
  return result;
}

//------------------------------------------------------------------------------------------------

export function getScaleMatrix( x, y, z){
  let result = [x, 0, 0, 0, 
                0, y, 0, 0, 
                0, 0, z, 0, 
                0, 0, 0, 1 ];
  return result;
}
//------------------------------------------------------------------------------------------------
export function getRotation_X(angle) {
  const rad = Math.PI / 180 * angle;
  let result =[1, 0, 0, 0,
              0, Math.cos(rad), -Math.sin(rad), 0,
              0, Math.sin(rad), Math.cos(rad), 0,
              0, 0, 0, 1];
  return result;
}

export function getRotation_Y(angle) {
  const rad = Math.PI / 180 * angle;
  let result =[Math.cos(rad), 0, Math.sin(rad), 0,
              0, 1, 0, 0,
              -Math.sin(rad), 0, Math.cos(rad), 0,
              0, 0, 0, 1];

  return result;
}

export function getRotation_Z(angle) {
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
export function MoveMatrix( matrix, dx, dy, dz ){
  let result  = multiplyMatrices( getTranslationMatrix( dx, dy, dz ), matrix );
  return result;
}
//------------------------------------------------------------------------------------------------
export function MoveMatrixAny(matrix, dx, dy, dz) {
  let point = new Array(4);
  let result = [];
  for ( let i = 0; i < matrix.length; i=i+4 ) {
    point[0] = matrix[i];
    point[1] = matrix[i+1];
    point[2] = matrix[i+2];
    point[3] = matrix[i+3];
    result = result.concat( multiplyMatrixAndPoint( getTranslationMatrix( dx, dy, dz ), point ) );
  };
  return result;
}
  //------------------------------------------------------------------------------------------------
export function ScaleMatrix( matrix, dx, dy, dz ){
  let result  = multiplyMatrices( getScaleMatrix( dx, dy, dz ), matrix );
  return result;
}
//------------------------------------------------------------------------------------------------
export function ScaleMatrixAny1zoom(matrix, zoom) {
  return ScaleMatrixAny(matrix, zoom, zoom, zoom);
}
//------------------------------------------------------------------------------------------------
export function ScaleMatrixAny(matrix, dx, dy, dz) {
  let point = new Array(4);
  let result = [];
  for ( let i = 0; i < matrix.length; i=i+4 ) {
    point[0] = matrix[i];
    point[1] = matrix[i+1];
    point[2] = matrix[i+2];
    point[3] = matrix[i+3];
    result = result.concat( multiplyMatrixAndPoint( getScaleMatrix( dx, dy, dz ), point ) );
  };
  return result;
}
//------------------------------------------------------------------------------------------------
export function RotateMatrix_X( matrix, angle ){
  let result  = multiplyMatrices( getRotation_X( angle ), matrix );
  return result;
}
//------------------------------------------------------------------------------------------------
export function RotateMatrix_X_any(matrix, angle) {
  let point = new Array(4);
  let result = [];
  for ( let i = 0; i < matrix.length; i=i+4 ) {
    point[0] = matrix[i];
    point[1] = matrix[i+1];
    point[2] = matrix[i+2];
    point[3] = matrix[i+3];
    result = result.concat( multiplyMatrixAndPoint( getRotation_X( angle ), point ) );
  };
  return result;
}
//------------------------------------------------------------------------------------------------
export function RotateMatrix_Y( matrix, angle ){
  let result  = multiplyMatrices( getRotation_Y( angle ), matrix );
  return result;
}
//------------------------------------------------------------------------------------------------
export function RotateMatrix_Y_any( matrix, angle ){
  let point = new Array(4);
  let result = [];
  for ( let i = 0; i < matrix.length; i=i+4 ) {
    point[0] = matrix[i];
    point[1] = matrix[i+1];
    point[2] = matrix[i+2];
    point[3] = matrix[i+3];
    result = result.concat( multiplyMatrixAndPoint( getRotation_Y( angle ), point ) );
  };
  return result;
}
//------------------------------------------------------------------------------------------------
export function RotateMatrix_Z( matrix, angle ){
  let result  = multiplyMatrices( getRotation_Z( angle ), matrix );
  return result;
}
//------------------------------------------------------------------------------------------------

/**
     * @param {[]} matrix input matrix
     * @param {number} angle angle (deg) of rotation
     * @param {number} type type of matrix - 3 or 4 elements
     * @return {[]} rotated matrix
     */
export function RotateMatrix_Z_any( matrix, angle, type = 4 ) {
  let point = new Array(4);
  let result = [];
  for ( let i = 0; i < matrix.length; i=i+4 ) {
    point[0] = matrix[i];
    point[1] = matrix[i+1];
    point[2] = matrix[i+2];
    if ( type === 3 ) point[3] = 1;
    if ( type === 4 ) point[3] = matrix[i+3];
    result = result.concat( multiplyMatrixAndPoint( getRotation_Z( angle ), point ) );
  };
  return result;
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