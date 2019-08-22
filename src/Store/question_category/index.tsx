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
    list: false,
    entry: {
      id: "",
      value: false,
      button: ""
    },
    question_category: false
  };
  @observable errors: Array<String> = [];

  @observable question_categories = [];

  @observable question_category = null;

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
  async getQuestionCategory(id) {
    this.errors = [];
    this.loading.question_category = true;
    const data = await apolloClient.queryQuestionCategory(id).catch(err => {
      this.loading.question_category = false;
      this.errors.push(err);
    });
    this.question_category = data.data.QuestionCategory;
    this.loading.question_category = false;
  }

  @action
  async createQuestionCategory(name) {
    this.errors = [];
    this.loading.list = true;
    const data = await apolloClient.createQuestionCategory(name).catch(err => {
      this.loading.list = false;
      this.errors.push(err);
    });
    this.question_categories.push(data.data.createQuestionCategory);
    this.loading.list = false;
  }

  @action
  async createQuestion(
    question,
    suggested_answer,
    max_points,
    question_category_id
  ) {
    this.errors = [];
    this.loading.question_category = true;
    const data = await apolloClient
      .createQuestion(
        question,
        suggested_answer,
        max_points,
        question_category_id
      )
      .catch(err => {
        console.log(err);
        this.loading.question_category = false;
        this.errors.push(err);
      });
    this.question_category.questions.data.push(data.data.createQuestion);
    this.loading.question_category = false;
  }

  @action
  async deleteQuestion(id) {
    this.errors = [];
    this.loading.question_category = true;
    const data = await apolloClient.deleteQuestion(id).catch(err => {
      this.loading.question_category = false;
      this.errors.push(err);
    });
    if (data.data.deleteQuestion.status == "Success") {
      var idx = this.question_category.questions.data
        .map(x => x.id)
        .indexOf(id);
      if (idx > -1) {
        this.question_category.questions.data.splice(idx, 1);
      }
      this.loading.question_category = false;
    } else {
      this.loading.question_category = false;
    }
  }

  @action
  async editQuestion(
    id,
    question,
    suggested_answer,
    max_points,
    question_category_id
  ) {
    this.errors = [];
    this.loading.question_category = true;
    const data = await apolloClient
      .editQuestion(
        id,
        question,
        suggested_answer,
        max_points,
        question_category_id
      )
      .catch(err => {
        console.log(err);
        this.loading.question_category = false;
        this.errors.push(err);
      });
    if (data.data.updateQuestion.status == "Success") {
      var idx = this.question_category.questions.data
        .map(x => x.id)
        .indexOf(id);
      this.question_category.questions.data[idx] = {
        id,
        question,
        suggested_answer,
        max_points,
        question_category_id,
        owner: this.question_category.questions.data[idx].owner
      };
    } else {
      this.loading.question_category = false;
    }
    this.loading.question_category = false;
  }

  async enterQuestionCategory(id) {
    this.loading.entry.id = id;
    this.loading.entry.value = true;
    this.loading.entry.button = "view";
    await this.getQuestionCategory(id).then(() => {
      this.loading.entry.id = "";
      this.loading.entry.value = false;
      this.loading.entry.button = "";
      this.rootStore.routingStore.push(`/question_categories/${id}`);
    });
  }
}
