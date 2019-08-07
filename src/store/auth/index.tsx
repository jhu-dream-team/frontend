import { computed, observable, action } from "mobx";
import { persist } from "mobx-persist";
import makeInspectable from "mobx-devtools-mst";
import LoginService from "../../services/login";

class AuthStore {
  @persist @observable authorization = null;
  @persist @observable refresh = null;
  @persist @observable error = null;

  @persist("object") @observable values = {
    username: "",
    password: "",
    email: ""
  };

  @computed get isAuthenticated() {
    return this.authorization ? true : false;
  }

  @action async login() {
    var login_service = new LoginService("http://localhost:5000");
    var result = await login_service
      .login(this.values.username, this.values.password)
      .catch(err => {
        this.error = err.message;
      });
    if (result != undefined) {
      console.log(result);
      this.setAuthToken(result["access_token"]);
      this.setRefreshToken(result["refresh_token"]);
    }
  }

  @action setAuthToken(token) {
    this.authorization = token;
  }

  @action setRefreshToken(token) {
    this.refresh = token;
  }

  @action setUsername(username) {
    this.values.username = username;
  }

  @action setPassword(password) {
    this.values.password = password;
  }

  @action setEmail(email) {
    this.values.email = email;
  }

  @computed get getAuthToken() {
    if (this.authorization) {
      return this.authorization;
    } else {
      return null;
    }
  }

  @action refreshToekn() {
    //TOOD
  }

  @action logout() {
    this.authorization = null;
    this.refresh = null;
  }
}

const userStore = new AuthStore();
export default makeInspectable(userStore);
