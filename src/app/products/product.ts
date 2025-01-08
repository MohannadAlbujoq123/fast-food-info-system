export interface IProduct {
    id: number;
    productName: string;
    productCode: string;
    price: number;
    description: string;
    starRating: number;
    imageUrl: string;
    cart: number;
    purchased: number;
    isDisabled: boolean;
    createdByUserId: number;
    imageBase64: string;
}