import * as React from "react";
import * as ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import { Provider } from "mobx-react";
import authStore from "./store/auth";
require("./styles/index.scss");

const stores = {
  authStore
};

import App from "./components/app";

ReactDOM.render(
  <HashRouter>
    <Provider {...stores}>
      <App />
    </Provider>
  </HashRouter>,
  document.getElementById("root")
);
