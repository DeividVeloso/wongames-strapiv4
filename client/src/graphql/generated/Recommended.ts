/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ENUM_COMPONENTPAGEHIGHLIGHT_ALIGNMENT } from "./globalTypes";

// ====================================================
// GraphQL query operation: Recommended
// ====================================================

export interface Recommended_recommended_section_highlight_background {
  __typename: "UploadFile";
  url: string;
}

export interface Recommended_recommended_section_highlight_floatImage {
  __typename: "UploadFile";
  url: string;
}

export interface Recommended_recommended_section_highlight {
  __typename: "ComponentPageHighlight";
  title: string;
  subtitle: string;
  background: Recommended_recommended_section_highlight_background | null;
  floatImage: Recommended_recommended_section_highlight_floatImage | null;
  buttonLabel: string;
  buttonLink: string;
  alignment: ENUM_COMPONENTPAGEHIGHLIGHT_ALIGNMENT | null;
}

export interface Recommended_recommended_section_games_cover {
  __typename: "UploadFile";
  url: string;
}

export interface Recommended_recommended_section_games_developers {
  __typename: "Developer";
  name: string;
}

export interface Recommended_recommended_section_games {
  __typename: "Game";
  name: string;
  slug: string | null;
  cover: Recommended_recommended_section_games_cover | null;
  developers: Recommended_recommended_section_games_developers[];
  price: number;
}

export interface Recommended_recommended_section {
  __typename: "ComponentPagePopularGames";
  title: string;
  highlight: Recommended_recommended_section_highlight | null;
  games: Recommended_recommended_section_games[];
}

export interface Recommended_recommended {
  __typename: "Recommended";
  section: Recommended_recommended_section | null;
}

export interface Recommended {
  recommended: Recommended_recommended | null;
}
