import { User } from './user';
import { Elevators } from './elevators';

class cElevatorOnline {
    constructor() {
        this.inspection = [];
        this.Comments   = '';
        this.ServerPath = 'http://localhost:3001/';
    }

    get get_ElevatorOnline_Info() {
        return ElevatorOnline;
    }

    get_Inspection_List( filter ){
        return new Promise ( (resolve, reject) => {
            //console.log(User.get_LoginStatus);
            if ( User.get_LoginStatus ) {

            fetch( this.ServerPath + "inspectioninfo" , { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json;charset=utf-8' },
                body: JSON.stringify(filter)
                }).then(response => response.json()).then((data) => {
                console.log('Inspection_List fetch= ',data);
                this.inspection = data;
                resolve (data);
                });
            } else resolve (null);
        })
    }
    get_Inspection_List_current(){
        console.log(this.inspection[0].id);
        return (this.inspection[0].id);
    }

    get_Elevator_List( filter ){
        return new Promise ( (resolve, reject) => {
            if ( User.get_LoginStatus ) {

            fetch( this.ServerPath + "elevatorinfo" , { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json;charset=utf-8' },
                body: JSON.stringify(filter)
                }).then(response => response.json()).then((data) => {
                console.log('Elevator_List fetch= ',data);
                resolve (data);
                });
            } else resolve (null);
        })
    }

    import_Elevator_Complex( complex_id ){
        let complex = {};
        return new Promise ( (resolve, reject) => {
            if ( User.get_LoginStatus ) {
            
                complex.id = complex_id;
                complex.data = JSON.stringify ( Elevators.Complex );

                console.log('Elevator_Complex = ',complex);

                if ( complex.data ) 
                fetch( this.ServerPath + "importcomplex" , { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json;charset=utf-8' },
                    body: JSON.stringify(complex)
                    }).then(response => response.json()).then((data) => {
                    console.log('import_Elevator_Complex = ',data);
                    resolve (data);
                    });
                else resolve (null);
            } else resolve (null);
        })
    }

    import_Elevator_Silo( silo_id ){
        let silo = {};
        return new Promise ( (resolve, reject) => {
            if ( User.get_LoginStatus ) {
            
                silo.id = silo_id;
                silo.data = JSON.stringify ( Elevators.Silo );
                console.log('Elevator_Silo = ',silo);

                if ( silo.data )
                fetch( this.ServerPath + "importsilo" , { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json;charset=utf-8' },
                    body: JSON.stringify(silo)
                    }).then(response => response.json()).then((data) => {
                    console.log('import_Elevator_Silo = ',data);
                    resolve (data);
                    });
                else resolve(null);
            } else resolve (null);
        })
    }

    import_Elevator_Warehouse( warehouse_id ){
        let warehouse = {};
        return new Promise ( (resolve, reject) => {
            if ( User.get_LoginStatus ) {
            
                warehouse.id = warehouse_id;
                warehouse.data = JSON.stringify ( Elevators.Warehouse );
                console.log('Elevator_Warehouse = ',warehouse);

                if ( warehouse.data )
                fetch( this.ServerPath + "importwarehouse" , { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json;charset=utf-8' },
                    body: JSON.stringify(warehouse)
                    }).then(response => response.json()).then((data) => {
                    console.log('import_Elevator_Warehouse = ',data);
                    resolve (data);
                    });
                else resolve(null);
            } else resolve (null);
        })
    }

    /**
     * @param {number} id Elevator
     */
    get_Elevator( id ){
        let data = {};
        data.id = id;
        return new Promise ( ( resolve, reject ) => {
            if ( User.get_LoginStatus ) {
                fetch( this.ServerPath + "elevatordata" , { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json;charset=utf-8' },
                    body: JSON.stringify(data)
                    }).then(response => response.json()).then((data) => {
                    console.log('Elevator_Data = ',data);
                    resolve (data);
                    });
            }
        })
    }

    get_Firm_List( filter ){
        return new Promise ( (resolve, reject) => {
            if ( User.get_LoginStatus ) {

            fetch( this.ServerPath + "firminfo" , { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json;charset=utf-8' },
                body: JSON.stringify(filter)
                }).then(response => response.json()).then((data) => {
                console.log('Firm_List fetch= ',data);
                resolve (data);
                });
            } else resolve (null);
        })
    }

    get_Person_List( filter ){
        return new Promise ( (resolve, reject) => {
            if ( User.get_LoginStatus ) {

            fetch( this.ServerPath + "personinfo" , { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json;charset=utf-8' },
                body: JSON.stringify(filter)
                }).then(response => response.json()).then((data) => {
                console.log('Person_List fetch= ',data);
                resolve (data);
                });
            } else resolve (null);
        })
    }

    new_Inspection_to_Server( inspection ){
        return new Promise ( (resolve, reject) => {
            if ( User.get_LoginStatus ) {

            fetch( this.ServerPath + "newinspection" , { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json;charset=utf-8' },
                body: JSON.stringify(inspection)
                }).then(response => response.json()).then((data) => {
                console.log('new_Inspection_to_Server = ',data);
                resolve (data);
                });
            } else resolve ('offline');
        })
    }

    del_Inspection_from_Server( id ){
        return new Promise ( (resolve, reject) => {
            if ( User.get_LoginStatus ) {

            fetch( this.ServerPath + "delinspection" , { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json;charset=utf-8' },
                body: JSON.stringify({ id: id })
                }).then(response => response.json()).then((data) => {
                console.log('del_Inspection_from_Server = ',data);
                resolve (data);
                });
            } else resolve ('offline');
        })
    }

    new_Elevator_to_Server( elevator ){
        return new Promise ( (resolve, reject) => {
            if ( User.get_LoginStatus ) {

            fetch( this.ServerPath + "newelevator" , { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json;charset=utf-8' },
                body: JSON.stringify(elevator)
                }).then(response => response.json()).then((data) => {
                console.log('new_Elevator_to_Server = ',data);
                //this.inspection = data;
                resolve (data);
                });
            } else resolve ('offline');
        })
    }
    del_Elevator_from_Server( id ){
        return new Promise ( (resolve, reject) => {
            if ( User.get_LoginStatus ) {

            fetch( this.ServerPath + "delelevator" , { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json;charset=utf-8' },
                body: JSON.stringify({ id: id })
                }).then(response => response.json()).then((data) => {
                console.log('del_Elevator_from_Server = ',data);
                //this.inspection = data;
                resolve (data);
                });
            } else resolve ('offline');
        })
    }
    /**
     * @param {object} elevator Elevator
     * @param {string} parameter what update on Server: all, simple, complex, silo, warehouse
     */
    update_Elevator_to_Server( elevator, parameter ){
        console.log('send update_Elevator_to_Server = ',elevator);
        return new Promise ( (resolve, reject) => {
            if ( User.get_LoginStatus ) {

            if ( parameter == undefined ) parameter = 'all';
            elevator.parameter = parameter;
            elevator.owner = Number ( elevator.owner );

            fetch( this.ServerPath + "updateelevator" , { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json;charset=utf-8' },
                body: JSON.stringify(elevator)
                }).then(response => response.json()).then((data) => {
                console.log('update_Elevator_to_Server = ',data);
                resolve (data);
                });
            } else resolve ('offline');
        })
    }
    new_Firm_to_Server( firm ){
        return new Promise ( (resolve, reject) => {
            if ( User.get_LoginStatus ) {

            fetch( this.ServerPath + "newfirm" , { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json;charset=utf-8' },
                body: JSON.stringify(firm)
                }).then(response => response.json()).then((data) => {
                console.log('new_Firm_to_Server = ',data);
                resolve (data);
                });
            } else resolve ('offline');
        })
    }
    del_Firm_from_Server( id ){
        return new Promise ( (resolve, reject) => {
            if ( User.get_LoginStatus ) {

            fetch( this.ServerPath + "delfirm" , { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json;charset=utf-8' },
                body: JSON.stringify({ id: id })
                }).then(response => response.json()).then((data) => {
                console.log('del_Firm_from_Server = ',data);
                resolve (data);
                });
            } else resolve ('offline');
        })
    }
    update_Firm_to_Server( firm ){
        console.log('send update_Firm_to_Server = ', firm );
        return new Promise ( (resolve, reject) => {
            if ( User.get_LoginStatus ) {

            fetch( this.ServerPath + "updatefirm" , { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json;charset=utf-8' },
                body: JSON.stringify(firm)
                }).then(response => response.json()).then((data) => {
                console.log('update_Firm_to_Server = ',data);
                resolve (data);
                });
            } else resolve ('offline');
        })
    }
    new_Person_to_Server( person ){
        return new Promise ( (resolve, reject) => {
            if ( User.get_LoginStatus ) {

            fetch( this.ServerPath + "newperson" , { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json;charset=utf-8' },
                body: JSON.stringify(person)
                }).then(response => response.json()).then((data) => {
                console.log('new_Person_to_Server = ',data);
                resolve (data);
                });
            } else resolve ('offline');
        })
    }
    del_Person_from_Server( id ){
        return new Promise ( (resolve, reject) => {
            if ( User.get_LoginStatus ) {

            fetch( this.ServerPath + "delPerson" , { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json;charset=utf-8' },
                body: JSON.stringify({ id: id })
                }).then(response => response.json()).then((data) => {
                console.log('del_Person_from_Server = ',data);
                resolve (data);
                });
            } else resolve ('offline');
        })
    }
    update_Person_to_Server( person ){
        console.log('send update_Person_to_Server = ', person );
        return new Promise ( (resolve, reject) => {
            if ( User.get_LoginStatus ) {

            fetch( this.ServerPath + "updateperson" , { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json;charset=utf-8' },
                body: JSON.stringify(person)
                }).then(response => response.json()).then((data) => {
                console.log('update_Person_to_Server = ',data);
                resolve (data);
                });
            } else resolve ('offline');
        })
    }
};

export let ElevatorOnline = new cElevatorOnline();