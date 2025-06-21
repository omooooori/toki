import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Query {
    hello: String
    health: HealthStatus
  }

  type Mutation {
    echo(message: String!): String
  }

  type HealthStatus {
    status: String!
    timestamp: String!
  }
`; 