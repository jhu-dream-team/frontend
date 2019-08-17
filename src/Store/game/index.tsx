import { computed, observable, action } from "mobx";
import { persist } from "mobx-persist";
import ApolloClient from "../../Services/apollo";

const apolloClient = ApolloClient.getInstance();

export default class GameStore {
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
    game: false
  };
  @observable errors: Array<String> = [];

  @persist @observable games = [];
  @observable game = null;

  @action
  async getGames() {
    this.errors = [];
    this.loading.list = true;
    const data = await apolloClient.queryGames().catch(err => {
      this.loading.list = false;
      this.errors.push(err);
    });
    this.games = data.data.Games.data;
    this.loading.list = false;
  }

  @action
  async getGame(id) {
    this.errors = [];
    this.loading.game = true;
    const data = await apolloClient.queryGame(id).catch(err => {
      this.loading.game = false;
      this.errors.push(err);
    });
    this.game = data.data.Game;
    this.loading.game = false;
  }

  @action
  async joinGame(id) {
    this.errors = [];
    this.loading.game = id;
    this.loading.entry.value = true;
    this.loading.entry.button = "join";
    const data = await apolloClient.joinGame(id).catch(err => {
      this.loading.entry.id = "";
      this.loading.entry.value = false;
      this.loading.entry.button = "";
      this.errors.push(err);
    });
    if (data.data.joinGame.status == "Success") {
      await this.getGames();
      this.loading.entry.id = "";
      this.loading.entry.value = false;
      this.loading.entry.button = "";
    } else {
      this.loading.entry.id = "";
      this.loading.entry.value = false;
      this.loading.entry.button = "";
    }
  }

  async enterGame(id) {
    this.loading.entry.id = id;
    this.loading.entry.value = true;
    this.loading.entry.button = "enter";
    await this.getGame(id).then(() => {
      this.loading.entry.id = "";
      this.loading.entry.value = false;
      this.loading.entry.button = "";
      this.rootStore.routingStore.push(`/game/${id}`);
    });
  }

  async leaveGame(id) {
    this.loading.entry.id = id;
    this.loading.entry.value = true;
    this.loading.entry.button = "leave";
    const data = await apolloClient.leaveGame(id).catch(err => {
      this.loading.entry.id = "";
      this.loading.entry.value = false;
      this.loading.entry.button = "";
      this.errors.push(err);
    });
    if (data.data.joinGame.status == "Success") {
      await this.getGames();
      this.loading.entry.id = "";
      this.loading.entry.value = false;
      this.loading.entry.button = "";
    } else {
      this.loading.entry.id = "";
      this.loading.entry.value = false;
      this.loading.entry.button = "";
    }
  }
}
