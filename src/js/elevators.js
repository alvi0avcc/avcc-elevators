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
            this.Tension_Base = 0.83888;
            this.Tension_Volume = 0.5;
            this.angle_X = -70;
            this.angle_Y = 15;
            this.angle_Z = -10;
            this.Volume = 0;
            this.Weight = 0;
        }
    }

class cWarehouse {
    constructor() {
    this.id          = '';    
    this.Name        = 'NewWarehouse';
    this.Dimensions  = { Length: 50, Width: 20, Height: 10, Conus_height: 0, Conus_L: 45, Conus_W: 1, Conus_X: 25, Conus_Y: 10 };
    this.PileSelected = 0;
    this.Pile        = [];
    this.Cargo       = {Name: '', Natura: 0 };
    this.MeshStep   = 50;
    this.MeshStyle  = ( 'solid', 'mesh' );
    this.ShowHouse  = true;
    this.Multicolor = false;
    this.Mesh       = [];
    this.Mesh_3D    = [];
    this.Strip      = [];
    this.Volume     = 0;
    this.Weight     = 0;
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
        this.Date            = new Date().toISOString().slice(0,-14);
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
        this.ComplexSelected        = 0;
        this.ComplexSiloSelected    = 0;
        this.Elevators              = []
    };
    get ComplexDimension(){
        if (this.ComplexFound > 0 ) {
            return  this.ComplexAll.TotalDimension;
        } else return null;
    };
    get ElevatorSelected(){
        let selected = 0;
        let found = this.ElevatorsFound;
        selected = this.Selected;
        //if ( typeof( selected ) != Number ) selected = 0;
        if ( found < selected + 1 ) selected = found - 1;
        if ( found <= 0 ) selected = 0;
        if ( selected < 0  ) selected = 0;
        this.Selected = selected;
        
        return selected;
    }
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
    /**
     * @param {number} index
     */
    set set_Pile_Selected( index ){ this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].PileSelected  = index ; }
    get get_Pile_Selected(){ 
        let found = this.PileFound;
        if ( found <= 0 ) {
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].PileSelected = 0;
            return 0;
        }
        if ( this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].PileSelected > found - 1 ) {
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].PileSelected = found - 1;
        }
        return this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].PileSelected 
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
    get get_Floor_CargoName(){
        if ( this.FloorFound > 0 ) return this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Cargo.Name
        else return ''
    };
    get get_Floor_CargoTW(){
        if ( this.FloorFound > 0 ) return this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Cargo.Natura
        else return '0'
    };
    /**
     * @param {string} name name of cargo in warehouse
     */
    set set_Floor_CargoName( name ){
        this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Cargo.Name = name;
    };
    /**
     * @param {number} tw test weight of cargo in warehouse
     */
    set set_Floor_CargoTW( tw ){
        if ( tw < 0  ) tw = 0;
        this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Cargo.Natura = tw;
        let volume = this.get_Floor_Volume;
        if ( tw > 100 ) this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Weight = Calc.MyRound( volume * tw / 1000, 3 )
        else  this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Weight = Calc.MyRound( volume * tw / 100, 3 );
    };
    SetComplexSiloName (name, col, row){
        this.Elevators[this.Selected].Complex[this.ComplexSelected].Silo[col][row].Name = name;
    };

    get ComplexAll(){
        if ( this.ComplexFound > 0 ) {
            let data = structuredClone( this.Elevators[this.ElevatorSelected].Complex[this.ComplexSelected] ).Silo;
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
    get_Pile_Volume( index = 0 ){
        if ( index >= this.PileFound ) index = 0;
        if ( this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].Volume == undefined ) return ( 0 );
        return ( this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].Volume );
    }
    get_Pile_Weight( index = 0 ){
        if ( index >= this.PileFound ) index = 0;
        if ( this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].Weight == undefined ) return ( 0 );
        return ( this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].Weight );
    }
    set_Pile_Volume( index = 0, volume = 0 ){
        this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].Volume = volume;
        this.set_Pile_Weight = index;
    }
    /**
     * @param {number} index index of Pile for calculate weigth
     */
    set set_Pile_Weight( index ){
        let volume = this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].Volume;
        let tw = this.get_Floor_CargoTW;
        let weight = 0;
        if (  tw > 100 ) weight = volume * tw / 1000
        else weight = volume * tw / 100;
        this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].Weight = Calc.MyRound( weight, 3 );
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
    set set_Floor_Mesh( step = 50 ){
        step = Math.trunc( step / 2 ) * 2;
        this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].MeshStep = step;
        let result = this.get_Volume_Piles( this.WarehouseSelected, step );
        this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Mesh = structuredClone( result.mesh );
        this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Mesh_3D = structuredClone( result.mesh_3D );
        this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Strip = structuredClone( result.strip );
        this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Volume = result.volume;
        this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Weight = result.weight;
    }
    set set_Floor_MeshStyle ( style ){
        this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].MeshStyle = style;
    }
    get get_Floor_MeshStyle (){
        let state = 'mesh';
        if ( this.Elevators[this.ElevatorSelected].Warehouse[this.WarehouseSelected] ) {
            if ( this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].MeshStyle ){
                state = this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].MeshStyle;
            }
        }
        return state;
    }
    get get_Floor_Mesh(){
        if ( this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Mesh  == undefined ) {
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Mesh = [];
        }
        return this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Mesh;
    }
    get get_Floor_Mesh_3D(){
        if ( this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Mesh_3D  == undefined ) {
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Mesh_3D = [];
        }
        return this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Mesh_3D;
    }
    get get_Floor_Strip(){
        if ( this.Elevators[this.ElevatorSelected].Warehouse[this.WarehouseSelected].Strip  == undefined ) {
            this.Elevators[this.ElevatorSelected].Warehouse[this.WarehouseSelected].Strip = [];
        }
        return this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Strip;
    }
    get get_Floor_Volume(){
        if ( this.Elevators[this.ElevatorSelected].Warehouse[this.WarehouseSelected].Volume  == undefined ) {
            this.Elevators[this.ElevatorSelected].Warehouse[this.WarehouseSelected].Volume = 0;
        }
        return this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Volume;
    }
    get get_Floor_Weight(){
        if ( this.Elevators[this.ElevatorSelected].Warehouse[this.WarehouseSelected].Weight  == undefined ) {
            this.Elevators[this.ElevatorSelected].Warehouse[this.WarehouseSelected].Weight = 0;
        }
        return this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Weight;
    }
    get get_Floor_MeshStep(){
        if ( this.Elevators[this.ElevatorSelected].Warehouse[this.WarehouseSelected].MeshStep == undefined ) {
            this.Elevators[this.ElevatorSelected].Warehouse[this.WarehouseSelected].MeshStep = 50;
        }
        return this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].MeshStep;
    }
    set set_Floor_MeshStep( step ){
        //step = Math.trunc( step / 2 ) * 2;
        this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].MeshStep = step;
    }
    get get_Floor_ShowHouse(){
        let state = true;
        if ( this.Elevators[this.ElevatorSelected].Warehouse[this.WarehouseSelected] ) 
            if ( this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].ShowHouse != undefined ) {
            state = this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].ShowHouse;
            } else {
                this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].ShowHouse = true;
            }
        return state;
    }
    set set_Floor_ShowHouse( showHouse ){
        this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].ShowHouse = showHouse;
    }
    get get_Floor_Multicolor(){
        let state = true;
        if ( this.Elevators[this.ElevatorSelected].Warehouse[this.WarehouseSelected]) {
            if ( this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Multicolor != undefined ) {
                state = this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Multicolor;
            } else this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Multicolor = true;
        }
        return state;
    }
    set set_Floor_Multicolor( multicolor ){
        this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Multicolor = multicolor;
    }
    set_Floor_View( ShowHouse = true, Multicolor = true ){
        this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].ShowHouse = ShowHouse;
        this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Multicolor = Multicolor;
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
    set_Pile_Name ( name ){
        if ( this.PileFound ) {
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ this.get_Pile_Selected ].Name = name;
        } 
    }
    get get_Pile_Name (){
        let name = '';
        if ( this.PileFound > 0 ) {
            name = this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ this.get_Pile_Selected ].Name;
        }
        return name;
    }
    set_Pile_Type ( type ){
        if ( this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ this.get_Pile_Selected ] ) {
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ this.get_Pile_Selected ].Type = type;
        } 
    }
    setPile_Location ( index, X, Y, angle ){
        if ( this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ] ) {
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].X = Number( X );
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].Y = Number( Y );
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].angle = Number( angle );
        } 
    }
    set_Pile_Location ( X = 0, Y = 0, angle = 0 ){
        if ( this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ this.get_Pile_Selected ] ) {
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ this.get_Pile_Selected ].X = Number( X );
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ this.get_Pile_Selected ].Y = Number( Y );
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ this.get_Pile_Selected ].angle = Number( angle );
        } 
    }
    set_Pile_Location_X ( X = 0){
        if ( this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ this.get_Pile_Selected ] ) {
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ this.get_Pile_Selected ].X = Number( X );
        } 
    }
    set_Pile_Location_Y ( Y = 0){
        if ( this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ this.get_Pile_Selected ] ) {
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ this.get_Pile_Selected ].Y = Number( Y );
        } 
    }
    set_Pile_Location_angle ( angle = 0 ){
        if ( this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ this.get_Pile_Selected ] ) {
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ this.get_Pile_Selected ].angle = Number( angle );
        } 
    }
    get get_Pile_Location_X (){
        let x = 0;
        if ( this.PileFound > 0 ) {
            x = this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ this.get_Pile_Selected ].X;
        } 
        return ( x );
    }
    get get_Pile_Location_Y (){
        let y = 0;
        if ( this.PileFound > 0 ) {
            y = this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ this.get_Pile_Selected ].Y;
        } 
        return ( y );
    }
    get get_Pile_Location_angle (){
        let angle = 0;
        if ( this.PileFound > 0 ) {
            angle = this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ this.get_Pile_Selected ].angle;
        } 
        return ( angle );
    }
    set_Pile_Height ( Height = 0 ){
        if ( this.PileFound > 0 ) {
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ this.get_Pile_Selected ].Height = Number( Height );
        } 
    }
    get get_Pile_Height (){
        let Height = 0;
        if ( this.PileFound > 0 ) {
            Height = this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ this.get_Pile_Selected ].Height;
        } 
        return Height;
    }
    set_Pile_underBase_Height ( underBase_Height = 0 ){
        if ( this.PileFound ) {
            if ( underBase_Height < 0 ) underBase_Height = 0;
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ this.get_Pile_Selected ].underBase_Height = Number( underBase_Height );
        } 
    }
    get get_Pile_underBase_Height (){
        let underBase_Height = 0; 
        if ( this.PileFound > 0 ) {
            underBase_Height = this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ this.get_Pile_Selected ].underBase_Height;
        } 
        if ( underBase_Height < 0 ) {
            underBase_Height = 0;
            this.set_Pile_underBase_Height( underBase_Height );
        }

        return underBase_Height;
    }
    setPile_TopContur ( index, Top_length, Top_width, Tension_Volume ){
        if ( this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ] ) {
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].Top.length = Number( Top_length );
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].Top.width = Number( Top_width );
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].Tension_Volume = Number( Tension_Volume );
        } 
    }
    set_Pile_Top_lengt ( Top_length ){
        if ( this.PileFound > 0 ) {
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ this.get_Pile_Selected ].Top.length = Number( Top_length );
        } 
    }
    get get_Pile_Top_lengt (){
        let Top_length = 0;
        if ( this.PileFound > 0 ) {
            Top_length = this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ this.get_Pile_Selected ].Top.length;
        } 
        return Top_length;
    }
    set_Pile_Top_width ( Top_width ){
        if ( this.PileFound > 0 ) {
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ this.get_Pile_Selected ].Top.width = Number( Top_width );
        } 
    }
    get get_Pile_Top_width (){
        let Top_width = 0;
        if ( this.PileFound > 0 ) {
            Top_width = this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ this.get_Pile_Selected ].Top.width;
        } 
        return Top_width;
    }
    set_Pile_Top_Tension ( Tension_Volume = 0 ){
        if ( this.PileFound > 0 ) {
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ this.get_Pile_Selected ].Tension_Volume = Number( Tension_Volume );
        } 
    }
    get get_Pile_Top_Tension (){
        let Tension_Volume = 0;
        if ( this.PileFound > 0 ) {
            Tension_Volume = this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ this.get_Pile_Selected ].Tension_Volume;
        } 
        return Tension_Volume;
    }
    setPile_BaseContur ( index, Base_length, Base_width, Tension_Base ){
        if ( this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ] ) {
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].Base.length = Number( Base_length );
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].Base.width = Number( Base_width );
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].Tension_Base = Number( Tension_Base );
        } 
    }
    set_Pile_Base_length ( Base_length = 0 ){
        if ( this.PileFound > 0) {
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ this.get_Pile_Selected ].Base.length = Number( Base_length );
        } 
    }
    get get_Pile_Base_length (){
        let Base_length = 0;
        if ( this.PileFound > 0 ) {
            Base_length = this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ this.get_Pile_Selected ].Base.length;
        } 
        return Base_length;
    }
    set_Pile_Base_width ( Base_width = 0 ){
        if ( this.PileFound > 0 ) {
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ this.get_Pile_Selected ].Base.width = Number( Base_width );
        } 
    }
    get get_Pile_Base_width (){
        let Base_width = 0;
        if ( this.PileFound > 0 ) {
            Base_width = this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ this.get_Pile_Selected ].Base.width;
        } 
        return Base_width;
    }
    set_Pile_Base_Tension ( Tension_Base = 0 ){
        if ( this.PileFound > 0 ) {
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ this.get_Pile_Selected ].Tension_Base = Number( Tension_Base );
        } 
    }
    get get_Pile_Base_Tension (){
        let Tension_Base = 0;
        if ( this.PileFound > 0 ) {
            Tension_Base = this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ this.get_Pile_Selected ].Tension_Base;
        } 
        return Tension_Base;
    }
    setAngleView( index, angle_X, angle_Y, angle_Z ){
        if ( this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ] ) {
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].angle_X = angle_X;
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].angle_Y = angle_Y;
            this.Elevators[this.Selected].Warehouse[this.WarehouseSelected].Pile[ index ].angle_Z = angle_Z;
        };
    }
    get Piles_List(){
        let List = [];
        if ( this.FloorFound > 0) {
            //let List = [];
            let ii = this.Elevators[this.Selected].Warehouse[ this.WarehouseSelected ].Pile.length;
            let data;
            if (ii > 0 ) {    
                for( let i =0 ; i < ii ; i++){
                    data = this.Elevators[this.Selected].Warehouse[ this.WarehouseSelected ].Pile[ i ].Name;
                    List.push( data );
                }
            }};
        return List;
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
            if ( this.Elevators[this.ElevatorSelected].Complex ) {
                if ( this.Elevators[this.ElevatorSelected].Complex.length > 0 ) { 
                        if ( this.ComplexSelected > this.Elevators[this.ElevatorSelected].Complex.length - 1 ) 
                            this.SetComplexSelected = this.Elevators[this.ElevatorSelected].Complex.length -1
                            return this.Elevators[this.ElevatorSelected].Complex.length;
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
        if ( this.Elevators != undefined )
        if ( this.Elevators.length > 0 ) return this.Elevators.length
            else return 0
    }
    get ElevatorsName(){
        if ( this.ElevatorsFound > 0) return this.Elevators[this.ElevatorSelected].Name
        else return ''
    }
    get ElevatorsDate(){
        if ( this.ElevatorsFound > 0) return this.Elevators[this.ElevatorSelected].Date
        else return ''
    }
    set setName(data){ this.Elevators[this.Selected].Name = data }
    set setDate(data){ if ( this.ElevatorsFound ) this.Elevators[this.Selected].Date = data }
    get ElevatorAdress(){
        if ( this.ElevatorsFound > 0) return this.Elevators[this.ElevatorSelected].Adress
        else return ''
    }
    set setAdress(data) { if ( this.ElevatorsFound > 0) this.Elevators[this.Selected].Adress = data }
    get ElevatorOwner(){
        if ( this.ElevatorsFound > 0) return this.Elevators[this.ElevatorSelected].Owner
        else return ''
    }
    set setOwner(data) { if ( this.ElevatorsFound > 0) this.Elevators[this.Selected].Owner = data }
    get ElevatorClient(){
        if ( this.ElevatorsFound > 0) return this.Elevators[this.ElevatorSelected].Client
        else return ''
    }
    set setClient(data) { if ( this.ElevatorsFound > 0) this.Elevators[this.Selected].Client = data }
    get ElevatorContactName(){
        if ( this.ElevatorsFound > 0) return this.Elevators[this.ElevatorSelected].ContactName
        else return ''
    }
    set setContactName(data) { if ( this.ElevatorsFound > 0) this.Elevators[this.Selected].ContactName = data }
    get ElevatorContactPosition(){
        if ( this.ElevatorsFound > 0 ) return this.Elevators[this.ElevatorSelected].ContactPosition
        else return ''
    }
    set setContactPosition(data) { if ( this.ElevatorsFound > 0 ) this.Elevators[this.Selected].ContactPosition = data }
    get ElevatorContactPhone(){
        if ( this.ElevatorsFound > 0 ) return this.Elevators[this.ElevatorSelected].ContactPhone
        else return ''
    }
    set setContactPhone(data) { if ( this.ElevatorsFound > 0  ) this.Elevators[this.Selected].ContactPhone = data }
    get ElevatorInspectorName(){
        if ( this.ElevatorsFound > 0 ) return this.Elevators[this.ElevatorSelected].InspectorName
        else return ''
    }
    set setInspectorName(data) { if ( this.ElevatorsFound  > 0 ) this.Elevators[this.Selected].InspectorName = data }
    get ElevatorComments(){
        if ( this.ElevatorsFound > 0 ) return this.Elevators[this.ElevatorSelected].Comments
        else return ''
    }
    set setComments(data) { if ( this.ElevatorsFound  > 0 ) this.Elevators[this.Selected].Comments = data }
    set setElevators(data){
        if ( data != undefined ) { 
            this.State = 'open';
            this.Elevators = data.Elevators;

            if ( this.ElevatorsFound > data.Selected ) this.Selected = data.Selected
            else this.Selected = 0;

            if ( this.ComplexFound > data.ComplexSelected ) this.ComplexSelected = data.ComplexSelected
            else this.ComplexSelected = 0;

            if ( this.SiloFound > data.SiloSelected ) this.SiloSelected = data.SiloSelected
            else this.SiloSelected = 0;

            if ( this.FloorFound > data.WarehouseSelected ) this.WarehouseSelected = data.WarehouseSelected
            else this.WarehouseSelected = 0;

            this.ComplexSiloSelected = data.ComplexSiloSelected;


        } else this.State = 'closed';
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

        if ( this.ElevatorsFound > 0 ) {
            let ii = this.Elevators.length;
            let data;
            if (ii > 0 ) {    
                for( let i =0 ; i < ii ; i++){
                    data = this.Elevators[i].id + this.Elevators[i].Name + ' - ' + this.Elevators[i].Date;
                    List.push( data );
                }
            }
        }

        return( List );
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

    //------------------------------------------------------------------------
    get_Volume_Piles( Warehouse_Index, step_mesh = 50 ){

        let time1 = new Date().getTime(); //time control

        step_mesh = Math.trunc( step_mesh / 2 ) * 2;
        let z = [];
        let _z = [ 0, 0, 0 ];
        let mesh = [];
        let mesh_3D = [];
        let volume = 0;
        let weight = 0;
        let Length = 0;
        let Width = 0;
        let dx_X = 0;
        let dx_Y = 0;
        let angle = 0;
        let step_xy = step_mesh;

        let count_strip = 0; // quantity items in strip
        let index_strip = 0; // index in array start current strip
        let strip = []; // strip info
        let strip_triger = false;

        let floor = this.get_FloorByIndex( Warehouse_Index );

        if ( floor != 0 && floor != -1  ){
            Length = floor.Dimensions.Length;
            Width = floor.Dimensions.Width;

            let pile = new cPile;
            let Pile_H = 0
            let max = 0;
            let step = 10;
            let gPile = new cgPile();

            let numOfSegments = 10;
            let count = ( numOfSegments + 1 ) * 16;
            
            let slices = [];
            let slice = [];

            let xy_gab = { x_min: 0, x_max: 0, y_min: 0, y_max: 0 };
            let _xy_gab = xy_gab;

            let x1 = 0; let y1 = 0; let z1=0;
            let x2 = 0; let y2 = 0; let z2=0;
            let x3 = 0; let y3 = 0; let z3=0;
            let x4 = 0; let y4 = 0; let z4=0;
            //let slice_above = [];
            //let slice_over = [];

            //let matrix_move = [];

pile_slicing: for ( let index = 0; index < floor.Pile.length; index++ ){ //Pile slicing
            //for ( let index = 0; index < 1; index++ ){ //Pile slicing
                pile = Elevators.PileGet( index );
                gPile.set_Initial_Data_Complex ( pile, numOfSegments );//initialisation Pile
                Pile_H = pile.Height;
                dx_X = pile.X;
                dx_Y = pile.Y;
                angle = pile.angle;
                let box = pile.underBase_Height;

                if ( Pile_H > 0 ) { max = get_Max_Y_3D( gPile.get_Contur_Arc_Length ) - 0.0001;
                } else max = 0;

                slices.push([]);
                let _slice = [];

                if ( Pile_H > 0  ) {
                    for ( let i = 0; i <= step; i++ ){ 
                        slice = gPile.get_Slice_Base( max / step * i );

                        //slice_above = matrix.RotateMatrix_Z_any( gPile.get_Slice_Base( max / step * i ), angle, 3 );
                        //slice_over = matrix.RotateMatrix_Z_any( gPile.get_Slice_Base( max / step * ( i + 1) ), angle, 3 );
                        //matrix_move = matrix.MoveMatrixAny( matrix.RotateMatrix_Z_any( slice, angle, 3 ), dx_X, dx_Y, 0 );
                        //console.log('matrix_move = ',matrix_move);
                        //slices[index] = slices[index].concat( matrix.MoveMatrixAny( matrix.RotateMatrix_Z_any( slice, angle, 3 ), dx_X, dx_Y, box ) );
                        _slice = matrix.MoveMatrixAny( matrix.RotateMatrix_Z_any( slice, angle, 3 ), dx_X, dx_Y, box );
                        for ( let s = 0; s < _slice.length; s++ ) {
                            slices[index].push( _slice[ s ] );
                        }
                        //slices[index].push( matrix_move[ 0 ], matrix_move[ 1 ], matrix_move[ 2 ], matrix_move[ 3 ] );
                        //Array.prototype.push.apply(slices[index], matrix.MoveMatrixAny( matrix.RotateMatrix_Z_any( slice, angle, 3 ), dx_X, dx_Y, 0 ));
                    }
                } else {
                    slice = gPile.get_Slice_Base( 0 );
                    _slice = matrix.MoveMatrixAny( matrix.RotateMatrix_Z_any( slice, angle, 3 ), dx_X, dx_Y, box );
                    for ( let s = 0; s < _slice.length; s++ ) {
                        slices[index].push( _slice[ s ] );
                    }
                }

                xy_gab = Spline.get_Max_Gabarit_ver2( slices[ index ], count );
                xy_gab.box = box;
                //slices[index] = slices[index].concat( xy_gab );
                slices[index].push( xy_gab );
            }//Pile slicing
            //console.log('slices = ',slices);


            let dx = Length / step_xy;
            let dy = Width / step_xy;
            
            let x_start = 0;
            let x_end = step_xy;
            let y_start = 0;
            let y_end = step_xy;
            
            coord_X: for ( let x = x_start; x <= x_end; x++ ) {

                strip.push({ start: 0, count: 0 });
                strip_triger  = false;
                strip[ strip.length - 1 ].count = y_end;

                coord_Y: for ( let y = y_start; y <= y_end; y++ ) {

                    z = [ x*dx, y*dy, 0 ];
                    _z = z.slice(0);

                    //strip[ strip.length - 1 ].count = y;

                    pile: for ( let index = 0; index < slices.length; index++ ){

                        let slice_Index = slices[index];

                        _xy_gab = slice_Index[ slice_Index.length -1 ];

                        // check X position for each Pile
                        if ( _xy_gab.x_min <= ( x * dx ) && ( x * dx ) <= _xy_gab.x_max ) {
                            // check Y position for each Pile
                            if ( _xy_gab.y_min <= ( y * dy ) && ( y * dy ) <= _xy_gab.y_max ) {

                                let h = Elevators.PileGet( index ).Height;
                                if ( h > 0 ) { // if Pile Hat -  true
                                slises: for ( let i = 0; i < step; i++ ){

                                    let count_i = count * i;
                                    let count_j = 0;

                                    segments: for ( let j = 0; j < count - 1 - 4; j+=4 ){
                                        count_j = count + j;

                                        x1 = slice_Index[ count_i + j ];
                                        y1 = slice_Index[ count_i + j + 1 ];
                                        z1 = slice_Index[ count_i + j + 2 ];

                                        x2 = slice_Index[ count_i + j + 4 ];
                                        y2 = slice_Index[ count_i + j + 5 ];
                                        z2 = slice_Index[ count_i + j + 6 ];

                                        x3 = slice_Index[ count_i + count_j ];
                                        y3 = slice_Index[ count_i + count_j + 1 ];
                                        z3 = slice_Index[ count_i + count_j + 2 ];

                                        x4 = slice_Index[ count_i + count_j + 4 ];
                                        y4 = slice_Index[ count_i + count_j + 5 ];
                                        z4 = slice_Index[ count_i + count_j + 6 ];

                                        let find_Point = { z: _z, finded: false };
                                        find_Point = Find_Point_inside_Triangle( x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4, x*dx, y*dy );
                                        
                                        if ( i == step-1 && !find_Point.finded ) {
                                            let x0 = slice_Index[ count_i + count ];
                                            let y0 = slice_Index[ count_i + count + 1 ];
                                            let z0 = slice_Index[ count_i + count + 2 ];
                                            find_Point = Find_Point_inside_Triangle_v2( x0, y0, z0, x3, y3, z3, x4, y4, z4, x*dx, y*dy );
                                            /*
                                            console.log('1 = ',x1,y1,z1);
                                            console.log('2 = ',x2,y2,z2);
                                            console.log('3 = ',x3,y3,z3);
                                            console.log('4 = ',x4,y4,z4);
                                            console.log('dx, dy = ',x*dx,y*dy);
                                            console.log('find_Point = ',find_Point);*/
                                        }

                                        if ( find_Point.finded ) {

                                            _z = find_Point.z;

                                            if ( _z[ 2 ] > z[ 2 ] ) { z = _z.slice(0); }
/*
                                            if ( _xy_gab.box > 0 ) {
                                                if ( !strip_triger ) {
                                                    strip_triger = true;
                                                    strip[ strip.length -1 ].count += 1;
                                                    mesh.push( z[ 0 ], z[ 1 ], z[ 2 ], 1 );
                                                } 
                                                else {
                                                    if ( _z[ 2 ] == 0 ) {
                                                        strip_triger = false;
                                                        strip[ strip.length -1 ].count += 1 ;
                                                        mesh.push( z[ 0 ], z[ 1 ], z[ 2 ], 1 );
                                                    }
                                                }
                                            }*/
                                            break slises;
                                        } 
                                    } //segments
                                } //slises
                                } else { //if Pile = plate
                                    //slises: for ( let i = 0; i < step; i++ ){
                                        //let  i = 0; 

                                    let count_a = 0;
                                    let count_b = 0;

                                    let x0 = slice_Index[ 0 ];
                                    let y0 = slice_Index[ 1 ];
                                    let z0 = slice_Index[ 2 ];
                                    
                                    //console.log('slice_Index = ',slice_Index);

                                    plate_segments: for ( let i = 0; i < count - 1; i+=4 ){
                                            count_a = i + 4;
                                            count_b = i + 8;
    
                                            x1 = slice_Index[ count_a ];
                                            y1 = slice_Index[ count_a + 1 ];
                                            z1 = slice_Index[ count_a + 2 ];
    
                                            x2 = slice_Index[ count_b + 4 ];
                                            y2 = slice_Index[ count_b + 5 ];
                                            z2 = slice_Index[ count_b + 6 ];
    
                                            //x3 = slice_Index[ count_i + count_j ];
                                            //y3 = slice_Index[ count_i + count_j + 1 ];
                                            //z3 = slice_Index[ count_i + count_j + 2 ];
    
                                            //x4 = slice_Index[ count_i + count_j + 4 ];
                                            //y4 = slice_Index[ count_i + count_j + 5 ];
                                            //z4 = slice_Index[ count_i + count_j + 6 ];
    
                                            let find_Point = { z: _z, finded: false };
                                            find_Point = Find_Point_inside_Triangle_v2( x0, y0, z0, x1, y1, z1, x2, y2, z2, x*dx, y*dy );
                                            //if ( find_Point.finded ) console.log('find_Point = ',find_Point);
                                            if ( find_Point.finded ) {
    
                                                _z = find_Point.z;
    
                                                if ( _z[ 2 ] > z[ 2 ] ) { z = _z.slice(0); }
    /*
                                                if ( _xy_gab.box > 0 ) {
                                                    if ( !strip_triger ) {
                                                        strip_triger = true;
                                                        strip[ strip.length -1 ].count += 1;
                                                        mesh.push( z[ 0 ], z[ 1 ], z[ 2 ], 1 );
                                                    } 
                                                    else {
                                                        if ( _z[ 2 ] == 0 ) {
                                                            strip_triger = false;
                                                            strip[ strip.length -1 ].count += 1 ;
                                                            mesh.push( z[ 0 ], z[ 1 ], z[ 2 ], 1 );
                                                        }
                                                    }
                                                }*/
                                                break plate_segments;
                                            } 
    
                                    } //plate segments
                                    //} //slises
                                }
                            }

                        }
                        //if ( _z[ 2 ] > z[ 2 ] ) { z = _z.slice(0); }
                        //console.log('_z = ', _z );
                    } // pile
                    //mesh = mesh.concat( z, [ 1 ] );
                    mesh.push( z[ 0 ], z[ 1 ], z[ 2 ], 1 );

                }// coord_Y
                strip_triger = false;
            }// coord_X
            
            let n = 0;
            let m = 0;
            //console.log('mesh = ',mesh);
            for ( let j = 0; j < step_mesh; j++ ) {
                n = j * ( step_mesh + 1 ) * 4 ;
                m = ( j + 1 ) * ( step_mesh + 1 ) * 4;  
                //mesh_3D = mesh_3D.concat ( mesh.slice( n , n + 4 ) ); 

                mesh_3D.push( mesh[ n ], mesh[ n + 1 ], mesh[ n + 2 ], mesh[ n + 3 ] );

                let m_i = 0;
                let n_i = 0;
                let m_step = 0;

                for ( let i = 0; i <= step_mesh * 4; i+=4 ){
                    m_i = m + i;
                    n_i = n + i;
                    m_step = m + step_mesh * 4;
                    //mesh_3D = mesh_3D.concat ( mesh.slice( n + i, n + i + 4 ), mesh.slice( n + i + 4, n + i + 4 + 4 ), mesh.slice( m + i, m + i + 4  ) );
                    //mesh_3D = mesh_3D.concat ( mesh.slice( m + i, m + i + 4 ), mesh.slice( n + i + 4, n + i + 4 + 4 ) );
                    
                    //mesh_3D.push( mesh[ m_i ], mesh[ m_i +1 ], mesh[ m_i +2 ], mesh[ m_i +3 ], mesh[ n_i + 4 ], mesh[ n_i + 5 ], mesh[ n_i + 6 ], mesh[ n_i + 7 ] );
                    
                    let x1 = mesh[ n_i ];
                    let y1 = mesh[ n_i + 1 ];
                    let z1 = mesh[ n_i + 2 ];

                    let x2 = mesh[ m_i ];
                    let y2 = mesh[ m_i + 1 ];
                    let z2 = mesh[ m_i + 2 ];

                    let x3 = mesh[ n_i + 4 ];
                    let y3 = mesh[ n_i + 5 ];
                    let z3 = mesh[ n_i + 6 ];

                    mesh_3D.push( x2, y2, z2, mesh[ m_i +3 ], x3, y3, z3, mesh[ n_i + 7 ] );

                    volume += Calc.Volume_Pillers( x1,y1,z1, x2,y2,z2, x3,y3,z3, x3,y3,z3, 0 );
                    }

                //mesh_3D = mesh_3D.concat ( mesh.slice( m + step_mesh * 4 + 4, m + step_mesh * 4 + 4 + 4 ) );
                mesh_3D.push( mesh[ m_step + 4 ], mesh[ m_step + 5 ], mesh[ m_step + 6 ], mesh[ m_step + 7 ] );
            }
            volume = Calc.MyRound( volume * 2, 3 );
            if ( Elevators.get_Floor_CargoTW > 100 ) {
                weight = Calc.MyRound( volume * Elevators.get_Floor_CargoTW / 1000, 3 );
            } else weight = Calc.MyRound( volume * Elevators.get_Floor_CargoTW / 100, 3 );
            //console.log('get_Floor_CargoTW = ',Elevators.get_Floor_CargoTW);
            //console.log('mesh_3D = ',mesh_3D);
            //console.log('strip = ',strip);
            //console.log('volume = ',volume);
        }//if

        let time2 = new Date().getTime(); // time control
        console.log('get_Volume_Piles_v2 - (time working) = ', time2 - time1, ' ms');
        
        return { mesh, mesh_3D, strip, volume, weight };
    };//get_Volume_Piles

};

export let Elevators = new cElevators();

//-------------------------------------------------------------------------------------

function Find_Point_inside_Triangle( x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4, x_dx, y_dx ){
/*
    x1 = Calc.MyRound( x1, 3 );
    y1 = Calc.MyRound( y1, 3 );
    z1 = Calc.MyRound( z1, 3 );
    x2 = Calc.MyRound( x2, 3 );
    y2 = Calc.MyRound( y2, 3 );
    z2 = Calc.MyRound( z2, 3 );
    x3 = Calc.MyRound( x3, 3 );
    y3 = Calc.MyRound( y3, 3 );
    z3 = Calc.MyRound( z3, 3 );
    x4 = Calc.MyRound( x4, 3 );
    y4 = Calc.MyRound( y4, 3 );
    z4 = Calc.MyRound( z4, 3 );
*/
    let find_Point = { z: 0, finded: false };

    if ( Calc.Point_inside_Triangle( x1, y1, x2, y2, x4, y4, x_dx, y_dx )  ) {
        find_Point.z = Calc.rayPlaneIntersection(  [ x1, y1, z1 ], [ x2, y2, z2 ], [ x4, y4, z4 ], [ x_dx, y_dx, 0 ], [ 0, 0, 1 ] );
        find_Point.finded = true;
    }

    if ( Calc.Point_inside_Triangle( x1, y1, x4, y4, x2, y2, x_dx, y_dx )  ) {
        find_Point.z = Calc.rayPlaneIntersection(  [ x1, y1, z1 ], [ x4, y4, z4 ], [ x2, y2, z2 ], [ x_dx, y_dx, 0 ], [ 0, 0, 1 ] );
        find_Point.finded = true;
    }

    if ( Calc.Point_inside_Triangle( x1, y1, x3, y3, x4, y4, x_dx, y_dx ) ) {
        find_Point.z = Calc.rayPlaneIntersection(  [ x1, y1, z1 ], [ x3, y3, z3 ], [ x4, y4, z4 ], [ x_dx, y_dx, 0 ], [ 0, 0, 1 ] );
        find_Point.finded = true;
    }

    if ( Calc.Point_inside_Triangle( x1, y1, x4, y4, x3, y3, x_dx, y_dx ) ) {
        find_Point.z = Calc.rayPlaneIntersection(  [ x1, y1, z1 ], [ x4, y4, z4 ], [ x3, y3, z3 ], [ x_dx, y_dx, 0 ], [ 0, 0, 1 ] );
        find_Point.finded = true;
    }

    return ( find_Point );
}

function Find_Point_inside_Triangle_v2( x1, y1, z1, x2, y2, z2, x3, y3, z3, x_dx, y_dx ){

    let find_Point = { z: 0, finded: false };

    if ( Calc.Point_inside_Triangle( x1, y1, x2, y2, x3, y3, x_dx, y_dx )  ) {
        find_Point.z = Calc.rayPlaneIntersection(  [ x1, y1, z1 ], [ x2, y2, z2 ], [ x3, y3, z3 ], [ x_dx, y_dx, 0 ], [ 0, 0, 1 ] );
        find_Point.finded = true;
    }

    if ( Calc.Point_inside_Triangle( x1, y1, x3, y3, x2, y2, x_dx, y_dx )  ) {
        find_Point.z = Calc.rayPlaneIntersection(  [ x1, y1, z1 ], [ x3, y3, z3 ], [ x2, y2, z2 ], [ x_dx, y_dx, 0 ], [ 0, 0, 1 ] );
        find_Point.finded = true;
    }
/*
    if ( Calc.Point_inside_Triangle( x1, y1, x4, y4, x2, y2, x_dx, y_dx )  ) {
        find_Point.z = Calc.rayPlaneIntersection(  [ x1, y1, z1 ], [ x4, y4, z4 ], [ x2, y2, z2 ], [ x_dx, y_dx, 0 ], [ 0, 0, 1 ] );
        find_Point.finded = true;
    }*/
/*
    if ( Calc.Point_inside_Triangle( x1, y1, x3, y3, x4, y4, x_dx, y_dx ) ) {
        find_Point.z = Calc.rayPlaneIntersection(  [ x1, y1, z1 ], [ x3, y3, z3 ], [ x4, y4, z4 ], [ x_dx, y_dx, 0 ], [ 0, 0, 1 ] );
        find_Point.finded = true;
    }

    if ( Calc.Point_inside_Triangle( x1, y1, x4, y4, x3, y3, x_dx, y_dx ) ) {
        find_Point.z = Calc.rayPlaneIntersection(  [ x1, y1, z1 ], [ x3, y3, z3 ], [ x4, y4, z4 ], [ x_dx, y_dx, 0 ], [ 0, 0, 1 ] );
        find_Point.finded = true;
    }
*/
    return ( find_Point );
}