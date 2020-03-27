const router = require('express').Router();
const imdb = require('../imdb');
const Movie = require('../schemas/movies');
const validation = require('../schemas/validation');

router.get('/movies/populate/:id', async (req, res) => {
	let movies;
	try {
		movies = await imdb(req.params.id);
	}
	catch (err) {
		return res.status(404).send('Probably wrong actor id.');
	}

	for (movie of movies) {
		const movieExists = await Movie.findOne({ id: movie.id, actorID: req.params.id });
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
			try {
				await movieDB.save();
			}
			catch (err) {
				return res.status(500).json(err);
			}
		}
	}

	const numMovies = await Movie.countDocuments({ actorID: req.params.id }, (err, count) => {
		if (err)
			return res.status(500).json(err);
		return count;
	});

	return res.status(200).json({ total: numMovies });
});

router.get('/movies', async (req, res) => {
	let movie;

	try {
		movie = await Movie.aggregate([{ $match: { metascore: { $gt: 77 } } }, { $sample: { size: 1 } }]);
	}
	catch (err) {
		return res.status(500).json(err);
	}

	if (movie.length === 0)
		return res.status(404).send('No movie found.');
	else {
		const { link, id, metascore, poster, rating, synopsis, title, votes, year } = movie[0];
		return res.status(200).json({
			link,
			id,
			metascore,
			poster,
			rating,
			synopsis,
			title,
			votes,
			year
		});
	}
});

router.get('/movies/:id', async (req, res) => {
	if (req.params.id === "search") {
		let limit = 5, metascore = 0;
		if (req.query.limit)
			limit = Number(req.query.limit);
		if (req.query.metascore)
			metascore = Number(req.query.metascore);

		let movies;

		try {
			movies = await Movie.aggregate([{ $match: { metascore: { $gt: metascore } } }, { $sample: { size: limit } }, { $sort: { metascore: -1 } }]);
		}
		catch (err) {
			return res.status(500).json(err);
		}

		if (movies.length === 0)
			return res.status(404).send('No movie found.');
		else {
			for (movie of movies) {
				delete movie._id;
				delete movie.actorID;
				delete movie.createdAt;
				delete movie.updatedAt;
				delete movie.__v;
			}
			return res.status(200).json(movies);
		}
	}
	else {
		let movies;

		try {
			movies = await Movie.find({ id: req.params.id });
		}
		catch (err) {
			return res.status(500).json(err);
		}

		if (movies.length === 0)
			return res.status(404).send('No movie found.');
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
			return res.status(200).json(response);
		}
	}
});

router.post('/movies/:id', async (req, res) => {
	const { error } = validation.searchValidation(req.body);
	if (error)
		return res.status(400).json(error.details[0].message);

	let movie;
	try {
		movie = await Movie.findOne({ id: req.params.id });
	}
	catch (err) {
		return res.status(500).json(err);
	}

	if (movie.length === 0)
		return res.status(404).send('No movie found.');
	else {
		await Movie.updateOne({ _id: movie._id }, { date: req.body.date, review: req.body.review });
		return res.status(200).send({ _id: movie._id });
	}
});

module.exports = router;
