import React from 'react';

import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { globalCompanyName } from '../../utils/constants';

const styles = () => ({
  root: {
    marginTop: '-26px',
    backgroundColor: 'rgba(255,255,255,.6)',
    zIndex: '10000',
    position: 'fixed',
    bottom: '0',
    width: '100%',
    paddingTop: '6px'
  }
});

const Footer = props => {
  const { classes } = props;
  return (
    <footer className={classes.root}>
      <Typography align="center" variant="caption" gutterBottom>
        {`© ${new Date().getFullYear()} Copyright ${globalCompanyName}`}
      </Typography>
    </footer>
  );
};

export default withStyles(styles)(Footer);
