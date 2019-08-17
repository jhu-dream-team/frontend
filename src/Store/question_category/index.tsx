import { computed, observable, action } from "mobx";
import { persist } from "mobx-persist";
import ApolloClient from "../../Services/apollo";

const apolloClient = ApolloClient.getInstance();

export default class QuestionCategoryStore {
  private rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable loading = false;
  @observable errors: Array<String> = [];

  @persist @observable question_categories = [];

  @action
  async getQuestionCategories() {
    this.errors = [];
    this.loading = true;
    const data = await apolloClient.queryQuestionCategories().catch(err => {
      this.loading = false;
      this.errors.push(err);
    });
    this.question_categories = data.data.QuestionCategories.data;
    this.loading = false;
  }
}
