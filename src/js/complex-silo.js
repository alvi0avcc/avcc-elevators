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
import { findComplexSilo } from './complexsilo_draw';
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
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Silo from './silo';


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

  function a11yProps(index, index2) {
    return {
      id: `silo-tab-${index}${index2}`,
      'aria-controls': `silo-tabpanel-${index}${index2}`,
    };
  }

  function ComplexSiloInfoPlan(){
    let a = Elevators.ComplexSiloList;
    let b = Elevators.ComplexAll.Silo;
    let List = [];
    let List2 = [];
    if ( b ) {
          if ( b.length > 0 )
              for ( let i =0; i < b.length; i++ ) {
                      List.push( b[i][0].Type );
              }
    } 
    return (
    <>
     </>
     );
    return (
      <>
        <Stack spacing={5} direction= 'column' justifyContent={'space-between'}>
          {List.map((name, index) => (
            <>
            <Stack spacing={2} direction= 'row' justifyContent={'space-evenly'}>
              {b[index].map((name2, index2, array ) => (
                <Stack direction= 'column' justifyContent={'center'}>
                <TextField size='small' style={ { width : 100 } }
                  key = {index2} label={array[index].Name} {...a11yProps(index, index2)}
                />
                <TextField size='small' style={ { width : 100 } }
                  key = {index2} label={array[index].Type} {...a11yProps(index, index2)}
                />
                </Stack>
              ))}
            </Stack>
            </>    
          ))}
        </Stack>
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
    const [H, setH] = React.useState(25);
    const [C, setC] = React.useState(2.5);
    const [type, setType] = React.useState('square');
    const [dimS_show, setDimS_show] = React.useState(true);
    const handleChange = (event) => {
        if ( event.target.value == 'square' ) { setDimS_show ( true ) } else { setDimS_show ( false ) };
        setType(event.target.value);
      };

    function DrawCanvas(){
      const [open, setOpen] = React.useState(false);
      const handleClickOpen = () => { setOpen(true); };
      const handleCloseCancel = () => { setOpen(false); };
      const handleCloseOk = () => { 
        //console.log('SiloInfo.result.Name',SiloInfo.result.Name);
        Elevators.SetComplexSiloName( name, SiloInfo.row, SiloInfo.col ); 
        setOpen(false);
      };
      const [name, setName] = React.useState();
      const NameChange = (e) => { setName(e.currentTarget.value) };
      const [x, setX] = React.useState();
      const [y, setY] = React.useState();
      const [SiloInfo, setSiloInfo] = React.useState(Elevators.ComplexAll);
      const [res, setRes] = React.useState();

      function ToolTipSiloIfo(){
        let a = findComplexSilo( x, y )
        let result = 'Silo № - '+ a.result.Name;
        result = result + '  Cargo - ' + a.result.Cargo.Name;
        result = result + ' Test weight = ' + a.result.Cargo.Natura;
        result = result + ' Ullage = ' + a.result.Ullage;
        result  = result + ' row=' + a.row + ' - col=' + a.col;
        setRes ( result );
      }

      return (
        <>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', '& > :not(style)': { m: 1, width: 1000, height: 300, }  }}  >
          <Tooltip title={res} arrow placement="bottom"
          componentsProps={{
            tooltip: {
              sx: {
                fontSize: 15,
                bgcolor: 'common.black',
                '& .MuiTooltip-arrow': {
                  color: 'common.black',
                },
              },
            },
          }}
          >
            <Paper
              elevation={10}
                onMouseMove={ (e)=> { 
                  setX( e.nativeEvent.offsetX );
                  setY( e.nativeEvent.offsetY );
                  setSiloInfo( findComplexSilo( x, y ) );
                  ToolTipSiloIfo(); } }
              onClick={ (e)=>{
                setX( e.nativeEvent.offsetX );
                setY( e.nativeEvent.offsetY );
                console.log('clicked on = ',x,y);
                //let f = findComplexSilo( x, y );
                //setSiloInfo( f );
                setSiloInfo( findComplexSilo( x, y ) );
                console.log('SiloInfo = ',SiloInfo);
                //setName( f.result.Name );
                setName( SiloInfo.result.Name );
                setOpen(true) }}
              >
              <Canvas/>
            </Paper>
            </Tooltip>
          </Box>
          <ComplexSiloInfoPlan/>

        <Dialog open={open} onClose={handleCloseCancel}>
          <DialogTitle>Silo info</DialogTitle>
          <DialogContent>
            <Stack direction= 'row' justifyContent={'center'} alignItems={'center'} sx={{ p: 1 }}>
            <TextField
              value = { name }
              onChange={ NameChange }
              label="Silo Name" size='small'
              />
            <TextField
              value = { SiloInfo.Name }
              label="Cargo Name" size='small'
              /> 
            <TextField
              value = { SiloInfo.Name }
              label="Cargo Test Weight (g/l)" size='small'
              />  
            </Stack>
            <FormControl size='small' >
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

          <Stack direction= 'row' justifyContent={'center'} alignItems={'center'} sx={{ p: 1 }}>
            <TextField
              value = { SiloInfo.Name }
              label="Height of Silo (m)" size='small'
              />
            <TextField
              value = { SiloInfo.Name }
              label="Length of Silo (m)" size='small'
              /> 
            <TextField 
              value = { SiloInfo.Name }
              label="Width of Silo (m)" size='small'
              />  
            </Stack>

            <Stack direction= 'row' justifyContent={'center'} alignItems={'center'} sx={{ p: 1 }}>
            <TextField 
              value = { SiloInfo.Name }
              label="Reference point (m)" size='small'
              />
            <TextField
              value = { SiloInfo.Name }
              label="Ullage (m)" size='small'
              /> 
            <TextField
              value = { SiloInfo.Name }
              label="Diameter of Silo (m)" size='small'
              />  
            </Stack>

            <Stack direction= 'row' justifyContent={'center'} alignItems={'center'} sx={{ p: 1 }}>
            <TextField
              value = { SiloInfo.Name }
              label="Split" size='small'
              />
            <TextField
              value = { SiloInfo.Name }
              label="Linked" size='small'
              /> 
            <TextField
              value = { SiloInfo.Name }
              label="Use of not" size='small'
              />  
            </Stack>

            <Stack direction= 'row' justifyContent={'center'} alignItems={'center'} sx={{ p: 1 }}>
            <TextField
              fullWidth
              value = { SiloInfo.Name }
              label="Comments" size='small'
              />
            </Stack>

          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCancel}>Cancel</Button>
            <Button onClick={handleCloseOk}>Ok</Button>
          </DialogActions>
        </Dialog>
        </>
      );
    };

    if ( !props.show )
    return ( DrawCanvas() )
    else
    return (
      <>
        <Stack direction= 'row' justifyContent={'center'} sx={{ p: 1 }} >
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
          <Button size='small' variant='outlined' disabled
            onClick={() => { setDim(!dim) }}
            >Complex Auto size</Button>
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
          <Button variant="outlined" onClick={()=>{ Elevators.ComplexSiloAdd( qr, type, H, L, W, D, C ); setDim(!dim) }} >
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
      <DrawCanvas/>
      </>
    )
  }
}