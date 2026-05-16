import { graphql, GraphQLBoolean, GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { imageType } from "../../../../utils/graphql/image.type.js";
import { oneUserResponse } from "../../../user/graphql/user.types.response.js";

export const OnePostResponse = new GraphQLObjectType({
  name: "onePost",
  fields: {
    text: { type: GraphQLString },
    images: {
      type: new GraphQLList(imageType),
    },
    // user: { type: GraphQLID },
    user: { type: oneUserResponse },
    likes: { type: new GraphQLList(GraphQLID) },
    isDeleted: { type: GraphQLBoolean },
    deletedBy: { type: GraphQLID },
    _id: { type: GraphQLID },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  },
});

export const allPostsResponse = new GraphQLList(OnePostResponse);
