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


function Inspection_List_row( props ){
    let row = props.row;
    let item = props.item;
    let selected = props.selected;

    let date = new Date( item.order_date );

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
        props.callback_order_no(item.order_no);
        props.callback(row);
    }

    return (
        <tr 
            style={{ backgroundColor: ( selected == row ? 'lime' : '' )  }}
            onClick={handleClick}
        >
            <td style={{ fontSize: '50%' }}>{ item.id }</td>
            <td width={'20%'}>{ item.order_no }</td>
            <td align='center'>{ ( item.order_date ? ( date.getFullYear() +' '+ monthNames[ date.getMonth() ] + ' ' + date.getDate() ) : '') }</td>
            <td align='center'>{ item.order_time }</td>
            <td width={'40%'} style={{ fontSize: '70%'}}>{ item.order }</td>
            <td width={'10%'} align='center'>{ item.elevator_name }</td>
            <td width={'10%'} align='center'>{ item.client_name }</td>
            <td width={'10%'} align='center'>{ item.inspector_name + ' ' + item.inspector_surname }</td>
            <td align='center' style={{ fontSize: '70%'}}>{ status }</td>
            <td align='center' style={{ fontSize: '70%'}}>{ result }</td>
            <td style={{ fontSize: '50%'}}>{ item.comments }</td>
        </tr>
    )
}

export function Inspection_List ( props ){
    const [update, setUpdate] = useContext(UpdateContext);

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

    const [i_client, setI_client] = React.useState(inspections[0].client);
    const handle_i_client = (e)=>{
        console.log('i_client=',e.target.value);
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
        ElevatorOnline.get_Firm_List({filter: 'all', sorted: 'true'}).then( (resolve)=>{ setFirm(resolve); /*setI_client(resolve);*/ console.log('get_Firm_List = ',resolve); } );
        ElevatorOnline.get_Person_List( { filter: 'all', list: 'inspector', sorted: 'name' } ).then( (resolve)=>{ setInspector(resolve); console.log('get_Inspector_List = ',resolve); } );
       
        let date = DateIsoToString( new Date ( inspections[selected].order_date ) );

        console.log('selected inspection =',inspections[selected]);

        if ( inspections[selected].order_no ) { setI_number( inspections[selected].order_no ) } else setI_number( '' );
        if ( inspections[selected].order_date ) { setI_date( date ) } else setI_date( '' );
        if ( inspections[selected].order_time) { setI_time( inspections[selected].order_time) } else setI_time( '' );
        if ( inspections[selected].order) { setI_order( inspections[selected].order) } else setI_order( '' );
        if ( inspections[selected].elevator ) { 
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
                }
        if ( inspections[selected].client ) { setI_client( inspections[selected].client) } else setI_client( '' );
        if ( inspections[selected].inspector ) { setI_inspector( inspections[selected].inspector) } else setI_inspector( '' );
        if ( inspections[selected].status ) { setI_status( inspections[selected].status) } else setI_status( '' );
        if ( inspections[selected].result ) { setI_result( inspections[selected].result) } else setI_result( '' );
        if ( inspections[selected].comments ) { setI_comments( inspections[selected].comments) } else setI_comments( '' );

        setEdit(true);
    }

    const edit_Inspection_close = ()=>{
        setEdit(false);
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

        setEdit(false);

        ElevatorOnline.update_Inspection_to_Server( inspections[selected] , 'simple' );
    }

    const selected_change = (sel)=>{
        setSelected( sel );
        console.log('selected inspection = ',inspections[sel] );
    }

    const handleOpenInpection = (e)=>{
        console.log('current inspection = ',inspections[selected].id );
        console.log('elevator inspection = ',inspections[selected].elevator );
        ElevatorOnline.get_Elevator( inspections[selected].elevator ).then( ( resolve ) => { 
            console.log( 'get_Elevator from inspection = ',resolve ); 
            Elevators.setElevatorsFromServer =  resolve;
            //setSendServer( true );
            setUpdate( !update );
        } );
    }


    return(
        <div>

        <div style={{ height: 300, width: '100%', overflow: 'auto' }} >
            
            <table className='myTable'>

            <thead>
                <tr>
                    <th>id</th>
                    <th>order_no</th>
                    <th>order_date</th>
                    <th>order_time</th>
                    <th>order</th>
                    <th>elevator</th>
                    <th>client</th>
                    <th>inspector</th>
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
                    onClick={handleOpenInpection}
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
                            style={{ width: '300px' }}
                            //value={ ( inspector[i_inspector] ? inspector[i_inspector].phone : '' ) }
                            value={ inspectorPhone(i_inspector) }
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
                                readOnly
                            />
                        </div>
                        <div className='block'>
                        <div className='inputMenu'>
                            <label>Complex</label>
                            <label>found/not found</label>
                            <button>load empty tamplate</button>
                        </div>
                        <div className='inputMenu'>
                            <label>Silo</label>
                            <label>found/not found</label>
                            <button>load empty tamplate</button>
                        </div>
                        <div className='inputMenu'>
                            <label>Warehouse</label>
                            <label>found/not found</label>
                            <button>load empty tamplate</button>
                        </div>
                        </div>
                        <div className='inputMenu'>
                            <label>Elevator comments</label>
                            <textarea 
                                style={{ width: '301px' }}
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
                        <hr/>
                        <div className='inputMenu'>
                            <label>Inspection Status</label>
                            <select 
                                name="status" id="status-select"
                                style={{ width: '307px' }}
                                value={i_status}
                                onChange={handle_i_status}
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
                                value={i_result}
                                onChange={handle_i_result}
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
                                style={{ width: '301px' }}
                                value={i_comments}
                                onChange={handle_i_comments}
                                rows="3"
                            />
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