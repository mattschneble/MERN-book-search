// import queries and mutations
const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
    Query: {
        me: async (parent, args ,context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                .select("-__v -password")
                .populate("savedBooks");
                return userData;
            }
            throw new AuthenticationError("You must be logged in to use this feature. Please log in.")
        },
    },
    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError("Incorrect login information. Please try again.");
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError("Incorrect login information. Please try again.");
    }
    const token = signToken(user);
    return { token, user };
        },

        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },

        saveBook: async (parent, {bookToSave }, context) => {
            if (context.user) {
                const updatedBooks = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: bookToSave } },
                    { new: true,}
                ).populate("savedBooks");
                return updatedBooks;
                }
        },

        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedBooks = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true }
                ).populate("savedBooks");
                return updatedBooks;
            }
            throw new AuthenticationError("You must be logged in to use this feature. Please log in.")
        },
    },
};

// export the resolvers
module.exports = resolvers;