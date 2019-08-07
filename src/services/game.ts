import axios from "axios";

var game_service = null;

export default class GameService {
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

  public async create_game(game_name, question_sets) {
    const result = await axios
      .post(
        this.url + "/game",
        {
          name: game_name,
          question_sets: question_sets,
          players: [],
          answer_timeout: 30
        },
        {
          headers: { Authorization: "Bearer " + this.store.authorization }
        }
      )
      .catch(err => {
        console.log(err);
        throw err;
      });
    return result.data;
  }

  public async start_game(id) {
    const result = await axios
      .post(
        this.url + "/game/" + id + "/start",
        {},
        {
          headers: { Authorization: "Bearer " + this.store.authorization }
        }
      )
      .catch(err => {
        console.log(err);
        throw err;
      });
    return result.data;
  }

  public async get_game(id) {
    const result = await axios
      .get(this.url + "/game/" + id, {
        headers: { Authorization: "Bearer " + this.store.authorization }
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
    return result.data;
  }
}
