import * as React from 'react';
import { useContext } from 'react';
import { UpdateContext } from '../App'
import { Elevators } from './elevators.js';
import { useState } from "react";
import * as iolocal from './iolocal';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';

const FileMenu = ['Create/Add', 'Open', 'Save', 'Import', 'Export'];

function ResponsiveAppBar(props) {
    const [update, setUpdate] = useContext(UpdateContext);
    const [anchorElFile, setAnchorElFile] = React.useState(null);

  const handleOpenFileMenu = (event) => {
    setAnchorElFile(event.currentTarget);
  };

  const handleCloseFileMenu = () => {
    setAnchorElFile(null);
  };

  const handleClickFileMenu = () => {
    setAnchorElFile(null)
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1 }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenFileMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElFile}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElFile)}
              onClose={handleCloseFileMenu}
            >
                <MenuItem key={0} onClick={ () => ( 
                    iolocal.NewElevator(),
                    Elevators.State = 'New',
                    setUpdate ( !update ),
                    handleClickFileMenu()
                     ) }>
                  <Typography textAlign="center">{'Create/Add'}</Typography>
                </MenuItem>
                <Divider/>
                <MenuItem key={1} onClick={ () => ( 
                    Elevators.setElevators =  iolocal.OpenElevator() ,
                    setUpdate( !update ),
                    handleClickFileMenu()
                    ) }>
                  <Typography textAlign="center">{'Open/reOpen'}</Typography>
                </MenuItem>
                <MenuItem key={2} onClick={ () => ( 
                    iolocal.SaveElevator(),
                    handleClickFileMenu() 
                    )}>
                  <Typography textAlign="center">{'Save'}</Typography>
                </MenuItem>
                <Divider/>
                    <MenuItem key={3} component="label" onClick={ () => ( handleClickFileMenu() )}>
                      Import
                      <input ref={iolocal.FileSel} hidden accept=".json" type="file" onChange={() => ( 
                        iolocal.FileImport().then( (result) => { Elevators.setElevators = result } ),
                        console.log('promise', Elevators ),
                        setUpdate( !update )
                        )}/>
                    </MenuItem>
                
                <MenuItem key={4} onClick={ () => (
                  iolocal.ExportWarehouse(),
                  handleClickFileMenu()
                  ) }>
                  <Typography textAlign="center">{'Export'}</Typography>
                </MenuItem>
                <MenuItem key={5} onClick={ () => (
                  console.log('Elevators ==11== ', Elevators),
                  setUpdate( !update ),
                  handleClickFileMenu()
                  ) }>
                  <Typography textAlign="center">{'reload info'}</Typography>
                </MenuItem>
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <img src="favicon.ico" alt='AVCC-' height="50" ></img>
            Elevators
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;