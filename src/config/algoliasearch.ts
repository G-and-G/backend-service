/* eslint-disable @typescript-eslint/no-non-null-assertion */
import algoliasearch from 'algoliasearch';
import config from '.';

export const algoliaClient = algoliasearch(
  config().algolia.appId!,
  config().algolia.apiKey!,
);
