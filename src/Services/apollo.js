import { createApolloFetch } from "apollo-fetch";
import * as firebase from "firebase";

export default class ApolloClient {
  constructor(props) {
    ApolloClient.instance = this;
    const uri =
      "https://us-central1-wheelofjeopardy.cloudfunctions.net/api/graphql";
    this.client = createApolloFetch({ uri });
    this.client.use(async ({ request, options }, next) => {
      if (!options.headers) {
        options.headers = {};
      }
      var token = localStorage.getItem("token");
      options.headers["authorization"] = "Bearer " + token;
      next();
    });
  }

  static getInstance() {
    if (!ApolloClient.instance) {
      ApolloClient.instance = new ApolloClient();
    }
    return ApolloClient.instance;
  }

  query(query, variables) {
    variables = variables || {};
    return ApolloClient.instance
      .client({ query, variables })
      .then(value => {
        return value;
      })
      .catch(err => {
        throw err;
      });
  }

  endTurn(id) {
    let queryBody = `
    mutation {
      completeTurn(id: "${id}"){
        status
        message
        code
      }
    }
    `;
    return this.query(queryBody);
  }

  queryGame(id) {
    let queryBody = `
    query {
      Game(id: "${id}") {
        id
        round
        current_spin
        spins
        sub_state
        free_spins(limit: 9999) {
          data {
            owner {
              id
            }
            value
          }
        }
        question_categories(limit: 9999) {
          data {
            id
            name
          }
        }
        players(limit: 9999) {
          data {
            id
          }
        },
        scores(limit: 9999) {
          data {
            id
            type
            round
            value
            owner {
              id
              firstName
              lastName
            }
          }
        }
      }
    }
    `;
    return this.query(queryBody);
  }

  queryGames() {
    let queryBody = `
    query {
      Games(limit: 9999){
        data {
         id
         name
         state
         players(limit: 9999) {
          count
          data {
            id
          }
         }
         owner {
           id
         }
        }
      }
    }
    `;
    return this.query(queryBody);
  }

  queryProfile() {
    let queryBody = `
    {
      Profile {
          id
          firstName
          lastName
          email
          profileImg
      }
    }
    `;
    return this.query(queryBody);
  }

  setDeviceToken(deviceToken) {
    let queryBody = `
    mutation {
      updateDeviceToken(deviceToken: "${deviceToken}"){
          status
          message
          code
      }
    }
    `;
    return this.query(queryBody);
  }

  joinGame(id) {
    let queryBody = `
    mutation {
      joinGame(id: "${id}"){
        status
        message
        code
      }
    }
    `;
    return this.query(queryBody);
  }

  leaveGame(id) {
    let queryBody = `
    mutation {
      leaveGame(id: "${id}"){
        status
        message
        code
      }
    }
    `;
    return this.query(queryBody);
  }

  startGame(id) {
    let queryBody = `
    mutation {
      startGame(id: "${id}"){
        status
        message
        code
      }
    }
    `;
    return this.query(queryBody);
  }

  queryQuestionCategories() {
    let queryBody = `
    query {
      QuestionCategories(limit: 9999){
        data {
          id
          name
          questions(limit: 9999) {
            count
          }
          updatedAt
          owner {
            id
          }
        }
      }
    }
    `;
    return this.query(queryBody);
  }

  queryQuestionCategory(id) {
    let queryBody = `
    query {
      QuestionCategory(id: "${id}"){
        id
        name
        questions(limit: 9999) {
          data {
            id
            question
            suggested_answer
            max_points
            owner {
              id
            }
          }
        }
        owner {
          id
        }
      }
    }
    `;
    return this.query(queryBody);
  }

  createQuestion(question, suggested_answer, max_points, question_category_id) {
    let queryBody = `
    mutation {
      createQuestion(question: "${question}", suggested_answer: "${suggested_answer}", max_points: ${max_points}, question_category_id: "${question_category_id}"){
        id
        question
        suggested_answer
        max_points
        owner {
          id
        }
      }
    }
    `;
    return this.query(queryBody);
  }

  createQuestionCategory(name) {
    let queryBody = `
    mutation {
      createQuestionCategory(name: "${name}"){
        id
        name
        questions(limit: 9999) {
          count
        }
        updatedAt
        owner {
          id
        }
      }
    }
    `;
    return this.query(queryBody);
  }

  spinWheel(id) {
    let queryBody = `
    mutation {
      spinWheel(id: "${id}"){
        id
        round
        current_spin
        spins
        sub_state
        question_categories(limit: 9999) {
          data {
            id
            name
          }
        }
        free_spins(limit: 9999) {
          data {
            owner {
              id
            }
            value
          }
        }
        players(limit: 9999) {
          data {
            id
          }
        },
        scores(limit: 9999) {
          data {
            id
            type
            round
            value
            owner {
              firstName
              lastName
            }
          }
        }
      }
    }
    `;
    return this.query(queryBody);
  }

  createGame(name, question_set_ids) {
    let queryBody = `
      mutation($question_set_ids: [String]!) {
        createGame(name: "${name}", question_categories: $question_set_ids){
          id
         name
         state
         players(limit: 9999) {
          count
          data {
            id
          }
         }
         owner {
           id
         }
        }
      }
    `;
    return this.query(queryBody, { question_set_ids: question_set_ids });
  }
}
