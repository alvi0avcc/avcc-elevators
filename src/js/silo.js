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
        Elevators.SetSiloCargoNatura = event.target.value;
        setValue(!value)
      }; 
    const ChangeDiam = (event) => {
        Elevators.SetSiloDimension_D = event.target.value;
        setValue(!value)
      };
    const ChangeH = (event) => {
        Elevators.SetSiloDimension_h1 = event.target.value;
        setValue(!value)
      };
    const Changeh2 = (event) => {
        Elevators.SetSiloDimension_h2 = event.target.value;
        setValue(!value)
      };
    const Changeh3 = (event) => {
        Elevators.SetSiloDimension_h3 = event.target.value;
        setValue(!value)
      };
    const ChangeOut = (event) => {
        Elevators.SetSiloDimension_out = event.target.value;
        setValue(!value)
      };  
    const ChangeSound = (event) => {
        Elevators.SetSiloDimension_Sound = event.target.value;
        setValue(!value)
      };
    const ChangeUllage = (event) => {
        Elevators.SetSiloUllage = event.target.value;
        setValue(!value)
      }; 
    return(
        <>
        <Stack direction= 'row'>
            <Stack>
            <Stack direction= 'row'>
                <TextField value={ Elevators.SiloName } label="Name" sx={{ p: 1 }} onChange={ChangeName} size='small' /> 
                <TextField value={ Elevators.SiloCargo.Name } label="Cargo" sx={{ p: 1 }} onChange={ChangeCargoName} size='small' />
            </Stack>
            <Stack direction= 'row'>
                <TextField 
                  value={ Elevators.SiloCargo.Natura }
                  label={ Elevators.SiloCargo.Natura > 100 ? "Test Weight (g/l)" : "Test Weight (Kg/hL)" }
                  sx={{ p: 1 }}
                  onChange={ChangeCargoNatura}
                  size='small' />
                <TextField style={{ backgroundColor: 'whitesmoke' }} value={ Elevators.SiloUllage } label="Ullage (m)" sx={{ p: 1 }} onChange={ChangeUllage} size='small' />
            </Stack>
            <Stack direction= 'row'>
                <TextField 
                  style={ { width : 210 } }
                  value={ Elevators.SiloDimension.Diameter } label="Diameter (m)" sx={{ p: 1 }} onChange={ChangeDiam} size='small'
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
                <TextField value={ Elevators.SiloDimension.h1 } label="Silo cylinder height (m)" sx={{ p: 1 }} onChange={ChangeH} size='small' />
            </Stack>
            <Stack direction= 'row'>
                <TextField value={ Elevators.SiloDimension.h2 } label="Roof cone height (m)" sx={{ p: 1 }} onChange={Changeh2} size='small' />
                <TextField value={ Elevators.SiloDimension.Sound } label="Measuring point level (m)" sx={{ p: 1 }} onChange={ChangeSound} size='small' />
            </Stack>
            <Stack direction= 'row'>
              <TextField value={ Elevators.SiloDimension.h3 } label="Bottom cone height (m)" sx={{ p: 1 }} onChange={Changeh3} size='small' />
              <TextField value={ Elevators.SiloDimension.out } label="Area of bottom out (m²)" sx={{ p: 1 }} onChange={ChangeOut} size='small' />
            </Stack>

            <Stack direction= 'row'>
                <TextField value={ Elevators.SiloVolume } label="Сargo volume (m³)" sx={{ p: 1 }} size='small' />
                <TextField style={{ backgroundColor: 'whitesmoke' }} value={ Elevators.SiloMass } label="Cargo weight (MT)" sx={{ p: 1 }} size='small' />
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
        <Divider/>
        <Box>
            Summary information on silos:
            <br/>
            <SiloTotalInfo/>
            <br/>
            <br/>
            <SiloCargoInfo/>
        </Box>
        </>
    )
}

function SiloTotalInfo(){
    return (
        <Box>
        {Elevators.SiloTotalInfo.map((name, index ) => (
                    <TextField
                      style={ { width : 300 } }
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
                      style={ { width : 300 } }
                      size='small' key = {index} value={name[0]+' = '+name[1]+' MT'} 
                    />))}
        </Box>
    )
}