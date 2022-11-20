const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        // Get user
        me: async (parent, { username }) => {
            return User.findOne({ username }).populate('books');
        },
    },
}