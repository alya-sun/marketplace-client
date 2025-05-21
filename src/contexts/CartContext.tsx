import { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { Product, productService } from '../services/productService';

export interface CartItemProps extends Product {
    quantity: number;
    description?: string;
}

export interface CartContextProps {
    cart: CartItemProps[];
    addToCart: (product: Product, customProduct?: Product) => Promise<void>;
    removeFromCart: (productId: number) => Promise<void>;
    updateQuantity: (productId: number, quantity: number) => void;
    undoCartChange: () => Promise<void>;
    clearCart: () => Promise<void>;
    totalPrice: number;
    totalProducts: number;
    error: string | null;
}

export const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItemProps[]>([]);
    const [error, setError] = useState<string | null>(null);
    const userId = '0';

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const serverCart = await productService.fetchCart(userId);
                const formattedCart = serverCart.map((item: Product) => ({
                    ...item,
                    quantity: 1,
                }));
                setCart(formattedCart);
            } catch (error) {
                setError("Failed to load cart");
                console.error('Failed to load cart:', error);
                setCart([]);
            }
        };
        fetchCart();
    }, []);

    const addToCart = async (product: Product, customProduct?: Product) => {
        try {
            setError(null);
            const productToAdd = customProduct || product;

            const updatedCart = await productService.addToCart(userId, productToAdd.id, productToAdd.description || productToAdd.price !== product.price ? productToAdd : undefined);

            const mergedCart = updatedCart.map((item: Product) => {
                const existingItem = cart.find((c) => c.id === item.id);
                return {
                    ...item,
                    quantity: existingItem?.quantity || 1,
                    description: existingItem?.description || (item.id === productToAdd.id ? productToAdd.description : undefined),
                    price: existingItem?.price || (item.id === productToAdd.id ? productToAdd.price : item.price),
                };
            });

            const newItem = {
                ...productToAdd,
                quantity: 1,
                description: productToAdd.description,
                price: productToAdd.price,
            };
            const finalCart = [...mergedCart.filter((item) => item.id !== productToAdd.id), newItem];

            setCart(finalCart);
        } catch (error) {
            setError("Failed to add to cart");
            console.error('Failed to add to cart:', error);
            throw error;
        }
    };

    const removeFromCart = async (productId: number) => {
        try {
            setError(null);
            const updatedCart = await productService.removeFromCart(userId, productId);
            const formattedCart = updatedCart.map((item: Product) => ({
                ...item,
                quantity: cart.find((c) => c.id === item.id)?.quantity || 1,
            }));
            setCart(formattedCart);
        } catch (error) {
            setError("Failed to remove from cart");
            console.error('Failed to remove from cart:', error);
            throw error;
        }
    };

    const updateQuantity = useCallback((productId: number, quantity: number) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
            )
        );
    }, []);

    const undoCartChange = async () => {
        try {
            setError(null);
            const updatedCart = await productService.undoCartChange(userId);
            const formattedCart = updatedCart.map((item: Product) => ({
                ...item,
                quantity: cart.find((c) => c.id === item.id)?.quantity || 1,
            }));
            setCart(formattedCart);
        } catch (error) {
            setError("Failed to undo cart change");
            console.error('Failed to undo cart change:', error);
            throw error;
        }
    };

    const clearCart = async () => {
        try {
            setError(null);
            await productService.clearCart(userId);
            setCart([]);
        } catch (error) {
            setError("Failed to clear cart");
            console.error('Failed to clear cart:', error);
            throw error;
        }
    };

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalProducts = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                undoCartChange,
                clearCart,
                totalPrice,
                totalProducts,
                error,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};