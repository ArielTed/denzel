import axios from "axios";

let burl;
if (process.env.NODE_ENV === 'production') {
	burl = 'https://movienight-ariel.herokuapp.com';
}
else {
	const PORT = process.env.PORT || 9292;
	burl = `http://localhost:${PORT}`;
}

export default {
	randomMovie: async () => {
		const response = await axios({
			method: 'get',
			url: `${burl}/movies`,
			headers: { 'Accept': 'application/json' }
		});

		return response;
	}
};
