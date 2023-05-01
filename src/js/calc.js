import { Elevators } from './elevators.js';
import cPile from './pile_class.js'
import { get_Max_Y_3D, getCurvePoints, drawLines, drawCurve, getPoint, drawPoint, drawPoints, getSlice, drawSlice, drawContur, getContur, getPoints_by_Y } from './spline.js';

export function MyRound(value, decimal){
    let MyPow;
    let result;
    MyPow = Math.pow(10,decimal);
    result = Math.round( value*MyPow ) / MyPow;
    return Number(result);
}

export function Isometric( [x, y, z] , [ angle_X, angle_Y, angle_Z ] ){
    //let XX = x * cos(α) + y * cos(α + 120° ) + z * cos( α - 120° );
    //let YY = x * sin(α) + y * sin( α + 120° ) + z * sin( α - 120° );
    let xx = x * Math.cos( angle_X ) + y * Math.cos( angle_Y +2.09 ) + z * Math.cos( angle_Z-2.09 );
    let yy = x * Math.sin( angle_X ) + y * Math.sin( angle_Y +2.09 ) + z * Math.sin( angle_Z-2.09 );
    return { xx, yy };
}

export function IsometricArr( arr=[] , [ angle_X, angle_Y, angle_Z ] ){
    let result = [];
    let x,y,z;
    let xx, yy;
    //let XX = x * cos(α) + y * cos(α + 120° ) + z * cos( α - 120° );
    //let YY = x * sin(α) + y * sin( α + 120° ) + z * sin( α - 120° );
    for ( let i = 0; i < arr.length; i=i+3 ) {
        x = arr[ i ];
        y = arr[ i + 1 ];
        z = arr[ i + 2 ];
        xx = x * Math.cos( angle_X ) + y * Math.cos( angle_Y +2.09 ) + z * Math.cos( angle_Z-2.09 );
        yy = x * Math.sin( angle_X ) + y * Math.sin( angle_Y +2.09) + z * Math.sin( angle_Z-2.09 );

        result.push( xx );
        result.push( yy );
    }
    return result;
}

export function DecartToSphere ( x, y, z ){
    let r;
    if ( x == 0 & y == 0 & z == 0 ) { r = 0 }
    else { r = Math.sqrt( x*x + y*y+ z*z ); };
    let tetta;  
    let gamma;
    if ( x == 0 & y == 0 & z == 0 ) { tetta = 0; gamma = 0 }
    else {
        tetta = Math.acos( z / Math.sqrt( x*x + y*y + z*z ) );
        gamma = Math.atan( y / x );
    }
    return [ r, tetta, gamma ];
}

export function DecartToSphereArr ( arr=[] ){
    let result = [];
    for ( let i  = 0; i < arr.length; i=i+3 ) {
        result = result.concat( DecartToSphere ( arr[i], arr[i+1], arr[i+2] ));
    }
    return result;
}

export function SphereToDecart ( r, tetta, gamma ){
    let x = r * Math.sin( tetta ) * Math.cos( gamma );
    let y = r * Math.sin( tetta ) * Math.sin( gamma );
    let z = r * Math.cos( tetta );
    return [ x, y, z ];
}

export function SphereToDecartArr ( arr=[], tetta, gamma ){
    let result = [];
    for ( let i  = 0; i < arr.length; i=i+3 ) {
        if ( !tetta ) tetta = arr[i+1];
        if ( !gamma ) gamma = arr[i+2];
        result = result.concat( SphereToDecart ( arr[i], tetta, gamma ));
    }
return result;
}

export function Corner_Line_( x1, y1, x2, y2, y ){
    let x = ( x2 - x1 ) * ( y - y1 ) / ( y2 - y1 ) + x1;
return x;
}

export function Corner_Line_arr( x1, y1, x2, y2, z, count ){
    let xyz_arr = [];
    let y = 0;
    for ( let i = 0 ; i <= count; i++ ) {
        y = y1 + ( y2 - y1 ) / count * i;
        xyz_arr = xyz_arr.concat( [ Corner_Line_( x1, y1, x2, y2, y ), y, z, 1 ] );
    }
return xyz_arr;
}

function Corner_Arc( r, angle ){
    let x = r * Math.cos( angle );
    let y = r * Math.sin( angle );
return {x,y};
}

export function Corner_Arc_arr( x1, y1, x2, y2, r, z, count, section ){
    let xyz_arr = [];
    let x = 0; 
    let y = 0;
    let angle = 0;
    let xy;
    for ( let i = 0 ; i <= count; i++ ) {
        angle = ( section -1 ) * 3.14/2 - 3.14/2 / count * i;
        xy = Corner_Arc( r, angle );
        xyz_arr = xyz_arr.concat( xy.x + x1, xy.y + y2, z, 1 );
    }
return xyz_arr;
}

export function interpolation( y , x1,y1, x2,y2 ){
    let x = 0;
    if ( y == y1 ) return x1;
    if ( y == y2 ) return x2;
    x = ( x2 - x1 ) * ( y - y1 ) / ( y2 - y1 ) + x1;
return x;
}

export function DistanceBetweenPoints ( point_1 = [], point_2 = [] ) {
    let delta = Math.sqrt( Math.pow( point_2[0] - point_1[0], 2 ) +  Math.pow( point_2[1] - point_1[1], 2) + Math.pow( point_2[2] - point_1[2], 2 ) );
return delta;
}

export function Volume_Pillers( x1,y1,z1, x2,y2,z2, x3,y3,z3, x4,y4,z4 ){
    let s = Math.abs( ( x1*y2 + x2*y3 + x3*y4 + x4*y1 ) - ( y1*x2 + y2*x3 + y3*x4 + y4*x1 ) ) / 2;
    let h = ( z1 + z2+ z3 + z4 ) / 4;
    let v = s*h;
    //console.log('Volume_Pillers = ',v);
    return ( v );
}

export function Square_by_slice( points = [] ){
    let S = 0;
    for ( let i = 0; i < points.length - 4; i+=4 ){
        S = S + Math.abs( ( points[i+1+4] + points[i+1] ) * ( points[i+4] - points[i] ) /2 );
    }
return S;
}

export function Mass(w) {
        let S_Osnovaniya;
        let S_Vershini;
        let SS;
        let Scobka;
        let V1, V2;
        let UdPogrV;
        S_Osnovaniya = w.dx2 * w.dy2;
        S_Vershini = w.ux *w.uy;
        SS = S_Osnovaniya * S_Vershini;
        Scobka = S_Osnovaniya + S_Vershini + Math.sqrt(SS);
        V1 = w.dx1 * w.dy1 * w.dh1;
        V2 = w.dh2 * Scobka / 3;
        w.Result.V = V1 + V2;
        UdPogrV = 1000 / w.Natura;
        w.Result.M = w.Result.V / UdPogrV;
    return w;
};

export function Point_from_Plane_and_Line( x1,y1,z1, x2,y2,z2, x3,y3,z3, x4,y4,z4, x5,y5,z5 ){
    //x1,y1,z1, x2,y2,z2, x3,y3,z3 - координаты заданной плоскости
    //x4,y4,z4, x5,y5,z5 - координаты заданной прямой

    //Коэффициенты для уравнения плоскости
    let A = y1*(z2 - z3) + y2*(z3 - z1) + y3*(z1 - z2);
    let B = z1*(x2 - x3) + z2*(x3 - x1) + z3*(x1 - x2);
    let C = x1*(y2 - y3) + x2*(y3 - y1) + x3*(y1 - y2);
    let D = -1*(x1*(y2*z3 - y3*z2) + x2*(y3*z1 - y1*z3) + x3*(y1*z2 - y2*z1));

    //console.log('a,b,c,d = ',A,B,C,D);
    //Нормальный вектор к заданной плоскости
    let xN = A;
    let yN = B;
    let zN = C;

    //Вспомогательный вектор
    let xV = x1-x4;
    let yV = y1-y4;
    let zV = z1-z4;

    //Расстояние до плоскости по нормали
    let dist1 = xN*xV + yN*yV + zN*zV;

    //Вспомогательный вектор
    let xW = x5-x4;
    let yW = y5-y4;
    let zW = z5-z4;

    //Приближение к плоскости по нормали
    let dist2 = xN*xW + yN*yW + zN*zW;


    let x0 = x4;
    let y0 = y4;
    let z0 = 0;

    //console.log('dist1 = ',dist1);
    //console.log('dist2 = ',dist2);
    //Проверка на параллельность
    if ( dist1 != 0 ) { // Прямая не принадлежит плоскости
	    if ( dist2 != 0 ) { //Прямая не параллельна плоскости

		//Вспомогательное отношение
		let ratio = dist1/dist2;

		//Вспомогательный вектор
		xW = xW*ratio;
		yW = yW*ratio;
		zW = zW*ratio;

		//Искомые координаты
		x0 = x4 + xW;
		y0 = y4 + yW;
		z0 = z4 + zW;
        }
    }

    //z0 = (-A*x4 -B*y4)/C;

    return [ x0, y0, z0, 1 ];
}

export function Point_from_Plane_and_XY( x, y, x1,y1,z1, x2,y2,z2, x3,y3,z3 ){

    return Point_from_Plane_and_Line( x1,y1,z1, x2,y2,z2, x3,y3,z3, x,y,0, x,y,100 );
}

export function Change_Orientation( point = [], dx = 0, dy = 0, dz = 0 ){
    let x = 0;
    let y = 0;
    let z = 0;

    x = point[ 0 ] + dx;
    y = point[ 1 ] + dy;
    z = point[ 2 ] + dz;

    return ( [ x, y, z ] );
}

//---------------------------------------
export function rayPlaneIntersection(p1, p2, p3, rayPoint, rayDirection) {
    // Calculate normal vector to the plane
    let v1 = [p2[0]-p1[0], p2[1]-p1[1], p2[2]-p1[2]];
    let v2 = [p3[0]-p1[0], p3[1]-p1[1], p3[2]-p1[2]];
    let normal = [v1[1]*v2[2]-v1[2]*v2[1], v1[2]*v2[0]-v1[0]*v2[2], v1[0]*v2[1]-v1[1]*v2[0]];
  
    // Find the intersection of the ray and the plane
    let ndotu = normal[0]*rayDirection[0] + normal[1]*rayDirection[1] + normal[2]*rayDirection[2];
    
    if (ndotu === 0) {
      //return null; // Ray is parallel to plane
      return [ rayPoint[0], rayPoint[1], 0, 1 ]; // Ray is parallel to plane
    }
    
    //if ( ( rayPoint[0] < p1[0]  && rayPoint[0] < p2[0] && rayPoint[0] < p3[0] ) || ( rayPoint[0] > p1[0]  && rayPoint[0] > p2[0] && rayPoint[0] > p3[0] ) ) return [ rayPoint[0], rayPoint[1], 0, 1];
    //if ( ( rayPoint[1] < p1[1]  && rayPoint[1] < p2[1] && rayPoint[0] < p3[1] ) || ( rayPoint[1] > p1[1]  && rayPoint[1] > p2[1] && rayPoint[1] > p3[1] ) ) return [ rayPoint[0], rayPoint[1], 0, 1];

    let w = [rayPoint[0]-p1[0], rayPoint[1]-p1[1], rayPoint[2]-p1[2]];
    let si = -(normal[0]*w[0] + normal[1]*w[1] + normal[2]*w[2]) / ndotu;
    let intersection = [rayPoint[0]+si*rayDirection[0], rayPoint[1]+si*rayDirection[1], rayPoint[2]+si*rayDirection[2] ];
    return intersection;
  }

  export function Point_inside_Triangle ( aAx = 0, aAy = 0, aBx = 0, aBy = 0, aCx = 0, aCy = 0, aPx = 0, aPy = 0 ){
    //Vector metod
    let Bx = 0;
    let By = 0;
    let Cx = 0;
    let Cy = 0;
    let Px = 0;
    let Py = 0;
    let m = 0; // coefficient
    let l = 0; // coefficient

    let result = false;
    // move triangle from point A to (0;0).
    Bx = aBx - aAx;
    By = aBy - aAy;
    Cx = aCx - aAx;
    Cy = aCy - aAy;
    Px = aPx - aAx;
    Py = aPy - aAy;
    
    m = (Px*By - Bx*Py) / (Cx*By - Bx*Cy);

    if (  m >= 0  &&  m <= 1  ) {
        l = (Px - m*Cx) / Bx;
        if ( ( l >= 0 ) && ( m + l  <= 1 ) ) result = true;
    }

    //if ( !result ) console.log('false');

    return result;
  }

  //----------------------
  export function PointInPolygon( x = 0, y = 0, points = [0] ) {        
    let n2 = 0;
    let f = true;
    let count = points.length;

  for ( let n1 = 0; n1 < count - 1; n1+= 2) {
    n2 = (n1 + 1) % count;
    if ( myXOR( y > points[n1].Y, y > points[n2].Y) ) {
      if ( x > points[n1].X + ( points[n2].X - points[n1].X ) * ( y - points[n1].Y) / ( points[n2].Y - points[n1].Y) ) {
        f = !f;
    }
}
  }
  return f;

  /*
  В полигоне может быть сколько угодно углов, допустима даже невыпуклая фигура.
V() - массив вертексов с координатами вершин полигона, vCnt - количество вершин.
Mod - вычисление остатка от целочисленного деления.
Неинициализированные локальные переменные автоматически инициализируются нулями (False).
  */
  }

  export function myXOR(a,b) {
    return ( a || b ) && !( a && b );
  }

  export function Normal_from_3points( point1 = [], point2 = [], point3 = [] ){
/*
    point[0][0] = points[ 0 ];//x1
    point[0][1] = points[ 1 ];//y1
    point[0][2] = points[ 2 ];//z1

    point[1][0] = points[ 0 ];//x2
    point[1][1] = points[ 1 ];//y2
    point[1][2] = points[ 2 ];//z2

    point[2][0] = points[ 0 ];//x3
    point[2][1] = points[ 1 ];//y3
    point[2][2] = points[ 2 ];//z3


        vDirection[0][0]=point[1][0]-point[0][0];
        vDirection[0][1]=point[1][1]-point[0][1];
        vDirection[0][2]=point[1][2]-point[0][2];
 
        vDirection[1][0]=point[1][0]-point[2][0];
        vDirection[1][1]=point[1][1]-point[2][1];
        vDirection[1][2]=point[1][2]-point[2][2];
 
        vDirection[2][0]=point[0][0]-point[2][0];
        vDirection[2][1]=point[0][1]-point[2][1];
        vDirection[2][2]=point[0][2]-point[2][2];
 
    wVector[0]=vDirection[0][1]*vDirection[1][2]-vDirection[0][2]*vDirection[1][1];
    wVector[1]=vDirection[0][2]*vDirection[1][0]-vDirection[0][0]*vDirection[1][2];
    wVector[2]=vDirection[0][0]*vDirection[1][1]-vDirection[0][1]*vDirection[1][0];

*/
    let vDirection1=point2[ 0 ]-point1[ 0 ];
    let vDirection2=point2[ 1 ]-point1[ 1 ];
    let vDirection3=point2[ 2 ]-point1[ 2 ];
 
    let vDirection4=point2[ 0 ]-point3[ 0 ];
    let vDirection5=point2[ 1 ]-point3[ 1 ];
    let vDirection6=point2[ 2 ]-point3[ 2 ];
 /*
    vDirection[2][0]=points[ 0 ]-points[ 0 ];
    vDirection[2][1]=points[ 1 ]-points[ 1 ];
    vDirection[2][2]=points[ 2 ]-points[ 2 ];
 */
 /*   wVector[0]=v2*v6-v3*v5;
    wVector[1]=v3*v4-v1*v6;
    wVector[2]=v1*v5-v2*v4;
*/
    let Vx = Math.abs(vDirection2*vDirection6-vDirection3*vDirection5);
    let Vy = Math.abs(vDirection3*vDirection4-vDirection1*vDirection6);
    let Vz = Math.abs(vDirection1*vDirection5-vDirection2*vDirection4);

    return ( [ Vx, Vy, Vz ] );
  }