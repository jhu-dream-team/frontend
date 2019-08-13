import { computed, observable, action } from "mobx";
import { persist } from "mobx-persist";
import ApolloClient from "../../Services/apollo";
import makeInspectable from "mobx-devtools-mst";

const apolloClient = ApolloClient.getInstance();

class GameStore {
  @observable loading = false;
  @observable errors: Array<String> = [];

  @persist @observable games = [];

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
}

const gameStore = new GameStore();
export default makeInspectable(gameStore);
