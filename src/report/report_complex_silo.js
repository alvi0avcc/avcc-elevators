import * as React from 'react';
import { Elevators } from '../js/elevators.js';
import * as iolocal from '../js/iolocal';
import ElevatorInfo from './elevator-info.js';
import AuditorInfo from './auditor_info.js';
import FloorViewCanvas from '../js/floor-draw-view.js'; 
import PilesViewCanvas from '../js/piles-draw-view.js'; 

function ComplexSimpleProps(index) {
  return {
    id: `complexInfoBase-${index}`,
    'aria-controls': `complexInfoBase-${index}`,
  };
}

function floorProps(index) {
    return {
      id: `florInfo-${index}`,
      'aria-controls': `florInfo-${index}`,
    };
  }

export default function  Report_Floor (){

  Elevators.setElevators =  iolocal.OpenElevator();
  Elevators.OpenCurrent();
  
  //console.log('current = ',props.index);

  return(
    <div className='block' >

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <ElevatorInfo/>
        <AuditorInfo/>
      </div>

      <h3><center>Inspection Report №</center></h3>

      <SiloComplexInfo/>

      <h4><center>--- Details ---</center></h4>

      <FloorsHouseInfo/>

        <div style={{ display: 'none' }}>
            { Elevators.FloorFound ?  <label/> : '' }
        </div>

    </div>
    )
};


function SiloComplexInfo(){
  //let dim = Elevators.FloorCurrentDimensions;
  //let floor_data = Elevators.get_Warehouses_Info();
  //console.log( Elevators.get_FloorListInfo );
  let total  = Elevators.get_ComplexSilo_Cargos_Total();

  return (
    <div className="block">
        <table className='tableObjectInfo'>
        <caption>Inspected the next Silo complex №: {Elevators.ComplexList.map((name, index ) => ( name + ', ' )) }</caption>
        <tbody>

        {Elevators.ComplexList.map((name, index ) => ( <BuildingInfoBase index={index} data={name} {...ComplexSimpleProps(index)}/> )) }

        <tr>
          <td colSpan="5">Total:</td>
        </tr>


        </tbody>
      </table>
    </div>
  )
}

function BuildingInfoBase(props){
  let cargos = Elevators.get_ComplexSilo_Cargos(props.index);
  //console.log('cargos = ',cargos);
return (
  <>
    <tr>
      <td colSpan="5"><strong>Complex № { props.data }</strong></td>
    </tr>
    {cargos.map( (data, index) => ( <><tr><td colSpan="2">Cargo: <strong>{data.cargoName}</strong></td><td>Test Weight: {data.tw}</td><td>Volume = {data.volume} (m³)</td><td>Weight = <strong>{data.weight} (MT)</strong></td></tr><tr><td colSpan="5">Cargo placed in silo №: { data.name }</td></tr></> ) ) }
  </>
)
}

function FloorsHouseInfo(){
  let piles = Elevators.PilesList;

  let index = 0;

  return (
    <>
        { Elevators.FloorList.map((name, index ) => ( <FloorInfo index = {index} {...floorProps(index)} /> )) }
    </>
  )
}


function FloorInfo( props ){
  let index = 0;
  index = props.index;

  let floor = Elevators.get_FloorByIndex(index);

  //console.log('Elevators.get_FloorByIndex(index) = ',floor);

  return (
    <div 
      id={'PileInfo'} 
      className='block'
      style={{ display:'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
      
      <div style={{ height: '200px', width: '60%' }}>
      <table className='tableObjectInfo'>
        <caption><strong>Information about Warehouse № {floor.Name}</strong></caption>
        <tbody>

        <tr>
          <td>Length = {floor.Dimensions.Length} (m)</td>
          <td>Width = {floor.Dimensions.Width}(m)</td>
          <td>Height = {floor.Dimensions.Height}(m)</td>
        </tr>

        <tr>
          <td colSpan="3">
            { floor.Dimensions.Conus_height > 0 ? 'Warehouse floor with slope. Slope depth = '+ floor.Dimensions.Conus_height +' (m)' : 'Warehouse floor is flat, without slope.'}
          </td>
        </tr>

        <tr>
            <td colSpan="2">Cargo name: {floor.Cargo.Name}</td>
            <td>Test Weight = { floor.Cargo.Natura } { floor.Cargo.Natura > 100 ? '(g/L)' : '(Kg/hL)'}</td>
        </tr>

        <td colSpan="3">The warehouse consists of {floor.Pile.length} piles</td>

        <tr>
          <td colSpan="3"><strong>Volume = { floor.Volume } (m³)</strong></td>
        </tr>
        <tr>
          <td colSpan="3"><strong>Weight = { floor.Weight } (MT)</strong></td>
        </tr>

        </tbody>
      </table>
      </div>

      <div 
        id={'div-floor-'+index} 
        className='block'
        style={{ height: '200px', width: '40%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <img id={'img-floor-'+index} alt={'img-floor-'+index} />
      </div>



    </div>
  )
}