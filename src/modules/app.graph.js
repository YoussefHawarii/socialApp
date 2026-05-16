import { graphql, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import { postQuery } from "./post/graphql/post.query.js";

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "SocialAppQuery",
    description: "main application query",
    fields: {
      //get post(s)
      ...postQuery,
    },
  }),
});
