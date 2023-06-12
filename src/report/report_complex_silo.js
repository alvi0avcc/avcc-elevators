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
    key: `${index}`,
    'aria-controls': `complexInfoBase-${index}`,
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

    </div>
    )
};


function SiloComplexInfo(){
  let total  = Elevators.get_ComplexSilo_Cargos_Total();

  return (
    <div className="block" id='SiloComplexInfo'>
      <table className='tableObjectInfo'>
        <caption>Inspected the next Silo complex №: {Elevators.ComplexList.map((name, index ) => ( name + ', ' )) }</caption>
        <tbody>
        </tbody>
      </table>

      <br/>

      {Elevators.ComplexList.map((name, index ) => ( <BuildingInfoBase index={index} data={name} {...ComplexSimpleProps(index)}/> )) }

      <table className='tableObjectInfo'>
        <caption><strong>Total:</strong></caption>
        <tbody>
          {total.map( (data, index) => ( <><tr><td colSpan="2">Cargo: <strong>{data.cargoName}</strong></td><td>Test Weight: {data.tw}</td><td>Volume = {data.volume} (m³)</td><td>Weight = <strong>{data.weight} (MT)</strong></td></tr></> ) ) }
        </tbody>
      </table>
      
    </div>
  )
}

function BuildingInfoBase(props){
  let cargos = Elevators.get_ComplexSilo_Cargos(props.index);
  //console.log('cargos = ',cargos);
  console.log('props = ',props);
return (
  <table 
    className='tableObjectInfo'
    >
    <caption><strong>Complex № { props.data }</strong></caption>
    <tbody>
      {cargos.map( (data, index) => ( <><tr><td colSpan="2">Cargo: <strong>{data.cargoName}</strong></td><td>Test Weight: {data.tw}</td><td>Volume = {data.volume} (m³)</td><td>Weight = <strong>{data.weight} (MT)</strong></td></tr><tr><td colSpan="5">The cargo is in the silos №: { data.name }</td></tr></> ) ) }
    </tbody>
  </table>
)
}