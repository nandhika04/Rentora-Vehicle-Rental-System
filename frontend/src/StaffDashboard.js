import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StaffDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'staff')) {
      fetchBookings();
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/bookings');
      setBookings(response.data.bookings);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const startPickupInspection = (bookingId) => {
    navigate('/damage/capture', { state: { bookingId, type: 'pre-rental' } });
  };

  const startReturnInspection = (bookingId) => {
    navigate('/damage/capture', { state: { bookingId, type: 'post-rental' } });
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/bookings/${bookingId}/status`, { status });
      fetchBookings(); // Refresh the list
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Staff Dashboard</h1>
      <h2>Bookings Management</h2>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {bookings.map(booking => (
          <div key={booking._id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1rem',
            background: '#f9f9f9'
          }}>
            <h3>Booking #{booking.bookingId}</h3>
            <p>Customer: {booking.customer.username} ({booking.customer.email})</p>
            <p>Vehicle: {booking.vehicle.name}</p>
            <p>Status: {booking.status}</p>
            <p>Pickup: {new Date(booking.pickupDate).toLocaleDateString()} at {booking.pickupTime}</p>
            <p>Return: {new Date(booking.dropoffDate).toLocaleDateString()} at {booking.dropoffTime}</p>

            {booking.status === 'confirmed' && (
              <button
                onClick={() => startPickupInspection(booking._id)}
                style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
              >
                Start Pickup Inspection
              </button>
            )}

            {booking.status === 'active' && (
              <button
                onClick={() => updateBookingStatus(booking._id, 'pending_return')}
                style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
              >
                Mark as Pending Return
              </button>
            )}

            {booking.status === 'pending_return' && (
              <button
                onClick={() => startReturnInspection(booking._id)}
                style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', background: '#ffc107', color: 'black', border: 'none', borderRadius: '4px' }}
              >
                Start Return Inspection
              </button>
            )}

            {booking.penaltyAmount > 0 && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '4px' }}>
                <p><strong>Penalty: ₹{booking.penaltyAmount}</strong></p>
                <p>Status: {booking.penaltyStatus}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffDashboard;