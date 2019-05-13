import 'babel-polyfill';
import {
  createMuiTheme
} from '@material-ui/core/styles';

const defaultTheme = createMuiTheme({ // use as reference for theme below
  typography: {
    useNextVariants: true // necessary to bipass variant outdated warning
  }
});

const theme = createMuiTheme({
  overrides: {
    MuiButton: {},
    MuiAppBar: {
      colorDefault: {
        backgroundColor: 'rgb(245,245,245,.9)'
      }
    },
    MuiPaper: {
      rounded: {
        borderRadius: '2px'
      },
      elevation1: {
        boxShadow: 'none',
        border: 'solid 1px #eee'
      },
    },
    MuiTypography: {
      h1: {
        [defaultTheme.breakpoints.down('sm')]: {
          fontSize: '2.5rem',
        },
        fontSize: '3rem',
        fontFamily: ['Montserrat', 'sans-serif'].join(',')
      },
      h2: {
        textTransform: 'uppercase',
        color: 'rgba(0, 0, 0, 0.75)',
        fontSize: '1.5rem',
        fontFamily: ['Montserrat', 'sans-serif'].join(',')
      },
      h3: {
        fontSize: '1.5rem',
        fontFamily: ['Montserrat', 'sans-serif'].join(',')
      },
      h4: {
        color: 'rgba(0, 0, 0, 0.5)'
      },
      h5: {
        fontSize: '1.25rem',
        fontFamily: ['Montserrat', 'sans-serif'].join(',')
      },
    }
  },
  palette: {
    text: {
      primary: 'rgba(0, 0, 0, 0.75)',
      secondary: 'rgba(0,0,0,.5)'
    },
    primary: {
      main: '#15304C'
    },
    secondary: {
      main: '#C79859'
    },
    success: {
      main: '#0e9e23'
    },
    error: {
      main: '#7F2B23',
      light: '#e96363'
    }
  },
  typography: {
    useNextVariants: true, // https://material-ui.com/style/typography/#migration-to-typography-v2
    // Use the system font instead of the default Roboto font.
    fontFamily: ['Lato', 'sans-serif'].join(',')
  }
});

export default theme;
