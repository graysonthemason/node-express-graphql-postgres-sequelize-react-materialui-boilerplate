import gql from 'graphql-tag';

export default gql `
query getUserByEmail($email: String!) {
  user: getUserByEmail(email: $email) {
    id
    suspended
		registerToken
		confirmationDt
		registerExpires
  }
	me {
    user {
      id
      email
		}
	}
}
`
