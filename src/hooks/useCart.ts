import { useContext } from 'react';
import {CartContext, CartContextProps} from '@/contexts/CartContext'

export const useCart = (): CartContextProps => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};