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
    this.state = {
      game: null
    };
    this.game_service = new GameService(
      "http://localhost:5000",
      props.authStore
    );
    this.question_service = new QuestionService(
      "http://localhost:5000",
      props.authStore
    );
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    var result = await this.game_service
      .get_game(id)
      .catch(err => console.log(err));
    this.setState(
      {
        ...this.state,
        game: result
      },
      () => console.log(this.state)
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
