import React from 'react';
import './cart.css';

const Cart = ({ cartItems, onRemoveItem }) => {
  // Calculate total cart value
  const totalValue = cartItems.reduce((total, item) => {
    const price = typeof item.price === 'string' ? parseFloat(item.price.replace(/[^\d.-]/g, '')) : item.price;
    return total + price;
  }, 0);

  return (
    <div className="cart-page">
      <h2 className="cart-header">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="empty-cart-message">Your cart is empty.</p>
      ) : (
        <div className="cart-items-container">
          {cartItems.map((item, index) => (
            <div key={index} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <h3 className="cart-item-name">{item.name}</h3>
                <p className="cart-item-description">{item.description}</p>
                <p className="cart-item-price">₹{item.price}</p>
                <button
                  className="remove-item-button"
                  onClick={() => onRemoveItem(item)} // Pass the entire item object to remove
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {cartItems.length > 0 && (
        <div className="cart-total">
          <h3>Total: ₹{totalValue.toFixed(2)}</h3> {/* Display the total */}
        </div>
      )}
    </div>
  );
};

export default Cart;
