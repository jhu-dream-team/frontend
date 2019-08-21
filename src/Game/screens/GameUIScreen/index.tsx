import * as React from "react";
import { Button, Label } from "semantic-ui-react";
import { inject, observer } from "mobx-react";
import AnswerModal from "../../components/AnswerModal";
import VotingModal from "../../components/VotingModal";
import ScoreBoard from "../../components/ScoreBoard";
import Wheel from "../../components/Wheel";
import ChoiceModal from "../../components/ChoiceModal";
import JeopardyBoard from "../../components/JeopardyBoard";
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

  async spinWheel() {
    await this.props.rootStore.gameStore.spinWheel(this.props.match.params.id);
  }

  async endTurn() {
    await this.props.rootStore.gameStore.endTurn(this.props.match.params.id);
  }

  render() {
    return (
      <div className={styles["game"]}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          {this.props.rootStore.gameStore.game != null &&
          this.props.rootStore.gameStore.game.sub_state == "Answering" ? (
            <AnswerModal />
          ) : null}
          {this.props.rootStore.gameStore.game != null &&
          this.props.rootStore.gameStore.game.sub_state == "Voting" &&
          this.props.rootStore.gameStore.game.players.data[
            this.props.rootStore.gameStore.game.spins %
              this.props.rootStore.gameStore.game.players.data.length
          ].id != this.props.rootStore.userStore.profile.id &&
          !this.props.rootStore.gameStore.game.answers.data[
            this.props.rootStore.gameStore.game.answers.data
              .map(x => x.question.id)
              .indexOf(this.props.rootStore.gameStore.game.selected_question.id)
          ].votes
            .map(x => x.owner.id)
            .includes(this.props.rootStore.userStore.id) ? (
            <VotingModal />
          ) : null}
          {(this.props.rootStore.gameStore.game != null &&
            (this.props.rootStore.gameStore.game.sub_state == "Player Choice" &&
              this.props.rootStore.gameStore.game.players.data[
                this.props.rootStore.gameStore.game.spins %
                  this.props.rootStore.gameStore.game.players.data.length
              ].id == this.props.rootStore.userStore.profile.id)) ||
          (this.props.rootStore.gameStore.game != null &&
            this.props.rootStore.gameStore.game.sub_state ==
              "Opponent Choice" &&
            this.props.rootStore.gameStore.game.players.data[
              (this.props.rootStore.gameStore.game.spins + 1) %
                this.props.rootStore.gameStore.game.players.data.length
            ].id == this.props.rootStore.userStore.profile.id) ? (
            <ChoiceModal />
          ) : null}
          {this.props.rootStore.gameStore.game != null ? (
            this.props.rootStore.gameStore.game.selected_question == null ? (
              <Wheel />
            ) : (
              <JeopardyBoard />
            )
          ) : null}
          <ScoreBoard gameId={this.props.match.params.id} />
        </div>
        {this.props.rootStore.gameStore.game != null &&
        this.props.rootStore.gameStore.game.sub_state == "Voting" ? (
          <div style={{ textAlign: "center" }}>Voting in progress...</div>
        ) : null}
        {this.props.rootStore.gameStore.game != null ? (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              paddingTop: 12,
              paddingBottom: 8,
              paddingLeft: 16,
              paddingRight: 16,
              borderRadius: 4,
              alignSelf: "center",
              display: "flex",
              backgroundColor: "#ccc"
            }}
          >
            {this.props.rootStore.gameStore.game.players.data[
              this.props.rootStore.gameStore.game.spins %
                this.props.rootStore.gameStore.game.players.data.length
            ].id == this.props.rootStore.userStore.profile.id ? (
              <Button
                disabled={
                  this.props.rootStore.gameStore.game.sub_state != "Waiting"
                }
                size={"huge"}
                color="green"
                onClick={() => this.spinWheel()}
              >
                Spin
              </Button>
            ) : null}
            <Button as="div" labelPosition={"right"}>
              <Button
                size={"huge"}
                color="pink"
                loading={
                  this.props.rootStore.gameStore.loading.entry.button ==
                  "free_spin"
                }
                disabled={
                  this.props.rootStore.gameStore.freeSpins == 0 ||
                  this.props.rootStore.gameStore.game.players.data[
                    this.props.rootStore.gameStore.game.spins %
                      this.props.rootStore.gameStore.game.players.data.length
                  ].id != this.props.rootStore.userStore.profile.id ||
                  (this.props.rootStore.gameStore.game.current_spin !=
                    "lose_turn" &&
                    (this.props.rootStore.gameStore.game.selected_question ==
                      null ||
                      this.props.rootStore.gameStore.answers.data.filter(
                        x =>
                          x.question.id ==
                          this.props.rootStore.gameStore.game.selected_question
                            .id
                      ).award == 0))
                }
                onClick={() => this.props.rootStore.gameStore.useFreeSpin()}
              >
                Use Free Spin
              </Button>
              <Label size={"huge"} as="a" basic pointing={"left"}>
                {this.props.rootStore.gameStore.freeSpins}
              </Label>
            </Button>
            {this.props.rootStore.gameStore.game.sub_state == "Answering" &&
            this.props.rootStore.gameStore.game.players.data[
              this.props.rootStore.gameStore.game.spins %
                this.props.rootStore.gameStore.game.players.data.length
            ].id == this.props.rootStore.userStore.profile.id ? (
              <Button size={"huge"} color={"blue"}>
                Answer
              </Button>
            ) : null}
            {(this.props.rootStore.gameStore.game.sub_state ==
              "Player Choice" &&
              this.props.rootStore.gameStore.game.players.data[
                this.props.rootStore.gameStore.game.spins %
                  this.props.rootStore.gameStore.game.players.data.length
              ].id == this.props.rootStore.userStore.profile.id) ||
            (this.props.rootStore.gameStore.game.sub_state ==
              "Opponent Choice" &&
              this.props.rootStore.gameStore.game.players.data[
                (this.props.rootStore.gameStore.game.spins + 1) %
                  this.props.rootStore.gameStore.game.players.data.length
              ].id == this.props.rootStore.userStore.profile.id) ||
            (this.props.rootStore.gameStore.game.sub_state == "Voting" &&
              this.props.rootStore.gameStore.game.players.data[
                this.props.rootStore.gameStore.game.spins %
                  this.props.rootStore.gameStore.game.players.data.length
              ].id != this.props.rootStore.userStore.profile.id) ? (
              <Button size={"huge"} color={"purple"}>
                Vote
              </Button>
            ) : null}
            {this.props.rootStore.gameStore.game.players.data[
              this.props.rootStore.gameStore.game.spins %
                this.props.rootStore.gameStore.game.players.data.length
            ].id == this.props.rootStore.userStore.profile.id ? (
              <Button
                disabled={
                  this.props.rootStore.gameStore.game.sub_state !=
                    "Awaiting Completion By Player" ||
                  this.props.rootStore.gameStore.game.players.data[
                    this.props.rootStore.gameStore.game.spins %
                      this.props.rootStore.gameStore.game.players.data.length
                  ].id != this.props.rootStore.userStore.profile.id
                }
                onClick={() => this.endTurn()}
                size={"huge"}
                color={"red"}
              >
                {" "}
                End Turn
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }
}

export default GameUI;
