import * as React from "react";
import * as ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";
import { Provider } from "mobx-react";
import { create } from "mobx-persist";
import authStore from "./Store/auth";
import gameStore from "./Store/game";
require("./Assets/styles/index.scss");

const hydrate = create();

const stores = {
  authStore,
  gameStore
};

import App from "./App";

hydrate("auth", authStore).then(() => {
  ReactDOM.render(
    <Provider {...stores}>
      <Router>
        <App />
      </Router>
    </Provider>,
    document.getElementById("root")
  );
});
