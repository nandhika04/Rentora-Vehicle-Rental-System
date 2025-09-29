import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './context/AuthContext';
import './AdminPage.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    if (user && (user.role === 'admin' || user.role === 'staff')) {
      fetchBookings();
    }
  }, [user]);

  const pendingPenalties = bookings.filter(b => b.penaltyStatus === 'pending');
  const paidPenalties = bookings.filter(b => b.penaltyStatus === 'paid');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed' && b.preRentalInspection);
  const activeBookings = bookings.filter(b => b.status === 'active');
  const pendingReturns = bookings.filter(b => b.status === 'pending_return');

  const handleActivateBooking = async (bookingId) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        status: 'active'
      });

      if (response.data.success) {
        // Refresh bookings list
        const bookingsResponse = await axios.get('http://localhost:5000/api/bookings');
        setBookings(bookingsResponse.data.bookings);
        alert('Booking activated successfully! Customer can now return the vehicle.');
      } else {
        alert('Failed to activate booking: ' + response.data.message);
      }
    } catch (error) {
      alert('Error activating booking: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleMarkPenaltyPaid = async (bookingId) => {
    try {
      // Get the post-rental inspection report ID
      const booking = bookings.find(b => b._id === bookingId);
      if (!booking || !booking.postRentalInspection) {
        alert('No post-rental inspection found for this booking.');
        return;
      }

      const reportId = booking.postRentalInspection._id;

      const response = await axios.patch(`http://localhost:5000/api/damage-reports/${reportId}/admin-mark-paid`);

      // Refresh bookings list
      const bookingsResponse = await axios.get('http://localhost:5000/api/bookings');
      setBookings(bookingsResponse.data.bookings);
      alert('Penalty marked as paid successfully!');
    } catch (error) {
      alert('Error marking penalty as paid: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="admin-dashboard-page">
      <div className="container">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">🚀 Admin Dashboard</h1>
            <p className="hero-subtitle">Manage your vehicle rental system with powerful tools and insights</p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">{bookings.length}</span>
                <span className="stat-label">Total Bookings</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{pendingPenalties.length}</span>
                <span className="stat-label">Pending Penalties</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">₹{paidPenalties.reduce((sum, b) => sum + b.penaltyAmount, 0)}</span>
                <span className="stat-label">Collected Penalties</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-card">
              <div className="card-icon">📊</div>
              <div className="card-text">Real-time Analytics</div>
            </div>
            <div className="floating-card">
              <div className="card-icon">🔒</div>
              <div className="card-text">Secure Management</div>
            </div>
            <div className="floating-card">
              <div className="card-icon">⚡</div>
              <div className="card-text">Fast Operations</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2 className="section-title">⚡ Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/admin" className="action-card primary">
              <div className="action-icon">🚲</div>
              <div className="action-content">
                <h3>Bike Management</h3>
                <p>Add, edit, and manage bike inventory</p>
              </div>
              <div className="action-arrow">→</div>
            </Link>
            
            <Link to="/admincar" className="action-card secondary">
              <div className="action-icon">🚗</div>
              <div className="action-content">
                <h3>Car Management</h3>
                <p>Manage car fleet and specifications</p>
              </div>
              <div className="action-arrow">→</div>
            </Link>
            
            <Link to="/damage/capture" className="action-card warning">
              <div className="action-icon">📸</div>
              <div className="action-content">
                <h3>Damage Capture</h3>
                <p>Record and assess vehicle damage</p>
              </div>
              <div className="action-arrow">→</div>
            </Link>
            
            <Link to="/damage/review" className="action-card info">
              <div className="action-icon">🔍</div>
              <div className="action-content">
                <h3>Damage Review</h3>
                <p>Review and approve damage reports</p>
              </div>
              <div className="action-arrow">→</div>
            </Link>
          </div>
        </div>

        {/* Confirmed Bookings (Ready to Activate) */}
        {confirmedBookings.length > 0 && (
          <div className="confirmed-bookings">
            <h2 className="section-title">🚗 Confirmed Bookings (Ready to Activate)</h2>
            <p className="section-subtitle">These bookings have pre-inspection completed and are ready for customer pickup</p>
            <div className="bookings-list">
              {confirmedBookings.map(booking => (
                <div key={booking._id} className="booking-item">
                  <div className="booking-header">
                    <h4>Booking #{booking.bookingId}</h4>
                    <span className="booking-status status-confirmed">Pre-inspection Done</span>
                  </div>
                  <p>Customer: {booking.customer.username}</p>
                  <p>Vehicle: {booking.vehicle.name}</p>
                  <p>Pickup: {new Date(booking.pickupDate).toLocaleDateString()} at {booking.pickupTime}</p>
                  <button
                    onClick={() => handleActivateBooking(booking._id)}
                    className="btn btn-success"
                    style={{ marginTop: '0.5rem' }}
                  >
                    ✅ Activate Booking (Customer Can Return Vehicle)
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Penalties */}
        {pendingPenalties.length > 0 && (
          <div className="pending-penalties">
            <h2 className="section-title">💰 Pending Penalties</h2>
            <div className="penalties-list">
              {pendingPenalties.map(booking => (
                <div key={booking._id} className="penalty-item">
                  <div className="penalty-header">
                    <h4>Booking #{booking.bookingId}</h4>
                    <span className="penalty-amount">₹{booking.penaltyAmount}</span>
                  </div>
                  <p>Customer: {booking.customer.username}</p>
                  <p>Vehicle: {booking.vehicle.name}</p>
                  <p>Status: {booking.status}</p>
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleMarkPenaltyPaid(booking._id)}
                      className="btn btn-success"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                    >
                      ✅ Mark as Paid
                    </button>
                    <Link
                      to={`/damage/review`}
                      state={{ bookingId: booking._id, type: 'post-rental' }}
                      className="btn btn-secondary"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', textDecoration: 'none', display: 'inline-block' }}
                    >
                      📋 View Report
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Management Tools */}
        <div className="management-section">
          <h2 className="section-title">🛠️ Management Tools</h2>
          <div className="tools-grid">
            <div className="tool-card">
              <div className="tool-header">
                <div className="tool-icon">📈</div>
                <h3>Analytics Dashboard</h3>
              </div>
              <p>View detailed insights about rentals, revenue, and vehicle performance</p>
              <div className="tool-features">
                <span className="feature">Revenue Tracking</span>
                <span className="feature">Utilization Rates</span>
                <span className="feature">Customer Analytics</span>
              </div>
              <button className="tool-button">Coming Soon</button>
            </div>
            
            <div className="tool-card">
              <div className="tool-header">
                <div className="tool-icon">👥</div>
                <h3>User Management</h3>
              </div>
              <p>Manage customer accounts, verify documents, and handle support requests</p>
              <div className="tool-features">
                <span className="feature">Customer Profiles</span>
                <span className="feature">Document Verification</span>
                <span className="feature">Support Tickets</span>
              </div>
              <button className="tool-button">Coming Soon</button>
            </div>
            
            <div className="tool-card">
              <div className="tool-header">
                <div className="tool-icon">📋</div>
                <h3>Reports & Insights</h3>
              </div>
              <p>Generate comprehensive reports on business performance and trends</p>
              <div className="tool-features">
                <span className="feature">Financial Reports</span>
                <span className="feature">Performance Metrics</span>
                <span className="feature">Trend Analysis</span>
              </div>
              <button className="tool-button">Coming Soon</button>
            </div>
            
            <div className="tool-card">
              <div className="tool-header">
                <div className="tool-icon">⚙️</div>
                <h3>System Settings</h3>
              </div>
              <p>Configure system parameters, pricing rules, and business policies</p>
              <div className="tool-features">
                <span className="feature">Pricing Rules</span>
                <span className="feature">Business Policies</span>
                <span className="feature">System Config</span>
              </div>
              <button className="tool-button">Coming Soon</button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity">
          <h2 className="section-title">📅 Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon success">✅</div>
              <div className="activity-content">
                <h4>New Car Added</h4>
                <p>Toyota Innova Crysta added to fleet</p>
                <span className="activity-time">2 hours ago</span>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon info">📸</div>
              <div className="activity-content">
                <h4>Damage Report Filed</h4>
                <p>Honda City damage assessment completed</p>
                <span className="activity-time">4 hours ago</span>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon warning">⚠️</div>
              <div className="activity-content">
                <h4>Maintenance Due</h4>
                <p>3 vehicles scheduled for maintenance</p>
                <span className="activity-time">1 day ago</span>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon primary">💰</div>
              <div className="activity-content">
                <h4>Revenue Milestone</h4>
                <p>Monthly target achieved - ₹75,000</p>
                <span className="activity-time">2 days ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="system-status">
          <h2 className="section-title">🔧 System Status</h2>
          <div className="status-grid">
            <div className="status-card online">
              <div className="status-indicator"></div>
              <div className="status-content">
                <h4>Database</h4>
                <p>All systems operational</p>
              </div>
            </div>
            
            <div className="status-card online">
              <div className="status-indicator"></div>
              <div className="status-content">
                <h4>API Services</h4>
                <p>Running smoothly</p>
              </div>
            </div>
            
            <div className="status-card online">
              <div className="status-indicator"></div>
              <div className="status-content">
                <h4>File Storage</h4>
                <p>Storage space: 85%</p>
              </div>
            </div>
            
            <div className="status-card online">
              <div className="status-indicator"></div>
              <div className="status-content">
                <h4>Security</h4>
                <p>All checks passed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="footer-actions">
          <Link to="/" className="btn btn-secondary">
            🏠 Back to Home
          </Link>
          <Link to="/admin" className="btn btn-primary">
            🚲 Manage Bikes
          </Link>
          <Link to="/admincar" className="btn btn-primary">
            🚗 Manage Cars
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
