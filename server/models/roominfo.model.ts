export interface Rooms {
    id?: number;
    hotel_id: number;
    room_number: number;
    room_type: string;
    beds: object[];
    occupancy: number;
    description: string;
    images: string[];
    price_per_night: number;
    created_time?: string;
    updated_time?: string;
    active?: number;
}

export interface RoomFilterParams {
    hotel_id: number;
    check_in_date: string;
    check_out_date: string;
    room_type?: string;
    occupancy?: number;
    price_per_night?: number;
}
