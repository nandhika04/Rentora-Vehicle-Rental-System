import React from 'react';
import './cart.css';

const Cart = ({ cartItems, onRemoveItem }) => {
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      // Ensure price is treated as a number
      const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
      return total + price;
    }, 0);
  };

  const formatPrice = (price) => {
    // Format the price for display
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numericPrice.toFixed(2);
  };

  return (
    <div className="cart-page">
      <h1 className="cart-title">Your Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <i className="fas fa-shopping-cart"></i>
          <h2>Your cart is empty</h2>
          <p>Browse our collection and add some bikes to your cart!</p>
          <a href="/bike" className="btn btn-primary">Explore Bikes</a>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => {
              // Ensure price is treated as a number
              const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
              
              return (
                <div key={item._id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p>₹{formatPrice(price)}/day</p>
                  </div>
                  <button 
                    className="btn btn-danger"
                    onClick={() => onRemoveItem(item)}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
          
          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{formatPrice(calculateTotal())}</span>
            </div>
            <div className="summary-row">
              <span>Tax (10%):</span>
              <span>₹{formatPrice(calculateTotal() * 0.1)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{formatPrice(calculateTotal() * 1.1)}</span>
            </div>
            
            <button className="btn btn-primary btn-checkout">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;