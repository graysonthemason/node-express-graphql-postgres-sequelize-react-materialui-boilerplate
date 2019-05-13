import gql from 'graphql-tag';


export default gql `
  mutation SendForgotPasswordEmail($email: String!) {
    sendForgotPasswordEmail(email: $email) {
      id
      email
    }
  }
`;
