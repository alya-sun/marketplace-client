import { useState } from 'react';
import { productService } from '@/services/productService';

export const useProductCustomization = () => {
    const [customizedProduct, setCustomizedProduct] = useState<{
        description: string;
        price: number;
    } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const customizeProduct = async (
        productId: number,
        giftWrap: boolean,
        expressDelivery: boolean
    ) => {
        try {
            setLoading(true);
            const result = await productService.customizeProduct(productId, giftWrap, expressDelivery);
            setCustomizedProduct(result);
        } catch (err) {
            setError('Failed to customize product');
        } finally {
            setLoading(false);
        }
    };

    return { customizedProduct, loading, error, customizeProduct };
};