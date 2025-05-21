import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { Product, productService } from '@/services/productService';

interface ProductContextProps {
    filteredAndSortedProducts: {
        products: Product[];
        loading: boolean;
        error: string | null;
    };
    paginatedProducts: Product[];
    totalPages: number;
    currentPage: number;
    setFilter: (filter: string) => void;
    setSortOrder: (order: 'asc' | 'desc') => void;
    setPriceRange: (minPrice?: number, maxPrice?: number) => void;
    handlePageChange: (page: number) => void;
}

export const ProductContext = createContext<ProductContextProps | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
    const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
    const itemsPerPage = 4;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                let response: Product[];
                if (minPrice !== undefined || maxPrice !== undefined) {
                    response = await productService.filterProducts(minPrice, maxPrice);
                } else {
                    response = await productService.fetchProducts();
                }
                setProducts(response);
            } catch (err) {
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [minPrice, maxPrice]);

    const setPriceRange = (newMinPrice?: number, newMaxPrice?: number) => {
        setMinPrice(newMinPrice);
        setMaxPrice(newMaxPrice);
        setCurrentPage(1);
    };

    const filteredAndSortedProducts = products
        .filter((product) =>
            filter ? product.category.toLowerCase().includes(filter.toLowerCase()) : true
        )
        .sort((a, b) => (sortOrder === 'asc' ? a.price - b.price : b.price - a.price));

    const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
    const paginatedProducts = filteredAndSortedProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <ProductContext.Provider
            value={{
                filteredAndSortedProducts: {
                    products: filteredAndSortedProducts,
                    loading,
                    error,
                },
                paginatedProducts,
                totalPages,
                currentPage,
                setFilter,
                setSortOrder,
                setPriceRange,
                handlePageChange,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};