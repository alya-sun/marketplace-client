import { Product } from "@/services/productService";
import { useCart } from "@/hooks/useCart";
import { useProductCustomization } from "@/hooks/useProductCustomization";
import { useState } from "react";
import classes from "../Home.module.css";

export const ProductItem: React.FC<Product> = (product) => {
    const { addToCart } = useCart();
    const { customizeProduct, customizedProduct, loading, error: customizationError } = useProductCustomization();
    const [giftWrap, setGiftWrap] = useState(false);
    const [expressDelivery, setExpressDelivery] = useState(false);
    const [cartError, setCartError] = useState<string | null>(null);

    const handleAddToCart = async () => {
        try {
            setCartError(null);

            let productToAdd = product;

            if (giftWrap || expressDelivery) {
                await customizeProduct(product.id, giftWrap, expressDelivery);
                if (customizedProduct) {
                    productToAdd = {
                        ...product,
                        price: customizedProduct.price,
                        description: customizedProduct.description,
                    };
                } else {
                    setCartError("Click 'Add to cart' to add the customized product");
                    return;
                }
            }

            await addToCart(productToAdd, productToAdd.description || product.description ? productToAdd : undefined);
        } catch (err) {
            setCartError("Failed to add to cart");
            console.error("Add to cart error:", err);
        }
    };

    return (
        <div key={product.id} className={classes["product-card"]}>
            <h3>{product.name}</h3>
            <p>{product.price} MDL</p>
            <p>{product.category}</p>

            <div className={classes["customization-section"]}>
                <div className={classes["customization-options"]}>
                    <label className={classes["checkbox-label"]}>
                        <input
                            type="checkbox"
                            checked={giftWrap}
                            onChange={(e) => setGiftWrap(e.target.checked)}
                        />
                        Gift wrap
                    </label>
                    <label className={classes["checkbox-label"]}>
                        <input
                            type="checkbox"
                            checked={expressDelivery}
                            onChange={(e) => setExpressDelivery(e.target.checked)}
                        />
                        Express delivery
                    </label>
                </div>

                {loading && <p className={classes["loading-message"]}>Customizing...</p>}
                {customizationError && <p className={classes["error-message"]}>{customizationError}</p>}
                {customizedProduct && (
                    <div className={classes["customized-info"]}>
                        <p>Custom Price: {customizedProduct.price} MDL</p>
                        <p>Description: {customizedProduct.description}</p>
                    </div>
                )}
            </div>

            <button
                onClick={handleAddToCart}
                disabled={loading}
                className={classes["customize-button"]}
            >
                Add to cart
            </button>

            {cartError && <p className={classes["error-message"]}>{cartError}</p>}
        </div>
    );
};