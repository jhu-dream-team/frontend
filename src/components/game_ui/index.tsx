import * as React from "react";
import { inject, observer } from "mobx-react";
import ScoreBoard from "../scoreboard/ScoreBoard";
import QuestionCategorySelector from "../question_category_selector";
import { Button } from "semantic-ui-react";

@inject("rootStore")
@observer
class GameUI extends React.Component<any, any> {
  private game_service;
  private question_service;

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1> Game UI </h1>
        <ScoreBoard gameId={this.props.match.params.id} />
        <QuestionCategorySelector gameId={this.props.match.params.id} />
      </div>
    );
  }
}

export default GameUI;
