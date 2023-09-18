import React from 'react';
import { Link } from "react-router-dom";
import FileMenuButton from './js/file_menu.js';
import ElevatorMenu from './js/menu-elevator.js';
import { Elevators } from './js/elevators.js';
import { RoutePath } from './App.js';


export const UpdateContext = React.createContext(false);
UpdateContext.displayName = 'UpdateContext';

const Main = () => {
  const [update, setUpdate] = React.useState();
  let route_path = RoutePath();
  console.log('route_path = ',route_path);

  return (
    <>
    <UpdateContext.Provider value={ [update, setUpdate] }>
      
      <div style={{ width: '100%' }}>
        <FileMenuButton/>

        <div 
            className="block"
            style={{ display: ( Elevators.State != 'closed' ? 'block' : 'none' ) }}
            >
            <nav>
                <label className='myText' >Reports →</label>
                <Link style={{ display: 'none' }} className='myButtonNav' to="/report_elevator" target='_blank' >Elevator</Link>
                <Link className='myButtonNav' to="/report_complex_silo" target='_blank' >Silo Complex</Link>
                <Link className='myButtonNav' to="/report_warehouses" target='_blank' >Warehouses</Link>
                <Link className='myButtonNav' to="/report_warehouse" target='_blank' >Warehouse</Link>
            </nav>
        </div>

        <ElevatorMenu />

        <div><hr/></div>

      </div>

    </UpdateContext.Provider>

    </>
  )
};

export default Main;