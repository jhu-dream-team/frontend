import { computed, observable, action } from "mobx";
import { persist } from "mobx-persist";
import ApolloClient from "../../Services/apollo";
import * as firebase from "firebase";

const config = {
  apiKey: "AIzaSyBZ5YRgH_hElSIizAfDBQtJxC9qzf3VPRM",
  authDomain: "wheelofjeopardy.firebaseapp.com",
  databaseURL: "https://wheelofjeopardy.firebaseio.com",
  projectId: "wheelofjeopardy",
  storageBucket: "",
  messagingSenderId: "221674904482",
  appId: "1:221674904482:web:ca3f16551cef62ef"
};

firebase.initializeApp(config);

const apolloClient = ApolloClient.getInstance();

export default class AuthStore {
  private unsubscribe;
  private rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        user
          .getIdToken()
          .then(token => {
            if (token) {
              localStorage.setItem("token", token);
            } else {
              localStorage.removeItem("token");
            }
          })
          .catch(err => {
            console.log("Error Fetching Token: ", err);
            localStorage.removeItem("token");
          });
      }
    });

    setInterval(() => {
      if (localStorage.getItem("token") == null) {
        if (firebase.auth().currentUser != null) {
          firebase.auth().signOut();
          window.location.replace("/");
        }
      }
    }, 15000);

    setInterval(() => {
      if (firebase.auth().currentUser != null) {
        return firebase
          .auth()
          .currentUser.getIdToken(true)
          .then(token => {
            if (token != localStorage.getItem("token")) {
              localStorage.setItem("token", token);
            }
          });
      } else {
        localStorage.removeItem("token");
      }
    }, 30 * 1000);
  }

  @observable loading = false;
  @observable errors: Array<String> = [];

  @persist("object") @observable profile = {
    id: null,
    firstName: null,
    lastName: null,
    profileImg: null,
    birthDate: null,
    email: null,
    phoneNumber: null
  };

  @computed get isAuthenticated() {
    if (localStorage.getItem("token") != null) {
      return true;
    } else {
      firebase.auth().signOut();
      return false;
    }
  }

  @action
  async login({ email, password, history }) {
    this.errors = [];
    this.loading = true;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async userCredential => {
        this.profile.id = userCredential.user.uid;
        this.loading = false;
        this.rootStore.routingStore.push("/");
      })
      .catch(err => {
        console.log("Authentication Error: ", err);
        this.errors = [err.message];
        this.loading = false;
      });
  }

  @action
  async signup({ email, password, firstName, lastName, history }) {
    this.errors = [];
    this.loading = true;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async userCredential => {
        this.profile.id = userCredential.user.uid;
        var token = await userCredential.user.getIdToken();
        localStorage.setItem("token", token);
        return apolloClient
          .createProfile(
            this.profile.id,
            firstName,
            lastName,
            email,
            null,
            token
          )
          .then(() => {
            this.profile.firstName = firstName;
            this.profile.lastName = lastName;
            this.profile.email = email;
            this.loading = false;
            window.location.replace("/");
          })
          .catch(err => {
            this.loading = false;
            this.errors.push(err);
            window.location.replace("/");
          });
      })
      .catch(err => {
        console.log("Registration Error: ", err);
        this.errors = [err.message];
        this.loading = false;
      });
  }
}
