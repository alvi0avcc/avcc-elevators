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
import { Button, Stack, Divider, Paper } from '@mui/material';
import * as iolocal from './iolocal';
import Canvas from './complexsilo_draw';
import { Draw1 } from './complexsilo_draw';
import * as Dialogs from './dialogs';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Block } from '@mui/icons-material';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


function ComplexSiloTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    Elevators.SetComplexSelected = newValue;
  };
  if (Elevators.ComplexFound > 0 ){
  return (
      <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile aria-label="ComplexSilo Tabs">
                  {Elevators.ComplexList.map((name, index ) => (
                  <Tab key = {index} label={name} {...a11yProps(index)} />))}
              </Tabs>
          </Box>
          <Box sx={{ p: 2, width: '100%' }}>
            <ComplexSiloInfo/>
          </Box>
      </Box>
      )
      } else return (<><br/>No silos</>);   
}

export default function ComplexSilo() {
  const [update, setUpdate] = useContext(UpdateContext);
  
    return (
      <>
      <Stack spacing={5} direction= 'row' divider={<Divider orientation="vertical" flexItem />} justifyContent={'space-between'}>
            <Button variant="outlined" onClick={()=>{ Elevators.ComplexAdd(); setUpdate( !update ) }} >
                Add Complex
            </Button>
            <Button variant="outlined" onClick={()=>{ Elevators.ComplexClone(); setUpdate( !update ) }} >
                Duplicate Selected Complex
            </Button>
            <Button variant="outlined" onClick={()=>{Elevators.ComplexDel()  ; setUpdate( !update ) }}>
                Delele Selected Complex
            </Button>
            <Button variant="outlined" onClick={()=>{iolocal.SaveElevator() ; setUpdate( !update ) }}>
                Save All    
            </Button>
        </Stack>
        <ComplexSiloTabs/>
      </>
    );
};

function ComplexSiloInfo() {
  const [update, setUpdate] = useContext(UpdateContext);
  const [value, setValue] = React.useState(false);
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  const [checked, setChecked] = React.useState(true);
  const handleChange_ComplexStucture = (event) => {
    setChecked(event.target.checked);
  }

  return (
    <>
    <Stack spacing={5} direction= 'row' justifyContent={'space-between'}>
      <TextField
          value={ Elevators.ComplexName } label="Complex Name" sx={{ p: 1 }} size='small'
          onChange={(e) => { Elevators.SetComplexName = e.currentTarget.value; setUpdate( !update ) }}
      />
      <FormControlLabel control={
              <Checkbox 
              checked={checked}
              onChange={handleChange_ComplexStucture}
              />
            } label="Edit Complex structure" />
    </Stack>
    <Divider/>
    <ComplexSiloInfoHeaderButtons show={checked} />

      

      
    </>
  );

  function ComplexSiloInfoPlan(){
    return (
      <>

      </>
    )
  };

  function ComplexSiloInfoPlan(){
    return (
      <>

      </>
    )
  };

  function ComplexSiloInfoHeaderButtons(props) {
    const [update, setUpdate] = useContext(UpdateContext);
    const [qr, setQR] = React.useState(10);
    const [dim, setDim] = React.useState(false);
    const [L, setL] = React.useState(6);
    const [W, setW] = React.useState(6);
    const [D, setD] = React.useState(6);
    const [type, setType] = React.useState('square');
    const [dimS_show, setDimS_show] = React.useState(true);
    const handleChange = (event) => {
        if ( event.target.value == 'square' ) { setDimS_show ( true ) } else { setDimS_show ( false ) };
        setType(event.target.value);
      };

    function DrawCanvas(){
      return (
        <>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', '& > :not(style)': { m: 1, width: 1000, height: 300, }  }}  >
            <Paper elevation={5} >
              <Canvas/>
            </Paper>
          </Box>
        </>
      );
    };

    if ( !props.show )
    return ( DrawCanvas() )
    else
    return (
      <>
        <Stack direction= 'row' justifyContent={'space-between'} sx={{ p: 1 }} >
        <TextField
            value={Elevators.ComplexDimension.Length}
            label="Complex length (m)" size='small'
            onChange={(e) => { Elevators.setComplexDimension_Length = Number( e.currentTarget.value ); setDim(!dim) }}
          />
          <TextField
            value={Elevators.ComplexDimension.Width}
            label="Complex width (m)" size='small'
            onChange={(e) => { Elevators.setComplexDimension_Width = Number( e.currentTarget.value ); setDim(!dim) }}
          />
          <TextField
            value={Elevators.ComplexDimension.Height}
            label="Complex height (m)" size='small'
            onChange={(e) => { Elevators.setComplexDimension_Height = Number( e.currentTarget.value ); setDim(!dim) }}
          />
        </Stack>

        <Stack direction= 'row' justifyContent={'center'} alignItems={'center'} sx={{ p: 1 }} > 
          <FormControl>
          <FormLabel id="radio-buttons-group-typeSilo">Type of Silo</FormLabel>
          <RadioGroup
            row
            aria-labelledby="radio-buttons-group-typeSilo"
            name="adio-buttons-group-typeSilo"
            value={type}
            onChange={handleChange} 
          >
            <FormControlLabel value="square" control={<Radio size='small'/>} label="square" />
            <FormControlLabel value="circle" control={<Radio size='small'/>} label="circle" />
            <FormControlLabel value="star" control={<Radio size='small'/>} label="star" />
          </RadioGroup>
          </FormControl>

          <TextField
            value={qr} sx={{ p: 1 }}
            label="Quantyti in row" size='small' type='number' style={ {  width : 150 } }
            onChange={(e) => { setQR( e.currentTarget.value)  }}
          />

          <TextField id='CSilo_L' disabled = { !dimS_show }
            value={ L }
            label="Length of Silo (m)" size='small' style={ {width : 150 } }
            onChange={(e) => { setL( e.currentTarget.value )  }}
          />
          <TextField id='CSilo_W' disabled = { !dimS_show }
            value={ W }
            label="Width of Silo (m)" size='small' style={ {width : 150 } }
            onChange={(e) => { setW( e.currentTarget.value )  }}
          />
          <TextField id='CSilo_D' disabled = { dimS_show }
            value={ D }
            label="Diameter of Silo (m)" size='small' style={ {width : 150 } }
            onChange={(e) => { setD( e.currentTarget.value )  }}
          /> 

        </Stack>

        <Stack direction= 'row' justifyContent={'space-between'} sx={{ p: 1 }} >
          <Button variant="outlined" onClick={()=>{ Elevators.ComplexSiloAdd( qr, type, L, W, D ); setDim(!dim) }} >
            Add row silo
          </Button>
          <Button variant="outlined" onClick={()=>{ Elevators.ComplexSiloClone(); setDim(!dim) }} >
            Clone Selected row silo
          </Button>
          <Button variant="outlined" onClick={()=>{Elevators.ComplexSiloDel(); setDim(!dim)  }}>
            Delele Selected row silo  
          </Button>
        </Stack>
      <DrawCanvas/>
      </>
    )
  }
}