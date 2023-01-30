<div align="center">

# TS to GQL - EXPERIMENTAL - NOT USE IN PRODUCTION

![NPM package](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Testing-Library](https://img.shields.io/badge/-TestingLibrary-%23E33332?style=for-the-badge&logo=testing-library&logoColor=white)
![Eslint](https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E)

<a href="#" target="blank"></a>
</div>


## Introduction
this is experimental


[![Codacy Badge](https://app.codacy.com/project/badge/Grade/a8ab4191f9e94cec97c41ae83b1a1d7d)](https://www.codacy.com/gh/gabrielogregorio/ts-to-gql/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=gabrielogregorio/ts-to-gql&amp;utm_campaign=Badge_Grade)


[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/a8ab4191f9e94cec97c41ae83b1a1d7d)](https://www.codacy.com/gh/gabrielogregorio/ts-to-gql/dashboard?utm_source=github.com&utm_medium=referral&utm_content=gabrielogregorio/ts-to-gql&utm_campaign=Badge_Coverage)



### Common errors

types defined as
 createComment(_: unknown, commentInput: CommentCreateInput): Promise<GqlModelComments>;

replace this, to
 createComment: (_: unknown, commentInput: CommentCreateInput) => Promise<GqlModelComments>;


### Need create int, float, and other graphql types

type Int = number
type Float = number


### Create modules folder
