import { createApolloFetch } from "apollo-fetch";
import * as firebase from "firebase";

export default class ApolloClient {
  constructor(props) {
    ApolloClient.instance = this;
    const uri =
      " https://us-central1-wheelofjeopardy.cloudfunctions.net/api/graphql";
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
  queryScore() {
    let queryBody = `
    query {
      Scores(limit: 9999) {
        data{
        value
        game{
          id
          round
          name
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
      Game(id: "KAgZF7kr9O6eG9O28Vl4"){
        id
        name
        state
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
}
