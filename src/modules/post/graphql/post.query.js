import { graphql, GraphQLBoolean, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import * as postService from "./post.graph.service.js";
import { allPostsResponse, OnePostResponse } from "./types/post.types.response.js";
import { onePostRequest } from "./types/post.types.request.js";
import { isAuthenticated } from "../../../graphql/authentication.js";
import { onePostSchema } from "./post.graphql.validation.js";
import { validation } from "../../../graphql/validation.js";
import { allMiddleware } from "../../../graphql/allFunctions.js";

export const postQuery = {
  onePost: {
    type: new GraphQLObjectType({
      name: "onePostResponse",
      fields: {
        success: { type: GraphQLBoolean },
        statusCode: { type: GraphQLInt },
        results: { type: OnePostResponse },
      },
    }),
    args: onePostRequest,
    resolve: allMiddleware(isAuthenticated(["admin"]), validation(onePostSchema), postService.onePost),
  },
  allPosts: {
    type: new GraphQLObjectType({
      name: "PostsResponse",
      fields: {
        success: { type: GraphQLBoolean },
        statusCode: { type: GraphQLInt },
        results: { type: allPostsResponse },
      },
    }),
    resolve: isAuthenticated(postService.allPosts),
  },
};
