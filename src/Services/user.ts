import axios from "axios";

var user_service = null;

export default class LoginService {
  private url;
  private store;

  constructor(url, store) {
    if (user_service != null) {
      return user_service;
    }
    this.url = url;
    this.store = store;
  }

  public async get_user() {
    const result = await axios
      .get(this.url + "/account", {
        headers: { Authorization: "Bearer " + this.store.authorization }
      })
      .catch(err => {
        throw err;
      });
    return result.data;
  }
}
