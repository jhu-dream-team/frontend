import { computed, observable, action } from "mobx";
import { persist } from "mobx-persist";
import makeInspectable from "mobx-devtools-mst";
import UserService from "../../services/user";

class AuthStore {
  @persist @observable username = null;
  @persist @observable user_id = null;

  @observable error = null;

  @action async get_info(store) {
    var user_service = new UserService("http://localhost:5000", store);
    var result = await user_service.get_user().catch(err => {
      this.error = err.message;
    });
    if (result != undefined) {
      console.log(result);
      this.setUsername(result["username"]);
      this.setUserId(result["id"]);
    }
  }

  @action setUsername(username) {
    this.username = username;
  }

  @action setUserId(user_id) {
    this.user_id = user_id;
  }
}

const userStore = new AuthStore();
export default makeInspectable(userStore);
