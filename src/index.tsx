import * as React from 'react';
import * as ReactDOM from 'react-dom';
require("./styles/index.scss");

import App from './components/app';
import Login from './components/login';

ReactDOM.render (
  <Login />,
  document.getElementById("root")
);
