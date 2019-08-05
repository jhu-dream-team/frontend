import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
require("./styles/index.scss");

import App from './components/app';

ReactDOM.render (
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById("root")
);
