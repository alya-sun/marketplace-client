import { useCart } from '@/hooks/useCart';
import classes from '../Cart.module.css'
import { useState } from 'react';

export const Summary: React.FC = () => {
    const { totalPrice, cart } = useCart();
    const [orderStatus, setOrderStatus] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<string>('apple');

    const discount = totalPrice > 1000 ? 0.1 : 0;
    const finalPrice = totalPrice * (1 - discount);

    const handleCheckout = async () => {
        try {
            const url = `http://localhost:5149/api/ECommerce/order/0?paymentMethod=${encodeURIComponent(paymentMethod.toLowerCase())}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'accept': 'text/plain',
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({
                    totalAmount: finalPrice,
                    products: cart.map(item => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        description: item.description
                    }))
                })
            });

            if (!response.ok) throw new Error('Failed to create order');
            const data = await response.json();
            setOrderStatus(`Order ${data.order.id} ${data.order.status}. ${data.payment}`);
        } catch (error) {
            setOrderStatus('Failed to create order. Please try again.');
        }
    };

    return (
        <div className={classes.summary}>
            <h2>Summary</h2>

            <div className={classes['input-group']}>
                <label>Promo code</label>
                <input type="text" placeholder="Enter your promo code" />
            </div>

            <div className={classes['input-group']}>
                <label>Shipping</label>
                <select>
                    <option value="standard">Standard Delivery - €5.00</option>
                    <option value="express">Express Delivery - €10.00</option>
                </select>
            </div>

            <div className={classes['input-group']}>
                <label>Payment</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    <option value="apple">ApplePay</option>
                    <option value="google">GooglePay</option>
                    <option value="bonus">Bonus Points</option>
                </select>
            </div>

            <hr />
            
            <div className={classes['total']}>
                <span>Total Price</span>
                <span>
                    {discount > 0 && (
                        <span style={{ textDecoration: 'line-through', marginRight: '8px' }}>
                            {totalPrice.toFixed(2)} MDL
                        </span>
                    )}
                    {finalPrice.toFixed(2)} MDL
                    {discount > 0 && <span style={{ color: 'green', marginLeft: '8px' }}>(10% off)</span>}
                </span>
            </div>

            <button className={classes['checkout-button']} onClick={handleCheckout}>Checkout</button>
            {orderStatus && <p className={classes['order-status']}>{orderStatus}</p>}
        </div>
    );
}