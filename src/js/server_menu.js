import React from 'react';
import {useEffect, useState} from "react";
import { Elevators } from './elevators.js';
import * as iolocal from './iolocal';
import { User } from './user';
import { ElevatorOnline } from './elevatorOnline.js';
import { useContext } from 'react';
import { UpdateContext } from '../Main'

export default function ServerMenu(){
    const [status, setStatus] = React.useState(false);
    const [login, setLogin] = React.useState(null);
    const [pass, setPass] = React.useState(null);
    const [loginStatus, setloginStatus] = React.useState(false);

    const handleLogin = (e)=>{
        setLogin( e.target.value );
    }
    
    const handlePass = (e)=>{
        setPass( e.target.value );
    }
    
    const handleEnter = (e)=>{
        if ( e.keyCode == 13 ) {
            //setloginStatus( User.SignIn( login, pass ) );
            User.SignIn( login, pass ).then ( (result) => setloginStatus(result) );
        }
    }

      React.useEffect(() => {
        fetch("http://localhost:3001/", { method: 'GET' })
          .then((res) => res.json())
          .then((response) => setStatus(response.online));
      }, []);

    return (
    <div className='block'>
        <div className='block_row'>
            <label>Server - </label>
            <label>{status ? "Online..." : "Offline..."}</label>

            <div style={{ display: ( status ? 'flex' : 'none' ) }}>
                <label for="name"> Username:</label>
                <input 
                    value={login}
                    onChange={handleLogin}
                    onKeyUp={handleEnter}
                    type="text" id="name" name="name" required minlength="4" maxlength="10" size="10"
                />

                <label for="pass">Password:</label>
                <input 
                    value={pass}
                    onChange={handlePass}
                    onKeyUp={handleEnter}
                    type="password" id="pass" name="password" minlength="8" required size="10"
                />

                <button
                    onClick={ () => User.SignIn( login, pass ).then ( (result) => setloginStatus(result) ) }
                >Sign in</button>

                <label>{ loginStatus ? 'Connected as ' + User.get_UserFullName : 'Disconnected' }</label>
            </div>

        </div>

        <div
            className='block'
            style={{ display: ( status ? 'flex' : 'none' ) }}
        >
            <DB_List/>

        </div>

    </div>
    );
}

function DB_List( filter ){
    const [insp, setInsp] = React.useState(null);
    const [elev, setElev] = React.useState(null);
    const [firm, setFirm] = React.useState(null);
    const [pers, setPers] = React.useState(null);
    const [user, setUser] = React.useState(null);
    const [table, setTable] = React.useState(1); //Inspections

    const handleInspection = (e)=>{
        setTable(1);
        ElevatorOnline.get_Inspection_List({filter: 'all'}).then( (resolve)=>{ setInsp(resolve); console.log(resolve); } );
    }

    const handleElevators = (e)=>{
        setTable(2);
        ElevatorOnline.get_Elevator_List({filter: 'all'}).then( (resolve)=>{ setElev(resolve); console.log(resolve); } );
    }

    const handleFirms = (e)=>{
        setTable(3);
        ElevatorOnline.get_Firm_List({filter: 'all', list: 'simple'}).then( (resolve)=>{ setFirm(resolve); console.log(resolve); } );
    }

    const handlePersons = (e)=>{
        setTable(4);
        ElevatorOnline.get_Person_List({filter: 'all'}).then( (resolve)=>{ setPers(resolve); console.log(resolve); } );
    }

    const handleUsers = (e)=>{
        setTable(5);
    }
console.log('firm = ',firm);
        return(
        <div>
            <button 
                className='myButton' 
                style={{ width: '100px', borderWidth: ( table == 1 ? '3px'  : '0' ), borderColor: 'lime' }}
                onClick={handleInspection}
                >Inspections</button>
            <button 
                className='myButton'
                style={{ width: '100px', borderWidth: ( table == 2 ? '3px'  : '0' ), borderColor: 'lime' }}
                onClick={handleElevators}
                >Elevators</button>
            <button 
                className='myButton'
                style={{ width: '100px', borderWidth: ( table == 3 ? '3px'  : '0' ), borderColor: 'lime' }}
                onClick={handleFirms}
                >Firms</button>
            <button 
                className='myButton'
                style={{ width: '100px', borderWidth: ( table == 4 ? '3px'  : '0' ), borderColor: 'lime' }}
                onClick={handlePersons}
                >Persons</button>
            <button 
                className='myButton'
                style={{ width: '100px', borderWidth: ( table == 5 ? '3px'  : '0' ), borderColor: 'lime' }}
                onClick={handleUsers}
                >Users</button>

            { ( table == 1 ? ( ( insp ) ? <Inspection_List loaded = {insp}/> : <div>Data Base "Inspection" not loaded !</div> )  : null ) }
            { ( table == 2 ? ( ( elev ) ? <Elevator_List loaded = {elev}/> : <div>Data Base "Elevator" not loaded !</div> )  : null ) }
            { ( table == 3 ? ( ( firm ) ? <Firm_List loaded = {firm}/> : <div>Data Base "Firm" not loaded !</div> ) : null ) }
            { ( table == 4 ? ( ( pers ) ? <Person_List loaded = {pers}/> : <div>Data Base "Person" not loaded !</div> ) : null ) }
            { ( table == 5 ? <></> : <></> ) }
        </div>
        )
}

function Inspection_List_row( props ){
    let row = props.row;
    let item = props.item;
    let selected = props.selected;

    let date = new Date( item.order_date );
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];

    const handleClick = (e)=>{
        props.callback_id(item.id);
        props.callback_order_no(item.order_no);
        props.callback(row);
    }

    return (
        <tr
            style={{ backgroundColor: ( selected == row ? 'lime' : '' )  }}
            onClick={handleClick}
        >
            <td>{ item.id }</td>
            <td>{ item.order_no }</td>
            <td>{ ( item.order_date ? ( date.getFullYear() +' '+ monthNames[ date.getMonth() ] + ' ' + date.getDate() ) : '') }</td>
            <td>{ item.order_time }</td>
            <td>{ item.order }</td>
            <td>{ item.elevator }</td>
            <td>{ item.client }</td>
            <td>{ item.inspector }</td>
            <td>{ item.complex }</td>
            <td>{ item.silo }</td>
            <td>{ item.warehouse }</td>
            <td>{ item.status }</td>
            <td>{ item.result }</td>
            <td>{ item.comments }</td>
        </tr>
    )
}

function Inspection_List ( props ){

    let inspections = props.loaded;
    console.log('inspections = ',inspections);

    const [selected, setSelected] = React.useState(0);
    const [id, setId] = React.useState(0);
    const [orderNo, setOrderNo] = React.useState('');

    const [firm, setFirm] = React.useState([]);
    const [inspector, setInspector] = React.useState([]);
    const [elevator, setElevator] = React.useState([]);

    const [i_number, setI_number] = React.useState(inspections[0].order_no);
    const handle_i_number = (e)=>{
        setI_number( e.target.value );
    }

    const [i_date, setI_date] = React.useState( DateIsoToString( new Date ( inspections[0].order_date ) ) );
    const handle_i_date = (e)=>{
        setI_date( e.target.value );
    }

    const [i_time, setI_time] = React.useState(inspections[0].order_time);
    const handle_i_time = (e)=>{
        setI_time( e.target.value );
    }

    const [i_inspector, setI_inspector] = React.useState(inspections[0].inspector);
    const handle_i_inspector = (e)=>{
        setI_inspector( e.target.value );
    }

    function  inspectorPhone ( id ) {
        for ( let i = 0; i < inspector.length; i++ ) {
            if ( inspector[i].id == id ) return inspector[i].phone;
        }
        return ('');
    }

    const [i_order, setI_order] = React.useState(inspections[0].order);
    const handle_i_order = (e)=>{
        setI_order( e.target.value );
    }

    const [i_comments, setI_comments] = React.useState(inspections[0].comments);
    const handle_i_comments = (e)=>{
        setI_comments( e.target.value );
    }

    const [i_status, setI_status] = React.useState(inspections[0].status);
    const handle_i_status = (e)=>{
        setI_status( e.target.value );
    }

    const [i_result, setI_result] = React.useState(inspections[0].result);
    const handle_i_result = (e)=>{
        setI_result( e.target.value );
    }

    const [e_firm, setE_firm] = React.useState();
    const handle_e_firm = (e)=>{
        setE_firm( e.target.value );
        if ( e.target.value == 0 )
            ElevatorOnline.get_Elevator_List( { filter: 'all', sorted: 'elevator_name' } ).then( (resolve)=>{ setElevator(resolve); console.log('get_Elevator_List = ',resolve); } )
        else
            ElevatorOnline.get_Elevator_List( { filter: 'owner', id: `${e.target.value}`, sorted: 'elevator_name' } ).then( (resolve)=>{ setElevator(resolve); console.log('get_Elevator_List = ',resolve); } );
        
    }

    const [i_client, setI_client] = React.useState();
    const handle_i_client = (e)=>{
        setI_client( e.target.value );
    }

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
        if ( window.confirm('Delete Inspection - '+ orderNo +', with id = '+ id ) ) ElevatorOnline.del_Inspection_from_Server(id);
    }

    const edit_Inspection = ()=>{
        ElevatorOnline.get_Firm_List({filter: 'all', sorted: 'true'}).then( (resolve)=>{ setFirm(resolve); setI_client(resolve); console.log('get_Firm_List = ',resolve); } );
        ElevatorOnline.get_Person_List( { filter: 'all', list: 'inspector', sorted: 'name' } ).then( (resolve)=>{ setInspector(resolve); console.log('get_Inspector_List = ',resolve); } );
        setEdit(true);
    }

    const edit_Inspection_close = ()=>{
        setEdit(false);
        if ( inspections[selected].order_no ) { setI_number( inspections[selected].order_no ) } else setI_number( '' );
        if ( inspections[selected].order_date ) { setI_date( inspections[selected].order_date) } else setI_date( '' );
        if ( inspections[selected].order_time) { setI_time( inspections[selected].order_time) } else setI_time( '' );
        if ( inspections[selected].order) { setI_order( inspections[selected].order) } else setI_order( '' );
        if ( inspections[selected].inspector ) { setI_inspector( inspections[selected].inspector) } else setI_inspector( '' );
        //if ( inspections[selected].inspector ) { setI_inspector( inspections[selected].inspector) } else setI_inspector( '' );
    }
    const edit_Inspection_apply = ()=>{
        setEdit(false);
        //elevators[selected].elevator_name = e_name;
        //elevators[selected].adress = e_adress;
        //elevators[selected].owner = e_owner;
        //elevators[selected].comments = e_comments;
        //ElevatorOnline.update_Elevator_to_Server( elevators[selected] , 'simple' );
    }

    const selected_change = (data)=>{
        //console.log('selected_data=',data);
        //console.log('elevators[]=',elevators[data]);
        let date = DateIsoToString( new Date ( inspections[data].order_date ) );

        console.log('date=',inspections[data].order_date);
        console.log('date=',date);
        setSelected( data );
        if ( inspections[data].order_no ) { setI_number( inspections[data].order_no ) } else setI_number( '' );
        if ( inspections[data].order_date ) { setI_date( date ) } else setI_date( '' );
        //if ( elevators[data].elevator_name ) { setE_name( elevators[data].elevator_name ) } else setE_name( '' );
        //if ( elevators[data].adress )  { setE_adress( elevators[data].adress ) } else setE_adress( '' );
        //if ( elevators[data].owner ) { setE_owner( elevators[data].owner ) } else setE_owner( '' )
        //setE_complex ( elevators[data].complex ? 'found' : 'not found' );
        //setE_silo ( elevators[data].silo ? 'found' : 'not found' );
        //setE_warehouse ( elevators[data].warehouse ? 'found' : 'not found' );
        //if ( elevators[data].comments ) { setE_comments( elevators[data].comments ) } else setE_comments( '' );
    }

    return(
        <div>
            

        <div style={{ height: 300, width: '100%', overflow: 'auto' }} >
            
            <table className='myTable'>

            <thead>
                <tr>
                    <th >id</th>
                    <th>order_no</th>
                    <th>order_date</th>
                    <th>order_time</th>
                    <th>order</th>
                    <th>elevator</th>
                    <th>client</th>
                    <th>inspector</th>
                    <th>complex</th>
                    <th>silo</th>
                    <th>warehouse</th>
                    <th>status</th>
                    <th>result</th>
                    <th>comments</th>
                </tr>
            </thead>

                <tbody>

                { ( inspections ? inspections.map((item ,row) => ( <Inspection_List_row item={item} row={row} selected={selected} callback={(data)=> selected_change( data ) } callback_id={(data)=> setId(data)} callback_order_no={(data)=> setOrderNo(data)} /> )) : <></> ) }

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
                    className='myButton'
                    style={{ width: '150px' }}
                    //onClick={handleOpenElevator}
                    >Open from server</button>
                <button
                    className='myButton'
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
                                value={i_number}
                                onChange={handle_i_number}
                                type="text" required minlength="3"
                            />
                        </div>
                        <div className='inputMenu'>
                            <label>Date</label>
                            <input 
                            style={{ width: '303px' }}
                            value={i_date}
                            onChange={handle_i_date}
                            type="date"
                            />
                        </div>
                        <div className='inputMenu'>
                            <label>Time</label>
                            <input 
                            style={{ width: '303px' }}
                            value={i_time}
                            onChange={handle_i_time}
                            type="time"
                            />
                        </div>
                        <div className='inputMenu'>
                            <label for="inspector-select">Inspector</label>
                            <select 
                                name="inspector" id="inspector-select"
                                style={{ width: '307px' }}
                                value={i_inspector}
                                onChange={handle_i_inspector}
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
                            style={{ width: '303px' }}
                            //value={ ( inspector[i_inspector] ? inspector[i_inspector].phone : '' ) }
                            value={ inspectorPhone(i_inspector) }
                            //onChange={handle_i_time}
                            type="text"
                            readOnly
                            />
                        </div>
                        <br/><hr/>
                        <div className='inputMenu'>
                            <label for="firm-select">Elevator Owner</label>
                            <select 
                                name="firm" id="firm-select"
                                style={{ width: '307px' }}
                                value={e_firm}
                                onChange={handle_e_firm}
                                >
                                <option value="">--Please choose an option--</option>
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
                                style={{ width: '301px' }}
                                value={e_adress}
                                rows="3"
                                readOnly
                            />
                        </div>
                        <div className='inputMenu'>
                            <label>Elevator contacts</label>
                            <textarea  
                                style={{ width: '301px' }}
                                value={e_contact_person.map( (value, index ) => ( 
                                    ( value.elevator == null ? '' :
                                        ( ( index != 0 ) ? '\n' : '' )  + value.position + ' - ' + value.name + ' ' + value.surname + ', tel - ' + value.phone  + ( value.comments ? ', ' + value.comments : '' ) 
                                    )
                                    ) )}
                                rows="5"
                                wrap='off'
                            />
                        </div>
                        <div className='inputMenu'>
                            <label>Elevator comments</label>
                            <textarea 
                                style={{ width: '301px' }}
                                value={e_comments}
                                onChange={handle_e_comments}
                                rows="3"
                            />
                        </div>
                        
                        <br/><hr/>
                        <div className='inputMenu'>
                            <label>Inspection Order</label>
                            <textarea 
                                style={{ width: '301px' }} 
                                value={i_order}
                                onChange={handle_i_order}
                                rows="5"
                            />
                        </div>
                        <div className='inputMenu'>
                            <label>Client</label>
                            <select 
                                name="firm" id="firm-select"
                                style={{ width: '307px' }}
                                value={i_client}
                                onChange={handle_i_client}
                                >
                                <option value='0'>--Please choose an option--</option>
                                {firm.map(( value, index ) => (
                                    <option id={index} value={ value.id }>
                                        { value.name }
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='inputMenu'>
                            <label>Comments</label>
                            <textarea 
                                style={{ width: '301px' }}
                                value={i_comments}
                                onChange={handle_i_comments}
                                rows="3"
                            />
                        </div>
                        <div className='inputMenu'>
                            <label>Inspection Status</label>
                            <select 
                                name="status" id="status-select"
                                style={{ width: '307px' }}
                                value={i_status}
                                onChange={handle_i_status}
                                >
                                <option value='0'>preOrdered</option>
                                <option value='1'>Ordered</option>
                                <option value='2'>Inprogress</option>
                                <option value='3'>Complited</option>
                                <option value='4'>Canceled</option>
                            </select>
                        </div>
                        <div className='inputMenu'>
                            <label>Inspection Result</label>
                            <select 
                                name="result" id="result-select"
                                style={{ width: '307px' }}
                                value={i_result}
                                onChange={handle_i_result}
                                >
                                <option value='0'>Waiting commence</option>
                                <option value='1'>Inprogress</option>
                                <option value='2'>OK</option>
                                <option value='3'>Not OK</option>
                                <option value='4'>Repeated</option>
                            </select>
                        </div>
                    </div>

                    <div class="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button 
                            className='myButton' 
                            style={{ width: '80px' }}
                            onClick={edit_Inspection_close}
                            >Cancel</button>
                        <button 
                            className='myButton'
                            style={{ width: '80px' }}
                            onClick={edit_Inspection_apply}
                            >Apply</button>
                    </div>
                    
                </div>
            </div>

        </div>
        )
}

function Elevator_List ( props ){
    const [update, setUpdate] = useContext(UpdateContext);

    const [sendServer, setSendServer] = React.useState(false);

    let elevators = props.loaded;

    const [selected, setSelected] = React.useState(0);
    const [id, setId] = React.useState(0);
    const [name, setName] = React.useState('');
    const [edit, setEdit] = React.useState(false);

    const [firm, setFirm] = React.useState([]);

    const [e_name, setE_name] = React.useState(elevators[0].elevator_name);
    const [e_adress, setE_adress] = React.useState(elevators[0].adress);
    const [e_owner, setE_owner] = React.useState(elevators[0].owner);
    const [e_complex, setE_complex] = React.useState( elevators[0].complex ? 'found' : 'not found' );
    const [e_silo, setE_silo] = React.useState( elevators[0].silo ? 'found' : 'not found' );
    const [e_warehouse, setE_warehouse] = React.useState( elevators[0].warehouse ? 'found' : 'not found' );
    const [e_contact_person, setE_contact_person] = React.useState([]);
    const [e_comments, setE_comments] = React.useState(elevators[0].comments);

    const handle_e_name = (e)=>{
        setE_name( e.target.value );
    }
    const handle_e_adress = (e)=>{
        setE_adress( e.target.value );
    }
    const handle_e_owner = (e)=>{
//        console.log('handle_e_owner = ', e.target.value );
        setE_owner( e.target.value );
    }
    //const handle_e_contact_person = (e)=>{
    //    setE_contact_person( e.target.value );
    //}
    const handle_e_comments = (e)=>{
        setE_comments( e.target.value );
    }

    const selected_change = (data)=>{
        //console.log('selected_data=',data);
        //console.log('elevators[]=',elevators[data]);
        setSelected( data );
        if ( elevators[data].elevator_name ) { setE_name( elevators[data].elevator_name ) } else setE_name( '' );
        if ( elevators[data].adress )  { setE_adress( elevators[data].adress ) } else setE_adress( '' );
        if ( elevators[data].owner ) { setE_owner( elevators[data].owner ) } else setE_owner( '' )
        setE_complex ( elevators[data].complex ? 'found' : 'not found' );
        setE_silo ( elevators[data].silo ? 'found' : 'not found' );
        setE_warehouse ( elevators[data].warehouse ? 'found' : 'not found' );
        //if ( elevators[data].contact_person ) { setE_contact_person( elevators[data].contact_person ) } else setE_contact_person( '' );
        if ( elevators[data].comments ) { setE_comments( elevators[data].comments ) } else setE_comments( '' );
    }

    const importComplex = ()=>{
        ElevatorOnline.import_Elevator_Complex( id );
    }
    const importSilo = ()=>{
        ElevatorOnline.import_Elevator_Silo( id );
    }
    const importWarehouse = ()=>{
        ElevatorOnline.import_Elevator_Warehouse( id );
    }

    const new_Elevator = ()=>{
        let elev = {};
        elev.id = null;
        elev.elevator_name = null;
        elev.adress = null;
        elev.owner = null;
        //elev.contact_person = null;
        elev.complex = null;
        elev.silo = null;
        elev.warehouse = null;
        elev.comments = null;

        elev.elevator_name = prompt("Unique Name of Elevator", 'New Elevator' );

        console.log('elev = ',elev);

        if ( elev.elevator_name ) ElevatorOnline.new_Elevator_to_Server(elev).then( 
            (response)=>{ if ( response.sqlMessage ) alert('sqlMessage - ' + response.sqlMessage ) } );
    }

    const del_Elevator = ()=>{
        if ( window.confirm('Delete Elevator - '+ name +', with id = '+ id ) ) ElevatorOnline.del_Elevator_from_Server(id);
    }

    const edit_Elevator = ()=>{
        ElevatorOnline.get_Firm_List({filter: 'all', sorted: 'true'}).then( (resolve)=>{ setFirm(resolve); console.log('get_Firm_List = ',resolve); } );
        ElevatorOnline.get_Person_List( { filter: 'all', list: 'elevator', id: `${elevators[selected].id}` } ).then( (resolve)=>{ setE_contact_person(resolve); console.log('get_Person_List = ',resolve); } );
        setEdit(true);
    }

    const edit_Elevator_close = ()=>{
        setEdit(false);
        if ( elevators[selected].elevator_name ) { setE_name( elevators[selected].elevator_name ) } else setE_name( '' );
        if ( elevators[selected].adress )  { setE_adress( elevators[selected].adress ) } else setE_adress( '' );
        if ( elevators[selected].owner ) { setE_owner( elevators[selected].owner ) } else setE_owner( '' )
        //if ( elevators[selected].contact_person ) { setE_contact_person( elevators[selected].contact_person ) } else setE_contact_person( '' );
        if ( elevators[selected].comments ) { setE_comments( elevators[selected].comments ) } else setE_comments( '' );
    }

    const edit_Elevator_apply = ()=>{
        setEdit(false);
        elevators[selected].elevator_name = e_name;
        elevators[selected].adress = e_adress;
        elevators[selected].owner = e_owner;
        //elevators[selected].contact_person = e_contact_person;
        elevators[selected].comments = e_comments;
        ElevatorOnline.update_Elevator_to_Server( elevators[selected] , 'simple' );
    }

    const handleOpenElevator = (e)=>{
        ElevatorOnline.get_Elevator( id ).then( ( resolve ) => { 
            console.log( 'get_Elevator = ',resolve ); 
            Elevators.setElevatorsFromServer =  resolve;
            setSendServer( true );
            setUpdate( !update );
        } );
    }

    const handleSendServer = (e)=>{
        let local_id = Elevators.ElevatorId;
        ElevatorOnline.import_Elevator_Complex( local_id );
        ElevatorOnline.import_Elevator_Silo( local_id );
        ElevatorOnline.import_Elevator_Warehouse( local_id );
    }

    //console.log('elevators = ',elevators);

    return(
        <div>
            

        <div style={{ height: 300, width: '100%', overflow: 'auto' }} >
            
            <table className='myTable'>

            <thead>
                <tr>
                    <th >id</th>
                    <th>elevator_name</th>
                    <th>adress</th>
                    <th>owner</th>
                    <th>complex</th>
                    <th>silo</th>
                    <th>warehouse</th>
                    <th>comments</th>
                </tr>
            </thead>

                <tbody>

                { ( elevators ? elevators.map((item ,row) => ( <Elevator_List_row item={item} row={row} selected={selected} callback={(data)=> selected_change(data) } callback_id={(data)=> setId(data)} callback_name={(data)=> setName(data)}/> )) : <></> ) }

                </tbody>
            </table>
        </div>

            <button onClick={new_Elevator}>New</button>
            <button disabled>Clone</button>
            <button onClick={del_Elevator}>Delete</button>
            <button onClick={edit_Elevator}>View / Edit</button>

            <div
                className='block_row'
                style={{ justifyContent: 'space-around' }}
            >
                <button
                    className='myButton'
                    style={{ width: '150px' }}
                    onClick={handleOpenElevator}
                    >Open from server</button>
                <button
                    className='myButton'
                    style={{ width: '150px', display: ( sendServer ? 'block' : 'none' ) }}
                    onClick={handleSendServer}
                    >Send to server</button>
            </div>

            <div id="myModal" class="modal" style={{ display:  ( edit ? 'block' : 'none' )  }}>
                <div class="modal-content" style={{ width: '500px' }}>
                    <div class="modal-header">
                        <span class="close" onClick={edit_Elevator_close}>&times;</span>
                        <span>Elevator information</span>
                    </div>

                    <div class="modal-body">
                        <div className='inputMenu'>
                            <label>Elevator</label>
                            <input 
                            value={e_name}
                            onChange={handle_e_name}
                            type="text" required minlength="3" size="50"
                            />
                        </div>
                        <div className='inputMenu'>
                            <label>Elevator Adress</label>
                            <textarea  
                            value={e_adress}
                            onChange={handle_e_adress}
                            cols="52" rows="3"
                            />
                        </div>
                        <div className='inputMenu'>
                            <label for="owner-select">Owner</label>
                            <select 
                                name="owner" id="owner-select"
                                style={{ width: '370px' }}
                                value={e_owner}
                                onChange={handle_e_owner}
                                >
                                <option value="">--Please choose an option--</option>
                                <option value='0'>--unknow--</option>
                                {firm.map(( value, index ) => (
                                    <option id={index} value={ value.id }>
                                        { value.name }
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='inputMenu'>
                            <label>Contact Person</label>
                            <textarea 
                                style={{ width: '390px' }}
                                value={e_contact_person.map( (value, index ) => ( 
                                    ( value.elevator == null ? '' :
                                        ( ( index != 0 ) ? '\n' : '' )  + value.position + ' - ' + value.name + ' ' + value.surname + ', tel - ' + value.phone  + ( value.comments ? ', ' + value.comments : '' ) 
                                    )
                                    ) )}
                            //onChange={handle_e_contact_person}
                            rows="5"
                            wrap='off'
                            spellCheck='false'
                            readOnly
                            />
                        </div>
                        <div className='inputMenu'>
                            <label>Complex</label>
                            <label>{e_complex}</label>
                            <button onClick={importComplex}>Import</button>
                        </div>
                        <div className='inputMenu'>
                            <label>Silo</label>
                            <label>{e_silo}</label>
                            <button onClick={importSilo}>Import</button>
                        </div>
                        <div className='inputMenu'>
                            <label>Warehouse</label>
                            <label>{e_warehouse}</label>
                            <button onClick={importWarehouse}>Import</button>
                        </div>
                        <div className='inputMenu'>
                            <label>Comments</label>
                            <textarea 
                            value={e_comments}
                            onChange={handle_e_comments}
                            cols="47" rows="3"
                            />
                        </div>

                    </div>

                    <div class="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button 
                            className='myButton' 
                            style={{ width: '80px' }}
                            onClick={edit_Elevator_close}
                            >Cancel</button>
                        <button 
                            className='myButton'
                            style={{ width: '80px' }}
                            onClick={edit_Elevator_apply}
                            >Apply</button>
                    </div>
                    
                </div>
            </div>

        </div>
        )
}

function Elevator_List_row( props ){
    let row = props.row;
    let item = props.item;
    let selected = props.selected;

    const handleClick = (e)=>{
        props.callback_id(item.id);
        props.callback_name(item.elevator_name);
        props.callback(row);
    }

    return (
        <tr
            style={{ backgroundColor: ( selected == row ? 'lime' : '' )  }}
            onClick={handleClick}
        >
            <td>{ item.id }</td>
            <td>{ item.elevator_name }</td>
            <td>{ item.adress }</td>
            <td>{ item.name }</td>
            <td>{ ( item.complex ? 'found' : '' ) }</td>
            <td>{ ( item.silo ? 'found' : '' ) }</td>
            <td>{ ( item.warehouse ? 'found' : '' ) }</td>
            <td>{ item.comments }</td>
        </tr>
    )
}

//------------------------------------------

function Firm_List ( props ){
    let firms = props.loaded;
    const [selected, setSelected] = React.useState(0);
    const [id, setId] = React.useState( firms[0] ? firms[0].id : 0 );
    const [name, setName] = React.useState( firms[0] ? firms[0].name : '' );
    const [edit, setEdit] = React.useState(false);

    const [f_name, setF_name] = React.useState( firms[0] ? firms[0].name : '' );
    const [f_type, setF_type] = React.useState( firms[0] ? firms[0].type : '' );
    const [f_adress, setF_adress] = React.useState( firms[0] ? firms[0].adress : '' );
    //const [f_contact_person, setF_contact_person] = React.useState( firms[0] ? firms[0].contact_person : '' );
    const [f_contact_person, setF_contact_person] = React.useState( [] );
    const [f_person_name, setF_person_name] = React.useState( firms[0] ? firms[0].person_name : '' );
    const [f_comments, setF_comments] = React.useState( firms[0] ? firms[0].comments : '' );

    const handle_f_name = (e)=>{
        setF_name( e.target.value );
    }
    const handle_f_type = (e)=>{
        setF_type( e.target.value );
    }
    const handle_f_adress = (e)=>{
        setF_adress( e.target.value );
    }
    //const handle_f_contact_person = (e)=>{
    //    setF_contact_person( e.target.value );
    //}
    const handle_f_comments = (e)=>{
        setF_comments( e.target.value );
    }

    const selected_change = (data)=>{
        //console.log('selected_data=',data);
        //console.log('elevators[]=',elevators[data]);
        setSelected( data );
        if ( firms[data].name ) { setF_name( firms[data].name ) } else setF_name( '' );
        if ( firms[data].type )  { setF_type( firms[data].type ) } else setF_type( '' );
        if ( firms[data].adress )  { setF_adress( firms[data].adress ) } else setF_adress( '' );
        //if ( firms[data].contact_person ) { setF_contact_person( firms[data].contact_person ) } else setF_contact_person( '' );
        if ( firms[data].person_name ) { setF_person_name( firms[data].person_name ) } else setF_person_name( '' );
        if ( firms[data].comments ) { setF_comments( firms[data].comments ) } else setF_comments( '' );
    }

    const new_Firm = ()=>{
        let firm = {};
        firm.id = null;
        firm.name = null;
        firm.type = null;
        firm.adress = null;
        //firm.contact_person = null;
        firm.comments = null;

        firm.name = prompt("Unique Name of Firm", 'New Firm' );

        console.log('firm = ',firm);

        if ( firm.name ) ElevatorOnline.new_Firm_to_Server(firm).then( 
            (response)=>{ if ( response.sqlMessage ) alert('sqlMessage - ' + response.sqlMessage ) } );
    }

    const del_Firm = ()=>{
        if ( window.confirm('Delete Firm - '+ name +', with id = '+ id ) ) ElevatorOnline.del_Firm_from_Server(id);
    }

    const edit_Firm = ()=>{
        ElevatorOnline.get_Person_List( { filter: 'all', list: 'firm', id: `${firms[selected].id}` } ).then( (resolve)=>{ setF_contact_person(resolve); console.log('get_Firm_List = ',resolve); } );
        setEdit(true);
    }
    const edit_Firm_close = ()=>{
        setEdit(false);
        if ( firms[selected].name ) { setF_name( firms[selected].name ) } else setF_name( '' );
        if ( firms[selected].type ) { setF_type( firms[selected].type ) } else setF_name( '' );
        if ( firms[selected].adress )  { setF_adress( firms[selected].adress ) } else setF_adress( '' );
        //if ( firms[selected].contact_person ) { setF_contact_person( firms[selected].contact_person ) } else setF_contact_person( '' );
        if ( firms[selected].comments ) { setF_comments( firms[selected].comments ) } else setF_comments( '' );
    }
    const edit_Firm_apply = ()=>{
        setEdit(false);
        firms[selected].name = f_name;
        firms[selected].type = f_type;
        firms[selected].adress = f_adress;
        //firms[selected].contact_person = f_contact_person;
        firms[selected].comments = f_comments;
        ElevatorOnline.update_Firm_to_Server( firms[selected] ).then(
            (response)=>{ if ( response.sqlMessage ) alert('sqlMessage - ' + response.sqlMessage ) } );
    }

    //console.log('elevators = ',elevators);

    return(
        <div>
            

        <div style={{ height: 300, width: '100%', overflow: 'auto' }} >
            
            <table className='myTable'>

            <thead>
                <tr>
                    <th>id</th>
                    <th>name</th>
                    <th>type</th>
                    <th>adress</th>
                    <th>comments</th>
                </tr>
            </thead>

                <tbody>

                { ( firms ? firms.map((item ,row) => ( <Firm_List_row item={item} row={row} selected={selected} callback={(data)=> selected_change(data) } callback_id={(data)=> setId(data)} callback_name={(data)=> setName(data)}/> )) : <></> ) }

                </tbody>
            </table>
        </div>

            <button onClick={new_Firm}>New</button>
            <button disabled>Clone</button>
            <button onClick={del_Firm}>Delete</button>
            <button onClick={edit_Firm}>View / Edit</button>

            <div id="myModal" class="modal" style={{ display:  ( edit ? 'block' : 'none' )  }}>
                <div class="modal-content" style={{ width: '500px' }}>
                    <div class="modal-header">
                        <span class="close" onClick={edit_Firm_close}>&times;</span>
                        <span>Firm information</span>
                    </div>

                    <div class="modal-body">
                        <div className='inputMenu'>
                            <label>Firm</label>
                            <input
                            style={{ width: '350px' }} 
                            value={f_name}
                            onChange={handle_f_name}
                            type="text" 
                            required
                            minlength="3"
                            />
                        </div>
                        <div className='inputMenu'>
                            <label for="type-select">Type</label>
                            <select 
                                style={{ width: '357px' }}
                                name="type" id="type-select"
                                value={f_type}
                                onChange={handle_f_type}
                                >
                                <option value="">--Please choose an option--</option>
                                <option value="Auditor">Auditor</option>
                                <option value="Surveyor">Surveyor</option>
                                <option value="Client">Client</option>
                                <option value="Terminal">Terminal</option>
                                <option value="Port Terminal">Port Terminal</option>
                                <option value="Trader">Trader</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className='inputMenu'>
                            <label>Adress</label>
                            <textarea  
                            style={{ width: '352px' }}
                            value={f_adress}
                            onChange={handle_f_adress}
                            rows="3"
                            />
                        </div>
                        <div className='inputMenu'>
                            <label>Contact Person</label>
                            <textarea 
                                style={{ width: '352px' }}
                                value={f_contact_person.map( (value, index ) => ( 
                                    ( value.firm == null ? '' :
                                        ( ( index != 0 ) ? '\n' : '' )  +( value.elevator_name ? value.elevator_name + '. ' : '' ) + value.position + ' - ' + value.name + ' ' + value.surname + ', tel - ' + value.phone  + ( value.comments ? ', ' + value.comments : '' ) 
                                    )
                                    ) )}
                                //onChange={handle_f_contact_person}
                                rows="5"
                                wrap='off'
                                spellCheck='false'
                                readOnly
                            />
                        </div>
                        <div className='inputMenu'>
                            <label>Comments</label>
                            <textarea 
                            style={{ width: '352px' }}
                            value={f_comments}
                            onChange={handle_f_comments}
                            rows="3"
                            />
                        </div>

                    </div>

                    <div class="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button 
                            className='myButton' 
                            style={{ width: '80px' }}
                            onClick={edit_Firm_close}
                            >Cancel</button>
                        <button 
                            className='myButton'
                            style={{ width: '80px' }}
                            onClick={edit_Firm_apply}
                            >Apply</button>
                    </div>

                </div>
            </div>

        </div>
        )
}

function Firm_List_row( props ){
    let row = props.row;
    let item = props.item;
    let selected = props.selected;

    const handleClick = ()=>{
        props.callback_id(item.id);
        props.callback_name(item.name);
        props.callback(row);
    }

    const handleDoubleClick = ()=>{
        //props.callback_id(item.id);
        //props.callback_name(item.name);
        //props.callback(row);

    }

    return (
        <tr
            style={{ backgroundColor: ( selected == row ? 'lime' : '' )  }}
            onClick={handleClick}
        >
            <td>{ item.id }</td>
            <td>{ item.name }</td>
            <td>{ item.type }</td>
            <td>{ item.adress }</td>
            <td>{ item.comments }</td>
        </tr>
    )
}

function Person_List ( props ){
    let persons = props.loaded;
    const [selected, setSelected] = React.useState(0);
    const [id, setId] = React.useState( persons[0] ? persons[0].id : 0 );
    const [name, setName] = React.useState( persons[0] ? persons[0].name : '' );
    const [edit, setEdit] = React.useState(false);

    const [firm, setFirm] = React.useState([]);
    const [elevator, setElevator] = React.useState([]);

    const [p_name, setP_name] = React.useState( persons[0] ? persons[0].name : '' );
    const [p_surname, setP_surname] = React.useState( persons[0] ? persons[0].surname : '' );
    const [p_firm, setP_firm] = React.useState( persons[0] ? persons[0].firm : '' );
    const [p_elevator, setP_elevator] = React.useState( persons[0] ? persons[0].elevator : '' );
    const [p_position, setP_position] = React.useState( persons[0] ? persons[0].position : '' );
    const [p_phone, setP_phone] = React.useState( persons[0] ? persons[0].phone : '' );
    const [p_comments, setP_comments] = React.useState( persons[0] ? persons[0].comments : '' );

    const handle_p_name = (e)=>{
        setP_name( e.target.value );
    }
    const handle_p_surname= (e)=>{
        setP_surname( e.target.value );
    }
    const handle_p_firm = (e)=>{
        setP_firm( e.target.value );
    }
    const handle_p_elevator = (e)=>{
        setP_elevator( e.target.value );
    }
    const handle_p_position = (e)=>{
        setP_position( e.target.value );
    }
    const handle_p_phone = (e)=>{
        setP_phone( e.target.value );
    }
    const handle_p_comments = (e)=>{
        setP_comments( e.target.value );
    }

    const selected_change = (data)=>{
        //console.log('selected_data=',data);
        //console.log('elevators[]=',elevators[data]);
        setSelected( data );
        if ( persons[data].name ) { setP_name( persons[data].name ) } else setP_name( '' );
        if ( persons[data].surname )  { setP_surname( persons[data].surname ) } else setP_surname( '' );
        if ( persons[data].firm )  { setP_firm( persons[data].firm ) } else setP_firm( '' );
        if ( persons[data].elevator )  { setP_elevator( persons[data].elevator ) } else setP_elevator( '' );
        if ( persons[data].position )  { setP_position( persons[data].position ) } else setP_position( '' );
        if ( persons[data].phone ) { setP_phone( persons[data].phone ) } else setP_phone( '' );
        if ( persons[data].comments ) { setP_comments( persons[data].comments ) } else setP_comments( '' );
    }

    const new_Person = ()=>{
        let person = {};
        person.id = null;
        person.name = null;
        person.surname = null;
        person.firm = null;
        person.elevator = null;
        person.position = null;
        person.phone = null;
        person.comments = null;
        let divider = 0;

        let name = prompt("Name, Surname of Person", 'Name Surname' );
        if ( name != null && name != '' ) {
            divider = name.indexOf(" ");
            if ( divider == -1 ) divider = name.indexOf(",");
            if ( divider == -1 ) {
                person.name = name;
                person.surname = '';
            } else {
                person.name = name.slice( 0, divider );
                person.surname = name.slice( divider + 1 );
            }

            console.log('person = ',person);

            if ( person.name ) ElevatorOnline.new_Person_to_Server(person).then( 
                (response)=>{ if ( response.sqlMessage ) alert('sqlMessage - ' + response.sqlMessage ) } );
        }
    }

    const del_Person = ()=>{
        if ( window.confirm('Delete Person - '+ name +', with id = '+ id ) ) ElevatorOnline.del_Person_from_Server(id);
    }

    const edit_Person = ()=>{

        ElevatorOnline.get_Firm_List({filter: 'all', sorted: 'name'}).then( (resolve)=>{
            setFirm(resolve); 
            console.log('get_Firm_List = ',resolve);
        } );

        ElevatorOnline.get_Elevator_List({filter: 'all', sorted: 'name'}).then( (resolve)=>{ 
            setElevator(resolve); 
            console.log('get_Elevator_List = ',resolve);
        } );

        setEdit(true);

    }
    const edit_Person_close = ()=>{
        if ( persons[selected].name ) { setP_name( persons[selected].name ) } else setP_name( '' );
        if ( persons[selected].surname ) { setP_surname( persons[selected].surname ) } else setP_surname( '' );
        if ( persons[selected].firm )  { setP_firm( persons[selected].firm ) } else setP_firm( '' );
        if ( persons[selected].elevator )  { setP_elevator( persons[selected].elevator ) } else setP_elevator( '' );
        if ( persons[selected].position )  { setP_position( persons[selected].position ) } else setP_position( '' );
        if ( persons[selected].phone ) { setP_phone( persons[selected].phone ) } else setP_phone( '' );
        if ( persons[selected].comments ) { setP_comments( persons[selected].comments ) } else setP_comments( '' );
        setEdit(false);
    }
    const edit_Person_apply = ()=>{
        setEdit(false);
        persons[selected].name = p_name;
        persons[selected].surname = p_surname;
        persons[selected].firm = p_firm;
        persons[selected].elevator = p_elevator;
        persons[selected].position = p_position;
        persons[selected].phone = p_phone;
        persons[selected].comments = p_comments;
        ElevatorOnline.update_Person_to_Server( persons[selected] ).then(
            (response)=>{ if ( response.sqlMessage ) alert('sqlMessage - ' + response.sqlMessage ) } );
    }

    //console.log('elevators = ',elevators);

    return(
        <div>
            

        <div style={{ height: 300, width: '100%', overflow: 'auto' }} >
            
            <table className='myTable'>

            <thead>
                <tr>
                    <th>id</th>
                    <th>Name</th>
                    <th>Surname</th>
                    <th>Firm</th>
                    <th>Elevator</th>
                    <th>Position</th>
                    <th>Phone</th>
                    <th>Comments</th>
                </tr>
            </thead>

                <tbody>

                { ( persons ? persons.map((item ,row) => ( <Person_List_row item={item} row={row} selected={selected} callback={(data)=> selected_change(data) } callback_id={(data)=> setId(data)} callback_name={(data)=> setName(data)}/> )) : <></> ) }

                </tbody>
            </table>
        </div>

            <button onClick={new_Person}>New</button>
            <button disabled>Clone</button>
            <button onClick={del_Person}>Delete</button>
            <button onClick={edit_Person}>View / Edit</button>

            <div id="myModal" class="modal" style={{ display:  ( edit ? 'block' : 'none' )  }}>
                <div class="modal-content" style={{ width: '500px' }}>
                    <div class="modal-header">
                        <span class="close" onClick={edit_Person_close}>&times;</span>
                        <span>Person information</span>
                    </div>

                    <div class="modal-body">
                        <div className='inputMenu'>
                            <label>Name</label>
                            <input
                            style={{ width: '350px' }} 
                            value={p_name}
                            onChange={handle_p_name}
                            type="text" 
                            required
                            minlength="3"
                            />
                        </div>
                        <div className='inputMenu'>
                            <label>Surname</label>
                            <input
                            style={{ width: '350px' }} 
                            value={p_surname}
                            onChange={handle_p_surname}
                            type="text" 
                            required
                            minlength="3"
                            />
                        </div>
                        <div className='inputMenu'>
                            <label for="firm-select">Firm</label>
                            <select 
                                name="firm" id="firm-select"
                                style={{ width: '357px' }}  
                                value={p_firm}
                                onChange={handle_p_firm}
                                >
                                <option value=''>--Please choose an option--</option>
                                <option value='0'>--unknow--</option>
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
                                style={{ width: '357px' }}  
                                value={p_elevator}
                                onChange={handle_p_elevator}
                                >
                                <option value=''>--Please choose an option--</option>
                                <option value='0'>--unknow--</option>
                                {elevator.map(( value, index ) => (
                                    <option id={index} value={ value.id }>
                                        { value.elevator_name }
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='inputMenu'>
                            <label for="position-select">Position</label>
                            <select 
                                name="position" id="position-select"
                                style={{ width: '357px' }}
                                value={p_position}
                                onChange={handle_p_position}
                                >
                                <option value="">--Please choose an option--</option>
                                <option value='Director'>Director</option>
                                <option value='Manager'>Manager</option>
                                <option value='Accountant'>Accountant</option>
                                <option value='Weigher'>Weigher</option>
                                <option value='Warehouseman'>Warehouseman</option>
                                <option value='Storekeeper'>Storekeeper</option>
                                <option value='Head of laboratory'>Head of laboratory</option>
                                <option value='Laboratory assistant'>Laboratory assistant</option>
                                <option value='Inspector'>Inspector</option>
                                <option value='Other'>Other</option>
                            </select>
                        </div>
                        <div className='inputMenu'>
                            <label>Phone</label>
                            <input
                            style={{ width: '350px' }} 
                            value={p_phone}
                            onChange={handle_p_phone}
                            type="text" 
                            required
                            minlength="3"
                            />
                        </div>
                        <div className='inputMenu'>
                            <label>Comments</label>
                            <textarea 
                            style={{ width: '352px' }}
                            value={p_comments}
                            onChange={handle_p_comments}
                            rows="3"
                            />
                        </div>

                    </div>

                    <div class="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button 
                            className='myButton' 
                            style={{ width: '80px' }}
                            onClick={edit_Person_close}
                            >Cancel</button>
                        <button 
                            className='myButton'
                            style={{ width: '80px' }}
                            onClick={edit_Person_apply}
                            >Apply</button>
                    </div>

                </div>
            </div>

        </div>
        )
}

function Person_List_row( props ){
    let row = props.row;
    let item = props.item;
    let selected = props.selected;

    const handleClick = ()=>{
        props.callback_id(item.id);
        props.callback_name(item.name);
        props.callback(row);
    }

    const handleDoubleClick = ()=>{
        //props.callback_id(item.id);
        //props.callback_name(item.name);
        //props.callback(row);

    }

    return (
        <tr
            style={{ backgroundColor: ( selected == row ? 'lime' : '' )  }}
            onClick={handleClick}
        >
            <td>{ item.id }</td>
            <td>{ item.name }</td>
            <td>{ item.surname }</td>
            <td>{ item.firm_name }</td>
            <td>{ item.elevator_name }</td>
            <td>{ item.position }</td>
            <td>{ item.phone }</td>
            <td>{ item.comments }</td>
        </tr>
    )
}

//------------------------------------
function DateIsoToString( date ) {
    let result = date.getFullYear() + '-' + 
                ( date.getMonth() < 9 ? '0' : '' ) + ( date.getMonth() + 1 ) + '-' +
                ( date.getDate() < 10 ? '0' : '' ) + date.getDate();
    return result;
}