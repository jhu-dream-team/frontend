import * as React from "react";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "./Pages/PrivateRoute";
import Home from "./Pages/Home";
import Login from "./Authentication/Login";
import GameUI from "./Game/screens/GameUIScreen";
import { inject, observer } from "mobx-react";
import Header from "./components/header";
import Page404 from "./Pages/404";
import SignUp from "./Authentication/Signup";

@inject("rootStore")
@observer
class App extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.rootStore.authStore.isAuthenticated) {
      this.props.rootStore.userStore.getProfile();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.rootStore.authStore.isAuthenticated) {
      this.props.rootStore.userStore.getProfile();
    }
  }

  render() {
    return (
      <div>
        {this.props.rootStore.authStore.isAuthenticated ? <Header /> : null}
        <Switch>
          <PrivateRoute exact path="/" component={Home} />
          <PrivateRoute exact={false} path="/game/:id" component={GameUI} />
          {localStorage.getItem("token") == null
            ? [
                <Route key={1} path="/login" component={Login} />,
                <Route key={2} path="/signup" component={SignUp} />
              ]
            : null}
          <Route component={Page404} />
        </Switch>
      </div>
    );
  }
}

export default App;
