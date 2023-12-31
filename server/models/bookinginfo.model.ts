export interface Bookings {
    id?: number;
    room_id: number;
    guest_id: number;
    check_in_date: string;
    check_out_date: string;
    booking_date: string;
    adults: number;
    childrens: number;
    total_price: number;
    payment_status: string;
    cancellation_reason?: string;
    created_time?: string;
    updated_time?: string;
    active?: number;
    guest_details: {
        first_name: string;
        last_name?: string;
        phone_number: number;
        email_id: string;
        date_of_birth: string;
        address: string;
        city: string;
        state: string;
        country: string;
        postal_code: number;
        passport_number?: string;
        address_proof?: string;
    };
}

export interface CancelBooking {
    id: number;
    cancellation_reason: string;
}
