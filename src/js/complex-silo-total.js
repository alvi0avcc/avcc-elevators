import * as React from 'react';
import { UpdateContext } from '../App'
import { useContext, useRef } from 'react';
import { Box, Button, Stack, Divider, Paper, TextField } from '@mui/material';
import { Elevators } from './elevators.js';

export default function ComplexSiloTotal () {
    const [update, setUpdate] =  React.useState(true);

    return (
        <>
        <br/>
        <Box>
        <span>Summary information on Complex:</span>
        <Button variant='outlined' onClick={ ()=>{ setUpdate(!update) } }>Update Info</Button>
        <br/>
        <ComplexTotalInfo/>
        <br/>
        <br/>
        <ComplexCargoInfo/>
        </Box>
        </>
    );
}

function ComplexTotalInfo(){
    return (
        <Box>
        {Elevators.ComplexTotalInfo.map((name, index ) => (
                    <TextField
                      style={ { width : 300 } }
                      size='small' key = {index} value={'№ '+name[0]+' - '+name[1]+' = '+name[2]+' MT'} 
                    />))}
        </Box>
    )
}

function ComplexCargoInfo(){
    return (
        <Box>
        {Elevators.ComplexCargoInfo.map((name, index ) => (
                    <TextField
                      style={ { width : 300 } }
                      size='small' key = {index} value={name[0]+' = '+name[1]+' MT'} 
                    />))}
        </Box>
    )
}