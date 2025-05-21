export interface Product {
    id: number;
    name: string;
    price: number;
    category?: string;
    description?: string;
}

export const productService = {
    async fetchProducts(): Promise<Product[]> {
        try {
            const response = await fetch('http://localhost:5149/api/ECommerce/products', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            return data.map((item: any) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                category: item.category || 'Gadgets',
            }));
        } catch (error) {
            console.error('Failed to fetch products:', error);
            throw error;
        }
    },

    filterProducts: async (minPrice?: number, maxPrice?: number): Promise<Product[]> => {
        try {
            const params = new URLSearchParams();
            if (minPrice !== undefined) params.append('minPrice', minPrice.toString());
            if (maxPrice !== undefined) params.append('maxPrice', maxPrice.toString());

            const response = await fetch(`http://localhost:5149/api/ECommerce/products/filter?${params.toString()}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            return data.map((item: any) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                category: item.category || 'default',
            }));
        } catch (error) {
            console.error('Filter products error:', error);
            throw error;
        }
    },

    fetchCart: async (userId: string): Promise<Product[]> => {
        try {
            const response = await fetch(`http://localhost:5149/api/ECommerce/cart/${userId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        } catch (error) {
            console.error('Fetch cart error:', error);
            throw error;
        }
    },

    addToCart: async (userId: string, productId: number, customProduct?: Product): Promise<Product[]> => {
        try {
            const response = await fetch(`http://localhost:5149/api/ECommerce/cart/${userId}/add/${productId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: customProduct ? JSON.stringify(customProduct) : undefined,
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        } catch (error) {
            console.error('Add to cart error:', error);
            throw error;
        }
    },

    removeFromCart: async (userId: string, productId: number): Promise<Product[]> => {
        try {
            const response = await fetch(`http://localhost:5149/api/ECommerce/cart/${userId}/remove/${productId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        } catch (error) {
            console.error('Remove from cart error:', error);
            throw error;
        }
    },

    undoCartChange: async (userId: string): Promise<Product[]> => {
        try {
            const response = await fetch(`http://localhost:5149/api/ECommerce/cart/${userId}/undo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        } catch (error) {
            console.error('Undo cart change error:', error);
            throw error;
        }
    },

    customizeProduct: async (productId: number, giftWrap: boolean, expressDelivery: boolean): Promise<{ description: string; price: number }> => {
        try {
            const response = await fetch(
                `http://localhost:5149/api/ECommerce/product/${productId}/customize?giftWrap=${giftWrap}&expressDelivery=${expressDelivery}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            return {
                description: data.description,
                price: data.price,
            };
        } catch (error) {
            console.error('Customize product error:', error);
            throw error;
        }
    },

    placeOrder: async (userId: string, paymentMethod: string = 'apple'): Promise<any> => {
        try {
            const response = await fetch(
                `http://localhost:5149/api/ECommerce/order/${userId}?paymentMethod=${paymentMethod}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        } catch (error) {
            console.error('Place order error:', error);
            throw error;
        }
    },

    cancelOrder: async (orderId: number): Promise<any> => {
        try {
            const response = await fetch(`http://localhost:5149/api/ECommerce/order/${orderId}/cancel`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        } catch (error) {
            console.error('Cancel order error:', error);
            throw error;
        }
    },

    deliverOrder: async (orderId: number, address: string): Promise<any> => {
        try {
            const response = await fetch(`http://localhost:5149/api/ECommerce/order/${orderId}/deliver`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address }),
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        } catch (error) {
            console.error('Deliver order error:', error);
            throw error;
        }
    },

    getOrder: async (orderId: number): Promise<any> => {
        try {
            const response = await fetch(`http://localhost:5149/api/ECommerce/order/${orderId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        } catch (error) {
            console.error('Get order error:', error);
            throw error;
        }
    },

    getAllOrders: async (): Promise<any[]> => {
        try {
            const response = await fetch(`http://localhost:5149/api/ECommerce/orders`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        } catch (error) {
            console.error('Get all orders error:', error);
            throw error;
        }
    },

    clearCart: async (userId: string): Promise<void> => {
        try {
            const response = await fetch(`http://localhost:5149/api/ECommerce/cart/${userId}/clear`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        } catch (error) {
            console.error('Clear cart error:', error);
            throw error;
        }
    },
};