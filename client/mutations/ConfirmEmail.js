import gql from 'graphql-tag';

export default gql `
  mutation ConfirmEmail($email: String!, $password: String!, $token: String!) {
    confirmEmail(email: $email, password: $password, token: $token) {
      id
      email
    }
  }
`;
