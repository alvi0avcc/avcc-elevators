import * as React from 'react';
import { UpdateContext } from '../App'
import { useContext, useRef } from 'react';
import { Box, Button, Stack, Divider, Paper, TextField } from '@mui/material';
import { Elevators } from './elevators.js';

export default function ComplexSilKorpusTotal (props) {
    const [update, setUpdate] =  React.useState(true);

    return (
        <>
        <br/>
        <Box>
        <span>Summary information on Complex: <strong>{props.name}</strong> </span>
        <Button variant='outlined' onClick={ ()=>{ setUpdate(!update) } }>Update Info</Button>
        <br/>
        <ComplexKorpusTotalInfo/>
        <br/>
        <ComplexKorpusCargoInfo/>
        <br/>
        <span>Summary information on <strong>Complex</strong>.</span>
        <br/>
        <ComplexCargoInfo/>
        </Box>
        </>
    );
}

function ComplexKorpusTotalInfo(){
    return (
        <Box>
        {Elevators.ComplexKorpusTotalInfo.map((name, index ) => (
                    <TextField
                      style={ { width : 300 } }
                      size='small' key = {index} value={'№ '+name[0]+' - '+name[1]+' = '+name[2]+' MT'} 
                    />))}
        </Box>
    )
}

function ComplexKorpusCargoInfo(){
    return (
        <Box>
        {Elevators.ComplexKorpusCargoInfo.map((name, index ) => (
                    <TextField
                      style={ { width : 300 } }
                      size='small' key = {index} value={name[0]+' = '+name[1]+' MT'} 
                    />))}
        </Box>
    )
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