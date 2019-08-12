import * as React from "react";
import { Route, Redirect } from "react-router";
import { observer, inject } from "mobx-react";

const PrivateRoute = inject("authStore")(
  observer(({ component: Component, ...rest }) => {
    return (
      <Route
        {...rest}
        render={(props: any) =>
          rest.authStore.isAuthenticated ? (
            <Component {...props} />
          ) : (
            <Redirect to="/login" />
          )
        }
      />
    );
  })
);

export default PrivateRoute;
