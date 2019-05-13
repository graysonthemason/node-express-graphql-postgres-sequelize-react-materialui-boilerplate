import React, { PureComponent, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

import { Typography, Grid } from '@material-ui/core';

const styles = {
  marginTop: {
    marginTop: '6rem'
  }
};

class NoMatch extends PureComponent {
  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Grid container className={classes.marginTop} justify="center">
          <Grid container justify="center" item xs={10}>
            <Grid item xs={12}>
              <Typography gutterBottom align="center" variant="h1">
                Ho Boy!
              </Typography>
              <Typography gutterBottom align="center" variant="h3">
                {"Sorry, we can't seem to find the page you're looking for."}
              </Typography>
            </Grid>
            <Grid item md={8} sm={10} xs={12}>
              <img
                width="100%"
                src="https://res.cloudinary.com/dwelloptimal/image/upload/v1551121542/site/spilt_milk.png"
                alt="Spilt Milk"
              />
            </Grid>
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

export default withStyles(styles)(NoMatch);
