import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-asap';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';


const theme = createMuiTheme({
    typography: {
        fontFamily: [
            'Asap',
            'sans-serif',
        ].join(','),
    },
});
ReactDOM.render(<MuiThemeProvider theme={theme}><App /></MuiThemeProvider>, document.getElementById('root'));
registerServiceWorker();
