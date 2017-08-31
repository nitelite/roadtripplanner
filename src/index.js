import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { BrowserRouter } from 'react-router-dom';

injectTapEventPlugin();

const WrappedApp = () => (<MuiThemeProvider><BrowserRouter><App /></BrowserRouter></MuiThemeProvider>);

ReactDOM.render(<WrappedApp />, document.getElementById('root'));
registerServiceWorker();
