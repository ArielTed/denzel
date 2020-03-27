const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLFloat, GraphQLList, GraphQLID } = require('graphql');

const populateType = new GraphQLObjectType({
	name: 'populateType',
	fields: {
		total: { type: GraphQLInt },
		error: { type: GraphQLString }
	}
})

const movieType = new GraphQLObjectType({
	name: 'movieType',
	fields: {
		link: { type: GraphQLString },
		id: { type: GraphQLString },
		metascore: { type: GraphQLInt },
		poster: { type: GraphQLString },
		rating: { type: GraphQLFloat },
		synopsis: { type: GraphQLString },
		title: { type: GraphQLString },
		votes: { type: GraphQLFloat },
		year: { type: GraphQLInt },
		date: { type: GraphQLString },
		review: { type: GraphQLString },
		error: { type: GraphQLString }
	}
});

const movieSearchType = new GraphQLObjectType({
	name: "movieSearchType",
	fields: {
		movies: { type: new GraphQLList(movieType) },
		error: { type: GraphQLString }
	}
});

const movieIdType = new GraphQLObjectType({
	name: "movieIdType",
	fields: {
		_id: { type: GraphQLID },
		error: { type: GraphQLString }
	}
});

module.exports = {
	populateType,
	movieType,
	movieSearchType,
	movieIdType
}
