//import React from 'react';
import { useContext } from 'react';
import { UpdateContext } from '../Main'
import { Elevators } from './elevators.js';
import * as iolocal from './iolocal';
import ServerMenu from './server_menu';


export default function FileMenuButton(){
const [update, setUpdate] = useContext(UpdateContext);
//const [updateView, setUpdateView] = React.useState(false);

const handleImport = (e)=>{
    iolocal.FileImport(e.target.files[0]).then( (result) => { Elevators.setElevators = result; setUpdate( !update ) } );
}

    //console.log('status = ',status);
    return (
    <>
    <ServerMenu/>

    <div className='blockLabel'>
        <div className='labelBlock'>
            <span>Local</span>
        </div>
        <br/>

    <div style={{ display:'flex', justifyContent: 'space-between' }}>
        <div>
            <button className='myButton'
                style={{ width: 60, fontSize: 12}}
                onClick={ () => ( 
                Elevators.setElevators =  iolocal.OpenElevator() ,
                setUpdate( !update )
                ) }
            >Open</button>
            <button className='myButton'
                style={{ width: 60, fontSize: 12}}
                onClick={ () => ( 
                iolocal.SaveElevator()
                )}
            >Save</button>
        </div>
        
        <div>

            <label 
                for="fileImport"
                className='myButton'
                style={{ display: 'inline-block', width: 60, height: 25, fontSize: 12, paddingTop: 5 }}
                >Import</label>
            <input
                id="fileImport"
                accept=".json"
                type="file"
                hidden
                onChange={handleImport}
                />

            <button className='myButton'
                style={{ width: 60, fontSize: 12}}
                onClick={ () => (
                iolocal.ExportWarehouse()
                ) }
            >Export</button>

        </div>

    </div>
    </div>
    </>
    )
}