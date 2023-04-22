import { getCurvePoints, getPoints_by_Y, get_Max_Y_3D } from './spline.js'; // spline
import { interpolation, MyRound, Volume_Pillers } from './calc.js';

export default class cPile{
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
        this.underBase_Height = 0;//Height of Box under Pil
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

get get_Contur_Arc_Widht(){
    return this.Widht_Arc_Points3d;
}

get_Slice_Base( level ) {
    let xyz = [];
    let contur_L = this.Length_Arc_Points;
    let contur_W = this.Widht_Arc_Points;
    //console.log('level 2 = ',level);
    let xy_L = getPoints_by_Y( level , contur_L );
    let xy_W = getPoints_by_Y( level , contur_W );
    //console.log('xy_L = ',xy_L);
    //console.log('xy_W = ',xy_W);
    let x1 = interpolation( level , xy_L[0][0], xy_L[0][1], xy_L[0][2], xy_L[0][3] );
    let x2 = interpolation( level , xy_W[0][0], xy_W[0][1], xy_W[0][2], xy_W[0][3] );
    //console.log('x1 = ',x1 );
    //console.log('x2 = ',x2 );
    let points = [];
    points[0] = -x1;//l
    points[1] = 0;
    points[2] = 0;
    points[3] = -x2;//w
    points[4] = x1;//l
    points[5] = 0;
    points[6] = 0;
    points[7] = x2;//w
    let xy = getCurvePoints( points, this.Tension_Base, true, this.numOfSegments );
    //console.log('getCurvePoints (xy) = ',xy );
    for ( let i = 0; i < xy.length; i+=2 ){
        xyz = xyz.concat( [ xy[i], xy[i+1], level, 1 ] );
    }
    //console.log('getCurvePoints (xyz) = ',xyz );
    return xyz;
}

get get_Volume(){
    
    let slice_step = 50;
    let slices1, slices2;
    let volume = 0; // total
    let volume1 = 0; // underBase
    let volume2 = 0; // Pile

    volume1 = MyRound( this.Base_Length * this.Base_Width * this.underBase_Height, 3 );

    if ( this.Height > 0 ) {
        let max = get_Max_Y_3D( this.get_Contur_Arc_Length ) - 0.0001;

        for ( let i = 0; i < slice_step; i ++ ){
            slices1 = this.get_Slice_Base( max / slice_step * i );
            slices2 = this.get_Slice_Base( max / slice_step * (i+1) );
            for ( let j = 0; j < slices1.length-4; j+=4 ) {
            volume2 = volume2 + Volume_Pillers( slices1[j],slices1[1+j],slices1[2+j], slices2[j],slices2[1+j],slices2[2+j], slices2[4+j],slices2[5+j],slices2[6+j], slices1[4+j],slices1[5+j],slices1[6+j] );
            }
        }
    }
    
    volume2 = MyRound( volume2, 3 );
    volume = MyRound( volume1 + volume2 , 3 );
    return { volume, volume1, volume2 };
}


};//class