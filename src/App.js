import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import {useEffect, useState} from "react";
import { useContext } from 'react';
//import MenuApp from './js/menuapp.js';
import TopHeader from './js/top_header.js';
import ElevatorMenu from './js/menu-elevator.js';
import { Elevators } from './js/elevators.js';
import FileMenuButton from './js/file_menu.js';

import ElevatorTab from './js/elevator-tab.js';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { Button, ButtonGroup, Box } from '@mui/material';
import { Elevator, Label } from '@mui/icons-material';
import LocalServiceWorkerRegister from './js/sw-register';
import registerServiceWorker from './js/sw-register';
import { SitePath } from './js/sw-register';

import Main from './Main.js'
import Layout from './layout.js';
import Report_Floor from './report/report_floor.js';
import NoPage from "./404.js";

export function RoutePath(){
  let site_path = SitePath();
  let route_path = '';
  if ( site_path == 'http://localhost:3000/' ) route_path = '/';
  //if ( site_path == 'https://alvi0avcc.github.io/avcc-elevators/' ) route_path = '/avcc-elevators/';
  if ( site_path == 'https://alvi0avcc.github.io/avcc-elevators/' ) route_path = 'https://alvi0avcc.github.io/avcc-elevators/';
  return route_path;
}

function App() {
  registerServiceWorker();

  //let site_path = SitePath();
  let route_path = RoutePath();

  return (
    <>
      <link rel="manifest" href="manifest.json" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="application-name" content="PWA Workshop" />
      <meta name="apple-mobile-web-app-title" content="PWA Workshop" />
      <meta name="msapplication-starturl" content="/index.html" />
      <meta name="viewport" content="initial-scale=1, width=device-width" />

    <BrowserRouter>

      <Routes>
        <Route path={route_path} element={<Layout />}>
          <Route index element={<Main />}/>
          <Route path={route_path +'report_elevator'} element={< label />}/>
          <Route path={route_path +'report_complex'} element={< label />}/>
          <Route path={route_path +'report_silo'} element={< label />}/>
          <Route path={route_path +'report_warehouse'} element={< Report_Floor />}/>
          <Route path="*" element={<NoPage />}/>
        </Route>
      </Routes>

    

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
    
    

    

    </BrowserRouter>
    </>
  );
} export default App;

function ElVersion(){
  const requestURL = window.location.href+'package.json';
  let request = new XMLHttpRequest();
  let fileJson;
  request.open('GET', requestURL);
  request.responseType = '';
  request.send();
  request.onload = function() {
  fileJson = request.response;
  console.log('request=',request)
  console.log('requestURL=',requestURL)
  console.log('fileJson=',fileJson);
  }
};