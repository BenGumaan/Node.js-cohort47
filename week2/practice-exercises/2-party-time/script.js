
/**
 * 3: Party time
 * 
 * After reading the documentation make a request to https://reservation100-sandbox.mxapps.io/rest-doc/api
 * and print the response to the console. Use async-await and try/catch.
 * 
 * Hints:
 * - make sure to use the correct headers and http method in the request
 */

'use strict'

import fetch from "node-fetch";

async function makeReservation() {

  try {
    
    const response = await fetch('https://reservation100-sandbox.mxapps.io/rest-doc/api');

    if (!response.ok) {
      throw new Error('Failed to fetch data.');
    }

    const parsedData = await response.json();

    return parsedData;

  } catch (error) {
    console.error('Error fetching data:', error.message);
    throw error;
  }

}

(async () => {

  try {
    const data = await makeReservation();
    console.log(data);
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
})();
