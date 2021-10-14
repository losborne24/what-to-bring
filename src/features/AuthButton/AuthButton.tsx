import React, { useState, useEffect } from 'react';
import styles from './AuthButton.module.scss';
import { Auth, Hub } from 'aws-amplify';
import { IconButton, Button, Typography, styled } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

const CssIconButton = styled(IconButton)({
  fontSize: 32,
});

export function AuthButton(props: any) {
  return (
    <div>
      {props.user ? (
        <div className={styles.loggedInContainer}>
          {' '}
          <Typography variant="body2" className={styles.txtEmail}>
            {props.user?.attributes?.email}{' '}
          </Typography>
          <Button
            color="inherit"
            variant="outlined"
            onClick={() => Auth.signOut()}
          >
            <Typography variant="button">Sign Out </Typography>{' '}
          </Button>
        </div>
      ) : (
        <CssIconButton
          color="inherit"
          className={styles.button}
          onClick={() => Auth.federatedSignIn()}
        >
          <AccountCircle fontSize="inherit" />
        </CssIconButton>
      )}
    </div>
  );
}
