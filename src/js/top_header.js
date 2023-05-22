import * as React from 'react';
import { useContext } from 'react';
import { UpdateContext } from '../App'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

export default function TopHeader(){
    return (
        <AppBar style={{ position: 'static' }}>
        <Toolbar sx={{ alignContent: 'space-between' }}>
            <Box sx={{ flexGrow: 1 }}></Box>
        <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Elevators
          </Typography>
          <Avatar alt="AVCC" src="favicon.ico" />
        </Toolbar>
        </AppBar>
    );
}