import * as React from 'react';
import { Elevators } from './elevators.js';
import * as iolocal from './iolocal';
import * as Dialogs from './dialogs';
import FloorViewCanvas from './floor-draw-view.js';
import PilesViewCanvas from './piles-draw-view.js';
import PileViewCanvas from './pile-draw-view.js';
import { Divider, Tab, Tabs, Button, TextField , IconButton, Tooltip } from '@mui/material';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import { Margin } from '@mui/icons-material';

export default function Floor(){
    const [update, setUpdate] = React.useState(true);
    return (
        <div>
            <FloorHeader updateState={update} callback={(data)=> setUpdate( data ) }/>
            { Elevators.FloorFound ?  <FloorSize updateState={update} callback={(data)=> setUpdate( data ) }/> : '' }

            <div 
                className='block'
                style={{ display: `${ Elevators.FloorFound ? 'block' : 'none' }`,
                minWidth: 1000,
                marginTop: 15 }}
                >

                <div style={{ width: 40, marginTop: -15, backgroundColor: 'white', backgroundClip: 'content-box' }}>
                    <span>Piles</span>
                </div>

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
    <div className='block' style={{ minWidth: 1000, marginTop: '10px' }}>

        <div style={{ width: 85, marginTop: -15, backgroundColor: 'white', backgroundClip: 'content-box' }}>
            <span>Warehouse</span>
        </div>

        <div className='block_row' style={{ border: 'none', padding: 0, margin: 0 }}>

        <div 
            className='block'
            style={{ minWidth: 260, width: 260 }}
            >
        <IconButton
            color="primary"
            aria-label="Edit Warehouse Name"
            component="label"
            onClick={() => { Dialogs.FloorDialogShow(Elevators.FloorName, 0); propsSize.callback( !propsSize.updateState ) }}>
              <Tooltip title="Edit Warehouse Name">
                <SettingsTwoToneIcon />
              </Tooltip>
          </IconButton>
        <br/>
        <TextField
        size='small'
        label='Length'
        type='number'
        value={Length}
        onChange={ Length_Change }
        ></TextField>

        <TextField
        style={{ marginTop: 7 }}
        size='small'
        label='Width'
        type='number'
        value={Width}
        onChange={ Width_Change }
        ></TextField>

        <TextField
        style={{ marginTop: 7 }}
        size='small'
        label='Height'
        type='number'
        value={Height}
        onChange={ Height_Change }
        ></TextField>

        <TextField
        style={{ marginTop: 7 }}
        size='small'
        label='Bottom Cone depth'
        type='number'
        value={Conus_height}
        onChange={ Conus_height_Change }
        ></TextField>

        <TextField
        style={{ marginTop: 7 }}
        size='small'
        label='Bottom cone window length'
        type='number'
        value={Conus_L}
        onChange={ Conus_L_Change }
        ></TextField>

        <TextField
        style={{ marginTop: 7 }}
        size='small'
        label='Bottom cone window width'
        type='number'
        value={Conus_W}
        onChange={ Conus_W_Change }
        ></TextField>

        <TextField
        style={{ marginTop: 7 }}
        size='small'
        label='Bottom cone location by length'
        type='number'
        value={Conus_X}
        onChange={ Conus_X_Change }
        ></TextField>

        <TextField
        style={{ marginTop: 7 }}
        size='small'
        label='Bottom cone location by width'
        type='number'
        value={Conus_Y}
        onChange={ Conus_Y_Change }
        ></TextField>

        </div>

            <div className='block' style={{ width: '100%' }}>
                { Elevators.FloorFound ?  <FloorViewCanvas/> : '' }
            </div>
            
            <div className='block' style={{ position: 'relative', right: '0px', width: '120px' }}>
                <FloorSidePanel_3D updateState={value} callback={(data)=> setValue( data ) }/>
            </div>   
        </div>
    </div>
    )
};

function PilesHeader(propsPilesHeader){
    const [valuePileHeader, setValuePileHeader] = React.useState(0);
    const [updatePiles, setUpdatePiles] = React.useState(true);
    return (
        <>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            
            <div
                style={{
                    display: ( Elevators.PileFound ? 'none' : 'flex' ),
                    flexDirection: 'row', justifyContent: 'space-between' }}>
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
    const [ currentPile, setCurrentPile ] = React.useState( 0 );
    const [ mode, setMode ] = React.useState( 'model' );
    const [ view, setView ] = React.useState( { x: -3.14*70/180, y: 3.14*25/180, z: -3.14*20/180 } );

    return (
            <div className='block_row' style={{ border: 'none', padding: 0, margin: 0 }} >

                <Pile_Side_Menu updateState={ updatePiles } callback={(data)=> setUpdatePiles( data ) } currentPile={ currentPile } callbackPile={(data)=> setCurrentPile( data ) } mode={ mode } callbackMode={(data)=> setMode( data ) } />

                <div className='block' style={{ width: '100%' }}>
                    { Elevators.FloorFound ?  <PilesViewCanvas updateState={ updatePiles } callback={(data)=> setUpdatePiles( data ) } currentPile={ currentPile } callbackPile={(data)=> setCurrentPile( data ) } view={ view } mode={ mode } /> : '' }
                </div>

                <div className='block' style={{ position: 'relative', right: '0px', width: '120px' }}>
                    <Pile_Side_3D_menu view={ view } callbackView={(data)=> setView( data ) } updateState={ updatePiles } callback={(data)=> setUpdatePiles( data ) }  mode={ mode } callbackMode={(data)=> setMode( data ) } />
                </div>

            </div>
    )
}

function Pile(propsPile){
    const [valuePile, setValuePile] = React.useState(0);

    let index = propsPile.index;
    let pile = Elevators.PileGet( index );

    const [value, setValue] = React.useState(false);
    const [mode, setMode] = React.useState('model');

    const changeAngleX = (event) => {
        pile.angle_X = event.target.value;
        Elevators.setAngleView( index, pile.angle_X, pile.angle_Y, pile.angle_Z );
        setValue(!value);
    };

    /*const changeAngleY = (event) => {
        pile.angle_Y = event.target.value;
        Elevators.setAngleView( index, pile.angle_X, pile.angle_Y, pile.angle_Z );
        setValue(!value);
    };*/

    const ChangeName = (event) => {
        pile.Name = event.target.value;
        Elevators.setPile_BaseInfo ( index, pile.Name, pile.type, pile.type_location, pile.purpose );
        setValue(!value);
    };
    const ChangeType = (event) => {
        pile.type = event.target.value;
        Elevators.setPile_BaseInfo ( index, pile.Name, pile.type, pile.type_location, pile.purpose );
        setValue(!value);
    };
    const ChangeTypeLocation = (event) => {
        pile.type_location = event.target.value;
        Elevators.setPile_BaseInfo ( index, pile.Name, pile.type, pile.type_location, pile.purpose );
        setValue(!value);
    };
    const ChangePurpose = (event) => {
        pile.purpose = event.target.value;
        Elevators.setPile_BaseInfo ( index, pile.Name, pile.type, pile.type_location, pile.purpose );
        setValue(!value);
    };
    const ChangeX = (event) => {
        pile.X = event.target.value;
        Elevators.setPile_Location ( index, pile.X, pile.Y, pile.angle );
        setMode('location');
        setValue(!value);
    };
    const ChangeY = (event) => {
        pile.Y = event.target.value;
        Elevators.setPile_Location ( index, pile.X, pile.Y, pile.angle );
        setMode('location');
        setValue(!value);
    };
    const ChangeAngle = (event) => {
        pile.angle = event.target.value;
        Elevators.setPile_Location ( index, pile.X, pile.Y, pile.angle );
        setMode('location');
        setValue(!value);
    };
    const ChangeHeight = (event) => {
        //let h = 0;
        //h = event.target.value;
        //pile.Height = h - pile.underBase_Height;
       //if ( pile.Height <= 0 ) pile.Height = 0.01;
        pile.Height = event.target.value;
        Elevators.setPile_Height ( index, pile.Height );
        setValue(!value);
    };
    const ChangeUnderBase_Height = (event) => {
        pile.underBase_Height = event.target.value;
       if ( pile.underBase_Height < 0 ) pile.underBase_Height = 0;
        Elevators.setPile_underBase_Height ( index, pile.underBase_Height);
        setValue(!value);
    };
    const ChangeBase_length = (event) => {
        pile.Base.length = event.target.value;
        Elevators.setPile_BaseContur ( index, pile.Base.length, pile.Base.width, pile.Tension_Base );
        setValue(!value);
    };
    const setBaseLength_max = () => {
        pile.Base.length = Elevators.FloorCurrentDimensions.Length;
        pile.X = pile.Base.length/2;
        Elevators.setPile_Location ( index, pile.X, pile.Y, pile.angle );
        Elevators.setPile_BaseContur ( index, pile.Base.length, pile.Base.width, pile.Tension_Base );
        setValue(!value);
    }
    const setBaseWidth_max = () => {
        pile.Base.width = Elevators.FloorCurrentDimensions.Width;
        pile.Y = pile.Base.width/2;
        Elevators.setPile_Location ( index, pile.X, pile.Y, pile.angle );
        Elevators.setPile_BaseContur ( index, pile.Base.length, pile.Base.width, pile.Tension_Base );
        setValue(!value);
    }
    const setBase_Square = () => {
        pile.Tension_Base = 1.753;
        Elevators.setPile_BaseContur ( index, pile.Base.length, pile.Base.width, pile.Tension_Base );
        setValue(!value);
    }
    const setBase_Round = () => {
        pile.Tension_Base = 0.837;
        Elevators.setPile_BaseContur ( index, pile.Base.length, pile.Base.width, pile.Tension_Base );
        setValue(!value);
    }
    const ChangeBase_width = (event) => {
        pile.Base.width = event.target.value;
        Elevators.setPile_BaseContur ( index, pile.Base.length, pile.Base.width, pile.Tension_Base );
        setValue(!value);
    };
    const ChangeTensionBase = (event) => {
        pile.Tension_Base = event.target.value;
        Elevators.setPile_BaseContur ( index, pile.Base.length, pile.Base.width, pile.Tension_Base );
        setValue(!value);
    };
    const ChangeTensionVolume = (event) => {
        pile.Tension_Volume = event.target.value;
        Elevators.setPile_TopContur ( index, pile.Top.length, pile.Top.width, pile.Tension_Volume );
        setValue(!value);
    };
    const ChangeTop_length = (event) => {
        pile.Top.length = event.target.value;
        //pile.Top.length_left =  ( Number( pile.Base.length ) - Number( pile.Top.length ) ) / 2 ;
        //pile.Top.length_right = pile.Top.length_left;
        Elevators.setPile_TopContur ( index, pile.Top.length, pile.Top.width, pile.Tension_Volume );
        setValue(!value);
    };
    const ChangeTop_width = (event) => {
        pile.Top.width = event.target.value;
        //pile.Top.width_front =  ( Number( pile.Base.width ) - Number( pile.Top.width ) ) / 2 ;
        //pile.Top.width_aft = pile.Top.width_front;
        Elevators.setPile_TopContur ( index, pile.Top.length, pile.Top.width, pile.Tension_Volume );
        setValue(!value);
    };

    return (
        <div className='block' style={{ flexDirection: 'row', height: 580 }}>
        <div className='block' style={{ width: 300 }}>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>

                <label><strong>Pile № {propsPile.index + 1 }</strong></label>

            <div>
                <button 
                    className='myButton'
                    onClick={ (e)=>( Elevators.PileAdd(), propsPile.callback( !propsPile.updateState ) ) }
                >add</button>

                <button 
                    className='myButton'
                    onClick={()=>( Elevators.PileClone(index), propsPile.callback( !propsPile.updateState ) )}
                >clone</button>
            </div>

                <button
                    className='myButton'
                    disabled = { Elevators.FloorFound ? false : true }
                    onClick={()=>( Elevators.PileDel( index ), propsPile.callback( !propsPile.updateState ) )}
                >del</button>

            </div>

            <div><hr/></div>

            <div className='rowPile' style={{ width: 250 }}>
                <label>name:</label>
                <input 
                    className='inputPile' 
                    style={{ width: 180 }}
                    value = {pile.Name}
                    onChange={ ChangeName }
                />
            </div>
            <div className='rowPile' >
                <label>Pile type:</label>
                <select  
                    disabled
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
                    disabled
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
                    disabled
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
                <input className='inputPile' type ='number' min = '0' step = '0.05' value = {pile.X} onChange={ ChangeX }/>
            </div>
            <div className='rowPile'>
                <label>Location Y:</label>
                <input className='inputPile' type ='number' min = '0' step = '0.05' value = {pile.Y} onChange={ ChangeY }/>
            </div>
            <div className='rowPile'>
                <label>Orientation (angle):</label>
                <input className='inputPile' type ='number' value = {pile.angle} onChange={ ChangeAngle }/>
            </div>
            <div><hr/></div>
            <div className='rowPile'>
                <label><strong>Pile height (hat):</strong></label>
                <input
                    className='inputPile'
                    style={{ backgroundColor: ( +pile.Height > 0  ? '' : 'yellow' ) }}
                    type ='number' 
                    min = '0' step='0.01' value = {pile.Height} onChange={ ChangeHeight }/>
            </div>

            <div><hr/></div>
            <label style={{ color: 'red' }}><strong>Top contur:</strong></label>

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
            <label style={{ color: 'magenta' }}><strong>Base contur:</strong></label>

            <div className='rowPile'>
                <label>length:</label>
                <div style={{ marginTop: -1.1, marginBottom: -1.1 }}>
                <button 
                    className='myButton'
                    style={{ height: 20, fontSize: '0.9rem' }}
                    onClick={setBaseLength_max}
                    >max</button>
                <input className='inputPile' style={{ height: 18.8 }} type ='number' min={0.01} step={0.01} value = {pile.Base.length} onChange={ ChangeBase_length }/>
                </div>
            </div>
            <div className='rowPile'>
                <label>width:</label>
                <div style={{ marginTop: -1.1, marginBottom: -1.1 }}>
                <button 
                    className='myButton'
                    style={{ height: 20, fontSize: '0.9rem' }}
                    onClick={setBaseWidth_max}
                    >max</button>
                <input className='inputPile' style={{ height: 18.8 }} type ='number' min={0.01} step={0.01} value = {pile.Base.width} onChange={ ChangeBase_width }/>
                </div>
            </div>

            <div className='rowPile' >
                <label >Tension Base:</label>
                <div>
                    <button 
                        className='myButton' 
                        style={{ height: 20, width: 20, fontSize: '0.7rem', borderRadius: 2 }}
                        onClick={setBase_Square}
                        >S</button>
                    <button 
                        className='myButton'
                        style={{ height: 20, width: 20, fontSize: '0.7rem' }}
                        onClick={setBase_Round}
                        >R</button>
                    <input className='inputPile' type ='number' min="0" max="2" step="0.01" value = {pile.Tension_Base} onChange={ ChangeTensionBase }/>
                </div>
            </div>
            <input style={{ width: '97%' }} type ='range' min="0" max="2" step="0.01" value = {pile.Tension_Base} onChange={ ChangeTensionBase }/>

            <div className='rowPile' >
                <label >Tension Volume:</label>
                <input className='inputPile'  type ='number' min="0" max="1" step="0.01" value = {pile.Tension_Volume} onChange={ ChangeTensionVolume }/>
            </div>
            <input style={{ width: '97%' }} type ='range' min="0" max="1" step="0.01" value = {pile.Tension_Volume} onChange={ ChangeTensionVolume }/>

            <div><hr/></div>

            <div className='rowPile' >
                <label ><strong>Box Height:</strong></label>
                <input className='inputPile' type ='number' min="0" step="0.01" value = {pile.underBase_Height} onChange={ ChangeUnderBase_Height }/>
            </div>

            <div><hr/></div>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'end' }}>
                <button 
                    className='myButton'
                    style={{ width: 50 }}
                    onClick={()=>( iolocal.SaveElevator() )}
                    >Save
                </button>
            </div>
        </div>

        <div className='block' style={{ width: '100%' }}>
            { Elevators.FloorFound ?  <PileViewCanvas index={index} mode={mode} callback={(data)=> setMode( data ) } /> : '' }
        </div>

        </div>
    )
}

function FloorSidePanel_3D( props ) {

    const [ value, setValue ] = React.useState( false );
    let step_xy = Elevators.get_Floor_MeshStep;
    //const [step_xy, setStep_xy ] = React.useState( Elevators.get_Floor_MeshStep );
    //const [ meshView, setMeshView] = React.useState(true);
    //const [ houseView, setHouseView] = React.useState( Elevators.get_Floor_ShowHouse );
    let houseView = Elevators.get_Floor_ShowHouse
    //const [ colorMulti, setColorMulti] = React.useState( Elevators.get_Floor_Multicolor );
    let colorMulti = Elevators.get_Floor_Multicolor;
    let meshStyle = Elevators.get_Floor_MeshStyle;

    //let houseView = true;
    //houseView = Elevators.get_Floor_ShowHouse;
    //console.log('houseView = ',houseView);

    const changeMeshStep = (event)=>{
        Elevators.set_Floor_MeshStep = +event.target.value;
        //Elevators.set_Floor_MeshStep = +event.target.value;
        //setStep_xy( +event.target.value );
        setValue( !value );
    }

    const changeShowHouse = (event)=>{
        Elevators.set_Floor_ShowHouse = event.target.checked;
        //setHouseView( event.target.checked );
        props.callback( !props.updateState );
        setValue( !value );
    }

    const changeMulticolor = (event)=>{
        Elevators.set_Floor_Multicolor = event.target.checked;
        //setColorMulti( event.target.checked );
        props.callback( !props.updateState );
        setValue( !value );
    }

    const setMeshStyle_mesh = ()=>{
        Elevators.set_Floor_MeshStyle = 'mesh';
        props.callback( !props.updateState );
        setValue(!value);
    }

    const meshCalc = ()=>{
        Elevators.set_Floor_Mesh = step_xy;
        props.callback( !props.updateState );
    }

    const keyPress = (event)=>{
        if ( event.keyCode == 13 )  meshCalc();
    }

    const setMeshStyle_solid = ()=>{
        Elevators.set_Floor_MeshStyle = 'solid';
        props.callback( !props.updateState );
        setValue(!value);
    }


    return (
        <div>
                <button
                    className='myButton'
                    style={{ width: 90 }}
                    onClick={ meshCalc }
                    >calc</button>
                <div className='block'>
                <label className='myText' >Mesh Step</label>
                <input 
                    className='inputPile'
                    id="meshStep" name="meshStep"
                    type='number'
                    value={ step_xy }
                    step={2}
                    min={0}
                    onChange={ changeMeshStep }
                    onKeyUp={ keyPress }
                    />
                </div>
                
                <div className='block' >
                <label className='myText' >View:</label>

                <button
                    className='myButton'
                    style= { meshStyle == 'mesh' ? { width: 80, borderWidth: 2, borderColor: 'lime' } : { width: 80} }
                    onClick={ setMeshStyle_mesh }
                    >Mesh</button>

                <button
                    className='myButton'
                    style={ meshStyle == 'solid' ? { width: 80, borderWidth: 2, borderColor: 'lime' } : { width: 80} }
                    onClick={ setMeshStyle_solid }
                    >Solid</button>
                </div>

                <div className='block'>
                <label className='myText' htmlFor='houseView'>Show warehouse</label>
                <input 
                    className='inputPile'
                    type='checkbox'
                    checked={ houseView }
                    id="houseView" name="houseView"
                    onChange={ changeShowHouse }
                    />
                
                </div>

                <div className='block'>
                <label className='myText' htmlFor="colorMulti">Multicolor</label>
                <input 
                    className='inputPile'
                    type='checkbox'
                    checked={ colorMulti }
                    id="colorMulti" name="colorMulti"
                    onChange={ changeMulticolor }
                    />
                
                </div>

        </div>
    )

}


function Pile_Side_Menu(props){

    let currentPile = props.currentPile;

    const [ index, setIndex ] =React.useState( currentPile );

    const [ pile, setPile ] = React.useState( Elevators.PileGet( currentPile ) );

    if ( currentPile != index ) {
        if ( currentPile < Elevators.PileFound ) {
            setIndex( currentPile );
            setPile( Elevators.PileGet( currentPile ) );
        } else {
            setIndex( 0 );
            setPile( 0 )
        }
    }

    const [value, setValue] = React.useState(false);
    //const [mode, setMode] = React.useState('model');
    let mode = props.mode;

    const changePileCurrent = (event) => {
        setIndex( event.target.value );
        setPile( Elevators.PileGet( event.target.value ) );
        props.callbackPile( event.target.value );
        //props.callback( !props.updateState );
    };

    const ChangeName = (event) => {
        pile.Name = event.target.value;
        Elevators.setPile_BaseInfo ( index, pile.Name, pile.type, pile.type_location, pile.purpose );
        setValue(!value);
    };
    const ChangeType = (event) => {
        pile.type = event.target.value;
        Elevators.setPile_BaseInfo ( index, pile.Name, pile.type, pile.type_location, pile.purpose );
        setValue(!value);
        props.callback( !props.updateState );
    };
    const ChangeTypeLocation = (event) => {
        pile.type_location = event.target.value;
        Elevators.setPile_BaseInfo ( index, pile.Name, pile.type, pile.type_location, pile.purpose );
        setValue(!value);
        props.callback( !props.updateState );
    };
    const ChangePurpose = (event) => {
        pile.purpose = event.target.value;
        Elevators.setPile_BaseInfo ( index, pile.Name, pile.type, pile.type_location, pile.purpose );
        setValue(!value);
        props.callback( !props.updateState );
    };
    const ChangeX = (event) => {
        pile.X = event.target.value;
        Elevators.setPile_Location ( index, pile.X, pile.Y, pile.angle );
        //setMode('location');
        setValue(!value);
        props.callbackMode( 'location' );
        props.callback( !props.updateState );
    };
    const ChangeY = (event) => {
        pile.Y = event.target.value;
        Elevators.setPile_Location ( index, pile.X, pile.Y, pile.angle );
        //setMode('location');
        setValue(!value);
        props.callbackMode( 'location' );
        props.callback( !props.updateState );
    };
    const ChangeAngle = (event) => {
        pile.angle = event.target.value;
        Elevators.setPile_Location ( index, pile.X, pile.Y, pile.angle );
        //setMode('location');
        setValue(!value);
        props.callbackMode( 'location' );
        props.callback( !props.updateState );
    };
    const ChangeHeight = (event) => {
        pile.Height = event.target.value;
        Elevators.setPile_Height ( index, pile.Height );
        setValue(!value);
        props.callback( !props.updateState );
    };
    const ChangeUnderBase_Height = (event) => {
        pile.underBase_Height = event.target.value;
       if ( pile.underBase_Height < 0 ) pile.underBase_Height = 0;
        Elevators.setPile_underBase_Height ( index, pile.underBase_Height);
        setValue(!value);
        props.callback( !props.updateState );
    };
    const ChangeBase_length = (event) => {
        pile.Base.length = event.target.value;
        Elevators.setPile_BaseContur ( index, pile.Base.length, pile.Base.width, pile.Tension_Base );
        setValue(!value);
        props.callback( !props.updateState );
    };
    const setBaseLength_max = () => {
        pile.Base.length = Elevators.FloorCurrentDimensions.Length;
        pile.X = pile.Base.length/2;
        Elevators.setPile_Location ( index, pile.X, pile.Y, pile.angle );
        Elevators.setPile_BaseContur ( index, pile.Base.length, pile.Base.width, pile.Tension_Base );
        setValue(!value);
        props.callback( !props.updateState );
    }
    const setBaseWidth_max = () => {
        pile.Base.width = Elevators.FloorCurrentDimensions.Width;
        pile.Y = pile.Base.width/2;
        Elevators.setPile_Location ( index, pile.X, pile.Y, pile.angle );
        Elevators.setPile_BaseContur ( index, pile.Base.length, pile.Base.width, pile.Tension_Base );
        setValue(!value);
        props.callback( !props.updateState );
    }
    const setBase_Square = () => {
        pile.Tension_Base = 1.753;
        Elevators.setPile_BaseContur ( index, pile.Base.length, pile.Base.width, pile.Tension_Base );
        setValue(!value);
        props.callback( !props.updateState );
    }
    const setBase_Round = () => {
        pile.Tension_Base = 0.837;
        Elevators.setPile_BaseContur ( index, pile.Base.length, pile.Base.width, pile.Tension_Base );
        setValue(!value);
        props.callback( !props.updateState );
    }
    const ChangeBase_width = (event) => {
        pile.Base.width = event.target.value;
        Elevators.setPile_BaseContur ( index, pile.Base.length, pile.Base.width, pile.Tension_Base );
        setValue(!value);
        props.callback( !props.updateState );
    };
    const ChangeTensionBase = (event) => {
        pile.Tension_Base = event.target.value;
        Elevators.setPile_BaseContur ( index, pile.Base.length, pile.Base.width, pile.Tension_Base );
        setValue(!value);
        props.callback( !props.updateState );
    };
    const ChangeTensionVolume = (event) => {
        pile.Tension_Volume = event.target.value;
        Elevators.setPile_TopContur ( index, pile.Top.length, pile.Top.width, pile.Tension_Volume );
        setValue(!value);
        props.callback( !props.updateState );
    };
    const ChangeTop_length = (event) => {
        pile.Top.length = event.target.value;
        Elevators.setPile_TopContur ( index, pile.Top.length, pile.Top.width, pile.Tension_Volume );
        setValue(!value);
        props.callback( !props.updateState );
    };
    const ChangeTop_width = (event) => {
        pile.Top.width = event.target.value;
        Elevators.setPile_TopContur ( index, pile.Top.length, pile.Top.width, pile.Tension_Volume );
        setValue(!value);
        props.callback( !props.updateState );
    };

    return (
        <div className='block' style={{ flexDirection: 'row', minHeight: '580px' }}>
        <div style={{ width: 255 }}>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>

            <div>
                <button 
                    className='myButton'
                    onClick={ (e)=>( Elevators.PileAdd(), props.callback( !props.updateState ) ) }
                >add</button>

                <button 
                    className='myButton'
                    onClick={()=>( Elevators.PileClone(index), props.callback( !props.updateState ) )}
                >clone</button>
            </div>

                <button
                    className='myButton'
                    disabled = { Elevators.FloorFound ? false : true }
                    onClick={()=>( Elevators.PileDel( index ), props.callback( !props.updateState ) )}
                >del</button>

            </div>

            <div><hr/></div>

            <div className='rowPile' style={{ width: 250 }}>
                <label><strong>Selected Pile:</strong></label>
                <select 
                    style={{ width: '150px' }}
                    id = 'pile_select'
                    label = 'pile_select'
                    value={ index }
                    onChange={ changePileCurrent }
                >
                    {Elevators.PilesList.map((name, index ) => (
                        <option key={ index } value={ index }>
                            { index + 1 +'. ' + name }
                        </option>
                    ))}
                </select>
            </div>

            <div className='rowPile' style={{ width: 250 }}>
                <label>name:</label>
                <input 
                    className='inputPile' 
                    style={{ width: 180 }}
                    value = {pile.Name}
                    onChange={ ChangeName }
                />
            </div>
            <div className='rowPile' >
                <label>Pile type:</label>
                <select  
                    disabled
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
                    disabled
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
                    disabled
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
                <input className='inputPile' type ='number' min = '0' step = '0.05' value = {pile.X} onChange={ ChangeX }/>
            </div>
            <div className='rowPile'>
                <label>Location Y:</label>
                <input className='inputPile' type ='number' min = '0' step = '0.05' value = {pile.Y} onChange={ ChangeY }/>
            </div>
            <div className='rowPile'>
                <label>Orientation (angle):</label>
                <input className='inputPile' type ='number' value = {pile.angle} onChange={ ChangeAngle }/>
            </div>
            <div><hr/></div>
            <div className='rowPile'>
                <label><strong>Pile height (hat):</strong></label>
                <input
                    className='inputPile'
                    style={{ backgroundColor: ( +pile.Height > 0  ? '' : 'yellow' ) }}
                    type ='number' 
                    min = '0' step='0.01' value = {pile.Height} onChange={ ChangeHeight }/>
            </div>

            <div><hr/></div>
            <label style={{ color: 'red' }}><strong>Top contur:</strong></label>

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
            <label style={{ color: 'magenta' }}><strong>Base contur:</strong></label>

            <div className='rowPile'>
                <label>length:</label>
                <div style={{ marginTop: -1.1, marginBottom: -1.1 }}>
                <button 
                    className='myButton'
                    style={{ height: 20, fontSize: '0.9rem' }}
                    onClick={setBaseLength_max}
                    >max</button>
                <input className='inputPile' style={{ height: 18.8 }} type ='number' min={0.01} step={0.01} value = {pile.Base.length} onChange={ ChangeBase_length }/>
                </div>
            </div>
            <div className='rowPile'>
                <label>width:</label>
                <div style={{ marginTop: -1.1, marginBottom: -1.1 }}>
                <button 
                    className='myButton'
                    style={{ height: 20, fontSize: '0.9rem' }}
                    onClick={setBaseWidth_max}
                    >max</button>
                <input className='inputPile' style={{ height: 18.8 }} type ='number' min={0.01} step={0.01} value = {pile.Base.width} onChange={ ChangeBase_width }/>
                </div>
            </div>

            <div className='rowPile' >
                <label >Tension Base:</label>
                <div>
                    <button 
                        className='myButton' 
                        style={{ height: 20, width: 20, fontSize: '0.7rem', borderRadius: 2 }}
                        onClick={setBase_Square}
                        >S</button>
                    <button 
                        className='myButton'
                        style={{ height: 20, width: 20, fontSize: '0.7rem' }}
                        onClick={setBase_Round}
                        >R</button>
                    <input className='inputPile' type ='number' min="0" max="2" step="0.01" value = {pile.Tension_Base} onChange={ ChangeTensionBase }/>
                </div>
            </div>
            <input style={{ width: '97%' }} type ='range' min="0" max="2" step="0.01" value = {pile.Tension_Base} onChange={ ChangeTensionBase }/>

            <div className='rowPile' >
                <label >Tension Volume:</label>
                <input className='inputPile'  type ='number' min="0" max="1" step="0.01" value = {pile.Tension_Volume} onChange={ ChangeTensionVolume }/>
            </div>
            <input style={{ width: '97%' }} type ='range' min="0" max="1" step="0.01" value = {pile.Tension_Volume} onChange={ ChangeTensionVolume }/>

            <div><hr/></div>

            <div className='rowPile' >
                <label ><strong>Box Height:</strong></label>
                <input className='inputPile' type ='number' min="0" step="0.01" value = {pile.underBase_Height} onChange={ ChangeUnderBase_Height }/>
            </div>

            <div><hr/></div>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'end' }}>
                <button 
                    className='myButton'
                    style={{ width: 50 }}
                    onClick={()=>( iolocal.SaveElevator() )}
                    >Save
                </button>
            </div>
        </div>
        </div>
        );
};


function Pile_Side_3D_menu( props ) {

    const [ mode, setMode ] = React.useState( props.mode );
    //const [ view, setView] = React.useState( props.view );
    let view = props.view ;

    let pile = Elevators.PileGet( props.currentPile );

   // const [ mesh, setMesh ] = React.useState([]);

    /*const calcMesh = () => {
        setMesh(Elevators.get_Volume_Piles(Elevators.WarehouseSelected).mesh);
        console.log('calcMesh = ',mesh);
    };*/

    const setModeModel = (event) => {
        setMode('model');
        props.callbackMode( 'model' );
    };

    const setModeLocation = (event) => {
        setMode('location');
        props.callbackMode( 'location' );
    };

    /*const changeAngleX = (event) => {
        pile.angle_X = event.target.value;
        Elevators.setAngleView( props.currentPile, pile.angle_X, pile.angle_Y, pile.angle_Z );
        //setValue(!value);
        props.callback( !props.updateState );
    };*/

    const changeAngleX_minus = (event) => {
        //pile.angle_X = pile.angle_X - 0.1;
        view.x = view.x - 0.1;
        props.callbackView( view );
       // Elevators.setAngleView( props.currentPile, pile.angle_X, pile.angle_Y, pile.angle_Z );
        //setValue(!value);
        props.callback( !props.updateState );
    };

    const changeAngleX_plus = (event) => {
        //pile.angle_X = pile.angle_X + 0.1;
        view.x = view.x + 0.1;
        props.callbackView( view );
        //Elevators.setAngleView( props.currentPile, pile.angle_X, pile.angle_Y, pile.angle_Z );
        //setValue(!value);
        props.callback( !props.updateState );
    };

    const changeAngleY_minus = (event) => {
        //pile.angle_Z = pile.angle_Z + 0.1;
        view.z = view.z + 0.1;
        props.callbackView( view );
        //Elevators.setAngleView( props.currentPile, pile.angle_X, pile.angle_Y, pile.angle_Z );
        //setValue(!value);
        props.callback( !props.updateState );
    };

    const changeAngleY_plus = (event) => {
        //pile.angle_Z = pile.angle_Z - 0.1;
        view.z = view.z - 0.1;
        props.callbackView( view );
        //Elevators.setAngleView( props.currentPile, pile.angle_X, pile.angle_Y, pile.angle_Z );
        //setValue(!value);
        props.callback( !props.updateState );
    };

    /*const changeAngleZ = (event) => {
        pile.angle_Z = event.target.value;
        Elevators.setAngleView( props.currentPile, pile.angle_X, pile.angle_Y, pile.angle_Z );
        //setValue(!value);
        props.callback( !props.updateState );
    };*/

    const viewUp = () => {
        view.x = 0;
        view.y = 0;
        view.z = 0;
        props.callbackView( view );
        //Elevators.setAngleView( props.currentPile, pile.angle_X, pile.angle_Y, pile.angle_Z ); 
        props.callback( !props.updateState );
    }

    const viewFront = () => {
        view.x = -3.14/2;
        view.y = 0;
        view.z = 0;
        props.callbackView( view );
       // Elevators.setAngleView( props.currentPile, pile.angle_X, pile.angle_Y, pile.angle_Z ); 
        props.callback( !props.updateState );
    }

    const viewSide = () => {
        view.x = -3.14/2;
        view.y = 0;
        view.z = -3.14/2;
        props.callbackView( view );
        //Elevators.setAngleView( props.currentPile, pile.angle_X, pile.angle_Y, pile.angle_Z ); 
        props.callback( !props.updateState );
    }

    const view3D = () => {
        view.x = -3.14*70/180;
        view.y = 3.14*25/180;
        view.z = -3.14*20/180;
        props.callbackView( view );
        //Elevators.setAngleView( props.currentPile, pile.angle_X, pile.angle_Y, pile.angle_Z ); 
        props.callback( !props.updateState );
    }

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
    
                    <button
                    className='myButton'
                    style={{ width: 80 }}
                    onClick={ viewUp }
                    >
                    Up
                    </button>
    
                    <button 
                    className='myButton'
                    style={{ width: 80 }}
                    onClick={ viewFront }
                    >
                    Front
                    </button>
    
                    <button 
                    className='myButton'
                    style={{ width: 80 }}
                    onClick={ viewSide }
                    >
                    Side
                    </button>
                
                    <button 
                    className='myButton'
                    style={{ width: 80 }}
                    onClick={ view3D }
                    >
                    3D
                    </button>
    
                    <div><hr/></div>
                    
                    <div style={{ margin: -3 }}>
    
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            <button
                            className='myButtonRound'
                            style={{ width: 30, height: 30 }}
                            onClick={changeAngleX_minus}
                            >▲</button>
                        </div>
    
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: -7, marginBottom: -7 }}>   
                        
                            <button
                                className='myButtonRound'
                                style={{ width: 30, height: 30 }}
                                onClick={changeAngleY_plus}
                            >◄</button>
    
                            <button
                                className='myButtonRound'
                                style={{ width: 30, height: 30 }}
                                onClick={changeAngleY_minus}
                            >►</button>
                                
                        </div>
    
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            <button
                            className='myButtonRound'
                            style={{ width: 30, height: 30 }}
                            onClick={changeAngleX_plus}
                            >▼</button>
                        </div>
    
                    </div>
    
                    <div><hr/></div>
    
                    <label className='myText'>View Mode:</label>
    
                    <button
                            className='myButton'
                            style={{ width: 80, height: 30 }}
                            onClick={ setModeModel }
                            >Model</button>
    
                        <button
                            className='myButton'
                            style={{ width: 80, height: 30 }}
                            onClick={ setModeLocation }
                            >Location</button>
                    </div>
        </div>
      )
    };