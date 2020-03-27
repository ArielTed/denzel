const Movie = require('../schemas/movies');
const imdb = require('../imdb');

const populateResolver = async (_, args) => {
	const { id } = args;
	try {
		const movies = await imdb(id);
		for (movie of movies) {
			const movieExists = await Movie.findOne({ id: movie.id, actorID: id });
			if (!movieExists) {
				const movieDB = new Movie({
					actorID: req.params.id,
					id: movie.id,
					link: movie.link,
					metascore: movie.metascore,
					poster: movie.poster,
					rating: movie.rating,
					synopsis: movie.synopsis,
					title: movie.title,
					votes: movie.votes,
					year: movie.year
				});
				await movieDB.save();
			}
		}
		const numMovies = await Movie.countDocuments({ actorID: id }, (err, count) => {
			return count;
		});
		return { total: numMovies };
	}
	catch (err) {
		return { error: err.message };
	}
};

const randomMovieResolver = async () => {
	try {
		const movie = await Movie.aggregate([{ $match: { metascore: { $gt: 77 } } }, { $sample: { size: 1 } }]);
		const { link, id, metascore, poster, rating, synopsis, title, votes, year } = movie[0];
		return {
			link,
			id,
			metascore,
			poster,
			rating,
			synopsis,
			title,
			votes,
			year
		};
	}
	catch (err) {
		return { error: err.message };
	}
};

const specificMovieResolver = async (_, args) => {
	const { id } = args;
	try {
		const movies = await Movie.find({ id });

		if (movies.length === 0)
			throw new Error('No movie found.');
		else {
			const response = {
				link: movies[0].link,
				id: movies[0].id,
				metascore: movies[0].metascore,
				poster: movies[0].poster,
				rating: movies[0].rating,
				synopsis: movies[0].synopsis,
				title: movies[0].title,
				votes: movies[0].votes,
				year: movies[0].year
			};
			if (movies[0].date)
				response.date = movies[0].date;
			if (movies[0].review)
				response.review = movies[0].review;
			return response;
		}
	}
	catch (err) {
		return { error: err.message };
	}
};

const searchMovieResolver = async (_, args) => {
	try {
		const limit = parseInt(args.limit);
		const metascore = parseInt(args.metascore);

		const movies = await Movie.aggregate([{ $match: { metascore: { $gt: metascore } } }, { $sample: { size: limit } }, { $sort: { metascore: -1 } }]);

		if (movies.length === 0)
			throw new Error('No movie found.');
		else {
			for (movie of movies) {
				delete movie._id;
				delete movie.actorID;
				delete movie.createdAt;
				delete movie.updatedAt;
				delete movie.__v;
			}
			return { movies };
		}
	}
	catch (err) {
		return { error: err.message };
	}
};

const postReviewResolver = async (_, args) => {
	const { id, date, review } = args;
	try {
		const movie = await Movie.findOne({ id });

		if (movie.length === 0)
			throw new Error('No movie found.');
		else {
			await Movie.updateOne({ _id: movie._id }, { date, review });
			return { _id: movie._id };
		}
	}
	catch (err) {
		return { error: err.message };
	}
};

module.exports = {
	populateResolver,
	randomMovieResolver,
	specificMovieResolver,
	searchMovieResolver,
	postReviewResolver
}
