import * as React from 'react';
import * as ReactDOM from 'react-dom';
require("./styles/index.scss");

import App from './components/app';
import Questions from './components/questions';
import Spin from './components/spin';

ReactDOM.render (
  <Spin />,
  document.getElementById("root")
);
