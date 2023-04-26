import * as Calc from './calc';
import * as Spline from './spline.js';
import cgPile from './pile_class.js'
import * as matrix from './3d-matrix.js';
import { get_Max_Y_3D, getCurvePoints, drawLines, drawCurve, getPoint, drawPoint, drawPoints, getSlice, drawSlice, drawContur, getContur, getPoints_by_Y } from './spline.js';
import { MoveMatrix, MoveMatrixAny, RotateMatrix_X, RotateMatrix_X_any, RotateMatrix_Y, RotateMatrix_Y_any, RotateMatrix_Z, RotateMatrix_Z_any, ScaleMatrix, ScaleMatrixAny, ScaleMatrixAny1zoom } from './3d-matrix.js';

let SoftVersion = '0.1.0'; 
let DBlocalVersion = '0.1.0';

class cComplex {
    constructor() {
    this.id     = '';
    this.Name   ='NewComplexSilo';
    this.TypeGlobal   = ( '', 'star', 'circle', 'square' );
    this.TotalDimension = { Height: 30, Length: 50, Width: 20, }; // габаритные размеры элеватора, для визуализации
    this.Silo   =[];
    this.Comments   = '';
    }
};

class cComplexSilo {
    constructor() {
        this.id         ='';
        this.row        =0;
        this.col        =0;
        this.Name       = 'NewSilo';
        this.Type       = ( 'star', 'square', 'circle' , '' );
        //this.useArea    = false; // расчет по размерам или по площади
        this.Height     = 25;
        this.Length     = 3;
        this.Width      = 3;
        this.Diameter   = 3;
        this.Area       = 0;
        this.Conus_height  = 2.5;
        this.Sound      = 25;
        this.Ullage     = 0;
        this.split      = ''; //существует если силос разделен на части
        this.linked     = ''; //имя связанного силоса
        this.CargoName  = '';
        this.CargoTW    = 0;
        this.Using      = true; // используется или нет
        this.Comments   = '';
    };
};

class cSilo {
    constructor() {
        this.Name       = 'NewSilo';
        this.Dimensions = {Diameter: 0, h1: 0, h2: 0, h3: 0, out: 0, Sound: 0 };
        // h1 = Silo cylinder height
        // h2 = Roof cone height
        // h3 = Bottom cone height
        // out = area of bottom out
        this.Ullage     = 0;
        this.Cargo      = {Name: '', Natura: 0 };
        this.Comments   = ''
    }
};

class cPile {
    constructor() {
            this.id     = '';
            this.Name   = '';
            this.type   =  ( 'box', 'pile' );
            this.type_location   = 'true'; // true = base level Pile , false = upper level Pile
            this.purpose = ( 'remove', 'add' ); //add or remove volume
            this.X      = 0; // location
            this.Y      = 0;
            this.angle  = 0;
            this.Height = 3;//Height of Pile
            this.Box_Heights = {h1: 1, h2: 1, h3: 1, h4: 1};
            this.Base   = { length: 10, width: 10 }; //base plane
            this.underBase_Height = 0;//Height of Box under Pile
            this.Top    = { length: 2, width: 2 }; //upper plane
            this.Tension_Base = 0.837;
            this.Tension_Volume = 0.5;
            this.angle_X = -70;
            this.angle_Y = 15;
            this.angle_Z = -10;
        }
    }

class cWarehouse {
    constructor() {
    this.id          = '';    
    this.Name        = 'NewWarehouse';
    this.Dimensions  = { Length: 0, Width: 0, Height: 0, Conus_height: 0, Conus_L: 0, Conus_W: 0, Conus_X: 0, Conus_Y: 0 };
    this.Pile        = [];
    this.Cargo       = {Name: '', Natura: 0 };
    this.Comments    = ''
    }
};


class cElevator {
    constructor() {
        this.id      = '';
        this.Name    = 'NewElevator';
        this.Adress  = '';
        this.Owner   = '';
        this.GEO     = '';
        this.ContactName     = '';
        this.ContactPosition = '';
        this.ContactPhone    = '';
        this.Date            = '';
        this.InspectorName   = '';
        this.Client          = '';
        this.Silo            = [];
        this.Warehouse       = [];
        this.Complex         = [];
        this.Comments        = ''       
        }
    };

class cElevators {
    constructor() {
        this.SoftVersion            = '';
        this.DBlocalVersion         = '';
        this.DBVersion              = '';
        this.State                  = "closed";
        this.Selected               = 0;
        this.SiloSelected           = 0;
        this.WarehouseSelected      = 0;
        this.PileSelected           = 0;
        this.ComplexSelected        = 0;
        this.ComplexSiloSelected    = 0;
        this.Elevators              = []
    };
    get ComplexDimension(){
        if (this.ComplexFound > 0 ) {
            return  this.ComplexAll.TotalDimension;
        } else return null;
    };
    set setComplexDimension_Length( data ){ this.Elevators[this.Selected].Complex[this.ComplexSelected].TotalDimension.Length = data };
    set setComplexDimension_Width( data ){ this.Elevators[this.Selected].Complex[this.ComplexSelected].TotalDimension.Width = data };
    set setComplexDimension_Height( data ){ this.Elevators[this.Selected].Complex[this.ComplexSelected].TotalDimension.Height = data };
    get SiloFound(){
        if ( this.ElevatorsFound ) {
            if ( this.Elevators[this.Selected].Silo )
            if ( this.Elevators[this.Selected].Silo.length > 0 ) { 
                    if ( this.SiloSelected > this.Elevators[this.Selected].Silo.length - 1 ) 
                        this.SetSiloSelected = this.Elevators[this.Selected].Silo.length -1
                    return this.Elevators[this.Selected].Silo.length
                }
                else return 0;
            }
        else return 0;
    };
    get FloorFound(){
        if ( this.ElevatorsFound ) {
            if ( this.Elevators[this.Selected].Warehouse )
            if ( this.Elevators[this.Selected].Warehouse.length > 0 ) { 
                    if ( this.WarehouseSelected > this.Elevators[this.Selected].Warehouse.length - 1 ) 
                        this.WarehouseSelected = this.Elevators[this.Selected].Warehouse.length -1
                    return this.Elevators[this.Selected].Warehouse.length
                }
                else return 0;
            }
        else return 0;
    };
    get_FloorByIndex( index ){
        //console.log('index = ',index);
        let count = this.FloorFound;
        if ( index < 0 || index > count ) return -1;
        if ( count < 1 ) return 0;

        return this.Elevators[this.Selected].Warehouse[ index ];
    };
    get PileFound(){
        if ( this.FloorFound ) {
            if ( this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile )
            if ( this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile.length > 0 ) { 
                    if ( this.PileSelected > this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile.length - 1 ) 
                        this.PileSelected = this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile.length -1
                    return this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile.length
                }
                else return 0;
            }
        else return 0;
    };
    get ComplexSiloFound(){
        if ( this.ComplexFound > 0 ) {
            if ( this.Elevators[this.Selected].Complex )
            if ( this.Elevators[this.Selected].Complex.length > 0 ) { 
                    if ( this.SiloSelected > this.Elevators[this.Selected].Complex.length - 1 ) 
                        this.SetSiloSelected = this.Elevators[this.Selected].Complex.length -1
                    return this.Elevators[this.Selected].Complex.length
                }
                else return -1;
            }
        else return -2;
    }
    get ComplexSiloList(){
        let List = [];
        if ( this.ElevatorsFound > 0 ) {
            if  ( this.ComplexFound > 0 ) {
                let ii = this.Elevators[this.Selected].Complex[ this.ComplexSelected ].Silo.length;
                let data;
                if ( ii > 0 )
                    for ( let row =0; row < ii; row++ ) {
                        let iii = this.Elevators[this.Selected].Complex[ this.ComplexSelected ].Silo[row].length;
                        if ( iii > 0 )
                        for ( let i = 0; i < iii; i++ ) {
                            data = this.Elevators[this.Selected].Complex[this.ComplexSelected].Silo[row][i];
                            List.push( data ); 
                        } 
                    }
            }
        }
    return( List )
    };
    set SetSiloSelected(data){ this.SiloSelected = data };
    set SetFloorSelected(data){ this.WarehouseSelected = data };
    set SetComplexSelected(data){ this.ComplexSelected = data };
    set SetComplexSiloSelected(data){ this.ComplexSiloSelected = data };
    get SiloName(){
        if ( this.SiloFound ) return this.Elevators[this.Selected].Silo[this.SiloSelected].Name
        else return 'empty'
    };
    get ComplexName(){
        if ( this.ComplexFound > 0 ) return this.Elevators[this.Selected].Complex[this.ComplexSelected].Name
        else return 'empty'
    };
    get FloorName(){
        if ( this.FloorFound > 0 ) return this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Name
        else return 'empty'
    };
    SetComplexSiloName (name, col, row){
        this.Elevators[this.Selected].Complex[this.ComplexSelected].Silo[col][row].Name = name;
    };

    get ComplexAll(){
        if ( this.ComplexFound > 0 ) {
            let data = structuredClone( this.Elevators[this.Selected].Complex[this.ComplexSelected] ).Silo;
        for ( let row=0; row < data.length; row++ ) {
            for ( let col = 0; col < data[row].length; col++ ) {
                data[row][col].row = row+1;
                data[row][col].col = col+1;
            }
        }
        this.Elevators[this.Selected].Complex[this.ComplexSelected].Silo = structuredClone ( data );
        return this.Elevators[this.Selected].Complex[this.ComplexSelected];
        }
        else return null
    };
    ComplexSiloGet( row, col ){
        let result;
        let found = false;
        result = new cComplexSilo ();
        if ( ( row != null ) && ( col != null ) ) {
            if ( this.ComplexFound > 0 ) {
                if ( this.Elevators[this.Selected].Complex[this.ComplexSelected].Silo[row][col] ) {
                    result =  structuredClone( this.Elevators[this.Selected].Complex[this.ComplexSelected].Silo[row][col] );
                 found = true;
                }
            }
        }
        return { result, found };
    };

    set SetSiloName(data){ if ( this.SiloFound ) this.Elevators[this.Selected].Silo[this.SiloSelected].Name  = data }
    set SetComplexName(data){ if ( this.ComplexFound ) this.Elevators[this.Selected].Complex[this.ComplexSelected].Name  = data }
    set SetFloorName(data){ if ( this.FloorFound ) this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Name  = data }
    get SiloCargo(){
        if ( this.SiloFound ) return this.Elevators[this.Selected].Silo[this.SiloSelected].Cargo
        else return ''
    };
    set SetSiloCargoName (data){ if ( this.SiloFound ) this.Elevators[this.Selected].Silo[this.SiloSelected].Cargo.Name  = data }
    set SetSiloCargoNatura (data ){ if ( this.SiloFound ) this.Elevators[this.Selected].Silo[this.SiloSelected].Cargo.Natura  = data }
    set SetSiloDimension_D (data ){ if ( this.SiloFound ) this.Elevators[this.Selected].Silo[this.SiloSelected].Dimensions.Diameter  = data }
    set SetSiloDimension_h1 (data ){ if ( this.SiloFound ) this.Elevators[this.Selected].Silo[this.SiloSelected].Dimensions.h1  = data }
    set SetSiloDimension_h2 (data ){ if ( this.SiloFound ) this.Elevators[this.Selected].Silo[this.SiloSelected].Dimensions.h2  = data }
    set SetSiloDimension_h3 (data ){ if ( this.SiloFound ) this.Elevators[this.Selected].Silo[this.SiloSelected].Dimensions.h3  = data }
    set SetSiloDimension_out (data ){ if ( this.SiloFound ) this.Elevators[this.Selected].Silo[this.SiloSelected].Dimensions.out  = data }
    set SetSiloDimension_Sound (data ){ if ( this.SiloFound ) this.Elevators[this.Selected].Silo[this.SiloSelected].Dimensions.Sound  = data }
    set SetSiloUllage (data ){ if ( this.SiloFound ) this.Elevators[this.Selected].Silo[this.SiloSelected].Ullage  = data }
    get SiloDimension(){
        if ( this.SiloFound ) return this.Elevators[this.Selected].Silo[this.SiloSelected].Dimensions
        else return ''
    }
    get SiloUllage(){
        if ( this.SiloFound ) return this.Elevators[this.Selected].Silo[this.SiloSelected].Ullage
        else return 0
    }
    get SiloVolume(){
        let v = 0;
        if ( this.SiloFound ) {
            let r1      = Number( this.SiloDimension.Diameter / 2 );
            let r2;
            let h1       = Number( this.SiloDimension.h1 );
            let h2       = Number( this.SiloDimension.h2 );
            let h3       = Number( this.SiloDimension.h3 );
            let out       = Number( this.SiloDimension.out );
            let sound   = Number( this.SiloDimension.Sound );
            let ullage  = Number( this.SiloUllage );
            let v1 = 0, v2 = 0, v3 =0 ;
            if ( ( sound - ullage ) <= h1 ) {
                v1 = 3.14 * Math.pow ( r1, 2 ) * ( sound - ullage )
            }
            if ( ( sound - ullage ) > h1  ) {
                v1 = 3.14 * Math.pow ( r1, 2 ) * h1
                r2 = r1  * ( h2 -  ( sound - ullage - h1 ) ) / h2;
                v2 = 1 / 3  * 3.14 * ( sound  - ullage  - h1 ) * ( Math.pow( r1, 2) + r1 * r2 + Math.pow( r2, 2 ) );
            }
            if ( h3 > 0 ) {
                r2 = Math.sqrt( out / 3.14 );
                v3 = 1 / 3  * 3.14 * h3 * ( Math.pow( r1, 2) + r1 * r2 + Math.pow( r2, 2 ) );
            } else v3 = 0;
            v = v1 + v2 + v3;
            v = Calc.MyRound( v, 3 );
        }
        return Number( v );
    }
    get SiloMass(){
        let m = 0;
        if ( this.SiloFound )
            if ( this.SiloCargo.Natura > 100 ) {
                m = this.SiloVolume * Number( this.SiloCargo.Natura ) / 1000;
            } else m = this.SiloVolume * Number( this.SiloCargo.Natura ) / 100;
        m = Calc.MyRound( m, 3 );
        return Number( m );
    }
    get SiloList(){
        let List = [];
        if ( this.SiloFound) {
            
            let ii = this.Elevators[this.Selected].Silo.length;
            let data;
            if (ii > 0 ) {    
                for( let i =0 ; i < ii ; i++){
                    data = this.Elevators[this.Selected].Silo[i].Name;
                    List.push( data );
                }
            }
        }
        return( List );
    }
    get FloorList(){
        let List = [];
        if ( this.FloorFound) {
            let ii = this.Elevators[this.Selected].Warehouse.length;
            let data;
            if (ii > 0 ) {    
                for( let i =0 ; i < ii ; i++){
                    data = this.Elevators[this.Selected].Warehouse[i].Name;
                    List.push( data );
                }
            }
            }
        return( List );
    }
    get PilesList(){
        let List = [];
        if ( this.PileFound) {
            let ii = this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile.length;
            let data;
            if (ii > 0 ) {    
                for( let i =0 ; i < ii ; i++){
                    data = this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[i].Name;
                    List.push( data );
                }
            }
            }
        return( List );
    }
    PileGet( index ){
        let result;
        if ( this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ] ) {
            result =structuredClone( this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ] );
            }
        return( result );
    }
    get FloorCurrent(){
        let result;
        if ( this.FloorFound) { result = structuredClone( this.Elevators[this.Selected].Warehouse[this.WarehouseSelected] ); }
        return( result );
    }
    get FloorCurrentDimensions(){
        let result;
        if ( this.FloorFound) { result = structuredClone( this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Dimensions ); }
        return( result );
    }
    setFloorDimensions ( Length , Width , Height , Conus_height , Conus_L , Conus_W , Conus_X , Conus_Y ){
        if ( this.FloorFound ) {
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Dimensions.Length = Number(Length);
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Dimensions.Width = Number(Width);
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Dimensions.Height = Number(Height);
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Dimensions.Conus_height = Number(Conus_height);
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Dimensions.Conus_L = Number(Conus_L);
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Dimensions.Conus_W = Number(Conus_W);
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Dimensions.Conus_X = Number(Conus_X);
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Dimensions.Conus_Y = Number(Conus_Y);
        } 
    }

    setPile ( index, Name, type, type_location, purpose, X, Y, angle, Height, Box_Heights, Base_length, Base_width, Top_length, Top_width, Tension_Base, Tension_Volume ){
        if ( this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ] ) {
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].Name = Name;
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].type = type ;
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].type_location = type_location;
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].purpose = purpose;
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].X = Number( X );
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].Y = Number( Y );
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].angle = Number( angle );
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].Height = Number( Height );
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].Box_Heights = Number( Box_Heights );
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].Base.length = Number( Base_length );
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].Base.width = Number( Base_width );
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].Top.length = Number( Top_length );
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].Top.width = Number( Top_width );
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].Tension_Base = Number( Tension_Base );
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].Tension_Volume = Number( Tension_Volume );
        } 
    }
    setPile_BaseInfo ( index, Name, type, type_location, purpose ){
        if ( this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ] ) {
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].Name = Name;
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].type = type ;
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].type_location = type_location;
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].purpose = purpose;
        } 
    }
    setPile_Location ( index, X, Y, angle ){
        if ( this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ] ) {
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].X = Number( X );
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].Y = Number( Y );
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].angle = Number( angle );
        } 
    }
    setPile_Height ( index, Height ){
        if ( this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ] ) {
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].Height = Number( Height );
        } 
    }
    setPile_underBase_Height ( index, underBase_Height ){
        if ( this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ] ) {
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].underBase_Height = Number( underBase_Height );
        } 
    }
    setPile_TopContur ( index, Top_length, Top_width, Tension_Volume ){
        if ( this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ] ) {
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].Top.length = Number( Top_length );
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].Top.width = Number( Top_width );
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].Tension_Volume = Number( Tension_Volume );
        } 
    }
    setPile_BaseContur ( index, Base_length, Base_width, Tension_Base ){
        if ( this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ] ) {
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].Base.length = Number( Base_length );
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].Base.width = Number( Base_width );
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].Tension_Base = Number( Tension_Base );
        } 
    }
    setAngleView( index, angle_X, angle_Y, angle_Z ){
        if ( this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ] ) {
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].angle_X = angle_X;
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].angle_Y = angle_Y;
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].angle_Z = angle_Z;
        };
    }
    get ComplexList(){
        let List = [];
        if ( this.ComplexFound > 0) {
            //let List = [];
            let ii = this.Elevators[this.Selected].Complex.length;
            let data;
            if (ii > 0 ) {    
                for( let i =0 ; i < ii ; i++){
                    data = this.Elevators[this.Selected].Complex[i].Name;
                    List.push( data );
                }
            }};
        return List;
    }
    SiloAdd(){
        if ( this.ElevatorsFound > 0 ) {
            this.Elevators[this.Selected].Silo.push(new cSilo());
            this.State = 'Silo added';
        } else alert ('Error adding silo !')
    }
    FloorAdd(){
        if ( this.ElevatorsFound > 0 ) {
            this.Elevators[this.Selected].Warehouse.push(new cWarehouse());
            this.State = 'Warehouse added';
        } else alert ('Error adding warehouse !')
    }
    PileAdd(){
        if ( this.FloorFound > 0 ) {
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile.push(new cPile());
            let dim = this.Elevators[this.Selected].Warehouse[this.Elevators[this.Selected].Warehouse.length-1].Dimensions;
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile.length-1].X = dim.Length/2; 
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile.length-1].Y = dim.Width/2;
            this.State = 'PIle added';
        } else alert ('Error adding pile !')
    }
    PileClone(index){
        if ( this.FloorFound > 0 ) {
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile.push( structuredClone( this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[index] ) );
            this.State = 'PIle clonned';
        } else alert ('Error cloning pile !')
    }
    get ComplexFound(){
        if ( this.ElevatorsFound ) {
            if ( this.Elevators[this.Selected].Complex ) {
                if ( this.Elevators[this.Selected].Complex.length > 0 ) { 
                        if ( this.ComplexSelected > this.Elevators[this.Selected].Complex.length - 1 ) 
                            this.SetComplexSelected = this.Elevators[this.Selected].Complex.length -1
                            return this.Elevators[this.Selected].Complex.length;
                        } else return 0;
            } else return -1;
            }
        else return -2;
    }
    ComplexAdd(){
        if ( this.ElevatorsFound > 0 ) {
            if ( this.ComplexFound == -1 ) ( this.Elevators[this.Selected].Complex = [] );
            if ( this.ComplexFound >= 0 ) {
                this.Elevators[this.Selected].Complex.push(new cComplex());
                this.State = 'Complex added';
            }
        } else alert ('Error adding complex !')
    };
    ComplexClone(){
        if ( this.ElevatorsFound > 0 ) {
            if ( this.ComplexFound == -1 ) ( this.Elevators[this.Selected].Complex = [] );
            if ( this.ComplexFound >= 0 ) {
                this.Elevators[this.Selected].Complex.push( structuredClone( this.Elevators[this.Selected].Complex[this.ComplexSelected] ) );
                this.State = 'Complex clonned';
            }
        } else alert ('Error clone complex !')
    };
    FloorClone(){
        if ( this.ElevatorsFound > 0 ) {
            if ( this.FloorFound == -1 ) ( this.Elevators[this.Selected].Warehouse = [] );
            if ( this.FloorFound >= 0 ) {
                this.Elevators[this.Selected].Warehouse.push( structuredClone( this.Elevators[this.Selected].Warehouse[this.WarehouseSelected] ) );
                this.State = 'Warehouse clonned';
            }
        } else alert ('Error clone warehouse !')
    };
    ComplexDel(){
        if ( this.ComplexFound > 0 ) {
            let message = 'Are you sure you want to remove Silo - ' + this.ComplexName +'?';
            if ( window.confirm( message ) ) {
                this.Elevators[this.Selected].Complex.splice( this.ComplexSelected, 1 );
                if ( this.ComplexSelected > this.ComplexFound - 1 ) this.ComplexSelected = this.ComplexFound -1 ;
                if ( this.ComplexSelected < 0 ) this.SetComplexSelected = 0;
            }
        };
    }
    FloorDel(){
        if ( this.FloorFound > 0 ) {
            let message = 'Are you sure you want to remove Warehouse - ' + this.FloorName +'?';
            if ( window.confirm( message ) ) {
                this.Elevators[this.Selected].Warehouse.splice( this.WarehouseSelected, 1 );
                if ( this.WarehouseSelected > this.FloorFound - 1 ) this.WarehouseSelected = this.FloorFound -1 ;
                if ( this.WarehouseSelected < 0 ) this.SetFloorSelected = 0;
            }
        };
    }
    PileDel( index ){
        if ( this.PileFound > 0 ) {
            let message = 'Are you sure you want to remove Pile № '+  (+index + +1) +'?';
            if ( window.confirm( message ) ) {
                this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile.splice( index, 1 );
            }
        };
        return (this.PileFound);
    }
    ComplexSiloAdd( Quantyti, Type, Height, Length, Width, Diameter, Conus_height ){
        if ( Quantyti >= 0 )
        if ( this.ComplexFound > 0 ) {
            if ( this.ComplexSiloFound == -1 ) ( this.Elevators[this.Selected].Complex[this.ComplexSelected].Silo = [] );
                if ( this.ComplexSiloFound >= 0 ) {
                    this.Elevators[this.Selected].Complex[this.ComplexSelected].Silo.push([]);
                    let row = this.Elevators[this.Selected].Complex[this.ComplexSelected].Silo.length - 1;
                    for ( let i = 0; i < Quantyti; i++ ) {
                        this.Elevators[this.Selected].Complex[this.ComplexSelected].Silo[ row ].push(new cComplexSilo());
                        this.Elevators[this.Selected].Complex[this.ComplexSelected].Silo[ row ][ i ].Type = Type;
                        this.Elevators[this.Selected].Complex[this.ComplexSelected].Silo[ row ][ i ].Height = Height;
                        if ( Type == 'square' ) {
                            this.Elevators[this.Selected].Complex[this.ComplexSelected].Silo[ row ][ i ].Length = Length;
                            this.Elevators[this.Selected].Complex[this.ComplexSelected].Silo[ row ][ i ].Width = Width;
                            this.Elevators[this.Selected].Complex[this.ComplexSelected].Silo[ row ][ i ].Diameter = null;
                        } else {
                                this.Elevators[this.Selected].Complex[this.ComplexSelected].Silo[ row ][ i ].Length = null;
                                this.Elevators[this.Selected].Complex[this.ComplexSelected].Silo[ row ][ i ].Width = null;
                                this.Elevators[this.Selected].Complex[this.ComplexSelected].Silo[ row ][ i ].Diameter = Diameter;
                            }   
                        this.Elevators[this.Selected].Complex[this.ComplexSelected].Silo[ row ][ i ].Conus_height = Conus_height;
                    }
                    this.State = 'Complex Silo added';
                } else alert ('Error adding silo in complex !')
        }
    };

    ComplexDataSet( ComplexSiloData ){

        console.log('for uppdate ComplexSiloData = ',ComplexSiloData);
        //let a =  new Map (ComplexSiloData);
        //console.log('ComplexSiloData  (a)= ',a);
        //let b;
        //let data = [];
        //for (let i = 1; i < a.size+1; i++ ) {
        //    b = a.get(i);
        //   if ( b ) { data.push( b ); };
        //};

        let data = structuredClone( ComplexSiloData );
        console.log('structuredClone = ',data);
        let row = 0;
        let col = 0;
        let current_row = 0;
        let new_data = [[]];
        for ( let i = 0; i < data.length; i++) {
            console.log('current_row  =',current_row);
            console.log('data[i].row -1 = ',data[i].row -1);
            if ( current_row != data[i].row -1 ) {
                current_row = data[i].row -1;
                new_data.push([]);
            }
            new_data[new_data.length-1].push( structuredClone( data[i] ) );
        }
        this.Elevators[this.Selected].Complex[ this.ComplexSelected ].Silo = structuredClone( new_data );
        console.log('new_data = ',new_data);
    };
    ComplexSiloUllageSet(row, col, ullage) {
        let result = false;
        if ( this.ComplexFound > 0 ) {
            this.Elevators[this.Selected].Complex[this.ComplexSelected].Silo[row][col].Ullage = ullage;
            result = true;
        }
        return result;
    }

    SiloClone(){
        if ( this.ElevatorsFound ) {
            this.Elevators[this.Selected].Silo.push(new cSilo());
            this.State = 'Silo added';
            let i = this.Elevators[this.Selected].Silo.length - 1;
            this.Elevators[this.Selected].Silo[i] =  structuredClone( this.Elevators[this.Selected].Silo[ this.SiloSelected ] );
            this.Elevators[this.Selected].Silo[i].Name = 'NewSilo';
        } else alert ('Error cloning silage !')
    }
    SiloDel(){
        if ( this.SiloFound) { 
            let message = 'Are you sure you want to remove Silo - ' + this.SiloName +'?';
            if ( window.confirm( message ) ) {
                this.Elevators[this.Selected].Silo.splice( this.SiloSelected, 1 );
                if ( this.SiloSelected > this.SiloFound - 1 ) this.SiloSelected = this.SiloFound -1 ;
                if ( this.SiloSelected < 0 ) this.SetSiloSelected  = 0;
            }
        }    
    }
    set setSelected(data) { this.Selected = data }
    get ElevatorsFound(){
        if ( this.Elevators || null )
        if ( this.Elevators.length > 0 ) return this.Elevators.length
            else return 0
    }
    get ElevatorsName(){
        if ( this.ElevatorsFound ) return this.Elevators[this.Selected].Name
        else return ''
    }
    get ElevatorsDate(){
        if ( this.ElevatorsFound ) return this.Elevators[this.Selected].Date
        else return ''
    }
    set setName(data){ this.Elevators[this.Selected].Name = data }
    set setDate(data){ if ( this.ElevatorsFound ) this.Elevators[this.Selected].Date = data }
    get ElevatorAdress(){
        if ( this.ElevatorsFound) return this.Elevators[this.Selected].Adress
        else return ''
    }
    set setAdress(data) { if ( this.ElevatorsFound ) this.Elevators[this.Selected].Adress = data }
    get ElevatorOwner(){
        if ( this.ElevatorsFound) return this.Elevators[this.Selected].Owner
        else return ''
    }
    set setOwner(data) { if ( this.ElevatorsFound ) this.Elevators[this.Selected].Owner = data }
    get ElevatorClient(){
        if ( this.ElevatorsFound) return this.Elevators[this.Selected].Client
        else return ''
    }
    set setClient(data) { if ( this.ElevatorsFound ) this.Elevators[this.Selected].Client = data }
    get ElevatorContactName(){
        if ( this.ElevatorsFound) return this.Elevators[this.Selected].ContactName
        else return ''
    }
    set setContactName(data) { if ( this.ElevatorsFound ) this.Elevators[this.Selected].ContactName = data }
    get ElevatorContactPosition(){
        if ( this.ElevatorsFound) return this.Elevators[this.Selected].ContactPosition
        else return ''
    }
    set setContactPosition(data) { if ( this.ElevatorsFound ) this.Elevators[this.Selected].ContactPosition = data }
    get ElevatorContactPhone(){
        if ( this.ElevatorsFound) return this.Elevators[this.Selected].ContactPhone
        else return ''
    }
    set setContactPhone(data) { if ( this.ElevatorsFound ) this.Elevators[this.Selected].ContactPhone = data }
    get ElevatorInspectorName(){
        if ( this.ElevatorsFound) return this.Elevators[this.Selected].InspectorName
        else return ''
    }
    set setInspectorName(data) { if ( this.ElevatorsFound ) this.Elevators[this.Selected].InspectorName = data }
    get ElevatorComments(){
        if ( this.ElevatorsFound) return this.Elevators[this.Selected].Comments
        else return ''
    }
    set setComments(data) { if ( this.ElevatorsFound ) this.Elevators[this.Selected].Comments = data }
    set setElevators(data){
        this.Elevators = data;
        if ( data || null ) { this.State = 'open' } else this.State = 'closed';
         }
    AddElevator(){
        this.Elevators.push(new cElevator());
        this.State = 'Elevator added'
    }
    ElevatorDel(){
        if ( this.ElevatorsFound) { 
            let message = 'Вы уверены, что хотите удалить Елеватор - ' + this.ElevatorsName +'?';
            if ( window.confirm( message ) ) {
                this.Elevators.splice( this.Selected, 1 );
                if ( this.Selected > this.ElevatorsFound - 1 ) this.Selected = this.ElevatorsFound -1 ;
                if ( this.Selected < 0 ) this.Selected  = 0;
            }
        }  else alert('Elevator nof found !');  
    }
    ElevatorClone(){
        if ( this.ElevatorsFound ) {
            this.Elevators.push(new cElevator());
            this.State = 'Elevator cloned'
            let i = this.Elevators.length - 1;
            this.Elevators[i] = structuredClone( this.Elevators[this.Selected] );
            this.Elevators[i].Date = '';
        } else alert ('Error adding Elevator !')  
    }
    get ElevatorList(){
        let List = [];
        let ii = this.Elevators.length;
        let data;
        if (ii > 0 ) {    
            for( let i =0 ; i < ii ; i++){
                data = this.Elevators[i].id + this.Elevators[i].Name + ' - ' + this.Elevators[i].Date;
                List.push( data );
            }
        }
        return(
            List
        )
    }
    get SiloTotalInfo(){
        let info = []; 
        if ( this.SiloFound ) {
            let Sel = this.SiloSelected;
            let cargos  = [];
            let ii = this.Elevators[this.Selected].Silo.length;
            for ( let i = 0; i < ii ; i++ ) { 
                    this.SetSiloSelected  = i;
                    if ( this.SiloCargo.Name  )
                        cargos.push ( [ this.SiloName, this.SiloCargo.Name, this.SiloMass ] )
            };
            info = cargos;
            this.SetSiloSelected  = Sel;
        }
        return info;
    }
    get SiloCargoInfo(){
        let cargo = [];
        if ( this.SiloFound ) {
            let data = this.SiloTotalInfo;
            let cargo_name = new Set();
            let q;
            for (let i = 0; i < data.length; i++) {
                cargo_name.add( data[i][1] );
            }
            cargo_name = Array.from(cargo_name);
            let cargo_filter =[];
            for ( let ii = 0; ii < cargo_name.length; ii++ ) {
                q = data.filter( ([n, cargo, m]) => cargo == cargo_name[ii] );
                cargo_filter.push(q); 
            }
        for ( let i = 0; i < cargo_filter.length; i++) {
            let m = 0;
            for ( let ii = 0; ii < cargo_filter[i].length; ii++ ) {
                m = m + cargo_filter[i][ii][2];
            }
            m = Calc.MyRound( m , 3);
            cargo.push( [ cargo_filter[i][0][1], m ] )
        }
        }
        return cargo;    
    }
    get ComplexKorpusTotalInfo(){
        let data = [[]];
        let cargos  = [];
        let massa = 0;
        if ( this.ComplexFound ) {
            data = structuredClone( this.ComplexAll.Silo );
            data = [].concat(...data);
            console.log('ComplexTotalInfo - data = ',data);
            let ii = data.length;
            for ( let i = 0; i < ii ; i++ ) { 
                    if ( data[i].CargoName && data[i].Using ) {
                        massa = this.massaComplexSilo( data, i ).weight;
                        cargos.push ( [ data[i].Name, data[i].CargoName, massa ] );
                    }
            };
        }
        return cargos;
    }
    get ComplexTotalInfo(){
        let dataTotal = [];
        let data = [];
        let cargos  = [];
        let massa = 0;
        if ( this.ElevatorsFound ) {
            dataTotal = structuredClone( this.Elevators[this.Selected].Complex );
            for ( let ii = 0; ii < dataTotal.length; ii++  ) {
                //let complexName = this.Elevators[this.Selected].Complex[ii].Name;
                let complex = structuredClone(dataTotal[ii].Silo);
                console.log('ComplexTotalInfo (complex)= ',complex);
                //for ( let c = 0; c < complex.length; c++ ) {
                //    for (let cc = 0; cc < complex[c].length; cc++ ){
                //        complex[c][cc].ComplexName = complexName;
                //    }
                //}
                data = data.concat(complex);
                console.log('ComplexTotalInfo (!)= ',data);
            }
            data = [].concat(...data);
            console.log('ComplexTotalInfo (!data)= ',data);
            let ii = data.length;
            for ( let i = 0; i < ii ; i++ ) { 
                if ( data[i].CargoName && data[i].Using ) {
                    massa = this.massaComplexSilo( data, i ).weight;
                    cargos.push ( [ data[i].Name, data[i].CargoName, massa ] );
                }
            };
        }
        return cargos;
    }
    get ComplexKorpusCargoInfo(){
        let cargo = [];
        if ( this.ComplexFound ) {
            let data = this.ComplexKorpusTotalInfo;
            let cargo_name = new Set();
            let q;
            for (let i = 0; i < data.length; i++) {
                cargo_name.add( data[i][1] );
            }
            cargo_name = Array.from(cargo_name);
            let cargo_filter =[];
            for ( let ii = 0; ii < cargo_name.length; ii++ ) {
                q = data.filter( ([n, cargo, m]) => cargo == cargo_name[ii] );
                cargo_filter.push(q); 
            }
        for ( let i = 0; i < cargo_filter.length; i++) {
            let m = 0;
            for ( let ii = 0; ii < cargo_filter[i].length; ii++ ) {
                m = m + cargo_filter[i][ii][2];
            }
            m = Calc.MyRound( m , 3);
            cargo.push( [ cargo_filter[i][0][1], m ] )
        }
        }
        return cargo;    
    }
    get ComplexCargoInfo(){
        let cargo = [];
        if ( this.ComplexFound ) {
            let data = this.ComplexTotalInfo;
            let cargo_name = new Set();
            let q;
            for (let i = 0; i < data.length; i++) {
                cargo_name.add( data[i][1] );
            }
            cargo_name = Array.from(cargo_name);
            let cargo_filter =[];
            for ( let ii = 0; ii < cargo_name.length; ii++ ) {
                q = data.filter( ([n, cargo, m]) => cargo == cargo_name[ii] );
                cargo_filter.push(q); 
            }
        for ( let i = 0; i < cargo_filter.length; i++) {
            let m = 0;
            for ( let ii = 0; ii < cargo_filter[i].length; ii++ ) {
                m = m + cargo_filter[i][ii][2];
            }
            m = Calc.MyRound( m , 3);
            cargo.push( [ cargo_filter[i][0][1], m ] )
        }
        }
        return cargo;    
    }
    area_circle( diameter ){
        let area = 3.14 * Math.pow( diameter / 2, 2 );
        console.log('area_circle = ',area);
        return area;
    }
    area_star( diameter ){
        let area = diameter*diameter - 3.14 * Math.pow( diameter / 2, 2 );
        console.log('area_circle = ',area);
        return area;
    }
    volume_cilinder( height, diameter, area ){
        let volume;
        if ( area == 0 || area == null || area == '' ){
            volume = this.area_circle( diameter ) * height;
        } else {
            volume = height * area;
        }
        return volume;
    }
    volume_star( height, diameter, area ){
        let volume;
        if ( area == 0 || area == null || area == '' ){
            volume = this.area_star( diameter ) * height;
        } else {
            volume = height * area;
        }
        return volume;
    }
    volume_conus_star( height, diameter, area ){
        let volume;
        if ( area == 0 || area == null || area == '' ){
            volume = this.area_star( diameter ) * height / 3;
        } else {
            volume = height * area / 3;
        }
        return volume;
    }
    volume_square( height, length, width, area ){
        let volume;
        console.log('volume_square data = ', height, length, width, area);
        console.log('volume_square area = ', area);
        if ( area == 0 || area == null || area == '' ){
            volume = length * width * height;
        } else {
            volume = height * area;
        }
        console.log('volume_square volume = ', volume);
        return volume;
    }
    volume_conus_circle( height, diameter, area  ){
        let volume;
        if ( area == 0 || area == null || area == '' ){
            volume = 1/3 * this.area_circle( diameter ) * height;
        }else {
            volume = height * 1/3*area;
        }
        return volume;
    }
    volume_conus_square( height, length, width, area ){
        let volume;
        if ( area == 0 || area == null || area == '' ){
            volume = 1/3 * length * width *height;
        }else {
            volume = height * 1/3*area;
        }
        return volume;
    }
    volume_mineSilo_circle( height, diameter, conus_height, area ){
        let volume = this.volume_cilinder( height, diameter, area ) + this.volume_conus_circle( conus_height, diameter, area );
        return volume;
    }
    volume_mineSilo_square( heigth, length, width, conus_height, area ){
        let volume = this.volume_square( heigth, length, width, area ) + this.volume_conus_square( conus_height, length, width, area );
        return volume;
    }
    volume_mineSilo_star( height, diameter, conus_height, area ){
        let volume = this.volume_star( height, diameter, area ) + this.volume_conus_star( conus_height, diameter, area );
        return volume;
    }
    volume_mineSilo( type, sound, ullage, height, length, width, diameter, conus_height, area ){
        console.log('voume_mineSilo data = ', type, sound, ullage, height, length, width, diameter, conus_height, area);
        let volume = 0;
        let err_mes = '';
        let wokrHeight = sound - ullage;
        if ( type != 'square' && type != 'circle' && type !='star' ) err_mes = 'unknown silo type, ';
        if ( sound <= 0 ) err_mes = err_mes + 'incorrect Measuring Point, ';
        if ( ullage > sound || ullage < 0) err_mes = err_mes + 'incorrect Ullage, ';
        if ( height <= 0 ) err_mes = err_mes + 'incorrect Height, ';
        if ( type == 'square' ){
            if ( length <= 0 ) err_mes = err_mes + 'incorrect Length, ';
            if ( width <= 0 ) err_mes = err_mes + 'incorrect Width, ';
        };
        if ( type == 'circle' || type == 'star'){
            if ( diameter <= 0 ) err_mes = err_mes + 'incorrect Diameter, ';
        };  
        if ( conus_height < 0 ) err_mes = err_mes + 'incorrect Conus Height, ';
        if ( area < 0 ) err_mes = err_mes + 'incorrect Area, ';

        if ( wokrHeight > height ) {
            wokrHeight = height;
            err_mes = err_mes + '(Measuring Point - Ullage) > Height, '
        };

        if ( area == null || area =='' || area == 0 ) {
            if ( type == 'square' ) {
                volume = this.volume_mineSilo_square( wokrHeight, length, width, conus_height, area );
            }   
            if ( type == 'circle' ) {
                volume = this.volume_mineSilo_circle( wokrHeight, diameter, conus_height, area );
            }
            if ( type == 'star' ) {
                volume = this.volume_mineSilo_star( wokrHeight, diameter, conus_height, area );
            }
        } else { volume = area * wokrHeight; }
        volume = Calc.MyRound ( volume, 3 );
    return  {volume, err_mes };
    }
    cargo_weight_natura( volume, natura ){ //Natura - GOST (g/l)
        let massa = volume * natura/1000;
        massa = Calc.MyRound ( massa, 3 );
        return massa;
    }
    cargo_weight_tw( volume, testWeight ){ //Test Weight - ISO (kg/m3)
        let massa = volume * testWeight;
        massa = Calc.MyRound ( massa, 3 );
        return massa;
    }
    ComplexSiloArea( type, length, width, diameter ){
        let area = 0;
        if ( type == 'square' ) {
            area = length * width;
        }
        if ( type == 'circle' ) {
            area = 3.14 * Math.pow( diameter/2, 2 );
        }
        if ( type == 'star' ) {
            area = diameter*diameter - 3.14 * Math.pow( diameter/2, 2 );
        }
        area = Calc.MyRound ( area, 3 );
    return area;
    }

    volume_Pile_base( index  ){
        let pile = this.PileGet(index);
        let volume = 'Pile № '+ index + ' Volume = test volume (m3)';
        
        return volume;
    }

    massaComplexSiloGet( row, col ){
        let volume =0;
        let weight =0;
        let silo = this.ComplexSiloGet(row,col);
        console.log('silo = ',silo);
        if ( silo.found ) {
            silo = silo.result
            volume = this.volume_mineSilo( silo.Type, silo.Sound, silo.Ullage, silo.Height, silo.Length, silo.Width, silo.Diameter, silo.Conus_height, silo.Area ).volume;
            volume = Calc.MyRound( volume, 3 );
            weight = volume * silo.CargoTW / 1000;
            weight = Calc.MyRound( weight, 3 );
        } else { volume =0; weight =0; console.log('massaComplexSiloGet = error');}
        return {volume, weight};
    }
    massaComplexSilo( dataTable, row ){
        let result;
        let err_mes = '';
        let volume =0;
        let weight =0;
        let silo = structuredClone ( dataTable[row] );
        result = this.volume_mineSilo( silo.Type, silo.Sound, silo.Ullage, silo.Height, silo.Length, silo.Width, silo.Diameter, silo.Conus_height, silo.Area );
        volume = result.volume;
        err_mes = result.err_mes;
        volume = Calc.MyRound( volume, 3 );
        if ( silo.CargoTW > 100 ) { 
            weight = volume * silo.CargoTW / 1000;      //DSTU
        } else weight = volume * silo.CargoTW / 100;   //ISO
        weight = Calc.MyRound( weight, 3 );
        if ( silo.CargoTW < 10 ) { err_mes = err_mes + 'incorrect Test Weight, ' };
        return {volume, weight, err_mes };
    }

    get_Volume_Piles( Warehouse_Index, step_mesh = 50 ){
        let z = [];
        let mesh = [];
        //let mesh_3D = [];
        let volume = 0;
        let Length = 0;
        let Width = 0;
        let dx_X = 0;
        let dx_Y = 0;
        let angle = 0;
        let step_xy = step_mesh;

        let floor = this.get_FloorByIndex( Warehouse_Index );

        if ( floor != 0 && floor != -1  ){
            Length = floor.Dimensions.Length;
            Width = floor.Dimensions.Width;
            //step_xy = floor.Step;
            //if ( step_xy == undefined || step_xy == 0 ) step_xy = 50;

            let pile = new cPile;
            let Pile_H = 0
            let max = 0;
            let step = 10;
            let gPile = new cgPile();
            let numOfSegments = 10;
            
            let slices = [];
            let slice = [];

            let x1 = 0; let y1 = 0; let z1=0;
            let x2 = 0; let y2 = 0; let z2=0;
            let x3 = 0; let y3 = 0; let z3=0;
            let x4 = 0; let y4 = 0; let z4=0;
            //let a =0 ; let b = 0; let c = 0;

            for ( let index = 0; index < floor.Pile.length; index++ ){ //Pile slicing
            //for ( let index = 0; index < 1; index++ ){ //Pile slicing
                pile = Elevators.PileGet( index );
                gPile.set_Initial_Data_Complex ( pile, numOfSegments );//initialisation Pile
                Pile_H = pile.Height;
                dx_X = pile.X;
                dx_Y = pile.Y;
                angle = pile.angle;
                max = get_Max_Y_3D( gPile.get_Contur_Arc_Length ) - 0.0001;
                slices.push([]);
                for ( let i = 0; i <= step; i++ ){ 
                    slice = gPile.get_Slice_Base( max / step * i );
                    //3d modification
                    /*slices  = RotateMatrix_Z_any( slices, angle );
                    slices  = MoveMatrixAny( slices, x_location, y_location, dh + z_location );
                    slices  = ScaleMatrixAny1zoom( slices, zoom );
                    slices  = RotateMatrix_X_any( slices, angle_X );
                    slices  = RotateMatrix_Y_any( slices, angle_Y );
                    slices  = RotateMatrix_Z_any( slices, angle_Z );
                    slices  = MoveMatrixAny( slices, x_center , y_center , z_center );*/
                    //
                    slices[index].push([]);
                    //slices[index][i] = slice.slice(0) ;
                    slices[index][i] = matrix.RotateMatrix_Z_any( slice, angle, 3 );
                    //mesh = mesh.concat( slice.slice(0) );

                }
               // console.log('slices = ', slices);
            }//Pile slicing


            let dx = Length / step_xy;
            let dy = Width / step_xy;
            let xy_gab = { x_min: 0, x_max: 0, y_min: 0, y_max: 0 };
            let x_start = 0, x_end = 0;
            let y_start = 0, y_end = 0;

            piles: for ( let index = 0; index < slices.length; index++ ){
                pile = Elevators.PileGet( index );
                dx_X = pile.X;
                dx_Y = pile.Y;
                xy_gab = Spline.get_Max_Gabarit( slices[ index ][0], dx_X, dx_Y );
                //console.log('xy_gab = ',xy_gab);
                if ( xy_gab.x_min+dx_X <= 0 ) { 
                    x_start = 0;
                } else x_start = Math.trunc( ( xy_gab.x_min+dx_X ) / dx );

                if ( xy_gab.x_max+dx_X >= Length ) { 
                    x_end = step_xy;
                } else x_end = Math.floor( ( xy_gab.x_max+dx_X ) / dx );

                if ( xy_gab.y_min+dx_Y <= 0 ) { 
                    y_start = 0;
                } else y_start = Math.trunc( ( xy_gab.y_min+dx_Y ) / dy );

                if ( xy_gab.y_max+dx_Y >= Width ) { 
                    y_end = step_xy;
                } else y_end = Math.floor( ( xy_gab.y_max+dx_Y ) / dy );

                coord_X: for ( let x = x_start; x <= x_end; x++ ){
                    coord_Y: for ( let y = y_start; y <= y_end; y++ ){
                        z = [ x*dx, y*dy, 0 ];
                            slises: for ( let i = 0; i < step; i++ ){
                                segments: for ( let j = 0; j < slices[index][i].length-4; j+=4 ){
                                                x1 = slices[ index ][i][j]+dx_X;
                                                y1 = slices[ index ][i][j+1]+dx_Y;
                                                z1 = slices[ index ][i][j+2];

                                                x2 = slices[ index ][i][j+4]+dx_X;
                                                y2 = slices[ index ][i][j+5]+dx_Y;
                                                z2 = slices[ index ][i][j+6];

                                                x3 = slices[ index ][i+1][j]+dx_X;
                                                y3 = slices[ index ][i+1][j+1]+dx_Y;
                                                z3 = slices[ index ][i+1][j+2];

                                                x4 = slices[ index ][i+1][j+4]+dx_X;
                                                y4 = slices[ index ][i+1][j+5]+dx_Y;
                                                z4 = slices[ index ][i+1][j+6];

                                                if ( Calc.Point_inside_Triangle( x1, y1, x2, y2, x4, y4, x*dx, y*dy ) ) {
                                                    z = Calc.rayPlaneIntersection(  [ x1, y1, z1 ], [ x2, y2, z2 ], [ x4, y4, z4 ], [ x*dx, y*dy, 0 ], [ 0, 0, 1 ] );
                                                    break slises;
                                                }

                                                if ( Calc.Point_inside_Triangle( x1, y1, x3, y3, x4, y4, x*dx, y*dy ) ) {
                                                    z = Calc.rayPlaneIntersection(  [ x1, y1, z1 ], [ x3, y3, z3 ], [ x4, y4, z4 ], [ x*dx, y*dy, 0 ], [ 0, 0, 1 ] );
                                                    break slises;
                                                }

                                } //segments
                            } //slises
                        mesh = mesh.concat( z, [ 1 ] );
                    }//coord_Y
                }//coord_X
            }//piles

        }//if
        return { mesh, volume };
    };//get_Volume_Piles

};

export let Elevators = new cElevators();

