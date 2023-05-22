import * as React from 'react';
import { UpdateContext } from '../Main'
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
import { tab } from '@testing-library/user-event/dist/tab';


function a11yProps(index) {
  return {
    id: `ComplexSiloTabs-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


function ComplexSiloTabs() {
  const [value, setValue] = React.useState(0);
  const [update, setUpdate] = React.useContext(UpdateContext);

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
                  <Tab key = {index} label={name} {...a11yProps(index)}/>))}
              </Tabs>
          </Box>

          <ComplexSiloInfo/>

      </Box>
      )
      } else return (<><br/>No silos</>);   
}

export default function ComplexSilo() { 
  const [update, setUpdate] = React.useContext(UpdateContext);
  
    return (
      <>
      <Stack direction= 'row' justifyContent={'space-between'} style={{ marginLeft: -10 }}>
            <Button
              variant="outlined"
              style={{ fontSize: 12 }}
              onClick={()=>{ Elevators.ComplexAdd(); setUpdate( !update ) }} >
                Add
            </Button>
            <Button
              variant="outlined"
              style={{ fontSize: 12 }}
              onClick={()=>{ Elevators.ComplexClone(); setUpdate( !update ) }} >
                Clone
            </Button>
            <Button
              variant="outlined" 
              style={{ fontSize: 12 }}
              onClick={()=>{Elevators.ComplexDel()  ; setUpdate( !update ) }}>
                Delete
            </Button>
            <Button 
              variant="outlined" 
              style={{ fontSize: 12 }}
              onClick={()=>{iolocal.SaveElevator() ; setUpdate( !update ) }}>
                Save 
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
              size='small'
              onChange={handleChange_ComplexStucture}
              inputProps={{ 'aria-label': 'controlled' }}
      />} label="Complex structure ( edit mode )" />

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
      if ( !state.CargoName ) stateColor = 'yellow';
      if ( state.Ullage < 0 ) stateColor = 'red';
      if ( state.Sound-state.Ullage > state.Height ) stateColor = 'red';
      if ( state.Sound-state.Ullage < 0 ) stateColor = 'red';
      if ( !state.Using) stateColor = 'grey';  
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
      //console.log('split = ',split);
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
          let row = Number(id.indexOf("row"));
          let col = Number(id.indexOf("col"));
          let row_txt = id.slice( row+4, col-1);
          let col_txt = id.slice( col+4 );
          row = Number(row_txt);
          col = Number(col_txt);
          Elevators.ComplexSiloUllageSet( row, col, Number(ullage));
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
                      <span style={{ fontSize: '0.6rem' }} ><strong>{Elevators.massaComplexSiloGet(index,index2).weight} (MT)</strong></span>
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
      if ( !array[index3] ) { return (<></>); }
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
                      style={ { width : 80, background: `${getStateUllage(array[index3])}`}}
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
                      <span style={{ fontSize: '0.6rem' }} ><strong>{Elevators.massaComplexSiloGet(index,index3).weight} (MT)</strong></span>
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
      <div className='block' style={{ marginLeft: -10, marginRight: -10 }}>
        <div> 
          <Stack direction='row' marginBottom={1}>
          <IconButton
            color="primary"
            aria-label="Edit Complex Name"
            component="label"
            onClick={() => { Dialogs.ComplexDialogShow(Elevators.ComplexName, 0); setUpdate( !update ) }}>
              <Tooltip title="Edit Complex Name">
                <SettingsTwoToneIcon />
              </Tooltip>
          </IconButton>

          <Stack direction='column' width={80}>
            <label
              for="type-silo-select"
              style={{ fontSize: '0.8rem' }}
              >Type of Silo:</label>
            <select
              name="type-silo"
              id="type-silo-select"
              value={type}
              onChange={handleChange}
              >
              <option value="square">square</option>
              <option value="circle">circle</option>
              <option value="star">star</option>
            </select>
          </Stack>

          </Stack>
          <TextField
            style={{ width : 120, marginBottom: 5 }}
            fullWidth
            value={qr} 
            label="Quantyti in row" size='small' type='number' 
            onChange={(e) => { setQR( e.currentTarget.value)  }}
          />

          <TextField id='CSilo_Height'
            style={{ width : 120, marginBottom: 5 }}
            fullWidth
            value={ H }
            label="Height (m)" size='small'
            onChange={(e) => { setH( e.currentTarget.value )  }}
          />
          <TextField id='CSilo_L' disabled = { !dimS_show }
            style={{ width : 120, marginBottom: 5 }}
            fullWidth
            value={ L }
            label="Length (m)" size='small'
            onChange={(e) => { setL( e.currentTarget.value )  }}
          />
          <TextField id='CSilo_W' disabled = { !dimS_show }
            style={{ width : 120, marginBottom: 5 }}
            fullWidth
            value={ W }
            label="Width (m)" size='small'
            onChange={(e) => { setW( e.currentTarget.value )  }}
          />
          <TextField id='CSilo_D' disabled = { dimS_show }
            style={{ width : 120, marginBottom: 5 }}
            fullWidth
            value={ D }
            label="Diameter (m)" size='small'
            onChange={(e) => { setD( e.currentTarget.value )  }}
          /> 
          <TextField id='CSilo_Conus'
            style={{ width : 120, marginBottom: 5 }}
            fullWidth
            value={ C }
            label="Conus Height (m)" size='small'
            onChange={(e) => { setC( e.currentTarget.value )  }}
          />
          
        </div>

        <Stack direction= 'row' justifyContent={'space-between'} sx={{ p: 1 }} >
          <Button
            variant="outlined" 
            style={{ fontSize: 12 }}
            onClick={()=>{ Elevators.ComplexSiloAdd( Number(qr), type, Number(H), Number(L), Number(W), Number(D), Number(C) ); setDim(!dim); setUpdate(!update) }} >
            Add row
          </Button>
          <Button 
            variant="outlined"
            disabled
            style={{ fontSize: 12 }}
            onClick={()=>{ Elevators.ComplexSiloClone(); setDim(!dim) }} >
            Clone row
          </Button>
          <Button 
            variant="outlined"  
            disabled
            style={{ fontSize: 12 }}
            onClick={()=>{Elevators.ComplexSiloDel(); setDim(!dim)  }}>
            Delete row 
          </Button>
        </Stack>
      </div>
      <div className='block' style={{ marginLeft: -10, marginRight: -10 }}>
        <Table callback={(data)=> props.callback(data) } />
      </div>
      </>
    )
    else return ( <></> );
  }
}