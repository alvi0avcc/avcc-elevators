import * as React from 'react';
import { Elevators } from './elevators.js';
import * as iolocal from './iolocal';
import * as Dialogs from './dialogs';
import FloorViewCanvas from './floor-draw-view.js';
import PileViewCanvas from './pile-draw-view.js';
import { Divider, Tab, Tabs, Button, TextField , IconButton, Tooltip } from '@mui/material';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';

export default function Floor(){
    const [update, setUpdate] = React.useState(true);
    return (
        <div>
            <FloorHeader updateState={update} callback={(data)=> setUpdate( data ) }/>
            { Elevators.FloorFound ?  <FloorSize updateState={update} callback={(data)=> setUpdate( data ) }/> : '' }

            <div
                className='block'
                style={{ display: `${ Elevators.FloorFound ? 'block' : 'none' }`, marginTop: 10 }}
                >
                <PilesHeader updateState={update} callback={(data)=> setUpdate( data ) }/>
                { Elevators.PileFound ?  <Piles updateState={update} callback={(data)=> setUpdate( data ) }/> : '' }
            </div>
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
                onClick={ (e)=>( Elevators.FloorAdd(), setUpdateFloor(!updateFloor), propsHeader.callback( !propsHeader.updateState ) ) }
                >Add</Button>
            <Button 
                variant='outlined'
                disabled = { Elevators.FloorFound ? false : true }
                size='small'
                onClick={()=>( Elevators.FloorClone(), setUpdateFloor(!updateFloor), propsHeader.callback( !propsHeader.updateState ) )}
                >Clone</Button>
            <Button
                variant='outlined'
                disabled = { Elevators.FloorFound ? false : true }
                size='small'
                onClick={()=>( Elevators.FloorDel(), setUpdateFloor(!updateFloor), propsHeader.callback( !propsHeader.updateState ) )}
                >Delete</Button>
            <Button 
                variant='outlined'
                size='small'
                onClick={()=>( iolocal.SaveElevator(), setUpdateFloor(!updateFloor) )}
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

    let Length = 0;
    let Width = 0;
    let Height = 0;
    let Conus_height = 0;
    let Conus_L = 0;
    let Conus_W = 0;
    let Conus_X = 0;
    let Conus_Y = 0;

    if ( Elevators.FloorFound ) {
        Length = Elevators.FloorCurrentDimensions.Length;
        Width = Elevators.FloorCurrentDimensions.Width;
        Height = Elevators.FloorCurrentDimensions.Height;
        Conus_height = Elevators.FloorCurrentDimensions.Conus_height;
        Conus_L = Elevators.FloorCurrentDimensions.Conus_L;
        Conus_W = Elevators.FloorCurrentDimensions.Conus_W;
        Conus_X = Elevators.FloorCurrentDimensions.Conus_X;
        Conus_Y = Elevators.FloorCurrentDimensions.Conus_Y;
    };

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

        <div 
            className='block'
            style={{ minWidth: 150 }}
            >
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
        value={Length}
        onChange={ Length_Change }
        ></TextField>

        <TextField
        style={{ marginTop: 7 }}
        size='small'
        label='Ширина'
        type='number'
        value={Width}
        onChange={ Width_Change }
        ></TextField>

        <TextField
        style={{ marginTop: 7 }}
        size='small'
        label='Высота'
        type='number'
        value={Height}
        onChange={ Height_Change }
        ></TextField>

        <TextField
        style={{ marginTop: 7 }}
        size='small'
        label='Глубина нижнего конуса'
        type='number'
        value={Conus_height}
        onChange={ Conus_height_Change }
        ></TextField>

        <TextField
        style={{ marginTop: 7 }}
        size='small'
        label='длина окна нижнего конуса'
        type='number'
        value={Conus_L}
        onChange={ Conus_L_Change }
        ></TextField>

        <TextField
        style={{ marginTop: 7 }}
        size='small'
        label='ширина окна нижнего конуса'
        type='number'
        value={Conus_W}
        onChange={ Conus_W_Change }
        ></TextField>

        <TextField
        style={{ marginTop: 7 }}
        size='small'
        label='X нижнего конуса'
        type='number'
        value={Conus_X}
        onChange={ Conus_X_Change }
        ></TextField>

        <TextField
        style={{ marginTop: 7 }}
        size='small'
        label='Y нижнего конуса'
        type='number'
        value={Conus_Y}
        onChange={ Conus_Y_Change }
        ></TextField>

        </div>
            <div className='block'>
                { Elevators.FloorFound ?  <FloorViewCanvas/> : '' }
            </div>
        </div>

        </>
    )
};

function PilesHeader(propsPilesHeader){
    const [valuePileHeader, setValuePileHeader] = React.useState(0);
    const [updatePiles, setUpdatePiles] = React.useState(true);
    return (
        <>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: 40, marginTop: -15, backgroundColor: 'white', backgroundClip: 'content-box' }}>
                <span>Piles</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button 
                variant='outlined'
                size='small'
                onClick={ (e)=>( Elevators.PileAdd(), setUpdatePiles(!updatePiles), propsPilesHeader.callback( !propsPilesHeader.updateState ) ) }
                >Add</Button>
            <Button 
                variant='outlined'
                //disabled = { Elevators.PileFound ? false : true }
                disabled
                size='small'
                onClick={()=>( Elevators.FloorClone(), setUpdatePiles(!updatePiles), propsPilesHeader.callback( !propsPilesHeader.updateState ) )}
                >Clone</Button>
            <Button
                variant='outlined'
                //disabled = { Elevators.PileFound ? false : true }
                disabled
                size='small'
                onClick={()=>( Elevators.FloorDel(), setUpdatePiles(!updatePiles), propsPilesHeader.callback( !propsPilesHeader.updateState ) )}
                >Delete</Button>
            <Button 
                variant='outlined'
                size='small'
                onClick={()=>( iolocal.SaveElevator(), setUpdatePiles(!updatePiles) )}
                >Save</Button>
            </div>
        </div>
        </>
    );
};

function a11yPropsPile(index) {
    return {
      id: `Pile-tab-${index}`,
      'aria-controls': `Pile-tabpanel-${index}`,
    };
  }

function Piles(propsPiles){
    const [valuePiles, setValuePiles] = React.useState(0);
    const [updatePiles, setUpdatePiles] = React.useState(true);
    return (
        <div className='block'>
            {Elevators.PilesList.map((name, index ) => (
                <Pile key = {index} name = {name} index = {index} updateState={updatePiles} callback={(data)=> setUpdatePiles( data ) } {...a11yPropsPile(index)} />
            ))}
        </div>
    )
}

function Pile(propsPile){
    const [valuePile, setValuePile] = React.useState(0);
    //const [updatePile, setUpdatePile] = React.useState(true);
    let index = propsPile.index;
    let pile = Elevators.PileGet( index );

    const [value, setValue] = React.useState(false);

    const ChangeName = (event) => {
        pile.Name = event.target.value;
        Elevators.setPile ( index, pile.Name , pile.type , pile.purpose , pile.X , pile.Y , pile.Height ,
            pile.Base.length, pile.Base.width, pile.Base.r1, pile.Base.r1t, pile.Base.r2, pile.Base.r2t, pile.Base.r3, pile.Base.r3t, pile.Base.r4, pile.Base.r4t,
            pile.Top.length, pile.Top.width, pile.Top.r1, pile.Top.r1t, pile.Top.r2, pile.Top.r2t, pile.Top.r3, pile.Top.r3t, pile.Top.r4, pile.Top.r4t, )
        setValue(!value);
    };
    const ChangeType = (event) => {
        pile.type = event.target.value;
        Elevators.setPile ( index, pile.Name , pile.type , pile.purpose , pile.X , pile.Y , pile.Height ,
            pile.Base.length, pile.Base.width, pile.Base.r1, pile.Base.r1t, pile.Base.r2, pile.Base.r2t, pile.Base.r3, pile.Base.r3t, pile.Base.r4, pile.Base.r4t,
            pile.Top.length, pile.Top.width, pile.Top.r1, pile.Top.r1t, pile.Top.r2, pile.Top.r2t, pile.Top.r3, pile.Top.r3t, pile.Top.r4, pile.Top.r4t, )
        setValue(!value);
    };
    const ChangePurpose = (event) => {
        pile.purpose = event.target.value;
        Elevators.setPile ( index, pile.Name , pile.type , pile.purpose , pile.X , pile.Y , pile.Height ,
            pile.Base.length, pile.Base.width, pile.Base.r1, pile.Base.r1t, pile.Base.r2, pile.Base.r2t, pile.Base.r3, pile.Base.r3t, pile.Base.r4, pile.Base.r4t,
            pile.Top.length, pile.Top.width, pile.Top.r1, pile.Top.r1t, pile.Top.r2, pile.Top.r2t, pile.Top.r3, pile.Top.r3t, pile.Top.r4, pile.Top.r4t, )
        setValue(!value);
    };
    const ChangeX = (event) => {
        pile.X = event.target.value;
        Elevators.setPile ( index, pile.Name , pile.type , pile.purpose , pile.X , pile.Y , pile.Height ,
            pile.Base.length, pile.Base.width, pile.Base.r1, pile.Base.r1t, pile.Base.r2, pile.Base.r2t, pile.Base.r3, pile.Base.r3t, pile.Base.r4, pile.Base.r4t,
            pile.Top.length, pile.Top.width, pile.Top.r1, pile.Top.r1t, pile.Top.r2, pile.Top.r2t, pile.Top.r3, pile.Top.r3t, pile.Top.r4, pile.Top.r4t, )
        setValue(!value);
    };
    const ChangeY = (event) => {
        pile.Y = event.target.value;
        Elevators.setPile ( index, pile.Name , pile.type , pile.purpose , pile.X , pile.Y , pile.Height ,
            pile.Base.length, pile.Base.width, pile.Base.r1, pile.Base.r1t, pile.Base.r2, pile.Base.r2t, pile.Base.r3, pile.Base.r3t, pile.Base.r4, pile.Base.r4t,
            pile.Top.length, pile.Top.width, pile.Top.r1, pile.Top.r1t, pile.Top.r2, pile.Top.r2t, pile.Top.r3, pile.Top.r3t, pile.Top.r4, pile.Top.r4t, )
        setValue(!value);
    };
    const ChangeHeight = (event) => {
        pile.Height = event.target.value;
        Elevators.setPile ( index, pile.Name , pile.type , pile.purpose , pile.X , pile.Y , pile.Height ,
            pile.Base.length, pile.Base.width, pile.Base.r1, pile.Base.r1t, pile.Base.r2, pile.Base.r2t, pile.Base.r3, pile.Base.r3t, pile.Base.r4, pile.Base.r4t,
            pile.Top.length, pile.Top.width, pile.Top.r1, pile.Top.r1t, pile.Top.r2, pile.Top.r2t, pile.Top.r3, pile.Top.r3t, pile.Top.r4, pile.Top.r4t, )
        setValue(!value);
    };
    const ChangeBase_length = (event) => {
        pile.Base.length = event.target.value;
        Elevators.setPile ( index, pile.Name , pile.type , pile.purpose , pile.X , pile.Y , pile.Height ,
            pile.Base.length, pile.Base.width, pile.Base.r1, pile.Base.r1t, pile.Base.r2, pile.Base.r2t, pile.Base.r3, pile.Base.r3t, pile.Base.r4, pile.Base.r4t,
            pile.Top.length, pile.Top.width, pile.Top.r1, pile.Top.r1t, pile.Top.r2, pile.Top.r2t, pile.Top.r3, pile.Top.r3t, pile.Top.r4, pile.Top.r4t, )
        setValue(!value);
    };
    const ChangeBase_width = (event) => {
        pile.Base.width = event.target.value;
        Elevators.setPile ( index, pile.Name , pile.type , pile.purpose , pile.X , pile.Y , pile.Height ,
            pile.Base.length, pile.Base.width, pile.Base.r1, pile.Base.r1t, pile.Base.r2, pile.Base.r2t, pile.Base.r3, pile.Base.r3t, pile.Base.r4, pile.Base.r4t,
            pile.Top.length, pile.Top.width, pile.Top.r1, pile.Top.r1t, pile.Top.r2, pile.Top.r2t, pile.Top.r3, pile.Top.r3t, pile.Top.r4, pile.Top.r4t, )
        setValue(!value);
    };
    const ChangeBase_r1 = (event) => {
        pile.Base.r1 = event.target.value;
        Elevators.setPile ( index, pile.Name , pile.type , pile.purpose , pile.X , pile.Y , pile.Height ,
            pile.Base.length, pile.Base.width, pile.Base.r1, pile.Base.r1t, pile.Base.r2, pile.Base.r2t, pile.Base.r3, pile.Base.r3t, pile.Base.r4, pile.Base.r4t,
            pile.Top.length, pile.Top.width, pile.Top.r1, pile.Top.r1t, pile.Top.r2, pile.Top.r2t, pile.Top.r3, pile.Top.r3t, pile.Top.r4, pile.Top.r4t, )
        setValue(!value);
    };
    const ChangeBase_r1t = (event) => {
        pile.Base.r1t = event.target.value;
        Elevators.setPile ( index, pile.Name , pile.type , pile.purpose , pile.X , pile.Y , pile.Height ,
            pile.Base.length, pile.Base.width, pile.Base.r1, pile.Base.r1t, pile.Base.r2, pile.Base.r2t, pile.Base.r3, pile.Base.r3t, pile.Base.r4, pile.Base.r4t,
            pile.Top.length, pile.Top.width, pile.Top.r1, pile.Top.r1t, pile.Top.r2, pile.Top.r2t, pile.Top.r3, pile.Top.r3t, pile.Top.r4, pile.Top.r4t, )
        setValue(!value);
    };
    const ChangeBase_r2 = (event) => {
        pile.Base.r2 = event.target.value;
        Elevators.setPile ( index, pile.Name , pile.type , pile.purpose , pile.X , pile.Y , pile.Height ,
            pile.Base.length, pile.Base.width, pile.Base.r1, pile.Base.r1t, pile.Base.r2, pile.Base.r2t, pile.Base.r3, pile.Base.r3t, pile.Base.r4, pile.Base.r4t,
            pile.Top.length, pile.Top.width, pile.Top.r1, pile.Top.r1t, pile.Top.r2, pile.Top.r2t, pile.Top.r3, pile.Top.r3t, pile.Top.r4, pile.Top.r4t, )
        setValue(!value);
    };
    const ChangeBase_r2t = (event) => {
        pile.Base.r2t = event.target.value;
        Elevators.setPile ( index, pile.Name , pile.type , pile.purpose , pile.X , pile.Y , pile.Height ,
            pile.Base.length, pile.Base.width, pile.Base.r1, pile.Base.r1t, pile.Base.r2, pile.Base.r2t, pile.Base.r3, pile.Base.r3t, pile.Base.r4, pile.Base.r4t,
            pile.Top.length, pile.Top.width, pile.Top.r1, pile.Top.r1t, pile.Top.r2, pile.Top.r2t, pile.Top.r3, pile.Top.r3t, pile.Top.r4, pile.Top.r4t, )
        setValue(!value);
    };
    const ChangeBase_r3 = (event) => {
        pile.Base.r3 = event.target.value;
        Elevators.setPile ( index, pile.Name , pile.type , pile.purpose , pile.X , pile.Y , pile.Height ,
            pile.Base.length, pile.Base.width, pile.Base.r1, pile.Base.r1t, pile.Base.r2, pile.Base.r2t, pile.Base.r3, pile.Base.r3t, pile.Base.r4, pile.Base.r4t,
            pile.Top.length, pile.Top.width, pile.Top.r1, pile.Top.r1t, pile.Top.r2, pile.Top.r2t, pile.Top.r3, pile.Top.r3t, pile.Top.r4, pile.Top.r4t, )
        setValue(!value);
    };
    const ChangeBase_r3t = (event) => {
        pile.Base.r3t = event.target.value;
        Elevators.setPile ( index, pile.Name , pile.type , pile.purpose , pile.X , pile.Y , pile.Height ,
            pile.Base.length, pile.Base.width, pile.Base.r1, pile.Base.r1t, pile.Base.r2, pile.Base.r2t, pile.Base.r3, pile.Base.r3t, pile.Base.r4, pile.Base.r4t,
            pile.Top.length, pile.Top.width, pile.Top.r1, pile.Top.r1t, pile.Top.r2, pile.Top.r2t, pile.Top.r3, pile.Top.r3t, pile.Top.r4, pile.Top.r4t, )
        setValue(!value);
    };
    const ChangeBase_r4 = (event) => {
        pile.Base.r4 = event.target.value;
        Elevators.setPile ( index, pile.Name , pile.type , pile.purpose , pile.X , pile.Y , pile.Height ,
            pile.Base.length, pile.Base.width, pile.Base.r1, pile.Base.r1t, pile.Base.r2, pile.Base.r2t, pile.Base.r3, pile.Base.r3t, pile.Base.r4, pile.Base.r4t,
            pile.Top.length, pile.Top.width, pile.Top.r1, pile.Top.r1t, pile.Top.r2, pile.Top.r2t, pile.Top.r3, pile.Top.r3t, pile.Top.r4, pile.Top.r4t, )
        setValue(!value);
    };
    const ChangeBase_r4t = (event) => {
        pile.Base.r4t = event.target.value;
        Elevators.setPile ( index, pile.Name , pile.type , pile.purpose , pile.X , pile.Y , pile.Height ,
            pile.Base.length, pile.Base.width, pile.Base.r1, pile.Base.r1t, pile.Base.r2, pile.Base.r2t, pile.Base.r3, pile.Base.r3t, pile.Base.r4, pile.Base.r4t,
            pile.Top.length, pile.Top.width, pile.Top.r1, pile.Top.r1t, pile.Top.r2, pile.Top.r2t, pile.Top.r3, pile.Top.r3t, pile.Top.r4, pile.Top.r4t, )
        setValue(!value);
    };
    const ChangeTop_length = (event) => {
        pile.Top.length = event.target.value;
        Elevators.setPile ( index, pile.Name , pile.type , pile.purpose , pile.X , pile.Y , pile.Height ,
            pile.Base.length, pile.Base.width, pile.Base.r1, pile.Base.r1t, pile.Base.r2, pile.Base.r2t, pile.Base.r3, pile.Base.r3t, pile.Base.r4, pile.Base.r4t,
            pile.Top.length, pile.Top.width, pile.Top.r1, pile.Top.r1t, pile.Top.r2, pile.Top.r2t, pile.Top.r3, pile.Top.r3t, pile.Top.r4, pile.Top.r4t, )
        setValue(!value);
    };
    const ChangeTop_width = (event) => {
        pile.Top.width = event.target.value;
        Elevators.setPile ( index, pile.Name , pile.type , pile.purpose , pile.X , pile.Y , pile.Height ,
            pile.Base.length, pile.Base.width, pile.Base.r1, pile.Base.r1t, pile.Base.r2, pile.Base.r2t, pile.Base.r3, pile.Base.r3t, pile.Base.r4, pile.Base.r4t,
            pile.Top.length, pile.Top.width, pile.Top.r1, pile.Top.r1t, pile.Top.r2, pile.Top.r2t, pile.Top.r3, pile.Top.r3t, pile.Top.r4, pile.Top.r4t, )
        setValue(!value);
    };
    const ChangeTop_r1 = (event) => {
        pile.Top.r1 = event.target.value;
        Elevators.setPile ( index, pile.Name , pile.type , pile.purpose , pile.X , pile.Y , pile.Height ,
            pile.Base.length, pile.Base.width, pile.Base.r1, pile.Base.r1t, pile.Base.r2, pile.Base.r2t, pile.Base.r3, pile.Base.r3t, pile.Base.r4, pile.Base.r4t,
            pile.Top.length, pile.Top.width, pile.Top.r1, pile.Top.r1t, pile.Top.r2, pile.Top.r2t, pile.Top.r3, pile.Top.r3t, pile.Top.r4, pile.Top.r4t, )
        setValue(!value);
    };
    const ChangeTop_r1t = (event) => {
        pile.Top.r1t = event.target.value;
        Elevators.setPile ( index, pile.Name , pile.type , pile.purpose , pile.X , pile.Y , pile.Height ,
            pile.Base.length, pile.Base.width, pile.Base.r1, pile.Base.r1t, pile.Base.r2, pile.Base.r2t, pile.Base.r3, pile.Base.r3t, pile.Base.r4, pile.Base.r4t,
            pile.Top.length, pile.Top.width, pile.Top.r1, pile.Top.r1t, pile.Top.r2, pile.Top.r2t, pile.Top.r3, pile.Top.r3t, pile.Top.r4, pile.Top.r4t, )
        setValue(!value);
    };
    const ChangeTop_r2 = (event) => {
        pile.Top.r2 = event.target.value;
        Elevators.setPile ( index, pile.Name , pile.type , pile.purpose , pile.X , pile.Y , pile.Height ,
            pile.Base.length, pile.Base.width, pile.Base.r1, pile.Base.r1t, pile.Base.r2, pile.Base.r2t, pile.Base.r3, pile.Base.r3t, pile.Base.r4, pile.Base.r4t,
            pile.Top.length, pile.Top.width, pile.Top.r1, pile.Top.r1t, pile.Top.r2, pile.Top.r2t, pile.Top.r3, pile.Top.r3t, pile.Top.r4, pile.Top.r4t, )
        setValue(!value);
    };
    const ChangeTop_r2t = (event) => {
        pile.Top.r2t = event.target.value;
        Elevators.setPile ( index, pile.Name , pile.type , pile.purpose , pile.X , pile.Y , pile.Height ,
            pile.Base.length, pile.Base.width, pile.Base.r1, pile.Base.r1t, pile.Base.r2, pile.Base.r2t, pile.Base.r3, pile.Base.r3t, pile.Base.r4, pile.Base.r4t,
            pile.Top.length, pile.Top.width, pile.Top.r1, pile.Top.r1t, pile.Top.r2, pile.Top.r2t, pile.Top.r3, pile.Top.r3t, pile.Top.r4, pile.Top.r4t, )
        setValue(!value);
    };
    const ChangeTop_r3 = (event) => {
        pile.Top.r3 = event.target.value;
        Elevators.setPile ( index, pile.Name , pile.type , pile.purpose , pile.X , pile.Y , pile.Height ,
            pile.Base.length, pile.Base.width, pile.Base.r1, pile.Base.r1t, pile.Base.r2, pile.Base.r2t, pile.Base.r3, pile.Base.r3t, pile.Base.r4, pile.Base.r4t,
            pile.Top.length, pile.Top.width, pile.Top.r1, pile.Top.r1t, pile.Top.r2, pile.Top.r2t, pile.Top.r3, pile.Top.r3t, pile.Top.r4, pile.Top.r4t, )
        setValue(!value);
    };
    const ChangeTop_r3t = (event) => {
        pile.Top.r3t = event.target.value;
        Elevators.setPile ( index, pile.Name , pile.type , pile.purpose , pile.X , pile.Y , pile.Height ,
            pile.Base.length, pile.Base.width, pile.Base.r1, pile.Base.r1t, pile.Base.r2, pile.Base.r2t, pile.Base.r3, pile.Base.r3t, pile.Base.r4, pile.Base.r4t,
            pile.Top.length, pile.Top.width, pile.Top.r1, pile.Top.r1t, pile.Top.r2, pile.Top.r2t, pile.Top.r3, pile.Top.r3t, pile.Top.r4, pile.Top.r4t, )
        setValue(!value);
    };
    const ChangeTop_r4 = (event) => {
        pile.Top.r4 = event.target.value;
        Elevators.setPile ( index, pile.Name , pile.type , pile.purpose , pile.X , pile.Y , pile.Height ,
            pile.Base.length, pile.Base.width, pile.Base.r1, pile.Base.r1t, pile.Base.r2, pile.Base.r2t, pile.Base.r3, pile.Base.r3t, pile.Base.r4, pile.Base.r4t,
            pile.Top.length, pile.Top.width, pile.Top.r1, pile.Top.r1t, pile.Top.r2, pile.Top.r2t, pile.Top.r3, pile.Top.r3t, pile.Top.r4, pile.Top.r4t, )
        setValue(!value);
    };
    const ChangeTop_r4t = (event) => {
        pile.Top.r4t = event.target.value;
        Elevators.setPile ( index, pile.Name , pile.type , pile.purpose , pile.X , pile.Y , pile.Height ,
            pile.Base.length, pile.Base.width, pile.Base.r1, pile.Base.r1t, pile.Base.r2, pile.Base.r2t, pile.Base.r3, pile.Base.r3t, pile.Base.r4, pile.Base.r4t,
            pile.Top.length, pile.Top.width, pile.Top.r1, pile.Top.r1t, pile.Top.r2, pile.Top.r2t, pile.Top.r3, pile.Top.r3t, pile.Top.r4, pile.Top.r4t, )
        setValue(!value);
    }; 
    

    return (
        <div className='block' style={{ flexDirection: 'row' }}>
        <div className='block'>
                <label><strong>index: {propsPile.index}</strong></label>
            <div className='rowPile'>
                <label>name:</label>
                <input 
                    className='inputPile' 
                    value = {pile.Name}
                    onChange={ ChangeName }
                />
            </div>
            <div className='rowPile'>
                <label>Placement Level:</label>
                <select 
                    className='inputPile' 
                    style={{ width: 87 }}
                    value = {pile.type}
                    onChange={ ChangeType }
                    >
                        <option value='true'>Botoom</option>
                        <option value='false'>Upper</option>
                </select>
            </div>
            <div className='rowPile'>
                <label>Volume:</label>
                <select 
                    className='inputPile' 
                    style={{ width: 87 }}
                    value = {pile.purpose}
                    onChange={ ChangePurpose }
                    >
                        <option value='true'>Add</option>
                        <option value='false'>Remove</option>
                </select>
            </div>
            <div className='rowPile'>
                <label>Location X:</label>
                <input className='inputPile' type ='number' value = {pile.X} onChange={ ChangeX }/>
            </div>
            <div className='rowPile'>
                <label>Location Y:</label>
                <input className='inputPile' type ='number' value = {pile.Y} onChange={ ChangeY }/>
            </div>
            <div className='rowPile'>
                <label>Pile Height:</label>
                <input className='inputPile' type ='number' value = {pile.Height} onChange={ ChangeHeight }/>
            </div>

            <label><strong>Base contur:</strong></label>

            <div className='rowPile'>
                <label>length:</label>
                <input className='inputPile' type ='number' value = {pile.Base.length} onChange={ ChangeBase_length }/>
            </div>
            <div className='rowPile'>
                <label>width:</label>
                <input className='inputPile' type ='number' value = {pile.Base.width} onChange={ ChangeBase_width }/>
            </div>
            <div className='rowPile'>
                <label>Corner 1:</label>
                <input className='inputPile' type ='number' value = {pile.Base.r1} onChange={ ChangeBase_r1 }/>
                <select 
                    className='inputPile' 
                    style={{ width: 60 }}
                    value = {pile.Base.r1t}
                    onChange={ ChangeBase_r1t }
                    >
                        <option value='true'>Arc</option>
                        <option value='false'>Line</option>
                </select>
            </div>
            <div className='rowPile'>
                <label>Corner 2:</label>
                <input className='inputPile' type ='number' value = {pile.Base.r2} onChange={ ChangeBase_r2 }/>
                <select 
                    className='inputPile' 
                    style={{ width: 60 }}
                    value = {pile.Base.r2t}
                    onChange={ ChangeBase_r2t }
                    >
                        <option value='true'>Arc</option>
                        <option value='false'>Line</option>
                </select>
            </div>
            <div className='rowPile'>
                <label>Corner 3:</label>
                <input className='inputPile' type ='number' value = {pile.Base.r3} onChange={ ChangeBase_r3 }/>
                <select 
                    className='inputPile' 
                    style={{ width: 60 }}
                    value = {pile.Base.r3t}
                    onChange={ ChangeBase_r3t }
                    >
                        <option value='true'>Arc</option>
                        <option value='false'>Line</option>
                </select>
            </div>
            <div className='rowPile'>
                <label>Corner 4:</label>
                <input className='inputPile' type ='number' value = {pile.Base.r4} onChange={ ChangeBase_r4 }/>
                <select 
                    className='inputPile' 
                    style={{ width: 60 }}
                    value = {pile.Base.r4t}
                    onChange={ ChangeBase_r4t }
                    >
                        <option value='true'>Arc</option>
                        <option value='false'>Line</option>
                </select>
            </div>

            <label><strong>Top contur:</strong></label>

            <div className='rowPile'>
                <label>length:</label>
                <input className='inputPile' type ='number' value = {pile.Top.length} onChange={ ChangeTop_length }/>
            </div>
            <div className='rowPile'>
                <label>width:</label>
                <input className='inputPile' type ='number' value = {pile.Top.width} onChange={ ChangeTop_width }/>
            </div>
            <div className='rowPile'>
                <label>Corner 1:</label>
                <input className='inputPile' type ='number' value = {pile.Top.r1} onChange={ ChangeTop_r1 }/>
                <select 
                    className='inputPile' 
                    style={{ width: 60 }}
                    value = {pile.Top.r1t}
                    onChange={ ChangeTop_r1t }
                    >
                        <option value='true'>Arc</option>
                        <option value='false'>Line</option>
                </select>
            </div>
            <div className='rowPile'>
                <label>Corner 2:</label>
                <input className='inputPile' type ='number' value = {pile.Top.r2} onChange={ ChangeTop_r2 }/>
                <select 
                    className='inputPile' 
                    style={{ width: 60 }}
                    value = {pile.Top.r2t}
                    onChange={ ChangeTop_r2t }
                    >
                        <option value='true'>Arc</option>
                        <option value='false'>Line</option>
                </select>
            </div>
            <div className='rowPile'>
                <label>Corner 3:</label>
                <input className='inputPile' type ='number' value = {pile.Top.r3} onChange={ ChangeTop_r3 }/>
                <select 
                    className='inputPile' 
                    style={{ width: 60 }}
                    value = {pile.Top.r3t}
                    onChange={ ChangeTop_r3t }
                    >
                        <option value='true'>Arc</option>
                        <option value='false'>Line</option>
                </select>
            </div>
            <div className='rowPile'>
                <label>Corner 4:</label>
                <input className='inputPile' type ='number' value = {pile.Top.r4} onChange={ ChangeTop_r4 }/>
                <select 
                    className='inputPile' 
                    style={{ width: 60 }}
                    value = {pile.Top.r4t}
                    onChange={ ChangeTop_r4t }
                    >
                        <option value='true'>Arc</option>
                        <option value='false'>Line</option>
                </select>
            </div>
        </div>

        <div className='block' style={{ width: '100%' }}>
            { Elevators.FloorFound ?  <PileViewCanvas index={index}/> : '' }
        </div>

        </div>
    )
}