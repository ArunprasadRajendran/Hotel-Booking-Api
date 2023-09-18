export interface Hotels {
    id?: number;
    name: string;
    phone_number: number;
    email: string;
    website: string;
    images: string[];
    facilities: string;
    star_rating: number;
    address: string;
    city: string;
    state: string;
    country: string;
    postal_code: number;
    created_time?: string;
    active?: number;
}
