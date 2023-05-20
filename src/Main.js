import React from 'react';
import {useEffect, useState} from "react";
import { Outlet, Link } from "react-router-dom";
import { useContext } from 'react';
import { Button, ButtonGroup, Box } from '@mui/material';
import FileMenuButton from './js/file_menu.js';
import ElevatorMenu from './js/menu-elevator.js';
import Divider from '@mui/material/Divider';
import { Elevators } from './js/elevators.js';


export const UpdateContext = React.createContext(false);
UpdateContext.displayName = 'UpdateContext';

const Main = () => {
  const [update, setUpdate] = useState();

  return (
    <>
    <UpdateContext.Provider value={ [update, setUpdate] }>
      
      <Box sx={{ width: 'fullWidth' }}>

        <FileMenuButton/>

        <div 
            className="block"
            style={{ display: ( Elevators.State == 'open' ? 'block' : 'none' ) }}
            >
            <nav>
                <label className='myText' >Reports →</label>
                <Link style={{ display: 'none' }} className='myButtonNav' to="/avcc-elevators/report_elevator" target='_blank' >Elevator</Link>
                <Link className='myButtonNav' to="/avcc-elevators/report_warehouse" target='_blank' >Warehouse</Link>
            </nav>
        </div>

        <ElevatorMenu />
        <Divider/>


        </Box>
    </UpdateContext.Provider>

    </>
  )
};

export default Main;