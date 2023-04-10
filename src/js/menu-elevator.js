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
    const [update, setUpdate] = useContext(UpdateContext);
    const [ElevatorName, SetElevatorName] = useState("");

    const handleChangeElevator = (event) => {
      Elevators.setSelected = event.target.selectedIndex;
      SetElevatorName(event.target.value);
      setUpdate ( !update );
      };
    const handleClickElevatorMenu = (event, index) => {
            Elevators.setSelected = index;
            console.log('handleClickElevatorMenu2 = ',event);
            //SetElevatorName(event.target.value);
            setUpdate ( !update )
        }
    return (
      <div
      className='block'
      style={{ padding: 7 }}
      >
        <div>
          <div
            className='block'
            style={{  height: 32, maxWidth: 300  }}
            fullWidth
            >
            <label 
            style={{ width: 100, fontSize: '0.8rem', marginTop: -12, backgroundColor: 'white' }}
            >Selected Elevator</label>
            <select 
              style={{ borderStyle: 'none' }}
              value={Elevators.ElevatorsName + ' - ' + Elevators.ElevatorsDate}
              onChange = {handleChangeElevator}
              >
                {Elevators.ElevatorList.map((name, index ) => (
                  <option key={index+1} value={ name }>
                  { index+1 + ". " +  name}
                  </option>
                ))}
            </select>
          </div>
          <div style={{ padding: 2 }}>
          <Button onClick={()=>{
            Elevators.AddElevator();
            Elevators.State = 'add new Elevator';
            setUpdate( !update ) }}
            style={ {width : 101, height : 30 } }
            variant='outlined'>
            New</Button>
          <Button onClick={()=>{Elevators.ElevatorClone()  ; setUpdate( !update ) }}
            style={ {width : 101, height : 30 } }
            variant='outlined'>
            Clone</Button>
          <Button onClick={()=>{Elevators.ElevatorDel()  ; setUpdate( !update ) }}
            style={ {width : 101, height : 30 } }
            variant='outlined'>
            Delete</Button>
          </div>
          </div>
      </div>
    );
  };

function ElevatorMenuBase(){
  const [update, setUpdate] = useContext(UpdateContext);
  const [checked, setChecked] = React.useState(false);

  const handleChange_ElDet = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <>
      <ElevatorSelectMenu/>
      <div
      className='block'
      style={{ paddingTop: 8 }}
      >
      <div style={{ padding: 7 }}>
            <TextField
              style={{ maxWidth: 305, marginBottom: 6}}
              size='small'
              fullWidth
              value={ Elevators.ElevatorsName }
              label="Elevator Name"
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
              style={{ maxWidth: 305}}
              fullWidth
              size='small'
              onChange={ (e) => { Elevators.setDate = e.currentTarget.value; setUpdate( !update ) } }
              value={ Elevators.ElevatorsDate }
              label="Inspection date"
              type = 'date'
            />
            </div>
            <FormControlLabel control={
              <Checkbox 
              size='small'
              checked={checked}
              onChange={handleChange_ElDet}
              />
            } label="Show Elevator Details" />
            
            <ElevatorMenuDetail show={checked}/>
      </div>
    </>
  )
}

function ElevatorMenuDetail(props){
  const [update, setUpdate] = useContext(UpdateContext);

  if ( !props.show ) return (<></>)
  else
return (
  <div
  style={{ padding: 2, margin: 5}}
  >
            <TextField
              size='small'
              onChange={ (e) => { Elevators.setAdress = e.currentTarget.value; setUpdate( !update ) } }
              value={ Elevators.ElevatorAdress }
              label="Elevator address"
              fullWidth
            />
            <TextField
              size='small'
              onChange={ (e) => { Elevators.setOwner = e.currentTarget.value; setUpdate( !update ) } }
              value={Elevators.ElevatorOwner}
              label="Elevator owner"
              fullWidth
              style={{ marginTop: 7 }}
            />
            <TextField
              size='small'
              onChange={ (e) => { Elevators.setClient = e.currentTarget.value; setUpdate( !update ) } }
              value={Elevators.ElevatorClient}
              label="Client by deposit"
              fullWidth
              style={{ marginTop: 7 }}
            />
            <TextField
              size='small'
              onChange={ (e) => { Elevators.setContactName = e.currentTarget.value; setUpdate( !update ) } }
              value={Elevators.ElevatorContactName}
              label="Contact"
              fullWidth
              style={{ marginTop: 7 }}
            />
            <TextField
              size='small'
              onChange={ (e) => { Elevators.setContactPosition = e.currentTarget.value; setUpdate( !update ) } }
              value={Elevators.ElevatorContactPosition}
              label="Position"
              fullWidth
              style={{ marginTop: 7 }}
            />
            <TextField
              size='small'
              onChange={ (e) => { Elevators.setContactPhone = e.currentTarget.value; setUpdate( !update ) } }
              value={Elevators.ElevatorContactPhone}
              label="Phone"
              fullWidth
              style={{ marginTop: 7 }}
            />
            <TextField
              size='small'
              onChange={ (e) => { Elevators.setInspectorName = e.currentTarget.value; setUpdate( !update ) } }
              value={Elevators.ElevatorInspectorName}
              label="Inspector"
              fullWidth
              style={{ marginTop: 7 }}
            />
            <TextField
              size='small'
              onChange={ (e) => { Elevators.setComments = e.currentTarget.value; setUpdate( !update ) } }
              value={Elevators.ElevatorComments}
              label="Comments"
              fullWidth
              style={{ marginTop: 7 }}
            />
  </div>
)
}

export default function ElevatorMenu () {
    const [update, setUpdate] = useContext(UpdateContext);
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