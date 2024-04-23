'use strict'

import app from '../app.js';
import supertest from "supertest";

const request = supertest(app);

describe('Weather API', () => {
    describe('POST /', () => {

      it('should return a 200 status code for a valid city name', async () => {
  
        const validCityNameObj = { cityName: "Amsterdam" };

        const response = await request.post("/").send(validCityNameObj);
  
        expect(response.status).toBe(200);

        expect(response.body).toHaveProperty("weatherText");

        expect(response.body.weatherText).toContain(`The temperature in ${validCityNameObj.cityName} is`);

      });

      it('should return a 404 status code for an invalid city name', async () => {
  
        const invalidCityNameObj = { cityName: "abcd" };

        const response = await request.post("/").send(invalidCityNameObj);

        expect(response.status).toBe(404);

        expect(response.body.weatherText).toBe("City is not found!");

      });

      it('should return a 400 status code if city name is not provided', async () => {
  
        const response = await request.post("/").send({});

        expect(response.status).toBe(400);

        expect(response.body.cityName).toBeUndefined();

      });
  
    });
  });