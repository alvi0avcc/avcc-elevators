import * as React from 'react';
import { Box, Button, Stack, Divider, Paper, TextField } from '@mui/material';
import { Elevators } from './elevators.js';

export default function ComplexSilKorpusTotal (props) {
    let ComplexName = Elevators.ComplexName;
    const[update,setUpdate] = React.useState(true);
    return (
        <>
        <br/>
        <div className='block' style={{ marginLeft: -20, marginRight: -15 }}>
            <div>
                <span>Summary information on Complex: <strong>{ComplexName}</strong> </span>
                <Button size='small' variant='outlined' onClick={ ()=> { setUpdate(!update) } }>Update</Button>
            </div>
        <br/>
        <ComplexKorpusTotalInfo/>
        <br/>
        <ComplexKorpusCargoInfo/>
        <br/>
        <span>Summary information on <strong>Complex</strong>.</span>
        <br/>
        <ComplexCargoInfo/>
        </div>
        </>
    );
}

function ComplexKorpusTotalInfo(){
    return (
        <Box>
        {Elevators.ComplexKorpusTotalInfo.map((name, index ) => (
                    <TextField
                      style={ { width : 260 } }
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
                      style={ { width : 260 } }
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
                      style={ { width : 260 } }
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
                      style={ { width : 260 } }
                      size='small' key = {index} value={name[0]+' = '+name[1]+' MT'} 
                    />))}
        </Box>
    )
}