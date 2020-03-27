const { GraphQLObjectType, GraphQLString, GraphQLInt } = require('graphql');

const { populateType, movieType, movieSearchType, movieIdType } = require('./types.js');
const { populateResolver, randomMovieResolver, specificMovieResolver, searchMovieResolver, postReviewResolver } = require('./resolvers.js');

const queryType = new GraphQLObjectType({
	name: 'Query',
	fields: {
		populate: {
			type: populateType,
			args: {
				id: { type: GraphQLString }
			},
			resolve: populateResolver
		},
		randomMovie: {
			type: movieType,
			resolve: randomMovieResolver
		},
		specificMovie: {
			type: movieType,
			args: {
				id: { type: GraphQLString }
			},
			resolve: specificMovieResolver
		},
		searchMovie: {
			type: movieSearchType,
			args: {
				limit: { type: GraphQLInt, defaultValue: 5 },
				metascore: { type: GraphQLInt, defaultValue: 0 }
			},
			resolve: searchMovieResolver
		},
		postReview: {
			type: movieIdType,
			args: {
				id: { type: GraphQLString },
				date: { type: GraphQLString, defaultValue: null },
				review: { type: GraphQLString, defaultValue: null }
			},
			resolve: postReviewResolver
		}
	}
});

module.exports = {
	queryType
}
