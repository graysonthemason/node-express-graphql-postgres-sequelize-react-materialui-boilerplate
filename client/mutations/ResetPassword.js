import gql from 'graphql-tag';


export default gql `
  mutation ResetPassword($email: String!, $password: String!, $token: String!) {
    resetPassword(email: $email, password: $password, token: $token) {
      id
      email
    }
  }
`;
