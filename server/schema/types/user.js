export default `
type User {
  id: Int!
  firstName: String
  lastName: String
  fullName: String
  email: String!
  confirmationDt: Date
  suspended: Boolean
  resetToken: String
  resetExpires: Date
  registerToken: String
  registerExpires: Date
  profileImgUrl: String
  updatedAt: Date
  createdAt: Date
}
type UserFeed {
  rows: [User]
  count: Int!
}
type Query {
	getUser(id: Int!): User!
	getUserByEmail(email: String!): User
  allUsers: [User!]!
	me: CurrentSession
	userFeed(pagination: Pagination, sort: Sort, filter: Filter): UserFeed
}
type Mutation {
  sendForgotPasswordEmail(email:String!):User
  sendRegisterEmail(email:String!):User
  sendContactUsEmail(email:String!, firstName: String, lastName: String, message: String):User
  sendPartnerEmail(email:String!, firstName: String, lastName: String, message: String):User
  createEmployee(email: String!, accountId:Int!, firstName: String!, lastName: String!, email: String!): User!
  createUser(email: String!, password: String!, registerToken: String, registerExpires: Date): User!
  signup(email: String, password: String): User
  logout:User
  login(email: String, password: String):CurrentSession!
  resetPassword(email: String!, password: String!, token: String!):User!
  confirmEmail(email: String!, password: String!, token: String!):User!
  updateUser(id: Int!, email:String, firstName: String, lastName: String, spotifyRefreshExpires: Date, spotifyAccessToken: String, spotifyRefreshToken: String,  userConfigOptions:[Int]): User
}
`;
