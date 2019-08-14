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
class ScoreBoard extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
        game: null,
        round: null,
        players: [],
        scores: []
    };
  }

  async componentDidMount() {
    this.props.gameStore.getScores();
  }
  //can bw called to update the state
  boardSetState = () => {
    this.setState({
        game:null,
        round:null,
        player:[],
        scores:[]
    })
  
}

  renderTableBanner = () => {
    return (
        <h2>game: {this.state.game}</h2>
    )

  }

  renderTableColumns = () => {
   return(
        <tr>
            <th>Player</th>
            <th>round</th>
            <th>Score</th>
        </tr>
   )
 }

 rendertableRows = () => {
    return(
        <tr>
            <td>
                {
                    this.state.players.map(
                            function(name, index){
                                return <li key={ index }>{name}</li>;
                            }
                    )
                }
            </td>
            <td>
                {
                    <li>{this.state.round}</li>
                }
            </td>
            <td>
                {
                    this.state.scores.map(
                            function(name, index){
                                return <li key={ index }>{name}</li>;
                            }
                    )
                }
            </td>
      </tr>

     )

 }


  render() {
    return (
        <div>
            <h1 id=''>{this.state.renderTableBanner()}</h1>
            <table id=''>
                {this.state.renderTableColumns()}
                {this.state.rendertableRows()}
            </table>
        </div>
    );
  }
}

export default ScoreBoard;
