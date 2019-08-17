import * as React from "react";
import * as ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { syncHistoryWithStore } from "mobx-react-router";
import { Provider } from "mobx-react";
import { create } from "mobx-persist";
import NotificationManager from "./Services/messaging.js";
import { rootStore, history } from "./Store";
require("./Assets/styles/index.scss");

const reactiveHistory = syncHistoryWithStore(history, rootStore.routingStore);

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
      <Router history={reactiveHistory}>
        <App />
      </Router>
    </Provider>,
    document.getElementById("root")
  );
});
