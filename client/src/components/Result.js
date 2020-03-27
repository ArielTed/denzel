import React, { Component } from 'react';
import { Card, Button } from 'react-bootstrap';

class Result extends Component {
	render() {
		const { link, metascore, poster, rating, synopsis, title } = JSON.parse(localStorage.getItem('Movie'));
		return (
			<Card className="mx-auto align-items-center" border="secondary" style={{ width: '18rem', "backgroundColor": "rgba(255, 255, 255, 0.8)" }}>
				<Card.Img variant="top" src={poster} style={{ width: "69%" }} />
				<Card.Body style={{ "textAlign": "center" }}>
					<Card.Title>{title}</Card.Title>
					<Card.Text>{synopsis}</Card.Text>
					<Card.Text>Metascore : {metascore}</Card.Text>
					<Card.Text>Rating : {rating}</Card.Text>
					<Card.Link href={link}>Link to IMDB page</Card.Link>
					<br /><br />
					<Button href="/" variant="dark">Home</Button>
				</Card.Body>
			</Card>
		);
	}
}

export default Result;
