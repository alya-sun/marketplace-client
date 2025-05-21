import { CartItemProps } from '@/contexts/CartContext';
import { useCart } from '@/hooks/useCart';
import classes from '../Cart.module.css'

export const CartItem: React.FC<CartItemProps> = ({ name, category, price, quantity, id }) => {
    const { updateQuantity, removeFromCart } = useCart();

    return (
        <div className={classes['cart-item']}>
            <div className={classes['img-details']}>
                    <div className="details">
                        <h3>{name}</h3>
                        <p>{price.toFixed(2)} MDL</p>
                        <p>Category: {category}</p>
                    </div>
            </div>

                <div className={classes['quantity-remove']}>
                    <div className={classes['quantity-controls']}>
                        <button onClick={() => updateQuantity(id, quantity - 1)}>
                            -
                        </button>
                        <span>{quantity}</span>
                        <button onClick={() => updateQuantity(id, quantity + 1)}>
                            +
                        </button>
                    </div>
                    <button className={classes['remove-button']} onClick={() => removeFromCart(id)}>
                        Remove
                    </button>
                </div>
        </div>
    );
};