interface propData {
    message: string,
    type: any,
    open: boolean
}
export interface SnackBarProps {
    data: propData
}

interface Item {
    title: string;
    description: string;
    price: string;
}

export interface CardDataProps {
    items: Item[];
    isEdit: boolean;
    isCart: boolean;
    query: string | null
}