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
    Mutation: {
        // Create user
        createUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
    }
}