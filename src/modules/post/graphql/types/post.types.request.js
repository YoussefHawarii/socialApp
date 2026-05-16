//this file is for type of args of resolver

import { GraphQLID, GraphQLNonNull } from "graphql";

export const onePostRequest = { id: { type: new GraphQLNonNull(GraphQLID) } };
