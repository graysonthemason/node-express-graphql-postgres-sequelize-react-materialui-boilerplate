import gql from 'graphql-tag';


export default gql `
  mutation SendRegisterEmail($email: String!) {
    sendRegisterEmail(email: $email) {
      id
      email
    }
  }
`;
