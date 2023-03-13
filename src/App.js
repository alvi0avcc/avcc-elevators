import React from 'react';
import {useEffect, useState} from "react";
import { useContext } from 'react';
import MenuApp from './js/menuapp.js';
import ElevatorMenu from './js/menu-elevator.js';
import { Elevators } from './js/elevators.js';
import ElevatorTab from './js/elevator-tab.js';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { Button } from '@mui/material';
import { Label } from '@mui/icons-material';

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
        <Button>©&nbsp;2023&nbsp; AVCC</Button> 
        <Button onClick={ () => { alert( 'Calculation of the volume and weight of cargo on elevators' ) }} >
          About</Button>
          <Button onClick={ () => {
            let email = document.createElement("a");
            email.href = "mailto:cargo.control.ua@gmail.com";
            email.click()} }>
          FeedBack</Button>
        <Button onClick={ () => { alert( 'MIT License. Copyright (c) 2023 Aleksandr Vavilov (alvi.ua@gmail.com)' ) }} >
        Legal Notices</Button>
    </Stack>
    <Divider/>
    </div>
  );
} export default App;

