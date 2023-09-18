/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bookings } from '../../models/bookinginfo.model';
import { connection } from '../../config/db.config';

interface BookingQueryInterface {
    createBooking: (data: Bookings) => string;
}

export const bookingQuery: BookingQueryInterface = {
    createBooking: (data: Bookings) => {
        const escapedInputData: string = connection.escape(getStringifyData(data));
        const query: any = `CALL api_room_booking (${escapedInputData})`;
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
