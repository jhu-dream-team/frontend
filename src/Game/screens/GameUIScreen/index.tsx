import * as React from "react";
import { inject, observer } from "mobx-react";
import ScoreBoard from "../../components/ScoreBoard";
import Wheel from "../../components/Wheel";
const styles = require("./styles.scss");

@inject("rootStore")
@observer
class GameUI extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (!this.props.rootStore.gameStore.loading.game) {
      this.props.rootStore.gameStore.getGame(this.props.match.params.id);
    }
  }

  render() {
    return (
      <div className={styles["game"]}>
        {this.props.rootStore.gameStore.game != null ? <Wheel /> : null}
        <ScoreBoard gameId={this.props.match.params.id} />
      </div>
    );
  }
}

export default GameUI;
