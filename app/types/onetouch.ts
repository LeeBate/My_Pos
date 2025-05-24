export type OneTouch = {
    _id: string;
    seqCode: number;
    description: string;
    image: string;
    level2: {
        description: string;
        id: number;
        productName: string;
        price: number;
        cost: number;
        qty: number;
        category: string;
        image: string;
        addons: {
        name: string;
        price: number;
        qty: number;
        }[];
    }[];
}
