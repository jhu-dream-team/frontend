import makeInspectable from "mobx-devtools-mst";
import { RouterStore } from "mobx-react-router";
import { createBrowserHistory } from "history";
import AuthStore from "./auth";
import GameStore from "./game";
import UserStore from "./user";

class RootStore {
  constructor() {
    this.authStore = new AuthStore(this);
    this.gameStore = new GameStore(this);
    this.userStore = new UserStore(this);
    this.routingStore = new RouterStore();
  }
}

const history = createBrowserHistory();

const rootStore = new RootStore();

export { rootStore, history };
