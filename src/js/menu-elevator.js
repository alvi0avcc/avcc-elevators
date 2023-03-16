import * as React from 'react';
import {useEffect, useState} from "react";
import { useContext } from 'react';
import { UpdateContext } from '../App'
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import * as Dialogs from './dialogs';
import { Elevators } from './elevators.js';
import ElevatorTab from './elevator-tab.js';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';



function ElevatorSelectMenu () {
    const {update, setUpdate} = useContext(UpdateContext);
    const [ElevatorName, SetElevatorName] = useState("");

    const handleChangeElevator = (event) => {
            SetElevatorName(event.target.value);
        };
    const handleClickElevatorMenu = (event, index) => {
            Elevators.setSelected = index;
            setUpdate ( !update )
        }
    return (
      <Stack direction= 'row' justifyContent={'space-between'} sx={{ p: 1 }} >
      <FormControl fullWidth size='small' style={ {width : 500 } }>
            <InputLabel  >Elevator Name</InputLabel> 
              <Select value={Elevators.ElevatorsName+' - '+Elevators.ElevatorsDate} label="Elevator Name" onChange = {handleChangeElevator} >
                {Elevators.ElevatorList.map((name, index ) => (
                  <MenuItem key={index+1} value={ name } onClick={ (event) => { handleClickElevatorMenu(event, index) }}>
                  { index+1 + ". " +  name}
                  </MenuItem>
                ))}
              </Select>
          </FormControl>
          <Button onClick={()=>{Elevators.ElevatorClone()  ; setUpdate( !update ) }}
            style={ {width : 180, height : 40 } }
            variant='outlined'>
            Duplicate Elevator</Button>
          <Button onClick={()=>{Elevators.ElevatorDel()  ; setUpdate( !update ) }}
            style={ {width : 180, height : 40 } }
            variant='outlined'>
            Delete Elevator</Button>
          </Stack>
    );
  };

function ElevatorMenuBase(){
  const {update, setUpdate} = useContext(UpdateContext);
  const [checked, setChecked] = React.useState(false);

  const handleChange_ElDet = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <>
      <ElevatorSelectMenu/>
      <TextField
                size='small'
              value={ Elevators.ElevatorsName }
              label="Elevator Name"
              sx={{ p: 1 }}
              InputProps={{ 
                endAdornment:
                  <IconButton color="primary" aria-label="Edit Elevator Name" component="label" onClick={() => {
                     Dialogs.ElevatorDialogShow(Elevators.ElevatorsName, 0);
                     setUpdate( !update )
                      }}>
                    <Tooltip title="Edit Elevator Name">
                      <SettingsTwoToneIcon />
                    </Tooltip>
                  </IconButton> }}
            />
            <TextField
              size='small'
              onChange={ (e) => { Elevators.setDate = e.currentTarget.value; setUpdate( !update ) } }
              value={ Elevators.ElevatorsDate }
              label="Inspection date"
              sx={{ p: 1 }}
              type = 'date'
            />
            <FormControlLabel control={
              <Checkbox 
              checked={checked}
              onChange={handleChange_ElDet}
              />
            } label="Show Elevator Details" />
            
            <ElevatorMenuDetail show={checked}/>
    </>
  )
}

function ElevatorMenuDetail(show){
  const {update, setUpdate} = useContext(UpdateContext);

  if ( !show.show ) return (<></>)
  else
return (
  <>
            <TextField
              size='small'
              onChange={ (e) => { Elevators.setAdress = e.currentTarget.value; setUpdate( !update ) } }
              value={ Elevators.ElevatorAdress }
              label="Elevator address"
              fullWidth 
              sx={{ p: 1 }}
            />
            <br/>
            <TextField
              size='small'
              onChange={ (e) => { Elevators.setOwner = e.currentTarget.value; setUpdate( !update ) } }
              value={Elevators.ElevatorOwner}
              label="Elevator owner"
              sx={{ p: 1 }}
            />
            <TextField
              size='small'
              onChange={ (e) => { Elevators.setClient = e.currentTarget.value; setUpdate( !update ) } }
              value={Elevators.ElevatorClient}
              label="Client by deposit"
              sx={{ p: 1 }}
            />
            <br/>
            <TextField
              size='small'
              onChange={ (e) => { Elevators.setContactName = e.currentTarget.value; setUpdate( !update ) } }
              value={Elevators.ElevatorContactName}
              label="Contact"
              sx={{ p: 1 }}
            />
            <TextField
              size='small'
              onChange={ (e) => { Elevators.setContactPosition = e.currentTarget.value; setUpdate( !update ) } }
              value={Elevators.ElevatorContactPosition}
              label="Position"
              sx={{ p: 1 }}
            />
            <TextField
              size='small'
              onChange={ (e) => { Elevators.setContactPhone = e.currentTarget.value; setUpdate( !update ) } }
              value={Elevators.ElevatorContactPhone}
              label="Phone"
              sx={{ p: 1 }}
            />
            <br/>
            <TextField
              size='small'
              onChange={ (e) => { Elevators.setInspectorName = e.currentTarget.value; setUpdate( !update ) } }
              value={Elevators.ElevatorInspectorName}
              label="Inspector"
              fullWidth
              sx={{ p: 1 }}
            />
            <br/>
            <TextField
              size='small'
              onChange={ (e) => { Elevators.setComments = e.currentTarget.value; setUpdate( !update ) } }
              value={Elevators.ElevatorComments}
              label="Comments"
              fullWidth
              sx={{ p: 1 }}
            />
  </>
)
}

export default function ElevatorMenu () {
    const {update, setUpdate} = useContext(UpdateContext);
    const [checked, setChecked] = React.useState(true);

    console.log( 'ElevatorMenu, Elevator.ElevatorsName = ', Elevators.ElevatorsName );
    console.log( 'ElevatorMenu, Elevator = ', Elevators );
    if ( Elevators.State == 'closed' ) return (<></>)
    else
    return (
      <>
        <Box component="main" sx={{ p: 2 }}>
            <ElevatorMenuBase/>
        </Box>

        <ElevatorTab />

      </>

    );
  }