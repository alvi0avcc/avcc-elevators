import * as React from 'react';
import { Elevators } from '../js/elevators.js';
import * as iolocal from '../js/iolocal';
import ElevatorInfo from './elevator-info.js';
import AuditorInfo from './auditor_info.js';
import FloorViewCanvas from '../js/floor-draw-view.js'; 
import PilesViewCanvas from '../js/piles-draw-view.js'; 

function a11yProps(index) {
  return {
    id: `pileInfo-${index}`,
    'aria-controls': `pileInfo-${index}`,
  };
}

export default function  Report_Floor (){

  Elevators.setElevators =  iolocal.OpenElevator();

  return(
    <div className='block' >

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <ElevatorInfo/>
        <AuditorInfo/>
      </div>

      <h3><center>Inspection Report №</center></h3>

      <FloorHouseInfo/>

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <div className='block' style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          { Elevators.FloorFound ?  <FloorViewCanvas report={true}/> : '' }
        </div>
      </div>

      <h4><center>--- Details ---</center></h4>

      <PilesInfo/>


    </div>
    )
};


function FloorHouseInfo(){
  let dim = Elevators.FloorCurrentDimensions;

  return (
    <div className="block">
        <table className='tableObjectInfo'>
        <caption>Information about Warehouse № {Elevators.FloorName}</caption>
        <tbody>

        <tr>
          <td>Length = {dim.Length} (m)</td>
          <td>Width = {dim.Width} (m)</td>
          <td>Height = {dim.Height} (m)</td>
        </tr>

        <tr>
          <td colSpan="3">
            { dim.Conus_height > 0 ? 'Warehouse floor with slope. Slope depth = '+ dim.Conus_height +' (m)' : 'Warehouse floor is flat, without slope.'}
          </td>
        </tr>

        <tr>
          <td>Cargo name</td>
          <td colSpan="2">{Elevators.get_Floor_CargoName}</td>
        </tr>

        <tr>
          <td>Cargo Test Weight</td>
          <td colSpan="2">
            {Elevators.get_Floor_CargoTW} {'('}{ Elevators.get_Floor_CargoTW > 100 ? 'g/L' : 'Kg/hL' }{')'}
          </td>
        </tr>

        </tbody>
      </table>
    </div>
  )
}

function PilesInfo(){
  let piles = Elevators.PilesList;

  let index = 0;
  //if ( Elevators.FloorFound > 0)  {
  //  PilesViewCanvas ( { updateState: true,  changePileInfo: true, callbackPileInfo: (data)=> {}, callback: (data)=> {}, currentPile: index, callbackPile: (data)=> {}, view: { x: -3.14*70/180, y: 3.14*25/180, z: -3.14*20/180 }, mode: 'model', report: true } );
  //}


  return (
    <>
    { piles.map((name, index ) => ( <PileInfo index = {index} key = {index} label={index+'-'+name} {...a11yProps(index)} /> )) }
    <div style={{ display: 'none' }}>
      { Elevators.FloorFound ?  <PilesViewCanvas updateState={ true }  changePileInfo={ true } callbackPileInfo={(data)=> {} } callback={(data)=> {} } currentPile={ index } callbackPile={(data)=> {} } view={ { x: -3.14*70/180, y: 3.14*25/180, z: -3.14*20/180 } } mode={ 'location' } report={true} /> : '' }
    </div>
    </>
  )
}


function PileInfo( props ){
  let index = 0;
  index = props.index;

  let pile = Elevators.PileGet(index);

  //console.log('Elevators.get_Pile_Image(index) = ',Elevators.get_Pile_Image(index));
  //document.body.appendChild(Elevators.get_Pile_Image(index));

  return (
    <div id={'PileInfo-'+index} style={{ display:'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
      
      <div style={{ width: '70%' }}>
      <table className='tableObjectInfo'>
        <caption><strong>Information about Pile № {index+1}</strong></caption>
        <tbody>

        <tr>
          <td>Total Height = {pile.Height + pile.underBase_Height} (m)</td>
          <td>Pile Height = {pile.Height} (m)</td>
          <td>Base Height = {pile.underBase_Height} (m)</td>
        </tr>

        <tr>
          <td>Base Length = {pile.Base.length} (m)</td>
          <td>Base Width = {pile.Base.width} (m)</td>
          <td>Conture coeff. = {pile.Tension_Base}</td>
        </tr>

        <tr>
          <td>Top Length = {pile.Top.length} (m)</td>
          <td>Top Width = {pile.Top.width} (m)</td>
          <td>Volume coeff. = {pile.Tension_Volume}</td>
        </tr>

        <tr>
          <td>Location X = {pile.X} (m)</td>
          <td>Location Y = {pile.Y} (m)</td>
          <td>Orientation (angle) = {pile.angle} (deg)</td>
        </tr>

        <tr>
          <td colSpan="3"><strong>Volume (excluding intersections) = {pile.Volume} (m³)</strong></td>
        </tr>
        <tr>
          <td colSpan="3"><strong>Weight (excluding intersections) = {pile.Weight} (MT)</strong></td>
        </tr>

        </tbody>
      </table>
      </div>

      <div id={'div-pile-'+index} style={{ height: '200px', width: '29%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <canvas id={'canvas-pile-'+index} alt={'canvas-pile-'+index} height={'200px'} width={'200px'}></canvas>
      </div>

    </div>
  )
}

//<div id={'div-pile-'+index} style={{ height: '200px', width: '29%' }}>
//{ Elevators.FloorFound ?  <PilesViewCanvas updateState={ true }  changePileInfo={ true } callbackPileInfo={(data)=> {} } callback={(data)=> {} } currentPile={ index } callbackPile={(data)=> {} } view={ { x: -3.14*70/180, y: 3.14*25/180, z: -3.14*20/180 } } mode={ 'model' } report={true} /> : '' }
//</div>