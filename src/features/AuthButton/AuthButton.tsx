import React, { useState, useEffect } from 'react';
import styles from './AuthButton.module.scss';
import { Auth, Hub } from 'aws-amplify';
import {
  IconButton,
  Button,
  Typography,
  styled,
  MenuItem,
  Menu,
  Divider,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useHistory } from 'react-router-dom';

const CssIconButton = styled(IconButton)({
  fontSize: 32,
});
const CssDivider = styled(Divider)({
  margin: '0.5rem 0',
});

export function AuthButton(props: any) {
  const history = useHistory();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [anchorElUnAuth, setAnchorElUnAuth] =
    React.useState<null | HTMLElement>(null);
  const openUnAuth = Boolean(anchorElUnAuth);
  const handleClickUnAuth = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElUnAuth(event.currentTarget);
  };
  const handleCloseUnAuth = () => {
    setAnchorElUnAuth(null);
  };
  return (
    <div>
      {props.user ? (
        <div className={styles.loggedInContainer}>
          {' '}
          <CssIconButton
            color="inherit"
            className={styles.button}
            onClick={handleClick}
          >
            <AccountCircle fontSize="inherit" />
          </CssIconButton>
          <Menu
            className={styles.menu}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            {' '}
            <div className={styles.txtMenu}>
              <Typography variant="body2">Signed in as</Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {props.user?.attributes?.email}
              </Typography>
            </div>{' '}
            <CssDivider />
            <MenuItem
              onClick={() => {
                history.push('/suggest-a-topic');
              }}
            >
              <Typography variant="body2">Suggest A Topic</Typography>
            </MenuItem>
            <CssDivider />
            <MenuItem onClick={() => Auth.signOut()}>
              <Typography variant="body2">Sign Out</Typography>
            </MenuItem>
          </Menu>
        </div>
      ) : (
        // <CssIconButton
        //   color="inherit"
        //   className={styles.button}
        //   onClick={() => Auth.federatedSignIn()}
        // >
        //   <AccountCircle fontSize="inherit" />
        // </CssIconButton>
        <div className={styles.loggedInContainer}>
          <CssIconButton
            color="inherit"
            className={styles.button}
            onClick={handleClickUnAuth}
          >
            <AccountCircle fontSize="inherit" />
          </CssIconButton>
          <Menu
            className={styles.menu}
            anchorEl={anchorElUnAuth}
            open={openUnAuth}
            onClose={handleCloseUnAuth}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={() => Auth.federatedSignIn()}>
              <Typography variant="body2">Sign In</Typography>
            </MenuItem>
          </Menu>
        </div>
      )}
    </div>
  );
}
