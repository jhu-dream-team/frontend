import * as React from "react";
import { inject, observer } from "mobx-react";
import  ScoreBoard from "../scoreboard/ScoreBoard";
import { Button } from "semantic-ui-react";

@inject("rootStore")
@observer
class GameUI extends React.Component<any, any> {
  private game_service;
  private question_service;

  constructor(props) {
    super(props);
    this.state = {
      game: null,
      gameId: null
    };
  }

  render() {
    return (
    
      <div>
        <h1> Game UI </h1>
        <ScoreBoard gameId={this.state.gameId} />
      </div>
    );
  }
}

export default GameUI;
