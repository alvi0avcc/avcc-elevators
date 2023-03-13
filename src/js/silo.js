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


function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  
  export function SiloTabs() {
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
        } else return (<><br/>Силоса отсутствуют</>);   
  }

export default function Silo(){
    const {update, setUpdate} = useContext(UpdateContext);
    return (
        <>
        <Stack spacing={5} direction= 'row' divider={<Divider orientation="vertical" flexItem />} justifyContent={'space-between'}>
            <Button variant="outlined" onClick={()=>{ Elevators.SiloAdd(); setUpdate( !update ) }} >
                Add Silo
            </Button>
            <Button variant="outlined" onClick={()=>{ Elevators.SiloClone(); setUpdate( !update ) }} >
                Duplicate Selected Silo
            </Button>
            <Button variant="outlined" onClick={()=>{Elevators.SiloDel()  ; setUpdate( !update ) }}>
                Delele Selected Silo
            </Button>
            <Button variant="outlined" onClick={()=>{iolocal.SaveElevator() ; setUpdate( !update ) }}>
                Save All    
            </Button>
        </Stack>
        <SiloTabs/>
        </>
    )
}

function SiloInfo(){
    const {update, setUpdate} = useContext(UpdateContext);
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
    const Changeh = (event) => {
        Elevators.SetSiloDimension_h2 = event.target.value;
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
                <TextField value={ Elevators.SiloCargo.Natura } label="Test Weight (g/l)" sx={{ p: 1 }} onChange={ChangeCargoNatura} size='small' />
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
                <TextField value={ Elevators.SiloDimension.h2 } label="Roof cone height (m)" sx={{ p: 1 }} onChange={Changeh} size='small' />
                <TextField value={ Elevators.SiloDimension.Sound } label="Measuring point level (m)" sx={{ p: 1 }} onChange={ChangeSound} size='small' />
            </Stack>
            <Stack direction= 'row'>
                <TextField value={ Elevators.SiloVolume } label="Сargo volume (m^3)" sx={{ p: 1 }} size='small' />
                <TextField style={{ backgroundColor: 'whitesmoke' }} value={ Elevators.SiloMass } label="Cargo weight (mt)" sx={{ p: 1 }} size='small' />
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
                    height: 265,
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
            Сводная информация по силосам:
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
                      style={ { width : 500 } }
                      size='small' key = {index} label={name[0]+' - '+name[1]+' = '+name[2]+' mt'} 
                    />))}
        </Box>
    )
}

function SiloCargoInfo(){
    return (
        <Box>
        {Elevators.SiloCargoInfo.map((name, index ) => (
                    <TextField
                      style={ { width : 500 } }
                      size='small' key = {index} label={name[0]+' = '+name[1]+' mt'} 
                    />))}
        </Box>
    )
}