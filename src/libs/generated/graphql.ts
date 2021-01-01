import { useQuery, UseQueryOptions, useMutation, UseMutationOptions } from 'react-query';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

function fetcher<TData, TVariables>(endpoint: string, requestInit: RequestInit, query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    const res = await fetch(endpoint, {
      method: 'POST',
      ...requestInit,
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  }
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  forename: Scalars['String'];
  lastname: Scalars['String'];
  avatar: Scalars['Boolean'];
  marriages?: Maybe<Array<Maybe<Marriage>>>;
  parents?: Maybe<Array<Maybe<User>>>;
  children?: Maybe<Array<Maybe<User>>>;
  places?: Maybe<Array<Maybe<Place>>>;
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
};


export type QueryFindUserByIdArgs = {
  id: Scalars['ID'];
};


export type QueryFindMarriageByIdArgs = {
  id: Scalars['ID'];
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
};


export type MutationCreateUserArgs = {
  forename: Scalars['String'];
  lastname: Scalars['String'];
  avatar?: Maybe<Scalars['Boolean']>;
  marriages?: Maybe<Array<Maybe<InputMarriageId>>>;
  marriageWithUserId?: Maybe<Array<Maybe<InputMarriageWithUserId>>>;
  parents?: Maybe<Array<Maybe<InputUserId>>>;
  children?: Maybe<Array<Maybe<InputUserId>>>;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID'];
  forename?: Maybe<Scalars['String']>;
  lastname?: Maybe<Scalars['String']>;
  avatar?: Maybe<Scalars['Boolean']>;
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
  & Pick<User, 'id' | 'forename' | 'lastname'>
  & { parents?: Maybe<Array<Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id'>
  )>>>, children?: Maybe<Array<Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id'>
  )>>>, marriages?: Maybe<Array<Maybe<(
    { __typename?: 'Marriage' }
    & Pick<Marriage, 'id'>
  )>>> }
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

export const MarriageFieldsFragmentDoc = `
    fragment MarriageFields on Marriage {
  id
  users {
    id
  }
}
    `;
export const UserFieldsFragmentDoc = `
    fragment UserFields on User {
  id
  forename
  lastname
  parents {
    id
  }
  children {
    id
  }
  marriages {
    id
  }
}
    `;
export const FindUserByIdDocument = `
    query findUserById($id: ID!) {
  findUserById(id: $id) {
    ...UserFields
  }
}
    ${UserFieldsFragmentDoc}`;
export const useFindUserByIdQuery = <
      TData = FindUserByIdQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit }, 
      variables: FindUserByIdQueryVariables, 
      options?: UseQueryOptions<FindUserByIdQuery, TError, TData>
    ) => 
    useQuery<FindUserByIdQuery, TError, TData>(
      ['findUserById', variables],
      fetcher<FindUserByIdQuery, FindUserByIdQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, FindUserByIdDocument, variables),
      options
    );
export const AllMarriagesDocument = `
    query allMarriages {
  allMarriages {
    ...MarriageFields
  }
}
    ${MarriageFieldsFragmentDoc}`;
export const useAllMarriagesQuery = <
      TData = AllMarriagesQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit }, 
      variables?: AllMarriagesQueryVariables, 
      options?: UseQueryOptions<AllMarriagesQuery, TError, TData>
    ) => 
    useQuery<AllMarriagesQuery, TError, TData>(
      ['allMarriages', variables],
      fetcher<AllMarriagesQuery, AllMarriagesQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, AllMarriagesDocument, variables),
      options
    );
export const AllUsersDocument = `
    query allUsers {
  allUsers {
    ...UserFields
  }
}
    ${UserFieldsFragmentDoc}`;
export const useAllUsersQuery = <
      TData = AllUsersQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit }, 
      variables?: AllUsersQueryVariables, 
      options?: UseQueryOptions<AllUsersQuery, TError, TData>
    ) => 
    useQuery<AllUsersQuery, TError, TData>(
      ['allUsers', variables],
      fetcher<AllUsersQuery, AllUsersQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, AllUsersDocument, variables),
      options
    );
export const FindMarriageByIdDocument = `
    query findMarriageById($id: ID!) {
  findMarriageById(id: $id) {
    ...MarriageFields
  }
}
    ${MarriageFieldsFragmentDoc}`;
export const useFindMarriageByIdQuery = <
      TData = FindMarriageByIdQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit }, 
      variables: FindMarriageByIdQueryVariables, 
      options?: UseQueryOptions<FindMarriageByIdQuery, TError, TData>
    ) => 
    useQuery<FindMarriageByIdQuery, TError, TData>(
      ['findMarriageById', variables],
      fetcher<FindMarriageByIdQuery, FindMarriageByIdQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, FindMarriageByIdDocument, variables),
      options
    );
export const CreateUserDocument = `
    mutation createUser($forename: String!, $lastname: String!, $marriages: [InputMarriageId], $marriageWithUserId: [InputMarriageWithUserId], $parents: [InputUserId], $children: [InputUserId]) {
  createUser(
    forename: $forename
    lastname: $lastname
    marriages: $marriages
    marriageWithUserId: $marriageWithUserId
    parents: $parents
    children: $children
  ) {
    ...UserFields
  }
}
    ${UserFieldsFragmentDoc}`;
export const useCreateUserMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit }, 
      options?: UseMutationOptions<CreateUserMutation, TError, CreateUserMutationVariables, TContext>
    ) => 
    useMutation<CreateUserMutation, TError, CreateUserMutationVariables, TContext>(
      (variables?: CreateUserMutationVariables) => fetcher<CreateUserMutation, CreateUserMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, CreateUserDocument, variables)(),
      options
    );
export const CreateMarriageDocument = `
    mutation createMarriage($users: [InputUserId]!) {
  createMarriage(users: $users) {
    ...MarriageFields
  }
}
    ${MarriageFieldsFragmentDoc}`;
export const useCreateMarriageMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit }, 
      options?: UseMutationOptions<CreateMarriageMutation, TError, CreateMarriageMutationVariables, TContext>
    ) => 
    useMutation<CreateMarriageMutation, TError, CreateMarriageMutationVariables, TContext>(
      (variables?: CreateMarriageMutationVariables) => fetcher<CreateMarriageMutation, CreateMarriageMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, CreateMarriageDocument, variables)(),
      options
    );
export const UpdateUserDocument = `
    mutation updateUser($id: ID!, $forename: String!, $lastname: String!, $marriages: [InputMarriageId], $marriageWithUserId: [InputMarriageWithUserId], $parents: [InputUserId], $children: [InputUserId]) {
  updateUser(
    id: $id
    forename: $forename
    lastname: $lastname
    marriages: $marriages
    marriageWithUserId: $marriageWithUserId
    parents: $parents
    children: $children
  ) {
    ...UserFields
  }
}
    ${UserFieldsFragmentDoc}`;
export const useUpdateUserMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit }, 
      options?: UseMutationOptions<UpdateUserMutation, TError, UpdateUserMutationVariables, TContext>
    ) => 
    useMutation<UpdateUserMutation, TError, UpdateUserMutationVariables, TContext>(
      (variables?: UpdateUserMutationVariables) => fetcher<UpdateUserMutation, UpdateUserMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, UpdateUserDocument, variables)(),
      options
    );
export const DeleteUserDocument = `
    mutation deleteUser($id: ID!) {
  deleteUser(id: $id) {
    ...UserFields
  }
}
    ${UserFieldsFragmentDoc}`;
export const useDeleteUserMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit }, 
      options?: UseMutationOptions<DeleteUserMutation, TError, DeleteUserMutationVariables, TContext>
    ) => 
    useMutation<DeleteUserMutation, TError, DeleteUserMutationVariables, TContext>(
      (variables?: DeleteUserMutationVariables) => fetcher<DeleteUserMutation, DeleteUserMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, DeleteUserDocument, variables)(),
      options
    );