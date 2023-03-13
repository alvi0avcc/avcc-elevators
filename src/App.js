import React from 'react';
import {useEffect, useState} from "react";
import { useContext } from 'react';
import MenuApp from './js/menuapp.js';
import ElevatorMenu from './js/menu-elevator.js';
import { Elevators } from './js/elevators.js';
import ElevatorTab from './js/elevator-tab.js';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

export const UpdateContext = React.createContext(false);
UpdateContext.displayName = 'UpdateContext';

function App(props) {
  const [update, setUpdate] = useState();

  //if ("serviceWorker" in navigator) {
  //  navigator.serviceWorker.register("./js/sw.js");
  //}
  //self.addEventListener("install", (e) => {
  //  console.log("[Service Worker] Install");
  //});

  return (
    <div>
    <UpdateContext.Provider value={ {update, setUpdate} }>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <MenuApp />
      <ElevatorMenu />
    </UpdateContext.Provider>

    <Divider/>
    <Stack
      direction={'row'}
      justifyContent={'space-around'}
      divider={<Divider orientation="vertical" flexItem />} > 
        <a>©&nbsp;2023&nbsp; AVCC</a>
        <a href="/about">About</a>
        <a href="mailto: cargo.control.ua@gmail.com">Feedback</a>
        <a href="/terms">Legal Notices</a>
    </Stack>
    <Divider/>
    </div>
  );
} export default App;

