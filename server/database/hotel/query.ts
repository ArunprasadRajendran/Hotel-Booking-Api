/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bookings, CancelBooking } from '../../models/bookinginfo.model';
import { connection } from '../../config/db.config';
import moment from 'moment';
import { RoomFilterParams } from '../../models/roominfo.model';

interface BookingQueryInterface {
    createBooking: (data: Bookings) => string;
    getAllBookings: (id: number) => string;
    updateBooking: (data: Bookings) => string;
    cancelBooking: (params: CancelBooking) => string;
}

export const bookingQuery: BookingQueryInterface = {
    createBooking: (data: Bookings) => {
        const escapedInputData: string = connection.escape(getStringifyData(data));
        const query: any = `CALL api_create_booking (${escapedInputData})`;
        return query;
    },

    getAllBookings: (id: number) => {
        const query: any = `SELECT B.*, R.room_number, G.*
        FROM Bookings B
        JOIN Rooms R ON B.room_id = R.id
        JOIN Guest G ON B.guest_id = G.id
        WHERE R.hotel_id = ${id}
        AND B.active = 1;`;
        return query;
    },

    updateBooking: (data: Bookings) => {
        const updated_time: any = moment().format('YYYY-MM-DD HH:mm:ss');
        const query: any = `Update Bookings
        set check_in_date = '${data.check_in_date}',
        check_out_date =  '${data.check_out_date}',
        booking_date = '${data.booking_date}',
        adults = '${data.adults}, 
        childrens = '${data.childrens},
        total_price = ${data.total_price},
        payment_status = '${data.payment_status}',
        updated_time = '${updated_time}'
        WHERE id = ${data.id}`;
        return query;
    },

    cancelBooking: (params: CancelBooking) => {
        const updated_time: any = moment().format('YYYY-MM-DD HH:mm:ss');
        const query: any = `Update Bookings
        set cancellation_reason = '${params.cancellation_reason}',
        active = 0,
        updated_time = '${updated_time}'
        WHERE id = ${params.id}`;
        return query;
    },
};

interface RoomQueryInterface {
    getAvailableRooms: (params: RoomFilterParams) => string;
}

export const roomQuery: RoomQueryInterface = {
    getAvailableRooms: (params: RoomFilterParams) => {
        let query: any = `SELECT *
        FROM Rooms R
        WHERE R.hotel_id = ${params.hotel_id} AND R.id NOT IN (
            SELECT DISTINCT B.room_id
            FROM Bookings B
            WHERE (
                (B.check_in_date >= '${params.check_in_date}' AND B.check_in_date <= '${params.check_out_date}')
                OR
                (B.check_out_date >= '${params.check_in_date}' AND B.check_out_date <= '${params.check_out_date}')
                OR
                (B.check_in_date <= '${params.check_in_date}' AND B.check_out_date >= '${params.check_out_date}')
            )
        )`;
        // Additional filters
        if (params.occupancy) {
            query = query + ` AND R.occupancy = ${params.occupancy}`;
        }
        if (params.room_type) {
            query = query + ` AND R.room_type = ${params.room_type}`;
        }
        if (params.price_per_night) {
            query = query + ` AND R.price_per_night <= ${params.price_per_night}`;
        }
        return query;
    },
};

function getStringifyData(data: Bookings) {
    return JSON.stringify(data, (key: string, value: any) => {
        if (value !== null) {
            return value;
        }
    });
}
