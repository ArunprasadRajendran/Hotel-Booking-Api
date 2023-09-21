/* eslint-disable */
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { mockDbConnection } from './mock-dbconnection';
mockDbConnection();
import apiRouter from '../../routes';
import { hotelInfo } from '../../database/hotel/hotelinfo';
import { Hotels } from '../../models/hotelinfo.model';

const app = express();
// Use body-parser to parse JSON requests
app.use(bodyParser.json());
app.use('/api', apiRouter);

describe('Hotel Routes', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new hotel when valid data is provided', async () => {
        const hotelData = {
            // Provide valid data for creating a hotel
            name: 'Hotel ABC',
            phone_number: 1234567890,
            email: 'hotel@example.com',
            website: 'https://hotel-website.com',
            images: ['image1.jpg', 'image2.jpg'],
            facilities: 'Swimming pool, Free Wi-Fi',
            star_rating: 4,
            address: '123 Main St',
            city: 'City',
            state: 'State',
            country: 'Country',
            postal_code: 12345,
        };

        // Mock the behavior of createHotel function to return affectedRows: 1
        jest.spyOn(hotelInfo, 'createHotel').mockResolvedValue({
            affectedRows: 1,
            changedRows: 1,
        });

        const response = await request(app)
            .post('/api/hotelinfo/hotel')
            .send(hotelData)
            .expect(200);

        // Check the response to ensure it contains affectedRows: 1
        expect(response.body.affectedRows).toBe(1);
        expect(response.body.changedRows).toBe(1);

    });

    it('should return an error when invalid data is provided', async () => {
        const invalidHotelData = {
            // Provide invalid data that should trigger an error
            phone_number: 1234567890,
            email: 'hotel@example.com',
            website: 'https://hotel-website.com',
            images: ['image1.jpg', 'image2.jpg'],
            facilities: 'Swimming pool, Free Wi-Fi',
            star_rating: 4,
            city: 'City',
            state: 'State',
            country: 'Country',
            postal_code: 12345,
        };

        // Mock the behavior of createHotel function to throw an error
        jest.spyOn(hotelInfo, 'createHotel').mockRejectedValue({
            error: true,
            message: 'Data validation failed: name field cannot be null.',
            error_code: 'INVALID_DATA',
        });

        const response = await request(app)
            .post('/api/hotelinfo/hotel')
            .send(invalidHotelData)
            .expect(500);

        expect(response.body.message).toBe('Data validation failed: name field cannot be null.');
        expect(response.body.error_code).toBe('INVALID_DATA');
    });

    it('should get all hotels successfully', async () => {
        // Mock the behavior of getAllHotels to return a list of hotels
        const mockHotels: Hotels[] = [
            {
                id: 1,
                name: 'Hotel ABC',
                phone_number: 1234567890,
                email: 'hotel@example.com',
                website: 'https://hotel-website.com',
                images: ['image1.jpg', 'image2.jpg'],
                facilities: 'Swimming pool, Free Wi-Fi',
                star_rating: 4,
                address: '123 Main St',
                city: 'City',
                state: 'State',
                country: 'Country',
                postal_code: 12345
            }
        ];

        jest.spyOn(hotelInfo, 'getAllHotels').mockResolvedValue(mockHotels);

        const response = await request(app)
            .get('/api/hotelinfo/hotel')
            .expect(200);

        // check the response body with mockHotels
        expect(response.body).toEqual(mockHotels);
    });
});
