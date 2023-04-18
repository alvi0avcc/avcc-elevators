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
                { Elevators.PileFound > 0 ?  <Piles updateState={update} callback={(data)=> setUpdate( data ) }/> : '' }
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
                <Pile key = {index} name = {name} index = {index} updateState={propsPiles.updateState} callback={(data)=> propsPiles.callback( data ) } {...a11yPropsPile(index)} />
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
        Elevators.setPile ( index, pile.Name, pile.type, pile.type_location, pile.purpose, pile.X, pile.Y, pile.angle,
            pile.Height, pile.Box_Heights,
            pile.Base.length, pile.Base.width,
            pile.Top.length, pile.Top.width,
            pile.Tension_Base, pile.Tension_Volume );
        setValue(!value);
    };
    const ChangeType = (event) => {
        pile.type = event.target.value;
        Elevators.setPile ( index, pile.Name, pile.type, pile.type_location, pile.purpose, pile.X, pile.Y, pile.angle,
            pile.Height, pile.Box_Heights,
            pile.Base.length, pile.Base.width,
            pile.Top.length, pile.Top.width,
            pile.Tension_Base, pile.Tension_Volume );
        setValue(!value);
    };
    const ChangeTypeLocation = (event) => {
        pile.type_location = event.target.value;
        Elevators.setPile ( index, pile.Name, pile.type, pile.type_location, pile.purpose, pile.X, pile.Y, pile.angle,
            pile.Height, pile.Box_Heights,
            pile.Base.length, pile.Base.width,
            pile.Top.length, pile.Top.width,
            pile.Tension_Base, pile.Tension_Volume );
        setValue(!value);
    };
    const ChangePurpose = (event) => {
        pile.purpose = event.target.value;
        Elevators.setPile ( index, pile.Name, pile.type, pile.type_location, pile.purpose, pile.X, pile.Y, pile.angle,
            pile.Height, pile.Box_Heights,
            pile.Base.length, pile.Base.width,
            pile.Top.length, pile.Top.width,
            pile.Tension_Base, pile.Tension_Volume );
        setValue(!value);
    };
    const ChangeX = (event) => {
        pile.X = event.target.value;
        Elevators.setPile ( index, pile.Name, pile.type, pile.type_location, pile.purpose, pile.X, pile.Y, pile.angle,
            pile.Height, pile.Box_Heights,
            pile.Base.length, pile.Base.width,
            pile.Top.length, pile.Top.width,
            pile.Tension_Base, pile.Tension_Volume );
        setValue(!value);
    };
    const ChangeY = (event) => {
        pile.Y = event.target.value;
        Elevators.setPile ( index, pile.Name, pile.type, pile.type_location, pile.purpose, pile.X, pile.Y, pile.angle,
            pile.Height, pile.Box_Heights,
            pile.Base.length, pile.Base.width,
            pile.Top.length, pile.Top.width,
            pile.Tension_Base, pile.Tension_Volume );
        setValue(!value);
    };
    const ChangeAngle = (event) => {
        pile.angle = event.target.value;
        Elevators.setPile ( index, pile.Name, pile.type, pile.type_location, pile.purpose, pile.X, pile.Y, pile.angle,
            pile.Height, pile.Box_Heights,
            pile.Base.length, pile.Base.width,
            pile.Top.length, pile.Top.width,
            pile.Tension_Base, pile.Tension_Volume );
        setValue(!value);
    };
    const ChangeHeight = (event) => {
        pile.Height = event.target.value;
        if ( pile.Height <= 0 ) pile.Height = 0.01;
        Elevators.setPile ( index, pile.Name, pile.type, pile.type_location, pile.purpose, pile.X, pile.Y, pile.angle,
            pile.Height, pile.Box_Heights,
            pile.Base.length, pile.Base.width,
            pile.Top.length, pile.Top.width,
            pile.Tension_Base, pile.Tension_Volume );
        setValue(!value);
    };
    const ChangeBase_length = (event) => {
        pile.Base.length = event.target.value;
        Elevators.setPile ( index, pile.Name, pile.type, pile.type_location, pile.purpose, pile.X, pile.Y, pile.angle,
            pile.Height, pile.Box_Heights,
            pile.Base.length, pile.Base.width,
            pile.Top.length, pile.Top.width,
            pile.Tension_Base, pile.Tension_Volume );
        setValue(!value);
    };
    const ChangeBase_width = (event) => {
        pile.Base.width = event.target.value;
        Elevators.setPile ( index, pile.Name, pile.type, pile.type_location, pile.purpose, pile.X, pile.Y, pile.angle,
            pile.Height, pile.Box_Heights,
            pile.Base.length, pile.Base.width,
            pile.Top.length, pile.Top.width,
            pile.Tension_Base, pile.Tension_Volume );
        setValue(!value);
    };
    const ChangeTensionBase = (event) => {
        pile.Tension_Base = event.target.value;
        Elevators.setPile ( index, pile.Name, pile.type, pile.type_location, pile.purpose, pile.X, pile.Y, pile.angle,
            pile.Height, pile.Box_Heights,
            pile.Base.length, pile.Base.width,
            pile.Top.length, pile.Top.width,
            pile.Tension_Base, pile.Tension_Volume );
        setValue(!value);
    };
    const ChangeTensionVolume = (event) => {
        pile.Tension_Volume = event.target.value;
        Elevators.setPile ( index, pile.Name, pile.type, pile.type_location, pile.purpose, pile.X, pile.Y, pile.angle,
            pile.Height, pile.Box_Heights,
            pile.Base.length, pile.Base.width,
            pile.Top.length, pile.Top.width,
            pile.Tension_Base, pile.Tension_Volume );
        setValue(!value);
    };
    const ChangeTop_length = (event) => {
        pile.Top.length = event.target.value;
        pile.Top.length_left =  ( Number( pile.Base.length ) - Number( pile.Top.length ) ) / 2 ;
        pile.Top.length_right = pile.Top.length_left;
        Elevators.setPile ( index, pile.Name, pile.type, pile.type_location, pile.purpose, pile.X, pile.Y, pile.angle,
            pile.Height, pile.Box_Heights,
            pile.Base.length, pile.Base.width,
            pile.Top.length, pile.Top.width,
            pile.Tension_Base, pile.Tension_Volume );
        setValue(!value);
    };
    const ChangeTop_width = (event) => {
        pile.Top.width = event.target.value;
        pile.Top.width_front =  ( Number( pile.Base.width ) - Number( pile.Top.width ) ) / 2 ;
        pile.Top.width_aft = pile.Top.width_front;
        Elevators.setPile ( index, pile.Name, pile.type, pile.type_location, pile.purpose, pile.X, pile.Y, pile.angle,
            pile.Height, pile.Box_Heights,
            pile.Base.length, pile.Base.width,
            pile.Top.length, pile.Top.width,
            pile.Tension_Base, pile.Tension_Volume );
        setValue(!value);
    };

    return (
        <div className='block' style={{ flexDirection: 'row', height: 545 }}>
        <div className='block' style={{ width: 425 }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <label><strong>index: {propsPile.index}</strong></label>

            <div>
                <Button 
                    variant='outlined'
                    size='small'
                    onClick={ (e)=>( Elevators.PileAdd(), propsPile.callback( !propsPile.updateState ) ) }
                >Add</Button>

                <Button 
                    variant='outlined'
                    size='small'
                    onClick={()=>( Elevators.PileClone(index), propsPile.callback( !propsPile.updateState ) )}
                >Clone</Button>
            </div>

                <Button
                    variant='outlined'
                    disabled = { Elevators.FloorFound ? false : true }
                    size='small'
                    onClick={()=>( Elevators.PileDel( index ), propsPile.callback( !propsPile.updateState ) )}
                >Delete</Button>
            </div>
            <div className='rowPile' style={{ width: 302 }}>
                <label>name:</label>
                <input 
                    className='inputPile' 
                    style={{ width: 250 }}
                    value = {pile.Name}
                    onChange={ ChangeName }
                />
            </div>
            <div className='rowPile'>
                <label>Pile type:</label>
                <select 
                    className='inputPile' 
                    style={{ width: 87 }}
                    value = { pile.type }
                    onChange={ ChangeType }
                    >
                        <option value='box'>Box</option>
                        <option value='pile'>Pile</option>
                </select>
            </div>
            <div className='rowPile'>
                <label>Placement Level:</label>
                <select 
                    className='inputPile' 
                    style={{ width: 87 }}
                    value = { pile.type_location }
                    onChange={ ChangeTypeLocation }
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
                        <option value='add'>Add</option>
                        <option value='remove'>Remove</option>
                </select>
            </div>
            <div><hr/></div>
            <div className='rowPile'>
                <label>Location X:</label>
                <input className='inputPile' type ='number' value = {pile.X} onChange={ ChangeX }/>
            </div>
            <div className='rowPile'>
                <label>Location Y:</label>
                <input className='inputPile' type ='number' value = {pile.Y} onChange={ ChangeY }/>
            </div>
            <div className='rowPile'>
                <label>Orientation (angle):</label>
                <input className='inputPile' type ='number' value = {pile.angle} onChange={ ChangeAngle }/>
            </div>
            <div><hr/></div>
            <div className='rowPile'>
                <label><strong>Height:</strong></label>
                <input className='inputPile' type ='number' min="0.01" step='0.01' value = {pile.Height} onChange={ ChangeHeight }/>
            </div>

            <div><hr/></div>
            <label style={{ color: 'blue' }}><strong>Top contur:</strong></label>

            <div className='rowPile'>
                <div className='rowPile'>
                <label>length:</label>
                <input className='inputPile' type ='number' min={0.01} step={0.01}
                    value = {pile.Top.length} onChange={ ChangeTop_length }/>
                </div>
            </div>

            <div className='rowPile'>
                <div className='rowPile'>
                <label>width:</label>
                <input className='inputPile' type ='number' min={0.01} step={0.01}
                    value = {pile.Top.width} onChange={ ChangeTop_width }/>
                </div>
            </div>
           
            <div><hr/></div>
            <label style={{ color: 'black' }}><strong>Base contur:</strong></label>

            <div className='rowPile'>
                <label>length:</label>
                <input className='inputPile' type ='number' min={0.01} step={0.01} value = {pile.Base.length} onChange={ ChangeBase_length }/>
            </div>
            <div className='rowPile'>
                <label>width:</label>
                <input className='inputPile' type ='number' min={0.01} step={0.01} value = {pile.Base.width} onChange={ ChangeBase_width }/>
            </div>
            <div className='rowPile' style={{ width: 300 }}>
                <label style={{ width: 120 }}>Tension Base:</label>
                <input className='inputPile' style={{ width: 50 }} type ='number' min="0" max="1.5" step="0.01" value = {pile.Tension_Base} onChange={ ChangeTensionBase }/>
                <input className='inputPile' style={{ width: 100 }}type ='range' min="0" max="1.5" step="0.01" value = {pile.Tension_Base} onChange={ ChangeTensionBase }/>
            </div>
            <div className='rowPile' style={{ width: 300 }}>
                <label style={{ width: 120 }}>Tension Volume:</label>
                <input className='inputPile' style={{ width: 50 }} type ='number' min="0.01" max="1" step="0.01" value = {pile.Tension_Volume} onChange={ ChangeTensionVolume }/>
                <input className='inputPile' style={{ width: 100 }}type ='range' min="0.01" max="1" step="0.01" value = {pile.Tension_Volume} onChange={ ChangeTensionVolume }/>
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'end' }}>
                <Button 
                    variant='outlined'
                    size='small'
                    style={{ height: 25 }}
                    onClick={()=>( iolocal.SaveElevator() )}
                    >Save
                </Button>
            </div>
        </div>

        <div className='block' style={{ width: '100%' }}>
            { Elevators.FloorFound ?  <PileViewCanvas index={index}/> : '' }
        </div>

        </div>
    )
}