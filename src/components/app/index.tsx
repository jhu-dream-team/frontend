import * as React from "react";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "../private_route";
import Home from "../home";
import Login from "../login";
import { inject, observer } from "mobx-react";
import Header from "../header";
import UserService from "../../services/user";

@inject("authStore", "userStore")
@observer
class App extends React.Component<any, any> {
  private user_service;

  constructor(props) {
    super(props);
    this.state = {
      username: null,
      user_id: null
    };
    this.user_service = new UserService(
      "http://localhost:5000",
      props.authStore
    );
  }

  async componentDidMount() {
    if (this.props.authStore.isAuthenticated) {
      this.props.userStore.get_info(this.props.authStore);
    }
  }

  render() {
    return (
      <div>
        {this.props.authStore.isAuthenticated ? <Header /> : null}
        <Switch>
          <PrivateRoute
            authenticated={this.props.authStore.isAuthenticated}
            exact
            path="/"
            component={Home}
          />
          <Route path="/login" component={Login} />
        </Switch>
      </div>
    );
  }
}

export default App;
