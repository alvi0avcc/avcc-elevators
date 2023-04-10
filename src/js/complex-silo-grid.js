import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { GridApi, useGridApiContext, useGridApiRef } from '@mui/x-data-grid';
import { Elevators } from './elevators';
import { Button, Stack, TextField, Tooltip } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { Square } from '@mui/icons-material';
import clsx from 'clsx';
import * as Calc from './calc';
import Table from './complex_silo_table';


export default function ComplexDataGrid() {
    const [rows, setRows] = React.useState( SiloToGrid() );
    const apiRef = useGridApiRef();
    const [ColumnVisibility, setColumnVisibility] = React.useState({id: false});
  return (
    <>
    </>
  );
}

function SiloToGrid() {
    let result = [];
    let id  = 0;
    if ( Elevators.ComplexFound > 0 ) {
        let complex = Elevators.ComplexAll;
        for ( let row = 0; row < complex.Silo.length; row++ ) {
            for ( let col = 0; col < complex.Silo[row].length; col++ ) {
                let silo = complex.Silo[row][col];
                id++;
                silo.id = id;
                silo['row'] = row + 1;
                result.push( silo );
            }
        }
    }
    return result;
}