/* eslint-disable */
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { mockDbConnection } from './mock-dbconnection';
mockDbConnection();
import { bookingInfo } from '../../database/hotel/bookinginfo';
import apiRouter from '../../routes';
import { Bookings, CancelBooking } from '../../models/bookinginfo.model';

const app = express();
// Use body-parser to parse JSON requests
app.use(bodyParser.json());
app.use('/api', apiRouter);

describe('Booking Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a hotel room booking when valid data is provided', async () => {
        const bookingData: Bookings = {
            room_id: 1,
            guest_id: 1,
            check_in_date: '2023-09-20',
            check_out_date: '2023-09-22',
            booking_date: '2023-09-19',
            adults: 2,
            childrens: 1,
            total_price: 250,
            payment_status: 'Paid',
            guest_details: {
                first_name: 'John',
                last_name: 'Doe',
                phone_number: 1234567890,
                email_id: 'john@example.com',
                date_of_birth: '1990-01-01',
                address: '123 Main St',
                city: 'City',
                state: 'State',
                country: 'Country',
                postal_code: 12345,
                passport_number: 'AB123456',
                address_proof: 'address_proof.jpg',
            },
        };

        // Mock the behavior of createBooking function
        jest.spyOn(bookingInfo, 'createBooking').mockResolvedValue({
            affectedRows: 1,
            changedRows: 1,
        });

        const response = await request(app)
            .post('/api/bookinginfo/booking')
            .send(bookingData)
            .expect(200);

        // Check the response to ensure it contains affectedRows: 1
        expect(response.body.affectedRows).toBe(1);
        expect(response.body.changedRows).toBe(1);
    });

    it('should return an error when invalid data is provided for creating a booking', async () => {
        const invalidBookingData = {
            room_id: 1,
            check_in_date: '2023-09-20',
            check_out_date: '2023-09-22',
            booking_date: '2023-09-19',
            adults: 2,
            childrens: 1,
            total_price: 250,
            payment_status: 'Paid',
        };

        // Mock the behavior of createBooking function to throw an error
        jest.spyOn(bookingInfo, 'createBooking').mockRejectedValue({
            error: true,
            error_code: 'INVALID_DATA',
        });

        const response = await request(app)
            .post('/api/bookinginfo/booking')
            .send(invalidBookingData)
            .expect(500);

        expect(response.body.error).toBe(true);
        expect(response.body.error_code).toBe('INVALID_DATA');
    });

    it('should get all bookings by hotel id', async () => {
        const hotelId = 1;
        const mockBookinsData: Bookings[] = [
            {
                id: 1,
                room_id: 1,
                guest_id: 1,
                check_in_date: '2023-09-20',
                check_out_date: '2023-09-22',
                booking_date: '2023-09-19',
                adults: 2,
                childrens: 1,
                total_price: 250,
                payment_status: 'Paid',
                guest_details: {
                    first_name: 'John',
                    last_name: 'Doe',
                    phone_number: 1234567890,
                    email_id: 'john@example.com',
                    date_of_birth: '1990-01-01',
                    address: '123 Main St',
                    city: 'City',
                    state: 'State',
                    country: 'Country',
                    postal_code: 12345,
                    passport_number: 'AB123456',
                    address_proof: 'address_proof.jpg',
                },
            },
            {
                id: 2,
                room_id: 12,
                guest_id: 2,
                check_in_date: '2023-09-25',
                check_out_date: '2023-09-27',
                booking_date: '2023-09-19',
                adults: 2,
                childrens: 1,
                total_price: 250,
                payment_status: 'Paid',
                guest_details: {
                    first_name: 'Arun',
                    last_name: 'Prasad',
                    phone_number: 1234567890,
                    email_id: 'arun@example.com',
                    date_of_birth: '1990-01-01',
                    address: '123 Main St',
                    city: 'City',
                    state: 'State',
                    country: 'Country',
                    postal_code: 12345,
                    passport_number: 'AB123456',
                    address_proof: 'address_proof.jpg',
                },
            },
        ];

        // Mock the behavior of getAllBookings function
        jest.spyOn(bookingInfo, 'getAllBookings').mockResolvedValue(mockBookinsData);

        const response = await request(app)
            .get(`/api/bookinginfo/booking/${hotelId}`)
            .expect(200);

        // Check the response 
        expect(response.body).toEqual(mockBookinsData);
    });

    it('should update a booking', async () => {
        const updatedBookingData = {
            id: 2,
            room_id: 12,
            check_in_date: '2023-09-26',
            check_out_date: '2023-09-28',
            booking_date: '2023-09-19',
            adults: 2,
            childrens: 3,
            total_price: 250,
            payment_status: 'Paid',
        };

        // Mock the behavior of updateBooking function
        jest.spyOn(bookingInfo, 'updateBooking').mockResolvedValue({
            affectedRows: 1,
            changedRows: 1,
        });

        const response = await request(app)
            .put('/api/bookinginfo/booking')
            .send(updatedBookingData)
            .expect(200);

        // Check the response to ensure it contains affectedRows: 1
        expect(response.body.affectedRows).toBe(1);
        expect(response.body.changedRows).toBe(1);
    });

    it('should cancel a booking', async () => {
        const cancellationParams: CancelBooking = {
            id: 1,
            cancellation_reason: 'No longer needed',
        };

        // Mock the behavior of cancelBooking function
        jest.spyOn(bookingInfo, 'cancelBooking').mockResolvedValue({
            affectedRows: 1,
            changedRows: 1,
        });

        const response = await request(app)
            .delete('/api/bookinginfo/booking')
            .query(cancellationParams)
            .expect(200);

        // Check the response to ensure it contains affectedRows: 1
        expect(response.body.affectedRows).toBe(1);
        expect(response.body.changedRows).toBe(1);
    });
});

