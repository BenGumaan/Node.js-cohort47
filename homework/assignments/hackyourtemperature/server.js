
import express from 'express';

const PORT = 3000;
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('hello from backend to frontend!')
})

app.post('/weather', (req, res) => {
	const { cityName } = req.body;
	res.send(cityName);
});
 
app.listen(PORT, (error) => {
	if (error) {
		console.log('Something went wrong ', error);
	} else {
		console.log('Server is up and listening on port ', + PORT);
	}
});
