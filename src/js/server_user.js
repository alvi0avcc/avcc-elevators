import React from 'react';
import { useContext } from 'react';
import { UpdateContext } from '../Main'
//import {useEffect, useState} from "react";
import { Elevators } from './elevators.js';
//import * as iolocal from './iolocal';
import { User } from './user';
import { ElevatorOnline } from './elevatorOnline.js';
//import { useContext } from 'react';
//import { UpdateContext } from '../Main'
import { DateIsoToString, monthNames } from './date_utilites.js';
import { parseJsonText } from 'typescript';


function User_List_row( props ){
    let row = props.row;
    let item = props.item;
    let selected = props.selected;

    //let date = new Date( item.order_date );

    const [ elevator, setElevator ] = React.useState('');
    if ( item.elevator > 0 )
        ElevatorOnline.get_Elevator( item.elevator ).then( (resolve)=>{ setElevator( resolve[0].elevator_name ) } );

    const [ client, setClient] = React.useState('');
    if ( item.client > 0 )
        ElevatorOnline.get_Firm( item.client ).then( (resolve)=>{ setClient( resolve[0].name ) } );

    const [ inspector, setInspector] = React.useState('');
    if ( item.inspector > 0 )
        ElevatorOnline.get_Person( item.inspector ).then( (resolve)=>{ setInspector( resolve[0].name + ' ' + resolve[0].surname ) } );

    let status = '';
    if ( item.status == 0 || item.status == null )
        status = 'Pre ordered'
        else if ( item.status == 1 )
        status = 'Ordered'
        else if ( item.status == 2 )
        status = 'In progress'
        else if ( item.status == 3 )
        status = 'Competed'
        else if ( item.status == 4 )
        status = 'Canceled'

    let result = '';
    if ( item.result == 0 || item.result == null )
        //result = 'Not specified'
        result = ''
        else if ( item.result == 1 )
        result = 'Done'
        else if ( item.result == 2 )
        result = 'Satisfaction'
        else if ( item.result == 3 )
        result = 'Not satisfaction'
        else if ( item.result == 4 )
        result = 'Re-inspection'

    const handleClick = (e)=>{
        props.callback_id(item.id);
        props.callback_username(item.order_no);
        props.callback(row);
    }

    return (
        <tr 
            style={{ backgroundColor: ( selected == row ? 'lime' : '' )  }}
            onClick={handleClick}
        >
            <td style={{ fontSize: '50%' }}>{ item.id }</td>
            <td>{ item.username }</td>
            <td>{ item.password }</td>
            <td>{ item.name }</td>
            <td>{ item.surname }</td>
            <td>{ ( item.enabled == 1 ? 'active' : 'blocked' ) }</td>
            <td><input type='checkbox' readOnly checked={ ( item.inspection_create == 1 ? true : false ) }/></td>
            <td><input type='checkbox' readOnly checked={ ( item.inspection_edit == 1 ? true : false ) }/></td>
            <td><input type='checkbox' readOnly checked={ ( item.inspection_read == 1 ? true : false ) }/></td>
            <td><input type='checkbox' readOnly checked={ ( item.elevator_create == 1 ? true : false ) }/></td>
            <td><input type='checkbox' readOnly checked={ ( item.elevator_edit == 1 ? true : false ) }/></td>
            <td><input type='checkbox' readOnly checked={ ( item.elevator_read == 1 ? true : false ) }/></td>
            <td><input type='checkbox' readOnly checked={ ( item.firm_create == 1 ? true : false ) }/></td>
            <td><input type='checkbox' readOnly checked={ ( item.firm_edit == 1 ? true : false ) }/></td>
            <td><input type='checkbox' readOnly checked={ ( item.firm_read == 1 ? true : false ) }/></td>
            <td><input type='checkbox' readOnly checked={ ( item.person_create == 1 ? true : false ) }/></td>
            <td><input type='checkbox' readOnly checked={ ( item.person_edit == 1 ? true : false ) }/></td>
            <td><input type='checkbox' readOnly checked={ ( item.person_read == 1 ? true : false ) }/></td>
            <td><input type='checkbox' readOnly checked={ ( item.user_create == 1 ? true : false ) }/></td>
            <td><input type='checkbox' readOnly checked={ ( item.user_edit == 1 ? true : false ) }/></td>
            <td><input type='checkbox' readOnly checked={ ( item.user_read == 1 ? true : false ) }/></td>
            <td>{ item.comments }</td>
        </tr>
    )
}

export function User_List ( props ){
    const [update, setUpdate] = useContext(UpdateContext);

    let users = props.loaded;
    console.log('users = ',users);

    const [selected, setSelected] = React.useState(0);
    const [id, setId] = React.useState(0);
    const [username, setUsername] = React.useState('');

    const [firm, setFirm] = React.useState([]);
    const [inspector, setInspector] = React.useState([]);
    const [elevator, setElevator] = React.useState([]);

    //const [i_number, setI_number] = React.useState(inspections[0].order_no);
    //const handle_i_number = (e)=>{
    //    setI_number( e.target.value );
    //}

    //const [i_date, setI_date] = React.useState( DateIsoToString( new Date ( inspections[0].order_date ) ) );
    //const handle_i_date = (e)=>{
    //    setI_date( e.target.value );
    //}

    //const [i_time, setI_time] = React.useState(inspections[0].order_time);
    //const handle_i_time = (e)=>{
    //    setI_time( e.target.value );
    //}

    //const [i_inspector, setI_inspector] = React.useState(inspections[0].inspector);
    //const handle_i_inspector = (e)=>{
    //    setI_inspector( e.target.value );
    //}
/*
    function  inspectorPhone ( id ) {
        for ( let i = 0; i < inspector.length; i++ ) {
            if ( inspector[i].id == id ) return inspector[i].phone;
        }
        return ('');
    }
*/
    //const [i_order, setI_order] = React.useState(inspections[0].order);
    //const handle_i_order = (e)=>{
    //    setI_order( e.target.value );
    //}

    //const [i_comments, setI_comments] = React.useState(inspections[0].comments);
    //const handle_i_comments = (e)=>{
    //    setI_comments( e.target.value );
    //}

    //const [i_status, setI_status] = React.useState(inspections[0].status);
    //const handle_i_status = (e)=>{
    //    setI_status( e.target.value );
    //}

    //const [i_result, setI_result] = React.useState(inspections[0].result);
    //const handle_i_result = (e)=>{
    //    setI_result( e.target.value );
    //}

    const [e_firm, setE_firm] = React.useState();
    const handle_e_firm = (e)=>{
        setE_firm( e.target.value );
        if ( e.target.value == 0 )
            ElevatorOnline.get_Elevator_List( { filter: 'all', sorted: 'elevator_name' } ).then( (resolve)=>{ setElevator(resolve); console.log('get_Elevator_List = ',resolve); } )
        else
            ElevatorOnline.get_Elevator_List( { filter: 'owner', id: `${e.target.value}`, sorted: 'elevator_name' } ).then( (resolve)=>{ setElevator(resolve); console.log('get_Elevator_List = ',resolve); } );
        
    }

    //const [i_client, setI_client] = React.useState(inspections[0].client);
    //const handle_i_client = (e)=>{
    //    console.log('i_client=',e.target.value);
    //    setI_client( e.target.value );
    //}

    const [e_elevator, setE_elevator] = React.useState();
    const handle_e_elevator = (e)=>{
        setE_elevator( e.target.value );
        console.log('select elevator = ', e.target.value);
        console.log('elevator = ', elevator);
        adress: for ( let i = 0; i < elevator.length; i++ ) {
                    if ( elevator[i].id == e.target.value ) {
                        setE_adress( elevator[i].adress );
                        setE_comments( elevator[i].comments );
                        break adress;
                    }
                }

        ElevatorOnline.get_Person_List( { filter: 'all', list: 'elevator', id: `${e.target.value}`, sorted: 'position' } ).then( (resolve)=>{ setE_contact_person(resolve); console.log('get_Contact_List = ',resolve); } )

    }

    const [e_adress, setE_adress] = React.useState();

    //const [e_complex, setE_complex] = React.useState( elevators[0].complex ? 'found' : 'not found' );
    //const [e_silo, setE_silo] = React.useState( elevators[0].silo ? 'found' : 'not found' );
    //const [e_warehouse, setE_warehouse] = React.useState( elevators[0].warehouse ? 'found' : 'not found' );
    const [e_contact_person, setE_contact_person] = React.useState([]);

    const [e_comments, setE_comments] = React.useState();
    const handle_e_comments = (e)=>{
        setE_comments( e.target.value );
    }

    const [edit, setEdit] = React.useState(false);

    const new_Inspection = ()=>{
        let insp = {};
        insp.id = null;
        insp.order_no = null;
        //insp.order_date = new Date().toISOString().slice(0,-14);
        //let date = new Date().toISOString().slice(0, 10);
        //insp.order_date = date.getFullYear() + '-' + ( date.getMonth() + 1 ) + '-' + date.getDate();
       // insp.order_date = new Date().toISOString().slice(0, 10);
        insp.order_date = DateIsoToString( new Date() );
        insp.order_time = null;
        insp.elevator_name = null;

        insp.order_no = prompt("Order number of Inspection", 'new' );
        //console.log('date = ',date);
        console.log('insp = ',insp);
        if ( insp.order_no ) ElevatorOnline.new_Inspection_to_Server(insp);
    }

    const del_Inspection = ()=>{
        //if ( window.confirm('Delete User - '+ username +', with id = '+ id ) ) ElevatorOnline.del_Inspection_from_Server(id);
    }

    const edit_Inspection = ()=>{
        ElevatorOnline.get_Firm_List({filter: 'all', sorted: 'true'}).then( (resolve)=>{ setFirm(resolve); /*setI_client(resolve);*/ console.log('get_Firm_List = ',resolve); } );
        ElevatorOnline.get_Person_List( { filter: 'all', list: 'inspector', sorted: 'name' } ).then( (resolve)=>{ setInspector(resolve); console.log('get_Inspector_List = ',resolve); } );
       
        //let date = DateIsoToString( new Date ( inspections[selected].order_date ) );

        //console.log('selected inspection =',inspections[selected]);

        //if ( inspections[selected].order_no ) { setI_number( inspections[selected].order_no ) } else setI_number( '' );
        //if ( inspections[selected].order_date ) { setI_date( date ) } else setI_date( '' );
        //if ( inspections[selected].order_time) { setI_time( inspections[selected].order_time) } else setI_time( '' );
        //if ( inspections[selected].order) { setI_order( inspections[selected].order) } else setI_order( '' );
        /*if ( inspections[selected].elevator ) { 
                ElevatorOnline.get_Elevator( inspections[selected].elevator ).then( (resolve)=>{ 
                    setE_firm( resolve[0].owner );
                    ElevatorOnline.get_Elevator_List( { filter: 'owner', id: `${resolve[0].owner}`, sorted: 'elevator_name' } ).then( (resolve)=>{ 
                        setElevator(resolve);
                        setE_elevator( inspections[selected].elevator );
                        adress: for ( let i = 0; i < resolve.length; i++ ) {
                            if ( resolve[i].id == inspections[selected].elevator ) {
                                setE_adress( resolve[i].adress );
                                setE_comments( resolve[i].comments );
                                break adress;
                            }
                        }
                        ElevatorOnline.get_Person_List( { filter: 'all', list: 'elevator', id: `${inspections[selected].elevator}`, sorted: 'position' } ).then( (resolve)=>{ setE_contact_person(resolve); console.log('get_Contact_List = ',resolve); } )
                        console.log('get_Elevator_List = ',resolve);
                    } );
                    //console.log('inspections[selected].elevator = ',inspections[selected].elevator);
                 } );
            } else {
                setE_firm( 0 );
                ElevatorOnline.get_Elevator_List( { filter: 'all', sorted: 'elevator_name' } ).then( (resolve)=>{ setElevator(resolve); console.log('get_Elevator_List = ',resolve); } );
                setE_elevator( 0 );
                setE_adress( '' );
                setE_comments( '' );
                setE_contact_person( [] );
                }*/
        //if ( inspections[selected].client ) { setI_client( inspections[selected].client) } else setI_client( '' );
        //if ( inspections[selected].inspector ) { setI_inspector( inspections[selected].inspector) } else setI_inspector( '' );
        //if ( inspections[selected].status ) { setI_status( inspections[selected].status) } else setI_status( '' );
        //if ( inspections[selected].result ) { setI_result( inspections[selected].result) } else setI_result( '' );
        //if ( inspections[selected].comments ) { setI_comments( inspections[selected].comments) } else setI_comments( '' );

        //if ( inspections[selected].complex_found == 'true' ) { setElevator_complex_found( true ) } else setElevator_complex_found( false );
        //if ( inspections[selected].silo_found == 'true' ) { setElevator_silo_found( true ) } else setElevator_silo_found( false );
        //if ( inspections[selected].warehouse_found == 'true' ) { setElevator_warehouse_found( true ) } else setElevator_warehouse_found( false );

        setEdit(true);
    }

    const edit_Inspection_close = ()=>{
        setEdit(false);

        setElevator_complex(null);
        setElevator_silo(null);
        setElevator_warehouse(null);
/*
        if ( inspections[selected].order_no ) { setI_number( inspections[selected].order_no ) } else setI_number( '' );
        if ( inspections[selected].order_date ) { setI_date( inspections[selected].order_date) } else setI_date( '' );
        if ( inspections[selected].order_time) { setI_time( inspections[selected].order_time) } else setI_time( '' );
        if ( inspections[selected].order) { setI_order( inspections[selected].order) } else setI_order( '' );
        if ( inspections[selected].elevator ) { setE_elevator( inspections[selected].elevator) } else setE_elevator( '' );
        if ( inspections[selected].client ) { setI_client( inspections[selected].client) } else setI_client( '' );
        if ( inspections[selected].inspector ) { setI_inspector( inspections[selected].inspector) } else setI_inspector( '' );
        if ( inspections[selected].status ) { setI_status( inspections[selected].status) } else setI_status( '' );
        if ( inspections[selected].result ) { setI_result( inspections[selected].result) } else setI_result( '' );
        if ( inspections[selected].commments ) { setI_comments( inspections[selected].commments) } else setI_comments( '' );
        */
    }
    const edit_Inspection_apply = ()=>{
        /*
        inspections[selected].order_no = i_number;
        inspections[selected].order_date = i_date;
        inspections[selected].order_time = i_time;
        inspections[selected].order = i_order;
        inspections[selected].elevator = e_elevator;
        inspections[selected].client = i_client;
        inspections[selected].inspector = i_inspector;
        inspections[selected].status = i_status;
        inspections[selected].result = i_result;
        inspections[selected].comments = i_comments;
*/
        setEdit(false);
/*
        if ( elevator_complex && elevator_complex_use )
            inspections[selected].complex  = structuredClone( elevator_complex )
            else inspections[selected].complex = null;
        if ( elevator_silo && elevator_silo_use )
            inspections[selected].silo  = structuredClone( elevator_silo)
            else inspections[selected].silo = null;
         if ( elevator_warehouse && elevator_warehouse_use )
            inspections[selected].warehouse  = structuredClone( elevator_warehouse )
            else inspections[selected].warehouse = null;

        ElevatorOnline.update_Inspection_to_Server( inspections[selected] , 'full' );
        */
    }

    const selected_change = (sel)=>{
        setSelected( sel );
        console.log('selected inspection = ',users[sel] );
    }

    const handleOpenInpection = (e)=>{
        /*
        console.log('current inspection = ',inspections[selected].id );
        console.log('elevator inspection = ',inspections[selected].elevator );
        ElevatorOnline.get_Inspection( inspections[selected].id ).then( ( resolve ) => { 
            console.log( 'get_Inspection = ',resolve ); 
            Elevators.setInspectionFromServer =  resolve;
            //setSendServer( true );
            setUpdate( !update );
        } );
        */
    }

    //const [empty_elevator, setEmpty_elevator] = React.useState({});
    const [elevator_complex, setElevator_complex] = React.useState();
    const [elevator_silo, setElevator_silo] = React.useState();
    const [elevator_warehouse, setElevator_warehouse] = React.useState();
    const [elevator_complex_use, setElevator_complex_use] = React.useState(true);
    const [elevator_silo_use, setElevator_silo_use] = React.useState(true);
    const [elevator_warehouse_use, setElevator_warehouse_use] = React.useState(true);
    const [elevator_complex_found, setElevator_complex_found] = React.useState(false);
    const [elevator_silo_found, setElevator_silo_found] = React.useState(false);
    const [elevator_warehouse_found, setElevator_warehouse_found] = React.useState(false);

    const handle_complex_use = (e)=>{
        setElevator_complex_use( !elevator_complex_use );
    }

    const handle_silo_use = (e)=>{
        setElevator_silo_use( !elevator_silo_use );
    }

    const handle_warehouse_use = (e)=>{
        setElevator_warehouse_use( !elevator_warehouse_use);
    }

    const handle_load_elevator = ()=>{
        /*
        //setE_comments( e.target.value );
        console.log('current inspection = ',inspections[selected].id );
        //console.log('elevator inspection = ',inspections[selected].elevator );
        console.log('elevator inspection = ',e_elevator );
        ElevatorOnline.get_Elevator( e_elevator ).then( ( resolve ) => { 
            //Elevators.setElevatorsFromServer =  resolve;
            //console.log('elevator = ',resolve );
            setElevator_complex( JSON.parse( resolve[0].complex ) );
            setElevator_silo( JSON.parse( resolve[0].silo ) );
            setElevator_warehouse( JSON.parse( resolve[0].warehouse ) );
            console.log('elevator complex = ',elevator_complex );
            console.log('elevator silo = ',elevator_silo );
            console.log('elevator warehouse = ',elevator_warehouse );
            //setElevator_complex_use( ( elevator_complex ? true : false ) );
            //setSendServer( true );
            //setUpdate( !update );
        } );
        */
    }

    return(
        <div>

        <div style={{ height: 300, width: '100%', overflow: 'auto' }} >
            
            <table>

            <thead>
                <tr>
                    <th colSpan={6}></th>
                    <th colSpan={15}>Permissions</th>
                    <th></th>
                </tr>
                <tr>
                    <th>id</th>
                    <th>User Name</th>
                    <th>Password</th>
                    <th>Name</th>
                    <th>Surname</th>
                    <th>Status</th>
                    <th title='inspection create'>ic</th>
                    <th title='inspection edit'>ie</th>
                    <th title='inspection read'>ir</th>
                    <th title='elevator create'>ec</th>
                    <th title='elevator edit'>ee</th>
                    <th title='elevator read'>er</th>
                    <th title='firm create'>fc</th>
                    <th title='firm edit'>fe</th>
                    <th title='firm read'>fr</th>
                    <th title='person create'>pc</th>
                    <th title='person edit'>pe</th>
                    <th title='person read'>pr</th>
                    <th title='user create'>uc</th>
                    <th title='user edit'>ue</th>
                    <th title='user read'>ur</th>
                    <th>Comments</th>
                </tr>
            </thead>

                <tbody>

                { ( users ? users.map((item ,row) => ( <User_List_row item={item} row={row} selected={selected} callback={(data)=> selected_change( data ) } callback_id={(data)=> setId(data)} callback_username={(data)=> setUsername(data)} /> )) : <></> ) }

                </tbody>
            </table>
        </div>

            <button onClick={new_Inspection}>New</button>
            <button disabled>Clone</button>
            <button onClick={del_Inspection}>Delete</button>
            <button onClick={edit_Inspection}>View / Edit</button>

            <div
                className='block_row'
                style={{ justifyContent: 'space-around' }}
            >
                <button
                    style={{ width: '150px' }}
                    onClick={handleOpenInpection}
                    >Open from server</button>
                <button
                    //style={{ width: '150px', display: ( sendServer ? 'block' : 'none' ) }}
                    //onClick={handleSendServer}
                    >Send to server</button>
            </div>

            <div id="myModal" class="modal" style={{ display:  ( edit ? 'block' : 'none' )  }}>
                <div class="modal-content" style={{ width: '500px', overflow: 'auto' }}>
                    <div class="modal-header">
                        <span class="close" onClick={edit_Inspection_close}>&times;</span>
                        <span>Inspection information</span>
                    </div>

                    <div class="modal-body">
                        <div className='inputMenu'>
                            <label>Inspection №</label>
                            <input 
                                style={{ width: '300px' }}
                                //value={i_number}
                                //onChange={handle_i_number}
                                type="text" required minlength="3"
                            />
                        </div>
                        <div className='inputMenu'>
                            <label>Date</label>
                            <input 
                            style={{ width: '303px' }}
                            //value={i_date}
                            //onChange={handle_i_date}
                            type="date"
                            />
                        </div>
                        <div className='inputMenu'>
                            <label>Time</label>
                            <input 
                            style={{ width: '303px' }}
                            //value={i_time}
                            //onChange={handle_i_time}
                            type="time"
                            />
                        </div>
                        <div className='inputMenu'>
                            <label for="inspector-select">Inspector</label>
                            <select 
                                name="inspector" id="inspector-select"
                                style={{ width: '307px' }}
                                //value={i_inspector}
                                //onChange={handle_i_inspector}
                                >
                                <option value="">--Please choose an option--</option>
                                {inspector.map(( value, index ) => (
                                    <option id={index} value={ value.id }>
                                        { value.name } { value.surname }
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='inputMenu'>
                            <label>Inspector phone</label>
                            <input 
                            style={{ width: '300px' }}
                            //value={ ( inspector[i_inspector] ? inspector[i_inspector].phone : '' ) }
                            //value={ inspectorPhone(i_inspector) }
                            //onChange={handle_i_time}
                            type="text"
                            readOnly
                            />
                        </div>
                        <hr/>
                        <div className='inputMenu'>
                            <label for="firm-select">Elevator Owner</label>
                            <select 
                                name="firm" id="firm-select"
                                style={{ width: '307px' }}
                                value={e_firm}
                                onChange={handle_e_firm}
                                >
                                <option value='0'>--any--</option>
                                {firm.map(( value, index ) => (
                                    <option id={index} value={ value.id }>
                                        { value.name }
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='inputMenu'>
                            <label for="elevator-select">Elevator</label>
                            <select 
                                name="elevator" id="elevator-select"
                                style={{ width: '307px' }}
                                value={e_elevator}
                                onChange={handle_e_elevator}
                                >
                                <option value="0">--Please choose an option--</option>
                                {elevator.map(( value, index ) => (
                                    <option id={index} value={ value.id }>
                                        { value.elevator_name }
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='inputMenu'>
                            <label>Elevator Adress</label>
                            <textarea  
                                style={{ width: '301px', resize: 'vertical' }}
                                value={e_adress}
                                rows="2"
                                readOnly
                            />
                        </div>
                        <div className='inputMenu'>
                            <label>Elevator contacts</label>
                            <textarea  
                                style={{ width: '301px', resize: 'vertical' }}
                                value={e_contact_person.map( (value, index ) => ( 
                                    ( value.elevator == null ? '' :
                                        ( ( index != 0 ) ? '\n' : '' )  + value.position + ' - ' + value.name + ' ' + value.surname + ', tel - ' + value.phone  + ( value.comments ? ', ' + value.comments : '' ) 
                                    )
                                    ) )}
                                rows="3"
                                wrap='off'
                                readOnly
                            />
                        </div>

                        <div className='block'>
                        <button onClick={handle_load_elevator}>load template from base</button>
                            <div className='inputMenu'>
                                <label>Complex</label>
                                <label>{ ( elevator_complex_found ? 'exist' : 'not exist' ) }</label>
                                <label>{ ( elevator_complex ? '' : 'not loaded' ) }</label>
                                <div style={{ display: ( elevator_complex ? 'block' : 'none' ) }}>
                                    <label for='complex_use' >Loaded, use for inspection</label>
                                    <input id='complex_use' checked={elevator_complex_use} type='checkbox' onChange={handle_complex_use}/>
                                </div>
                            </div>
                            <div className='inputMenu'>
                                <label>Silo</label>
                                <label>{ ( elevator_silo_found ? 'exist' : 'not exist' ) }</label>
                                <label>{ ( elevator_silo ? '' : 'not loaded' ) }</label>
                                <div style={{ display: ( elevator_silo ? 'block' : 'none' ) }}>
                                    <label for='silo_use' >Loaded, use for inspection</label>
                                    <input id='silo_use' checked={elevator_silo_use} type='checkbox' onChange={handle_silo_use}/>
                                </div>
                            </div>
                            <div className='inputMenu'>
                                <label>Warehouse</label>
                                <label>{ ( elevator_warehouse_found ? 'exist' : 'not exist' ) }</label>
                                <label>{ ( elevator_warehouse? '' : 'not loaded' ) }</label>
                                <div style={{ display: ( elevator_warehouse ? 'block' : 'none' ) }}>
                                    <label for='warehouse_use' >Loaded, use for inspection</label>
                                    <input id='warehouse_use' checked={elevator_warehouse_use} type='checkbox' onChange={handle_warehouse_use}/>
                                </div>
                            </div>
                        </div>

                        <div className='inputMenu'>
                            <label>Elevator comments</label>
                            <textarea 
                                style={{ width: '301px', resize: 'vertical' }}
                                value={e_comments}
                                onChange={handle_e_comments}
                                rows="3"
                                readOnly
                            />
                        </div>
                        
                        <hr/>
                        <div className='inputMenu'>
                            <label>Inspection Order</label>
                            <textarea 
                                style={{ width: '301px', resize: 'vertical' }} 
                                //value={i_order}
                                //onChange={handle_i_order}
                                rows="5"
                            />
                        </div>
                        <div className='inputMenu'>
                            <label>Client</label>
                            <select 
                                name="firm" id="firm-select"
                                style={{ width: '307px' }}
                                //value={i_client}
                                //onChange={handle_i_client}
                                >
                                <option value='0'>--Please choose an option--</option>
                                {firm.map(( value, index ) => (
                                    <option id={index} value={ value.id }>
                                        { value.name }
                                    </option>
                                ))}
                            </select>
                        </div>
                        <hr/>
                        <div className='inputMenu'>
                            <label>Inspection Status</label>
                            <select 
                                name="status" id="status-select"
                                style={{ width: '307px' }}
                                //value={i_status}
                                //onChange={handle_i_status}
                                >
                                <option value='0'>Pre-ordered</option>
                                <option value='1'>Ordered</option>
                                <option value='2'>In progress</option>
                                <option value='3'>Completed</option>
                                <option value='4'>Canceled</option>
                            </select>
                        </div>
                        <div className='inputMenu'>
                            <label>Inspection Result</label>
                            <select 
                                name="result" id="result-select"
                                style={{ width: '307px' }}
                                //value={i_result}
                                //onChange={handle_i_result}
                                >
                                <option value='0'>Not specified</option>
                                <option value='1'>Done</option>
                                <option value='2'>Satisfaction</option>
                                <option value='3'>Not satisfaction</option>
                                <option value='4'>Re-inspection</option>
                            </select>
                        </div>
                        <div className='inputMenu'>
                            <label>Comments</label>
                            <textarea 
                                style={{ width: '301px', resize: 'vertical' }}
                                //value={i_comments}
                                //onChange={handle_i_comments}
                                rows="3"
                            />
                        </div>
                    </div>

                    <div class="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button 
                            style={{ width: '80px' }}
                            onClick={edit_Inspection_close}
                            >Cancel</button>
                        <button 
                            style={{ width: '80px' }}
                            onClick={edit_Inspection_apply}
                            >Apply</button>
                    </div>
                    
                </div>
            </div>

        </div>
        )
}