import { createContext, ReactNode } from 'react';
import { Product, productService } from '@/services/productService';

export interface Order {
    id: number;
    products: Product[];
    totalAmount: number;
    status: string;
}

export interface OrderContextProps {
    placeOrder: (userId: string, paymentMethod: string) => Promise<void>;
    cancelOrder: (orderId: number) => Promise<void>;
    deliverOrder: (orderId: number, address: string) => Promise<void>;
    getOrder: (orderId: number) => Promise<Order>;
    getAllOrders: () => Promise<Order[]>;
}

export const OrderContext = createContext<OrderContextProps | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
    const placeOrder = async (userId: string, paymentMethod: string) => {
        await productService.placeOrder(userId, paymentMethod);
    };

    const cancelOrder = async (orderId: number) => {
        await productService.cancelOrder(orderId);
    };

    const deliverOrder = async (orderId: number, address: string) => {
        await productService.deliverOrder(orderId, address);
    };

    const getOrder = async (orderId: number): Promise<Order> => {
        return await productService.getOrder(orderId);
    };

    const getAllOrders = async (): Promise<Order[]> => {
        return await productService.getAllOrders();
    };

    return (
        <OrderContext.Provider
            value={{ placeOrder, cancelOrder, deliverOrder, getOrder, getAllOrders }}
        >
            {children}
        </OrderContext.Provider>
    );
};