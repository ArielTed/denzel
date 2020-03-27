import React, { Component } from 'react';
import { Card, Button } from 'react-bootstrap';

import API from "../utils/API";

class Home extends Component {
	send = async () => {
		try {
			const { data } = await API.randomMovie();
			localStorage.setItem('Movie', JSON.stringify(data));
			window.location = "/result";
		} catch (error) {
			console.error(error);
		}
	};

	render() {
		return (
			<Card className="mx-auto align-items-center" border="secondary" style={{ width: '18rem', "backgroundColor": "rgba(255, 255, 255, 0.6)" }}>
				<br></br>
				<Card.Title>What can I watch tonight ?</Card.Title>
				<Card.Body>
					<Button onClick={this.send} variant="dark" type="submit">
						Let's find out !
  			</Button>
				</Card.Body>
			</Card>
		);
	}
}

export default Home;
