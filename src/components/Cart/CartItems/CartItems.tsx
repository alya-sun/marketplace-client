import { useCart } from '@/hooks/useCart';
import classes from '../Cart.module.css'
import { CartItemProps } from "@/contexts/CartContext";

interface CartItemsProps {
    items: CartItemProps[];
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
}

export const CartItems: React.FC<CartItemsProps> = ({ items, removeFromCart, updateQuantity }) => {
    const { totalProducts, clearCart, undoCartChange } = useCart();
    return (
        <div className={classes['cart-container']}>
            <div className={classes['cart-list']}>
                <div>
                    {items.map((item, index) => (
                        <div key={`${item.id}-${index}`} className={classes['cart-item']}>
                            <div className="details">
                                <h3>{item.name}</h3>
                                <p>{item.price.toFixed(2)} MDL</p>
                                {item.category && <p>Category: {item.category}</p>}
                                {item.description && <p>Description: {item.description}</p>}
                            </div>

                            <div className={classes['quantity-remove']}>
                                <div className={classes['quantity-controls']}>
                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                        +
                                    </button>
                                </div>
                                <button
                                    className={classes['remove-button']}
                                    onClick={() => removeFromCart(item.id)}
                                >
                                    Remove
                                </button>
                            </div>
            
                        </div>
                    ))}
                </div>
            </div>
            
            <div className={classes['items-control']}>
                 <span>{totalProducts} items</span>

                 <div className={classes['cart-buttons']}>
                    <button className={classes['clear-button']} onClick={clearCart}>
                        Clear Cart
                    </button>
                    
                    <button className={classes['undo-button']} onClick={undoCartChange}>
                        Undo
                    </button>

                 </div>
                
             </div>
        </div>
    );
};