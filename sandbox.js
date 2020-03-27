/* eslint-disable no-console, no-process-exit */
const imdb = require('./imdb');
const DENZEL_IMDB_ID = 'nm0000243';
const METASCORE = 77;

async function start (actor = DENZEL_IMDB_ID, metascore = METASCORE) {
  try {
    console.log(`📽️  fetching filmography of Denzel Washington (IMDB_ID: ${actor})...`);
    const movies = await imdb(actor);
    const awesome = movies.filter(movie => movie.metascore >= metascore);

    console.log(`🍿 ${movies.length} movies found.`);
    console.log(movies);
    console.log(`🥇 ${awesome.length} awesome movies found.`);
    console.log(awesome);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [, , id, metascore] = process.argv;

start(id, metascore);
