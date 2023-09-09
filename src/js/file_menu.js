import React from 'react';
import {useEffect, useState} from "react";
import { Button, ButtonGroup, Stack, Divider, Box } from '@mui/material';
import { useContext } from 'react';
import { UpdateContext } from '../Main'
import { Elevators } from './elevators.js';
import * as iolocal from './iolocal';
import { User } from './user';
import ServerMenu from './server_menu';


export default function FileMenuButton(){
const [update, setUpdate] = useContext(UpdateContext);
const [updateView, setUpdateView] = React.useState(false);

const handleImport = (e)=>{
    iolocal.FileImport(e.target.files[0]).then( (result) => { Elevators.setElevators = result; setUpdate( !update ) } );
}

    //console.log('status = ',status);
    return (
    <>
    <ServerMenu/>

    <div className='blockLabel'>
        <div className='labelBlock'>
            <span>Local</span>
        </div>
        <br/>

    <Stack height={25} style={{ margin: 3 }} direction={'row'} justifyContent={'space-between'} >
        <Stack  spacing={1} direction={'row'} >
            <Button variant='outlined'
                style={{ width: 60, fontSize: 12}}
                onClick={ () => ( 
                Elevators.setElevators =  iolocal.OpenElevator() ,
                setUpdate( !update )
                ) }
            >Open</Button>
            <Button variant='outlined'
                style={{ width: 60, fontSize: 12}}
                onClick={ () => ( 
                iolocal.SaveElevator()
                )}
            >Save</Button>
        </Stack>
        
        <Stack spacing={1} direction={'row'}  >

            <Button variant='outlined' component="label"
                style={{ width: 60, fontSize: 12}}
                >Import
                <input hidden accept=".json" type="file" onChange={handleImport}/>
            </Button>

            <Button variant='outlined'
                style={{ width: 60, fontSize: 12}}
                onClick={ () => (
                iolocal.ExportWarehouse()
                ) }
            >Export</Button>

        </Stack>
    </Stack>
    </div>
    <Divider/>
    </>
    )
}