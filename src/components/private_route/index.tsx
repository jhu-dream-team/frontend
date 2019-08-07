import * as React from "react";
import { Route, Redirect } from "react-router";
import { observer } from "mobx-react";

const PrivateRoute = observer(
  ({
    component: Component,
    ...rest
  }: {
    authenticated: any;
    component: any;
    exact: any;
    path: any;
  }) => {
    console.log(rest);
    return (
      <Route
        {...rest}
        render={(props: any) =>
          rest.authenticated ? (
            <Component {...props} />
          ) : (
            <Redirect to="/login" />
          )
        }
      />
    );
  }
);

export default PrivateRoute;
