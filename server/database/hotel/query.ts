/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bookings, CancelBooking } from '../../models/bookinginfo.model';
import { connection } from '../../config/db.config';
import moment from 'moment';

interface BookingQueryInterface {
    createBooking: (data: Bookings) => string;
    updateBooking: (data: Bookings) => string;
    cancelBooking: (params: CancelBooking) => string;
}

export const bookingQuery: BookingQueryInterface = {
    createBooking: (data: Bookings) => {
        const escapedInputData: string = connection.escape(getStringifyData(data));
        const query: any = `CALL api_create_booking (${escapedInputData})`;
        return query;
    },

    updateBooking: (data: Bookings) => {
        const updated_time: any = moment().format('YYYY-MM-DD HH:mm:ss');
        const query: any = `Update Bookings
        set check_in_date = '${data.check_in_date}',
        check_out_date =  '${data.check_out_date}',
        booking_date = '${data.booking_date}',
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

function getStringifyData(data: Bookings) {
    return JSON.stringify(data, (key: string, value: any) => {
        if (value !== null) {
            return value;
        }
    });
}
