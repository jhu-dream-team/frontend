import * as React from "react";
import { Button } from "semantic-ui-react";

export default class Page404 extends React.PureComponent<any, any> {
  render() {
    return (
      <div>
        <h1>404 Error | Page Not Found</h1>
        <Button
          onClick={() => {
            this.props.history.goBack();
          }}
          size="small"
        >
          Go Back
        </Button>
      </div>
    );
  }
}
