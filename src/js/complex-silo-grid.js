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


function TypeEditInputCell(props) {
    const { id, value, field } = props;
    const apiRef = useGridApiContext();
    const handleChange = (event, newValue) => {
        apiRef.current.setEditCellValue({ id, field, value: newValue.props.value });
        //apiRef.current.setCe({ id, field });
    };
    return (
      <FormControl fullWidth size='small'>
              <Select 
                labelId="grid_type_of_silo "
                value={value}
                onChange={handleChange}
                >
                <MenuItem value={'square'}>square</MenuItem>
                <MenuItem value={'circle'}>circle</MenuItem>
                <MenuItem value={'star'}>star</MenuItem>
              </Select>
          </FormControl>
    );
  }

  const renderTypeEditInputCell = (params) => {
    return <TypeEditInputCell {...params} />;
  };


  function getVolume(params) {
    let type  = params.row.Type;
    let sound  = params.row.Sound || 0;
    let ullage  = params.row.Ullage || 0;
    let height  = params.row.Height || 0;
    let length  = params.row.Length || 0;
    let width  = params.row.Width || 0;
    let diameter  = params.row.Diameter || 0;
    let conus_height  = params.row.Conus_height || 0;
    let area  = params.row.Area || 0;
    let volume;
    let result = Elevators.volume_mineSilo( type, sound, ullage, height, length, width, diameter, conus_height, area );
    let err_mes = result.err_mes;
    if ( err_mes == '' ) { volume = result.volume }
    else volume = err_mes;
    return volume;
  }

  function getMassa(params) {
    let type  = params.row.Type;
    let Sound  = params.row.Sound || 0;
    let Ullage  = params.row.Ullage || 0;
    let height  = params.row.Height || 0;
    let length  = params.row.Length || 0;
    let width  = params.row.Width || 0;
    let diameter  = params.row.Diameter || 0;
    let conus_height  = params.row.Conus_height || 0;
    let area  = params.row.Area || 0;
    let err_mes;
    let massa;
    let tw = params.row.CargoTW || 0;
    let data = Elevators.volume_mineSilo( type, Sound, Ullage, height, length, width, diameter, conus_height, area );
    err_mes = data.err_mes;
    if ( tw <= 0 ) err_mes = err_mes + 'incorrect Test Weight';
    if ( err_mes == '' ) {
        massa = ( data.volume * tw / 1000 );
    } else massa = err_mes;
    massa = Calc.MyRound( massa, 3 );
    return massa;
  }

const columns = [
  { field: 'id', headerName: 'ID', width: 50 },
  {
    field: 'row',
    headerName: 'row',
    width: 50,
    editable: false,
  },
  {
    field: 'Name',
    headerName: '№ Name',
    width: 100,
    editable: true,
    cellClassName: (params) => {
        if ( params.value == 'NewSilo' || params.value == null ) { return clsx('red'); }
        return '';
      },
  },
  {
    field: 'CargoName',
    headerName: 'Cargo Name',
    width: 150,
    editable: true,
    cellClassName: (params) => {
        if (  params.value == '' || params.value == null ) { return clsx('red'); };
        return '';
      },
  },
  {
    field: 'CargoTW',
    headerName: 'Cargo Test Weight (g/l)',
    type: 'number',
    width: 150,
    editable: true,
    cellClassName: (params) => {
        if (  params.value <= 1 || params.value == null ) { return clsx('red'); };
        return '';
      },
  },
  {
    field: 'Type',
    headerName: 'Type',
    width: 100,
    height: 50,
    editable: true,
    renderCell: (params) => { return ( <span>{params.value}</span> ); },
    renderEditCell: renderTypeEditInputCell,
    cellClassName: (params) => {
        if (  params.value == '' || params.value == null ) { return clsx('red'); };
        return '';
      },
  },
  {
    field: 'Height',
    headerName: 'Height (m)',
    type: 'number',
    width: 80,
    editable: true,
    cellClassName: (params) => {
        if (  params.value <= 0 || params.value == null ) { return clsx('red'); };
        return '';
      },
  },
  {
    field: 'Length',
    headerName: 'Length (m)',
    type: 'number',
    width: 80,
    editable: true,
    cellClassName: (params) => {
        if (  params.value <= 0 || params.value == null ) { return clsx('red'); };
        return '';
      },
  },
  {
    field: 'Width',
    headerName: 'Width (m)',
    type: 'number',
    width: 80,
    editable: true,
    cellClassName: (params) => {
        if (  params.value <= 0 || params.value == null ) { return clsx('red'); };
        return '';
      },
  },
  {
    field: 'Diameter',
    headerName: 'Diameter (m)',
    type: 'number',
    width: 80,
    editable: true,
    cellClassName: (params) => {
        if (  params.value <= 0 || params.value == null ) { return clsx('red'); };
        return '';
      },
  },
  {
    field: 'Conus_height',
    headerName: 'Conus height (m)',
    type: 'number',
    width: 80,
    editable: true,
    cellClassName: (params) => {
        if (  params.value < 0 || params.value == null ) { return clsx('red'); };
        if (  params.value == 0  ) { return clsx('yellow'); };
        return '';
      },
  },
  {
    field: 'Area',
    headerName: 'Area (m²)',
    type: 'number',
    width: 80,
    editable: true,
    cellClassName: (params) => {
        if (  params.value < 0 || params.value == null ) { return clsx('red'); };
        if (  params.value == 0  ) { return clsx('yellow'); };
        return '';
      },
  },
  {
    field: 'useArea',
    headerName: 'use Area',
    width: 80,
    type: 'boolean',
    editable: true,
  },
  {
    field: 'Sound',
    headerName: 'Sound (m)',
    type: 'number',
    width: 80,
    editable: true,
    cellClassName: (params) => {
        if (  params.value <= 0 || params.value == null ) { return clsx('red'); };
        return '';
      },
  },
  {
    field: 'Ullage',
    headerName: 'Ullage (m)',
    type: 'number',
    width: 80,
    editable: true,
    cellClassName: (params) => {
        if (  params.value < 0 || params.value == null ) { return clsx('red'); };
        if (  params.value == 0  ) { return clsx('yellow'); };
        if (  params.value > 0  ) { return clsx('lime'); };
        return '';
      },
  },
  {
    field: 'split',
    headerName: 'split',
    width: 80,
    editable: true,
  },
  {
    field: 'linked',
    headerName: 'linked',
    width: 80,
    editable: true,
  },
  
  {
    field: 'Using',
    headerName: 'Using',
    width: 80,
    type: 'boolean',
    editable: true,
  },
  {
    field: 'Volume',
    headerName: 'Cargo volume (m³)',
    width: 150,
    //type: 'number',
    editable: false,
    valueGetter: getVolume,
    cellClassName: (params) => {
        if (  params.value < 0 || params.value == null ) { return clsx('red'); };
        if ( typeof(params.value) != 'number' )  { return clsx('red'); };
        if (  params.value == 0  ) { return clsx('yellow'); };
        return '';
      },
  },
  {
    field: 'Weight',
    headerName: 'Cargo weight (MT)',
    width: 150,
    //type: 'number',
    editable: false,
    valueGetter: getMassa,
    cellClassName: (params) => {
        if (  params.value < 0 || params.value == null ) { return clsx('red'); };
        if ( typeof(params.value) != 'number' )  { return clsx('red'); };
        if (  params.value == 0  ) { return clsx('yellow'); };
        if (  params.value > 0  ) { return clsx('lime'); };
        return '';
      },
  },
  {
    field: 'Comments',
    headerName: 'Comments',
    width: 200,
    editable: true,
  },
];


export default function ComplexDataGrid() {
    const [rows, setRows] = React.useState( SiloToGrid() );
    const apiRef = useGridApiRef();

    const handleApplyButton = () => { 
        Elevators.ComplexDataChange( apiRef.current.getRowModels() ); 
        setRows( SiloToGrid() );
    };

    const [selectState, setSelectState] = React.useState(true);

    const [selectionModel, setSelectionModel] = React.useState([]);
    const handleSelectionModel = (selectedRows) => {
        setSelectionModel(selectedRows);
        if ( selectedRows.length > 0 ) { 
            setSelectState( false );
        } else { setSelectState( true ); };
        
    }
    const handleDeleteRow = () => { setRows((rows) => rows.filter((r) => !selectionModel.includes(r.id))); };
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

    const [view, setView] = React.useState(false);
    const handleChange_View = (event) => { 
        setView(event.target.checked);
        if ( view == false ) {
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
    <Box 
        sx={{
        height: 500,
        width: '100%',
        '& .grey': { backgroundColor: '#b9d5ff91', color: '#1a3e72', },
        '& .red': { backgroundColor: 'red', color: '#1a3e72', fontWeight: '600', },
        '& .yellow': { backgroundColor: 'yellow', color: '#1a3e72', fontWeight: '600', },
        '& .lime': { backgroundColor: 'lime', color: '#1a3e72', fontWeight: '600', },
      }}
      >

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

      <DataGrid
        apiRef={apiRef}
        slots={{ toolbar: GridToolbar }}
        density="compact"
        getRowClassName={(params) => 
            params.row.row % 2 === 0 ? '' : 'grey' 
        }
        rows={rows}
        columns={columns}
        initialState={{
            columns: {
                columnVisibilityModel: {
                    id: false,
                },
            },
            pagination: {
                paginationModel: {
                    pageSize: 25,
                },
            },
        }}
        pageSizeOptions={[25, 50, 100]}
        checkboxSelection
        onRowSelectionModelChange={ handleSelectionModel }
        rowSelectionModel={selectionModel}
        columnVisibilityModel={ColumnVisibility}
        disableRowSelectionOnClick
        isCellEditable={(params) => ( 
            ( params.row.Type == 'square' && params.field != 'Diameter' ) ||
            ( params.row.Type == 'circle' &&  params.field != 'Length' && params.field != 'Width'  ) ||
            ( params.row.Type == 'star' &&  params.field != 'Length' && params.field != 'Width'  )
            )}
        showCellVerticalBorder
        showColumnVerticalBorder
      />

    </Box>
    
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