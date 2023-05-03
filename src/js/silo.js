import * as React from 'react';
import { UpdateContext } from '../App'
import { useContext } from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { Elevators } from './elevators.js';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import { Button, Stack, Divider, Paper } from '@mui/material';
import * as iolocal from './iolocal';
import Canvas from './silo_draw';
import * as Dialogs from './dialogs';


  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  
  function SiloTabs() {
    const [value, setValue] = React.useState(0);
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
      Elevators.SetSiloSelected = newValue;
    };
    if (Elevators.SiloFound){
    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile aria-label="Silo Tabs">
                    {Elevators.SiloList.map((name, index ) => (
                    <Tab key = {index} label={name} {...a11yProps(index)} />))}
                </Tabs>
            </Box>
            <Box sx={{ p: 2, width: '100%' }}>
                <SiloInfo/>
            </Box>
        </Box>
        )
        } else return (<><br/>No silos</>);   
  }

export default function Silo(){
    const [update, setUpdate] = useContext(UpdateContext);
    return (
        <>
        <Stack direction= 'row' justifyContent={'space-between'} style={{ margin: -10 }}>
            <Button
              variant="outlined"
              size='small'
              onClick={()=>{ Elevators.SiloAdd(); setUpdate( !update ) }} >
                Add
            </Button>
            <Button
              variant="outlined" 
              size='small'
              onClick={()=>{ Elevators.SiloClone(); setUpdate( !update ) }} >
                Clone
            </Button>
            <Button 
              variant="outlined"
              size='small' 
              onClick={()=>{Elevators.SiloDel()  ; setUpdate( !update ) }}>
                Delete
            </Button>
            <Button 
              variant="outlined" 
              size='small'
              onClick={()=>{iolocal.SaveElevator() ; setUpdate( !update ) }}>
                Save    
            </Button>
        </Stack>
        <SiloTabs/>
        </>
    )
}

function SiloInfo(){
    const [update, setUpdate] = useContext(UpdateContext);
    const [value, setValue] = React.useState(false);

    const ChangeName = (event) => {
        Elevators.SetSiloName = event.target.value;
        setUpdate( !update )
      };
    const ChangeCargoName = (event) => {
        Elevators.SetSiloCargoName = event.target.value;
        setValue(!value)
      };
    const ChangeCargoNatura = (event) => {
      if ( event.target.value >= 0 ) { Elevators.SetSiloCargoNatura = Number(event.target.value); }
        setValue(!value)
      }; 
    const ChangeDiam = (event) => {
      if ( event.target.value >= 0 ) { Elevators.SetSiloDimension_D = Number(event.target.value); }
        setValue(!value)
      };
    const ChangeH = (event) => {
      if ( event.target.value >= 0 ) { Elevators.SetSiloDimension_h1 = Number(event.target.value); }
        setValue(!value)
      };
    const Changeh2 = (event) => {
      if ( event.target.value >= 0 ) { Elevators.SetSiloDimension_h2 = Number(event.target.value); }
        setValue(!value)
      };
    const Changeh3 = (event) => {
      if ( event.target.value >= 0 ) { Elevators.SetSiloDimension_h3 = Number(event.target.value); }
        setValue(!value)
      };
    const ChangeOut = (event) => {
        if ( event.target.value >= 0 ) { Elevators.SetSiloDimension_out = Number(event.target.value); };
        setValue(!value)
      };  
    const ChangeSound = (event) => {
      if ( event.target.value >= 0 ) { Elevators.SetSiloDimension_Sound = Number(event.target.value); }
        setValue(!value)
      };
    const ChangeUllage = (event) => {
        Elevators.SetSiloUllage = Number(event.target.value);
        setValue(!value)
      }; 
    return(
        <>
        <Stack direction= 'row'>
            <Stack
            style={{ border: '1px solid #1976d2', borderRadius: 4, marginLeft: -35 }}
            >
            <Stack direction= 'row' style={{ marginTop: 7 }}>
                <TextField
                  value={ Elevators.SiloName }
                  label="Name" 
                  sx={{ p: 1 }}
                  style={ Elevators.SiloName == '' || Elevators.SiloName == null  ? {backgroundClip: 'content-box', backgroundColor: 'red'} :  {backgroundColor: ''} }
                  onChange={ChangeName} 
                  size='small' /> 
                <TextField 
                  value={ Elevators.SiloCargo.Name } 
                  label="Cargo" 
                  sx={{ p: 1 }}
                  style={ Elevators.SiloCargo.Name == '' || Elevators.SiloCargo.Name == null  ? {backgroundClip: 'content-box', backgroundColor: 'yellow'} :  {backgroundColor: ''} } 
                  onChange={ChangeCargoName} 
                  size='small' />
            </Stack>
            <Stack direction= 'row'>
                <TextField 
                  value={ Elevators.SiloCargo.Natura }
                  label={ Elevators.SiloCargo.Natura > 100 ? "Test Weight (g/l)" : "Test Weight (Kg/hL)" }
                  style={ Elevators.SiloCargo.Natura <= 10   ? {backgroundClip: 'content-box', backgroundColor: 'red'} :  {backgroundColor: ''} } 
                  sx={{ p: 1 }}
                  onChange={ChangeCargoNatura}
                  type='number'
                  size='small' />
                <TextField 
                  value={ Elevators.SiloUllage } 
                  style={ Elevators.SiloUllage <= 0   ? {backgroundClip: 'content-box', backgroundColor: 'yellow'} :  {backgroundClip: 'content-box', backgroundColor: 'whitesmoke'} }
                  label="Ullage (m)" 
                  sx={{ p: 1 }} 
                  type='number'
                  onChange={ChangeUllage} 
                  size='small' />
            </Stack>
            <Stack direction= 'row'>
                <TextField 
                  style={ Elevators.SiloDimension.Diameter <= 0   ? {width : 210, backgroundClip: 'content-box', backgroundColor: 'red'} :  {width : 210, backgroundClip: 'content-box', backgroundColor: ''} }
                  value={ Elevators.SiloDimension.Diameter } label="Diameter (m)" sx={{ p: 1 }} onChange={ChangeDiam} size='small'
                  type='number'
                  InputProps={{ 
                    endAdornment:
                      <IconButton color="primary" aria-label="Calculate Diameter from Area" component="label" onClick={() => {
                        Elevators.SetSiloDimension_D = Dialogs.RoundSqureToDiameter();
                         setUpdate( !update )
                          }}>
                        <Tooltip title="Calculate Diameter from Area">
                          <SettingsTwoToneIcon />
                        </Tooltip>
                      </IconButton> }}
                  />
                <TextField 
                  value={ Elevators.SiloDimension.h1 } 
                  label="Silo cylinder height (m)" 
                  style={ Elevators.SiloDimension.h1 <= 0   ? {backgroundClip: 'content-box', backgroundColor: 'red'} :  { backgroundClip: 'content-box', backgroundColor: ''} }
                  sx={{ p: 1 }} 
                  onChange={ChangeH} 
                  type='number'
                  size='small' />
            </Stack>
            <Stack direction= 'row'>
                <TextField 
                  value={ Elevators.SiloDimension.h2 } 
                  style={ Elevators.SiloDimension.h2 < 0   ? {backgroundClip: 'content-box', backgroundColor: 'red'} :  { backgroundClip: 'content-box', backgroundColor: ''} }
                  label="Roof cone height (m)" 
                  type='number'
                  sx={{ p: 1 }} 
                  onChange={Changeh2} 
                  size='small' />
                <TextField 
                  value={ Elevators.SiloDimension.Sound }
                  style={ Elevators.SiloDimension.Sound <= 0   ? {backgroundClip: 'content-box', backgroundColor: 'red'} :  { backgroundClip: 'content-box', backgroundColor: ''} } 
                  label="Measuring point level (m)" 
                  type='number'
                  sx={{ p: 1 }} 
                  onChange={ChangeSound} 
                  size='small' />
            </Stack>
            <Stack direction= 'row'>
              <TextField 
                value={ Elevators.SiloDimension.h3 } 
                style={ Elevators.SiloDimension.h3 <= 0   ? {backgroundClip: 'content-box', backgroundColor: 'yellow'} :  { backgroundClip: 'content-box', backgroundColor: ''} }
                label="Bottom cone height (m)" 
                type='number'
                sx={{ p: 1 }} 
                onChange={Changeh3} 
                size='small' />
              <TextField 
                value={ Elevators.SiloDimension.out } 
                style={ Elevators.SiloDimension.out <= 0   ? {backgroundClip: 'content-box', backgroundColor: 'yellow'} :  { backgroundClip: 'content-box', backgroundColor: ''} }
                label="Area of bottom out (m²)" 
                type='number'
                sx={{ p: 1 }} 
                onChange={ChangeOut} 
                size='small' />
            </Stack>

            <Stack direction= 'row'>
                <TextField 
                  value={ Elevators.SiloVolume } 
                  style={ Elevators.SiloVolume < 0 || Elevators.SiloVolume == null ? {backgroundClip: 'content-box', backgroundColor: 'yellow'} :  { backgroundClip: 'content-box', backgroundColor: ''} }
                  label="Cargo volume (m³)" 
                  sx={{ p: 1 }} 
                  size='small' />
                <TextField 
                  value={ Elevators.SiloMass } 
                  style={ Elevators.SiloMass <= 0 || Elevators.SiloMass == null ? {backgroundClip: 'content-box', backgroundColor: 'yellow'} :  { backgroundClip: 'content-box', backgroundColor: 'whitesmoke' } }
                  label="Cargo weight (MT)" 
                  sx={{ p: 1 }} 
                  size='small' />
            </Stack>
            </Stack>

            <Stack>
                <Box 
                    sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    '& > :not(style)': {
                     m: 1,
                    width: 400,
                    height: 320,
                    },
                     }}
                >
                    <Paper elevation={10} >
                        <Canvas/>
                    </Paper>
                </Box>
            </Stack>
        </Stack>
        <div className='block' style={{ marginLeft: -35, marginRight: -5 }}>
            Summary information on silos:
            <br/>
            <SiloTotalInfo/>
            <br/>
            <br/>
            <SiloCargoInfo/>
        </div>
        </>
    )
}

function SiloTotalInfo(){
    return (
        <Box>
        {Elevators.SiloTotalInfo.map((name, index ) => (
                    <TextField
                      style={ { width : 260 } }
                      multiline
                      size='small' key = {index} value={'№ '+name[0]+' - '+name[1]+' = '+name[2]+' MT'} 
                    />))}
        </Box>
    )
}

function SiloCargoInfo(){
    return (
        <Box>
        {Elevators.SiloCargoInfo.map((name, index ) => (
                    <TextField
                      style={ { width : 260 } }
                      multiline
                      size='small' key = {index} value={name[0]+' = '+name[1]+' MT'} 
                    />))}
        </Box>
    )
}