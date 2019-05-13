import React from 'react';
import 'babel-polyfill';
import Favicon from 'react-favicon';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import 'react-dates/initialize'; // needed for date pickers
import { MuiPickersUtilsProvider } from 'material-ui-pickers';

// import CustomFavicon from '../assets/favicons/favicon.ico';
import Header from './Header';
import theme from './theme.js';

const App = ({ children }) => (
  <div className="site">
    <CssBaseline />
    {/* <Favicon url={CustomFavicon} /> */}
    <MuiThemeProvider theme={theme}>
      <Header />
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <main className="site-content container"> {children} </main>
      </MuiPickersUtilsProvider>
      {/* <Footer /> */}
    </MuiThemeProvider>
  </div>
);

export default App;
