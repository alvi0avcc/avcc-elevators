import * as React from 'react';
import { Elevators } from './elevators.js';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import * as Calc from './calc.js';

import { ElevatorListGet } from "./iolocal";

export function ElevatorDialogShow (name, index) {
    let NewName = "";
       NewName = prompt("New Name of Elevator", name );
    if ( NewName || "" ) {
        Elevators.setName = NewName
    };
  };

  export function ComplexDialogShow (name, index) {
    let NewName = "";
       NewName = prompt("New Name of Complex", name );
    if ( NewName || "" ) {
        Elevators.SetComplexName = NewName
    };
  };  

export function RoundSqureToDiameter(){
    let d  = Elevators.SiloDimension.Diameter;
    let square;
    if ( d > 0 ) square = Calc.MyRound( 3.14 * Math.pow( d/2, 2 ), 3 );
    if ( square = prompt ( 'Calculate Diameter from Area  (m²).', square ) )
      d =  Calc.MyRound( Math.sqrt( square / 3.14 ) * 2, 3 );
    return d;
  }

  export function FormDialog(props) {
    const [open, setOpen] = React.useState(false);
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    return (
      <div>
        <Button variant="outlined" onClick={handleClickOpen}>
          Open form dialog
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Subscribe</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To subscribe to this website, please enter your email address here. We
              will send updates occasionally.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleClose}>Subscribe</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }  