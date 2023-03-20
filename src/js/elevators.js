import * as Calc from './calc';

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
        this.Name        = 'NewSilo';
        this.Type        = ( 'star', 'square', 'circle' , '' );
        this.useArea     = true; // расчет по размерам или по площади
        this.Dimensions  = { Height: 25, Diameter: 3, Length: 3, Width: 3, Area: 0, Conus_height: 2.5 };
        this.Sound       = 25;
        this.Ullage      = 0;
        this.split      = []; //существует если силос разделен на части
        this.linked      = ''; //имя связанного силоса
        this.Cargo       = {Name: '', Natura: 1 };
        this.Using       = true; // используется или нет
        this.Comments    = '';
    };
};

class cSilo {
    constructor() {
        this.Name       = 'NewSilo';
        this.Dimensions = {Diameter: 0, h1: 0, h2: 0, Sound: 0 };
        this.Ullage     = 0;
        this.Cargo      = {Name: '', Natura: 1 };
        this.Comments   = ''
    }
};

class cPile {
    constructor() {
            this.id      = '';
            this.dx1 = 21.76;
            this.dy1 = 18.02;
            this.dh1 = 0.6;
            this.dx2 = 17.82;
            this.dy2 = 18.02;
            this.dh2 = 3.06;
            this.ux  = 11.03;
            this.uy  = 2.84
        }
    }

class cWarehouse {
    constructor() {
    this.id      = '';    
    this.Name        = '';
    this.Dimensions  = {Length: 0, Width: 0, Height: 0 };
    this.Pile        = [];
    this.Cargo       = {Name: '', Natura: 1 };
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
    get ComplexSiloFound(){
        if ( this.ElevatorsFound ) {
            if ( this.Elevators[this.Selected].ComplexSilo )
            if ( this.Elevators[this.Selected].ComplexSilo.length > 0 ) { 
                    if ( this.SiloSelected > this.Elevators[this.Selected].ComplexSilo.length - 1 ) 
                        this.SetSiloSelected = this.Elevators[this.Selected].ComplexSilo.length -1
                    return this.Elevators[this.Selected].ComplexSilo.length
                }
                else return 0;
            }
        else return 0;
    }
    set SetSiloSelected(data){ this.SiloSelected = data };
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
    get ComplexAll(){
        if ( this.ComplexFound > 0 ) return this.Elevators[this.Selected].Complex[this.ComplexSelected]
        else return null
    };
    set SetSiloName(data){ if ( this.SiloFound ) this.Elevators[this.Selected].Silo[this.SiloSelected].Name  = data }
    set SetComplexName(data){ if ( this.ComplexFound ) this.Elevators[this.Selected].Complex[this.ComplexSelected].Name  = data }
    get SiloCargo(){
        if ( this.SiloFound ) return this.Elevators[this.Selected].Silo[this.SiloSelected].Cargo
        else return ''
    };
    set SetSiloCargoName (data){ if ( this.SiloFound ) this.Elevators[this.Selected].Silo[this.SiloSelected].Cargo.Name  = data }
    set SetSiloCargoNatura (data ){ if ( this.SiloFound ) this.Elevators[this.Selected].Silo[this.SiloSelected].Cargo.Natura  = data }
    set SetSiloDimension_D (data ){ if ( this.SiloFound ) this.Elevators[this.Selected].Silo[this.SiloSelected].Dimensions.Diameter  = data }
    set SetSiloDimension_h1 (data ){ if ( this.SiloFound ) this.Elevators[this.Selected].Silo[this.SiloSelected].Dimensions.h1  = data }
    set SetSiloDimension_h2 (data ){ if ( this.SiloFound ) this.Elevators[this.Selected].Silo[this.SiloSelected].Dimensions.h2  = data }
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
            let sound   = Number( this.SiloDimension.Sound );
            let ullage  = Number( this.SiloUllage );
            let v1 = 0, v2 = 0;
            if ( ( sound - ullage ) <= h1 ) {
                v1 = 3.14 * Math.pow ( r1, 2 ) * ( sound - ullage )
            }
            if ( ( sound - ullage ) > h1  ) {
                v1 = 3.14 * Math.pow ( r1, 2 ) * h1
                r2 = r1  * ( h2 -  ( sound - ullage - h1 ) ) / h2;
                v2 = 1 / 3  * 3.14 * ( sound  - ullage  - h1 ) * ( Math.pow( r1, 2) + r1 * r2 + Math.pow( r2, 2 ) );
            }
            v = v1 + v2;
            v = Calc.MyRound( v, 3 );
        }
        return Number( v );
    }
    get SiloMass(){
        let m = 0;
        if ( this.SiloFound ) { m = this.SiloVolume * Number( this.SiloCargo.Natura ) / 1000 };
        m = Calc.MyRound( m, 3 );
        return Number( m );
    }
    get SiloList(){
        if ( this.SiloFound) {
            let List = [];
            let ii = this.Elevators[this.Selected].Silo.length;
            let data;
            if (ii > 0 ) {    
                for( let i =0 ; i < ii ; i++){
                    data = this.Elevators[this.Selected].Silo[i].Name;
                    List.push( data );
                }
            }
            return(
                List
            )}
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
    get ComplexSiloFound(){
        console.log('ComplexFound=', this.ComplexFound);
        if ( this.ComplexFound > 0 ) {
            if ( this.Elevators[this.Selected].Complex[this.ComplexSelected].Silo ) {
                console.log('Silo=', this.Elevators[this.Selected].Complex[this.ComplexSelected].Silo);
                if ( this.Elevators[this.Selected].Complex[this.ComplexSelected].Silo.length > 0 ) {
                    console.log('length=', this.Elevators[this.Selected].Complex[this.ComplexSelected].Silo.length );
                    if ( this.ComplexSiloSelected > this.Elevators[this.Selected].Complex[this.ComplexSiloSelected].Silo.length - 1 ) 
                        this.SetComplexSiloSelected = this.Elevators[this.Selected].Complex[this.ComplexSiloSelected].Silo.length - 1
                        return this.Elevators[this.Selected].Complex[this.ComplexSiloSelected].Silo.length;
                    } else return 0;    
            } else return -1;
            }
        else return -2;
    };
    ComplexAdd(){
        if ( this.ElevatorsFound > 0 ) {
            if ( this.ComplexFound == -1 ) ( this.Elevators[this.Selected].Complex = [] );
            if ( this.ComplexFound >= 0 ) {
                this.Elevators[this.Selected].Complex.push(new cComplex());
                this.State = 'Complex added';
            console.log('Complex Addded=', this.Elevators[this.Selected].Complex);
            }
        } else alert ('Error adding complex !')
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
    ComplexSiloAdd( Quantyti, Type, Length, Width, Diameter ){
        console.log('Complex Selected=', this.ComplexSelected);
        console.log('Complex Silo Selected=', this.ComplexSiloSelected);
        if ( Quantyti >= 0 )
        if ( this.ComplexFound > 0 ) {
            if ( this.ComplexSiloFound == -1 ) ( this.Elevators[this.Selected].Complex[this.ComplexSelected].Silo = [] );
                if ( this.ComplexSiloFound >= 0 ) {
                    this.Elevators[this.Selected].Complex[this.ComplexSelected].Silo.push([]);
                    let row = this.Elevators[this.Selected].Complex[this.ComplexSelected].Silo.length - 1;
                    for ( let i = 0; i < Quantyti; i++ ) {
                        this.Elevators[this.Selected].Complex[this.ComplexSelected].Silo[ row ].push(new cComplexSilo());
                        this.Elevators[this.Selected].Complex[this.ComplexSelected].Silo[ row ][ i ].Type = Type;
                        if ( Type == 'square' ) {
                            this.Elevators[this.Selected].Complex[this.ComplexSelected].Silo[ row ][ i ].Dimensions.Length = Length;
                            this.Elevators[this.Selected].Complex[this.ComplexSelected].Silo[ row ][ i ].Dimensions.Width = Width;
                            this.Elevators[this.Selected].Complex[this.ComplexSelected].Silo[ row ][ i ].Dimensions.Diameter = null;
                        } else {
                                this.Elevators[this.Selected].Complex[this.ComplexSelected].Silo[ row ][ i ].Dimensions.Length = null;
                                this.Elevators[this.Selected].Complex[this.ComplexSelected].Silo[ row ][ i ].Dimensions.Width = null;
                                this.Elevators[this.Selected].Complex[this.ComplexSelected].Silo[ row ][ i ].Dimensions.Diameter = Diameter;
                            }   
                    }
                    this.State = 'Complex Silo added';
                    console.log('Silo added in Complex=', this.Elevators[this.Selected].Complex[this.ComplexSelected].Silo);
                } else alert ('Error adding silo in complex !')
        }
    };
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
            cargo.push( [ cargo_filter[i][0][1], m ] )
        }
        }
        return cargo;    
    }
};

export let Elevators = new cElevators();

