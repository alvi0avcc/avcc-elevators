import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { GridApi, useGridApiContext, useGridApiRef } from '@mui/x-data-grid';
import { Elevators } from './elevators';
import { Button, Stack, TextField } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';


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
  },
  {
    field: 'CargoName',
    headerName: 'Cargo Name',
    width: 130,
    editable: true,
  },
  {
    field: 'CargoTW',
    headerName: 'Cargo Test Weight',
    type: 'number',
    width: 100,
    editable: true,
  },
  {
    field: 'Type',
    headerName: 'Type',
    width: 100,
    height: 50,
    editable: true,
    renderCell: (params) => { return ( <span>{params.value}</span> ); },
    renderEditCell: renderTypeEditInputCell,
  },
  {
    field: 'Height',
    headerName: 'Height',
    type: 'number',
    width: 80,
    editable: true,
  },
  {
    field: 'Length',
    headerName: 'Length',
    type: 'number',
    width: 80,
    editable: true,
  },
  {
    field: 'Width',
    headerName: 'Width',
    type: 'number',
    width: 80,
    editable: true,
  },
  {
    field: 'Diameter',
    headerName: 'Diameter',
    type: 'number',
    width: 80,
    editable: true,
  },
  {
    field: 'Conus_height',
    headerName: 'Conus height',
    type: 'number',
    width: 80,
    editable: true,
  },
  {
    field: 'Area',
    headerName: 'Area',
    type: 'number',
    width: 80,
    editable: true,
  },
  {
    field: 'useArea',
    headerName: 'useArea',
    width: 80,
    editable: true,
  },
  {
    field: 'Sound',
    headerName: 'Sound',
    type: 'number',
    width: 80,
    editable: true,
  },
  {
    field: 'Ullage',
    headerName: 'Ullage',
    type: 'number',
    width: 80,
    editable: true,
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
    editable: true,
  },
  {
    field: 'Comments',
    headerName: 'Comments',
    width: 150,
    editable: true,
  },
];


export default function ComplexDataGrid() {
    const [rows, setRows] = React.useState( SiloToGrid() );
    const apiRef = useGridApiRef();

    const handleApplyButton = () => {
        Elevators.ComplexDataChange( apiRef.current.getRowModels() );
      };
      

  return (
    <Box 
        sx={{
        height: 600,
        width: '100%',
        '& .grey': {
          backgroundColor: '#b9d5ff91',
          color: '#1a3e72',
        },
      }}
      >
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
        disableRowSelectionOnClick
        isCellEditable={(params) => ( 
            ( params.row.Type == 'square' && params.field != 'Diameter' ) ||
            ( params.row.Type == 'circle' &&  params.field != 'Length' && params.field != 'Width'  ) ||
            ( params.row.Type == 'star' &&  params.field != 'Length' && params.field != 'Width'  )
            )}
      />

        <Stack direction= 'row' justifyContent={'space-between'}  >
          <Button variant="outlined"
           onClick={()=>{ setRows( SiloToGrid() ) }} >
            Reject Changes
          </Button>

          <Button variant="outlined" 
            onClick={ handleApplyButton }>
            Apply Changes  
          </Button>
        </Stack>

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