import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";
import { imageType } from "../../../utils/graphql/image.type.js";

export const oneUserResponse = new GraphQLObjectType({
  name: "oneUser",
  fields: {
    email: { type: GraphQLString },
    userName: { type: GraphQLString },
    profilePicture: { type: imageType },
    _id: { type: GraphQLID },
  },
});
