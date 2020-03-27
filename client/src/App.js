import React, { useState, useEffect } from 'react';
import { Route, Switch } from "react-router-dom";
import './App.css';
import imageBackground from './images/movie_night.jpg';
import Home from './components/Home';
import Result from './components/Result';

function App() {
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const imageUrl = windowWidth >= 650 ? imageBackground : imageBackground;

	const handleWindowResize = () => {
		setWindowWidth(window.innerWidth);
	};

	useEffect(() => {
		window.addEventListener('resize', handleWindowResize);
		return () => {
			window.removeEventListener('resize', handleWindowResize);
		}
	});

	return (
		<div className="App" style={{ backgroundImage: `url(${imageUrl})` }}>
			<div className="App-content">
				<Switch>
					<Route exact path="/" component={Home} />
					<Route exact path="/result" component={Result} />
				</Switch>
			</div>
		</div>
	);
}

export default App;
