import axios from "axios";

var login_service = null;

export default class LoginService {
  private url;

  constructor(url) {
    if (login_service != null) {
      return login_service;
    }
    this.url = url;
  }

  public async login(username, password) {
    const result = await axios
      .post(this.url + "/login", { username: username, password: password })
      .catch(err => {
        console.log(err);
        throw err;
      });
    return result.data;
  }
}
