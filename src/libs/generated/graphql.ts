import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Upload: any;
  DateTime: any;
};



export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  forename: Scalars['String'];
  lastname: Scalars['String'];
  avatar?: Maybe<Scalars['String']>;
  birthname?: Maybe<Scalars['String']>;
  birthdate?: Maybe<Scalars['DateTime']>;
  dayOfDeath?: Maybe<Scalars['DateTime']>;
  bio?: Maybe<Scalars['String']>;
  marriages?: Maybe<Array<Maybe<Marriage>>>;
  marriagesWithUsers?: Maybe<Array<Maybe<User>>>;
  parents?: Maybe<Array<Maybe<User>>>;
  children?: Maybe<Array<Maybe<User>>>;
  places?: Maybe<Array<Maybe<Place>>>;
};

export type File = {
  __typename?: 'File';
  filename: Scalars['String'];
  mimetype: Scalars['String'];
  encoding: Scalars['String'];
};

export type Place = {
  __typename?: 'Place';
  id: Scalars['ID'];
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  User?: Maybe<Array<User>>;
};

export type Marriage = {
  __typename?: 'Marriage';
  id: Scalars['ID'];
  users: Array<Maybe<User>>;
};

export type Query = {
  __typename?: 'Query';
  allUsers?: Maybe<Array<Maybe<User>>>;
  findUserById?: Maybe<User>;
  allMarriages?: Maybe<Array<Maybe<Marriage>>>;
  findMarriageById?: Maybe<Marriage>;
  findAvatarByUserId?: Maybe<File>;
};


export type QueryFindUserByIdArgs = {
  id: Scalars['ID'];
};


export type QueryFindMarriageByIdArgs = {
  id: Scalars['ID'];
};


export type QueryFindAvatarByUserIdArgs = {
  id?: Maybe<Scalars['ID']>;
};

export type InputUserId = {
  id: Scalars['ID'];
};

export type InputMarriageId = {
  id: Scalars['ID'];
};

export type InputMarriageWithUserId = {
  id: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser: User;
  updateUser?: Maybe<User>;
  deleteUser?: Maybe<User>;
  createMarriage: Marriage;
  uploadAvatar: File;
  uploadImage: File;
  uploadBio: File;
};


export type MutationCreateUserArgs = {
  forename: Scalars['String'];
  lastname: Scalars['String'];
  avatar?: Maybe<Scalars['String']>;
  birthname?: Maybe<Scalars['String']>;
  birthdate?: Maybe<Scalars['DateTime']>;
  dayOfDeath?: Maybe<Scalars['DateTime']>;
  bio?: Maybe<Scalars['String']>;
  marriages?: Maybe<Array<Maybe<InputMarriageId>>>;
  marriageWithUserId?: Maybe<Array<Maybe<InputMarriageWithUserId>>>;
  parents?: Maybe<Array<Maybe<InputUserId>>>;
  children?: Maybe<Array<Maybe<InputUserId>>>;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID'];
  forename?: Maybe<Scalars['String']>;
  lastname?: Maybe<Scalars['String']>;
  avatar?: Maybe<Scalars['String']>;
  birthname?: Maybe<Scalars['String']>;
  birthdate?: Maybe<Scalars['DateTime']>;
  dayOfDeath?: Maybe<Scalars['DateTime']>;
  bio?: Maybe<Scalars['String']>;
  marriages?: Maybe<Array<Maybe<InputMarriageId>>>;
  marriageWithUserId?: Maybe<Array<Maybe<InputMarriageWithUserId>>>;
  parents?: Maybe<Array<Maybe<InputUserId>>>;
  children?: Maybe<Array<Maybe<InputUserId>>>;
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID'];
};


export type MutationCreateMarriageArgs = {
  users: Array<Maybe<InputUserId>>;
};


export type MutationUploadAvatarArgs = {
  file: Scalars['Upload'];
  userId: Scalars['ID'];
};


export type MutationUploadImageArgs = {
  file: Scalars['Upload'];
  userId: Scalars['ID'];
  description?: Maybe<Scalars['String']>;
};


export type MutationUploadBioArgs = {
  file: Scalars['Upload'];
  userId: Scalars['ID'];
};

export type MarriageFieldsFragment = (
  { __typename?: 'Marriage' }
  & Pick<Marriage, 'id'>
  & { users: Array<Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id'>
  )>> }
);

export type UserFieldsFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'avatar' | 'forename' | 'lastname' | 'birthname' | 'birthdate' | 'dayOfDeath' | 'bio'>
  & { parents?: Maybe<Array<Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id'>
  )>>>, children?: Maybe<Array<Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id'>
  )>>>, marriages?: Maybe<Array<Maybe<(
    { __typename?: 'Marriage' }
    & Pick<Marriage, 'id'>
    & { users: Array<Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id'>
    )>> }
  )>>>, marriagesWithUsers?: Maybe<Array<Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id'>
  )>>> }
);

export type FileFieldsFragment = (
  { __typename?: 'File' }
  & Pick<File, 'filename' | 'mimetype' | 'encoding'>
);

export type FindUserByIdQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type FindUserByIdQuery = (
  { __typename?: 'Query' }
  & { findUserById?: Maybe<(
    { __typename?: 'User' }
    & UserFieldsFragment
  )> }
);

export type AllMarriagesQueryVariables = Exact<{ [key: string]: never; }>;


export type AllMarriagesQuery = (
  { __typename?: 'Query' }
  & { allMarriages?: Maybe<Array<Maybe<(
    { __typename?: 'Marriage' }
    & MarriageFieldsFragment
  )>>> }
);

export type FindAvatarByUserIdQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type FindAvatarByUserIdQuery = (
  { __typename?: 'Query' }
  & { findAvatarByUserId?: Maybe<(
    { __typename?: 'File' }
    & FileFieldsFragment
  )> }
);

export type AllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type AllUsersQuery = (
  { __typename?: 'Query' }
  & { allUsers?: Maybe<Array<Maybe<(
    { __typename?: 'User' }
    & UserFieldsFragment
  )>>> }
);

export type FindMarriageByIdQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type FindMarriageByIdQuery = (
  { __typename?: 'Query' }
  & { findMarriageById?: Maybe<(
    { __typename?: 'Marriage' }
    & MarriageFieldsFragment
  )> }
);

export type CreateUserMutationVariables = Exact<{
  forename: Scalars['String'];
  lastname: Scalars['String'];
  birthname?: Maybe<Scalars['String']>;
  birthdate?: Maybe<Scalars['DateTime']>;
  dayOfDeath?: Maybe<Scalars['DateTime']>;
  bio?: Maybe<Scalars['String']>;
  marriages?: Maybe<Array<Maybe<InputMarriageId>>>;
  marriageWithUserId?: Maybe<Array<Maybe<InputMarriageWithUserId>>>;
  parents?: Maybe<Array<Maybe<InputUserId>>>;
  children?: Maybe<Array<Maybe<InputUserId>>>;
}>;


export type CreateUserMutation = (
  { __typename?: 'Mutation' }
  & { createUser: (
    { __typename?: 'User' }
    & UserFieldsFragment
  ) }
);

export type CreateMarriageMutationVariables = Exact<{
  users: Array<Maybe<InputUserId>>;
}>;


export type CreateMarriageMutation = (
  { __typename?: 'Mutation' }
  & { createMarriage: (
    { __typename?: 'Marriage' }
    & MarriageFieldsFragment
  ) }
);

export type UpdateUserMutationVariables = Exact<{
  id: Scalars['ID'];
  forename: Scalars['String'];
  lastname: Scalars['String'];
  birthname?: Maybe<Scalars['String']>;
  birthdate?: Maybe<Scalars['DateTime']>;
  dayOfDeath?: Maybe<Scalars['DateTime']>;
  bio?: Maybe<Scalars['String']>;
  marriages?: Maybe<Array<Maybe<InputMarriageId>>>;
  marriageWithUserId?: Maybe<Array<Maybe<InputMarriageWithUserId>>>;
  parents?: Maybe<Array<Maybe<InputUserId>>>;
  children?: Maybe<Array<Maybe<InputUserId>>>;
}>;


export type UpdateUserMutation = (
  { __typename?: 'Mutation' }
  & { updateUser?: Maybe<(
    { __typename?: 'User' }
    & UserFieldsFragment
  )> }
);

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteUserMutation = (
  { __typename?: 'Mutation' }
  & { deleteUser?: Maybe<(
    { __typename?: 'User' }
    & UserFieldsFragment
  )> }
);

export type UploadAvatarMutationVariables = Exact<{
  file: Scalars['Upload'];
  userId: Scalars['ID'];
}>;


export type UploadAvatarMutation = (
  { __typename?: 'Mutation' }
  & { uploadAvatar: (
    { __typename?: 'File' }
    & FileFieldsFragment
  ) }
);

export const MarriageFieldsFragmentDoc: DocumentNode<MarriageFieldsFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MarriageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Marriage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]};
export const UserFieldsFragmentDoc: DocumentNode<UserFieldsFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"forename"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"birthname"}},{"kind":"Field","name":{"kind":"Name","value":"birthdate"}},{"kind":"Field","name":{"kind":"Name","value":"dayOfDeath"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"parents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"marriages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"marriagesWithUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]};
export const FileFieldsFragmentDoc: DocumentNode<FileFieldsFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FileFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"File"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"mimetype"}},{"kind":"Field","name":{"kind":"Name","value":"encoding"}}]}}]};
export const FindUserByIdDocument: DocumentNode<FindUserByIdQuery, FindUserByIdQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findUserById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findUserById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}}]}},...UserFieldsFragmentDoc.definitions]};
export const AllMarriagesDocument: DocumentNode<AllMarriagesQuery, AllMarriagesQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"allMarriages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allMarriages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MarriageFields"}}]}}]}},...MarriageFieldsFragmentDoc.definitions]};
export const FindAvatarByUserIdDocument: DocumentNode<FindAvatarByUserIdQuery, FindAvatarByUserIdQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findAvatarByUserId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findAvatarByUserId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileFields"}}]}}]}},...FileFieldsFragmentDoc.definitions]};
export const AllUsersDocument: DocumentNode<AllUsersQuery, AllUsersQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"allUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}}]}},...UserFieldsFragmentDoc.definitions]};
export const FindMarriageByIdDocument: DocumentNode<FindMarriageByIdQuery, FindMarriageByIdQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findMarriageById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findMarriageById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MarriageFields"}}]}}]}},...MarriageFieldsFragmentDoc.definitions]};
export const CreateUserDocument: DocumentNode<CreateUserMutation, CreateUserMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"forename"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastname"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"birthname"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"birthdate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dayOfDeath"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bio"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"marriages"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputMarriageId"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"marriageWithUserId"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputMarriageWithUserId"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parents"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputUserId"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"children"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputUserId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"forename"},"value":{"kind":"Variable","name":{"kind":"Name","value":"forename"}}},{"kind":"Argument","name":{"kind":"Name","value":"lastname"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastname"}}},{"kind":"Argument","name":{"kind":"Name","value":"birthname"},"value":{"kind":"Variable","name":{"kind":"Name","value":"birthname"}}},{"kind":"Argument","name":{"kind":"Name","value":"birthdate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"birthdate"}}},{"kind":"Argument","name":{"kind":"Name","value":"dayOfDeath"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dayOfDeath"}}},{"kind":"Argument","name":{"kind":"Name","value":"bio"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bio"}}},{"kind":"Argument","name":{"kind":"Name","value":"marriages"},"value":{"kind":"Variable","name":{"kind":"Name","value":"marriages"}}},{"kind":"Argument","name":{"kind":"Name","value":"marriageWithUserId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"marriageWithUserId"}}},{"kind":"Argument","name":{"kind":"Name","value":"parents"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parents"}}},{"kind":"Argument","name":{"kind":"Name","value":"children"},"value":{"kind":"Variable","name":{"kind":"Name","value":"children"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}}]}},...UserFieldsFragmentDoc.definitions]};
export const CreateMarriageDocument: DocumentNode<CreateMarriageMutation, CreateMarriageMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createMarriage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"users"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputUserId"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMarriage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"users"},"value":{"kind":"Variable","name":{"kind":"Name","value":"users"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MarriageFields"}}]}}]}},...MarriageFieldsFragmentDoc.definitions]};
export const UpdateUserDocument: DocumentNode<UpdateUserMutation, UpdateUserMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"forename"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastname"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"birthname"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"birthdate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dayOfDeath"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bio"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"marriages"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputMarriageId"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"marriageWithUserId"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputMarriageWithUserId"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parents"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputUserId"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"children"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputUserId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"forename"},"value":{"kind":"Variable","name":{"kind":"Name","value":"forename"}}},{"kind":"Argument","name":{"kind":"Name","value":"lastname"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastname"}}},{"kind":"Argument","name":{"kind":"Name","value":"birthname"},"value":{"kind":"Variable","name":{"kind":"Name","value":"birthname"}}},{"kind":"Argument","name":{"kind":"Name","value":"birthdate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"birthdate"}}},{"kind":"Argument","name":{"kind":"Name","value":"dayOfDeath"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dayOfDeath"}}},{"kind":"Argument","name":{"kind":"Name","value":"bio"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bio"}}},{"kind":"Argument","name":{"kind":"Name","value":"marriages"},"value":{"kind":"Variable","name":{"kind":"Name","value":"marriages"}}},{"kind":"Argument","name":{"kind":"Name","value":"marriageWithUserId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"marriageWithUserId"}}},{"kind":"Argument","name":{"kind":"Name","value":"parents"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parents"}}},{"kind":"Argument","name":{"kind":"Name","value":"children"},"value":{"kind":"Variable","name":{"kind":"Name","value":"children"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}}]}},...UserFieldsFragmentDoc.definitions]};
export const DeleteUserDocument: DocumentNode<DeleteUserMutation, DeleteUserMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}}]}},...UserFieldsFragmentDoc.definitions]};
export const UploadAvatarDocument: DocumentNode<UploadAvatarMutation, UploadAvatarMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"uploadAvatar"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"file"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Upload"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadAvatar"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"file"},"value":{"kind":"Variable","name":{"kind":"Name","value":"file"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileFields"}}]}}]}},...FileFieldsFragmentDoc.definitions]};