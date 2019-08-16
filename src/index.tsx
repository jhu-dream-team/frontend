import * as React from "react";
import * as ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";
import { Provider } from "mobx-react";
import { create } from "mobx-persist";
import NotificationManager from "./Services/messaging.js";
import rootStore from "./Store";
require("./Assets/styles/index.scss");

const hydrate = create();

const notificationManager = NotificationManager.getInstance();

import App from "./App";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./firebase-messaging-sw.js")
    .then(registration => {
      console.log(`Registration successful, scope ${registration.scope}`);
    })
    .catch(err => {
      console.log(`Registration unsucessful: `, err);
    });
}

hydrate("auth", rootStore.authStore).then(() => {
  ReactDOM.render(
    <Provider rootStore={rootStore}>
      <Router>
        <App />
      </Router>
    </Provider>,
    document.getElementById("root")
  );
});
