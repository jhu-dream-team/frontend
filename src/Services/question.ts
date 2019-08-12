import axios from "axios";

var question_service = null;

export default class QuestionService {
  private url;
  private store;

  constructor(url, store) {
    if (question_service != null) {
      return question_service;
    }
    this.url = url;
    this.store = store;
  }

  public async get_categories() {
    const result = await axios
      .get(this.url + "/question/category", {
        headers: { Authorization: "Bearer " + this.store.authorization }
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
    return result.data;
  }
}
