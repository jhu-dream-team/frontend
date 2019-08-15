import * as React from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Checkbox,
  Container
} from "semantic-ui-react";
import { inject, observer } from "mobx-react";

@inject("gameStore")
@observer
class ScoreBoard extends React.PureComponent<any, any> {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    this.props.gameStore.getGame(this.props.gameId);
  }

  renderTableBanner = () => {
    return <h2>game: {this.state.game}</h2>;
  };

  renderTableColumns = () => {
    return (
      <tr>
        <th>Player</th>
        <th>round</th>
        <th>Score</th>
      </tr>
    );
  };

  rendertableRows = () => {
    return (
      <tr>
        <td>
          {this.state.players.map(function(name, index) {
            return <li key={index}>{name}</li>;
          })}
        </td>
        <td>{<li>{this.state.round}</li>}</td>
        <td>
          {this.state.scores.map(function(name, index) {
            return <li key={index}>{name}</li>;
          })}
        </td>
      </tr>
    );
  };

  render() {
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Player Name</Table.HeaderCell>
            <Table.HeaderCell>Score</Table.HeaderCell>l>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {!this.props.gameStore.loading ? (
            this.props.gameStore.game.scores
              .filter(x => x.round == this.state.game.round)
              .map(x => {
                return (
                  <Table.Row key={x.id}>
                    <Table.Cell>
                      {x.owner.firstName + x.owner.lastName}
                    </Table.Cell>
                    <Table.Cell>{x.value}</Table.Cell>
                  </Table.Row>
                );
              })
          ) : (
            <Table.Row>
              <Table.Cell>Loading...</Table.Cell>
              <Table.Cell>Loading...</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    );
  }
}

export default ScoreBoard;
