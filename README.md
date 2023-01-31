<div align="center">

# TS to GQL - **BETA PROJECT**

![NPM package](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Testing-Library](https://img.shields.io/badge/-TestingLibrary-%23E33332?style=for-the-badge&logo=testing-library&logoColor=white)
![Eslint](https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E)

<a href="#" target="blank"></a>
</div>

## Introduction
Generate graphql types based on your typescript types.

💻 🚀 [Api example here](https://github.com/gabrielogregorio/ts-to-gql-example)  🚀 💻

<div align="center">

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/a8ab4191f9e94cec97c41ae83b1a1d7d)](https://www.codacy.com/gh/gabrielogregorio/ts-to-gql/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=gabrielogregorio/ts-to-gql&amp;utm_campaign=Badge_Grade)  [![Codacy Badge](https://app.codacy.com/project/badge/Coverage/a8ab4191f9e94cec97c41ae83b1a1d7d)](https://www.codacy.com/gh/gabrielogregorio/ts-to-gql/dashboard?utm_source=github.com&utm_medium=referral&utm_content=gabrielogregorio/ts-to-gql&utm_campaign=Badge_Coverage)
</div>



### Example

```ts
// ./src/models/post.ts
export type GqlModelPostSelect = {
  id: string;
  body?: string;
};

// ./src/graphql/resolvers/mutations/post.ts
import { GqlModelPostSelect } from '@/models/Post';

interface CreatePostPayload {
  createPostPayload: {
    body: string;
  };
}

type GqlMutationPost = {
  createPost: (
    _: unknown,
    createPostPayload: CreatePostPayload
  ) => Promise<GqlModelPostSelect>;
};

export const MutationPostResolver: GqlMutationPost = {
  // code resolvers
}
```
Configure running search and generate schema

```ts
import { searchGqlSchemaAndBuild } from 'ts-to-gql';

const getGraphqlSchema = (): string => fsNode.readFileSync('./schema.graphql', 'utf8').toString();

searchGqlSchemaAndBuild({
  isProduction: false,
  pathScanProject: './src',
});

this.server = new ApolloServer<MyContext>({
  resolvers,
  typeDefs: getGraphqlSchema(),
});
```

And magic, your types in graphql

```gql
type PostSelect  {
  id: String!
  body: String
};

interface CreatePostPayload {
  createPostPayload: {
    body: string;
  };
}

type Mutation {
  createPost(createPostPayload: CreatePostPayload): PostSelect!
}
```
## Options searchGqlSchemaAndBuild
| command |  example | description  |
|---------|----------|--------------|
| (required) isProduction | true or false | true not generate schema, use schema versioned |
| (required) pathScanProject | './src' | path to search models, queries and mutations |
| pathSaveSchema |  './schema.graphql' |  path to save schema |
| prefixModel | 'GqlModel' | prefix to search models |
| prefixMutation | 'GqlMutation' | prefix to search mutations |
| prefixQuery | 'GqlQuery' | prefix to find queries |
| removePrefixFromSchema | true or false | if true, remove prefix schema in final schema |
|  fixSchema | (schemaGql: string): string => schemaGql | function to fix schema, add new values or modify existents |

## Special types

if need use Float, Int, ID or similar, import special types from 'ts-to-gql'
```ts
import {  Int, ID, DateTime, Float } from 'ts-to-gql';
```

Int, Float is string, DateTime is Date, and ID is string

## Common errors on migration

Migration is manual, for now.

1. Not use Partial, extends, implements, or advanced typescript. for now

2. use types, not interfaces (for now)

3. define contexts and trash, ts-to-gql use only second param, this

```ts
type GqlMutationPost = {
 createPost: (input: CreatePost) => Promise<GqlModePost>;
}
```
to

```ts
type GqlMutationPost = {
 createPost: (_: unknown, input: CreatePost) => Promise<GqlModePost>;
}
```
--------


4. replace your resolver to arrow types, this
```ts
type GqlMutationPost = {
 createPost(_: unknown, input: CreatePost): Promise<GqlModePost>;
}
```
to

```ts
type GqlMutationPost = {
 createPost: (_: unknown, input: CreatePost) => Promise<GqlModePost>;
}
```

5. use prefix, for ts-to-gql find your models, queries and mutations (other not necessary)
```ts
type MyPost = {}
```
to

```ts
type GqlMutationMyPost = {}
```


