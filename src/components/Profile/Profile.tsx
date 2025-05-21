import { useEffect, useState } from 'react';
import classes from './Profile.module.css';

interface Product {
    id: number;
    name: string;
    price: number;
    description: string | null;
}

interface Order {
    id: number;
    totalAmount: number;
    status: string;
    products: Product[];
}

export const Profile: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:5149/api/ECommerce/orders', {
                    method: 'GET',
                    headers: { 'accept': 'application/json' }
                });

                if (!response.ok) throw new Error('Failed to fetch orders');
                const data = await response.json();
                console.log('Fetched orders:', data);
                setOrders(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load orders. Please try again.');
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleCancelOrder = async (orderId: number) => {
        try {
            const response = await fetch(`http://localhost:5149/api/ECommerce/order/${orderId}/cancel`, {
                method: 'POST',
                headers: { 'accept': 'application/json' }
            });

            if (!response.ok) throw new Error('Failed to cancel order');
            const updatedOrder = await response.json();

            setOrders(orders.map(order =>
                order.id === orderId
                    ? { ...order, status: updatedOrder.status || 'Cancelled' }
                    : order
            ));

            setNotification({ message: `Order #${orderId} has been cancelled.`, type: 'success' });
        } catch (err) {
            setNotification({ message: 'Failed to cancel order. Please try again.', type: 'error' });
        }

        setTimeout(() => setNotification(null), 3000);
    };

    if (loading) return (
        <div className={classes.loadingContainer}>
            <div className={classes.spinner}></div>
            <p>Loading your orders...</p>
        </div>
    );

    if (error) return <div className={classes.error}>{error}</div>;

    return (
        <div className={classes.profile}>
            <h1 className={classes.title}>My Orders</h1>
            {notification && (
                <div className={`${classes.notification} ${notification.type === 'success' ? classes.success : classes.error}`}>
                    {notification.message}
                </div>
            )}
            {orders.length === 0 ? (
                <p className={classes.noOrders}>No orders found.</p>
            ) : (
                <div className={classes.orderList}>
                    {orders.map(order => (
                        <div key={order.id} className={classes.order}>
                            <div className={classes.orderHeader}>
                                <h3>Order #{order.id}</h3>
                                <span className={`${classes.status} ${order.status === 'Confirmed' ? classes.statusConfirmed : classes.statusCancelled}`}>
                                    {order.status}
                                </span>
                            </div>
                            <p><strong>Total Amount:</strong> {order.totalAmount.toFixed(2)} MDL</p>
                            
                            <h4>Products:</h4>
                            <ul className={classes.productList}>
                                {order.products.map(product => (
                                    <li key={product.id}>
                                        {product.name} - {product.price.toFixed(2)} MDL
                                        {product.description && <span> ({product.description})</span>}
                                    </li>
                                ))}
                            </ul>
                            {order.status === 'Confirmed' && (
                                <button
                                    className={classes.cancelButton}
                                    onClick={() => handleCancelOrder(order.id)}
                                >
                                    Cancel Order
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};