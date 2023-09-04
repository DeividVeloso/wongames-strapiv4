/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { WishlistInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: MutationCreateWishlist
// ====================================================

export interface MutationCreateWishlist_createWishlist_data_attributes_games_data_attributes_cover_data_attributes {
  __typename: "UploadFile";
  url: string;
}

export interface MutationCreateWishlist_createWishlist_data_attributes_games_data_attributes_cover_data {
  __typename: "UploadFileEntity";
  attributes: MutationCreateWishlist_createWishlist_data_attributes_games_data_attributes_cover_data_attributes | null;
}

export interface MutationCreateWishlist_createWishlist_data_attributes_games_data_attributes_cover {
  __typename: "UploadFileEntityResponse";
  data: MutationCreateWishlist_createWishlist_data_attributes_games_data_attributes_cover_data | null;
}

export interface MutationCreateWishlist_createWishlist_data_attributes_games_data_attributes_developers_data_attributes {
  __typename: "Developer";
  name: string;
}

export interface MutationCreateWishlist_createWishlist_data_attributes_games_data_attributes_developers_data {
  __typename: "DeveloperEntity";
  attributes: MutationCreateWishlist_createWishlist_data_attributes_games_data_attributes_developers_data_attributes | null;
}

export interface MutationCreateWishlist_createWishlist_data_attributes_games_data_attributes_developers {
  __typename: "DeveloperRelationResponseCollection";
  data: MutationCreateWishlist_createWishlist_data_attributes_games_data_attributes_developers_data[];
}

export interface MutationCreateWishlist_createWishlist_data_attributes_games_data_attributes {
  __typename: "Game";
  name: string;
  slug: string;
  cover: MutationCreateWishlist_createWishlist_data_attributes_games_data_attributes_cover | null;
  developers: MutationCreateWishlist_createWishlist_data_attributes_games_data_attributes_developers | null;
  price: number;
}

export interface MutationCreateWishlist_createWishlist_data_attributes_games_data {
  __typename: "GameEntity";
  id: string | null;
  attributes: MutationCreateWishlist_createWishlist_data_attributes_games_data_attributes | null;
}

export interface MutationCreateWishlist_createWishlist_data_attributes_games {
  __typename: "GameRelationResponseCollection";
  data: MutationCreateWishlist_createWishlist_data_attributes_games_data[];
}

export interface MutationCreateWishlist_createWishlist_data_attributes {
  __typename: "Wishlist";
  games: MutationCreateWishlist_createWishlist_data_attributes_games | null;
}

export interface MutationCreateWishlist_createWishlist_data {
  __typename: "WishlistEntity";
  id: string | null;
  attributes: MutationCreateWishlist_createWishlist_data_attributes | null;
}

export interface MutationCreateWishlist_createWishlist {
  __typename: "WishlistEntityResponse";
  data: MutationCreateWishlist_createWishlist_data | null;
}

export interface MutationCreateWishlist {
  createWishlist: MutationCreateWishlist_createWishlist | null;
}

export interface MutationCreateWishlistVariables {
  data: WishlistInput;
}
