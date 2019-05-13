import {
  Sequelize
} from 'sequelize';

const database = require('../../database');

const {
  Op
} = Sequelize;

const AuthService = require('../../services/auth');
const EmailService = require('../../services/mail');

const {
  updateUser
} = require('../../services/user');

export default {
  User: {
    fullName: (user) => `${user.firstName|| ""} ${user.lastName || ""}`,
  },
  Query: {
    getUser: (parent, {
      id
    }, {
      models
    }) => models.user.findOne({
      where: {
        id
      }
    }),
    getUserByEmail: (parent, {
      email
    }, {
      models
    }) => models.user.findOne({
      where: {
        email
      }
    }),
    me: (parentValue, args, {
      user,
      account
    }) => ({
      user,
      account
    }),
    userFeed: (parent, {
      // filter,
      sort,
      pagination
    }, {
      models
    }) => models.user.findAndCountAll({
      order: [
        [sort.field, sort.order]
      ],
      offset: (pagination.page - 1) * pagination.perPage,
      limit: pagination.perPage
    }),
    allUsers: (parent, args, {
      models
    }) => models.user.findAll(),
  },
  Mutation: {
    createEmployee: async (parent, args, {
      models
    }) => models.user.create(args).then((user) => {
      models.users_accounts.create({
        userId: user.id,
        accountId: args.accountId
      })
      return user
    }),
    createUser: (parent, args, {
      models
    }) => models.user.create(args).then((user) => user),
    signup: (parent, {
      email,
      password
    }, {
      req
    }) => {
      const promise = AuthService.signup({
        email,
        password,
        req
      });
      return promise
    }, // return the promise so Graphql knows to wait
    logout: (parent, args, {
      req,
      user
    }) => {
      req.logout();
      return user;
    },
    sendForgotPasswordEmail: (parent, {
      email
    }, {
      req
    }) => {
      const promise = EmailService.sendForgotPasswordEmail({
        email,
        req
      })
      return promise;
    },
    sendRegisterEmail: (parent, {
      email
    }, {
      req
    }) => {
      const promise = EmailService.sendRegisterEmail({
        email,
        req
      })
      return promise;
    },
    sendContactUsEmail: (parent, {
      email,
      firstName,
      lastName,
      message
    }, {
      req
    }) => {
      const promise = EmailService.sendContactUsEmail({
        email,
        firstName,
        lastName,
        message,
        req
      })
      return promise;
    },
    sendPartnerEmail: (parent, {
      email,
      firstName,
      lastName,
      message
    }, {
      req
    }) => {
      const promise = EmailService.sendPartnerEmail({
        email,
        firstName,
        lastName,
        message,
        req
      })
      return promise;
    },
    resetPassword: (parent, {
      email,
      password,
      token
    }, {
      req
    }) => {
      const promise = AuthService.resetPassword({
        email,
        password,
        token,
        req
      });
      return promise
    }, // return the promise so Graphql knows to wait
    confirmEmail: (parent, {
      email,
      password,
      token
    }, {
      req
    }) => {
      const promise = AuthService.confirmEmail({
        email,
        password,
        token,
        req
      });
      return promise
    }, // return the promise so Graphql knows to wait
    updateUser: (parent, args) => {
      const promise = updateUser(args)
      return promise;
    },
    login: (parent, {
        email,
        password
      }, {
        req
      }) =>
      AuthService.login({
        email,
        password,
        req
      })
  }
};
