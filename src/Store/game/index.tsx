import { computed, observable, action } from "mobx";
import { persist } from "mobx-persist";
import ApolloClient from "../../Services/apollo";
import * as randomColor from "randomcolor";

const apolloClient = ApolloClient.getInstance();

export default class GameStore {
  private rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable loading = {
    list: false,
    entry: {
      id: "",
      value: false,
      button: ""
    },
    answer: false,
    game: false,
    vote: false
  };
  @observable errors: Array<String> = [];

  @persist @observable games = [];
  @observable game = null;

  @action
  async getGames() {
    this.errors = [];
    this.loading.list = true;
    const data = await apolloClient.queryGames().catch(err => {
      this.loading.list = false;
      this.errors.push(err);
    });
    await this.rootStore.questionCategoryStore.getQuestionCategories();
    this.games = data.data.Games.data;
    this.loading.list = false;
  }

  @action
  async getGame(id) {
    this.errors = [];
    this.loading.game = true;
    const data = await apolloClient.queryGame(id).catch(err => {
      this.loading.game = false;
      this.errors.push(err);
    });
    this.game = data.data.Game;
    this.loading.game = false;
  }

  @action
  async createGame(name, question_category_ids) {
    this.errors = [];
    this.loading.list = true;
    const data = await apolloClient
      .createGame(name, question_category_ids)
      .catch(err => {
        this.loading.list = false;
        this.errors.push(err);
      });
    this.games.push(data.data.createGame);
    this.loading.list = false;
  }

  @computed
  get freeSpins() {
    if (this.game == null) {
      return 0;
    } else {
      return this.game.free_spins.data.filter(
        x => x.owner.id == this.rootStore.userStore.profile.id
      )[0].value;
    }
  }

  @computed
  get wheelCategories() {
    var default_options = [
      {
        id: "opponent_choice",
        color: randomColor("red"),
        name: "Opponent's Choice"
      },
      {
        id: "player_choice",
        color: randomColor("green"),
        name: "Player's Choice"
      },
      {
        id: "double_score",
        color: randomColor("blue"),
        name: "Double Score"
      },
      {
        id: "bankrupt",
        color: randomColor("red"),
        name: "Bankrupt"
      },
      {
        id: "free_spin",
        color: randomColor("blue"),
        name: "Free Spin"
      },
      {
        id: "lose_turn",
        color: randomColor(),
        name: "Lose Turn"
      }
    ];
    if (this.game == null) {
      return default_options;
    }
    var question_categories = [];
    this.game.question_categories.data
      .slice(6 * (this.game.round - 1), 6 * this.game.round)
      .forEach(x => {
        x["color"] = randomColor();
        question_categories.push(x);
      });
    return default_options.concat(question_categories);
  }

  @action
  async joinGame(id) {
    this.errors = [];
    this.loading.game = id;
    this.loading.entry.value = true;
    this.loading.entry.button = "join";
    const data = await apolloClient.joinGame(id).catch(err => {
      this.loading.entry.id = "";
      this.loading.entry.value = false;
      this.loading.entry.button = "";
      this.errors.push(err);
    });
    if (data.data.joinGame.status == "Success") {
      await this.getGames();
      this.loading.entry.id = "";
      this.loading.entry.value = false;
      this.loading.entry.button = "";
    } else {
      this.loading.entry.id = "";
      this.loading.entry.value = false;
      this.loading.entry.button = "";
    }
  }

  async enterGame(id) {
    this.loading.entry.id = id;
    this.loading.entry.value = true;
    this.loading.entry.button = "enter";
    await this.getGame(id).then(() => {
      this.loading.entry.id = "";
      this.loading.entry.value = false;
      this.loading.entry.button = "";
      this.rootStore.routingStore.push(`/game/${id}`);
    });
  }

  async leaveGame(id) {
    this.loading.entry.id = id;
    this.loading.entry.value = true;
    this.loading.entry.button = "leave";
    const data = await apolloClient.leaveGame(id).catch(err => {
      this.loading.entry.id = "";
      this.loading.entry.value = false;
      this.loading.entry.button = "";
      this.errors.push(err);
    });
    if (data.data.joinGame.status == "Success") {
      await this.getGames();
      this.loading.entry.id = "";
      this.loading.entry.value = false;
      this.loading.entry.button = "";
    } else {
      this.loading.entry.id = "";
      this.loading.entry.value = false;
      this.loading.entry.button = "";
    }
  }

  async endTurn(id) {
    this.loading.entry.id = id;
    this.loading.entry.value = true;
    this.loading.entry.button = "end";
    const data = await apolloClient.endTurn(id).catch(err => {
      this.loading.entry.id = "";
      this.loading.entry.value = false;
      this.loading.entry.button = "";
      this.errors.push(err);
    });
    if (data.data.completeTurn.status == "Success") {
      this.game.spins += 1;
      this.game.sub_state = "Waiting";
      this.loading.entry.id = "";
      this.loading.entry.value = false;
      this.loading.entry.button = "";
    }
  }

  async spinWheel(id) {
    this.loading.entry.id = id;
    this.loading.entry.value = true;
    this.loading.entry.button = "spin";
    const data = await apolloClient.spinWheel(id).catch(err => {
      this.loading.entry.id = "";
      this.loading.entry.value = false;
      this.loading.entry.button = "";
      this.errors.push(err);
    });
    this.game.current_spin = data.data.spinWheel.current_spin;
    this.game.sub_state = data.data.spinWheel.sub_state;
    this.loading.entry.id = "";
    this.loading.entry.value = false;
    this.loading.entry.button = "";
  }

  async submitVote(bool) {
    this.loading.vote = true;
    const data = await apolloClient
      .submitVote(this.game.id, bool)
      .catch(err => {
        this.loading.vote = false;
        this.errors.push(err);
      });
    if (data.data.voteAnswer.status == "Success") {
      this.loading.answer = false;
      this.game.sub_state = "Awaiting Completion By Player";
    }
  }

  async submitAnswer(answer) {
    this.loading.answer = true;
    const data = await apolloClient
      .submitAnswer(this.game.id, answer)
      .catch(err => {
        this.loading.answer = false;
        this.errors.push(err);
      });
    this.loading.answer = false;
    this.game.sub_state = "Voting";
  }

  async startGame(id) {
    this.loading.entry.id = id;
    this.loading.entry.value = true;
    this.loading.entry.button = "start";
    const data = await apolloClient.startGame(id).catch(err => {
      this.loading.entry.id = "";
      this.loading.entry.value = false;
      this.loading.entry.button = "";
      this.errors.push(err);
    });
    if (data.data.startGame.status == "Success") {
      await this.getGames();
      this.loading.entry.id = "";
      this.loading.entry.value = false;
      this.loading.entry.button = "";
    } else {
      this.loading.entry.id = "";
      this.loading.entry.value = false;
      this.loading.entry.button = "";
    }
  }
}
