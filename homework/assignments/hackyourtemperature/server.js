'use strict'

import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
	if (error) {
		console.log('Something went wrong ', error);
	} else {
		console.log('Server is up and listening on port ', + PORT);
	}
});
