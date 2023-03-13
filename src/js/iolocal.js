import * as React from 'react';
import { Elevators } from './elevators.js';
import Button from '@mui/material/Button';
import {AlertUpper} from './interface.js';
import MenuItem from '@mui/material/MenuItem';

export let ElevatorOpened = false; // Local BD Opened/Closed
export let FileSel = React.createRef();
let FileWork;
let ElevatorKey = ''; //ключ текущего элеватора в localStorage
export let ElevatorList = [];
export let WarehouseList = [];
export let PileList = [];

export function NewElevator(props) {
    if ( localStorage.getItem("Elevator") ) { 
        Elevators.AddElevator();
        Elevators.State = 'changed';
        console.log("New Empty Elevator Added !")
    } else {
        Elevators.AddElevator();
        Elevators.State = 'changed';
        localStorage.setItem( "Elevator" , JSON.stringify(Elevators.Elevators));
        console.log("New Empty Elevator Created !")
        };
    return(
        console.log('Elevators after Create/Add ',Elevators)
    );
}

export function ElevatorListGet () {
   let ii = 0;
    let data;
    ElevatorList = [];
    for( let i =0 ; i < ii ; i++){
        ElevatorList.push( data );
    };
    console.log("ElevatorList", ElevatorList);
}

export function OpenElevator() {
    let data = localStorage.getItem("Elevator");
    if ( data ) { data = JSON.parse(data) }
    else {
            data = null;
            alert ("Локальная БД пуста!")
        }
    return( data );
};

export function SaveElevator() {
    if ( Elevators.ElevatorsFound )
        localStorage.setItem("Elevator", JSON.stringify(Elevators.Elevators))
        else alert('The elevator database is empty! Nothing to save.');
};

function ImportWarehouse(props) {
    return(
        FileImport(props)
    );
} export {ImportWarehouse};

function ExportWarehouse(props) {
    return(
        FileSave(props)
    );
} export {ExportWarehouse};

export function FileInputButton(props) {
    console.log('import file');
    return (
        <MenuItem variant="text" component="label" >
            Import
            <input ref={FileSel} hidden accept=".json" type="file" onChange={() => {FileImport()}}/>
        </MenuItem> 
    );
    };   

export async function FileImport(props) {

    FileWork = FileSel.current.files[0];
    let FileJSON = null;
    let file = await new Promise((resolve) => {
            let reader = new FileReader();
            reader.onload = function() { resolve(reader.result) };  
            reader.readAsText(FileWork); 
        });
    let original = fromBinary( file );
    FileJSON = JSON.parse(original);
    return Promise.resolve(FileJSON)
    }

function toBinary(string) {
    const codeUnits = Uint16Array.from(
      { length: string.length },
      (element, index) => string.charCodeAt(index)
    );
    const charCodes = new Uint8Array(codeUnits.buffer);
  
    let result = "";
    charCodes.forEach((char) => {
      result += String.fromCharCode(char);
    });
    return result;
  }

function fromBinary(binary) {
    const bytes = Uint8Array.from({ length: binary.length }, (element, index) =>
      binary.charCodeAt(index)
    );
    const charCodes = new Uint16Array(bytes.buffer);
  
    let result = "";
    charCodes.forEach((char) => {
      result += String.fromCharCode(char);
    });
    return result;
  } 

function FileSave (props) {
    if ( Elevators.ElevatorsFound ) {
        let data = WarehouseToJSON(Elevators.Elevators);
        let a=document.createElement("a");
        let name = Elevators.ElevatorsName + Elevators.ElevatorsDate + '.json';
        console.log("File save",name);
        a.setAttribute("download", name||"Elevator.json");
        a.setAttribute("href", "data:application/octet-stream;base64," + btoa( toBinary (data) ||"undefined"));
        a.click();
        setTimeout(() => {
                    URL.revokeObjectURL(a.href);
                    a.remove();
                    }, 1000);
    }
    else { alert("No data for Export!")};
  }

export function WarehouseToJSON (props) {
    return JSON.stringify(props)
}
