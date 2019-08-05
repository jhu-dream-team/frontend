import * as React from "react";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "../private_route";
import Home from "../home";
import Login from "../login";
import { inject, observer } from "mobx-react";

@inject("authStore")
@observer
class App extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
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
