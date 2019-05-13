import gql from 'graphql-tag';

export default gql `
{
  me {
    user {
      id
      email
      firstName
      lastName
      fullName
      profileImgUrl
    }
  }
}
`
