const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        // Get user by username
        me: async (parent, { username }) => {
            return User.findOne({ username }).populate('books');
        },
    },
    Mutation: {
        // Create a new user
        createUser: async (parent, { username, email, password }) => {
            const newUser = await User.create({ username, email, password });
            const token = signToken(newUser);
            return { token, newUser };
        },
        // User login, token signing
        login: async (parent, { email, password }) => {
            const validUser = await User.findOne({ email });

            if (!validUser) {
                throw new AuthenticationError(
                    'No user found with this email address'
                );
            }

            const validPW = await validUser.isCorrectPassword(password);

            if (!validPW) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(validUser);

            return { token, validUser };
        },
        // Save book to users list
        saveBook: async (parent, { user, body }) => {
            const updateUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $addToSet: { savedBooks: body } },
                { new: true, runValidators: true }
            );

            return updateUser;
        },
    }
}