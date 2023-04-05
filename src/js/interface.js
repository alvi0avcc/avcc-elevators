import * as React from 'react';
import * as Calc from './calc';
import * as iolocal from './iolocal';
import * as Dialogs from './dialogs';
import {useEffect, useState} from "react";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import Divider from '@mui/material/Divider';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import '@fontsource/roboto/300.css';
import { red } from '@mui/material/colors';
import { getPath } from '@mui/system';
import TextField from '@mui/material/TextField';
//import {FileInputButton, WarehouseToJSON} from './iolocal.js';
import {FileJSON} from './iolocal.js';
import { ElevatorOutlined } from '@mui/icons-material';
import Tooltip from '@mui/material/Tooltip';

import {DialogList} from "./dialogs";

//import { Mass } from './calc.js';
//import { Warehouse } from './calc.js';
//import {Pile} from './calc.js'
let WarehouseSelected = null;
let PileSelected = null;


function WarehouseSelect(props) {
    
   // useEffect(() => {
   //    if ( WarehouseNo || "") {
   //     console.log(WarehouseNo);
   //     WareNameSelected = Number(WarehouseNo);
   //    }
   // });

    //useEffect(() => { 
    //  Warehouse.Piles.push(Pile);
    //  console.log(Warehouse.Piles);
    //  }, [WareAdd]);

    //useEffect(() => {
    //  SetElevatorName(ENames[ElevatorSelected]);
    //  }, [ENames]);

    return (
        <Stack spacing={1} direction="row" justifyContent="center" alignItems="center">
        
        <IconButton color="primary" aria-label="Edit Elevator Name" component="label" onClick={() => { Dialogs.ElevatorDialogShow("ElevatorName", 0) }}>
          <Tooltip title="Edit Elevator Name">
            <SettingsTwoToneIcon />
          </Tooltip>
        </IconButton>
       
        <IconButton color="primary" aria-label="Edit Warehouse Name" component="label">
          <Tooltip title="Edit Warehouse Name">
            <SettingsTwoToneIcon />
          </Tooltip>
        </IconButton>
        
        <IconButton color="primary" aria-label="Edit Pile Name" component="label">
          <Tooltip title="Edit Pile Name">
            <SettingsTwoToneIcon />
          </Tooltip>
        </IconButton>
        </Stack>
    );
  }

//function ButtonInput(props) {return ( <FileInputButton/> ); }

/*function MenuUpper(props) { 
   return(
    <Stack spacing={1} direction="column">
        <Stack spacing={5} direction="row" justifyContent="center" alignItems="center">
          <ButtonInput/>  
        </Stack> 
        <Divider/>
        <Button variant="outlined" component="label" onClick={() => 
            {
              //Mass(WareNameSelected);
              //Warehouses(WareNameSelected);
                }}>
            Calculation
        </Button>
      <WarehouseSelect/>
    </Stack>
   ) 
} export {MenuUpper};*/

//function InputDataArea(props){
//  const [value_dx1, set_dx1] = useState(Warehouse.Piles[WareNameSelected].dx1 ?? "");
//  const [value_dy1, set_dy1] = useState(Warehouse.Piles[WareNameSelected].dy1 ?? "");
//  const [value_dh1, set_dh1] = useState(Warehouse.Piles[WareNameSelected].dh1 ?? "");
//  const [value_dx2, set_dx2] = useState(Warehouse.Piles[WareNameSelected].dx2 ?? "");
//  const [value_dy2, set_dy2] = useState(Warehouse.Piles[WareNameSelected].dy2 ?? "");
//  const [value_dh2, set_dh2] = useState(Warehouse.Piles[WareNameSelected].dh2 ?? "");
//  const [value_ux, set_ux] = useState(Warehouse.Piles[WareNameSelected].ux ?? "");
//  const [value_uy, set_uy] = useState(Warehouse.Piles[WareNameSelected].uy ?? "");
//  const [value_V1, set_V1] = useState(Warehouse.Piles[WareNameSelected].V1 ?? "");
//  const [value_V2, set_V2] = useState(Warehouse.Piles[WareNameSelected].V2 ?? "");
//  const [value_V, set_V] = useState(Warehouse.Piles[WareNameSelected].V ?? "");
//  const [value_natura, set_natura] = useState(Warehouse.Piles[WareNameSelected].Natura ?? "");
//  const [value_UdPogrV, set_UdPogrV] = useState(Warehouse.Piles[WareNameSelected].UdPogrV ?? "");
// const [value_M, set_M] = useState(Warehouse.Piles[WareNameSelected].M ?? "");
//
//  useEffect(() => { 
//      Warehouse.Piles[WareNameSelected].dx1 = value_dx1;
//      Warehouse.Piles[WareNameSelected].dy1 = value_dy1; 
//      Warehouse.Piles[WareNameSelected].dh1 = value_dh1;
//      Warehouse.Piles[WareNameSelected].dx2 = value_dx2;
//      Warehouse.Piles[WareNameSelected].dy2 = value_dy2;
//      Warehouse.Piles[WareNameSelected].dh2 = value_dh2;
//      Warehouse.Piles[WareNameSelected].ux = value_ux;
//      Warehouse.Piles[WareNameSelected].uy = value_uy;
//      Warehouse.Piles[WareNameSelected].Natura = value_natura;
//      Mass(WareNameSelected);
//      set_V1(Warehouse.Piles[WareNameSelected].V1);
//      set_V2(Warehouse.Piles[WareNameSelected].V2);
//      set_V(Warehouse.Piles[WareNameSelected].V);
//      set_UdPogrV(Warehouse.Piles[WareNameSelected].UdPogrV);
//      set_M(Warehouse.Piles[WareNameSelected].M);
//      });

//      Mass(WareNameSelected);
//  return(
//    <Box
//      component="form"
//      sx={{
//        '& .MuiTextField-root': { m: 1, width: '25ch' },
//      }}
//      noValidate
//      autoComplete="off"
//    >
//      <div>
//        <TextField
//          value={value_dx1} onChange={(event) => set_dx1(event.target.value)}
//          label="Длина основания"
//          helperText="Some important text"
//          type="number"
//        />
//        <TextField
//          value={value_dy1} onChange={(event) => set_dy1(event.target.value)}
//          label="Ширина основания"
//          helperText="Some important text"
//          type="number"
//        />
//        <TextField
//          value={value_dh1} onChange={(event) => set_dh1(event.target.value)}
//          label="Высота основания"
//          helperText="Some important text"
//          type="number"
//        />
//        </div>
//        <div>
//        <TextField
//          value={value_dx2} onChange={(event) => set_dx2(event.target.value)}
//          label="Длина основания"
//         helperText="Some important text"
//          type="number"
//        />
//        <TextField
//          value={value_dy2} onChange={(event) => set_dy2(event.target.value)}
//          label="Ширина основания"
//          helperText="Some important text"
//          type="number"
//        />
//        <TextField
//          value={value_dh2} onChange={(event) => set_dh2(event.target.value)}
//          label="Высота кучи"
//          helperText="Some important text"
//          type="number"
//        />
//        </div>
//        <div>
//        <TextField
//          value={value_ux} onChange={(event) => set_ux(event.target.value)}
//          label="Длина основания верха"
//          type="number"
//          helperText="Some important text"
//        />
//        <TextField
//          value={value_uy} onChange={(event) => set_uy(event.target.value)}
//         label="Ширина основания верха"
//          helperText="Some important text"
//          //type="number"
//        />
//      </div>
//      <div>
//        <TextField
//          value={value_V1} onChange={(event) => set_V1(event.target.value)}
//          label="Объём основания"
//          type="number"
//          helperText="Some important text"
//          InputProps={{
//            readOnly: true,
//          }}
//          variant="filled"
//        />
//        <TextField
//          value={value_V2} onChange={(event) => set_V2(event.target.value)}
//          label="Объём кучи"
//          helperText="Some important text"
//          type="number"
//          InputProps={{
//            readOnly: true,
//          }}
//          variant="filled"
//        />
//        <TextField
//          value={value_V} onChange={(event) => set_V(event.target.value)}
//          label="Общий объём"
//          helperText="Some important text"
//          type="number"
//          InputProps={{
//            readOnly: true,
//          }}
//          variant="filled"
//        />
//      </div>
//      <div>
//        <TextField
//          value={value_natura} onChange={(event) => set_natura(event.target.value)}
//          label="Натура"
//          helperText="Some important text"
//          type="number"
//        />
//        <TextField
//          value={value_UdPogrV} onChange={(event) => set_UdPogrV(event.target.value)}
//          label="Удельный погрузочный вес"
//          helperText="Some important text"
//          type="number"
//          InputProps={{
//            readOnly: true,
//          }}
//          variant="filled"
//        />
//        <TextField
//          value={value_M} onChange={(event) => set_M(event.target.value)}
//          label="Общая масса"
//          helperText="Some important text"
//          type="number"
//          InputProps={{
//            readOnly: true,
//          }}
//          variant="filled"
//        />
//        </div>
//    </Box>
//  )
//} export {InputDataArea};

//function Warehouses (i) {
//  if ((i < 0) || (i > Warehouse.Piles.length - 1))  return (console.log('Error! Warehouse Index = ' + i));
  //console.log(Mass(i));
//  return (
//    console.log(
//        'Name', Warehouse.Piles[i].Name,
//        'dx1', Warehouse.Piles[i].dx1,
//        'dy1', Warehouse.Piles[i].dy1,
//        'dh1', Warehouse.Piles[i].dh1,
//        'dx2', Warehouse.Piles[i].dx2,
//        'dy2', Warehouse.Piles[i].dy2,
//        'dh2', Warehouse.Piles[i].dh2,
//        'ux', Warehouse.Piles[i].ux,
//        'uy', Warehouse.Piles[i].uy,
//        'V1', Warehouse.Piles[i].V1,
//        'V2', Warehouse.Piles[i].V2,
//        'V', Warehouse.Piles[i].V,
//        'M', Warehouse.Piles[i].M,
//        'Natura', Warehouse.Piles[i].Natura,
//        'UdPogrV', Warehouse.Piles[i].UdPogrV
//    )
//  );
//} export {Warehouses};
