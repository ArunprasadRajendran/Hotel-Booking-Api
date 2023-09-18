export interface Rooms {
    id?: number;
    hotel_id: number;
    room_number: number;
    room_type: string;
    beds: string;
    occupancy: number;
    description: string;
    images: string[];
    price_per_night: number;
    is_available: number;
    created_time?: string;
    updated_time?: string;
    active?: number;
}
