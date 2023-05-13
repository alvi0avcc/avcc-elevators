import { getCurvePoints, getPoints_by_Y, get_Max_Y_3D } from './spline.js'; // spline
import { interpolation, MyRound, Volume_Pillers, DistanceBetweenPoints, Square_by_slice } from './calc.js';
import { MoveMatrix, MoveMatrixAny, RotateMatrix_X, RotateMatrix_X_any, RotateMatrix_Y, RotateMatrix_Y_any, RotateMatrix_Z, RotateMatrix_Z_any, ScaleMatrix, ScaleMatrixAny, ScaleMatrixAny1zoom } from './3d-matrix.js';
import { Elevators } from './elevators.js';
import * as Calc from './calc.js';
import { CoPresentOutlined } from '@mui/icons-material';

export default class cgPile{
    constructor() {
        //input data
        this.type_location   = ( 'base', 'upper' ); // base = base level Pile , upper = upper level Pile
        this.purpose = ( 'remove', 'add' ); //add or remove volume
        this.X      = 0; // location
        this.Y      = 0;
        this.angle  = 0;
        this.Height = 10;//Height of Pile (distance between Base & Top)
        this.Base_Length = 30; //base plane
        this.Base_Width  = 30; //base plane
        this.underBase_Height = 0;//Height of Box under Pile
        this.Top_Length  = 15; //upper plane
        this.Top_Width   = 15; //upper plane
        this.Tension_Base = 0.835;
        this.Tension_Volume = 0.5;
        this.numOfSegments = 10; // quantity spline segments
        //calculated input data
        this.Base_Control_Points = [];
        this.underBase_Control_Points = [];
        this.underBase_Control_Points_3d = [];
        this.Top_Control_Points = [];
        this.Length_Arc_Control_Points = []; // depended from Base & Top
        this.Widht_Arc_Control_Points = []; // depended from Base & Top
        //output data
        this.Base_Points = [];
        this.Top_Points = [];
        this.Length_Arc_Points = [];
        this.Length_Arc_Points3d = [];
        this.Widht_Arc_Points = [];
        this.Widht_Arc_Points3d = [];
        }

set_Initial_Data_Complex ( pile, numOfSegments ){
            this.type_location  = pile.type_location;
            this.purpose        = pile.purpose;
            this.X              = Number ( pile.X );
            this.Y              = Number ( pile.Y );
            this.angle          = Number ( pile.angle );
            this.Height         = Number ( pile.Height );
            this.Base_Length    = Number ( pile.Base.length );
            this.Base_Width     = Number ( pile.Base.width );
            this.underBase_Height = Number ( pile.underBase_Height );
            this.Top_Length     = Number ( pile.Top.length );
            this.Top_Width      = Number ( pile.Top.width );
            this.Tension_Base   = Number ( pile.Tension_Base );
            this.Tension_Volume = Number ( pile.Tension_Volume );
            this.numOfSegments  = Number ( numOfSegments );
            this.set_Initialisation();
    }

set_Initial_Data_Intividual ( type_location, purpose, X, Y, angle, Height, Base_Length, Base_Width, underBase_Height, Top_Length, Top_Width, Tension_Base, Tension_Volume, numOfSegments ){
        this.type_location  = type_location;
        this.purpose        = purpose;
        this.X              = Number ( X );
        this.Y              = Number ( Y );
        this.angle          = Number ( angle );
        this.Height         = Number ( Height );
        this.Base_Length    = Number ( Base_Length );
        this.Base_Width     = Number ( Base_Width );
        this.underBase_Height = Number ( underBase_Height );
        this.Top_Length     = Number ( Top_Length );
        this.Top_Width      = Number ( Top_Width );
        this.Tension_Base   = Number ( Tension_Base );
        this.Tension_Volume = Number ( Tension_Volume );
        this.numOfSegments  = Number ( numOfSegments );
        this.set_Initialisation();
}
set_Initialisation(){
    this.set_Base ( this.Base_Length, this.Base_Width, this.Tension_Base );
    this.set_under_Base ( this.Base_Length, this.Base_Width, this.underBase_Height );
    this.set_Top ( this.Top_Length, this.Top_Width, this.Tension_Top );
    this.set_Contur_Arc_Length();
    this.set_Contur_Arc_Widht();
}

/**
     * @param {number} Height Height of Pile (distance between Base & Top)
     */
set set_Height ( Height ){
    this.Height = Number ( Height );
}

/**
     * @param {number} Base_Length Length
     * @param {number} Base_Width  Width
     * @param {number} Tension_Base Tension for spline
     */
   
set_Base ( Base_Length, Base_Width, Tension_Base ){
    this.Base_Length    = Number ( Base_Length );
    this.Base_Width     = Number ( Base_Width );
    this.Tension_Base   = Number ( Tension_Base );
    this.Base_Control_Points = [-Base_Length/2,              0, 
                                             0,  -Base_Width/2, 
                                 Base_Length/2,              0, 
                                             0,   Base_Width/2 ];
    this.Base_Points = getCurvePoints( this.Base_Control_Points, this.Tension_Base, true , this.numOfSegments );
}

set_under_Base ( Base_Length, Base_Width, underBase_Height ){
    this.Base_Length    = Number ( Base_Length );
    this.Base_Width     = Number ( Base_Width );
    this.underBase_Height   = Number ( underBase_Height );
    this.underBase_Control_Points = [   -Base_Length/2, -Base_Width/2, 0,
                                        -Base_Length/2,  Base_Width/2, 0,
                                         Base_Length/2,  Base_Width/2, 0,
                                         Base_Length/2, -Base_Width/2, 0,

                                        -Base_Length/2, -Base_Width/2, underBase_Height,
                                        -Base_Length/2,  Base_Width/2, underBase_Height,
                                         Base_Length/2,  Base_Width/2, underBase_Height,
                                         Base_Length/2, -Base_Width/2, underBase_Height ];
    this.underBase_Control_Points_3d = [-Base_Length/2, -Base_Width/2, 0, 1,
                                        -Base_Length/2,  Base_Width/2, 0, 1,
                                         Base_Length/2,  Base_Width/2, 0, 1,
                                         Base_Length/2, -Base_Width/2, 0, 1,

                                        -Base_Length/2, -Base_Width/2, underBase_Height, 1,
                                        -Base_Length/2,  Base_Width/2, underBase_Height, 1,
                                         Base_Length/2,  Base_Width/2, underBase_Height, 1,
                                         Base_Length/2, -Base_Width/2, underBase_Height, 1 ];
    this.Base_Points = getCurvePoints( this.Base_Control_Points, this.Tension_Base, true , this.numOfSegments );
}

set_Top ( Top_Length, Top_Width, Tension_Top ){
    this.Top_Length    = Number ( Top_Length );
    this.Top_Width     = Number ( Top_Width );
    this.Tension_Top   = Number ( Tension_Top );
    this.Top_Control_Points = [ -Top_Length/2,             0, 
                                            0,  -Top_Width/2, 
                                 Top_Length/2,             0, 
                                            0,   Top_Width/2 ];
    this.Top_Points = getCurvePoints( this.Top_Control_Points, this.Tension_Top, true , this.numOfSegments );                                              
}

get_Contur( ControlPoints ) {
    let xyz = [];
    let xyz3d = [];

    let xy = getCurvePoints( ControlPoints, this.Tension_Volume, false, this.numOfSegments );
    for ( let i = 0; i < xy.length; i+=2 ){
        xyz3d = xyz3d.concat( [ xy[i], 0, xy[i+1], 1 ] );
        xyz = xyz.concat( [ xy[i], xy[i+1] ] );
    }
    return { xyz, xyz3d };
}

set_Contur_Arc_Length_ControlPoints(){
    this.Length_Arc_Control_Points = [  -this.Base_Length/2,  0, 
                                        -this.Top_Length/2,   this.Height, 
                                         this.Top_Length/2,   this.Height, 
                                         this.Base_Length/2,  0 ];
    return this.Length_Arc_Control_Points;
}

set_Contur_Arc_Widht_ControlPoints(){
    this.Widht_Arc_Control_Points = [ -this.Base_Width/2, 0, 
                                      -this.Top_Width/2,  this.Height, 
                                       this.Top_Width/2,  this.Height, 
                                       this.Base_Width/2, 0 ];
    return this.Widht_Arc_Control_Points;
}

set_Contur_Arc_Length(){
    this.set_Contur_Arc_Length_ControlPoints();
    let result = this.get_Contur( this.Length_Arc_Control_Points );
    this.Length_Arc_Points = result.xyz;
    this.Length_Arc_Points3d = result.xyz3d;
    return result;
}

get get_Contur_Arc_Length(){
    return this.Length_Arc_Points3d;
}

get get_Contur_Arc_Widht(){
    return this.Widht_Arc_Points3d;
}

get get_Contur_under_Base(){
    let result  = { xyz: [], xyz3d: [] };
    result.xyz = this.underBase_Control_Points;
    result.xyz3d = this.underBase_Control_Points_3d;
    return result;
}

set_Contur_Arc_Widht(){
    this.set_Contur_Arc_Widht_ControlPoints();
    let result = this.get_Contur( this.Widht_Arc_Control_Points );
    this.Widht_Arc_Points = result.xyz;
    this.Widht_Arc_Points3d = result.xyz3d;
    return result;
}

get_Slice_Base( level ) {

    let xyz = [];  //result
    let points = [];//control points
    let x1 = 0; let x2 = 0;

    //console.log('Height = ',this.Height );
    if ( this.underBase_Height == 0 || level > 0 ) {
        let contur_L = this.Length_Arc_Points;
        let contur_W = this.Widht_Arc_Points;
        let xy_L = getPoints_by_Y( level , contur_L );
        let xy_W = getPoints_by_Y( level , contur_W );
        let x1 = interpolation( level , xy_L[0][0], xy_L[0][1], xy_L[0][2], xy_L[0][3] );
        let x2 = interpolation( level , xy_W[0][0], xy_W[0][1], xy_W[0][2], xy_W[0][3] );
        points[0] = -x1;//l
        points[1] = 0;
        points[2] = 0;
        points[3] = -x2;//w
        points[4] = x1;//l
        points[5] = 0;
        points[6] = 0;
        points[7] = x2;//w
        let xy = getCurvePoints( points, this.Tension_Base, true, this.numOfSegments );
        for ( let i = 0; i < xy.length; i+=2 ){
            //xyz = xyz.concat( [ xy[i], xy[i+1], level, 1 ] );
            xyz.push( xy[i], xy[i+1], level, 1 );
        }
        console.log('xyz-spline = ',xyz );
    } else {
        //x1 = interpolation( level , this.Base_Length, this.Base_Width, xy_L[0][2], xy_L[0][3] );
        let l = this.Base_Length;
        //x2 = interpolation( level , xy_W[0][0], xy_W[0][1], xy_W[0][2], xy_W[0][3] );
        let w = this.Base_Width;
        let xyz_square_1 = [];
        let xyz_square_2 = [];
        let xyz_square_3 = [];
        let xyz_square_4 = [];
        let x = 0; let y = 0;

        for ( let i = 0 ; i <= this.numOfSegments; i++ ) {
            x = l / this.numOfSegments * i;
            y = w / this.numOfSegments * i;
            xyz_square_1.push( l/2, -w/2 + y, 0, 1 );
            xyz_square_2.push( l/2 - x, w/2, 0, 1 );
            xyz_square_3.push( -l/2, w/2 - y, 0, 1 );
            xyz_square_4.push( -l/2 + x, -w/2, 0, 1 );
        }
        //console.log('xyz_square_4 = ',xyz_square_4 );
        xyz = xyz_square_1.slice( this.numOfSegments / 2 * 4, ( this.numOfSegments) *4 );
        xyz = xyz.concat( xyz_square_2, xyz_square_3, xyz_square_4, xyz_square_1.slice( 0, ( this.numOfSegments / 2 +1) * 4 ) );
        console.log('xyz-plate = ',xyz );
        //xyz = xyz_square_4.slice( this.numOfSegments / 2, this.numOfSegments );
        //xyz = xyz_square_4.slice( this.numOfSegments / 2, this.numOfSegments ).concat( xyz_square_1, xyz_square_2, xyz_square_3, xyz_square_4.slice( 0, this.numOfSegments / 2) );

    }

    return xyz;
}

get_Check_Pile_Mesh( points = [] ) {
    let point_1 = points.slice( 0, 4 );
    let point_2 = [];
    let dx = [];
    for ( let i = 4; i < points.length; i +=4 ){
        point_2 = [ points[i], points[i+1], points[i+2], points[i+3] ];
        dx = dx.concat( DistanceBetweenPoints( point_1, point_2 ) );
    }
   dx = MyRound( Math.max( ...dx ), 5 );
return dx;
}

get_Mesh( slice_step = 25 ) {

    let x = this.X;
    let y = this.Y;
    let box = this.underBase_Height;
    let height = this.Height;
    let angle = this.angle;
    let count = 0;

    let mesh = [];
    let slices = [];
    let normal = [];
    let _normal = [];

    
    if ( this.Height == 0 ) {
        console.log(' Warning - Pile height (hat) = 0 !');
        slices = this.get_Slice_Base( 0 );
        count = slices.length;
        return ( { slices, mesh, normal,  x, y, box, angle, count } );
    }

    
    let slice;
    let slice_old;
    let max = get_Max_Y_3D( this.get_Contur_Arc_Length ) - 0.0001;
    let level = 0;

    for ( let i = 0; i <= slice_step; i ++ ){
        level = max / slice_step * i;
        slice = this.get_Slice_Base( level );
        //slices.push( slice );
        //slice  = RotateMatrix_Z_any( slice, angle );
        //slice  = MoveMatrixAny( slices, x_location, y_location, dh + z_location );
        //slice  = ScaleMatrixAny1zoom( slice, 2 );
        //slice  = RotateMatrix_X_any( slice, angle_X );
        //slice  = RotateMatrix_Y_any( slice, angle_Y );
        //slice  = RotateMatrix_Z_any( slice, angle_Z );
        //slice  = MoveMatrixAny( slice, x_center, y_center, z_center );

        slices = slices.concat( slice );



        if ( i > 0 ) {
            for ( let j = 0; j < slice.length; j+=4 ) {
                mesh.push( slice[ j ], slice[ j +1 ], slice[ j +2 ], slice[ j +3 ], slice_old[ j ], slice_old[ j +1 ], slice_old[ j +2 ], slice_old[ j +3 ] );
               // _normal = Calc.Normal_from_3points( mesh.slice( j, j + 3 ), mesh.slice( j+4, j + 3+4 ), mesh.slice( j+8, j + 3+8 ) );
               // normal.push( _normal[0], _normal[1], _normal[2] );
            }

           // if ( i == slice_step ) mesh.push( slice[ -4 ], slice[ -3 ], slice[ -2 ], slice[ -1 ] );



        } else mesh.push( slice[ 0 ], slice[ 1 ], slice[ 2 ], slice[ 3 ] );

        slice_old = slice.slice(0);


    };
    
    count = slice.length;

    //console.log('mesh normal = ',normal);
    //console.log('mesh slice = ',mesh);
    return ( { slices, mesh, normal,  x, y, box, height, angle, count } );
}

get get_Volume(){
    
    let slice_step = 50;
    let slices1, slices2;
    let volume = 0; // total
    let volume1 = 0; // box
    let volume2 = 0; // Pile Hat
    let h_box = this.underBase_Height;

    //volume1 = MyRound( this.Base_Length * this.Base_Width * this.underBase_Height, 3 );
    //box Volume
    volume1 = MyRound( Square_by_slice( this.get_Slice_Base( 0 ) ) * h_box, 3 );

    if ( this.Height > 0 ) {
        let max = get_Max_Y_3D( this.get_Contur_Arc_Length ) - 0.0001;

        for ( let i = 0; i < slice_step; i ++ ){
            slices1 = this.get_Slice_Base( max / slice_step * i );
            slices2 = this.get_Slice_Base( max / slice_step * (i+1) );
            for ( let j = 0; j < slices1.length-4; j+=4 ) {
            volume2 = volume2 + Volume_Pillers( slices1[j],slices1[1+j],slices1[2+j], slices2[j],slices2[1+j],slices2[2+j], slices2[4+j],slices2[5+j],slices2[6+j], slices1[4+j],slices1[5+j],slices1[6+j], 0 );
            }
        }
    }
    //let check = this.get_Check_Pile_Mesh( slices2 );
    let square = Square_by_slice( slices2 );
    let volume3 = MyRound( square * this.Height, 3 );
    
    volume2 = MyRound( volume2, 3 );
    volume = MyRound( volume1 + volume2 + volume3 , 3 );

    return { volume, volume1, volume2, volume3 };
}


};//class