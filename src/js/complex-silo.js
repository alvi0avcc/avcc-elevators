import * as React from 'react';
import { UpdateContext } from '../App'
import { useContext, useRef } from 'react';
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
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Silo from './silo';
import Fade from "@mui/material/Fade";
import ComplexDataGrid from './complex-silo-grid';
import Switch from '@mui/material/Switch';


function a11yProps(index) {
  return {
    id: `ComplexSiloTabs-${index}`,
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
            <Button variant="outlined" disabled
              onClick={()=>{ Elevators.ComplexClone(); setUpdate( !update ) }} >
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

  const [checked, setChecked] = React.useState(false);
  const handleChange_ComplexStucture = (event) => {
    setChecked(event.target.checked);
  }

  return (
    <>
    <FormControlLabel control={
      <Switch checked={checked}
              onChange={handleChange_ComplexStucture}
              inputProps={{ 'aria-label': 'controlled' }}
      />} label="Edit Complex structure" />

    <Divider/>

    <ComplexSiloInfoTable show={checked} />
    <ComplexSiloInfoPlan show={!checked} />
    
    </>
  );

  function ComplexSiloInfoPlan(props) {

    const [textToolTip, setTextToolTip] = React.useState();

    let b = Elevators.ComplexAll.Silo;
    let List = [];//список рядов с типом силосов
    if ( b ) {
          if ( b.length > 0 )
              for ( let i =0; i < b.length; i++ ) {
                      List.push( b[i][0].Type );
              }
    } 

    function ToolTipSiloInfo( a ){
      let result = 'Silo № - '+ a.result.Name;
      result = result + '  Cargo - ' + a.result.Cargo.Name;
      result = result + ' Test weight = ' + a.result.Cargo.Natura;
      result = result + ' Ullage = ' + a.result.Ullage;
      result  = result + ' row=' + a.row + ' - col=' + a.col;
      setTextToolTip ( result );
    }

    if ( props.show )
    return (
      <>
        <Stack spacing={1} direction= 'column' >
          {List.map((name, index) => (
            <>
            <Stack spacing={1} direction= 'row' justifyContent={'space-between'}>
              {b[index].map((name2, index2, array ) => (
                <Stack direction= 'column' justifyContent={'center'}>

                  <Tooltip title={textToolTip}>
                  <Paper style={ { height: 100, width : 100 }} elevation={5} >
                  <span>№-{array[index2].Name}</span>

                    <TextField size='small' label="Ullage (m)"
                      key = {index2} value={array[index2].Ullage} {...a11yProps(index, index2)}
                    />

                  <span>{array[index2].Type}</span>
                </Paper>
                </Tooltip>

                </Stack>
              ))}
            </Stack>
            </>    
          ))}
        </Stack>

      </> 
      )
    else return ( <></> );
  }

  function a11yProps(index, index2) {
    return {
      id: `silo-${index}/${index2}`,
      'aria-controls': `silo-tabpanel-${index}${index2}`,
    };
  }

  function ComplexSiloInfoTable(props) {
    const [update, setUpdate] = useContext(UpdateContext);
    const [qr, setQR] = React.useState(10);
    const [dim, setDim] = React.useState(false);
    const [L, setL] = React.useState(6);
    const [W, setW] = React.useState(6);
    const [D, setD] = React.useState(6);
    const [H, setH] = React.useState(25);
    const [C, setC] = React.useState(2.5);
    const [type, setType] = React.useState('square');
    const [dimS_show, setDimS_show] = React.useState(true);
    const handleChange = (event) => {
        if ( event.target.value == 'square' ) { setDimS_show ( true ) } else { setDimS_show ( false ) };
        setType(event.target.value);
      };
    
    if ( props.show )
    return (
      <>
        <Stack direction= 'row' justifyContent={'center'} sx={{ p: 1 }} >
          <TextField
            value={ Elevators.ComplexName } label="Complex Name" size='small'
            onChange={(e) => { Elevators.SetComplexName = e.currentTarget.value; setUpdate( !update ) }}
          />
          <TextField style={ {width : 130 } } 
            value={Elevators.ComplexDimension.Length}
            label="Complex length (m)" size='small'
            onChange={(e) => { Elevators.setComplexDimension_Length = Number( e.currentTarget.value ); setDim(!dim) }}
          />
          <TextField style={ {width : 130 } }
            value={Elevators.ComplexDimension.Width}
            label="Complex width (m)" size='small'
            onChange={(e) => { Elevators.setComplexDimension_Width = Number( e.currentTarget.value ); setDim(!dim) }}
          />
          <TextField style={ {width : 130 } }
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
            value={qr} 
            label="Quantyti in row" size='small' type='number' style={ {  width : 150 } }
            onChange={(e) => { setQR( e.currentTarget.value)  }}
          />
        </Stack>

        <Stack direction= 'row' justifyContent={'center'} alignItems={'center'} sx={{ p: 1 }} >
          <TextField id='CSilo_Height'
            value={ H }
            label="Height of Silo (m)" size='small' style={ {width : 150 } }
            onChange={(e) => { setH( e.currentTarget.value )  }}
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
          <TextField id='CSilo_Conus'
            value={ C }
            label="Conus Height (m)" size='small' style={ {width : 150 } }
            onChange={(e) => { setC( e.currentTarget.value )  }}
          />
          
        </Stack>
        <Stack direction= 'row' justifyContent={'space-between'} sx={{ p: 1 }} >
          <Button variant="outlined" onClick={()=>{ Elevators.ComplexSiloAdd( qr, type, H, L, W, D, C ); setDim(!dim); setUpdate(!update) }} >
            Add row silo
          </Button>
          <Button variant="outlined" disabled
            onClick={()=>{ Elevators.ComplexSiloClone(); setDim(!dim) }} >
            Clone Selected row silo
          </Button>
          <Button variant="outlined"  disabled
            onClick={()=>{Elevators.ComplexSiloDel(); setDim(!dim)  }}>
            Delele Selected row silo  
          </Button>
        </Stack>

      <ComplexDataGrid/>

      </>
    )
    else return ( <></> );
  }
}