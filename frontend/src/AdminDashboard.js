import React from 'react';
import { Link } from 'react-router-dom';
import './AdminPage.css';

const AdminDashboard = () => {
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
                <span className="stat-number">150+</span>
                <span className="stat-label">Total Vehicles</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">25+</span>
                <span className="stat-label">Active Rentals</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">₹50K+</span>
                <span className="stat-label">Monthly Revenue</span>
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
