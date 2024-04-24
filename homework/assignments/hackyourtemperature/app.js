'use strict'

import dotenv from 'dotenv';
dotenv.config();
import express from 'express';

const app = express();
app.use(express.json());

app.post('/', async (req, res) => {

	const { cityName } = req.body;

	try {

		const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${process.env.API_KEY}`);
          
		if (!response.ok) {
			if (response.status === 401) {
				res.status(401).send("Invalid API Key");
				return;
			} else if (response.status === 400) {
				res.status(400).send("Enter a city name, please.");
				return;
			} else if (response.status === 404) {
				res.status(404).send({ weatherText: "City is not found!" });
				return;
			} else {
				throw new Error('Failed to fetch weather data');
			}

		}

		const data = await response.json();

		const resData = { weatherText: `The temperature in ${data.name} is ${data.main.temp}°C` };

		res.status(200).header("Content-Type", "application/json").send(resData);

	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal server error' });
	}
});
 
export default app;