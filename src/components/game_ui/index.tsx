import * as React from "react";
import { inject, observer } from "mobx-react";

@inject("rootStore")
@observer
class GameUI extends React.Component<any, any> {
  private game_service;
  private question_service;

  constructor(props) {
    super(props);
    this.state = {
      game: null
    };
  }

  render() {
    return (
      <div>
        <h1> Game UI </h1>
      </div>
    );
  }
}

export default GameUI;
