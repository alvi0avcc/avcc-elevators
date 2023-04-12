import * as React from 'react';
import { Elevators } from './elevators.js';
import * as iolocal from './iolocal';
import * as Dialogs from './dialogs';
import FloorViewCanvas from './floor-draw-view.js';
import { Divider, Tab, Tabs, Button, TextField , IconButton, Tooltip } from '@mui/material';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';

export default function Floor(){
    const [update, setUpdate] = React.useState(true);
    return (
        <div>
            <FloorHeader updateState={update} callback={(data)=> setUpdate( data ) }/>
            <FloorSize updateState={update} callback={(data)=> setUpdate( data ) }/>
        </div>
    )
};

function a11yProps(index) {
    return {
      id: `floor-tab-${index}`,
      'aria-controls': `floor-tabpanel-${index}`,
    };
  }

function FloorHeader(propsHeader){
    const [valueTabFloor, setValueTabFloor] = React.useState(0);
    const [updateFloor, setUpdateFloor] = React.useState(true);
    const handleChangeFloor = (event, newValueTabFloor) => {
      setValueTabFloor(newValueTabFloor);
      Elevators.SetFloorSelected = newValueTabFloor;
      propsHeader.callback( !propsHeader.updateState );
    };
        

    return (
        <>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button 
                variant='outlined'
                size='small'
                onClick={ ()=>( Elevators.FloorAdd(), setUpdateFloor(!updateFloor) ) }
                >Add</Button>
            <Button 
                variant='outlined'
                size='small'
                onClick={()=>{ Elevators.FloorClone(); setUpdateFloor( !updateFloor ) }}
                >Clone</Button>
            <Button
                variant='outlined'
                size='small'
                onClick={()=>{ Elevators.FloorDel(); setUpdateFloor( !updateFloor ) }}
                >Delete</Button>
            <Button 
                variant='outlined'
                size='small'
                onClick={()=>{iolocal.SaveElevator() ; setUpdateFloor( !updateFloor ) }}
                >Save</Button>
        </div>
            <div sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={valueTabFloor} onChange={handleChangeFloor} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile aria-label="Floor Tabs">
                    {Elevators.FloorList.map((name, index ) => (
                    <Tab key = {index} label={name} {...a11yProps(index)} />))}
                </Tabs>
                <Divider/>
            </div>
        </>
    )
}

function FloorSize(propsSize){
    const [value, setValue] = React.useState(false);

    let Length = Elevators.FloorCurrentDimensions.Length;
    let Width = Elevators.FloorCurrentDimensions.Width;
    let Height = Elevators.FloorCurrentDimensions.Height;
    let Conus_height = Elevators.FloorCurrentDimensions.Conus_height;
    let Conus_L = Elevators.FloorCurrentDimensions.Conus_L;
    let Conus_W = Elevators.FloorCurrentDimensions.Conus_W;
    let Conus_X = Elevators.FloorCurrentDimensions.Conus_X;
    let Conus_Y = Elevators.FloorCurrentDimensions.Conus_Y;

    const Length_Change = (event) => {
        Length = event.target.value;
        Elevators.setFloorDimensions ( Length, Width , Height , Conus_height , Conus_L , Conus_W , Conus_X , Conus_Y );
        setValue(!value);
        };
    const Width_Change = (event) => {
        Width = event.target.value;
        Elevators.setFloorDimensions ( Length, Width , Height , Conus_height , Conus_L , Conus_W , Conus_X , Conus_Y );
        setValue(!value);
        };
    const Height_Change = (event) => {
        Height = event.target.value;
        Elevators.setFloorDimensions ( Length, Width , Height , Conus_height , Conus_L , Conus_W , Conus_X , Conus_Y );
        setValue(!value);
        };
    const Conus_height_Change = (event) => {
        Conus_height = event.target.value;
        Elevators.setFloorDimensions ( Length, Width , Height , Conus_height , Conus_L , Conus_W , Conus_X , Conus_Y );
        setValue(!value);
        };
    const Conus_L_Change = (event) => {
        Conus_L =event.target.value;
        Elevators.setFloorDimensions ( Length, Width , Height , Conus_height , Conus_L , Conus_W , Conus_X , Conus_Y );
        setValue(!value);
        };
    const Conus_W_Change = (event) => {
        Conus_W =event.target.value;
        Elevators.setFloorDimensions ( Length, Width , Height , Conus_height , Conus_L , Conus_W , Conus_X , Conus_Y );
        setValue(!value);
        };
    const Conus_X_Change = (event) => {
        Conus_X = event.target.value;
        Elevators.setFloorDimensions ( Length, Width , Height , Conus_height , Conus_L , Conus_W , Conus_X , Conus_Y );
        setValue(!value);
        };
    const Conus_Y_Change = (event) => {
        Conus_Y = event.target.value;
        Elevators.setFloorDimensions ( Length, Width , Height , Conus_height , Conus_L , Conus_W , Conus_X , Conus_Y );
        setValue(!value);
        };

    return (
        <>
        <div style={{ display: 'flex', flexDirection: 'row' }}>

        <div className='block'>
        <IconButton
            color="primary"
            aria-label="Edit Complex Name"
            component="label"
            onClick={() => { Dialogs.FloorDialogShow(Elevators.FloorName, 0); propsSize.callback( !propsSize.updateState ) }}>
              <Tooltip title="Edit Warehouse Name">
                <SettingsTwoToneIcon />
              </Tooltip>
          </IconButton>
        <br/>
        <TextField
        size='small'
        label='Длина'
        type='number'
        value={Elevators.FloorCurrentDimensions.Length}
        onChange={ Length_Change }
        ></TextField>

        <TextField
        style={{ marginTop: 7 }}
        size='small'
        label='Ширина'
        type='number'
        value={Elevators.FloorCurrentDimensions.Width}
        onChange={ Width_Change }
        ></TextField>

        <TextField
        style={{ marginTop: 7 }}
        size='small'
        label='Высота'
        type='number'
        value={Elevators.FloorCurrentDimensions.Height}
        onChange={ Height_Change }
        ></TextField>

        <TextField
        style={{ marginTop: 7 }}
        size='small'
        label='Глубина нижнего конуса'
        type='number'
        value={Elevators.FloorCurrentDimensions.Conus_height}
        onChange={ Conus_height_Change }
        ></TextField>

        <TextField
        style={{ marginTop: 7 }}
        size='small'
        label='длина окна нижнего конуса'
        type='number'
        value={Elevators.FloorCurrentDimensions.Conus_L}
        onChange={ Conus_L_Change }
        ></TextField>

        <TextField
        style={{ marginTop: 7 }}
        size='small'
        label='ширина окна нижнего конуса'
        type='number'
        value={Elevators.FloorCurrentDimensions.Conus_W}
        onChange={ Conus_W_Change }
        ></TextField>

        <TextField
        style={{ marginTop: 7 }}
        size='small'
        label='X нижнего конуса'
        type='number'
        value={Elevators.FloorCurrentDimensions.Conus_X}
        onChange={ Conus_X_Change }
        ></TextField>

        <TextField
        style={{ marginTop: 7 }}
        size='small'
        label='Y нижнего конуса'
        type='number'
        value={Elevators.FloorCurrentDimensions.Conus_Y}
        onChange={ Conus_Y_Change }
        ></TextField>

        </div>
            <div className='block'>
                <FloorViewCanvas/>
            </div>
        </div>

        </>
    )
}