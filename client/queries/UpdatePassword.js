import gql from 'graphql-tag';

export default gql `
query getUserByEmail($email: String!) {
  user: getUserByEmail(email: $email) {
    id
    suspended
		resetToken
		resetExpires
  }
	me {
    user {
      id
      email
		}
	}
}
`
