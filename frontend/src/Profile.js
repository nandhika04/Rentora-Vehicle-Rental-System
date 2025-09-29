import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [bookings, setBookings] = useState([]);

  // Profile form state
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || ''
  });

  // Fetch bookings on component mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/bookings/my-bookings');
        setBookings(response.data.bookings);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await updateProfile(profileData);
      if (result.success) {
        setMessage('Profile updated successfully!');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const result = await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
        passwordData.confirmPassword
      );
      if (result.success) {
        setMessage('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturnVehicle = async (bookingId) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/bookings/${bookingId}/status`, { status: 'pending_return' });

      if (response.data.success) {
        // Refresh bookings
        const bookingsResponse = await axios.get('http://localhost:5000/api/bookings/my-bookings');
        setBookings(bookingsResponse.data.bookings);
        setMessage(response.data.message || 'Vehicle return initiated. Staff will inspect it soon.');
        setError('');
      } else {
        setError(response.data.message || 'Failed to initiate return');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to initiate return';
      setError(errorMessage);
      setMessage('');
    }
  };

  const handlePayPenalty = async (reportId) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/damage-reports/${reportId}/pay-penalty`);

      if (response.data.message) {
        // Refresh bookings
        const bookingsResponse = await axios.get('http://localhost:5000/api/bookings/my-bookings');
        setBookings(bookingsResponse.data.bookings);
        setMessage(response.data.message || 'Penalty paid successfully!');
        setError('');
      } else {
        setError(response.data.message || 'Failed to pay penalty');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to pay penalty';
      setError(errorMessage);
      setMessage('');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile Settings</h1>
        <p>Manage your account information and preferences</p>
      </div>

      <div className="profile-content">
        <div className="profile-tabs">
          <button
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile Information
          </button>
          <button
            className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            Change Password
          </button>
          <button
            className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            My Bookings
          </button>
        </div>

        <div className="profile-form-container">
          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}

          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="profile-form">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={profileData.username}
                  onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <input
                  type="text"
                  value={user?.role || 'user'}
                  disabled
                  className="disabled-input"
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="profile-form">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  required
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  required
                  minLength="6"
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          )}

          {activeTab === 'bookings' && (
            <div className="bookings-section">
              <h2>My Bookings & Reports</h2>
              {bookings.length === 0 ? (
                <p>No bookings found.</p>
              ) : (
                bookings.map(booking => (
                  <div key={booking._id} className="booking-card" style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                    <h3>Booking #{booking.bookingId}</h3>
                    <p><strong>Vehicle:</strong> {booking.vehicle.name}</p>
                    <p><strong>Status:</strong> {
                      booking.status === 'confirmed' ? 'Confirmed (Waiting for pre-inspection)' :
                      booking.status === 'active' ? 'Active (Vehicle picked up)' :
                      booking.status === 'pending_return' ? 'Pending Return (Vehicle returned, waiting inspection)' :
                      booking.status === 'completed' ? 'Completed' :
                      booking.status === 'cancelled' ? 'Cancelled' :
                      booking.status
                    }</p>
                    <p><strong>Pickup:</strong> {new Date(booking.pickupDate).toLocaleDateString()} at {booking.pickupTime}</p>
                    <p><strong>Return:</strong> {new Date(booking.dropoffDate).toLocaleDateString()} at {booking.dropoffTime}</p>
                    <p><strong>Total Cost:</strong> ₹{booking.totalCost}</p>

                    {booking.status === 'active' && (
                      <button
                        onClick={() => handleReturnVehicle(booking._id)}
                        style={{ background: '#28a745', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', marginTop: '1rem' }}
                      >
                        Return Vehicle
                      </button>
                    )}

                    {booking.penaltyAmount > 0 && booking.penaltyStatus === 'pending' && (
                      <div style={{ background: '#fff3cd', padding: '1rem', borderRadius: '4px', marginTop: '1rem' }}>
                        <p><strong>🚨 Penalty: You need to pay ₹{booking.penaltyAmount} for damages.</strong></p>
                        <button
                          onClick={() => handlePayPenalty(booking.postRentalInspection._id)}
                          style={{ background: '#dc3545', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Pay Penalty
                        </button>
                      </div>
                    )}

                    {booking.preRentalInspection && (
                      <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                        <h4>✅ Pre-Rental Inspection Report</h4>
                        <p><strong>Status:</strong> {booking.preRentalInspection.status}</p>
                        <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                          Vehicle has been inspected by staff before rental. {booking.status === 'confirmed' ? 'Waiting for activation.' : 'Vehicle is ready for use.'}
                        </p>
                        {booking.preRentalInspection.photos && booking.preRentalInspection.photos.length > 0 && (
                          <div style={{ marginTop: '0.5rem' }}>
                            <p><strong>Inspection Photos:</strong></p>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                              {booking.preRentalInspection.photos.map((photo, idx) => (
                                <img key={idx} src={photo.url} alt={`Inspection photo ${idx + 1}`} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #dee2e6' }} />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {booking.postRentalInspection && (
                      <div style={{ marginTop: '1rem' }}>
                        <h4>Post-Rental Inspection Report</h4>
                        <p>Status: {booking.postRentalInspection.status}</p>
                        {booking.postRentalInspection.staffReview && (
                          <div>
                            <p><strong>Repair Cost:</strong> ₹{booking.postRentalInspection.staffReview.totalRepairCost}</p>
                            <p><strong>Notes:</strong> {booking.postRentalInspection.staffReview.notes}</p>
                          </div>
                        )}
                        {booking.postRentalInspection.photos && (
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {booking.postRentalInspection.photos.map((photo, idx) => (
                              <img key={idx} src={photo.url} alt={photo.angle} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
