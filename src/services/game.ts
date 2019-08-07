import axios from "axios";

var game_service = null;

export default class LoginService {
  private url;
  private store;

  constructor(url, store) {
    if (game_service != null) {
      return game_service;
    }
    this.url = url;
    this.store = store;
  }

  public async get_games() {
    const result = await axios
      .get(this.url + "/game", {
        headers: { Authorization: "Bearer " + this.store.authorization }
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
    return result.data;
  }
}
