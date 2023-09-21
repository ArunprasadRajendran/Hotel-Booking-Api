/* eslint-disable */
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { mockDbConnection } from './mock-dbconnection';
mockDbConnection();
import apiRouter from '../../routes';
import { Rooms, RoomFilterParams } from '../../models/roominfo.model';
import { roomInfo } from '../../database/hotel/roominfo';

const app = express();
// Use body-parser to parse JSON requests
app.use(bodyParser.json());
app.use('/api', apiRouter);

describe('Room Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new room successfully', async () => {
        const roomData: Rooms = {
            hotel_id: 1,
            room_number: 101,
            room_type: 'Standard',
            beds: '[{ type: "double", quantity: 2 }]', // Type of beds (e.g., Single, Double, King)
            occupancy: 2, // Maximum occupancy
            description: 'A comfortable and cozy room with a double bed.',
            images: ['image1.jpg', 'image2.jpg'], // Array of room images
            price_per_night: 100,
        };

        // Mock the behavior of createRoom function
        jest.spyOn(roomInfo, 'createRoom').mockResolvedValue({
            affectedRows: 1,
            changedRows: 1,
        });

        const response = await request(app)
            .post('/api/roominfo/room')
            .send(roomData)
            .expect(200);

        // Check the response to ensure it contains affectedRows: 1
        expect(response.body.affectedRows).toBe(1);
        expect(response.body.changedRows).toBe(1);
    });

    it('should get all rooms by hotel ID successfully', async () => {
        const hotelId: number = 1; // Provide a valid hotel ID

        // Mock the behavior of getAllRooms to return a list of rooms
        const mockRooms: Rooms[] = [
            {
                id: 1,
                hotel_id: 1,
                room_number: 101,
                room_type: 'Standard',
                beds: '[{ type: "double", quantity: 2 }]',
                occupancy: 2,
                description: 'A comfortable and cozy room with a double bed.',
                images: ['image1.jpg', 'image2.jpg'],
                price_per_night: 100,
            },
            {
                id: 2,
                hotel_id: 1,
                room_number: 102,
                room_type: 'Deluxe',
                beds: '[{ type: "double", quantity: 2 }]',
                occupancy: 2,
                description: 'A comfortable and cozy room with a double bed.',
                images: ['image1.jpg', 'image2.jpg'],
                price_per_night: 100,
            },
        ];

        jest.spyOn(roomInfo, 'getAllRooms').mockResolvedValue(mockRooms);

        const response = await request(app)
            .get(`/api/roominfo/room/${hotelId}`)
            .expect(200);

        //check the response body matching the mock data
        expect(response.body).toEqual(mockRooms);
    });

    it('should get available rooms by user information successfully', async () => {
        const queryParams: RoomFilterParams = {
            hotel_id: 1,
            check_in_date: '2023-09-20',
            check_out_date: '2023-09-22',
        };

        // Mock the behavior of getAvailableRooms to return a list of available rooms
        const mockAvailableRooms: Rooms[] = [
            {
                id: 1,
                hotel_id: 1,
                room_number: 101,
                room_type: 'Standard',
                beds: '[{ type: "double", quantity: 2 }]',
                occupancy: 2,
                description: 'A comfortable and cozy room with a double bed.',
                images: ['image1.jpg', 'image2.jpg'],
                price_per_night: 100,
            }
        ];

        jest.spyOn(roomInfo, 'getAvailableRooms').mockResolvedValue(mockAvailableRooms);

        const response = await request(app)
            .get('/api/roominfo/room/')
            .query(queryParams)
            .expect(200);

        // check the response body matching the mock data
        expect(response.body).toEqual(mockAvailableRooms);
    });

});
