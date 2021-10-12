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
        <>
          {' '}
          <Typography variant="body2">
            {props.user?.attributes?.email}{' '}
          </Typography>{' '}
          <Button color="inherit" onClick={() => Auth.signOut()}>
            <Typography variant="button">Sign Out </Typography>{' '}
          </Button>
        </>
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
