import { computed, observable, action } from "mobx";
import { persist } from "mobx-persist";
import ApolloClient from "../../Services/apollo";

const apolloClient = ApolloClient.getInstance();

export default class QuestionCategoryStore {
  private rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable loading = {
    list: false
  };
  @observable errors: Array<String> = [];

  @persist @observable question_categories = [];

  @action
  async getQuestionCategories() {
    this.errors = [];
    this.loading.list = true;
    const data = await apolloClient.queryQuestionCategories().catch(err => {
      this.loading.list = false;
      this.errors.push(err);
    });
    this.question_categories = data.data.QuestionCategories.data;
    this.loading.list = false;
  }

  @action
  async createQuestionCategory(name) {
    this.errors = [];
    this.loading.list = true;
    const data = await apolloClient.createQuestionCategory(name).catch(err => {
      this.loading.list = false;
      this.errors.push(err);
    });
    if (data.data.createQuestionCategory.status == "Success") {
      await this.getQuestionCategories();
      this.loading.list = false;
    } else {
      this.loading.list = false;
    }
  }
}