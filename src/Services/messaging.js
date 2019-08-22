import * as firebase from "firebase";

import ApolloClient from "./apollo";

const apolloClient = ApolloClient.getInstance();

export default class NotificationManager {
  constructor() {
    NotificationManager.instance = this;
    this.deviceToken = null;
    this.messaging = firebase.messaging();
    this.messaging.usePublicVapidKey(
      "BJRNHLaDWVVWf09vArZuHVnUQfzKwRblBXdclegOuQ3GjPinRoEFOXWQ06Aq5NGbm94SOWF80ntDOSQH6V9JZ5U"
    );
    this.messaging
      .requestPermission()
      .then(async () => {
        const token = this.messaging.getToken().then(async val => {
          this.deviceToken = val;
          await apolloClient.setDeviceToken(val).catch(err => {
            console.log(err);
          });
          navigator.serviceWorker.addEventListener("message", message =>
            console.log(message)
          );
        });
      })
      .catch(function(err) {
        console.log("Unable to get permission to notify.", err);
      });
    this.unsubscribe = this.messaging.onTokenRefresh(async token => {
      console.log("Token Refreshed For Real-Time Messaging");
      this.deviceToken = token;
      await apolloClient.setDeviceToken(token).catch(err => {
        console.log(err);
      });
    });

    // this.watchMessage = this.messaging.onMessage((payload) => {
    //   console.log("received", payload);
    //   }
    // );
  }

  static getInstance() {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager;
  }

  static getDeviceToken() {
    return this.deviceToken;
  }
}
