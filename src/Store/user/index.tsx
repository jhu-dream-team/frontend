import { computed, observable, action } from "mobx";
import { persist } from "mobx-persist";
import ApolloClient from "../../Services/apollo";

const apolloClient = ApolloClient.getInstance();

export default class UserStore {
  private rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable loading = false;
  @observable errors: Array<String> = [];

  @persist("object") @observable profile = {
    id: null,
    firstName: null,
    lastName: null,
    profileImg: null,
    email: null
  };

  @action
  async getProfile() {
    this.errors = [];
    this.loading = true;
    const data = await apolloClient.queryProfile().catch(err => {
      this.loading = false;
      this.errors.push(err);
    });
    this.profile = data.data.Profile;
    this.loading = false;
  }
}
