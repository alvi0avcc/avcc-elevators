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

    const handleApplyButton = () => { 
        //Elevators.ComplexDataSet( rows );
        Elevators.ComplexDataSet( apiRef.current.getRowModels() ); 
        //setRows( SiloToGrid() );
    };

    const [selectState, setSelectState] = React.useState(true);

    const [selectionModel, setSelectionModel] = React.useState([]);
    const handleSelectionModel = (selectedRows) => {
        setSelectionModel(selectedRows);
        if ( selectedRows.length > 0 ) { 
            setSelectState( false );
        } else { setSelectState( true ); };
        
    }
    const handleDeleteRow = () => { 
        let del = structuredClone( selectionModel );
        let data = structuredClone( rows );
        del.sort( (a, b) => b - a );
        for ( let i=0; i<del.length; i++ ) {
            data.splice( del[i]-1, 1 );
        }
        setSelectionModel([]);
        setSelectState( true );
        setRows( data );
     };
    const onReset = () => { setSelectionModel([]); setSelectState( true );};
    const handleAddRow = () => {
        let n = selectionModel.length;
        let n_max = 0;
        if ( n > 0 ) {
            for ( let i = 0; i < n; i++ ) {
                if ( n_max <= selectionModel[i] ) { n_max = selectionModel[i]; };
            }
            let a = structuredClone( rows[n_max-1] );
            let data = structuredClone( rows );
            data.splice(n_max, 0, a);
            for ( let i = 0; i < data.length; i++) {
                data[i]['id'] = i+1 ;
            }
            setRows( data );
        }
        };

    const handleSplitSilo = () => {
            let nn = selectionModel.length;
            let n;
            let x;
            let a;
            if ( nn > 0 ) {
                let data = structuredClone( rows );
                for ( let i = 0; i < nn; i++ ) {
                    n = selectionModel[i] - 1;
                    a = structuredClone( rows[n] );
                    x = data.findIndex( item => item.Name == a.Name );
                    a.split = a.Name;
                    a.Name = a.Name + '/2';
                    data.splice(x+1, 0, a);
                    data[x].split = data[x].Name;
                }
                for ( let i = 0; i < data.length; i++) {
                    data[i]['id'] = i+1 ;
                }
                setSelectionModel([]);
                setSelectState( true );
                setRows( data );
            }
    };    

    const [view, setView] = React.useState(false);
    const handleChange_View = (event) => { 
        setView(event.target.checked);
        if ( view == true ) {
            setColumnVisibility({
                id: false,
                Type: false,
                Height: false,
                Length: false,
                Width: false,
                Diameter: false,
                Conus_height: false,
                Area: false,
                useArea: false,
                Sound: true,
                Ullage: true,
                split: false,
                linked: false,
                Using: false,
                Volume: true,
                Weight: true,
                Comments: true,
            });
        } else {
            setColumnVisibility({
                id: false,
                Type: true,
                Height: true,
                Length: true,
                Width: true,
                Diameter: true,
                Conus_height: true,
                Area: true,
                useArea: true,
                Sound: true,
                Ullage: true,
                split: true,
                linked: true,
                Using: true,
                Volume: true,
                Weight: true,
                Comments: true,
            });
        }
    };

    const [ColumnVisibility, setColumnVisibility] = React.useState({id: false});

    
  return (
    <>
    <Box fullWidth >
      <Stack direction="row" spacing={1}>
        <FormControlLabel control={
              <Checkbox 
              size="small"
              checked={view}
              onChange={handleChange_View}
              />
            } label="Simple view" />
        <Button 
            size="small" 
            variant='outlined' 
            onClick={handleDeleteRow}
            disabled={selectState}
        >
          Delete selected row
        </Button>
        <Button 
            size="small" 
            variant='outlined' 
            onClick={onReset}
            disabled={selectState}
        >
          Reset selected row
        </Button>
        <Tooltip title = 'Add 1 silo after selected' >
        <Button 
            size="small"
            variant="outlined"
            onClick={handleAddRow}
            disabled={selectState}
            >
          Add silo
        </Button>
        </Tooltip>
        <Button 
            size="small"
            variant="outlined"
            onClick={handleSplitSilo}
            disabled={selectState}
            >
          Split Silo
        </Button>
        <Button 
            size="small"
            variant="outlined"
            onClick={()=>{ setRows( SiloToGrid() ) }}
            >
            Reject Changes
          </Button>

          <Button
            size="small"
            variant="outlined" 
            onClick={ handleApplyButton }
            >
            Apply Changes  
          </Button>
      </Stack>
      </Box>

    <Box fullWidth sx={{ height: 500, overflow: 'auto' }}>
        <Table show={view}/>
    </Box>

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