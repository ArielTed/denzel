const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const graphqlHTTP = require('express-graphql');
const { GraphQLSchema } = require('graphql');
const path = require("path")

const movieRoute = require('./routes/movies');
const { queryType } = require('./graphql/query');

dotenv.config();
const PORT = process.env.PORT || 9292;
const DB_CONNECT = process.env.DB_CONNECT;

const app = express();

mongoose
	.connect(
		DB_CONNECT,
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(() => {
		console.log("Connected to DB.");
	})
	.catch((err) => {
		console.log("Error while DB connecting.");
		console.log(err);
	});

app.use(express.json());
app.set('json spaces', 2);
app.use(cors());
app.use(helmet());
app.use(express.static(path.join(__dirname, "client", "build")));

app.options('*', cors());

app.use('/', movieRoute);
const schema = new GraphQLSchema({ query: queryType });
app.use('/graphql', graphqlHTTP({
	schema: schema,
	graphiql: true
}));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(PORT, () => console.log(`📡 Running on port ${PORT}`));
