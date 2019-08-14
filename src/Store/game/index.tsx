import { computed, observable, action } from "mobx";
import { persist } from "mobx-persist";
import ApolloClient from "../../Services/apollo";

const apolloClient = ApolloClient.getInstance();

export default class GameStore {
  private rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable loading = false;
  @observable errors: Array<String> = [];

  @persist @observable games = [];
  @persist @observable scores = [];

  @action
  async getGames() {
    this.errors = [];
    this.loading = true;
    const data = await apolloClient.queryGames().catch(err => {
      this.loading = false;
      this.errors.push(err);
    });
    this.games = [data.data.Game];
    this.loading = false;
  }

  @action
  async getScores() {
    this.errors = [];
    this.loading = true;
    const data = await apolloClient.queryScores().catch(err => {
      this.loading = false;
      this.errors.push(err);
    });
    this.scores = [data.data.Game];
    this.loading = false;
  }
}
