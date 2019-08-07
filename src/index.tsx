import * as React from "react";
import * as ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import { Provider } from "mobx-react";
import { create } from "mobx-persist";
import authStore from "./store/auth";
import userStore from "./store/user";
require("./styles/index.scss");

const hydrate = create();

hydrate("auth", authStore).then(() => console.log(authStore));

hydrate("user", userStore).then(() => console.log(userStore));

const stores = {
  authStore,
  userStore
};

import App from "./components/app";

hydrate("auth", authStore).then(() => {
  ReactDOM.render(
    <HashRouter>
      <Provider {...stores}>
        <App />
      </Provider>
    </HashRouter>,
    document.getElementById("root")
  );
});
