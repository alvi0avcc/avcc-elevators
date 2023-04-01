import * as React from 'react';
import { Elevators } from './elevators.js';
import { BorderStyle, ConstructionOutlined } from '@mui/icons-material';
import "./styles.css";
import clsx from "clsx";
import { Box, Button, Stack, TextField, Tooltip } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

export default function Table(props) {

let data_initial = [[]];
data_initial = structuredClone( Elevators.ComplexAll.Silo );
data_initial = [].concat(...data_initial);

const [ data, setData ] =  React.useState(data_initial);
const [ show, setShow ] = React.useState(false);
    const handleChange_Show = (event) => { setShow(event.target.checked); };
    const handleApplyButton = () => { 
        //Elevators.ComplexDataSet( rows );
        //Elevators.ComplexDataSet( apiRef.current.getRowModels() ); 
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
        //let data = structuredClone( rows );
        del.sort( (a, b) => b - a );
        for ( let i=0; i<del.length; i++ ) {
            data.splice( del[i]-1, 1 );
        }
        setSelectionModel([]);
        setSelectState( true );
        //setRows( data );
     };
    const onReset = () => { setSelectionModel([]); setSelectState( true );};
    const handleAddRow = () => {
        let n = selectionModel.length;
        let n_max = 0;
        if ( n > 0 ) {
            for ( let i = 0; i < n; i++ ) {
                if ( n_max <= selectionModel[i] ) { n_max = selectionModel[i]; };
            }
            //let a = structuredClone( rows[n_max-1] );
            //let data = structuredClone( rows );
            //data.splice(n_max, 0, a);
            for ( let i = 0; i < data.length; i++) {
                data[i]['id'] = i+1 ;
            }
            //setRows( data );
        }
        };

    const handleSplitSilo = () => {
            let nn = selectionModel.length;
            let n;
            let x;
            let a;
            if ( nn > 0 ) {
                //let data = structuredClone( rows );
                for ( let i = 0; i < nn; i++ ) {
                    n = selectionModel[i] - 1;
                    //a = structuredClone( rows[n] );
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
                //setRows( data );
            }
    };

let data_table = structuredClone( data );
let result;
return (
    <>
    <Stack direction="row" spacing={1}>
        <FormControlLabel control={
              <Checkbox 
              size="small"
              checked={show}
              onChange={handleChange_Show}
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
            //onClick={()=>{ setRows( SiloToGrid() ) }}
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
    <Box sx={{ height: 500, width: '100%', overflow: 'auto' }} >
    <table className={clsx( 'myTable' )}>
        <tr style={{ height: 90 }}>
            <th className={clsx( show ? 'myTable' : 'myHide' )}>№</th>
            <th className={clsx( 'myTable' )}><div className={clsx( 'myTableSide' )}>Selected</div></th>
            <th className={clsx( show ? 'myTable' : 'myHide' )}><div className={clsx( 'myTableSide' )}>rows</div></th>
            <th className={clsx( show ? 'myTable' : 'myHide' )}><div className={clsx( 'myTableSide' )}>columns</div></th>
            <th className={clsx( 'myTable' )}>№ Name</th>
            <th className={clsx( 'myTable' )}>Cargo Name</th>
            <th className={clsx( 'myTable' )}>Cargo Test Weight (g/l)</th>
            <th className={clsx( 'myTable' )}>Type</th>
            <th className={clsx( show ? 'myTable' : 'myHide' )}>Height (m)</th>
            <th className={clsx( show ? 'myTable' : 'myHide' )}>Length (m)</th>
            <th className={clsx( show ? 'myTable' : 'myHide' )}>Width (m)</th>
            <th className={clsx( show ? 'myTable' : 'myHide' )}>Diameter (m)</th>
            <th className={clsx( show ? 'myTable' : 'myHide' )}>Conus height (m)</th>
            <th className={clsx( show ? 'myTable' : 'myHide' )}><div className={clsx( 'myTableSide' )} >use Area</div></th>
            <th className={clsx( show ? 'myTable' : 'myHide' )}>Area (m²)</th>
            <th className={clsx( 'myTable' )}>Sound (m)</th>
            <th className={clsx( 'myTable' )}>Ullage (m)</th>
            <th className={clsx( 'myTable' )}>split</th>
            <th className={clsx( 'myTable' )}>linked</th>
            <th className={clsx( 'myTable' )}><div className={clsx( 'myTableSide' )}>Using</div></th>
            <th className={clsx( 'myOutput' )}>Cargo volume (m³)</th>
            <th className={clsx( 'myOutput' )}>Cargo weight (MT)</th>
            <th className={clsx( 'myTable' )}>Comments</th>
        </tr>

        {
        data.map((item, row ) => (
            result = Elevators.massaComplexSiloGet( item.row-1, item.col-1 ),
            <tr className={clsx( item.row % 2 === 0 ? '' : 'grey')}>
                <td className={clsx( show ? 'myTable' : 'myHide' )}>{row+1}</td>
                <td className={clsx( 'myTable' )}> <SiloSelected item={item} row={row} /> </td>
                <td className={clsx( show ? 'myTable' : 'myHide' )}>{item.row}</td>
                <td className={clsx( show ? 'myTable' : 'myHide' )}>{item.col}</td>
                <td className={clsx( 'myTable' )}> <SiloName item={item} row={row} /> </td>
                <td className={clsx( 'myTable' )}> <CargoName item={item} row={row} /> </td>
                <td className={clsx( 'myTable' )}> <CargoTW item={item} row={row} /> </td>
                <td className={clsx( 'myTable' )}> <SiloType item={item} row={row} /> </td>
                <td className={clsx( show ? 'myTable' : 'myHide' )}> <SiloHeight item={item} row={row} /> </td>
                <td className={clsx( show ? 'myTable' : 'myHide' )}> <SiloLength item={item} row={row} /> </td>
                <td className={clsx( show ? 'myTable' : 'myHide' )}> <SiloWidth item={item} row={row} /> </td>
                <td className={clsx( show ? 'myTable' : 'myHide' )}> <SiloDiameter item={item} row={row} /> </td>
                <td className={clsx( show ? 'myTable' : 'myHide' )}> <SiloConusHeight item={item} row={row} /> </td>
                <td className={clsx( show ? 'myTable' : 'myHide' )}> <UseArea item={item} row={row} /> </td>
                <td className={clsx( show ? 'myTable' : 'myHide' )}> <SiloArea item={item} row={row} /> </td>
                <td className={clsx( 'myTable' )}> <SiloSound item={item} row={row} /> </td>
                <td className={clsx( 'myTable' )}> <SiloUllage item={item} row={row} /> </td>
                <td className={clsx( 'myTable' )}> <SiloSplit item={item} row={row} /> </td>
                <td className={clsx( 'myTable' )}>{item.linked}</td>
                <td className={clsx( 'myTable' )}> <SiloUsing item={item} row={row} /> </td>
                <td className={clsx( 'myOutput' )}>{result.volume}</td>
                <td className={clsx( 'myOutput' )}>{result.weight}</td>
                <td className={clsx( 'myTable' )}> <SiloComments item={item} row={row} /> </td>
            </tr>
        ))
        }

    </table>
    </Box>
    </>
)
}

function SiloSelected(props){
    let item = props.item;
    let row = props.row;
    const [value, setValue] = React.useState(false);
    const changeSiloSelected = (e) => { 
        setValue(e.target.checked);
    };

    return (
        <>
        <input
        //class = 'myTableSide'
        type="checkbox"
        id = { `row-${item.row-1}`+`/col-${item.col-1}` }
        label={ `SiloSelected-row ${row}`}
        checked={value}
        onChange={changeSiloSelected}
        />
        </>
    )
}

function SiloName(props){
    let item = props.item;
    let row = props.row;
    const [value, setValue] = React.useState(item.Name);
    const changeSiloName = (e) => { 
        setValue(e.target.value);
    };

    return (
        <>
        <input
        className={clsx( 'myInputShort' )}
        type="text"
        id = { `row-${item.row-1}`+`/col-${item.col-1}` }
        label={ `SiloName-row ${row}`}
        value={value}
        onChange={changeSiloName}
        />
        </>
    )
}

function CargoName(props){
    let item = props.item;
    let row = props.row;
    const [value, setValue] = React.useState(item.CargoName);
    const changeCargoName = (e) => { 
        setValue(e.target.value);
    };

    return (
        <>
        <input
        class = 'myInput'
        type="text"
        id = { `row-${item.row-1}`+`/col-${item.col-1}` }
        label={ `CargoName-row ${row}`}
        value={value}
        onChange={changeCargoName}
        />
        </>
    )
}

function CargoTW(props){
    let item = props.item;
    let row = props.row;
    const [value, setValue] = React.useState(item.CargoTW);
    const changeCargoTW = (e) => { 
        setValue(e.target.value);
    };

    return (
        <>
        <input
        class = 'myInputShort'
        type="text"
        id = { `row-${item.row-1}`+`/col-${item.col-1}` }
        label={ `CargoTW-row ${row}`}
        value={value}
        onChange={changeCargoTW}
        />
        </>
    )
}

function SiloType(props){
    let item = props.item;
    let row = props.row;
    const [value, setValue] = React.useState(item.Type);
    const changeType = (e) => { 
        setValue(e.target.value);
    };

    return (
        <>
        <select 
        class = 'mySelect'
        id = { `row-${item.row-1}`+`/col-${item.col-1}` }
        label={ `SiloType-row ${row}`}
        value={value}
        onChange={changeType}
        >
            <option value="square">square</option>
            <option value="circle" selected>circle</option>
            <option value="star">star</option>
        </select>
        </>
    )
}

function SiloHeight(props){
    let item = props.item;
    let row = props.row;
    const [value, setValue] = React.useState(item.Height);
    const changeHeight = (e) => { 
        setValue(e.target.value);
    };

    return (
        <>
        <input
        className={clsx( 'myInputShort' )}
        type="text"
        id = { `row-${item.row-1}`+`/col-${item.col-1}` }
        label={ `SiloHeight-row ${row}`}
        value={value}
        onChange={changeHeight}
        />
        </>
    )
}

function SiloLength(props){
    let item = props.item;
    let row = props.row;
    const [value, setValue] = React.useState(item.Length);
    const changeLength = (e) => { 
        setValue(e.target.value);
    };

    return (
        <>
        <input
        class = 'myInputShort'
        type="text"
        id = { `row-${item.row-1}`+`/col-${item.col-1}` }
        label={ `SiloLength-row ${row}`}
        value={value}
        onChange={changeLength}
        />
        </>
    )
}

function SiloWidth(props){
    let item = props.item;
    let row = props.row;
    const [value, setValue] = React.useState(item.Width);
    const changeWidth= (e) => { 
        setValue(e.target.value);
    };

    return (
        <>
        <input
        class = 'myInputShort'
        type="text"
        id = { `row-${item.row-1}`+`/col-${item.col-1}` }
        label={ `SiloWidth-row ${row}`}
        value={value}
        onChange={changeWidth}
        />
        </>
    )
}

function SiloDiameter(props){
    let item = props.item;
    let row = props.row;
    const [value, setValue] = React.useState(item.Diameter);
    const changeDiameter= (e) => { 
        setValue(e.target.value);
    };

    return (
        <>
        <input
        class = 'myInputShort'
        type="text"
        id = { `row-${item.row-1}`+`/col-${item.col-1}` }
        label={ `SiloDiameter-row ${row}`}
        value={value}
        onChange={changeDiameter}
        />
        </>
    )
}

function SiloConusHeight(props){
    let item = props.item;
    let row = props.row;
    const [value, setValue] = React.useState(item.Conus_height);
    const changeConusHeight= (e) => { 
        setValue(e.target.value);
    };

    return (
        <>
        <input
        class = 'myInputShort'
        type="text"
        id = { `row-${item.row-1}`+`/col-${item.col-1}` }
        label={ `SiloConusHeight-row ${row}`}
        value={value}
        onChange={changeConusHeight}
        />
        </>
    )
}

function UseArea(props){
    let item = props.item;
    let row = props.row;
    const [value, setValue] = React.useState(false);
    const changeUseArea = (e) => { 
        setValue(e.target.checked);
    };

    return (
        <>
        <input
        //class = 'myTableSide'
        type="checkbox"
        id = { `row-${item.row-1}`+`/col-${item.col-1}` }
        label={ `UseArea-row ${row}`}
        checked={value}
        onChange={changeUseArea}
        />
        </>
    )
}

function SiloArea(props){
    let item = props.item;
    let row = props.row;
    const [value, setValue] = React.useState(item.Area);
    const changeArea= (e) => { 
        setValue(e.target.value);
    };

    return (
        <>
        <input
        class = 'myInputShort'
        type="text"
        id = { `row-${item.row-1}`+`/col-${item.col-1}` }
        label={ `SiloArea-row ${row}`}
        value={value}
        onChange={changeArea}
        />
        </>
    )
}

function SiloSound(props){
    let item = props.item;
    let row = props.row;
    const [value, setValue] = React.useState(item.Sound);
    const changeSound= (e) => { 
        setValue(e.target.value);
    };

    return (
        <>
        <input
        class = 'myInputShort'
        type="text"
        id = { `row-${item.row-1}`+`/col-${item.col-1}` }
        label={ `SiloSound-row ${row}`}
        value={value}
        onChange={changeSound}
        />
        </>
    )
}

function SiloUllage(props){
    let item = props.item;
    let row = props.row;
    const [value, setValue] = React.useState(item.Ullage);
    const changeUllage= (e) => { 
        setValue(e.target.value);
    };

    return (
        <>
        <input
        class = 'myInputShort'
        type="text"
        id = { `row-${item.row-1}`+`/col-${item.col-1}` }
        label={ `SiloUllage-row ${row}`}
        value={value}
        onChange={changeUllage}
        />
        </>
    )
}

function SiloSplit(props){
    let item = props.item;
    let row = props.row;
    const [value, setValue] = React.useState(item.split);
    const changeSplit= (e) => { 
        setValue(e.target.value);
    };

    return (
        <>
        <input
        class = 'myInputShort'
        type="text"
        id = { `row-${item.row-1}`+`/col-${item.col-1}` }
        label={ `SiloSplit-row ${row}`}
        value={value}
        onChange={changeSplit}
        />
        </>
    )
}

function SiloUsing(props){
    let item = props.item;
    let row = props.row;
    const [value, setValue] = React.useState(item.Using);
    const changeUsing = (e) => { 
        setValue(e.target.checked);
    };

    return (
        <>
        <input
        //class = 'myTableSide'
        type="checkbox"
        id = { `row-${item.row-1}`+`/col-${item.col-1}` }
        label={ `SiloUsing-row ${row}`}
        checked={value} 
        onChange={changeUsing}
        />
        </>
    )
}

function SiloComments(props){
    let item = props.item;
    let row = props.row;
    const [value, setValue] = React.useState(item.Comments);
    const changeComments= (e) => { 
        setValue(e.target.value);
    };

    return (
        <>
        <input
        class = 'myInputLong'
        type="text"
        id = { `row-${item.row-1}`+`/col-${item.col-1}` }
        label={ `SiloComments-row ${row}`}
        value={value}
        onChange={changeComments}
        />
        </>
    )
}