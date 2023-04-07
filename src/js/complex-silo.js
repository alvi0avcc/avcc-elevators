import * as React from 'react';
import { UpdateContext } from '../App'
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { Elevators } from './elevators.js';
import TextField from '@mui/material/TextField';
import { Box, Button, Stack, Divider, Paper } from '@mui/material';
import * as iolocal from './iolocal';
import ComplexSiloTotal from './complex-silo-total';
import { styled } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Silo from './silo';
import Fade from "@mui/material/Fade";
import Switch from '@mui/material/Switch';
import * as Dialogs from './dialogs';
import clsx from 'clsx';
import Table from './complex_silo_table';


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
  const [update, setUpdate] = React.useContext(UpdateContext);
  
    return (
      <>
      <Stack spacing={1} direction= 'row' divider={<Divider orientation="vertical" flexItem />} justifyContent={'space-between'}>
            <Button variant="outlined" onClick={()=>{ Elevators.ComplexAdd(); setUpdate( !update ) }} >
                Add Complex
            </Button>
            <Button variant="outlined"
              onClick={()=>{ Elevators.ComplexClone(); setUpdate( !update ) }} >
                Clone Selected Complex
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

function ComplexSiloInfo(props) {
  
  const [updateSiloTotal, setUpdateSiloTotal] = React.useState();

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
      />} label="Complex structure ( edit mode )" />

    <Divider/>

      <ComplexSiloInfoTable show={checked} />
      <ComplexSiloInfoPlan show={!checked} />
    
      <Divider/>
        <ComplexSiloTotal/>
      <br/>
      <Divider/>
    </>
  );

  function ComplexSiloInfoPlan(propsPlan) {

    const getMargin = (type) => {
      if ( type == 'star' ) return `-20px`;
      else return `0`;
    }
    const getTransform1 = (type) => {
      if ( type == 'star' ) return `rotate(${45}deg)`;
      else return `rotate(${0}deg)`;
    }
    const getTransform2 = (type) => {
      if ( type == 'star' ) return `rotate(${-45}deg)`;
      else return `rotate(${0}deg)`;
    }

    const getForm = (type) => {
      if ( type == 'circle' ) return `50%`;
      else return ``;
    }

    const getState = (state) => {
      let stateColor = '';
      if ( !state.CargoName ) return stateColor = 'yellow';
      if ( state.Ullage < 0 ) return stateColor = 'red';
      if ( state.Sound-state.Ullage > state.Height ) return stateColor = 'red';
      if ( state.Sound-state.Ullage < 0 ) return stateColor = 'red';
      if ( !state.Using) return stateColor = 'grey';  
      return stateColor;  
    }

    const getStateUllage = (state) => {
      let stateColor = '';
      if ( !state.Using) return stateColor = '';
      if ( state.Ullage == 0 ) return stateColor = 'yellow';
      return stateColor;  
    }

    const getSize1 = (type) => {
      if ( type == 'star' ) return `75%`;
      else return ``;
    }

    const getSize2 = (type) => {
      if ( type == 'star' ) return `125%`;
      else return ``;
    }

    const getSplit = (split) => {
      if ( split == '' || split == null ) return `none`;
      else return `block`;
    }

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

    const widthByComplex = (data)=>{
      let max = 0;
      let split;
      for ( let i = 0; i < data.length; i++ )  {
          split = 0; 
          for ( let ii = 0; ii < data[i].length; ii++ ) { if ( data[i][ii].split != '' ) { split++ }; };
          if ( max <= (data[i].length - split/2) ) { max = data[i].length - split/2 };
        };
      max = max * ( 110 + 10 );
      console.log('split = ',split);
      return max;  
    }

    function SiloPaper(propsPaper){
      let array = propsPaper.array;
      let index = propsPaper.index;
      let index2 = propsPaper.index2;
      let index3 = index2 + 1; //used if .split is present

      if ( array[index2].split != '' ) {
        if ( array[index2 +1] ) {
          if ( array[index2 +1].split == '' ) return (<></>);
          if ( array[index2].Name != array[index2 +1].split ) return (<></>);
        };
      };


    function ShowSilo(propsSilo){
      const [ullageChange, setUllageChange] = React.useState(false);
      const handleChangeUllage = (event) =>{
          let ullage = event.currentTarget.value;
          let id = event.currentTarget.id;  
          //id: `silo-row-${index}/col-${index2}`,
          let row = id.indexOf("row");
          let col = id.indexOf("col");
          let row_txt = id.slice( row+4, col-1);
          let col_txt = id.slice( col+4 );
          row = Number(row_txt);
          col = Number(col_txt);
          Elevators.ComplexSiloUllageSet( row, col, ullage);
          array[index2].Ullage = event.currentTarget.value;
          setUllageChange(!ullageChange);
        }
        let splitName = '';
        if ( typeof(array[index2].split) == 'string' ) { splitName = array[index2].split; };
        if ( typeof(array[index2].split) == 'object' ) { splitName = ''; };
        let res =-1;
        if ( splitName != '' )  res = array.findIndex(array => array.Name == splitName );
        if ( splitName != '' && res != index2 ) return ( <></> );

      return (
      <>
          <Paper
                    style={{ height: 110, width : 110,
                    marginTop: `${getMargin(array[index2].Type)}`,
                    marginBottom: `${getMargin(array[index2].Type)}`,
                    transform: `${getTransform1(array[index2].Type)}`,
                    scale: `${getSize1(array[index2].Type)}`,
                    borderRadius: `${getForm(array[index2].Type)}`,
                    background: `${getState(array[index2])}`,
                    }}
                    elevation={5} >
                  <Stack
                    justifyContent={'space-between'}
                    direction='column'
                    style={ { height: 110, width : 110,
                    transform: `${getTransform2(array[index2].Type)}`,
                    scale: `${getSize2(array[index2].Type)}`
                     } }>  
                    <Stack 
                      justifyContent={'center'}
                      direction='row'>
                      <span><strong>№-{array[index2].Name}</strong></span>
                    </Stack >
                    <Stack 
                      justifyContent={'center'}
                      direction='row'>
                    <TextField 
                      style={ { width : 80, background: `${getStateUllage(array[index2])}`}}
                      size='small' label="Ullage (m)"
                      key = {index2} value={array[index2].Ullage} {...a11yProps(index, index2)}
                      disabled={ array[index2].Using ? false : true }
                      onChange={handleChangeUllage}
                    />
                    </Stack >
                    <Stack 
                      justifyContent={'center'}
                      direction='row'>
                    <span><strong>{array[index2].CargoName}</strong></span>
                    </Stack>
                    <Stack 
                      justifyContent={'center'}
                      direction='row'>
                      <span><strong>{Elevators.massaComplexSiloGet(index,index2).weight} (MT)</strong></span>
                    </Stack>
                  </Stack>
          </Paper>
      </>
    );
    };

    function ShowSplit(propsSplit){
      const [ullageChange2, setUllageChange2] = React.useState(false);
      const handleChangeUllage2 = (event) =>{
      let ullage = event.currentTarget.value;
      let id = event.currentTarget.id;
      //id: `silo-row-${index}/col-${index2}`,
      let row = id.indexOf("row");
      let col = id.indexOf("col");
      let row_txt = id.slice( row+4, col-1);
      let col_txt = id.slice( col+4 );
      row = Number(row_txt);
      col = Number(col_txt);
      Elevators.ComplexSiloUllageSet( row, col, ullage);
      array[index3].Ullage = event.currentTarget.value;
      setUllageChange2(!ullageChange2);
      propsSplit.callback(true);
    }


      if ( array[index2].split == '' ) { return (<></>); }
      else {
        if ( array[index2 +1] ) {
          if ( array[index2 +1].split == '' ) return (<></>);
          let splitName = '';
          if ( typeof(array[index2].split) == 'string' ) { splitName = array[index2].split; };
          if ( typeof(array[index2].split) == 'object' ) { splitName = ''; };
          let res = array.findIndex(array => array.Name == splitName );
          if ( res < index2 && res != -1 ) return ( <></> );
        };
      };

      return (
            <>
                <Paper
                    style={{ height: 110, width : 110,
                    transform: `${getTransform1(array[index3].Type)}`,
                    scale: `${getSize1(array[index3].Type)}`,
                    borderRadius: `${getForm(array[index3].Type)}`,
                    background: `${getState(array[index3])}`,
                    }}
                    elevation={5} >
                  <Stack
                    justifyContent={'space-between'}
                    direction='column'
                    style={ { height: 110, width : 110,
                    transform: `${getTransform2(array[index3].Type)}`,
                    scale: `${getSize2(array[index3].Type)}`
                     } }>  
                    <Stack 
                      justifyContent={'center'}
                      direction='row'>
                      <span><strong>№-{array[index3].Name}</strong></span>
                    </Stack >
                    <Stack 
                      justifyContent={'center'}
                      direction='row'>
                    <TextField 
                      style={ { width : 80,}}
                      size='small' label="Ullage (m)"
                      key = {index3} value={array[index3].Ullage} {...a11yProps(index, index3)}
                      onChange={handleChangeUllage2}
                      disabled={ array[index3].Using ? false : true }
                    />
                    </Stack >
                    <Stack 
                      justifyContent={'center'}
                      direction='row'>
                    <span><strong>{array[index3].CargoName}</strong></span>
                    </Stack>
                    <Stack 
                      justifyContent={'center'}
                      direction='row'>
                      <span><strong>{Elevators.massaComplexSiloGet(index,index3).weight} (MT)</strong></span>
                    </Stack>
                  </Stack>
                </Paper>
            </>
            );
    }

      return (
      <>
        <Stack direction= 'column' justifyContent={'center'}>
          <ShowSilo/>
          <ShowSplit/>
        </Stack>
      </>
      )
    }

    if ( propsPlan.show )
    return (
      <Box fullWidth style={ { overflow: 'auto' } } >
        <Stack spacing={1} direction= 'column' 
        style={ {
          width: widthByComplex(b) ,
        }}
        > 
          {List.map((name, index) => (
            <>
            <Stack spacing={1} direction= 'row' justifyContent={'center'} >
              {b[index].map((name2, index2, array ) => (

              <SiloPaper array={array} index={index} index2={index2} />

              ))}
            </Stack>
            </>    
          ))}
        </Stack>
      </Box> 
      )
    else return ( <></> );
  }

  function a11yProps(index, index2) {
    return {
      id: `silo-row-${index}/col-${index2}`,
      'aria-controls': `silo-tabpanel-${index}${index2}`,
    };
  }

  function ComplexSiloInfoTable(props) {
    const [update, setUpdate] = React.useContext(UpdateContext);
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
            InputProps={{ 
              endAdornment:
                <IconButton color="primary" aria-label="Edit Complex Name" component="label" onClick={() => {
                   Dialogs.ComplexDialogShow(Elevators.ComplexName, 0);
                   setUpdate( !update )
                    }}>
                  <Tooltip title="Edit Complex Name">
                    <SettingsTwoToneIcon />
                  </Tooltip>
                </IconButton> }}
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
            Delete Selected row silo  
          </Button>
        </Stack>

      <Table callback={(data)=> props.callback(data) } />

      </>
    )
    else return ( <></> );
  }
}