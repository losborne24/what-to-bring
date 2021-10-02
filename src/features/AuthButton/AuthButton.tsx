import React, { useState, useEffect } from 'react';
import styles from './AuthButton.module.scss';
import { Auth, Hub } from 'aws-amplify';
import { IconButton, Button, Typography } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

export function AuthButton(props: any) {
  return (
    <div>
      {props.user ? (
        <Button color="inherit" onClick={() => Auth.signOut()}>
          <Typography variant="subtitle1">Sign Out </Typography>{' '}
        </Button>
      ) : (
        <IconButton
          color="inherit"
          size="large"
          className={styles.button}
          onClick={() => Auth.federatedSignIn()}
        >
          <AccountCircle fontSize="inherit" />
        </IconButton>
      )}
    </div>
  );
}
