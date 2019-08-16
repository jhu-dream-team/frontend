import makeInspectable from "mobx-devtools-mst";
import AuthStore from "./auth";
import GameStore from "./game";
import UserStore from "./user";

class RootStore {
  constructor() {
    this.authStore = new AuthStore(this);
    this.gameStore = new GameStore(this);
    this.userStore = new UserStore(this);
  }
}

const rootStore = new RootStore();

export default rootStore;
