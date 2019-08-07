import * as React from "react";
import { inject, observer } from "mobx-react";
import GameService from "../../services/game";
import QuestionService from "../../services/question";

@observer
@inject("authStore")
class GameUI extends React.Component<any, any> {
  private game_service;
  private question_service;

  constructor(props) {
    super(props);
    this.state = {};
    this.game_service = new GameService(
      "http://localhost:5000",
      props.authStore
    );
    this.question_service = new QuestionService(
      "http://localhost:5000",
      props.authStore
    );
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
