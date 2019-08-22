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
    .register("/firebase-messaging-sw.js")
    .then(registration => {
      console.log(`Registration successful, scope ${registration.scope}`);
    })
    .catch(err => {
      console.log(`Registration unsucessful: `, err);
    });

  navigator.serviceWorker.addEventListener("message", e => {
    console.log(
      "Received",
      e.data["firebase-messaging-msg-data"].data["data_type"]
    );
    switch (e.data["firebase-messaging-msg-data"].data["data_type"]) {
      case "Games":
        if (
          Object.keys(e.data["firebase-messaging-msg-data"].data).includes("id")
        ) {
          if (
            window.location.pathname.includes(
              e.data["firebase-messaging-msg-data"].data["id"]
            )
          ) {
            rootStore.gameStore.getGame(
              e.data["firebase-messaging-msg-data"].data["id"]
            );
          }
        } else {
          rootStore.gameStore.getGames();
          break;
        }
      case "QuestionCategory":
        console.log("reloading question categories");
        rootStore.questionCategoryStore.getQuestionCategories()
        break;
      case "Question":
        console.log("reloading questions");
        if (
          window.location.pathname.includes(
            e.data["firebase-messaging-msg-data"].data["id"]
          )
        ) {
          rootStore.questionCategoryStore.getQuestionCategory(
            e.data["firebase-messaging-msg-data"].data["id"]
          );
        }
    }
  });

  navigator.serviceWorker.startMessages();
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
