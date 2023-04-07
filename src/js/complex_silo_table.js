import * as React from 'react';
import { Elevators } from './elevators.js';
import { BorderStyle, ConstructionOutlined, People } from '@mui/icons-material';
import "./styles.css";
import clsx from "clsx";
import { Box, Button, Stack, TextField, Tooltip, colors } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import ComplexSiloTotal from './complex-silo-total';

export default function Table( propsTable ) {

let data_initial = [[]];
data_initial = structuredClone( Elevators.ComplexAll.Silo );
data_initial = [].concat(...data_initial);
const [ data_table, setData_table ] = React.useState(structuredClone( data_initial ));
let data_table_new = structuredClone( data_table );

function TableStructure(props){

//const [ data, setData ] = React.useState(data_initial);
//const [ data_table_change, setData_table_change ] = React.useState(true);
const [ show, setShow ] = React.useState(true);
    const handleChange_Show = (event) => { setShow(event.target.checked); };
    const handleApplyButton = () => { 
        Elevators.ComplexDataSet( data_table_new );
        propsTable.callback(true);
        //setData_table( data_table_new );
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
            //data.splice( del[i]-1, 1 );
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
            //for ( let i = 0; i < data.length; i++) {
            //    data[i]['id'] = i+1 ;
           // }
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
                    //x = data.findIndex( item => item.Name == a.Name );
                    a.split = a.Name;
                    a.Name = a.Name + '/2';
                    //data.splice(x+1, 0, a);
                    //data[x].split = data[x].Name;
                }
                //for ( let i = 0; i < data.length; i++) {
                //    data[i]['id'] = i+1 ;
               // }
                setSelectionModel([]);
                setSelectState( true );
                //setRows( data );
            }
    };

return (
    <>
    <Stack direction="row" spacing={1}>
        <FormControlLabel control={
              <Checkbox 
              size="small"
              checked={show}
              onChange={handleChange_Show}
              />
            } label="Full view" />
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
            onClick={()=>{ 
                data_initial = structuredClone( Elevators.ComplexAll.Silo );
                data_initial = [].concat(...data_initial);
                setData_table( data_initial );
                console.log('data_initial = ',data_initial); 
                propsTable.callback(true);   
            }}
            >
            Update Table
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
            <th className={clsx( 'myTable' )}>
                Cargo Test Weight <br/>
                <span className='TableTW_dstu'>(g/l)</span><br/>
                <span className='TableTW_iso'>(Kg/hL)</span> </th>
            <th className={clsx( 'myTable' )}>Type</th>
            <th className={clsx( 'myTable' )}>split</th>
            <th className={clsx( 'myTable' )}>linked</th>
            <th className={clsx( 'myTable' )}><div className={clsx( 'myTableSide' )}>Using</div></th>
            <th className={clsx( show ? 'myTable' : 'myHide' )}>Height (m)</th>
            <th className={clsx( show ? 'myTable' : 'myHide' )}>Length (m)</th>
            <th className={clsx( show ? 'myTable' : 'myHide' )}>Width (m)</th>
            <th className={clsx( show ? 'myTable' : 'myHide' )}>Diameter (m)</th>
            <th className={clsx( show ? 'myTable' : 'myHide' )}>Conus height (m)</th>
            <th className={clsx( show ? 'myTable' : 'myHide' )}>Calculated Area (m²)</th>
            <th className={clsx( show ? 'myTable' : 'myHide' )}>Official Area (m²)</th>
            <th className={clsx( 'myTable' )}>Reference Point (m)</th>
            <th className={clsx( 'myTable' )}>Ullage (m)</th>
            <th className={clsx( 'myOutput' )}>Cargo volume (m³)</th>
            <th className={clsx( 'myOutput' )}>Cargo weight (MT)</th>
            <th className={clsx( 'myTable' )}>Comments</th>
        </tr>

        {
        data_table.map((item, row ) => (
            <TableRow data={data_table }item={item} row={row} show={show}/>
        ))
        }

    </table>
    </Box>
    </>
)
}

function TableRow(props){
    let show = props.show;
    let item = props.item;
    let row = props.row;
    let data_table = structuredClone(props.data);

    function SiloSelected(props){
        let item = props.item;
        let row = props.row;
        const [value, setValue] = React.useState(false);
        const changeSiloSelected = (e) => { 
            setValue(e.target.checked);
        };
    
        return (
            <>
            <td className={clsx( 'myTable' )}> 
            <input
            //class = 'myTableSide'
            type="checkbox"
            id = { `row-${item.row-1}`+`/col-${item.col-1}` }
            label={ `SiloSelected-row ${row}`}
            checked={value}
            onChange={changeSiloSelected}
            />
            </td>
            </>
        )
    }
    
    function SiloComments(props){
        let item = props.item;
        let row = props.row;
        const [value, setValue] = React.useState(item.Comments);
        const changeComments= (e) => { 
            setValue(e.target.value);
            data_table_new[row].Comments=e.target.value;
            //changeValue(e.target.value);
            //changeValue={() => handleClick(0)};
        };
    
        return (
            <>
            <td className={clsx( 'myTable' )}>
            <input
            class = 'myInputLong'
            type="text"
            id = { `row-${item.row-1}`+`/col-${item.col-1}` }
            label={ `SiloComments-row ${row}`}
            value={value}
            onChange={changeComments}
            />
            </td>
            </>
        )
    }


    function SiloDimension(props){
        let item = props.item;
        let row = props.row;
        const [value, setValue] = React.useState(item.Height);
        const [value_SN, setValue_SN] = React.useState(item.Name);
        const [value_CN, setValue_CN] = React.useState(item.CargoName);
        const [value_TW, setValue_TW] = React.useState(item.CargoTW);
        const [value_T, setValue_T] = React.useState(item.Type);
        const [value_SP, setValue_SP] = React.useState(item.split);
        const [value_LK, setValue_LK] = React.useState(item.linked);
        const [value_US, setValue_US] = React.useState(item.Using);
        const [value_H, setValue_H] = React.useState(item.Height);
        const [value_L, setValue_L] = React.useState(item.Length);
        const [value_W, setValue_W] = React.useState(item.Width);
        const [value_D, setValue_D] = React.useState(item.Diameter);
        const [value_C, setValue_C] = React.useState(item.Conus_height);
        //const [value_uA, setValue_uA] = React.useState(item.useArea);
        const [value_A, setValue_A] = React.useState(item.Area);
        const [value_S, setValue_S] = React.useState(item.Sound);
        const [value_U, setValue_U] = React.useState(item.Ullage);
        const [value_VM, setValue_VM] = React.useState(Elevators.massaComplexSilo( data_table_new, row));
        const changeSiloName = (e) => { 
            setValue_SN(e.target.value);
            data_table_new[row].Name=e.target.value;
            setValue_VM( Elevators.massaComplexSilo( data_table_new, row ) );
        };
        const changeCargoName = (e) => { 
            setValue_CN(e.target.value);
            data_table_new[row].CargoName=e.target.value;
            setValue_VM( Elevators.massaComplexSilo( data_table_new, row ) );
        };
        const changeCargoTW = (e) => { 
            setValue_TW(e.target.value);
            data_table_new[row].CargoTW=e.target.value;
            setValue_VM( Elevators.massaComplexSilo( data_table_new, row ) );
        };
        const changeSiloType = (e) => { 
            setValue_T(e.target.value);
            data_table_new[row].Type=e.target.value;
            setValue_VM( Elevators.massaComplexSilo( data_table_new, row ) );
        };
        const changeSiloSplit = (e) => { 
            setValue_SP(e.target.value);
            data_table_new[row].split=e.target.value;
            setValue_VM( Elevators.massaComplexSilo( data_table_new, row ) );
        };
        const changeSiloLink = (e) => { 
            setValue_LK(e.target.value);
            data_table_new[row].linked=e.target.value;
            setValue_VM( Elevators.massaComplexSilo( data_table_new, row ) );
        };
        const changeSiloUsing = (e) => { 
            setValue_US(e.target.checked);
            data_table_new[row].Using=e.target.checked;
            setValue_VM( Elevators.massaComplexSilo( data_table_new, row ) );
        };
        const changeHeight = (e) => { 
            setValue_H(e.target.value);
            data_table_new[row].Height=e.target.value;
            setValue_VM( Elevators.massaComplexSilo( data_table_new, row ) );
        };
        const changeLength = (e) => { 
            setValue_L(e.target.value);
            data_table_new[row].Length=e.target.value;
            setValue_VM( Elevators.massaComplexSilo( data_table_new, row ) );
        };
        const changeWidth= (e) => { 
            setValue_W(e.target.value);
            data_table_new[row].Width=e.target.value;
            setValue_VM( Elevators.massaComplexSilo( data_table_new, row ) );
        };
        const changeDiameter = (e) => { 
            setValue_D(e.target.value);
            data_table_new[row].Diameter=e.target.value;
            setValue_VM( Elevators.massaComplexSilo( data_table_new, row ) );
        };
        const changeConus = (e) => { 
            setValue_C(e.target.value);
            data_table_new[row].Conus_height=e.target.value;
            setValue_VM( Elevators.massaComplexSilo( data_table_new, row ) );
        };
        /*const changeUArea = (e) => { 
            setValue_uA(e.target.value);
            data_table_new[row].useArea=e.target.value;
            setValue_VM( Elevators.massaComplexSilo( data_table_new, row ) );
        };*/
        const changeArea = (e) => { 
            setValue_A(e.target.value);
            data_table_new[row].Area=e.target.value;
            setValue_VM( Elevators.massaComplexSilo( data_table_new, row ) );
        };
        const changeSound = (e) => { 
            setValue_S(e.target.value);
            data_table_new[row].Sound=e.target.value;
            setValue_VM( Elevators.massaComplexSilo( data_table_new, row ) );
        };
        const changeUllage = (e) => { 
            setValue_U(e.target.value);
            data_table_new[row].Ullage=e.target.value;
            setValue_VM( Elevators.massaComplexSilo( data_table_new, row ) );
        };
    
        return (
            <>
            <td className={value_SN.length > 0 ? 'myTable' : 'myTableEmptyError' } >
            <input
            className={clsx( 'myInputShort' )}
            type="text"
            id = { `row-${item.row-1}`+`/col-${item.col-1}` }
            label={ `SiloName-row ${row}`}
            value={value_SN}
            onChange={changeSiloName}
            />
            </td>

            <td className={value_CN.length > 0 ? 'myTable' : 'myTableEmptyWarning' } >
            <input
            className = 'myInput'
            type="text"
            id = { `row-${item.row-1}`+`/col-${item.col-1}` }
            label={ `CargoName-row ${row}`}
            value={value_CN}
            onChange={changeCargoName}
            />
            </td>

            <td className={clsx( value_TW >  10 ? 'myTable' : 'TableTW_error')}>
            <input
            className={ clsx( value_TW > 100 ? 'TableTW_dstu' : 'TableTW_iso' )}
            type="number"
            id = { `row-${item.row-1}`+`/col-${item.col-1}` }
            label={ `CargoTW-row ${row}`}
            value={value_TW}
            onChange={changeCargoTW}
            />
            </td>

            <td className={clsx( 'myTable' )}> 
            <select 
            class = 'mySelect'
            id = { `row-${item.row-1}`+`/col-${item.col-1}` }
            label={ `SiloType-row ${row}`}
            value={value_T}
            onChange={changeSiloType}
            >
                <option value="square">square</option>
                <option value="circle" selected>circle</option>
                <option value="star">star</option>
            </select>
            </td>

            <td className={clsx( 'myTable' )}>
            <input
            class = 'myInputShort'
            type="text"
            id = { `row-${item.row-1}`+`/col-${item.col-1}` }
            label={ `SiloSplit-row ${row}`}
            value={value_SP}
            onChange={changeSiloSplit}
            />
            </td>

            <td className={clsx( 'myTable' )}>
            <input
            class = 'myInputShort'
            type="text"
            id = { `row-${item.row-1}`+`/col-${item.col-1}` }
            label={ `SiloLinked-row ${row}`}
            value={value_LK}
            onChange={changeSiloLink}
            />
            </td>

            <td className={clsx( 'myTable' )}> 
            <input
            //class = 'myTableSide'
            type="checkbox"
            id = { `row-${item.row-1}`+`/col-${item.col-1}` }
            label={ `SiloUsing-row ${row}`}
            checked={value_US} 
            onChange={changeSiloUsing}
            />
            </td>            

            <td className={clsx( show ? 'myTable' : 'myHide' )}>
            <input
            className={clsx( 'myInputShort' )}
            type="number"
            id = { `row-${item.row-1}`+`/col-${item.col-1}` }
            label={ `SiloHeight-row ${row}`}
            value={value_H}
            onChange={changeHeight}
            />
            </td>

            <td className={clsx( show ? 'myTable' : 'myHide' )}>
            <input
            className={clsx( 'myInputShort' )}
            type="number"
            id = { `row-${item.row-1}`+`/col-${item.col-1}` }
            label={ `SiloLength-row ${row}`}
            value={value_L}
            onChange={changeLength}
            />
            </td>

            <td className={clsx( show ? 'myTable' : 'myHide' )}>
            <input
            className={clsx( 'myInputShort' )}
            type="number"
            id = { `row-${item.row-1}`+`/col-${item.col-1}` }
            label={ `SiloWidth-row ${row}`}
            value={value_W}
            onChange={changeWidth}
            />
            </td>

            <td className={clsx( show ? 'myTable' : 'myHide' )}>
            <input
            className={clsx( 'myInputShort' )}
            type="number"
            id = { `row-${item.row-1}`+`/col-${item.col-1}` }
            label={ `SiloDiameter-row ${row}`}
            value={value_D}
            onChange={changeDiameter}
            />
            </td>

            <td className={clsx( show ? 'myTable' : 'myHide' )}>
            <input
            className={clsx( 'myInputShort' )}
            type="number"
            id = { `row-${item.row-1}`+`/col-${item.col-1}` }
            label={ `SiloConus-row ${row}`}
            value={value_C}
            onChange={changeConus}
            />
            </td>

            <td className={clsx( show ? 'myTable' : 'myHide' )}>
            <span
            id = { `row-${item.row-1}`+`/col-${item.col-1}` }
            label={ `SiloCalcArea-row ${row}`}>
            {Elevators.ComplexSiloArea( value_T, value_L, value_W, value_D )}
            </span>
            </td>

            <td className={clsx( show ? 'myTable' : 'myHide' )}>
            <input
            className={clsx( 'myInputShort' )}
            type="number"
            id = { `row-${item.row-1}`+`/col-${item.col-1}` }
            label={ `SiloArea-row ${row}`}
            value={value_A}
            onChange={changeArea}
            />
            </td>

            <td className={clsx( 'myTable' )}>
            <input
            className={clsx( 'myInputShort' )}
            type="number"
            id = { `row-${item.row-1}`+`/col-${item.col-1}` }
            label={ `SiloSound-row ${row}`}
            value={value_S}
            onChange={changeSound}
            />
            </td>

            <td className={clsx( 'myTable' )}>
            <input
            className={clsx( 'myInputShort' )}
            type="number"
            id = { `row-${item.row-1}`+`/col-${item.col-1}` }
            label={ `SiloUllage-row ${row}`}
            value={value_U}
            onChange={changeUllage}
            />
            </td>

            <td className={clsx( 'myTable' )}>
            <span
            id = { `Volume-row-${row}` }
            label={ `SiloVolume-row ${item.row}`}
            >{value_VM.err_mes == '' ? value_VM.volume : value_VM.err_mes}</span>
            </td>

            <td className={clsx( 'myTable' )}>
            <span
            id = { `Weight-row-${row}` }
            label={ `SiloWeight-row ${item.row}`}
            >{value_VM.err_mes == '' ? value_VM.weight : value_VM.err_mes}</span>
            </td>
            </>
        )
    }
    
    return(
        <>
        <tr className={clsx( item.row % 2 === 0 ? '' : 'grey')}>
            <td className={clsx( show ? 'myTable' : 'myHide' )}>{row+1}</td>
            <SiloSelected item={item} row={row} />
            <td className={clsx( show ? 'myTable' : 'myHide' )}>{item.row}</td>
            <td className={clsx( show ? 'myTable' : 'myHide' )}>{item.col}</td>

            <SiloDimension item={item} row={row} />

            <SiloComments item={item} row={row} />
        </tr>
        </>
    );
}
function ParseID (props){
      //id: `silo-row-${index}/col-${index2}`,
      let row = props.indexOf("row");
      let col = props.indexOf("col");
      let row_txt = props.slice( row+4, col-1);
      let col_txt = props.slice( col+4 );
      row = Number(row_txt);
      col = Number(col_txt);
return ( {row, col} );
}



return (
    <>
    <TableStructure/>
    </>
);
}