/**
 * 1. Chuck Norris programs do not accept input
 * 
 * `GET` a random joke inside the function, using the API: http://www.icndb.com/api/
 * (use `node-fetch`) and print it to the console. 
 * Make use of `async/await` and `try/catch`
 * 
 * Hints
 * - To install node dependencies you should first initialize npm
 * - Print the entire response to the console to see how it is structured.
 */

'use strict'

import fetch from "node-fetch";
// const fetch = require('node-fetch');

async function printChuckNorrisJoke() {

  try {

    const response = await fetch('https://api.chucknorris.io/jokes/random');

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('Error fetching data:', error.message);
    throw error;
  }


}


(async () => {
  try {
    const data = await printChuckNorrisJoke();
    console.log('Data:', data);
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
})();
