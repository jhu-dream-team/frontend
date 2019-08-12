import * as React from "react";
import * as ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";
import { Provider } from "mobx-react";
import { create } from "mobx-persist";
import authStore from "./Store/auth";
import userStore from "./Store/user";
require("./Assets/styles/index.scss");

const hydrate = create();

hydrate("auth", authStore);

hydrate("user", userStore);

const stores = {
  authStore,
  userStore
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
