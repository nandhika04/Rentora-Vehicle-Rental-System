import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './bike.css';

const DamageReview = () => {
  const navigate = useNavigate();
  const [damageReports, setDamageReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    severity: 'all',
    vehicleType: 'all',
    dateRange: 'all'
  });
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadDamageReports();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [damageReports, filters, sortBy, sortOrder]);

  const loadDamageReports = () => {
    try {
      const reports = JSON.parse(localStorage.getItem('damageReports') || '[]');
      setDamageReports(reports);
    } catch (error) {
      console.error('Error loading damage reports:', error);
      setDamageReports([]);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...damageReports];

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(report => report.status === filters.status);
    }

    // Apply severity filter
    if (filters.severity !== 'all') {
      filtered = filtered.filter(report => report.severity === filters.severity);
    }

    // Apply vehicle type filter
    if (filters.vehicleType !== 'all') {
      filtered = filtered.filter(report => report.vehicleType === filters.vehicleType);
    }

    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const reportDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          filtered = filtered.filter(report => {
            reportDate.setTime(new Date(report.timestamp).getTime());
            return reportDate.toDateString() === now.toDateString();
          });
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(report => new Date(report.timestamp) >= weekAgo);
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(report => new Date(report.timestamp) >= monthAgo);
          break;
        default:
          break;
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'timestamp':
          aValue = new Date(a.timestamp).getTime();
          bValue = new Date(b.timestamp).getTime();
          break;
        case 'severity':
          aValue = getSeverityScore(a.severity);
          bValue = getSeverityScore(b.severity);
          break;
        case 'vehicleId':
          aValue = a.vehicleId.toLowerCase();
          bValue = b.vehicleId.toLowerCase();
          break;
        case 'estimatedCost':
          aValue = parseFloat(a.estimatedCost) || 0;
          bValue = parseFloat(b.estimatedCost) || 0;
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredReports(filtered);
  };

  const getSeverityScore = (severity) => {
    switch (severity) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 0;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#28a745';
      case 'rejected': return '#dc3545';
      case 'pending_review': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'pending_review': return 'Pending Review';
      default: return 'Unknown';
    }
  };

  const handleStatusChange = (reportId, newStatus) => {
    const updatedReports = damageReports.map(report => 
      report.id === reportId ? { ...report, status: newStatus } : report
    );
    
    setDamageReports(updatedReports);
    localStorage.setItem('damageReports', JSON.stringify(updatedReports));
    
    // Update selected report if it's the one being modified
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport({ ...selectedReport, status: newStatus });
    }
  };

  const handleDeleteReport = (reportId) => {
    if (window.confirm('Are you sure you want to delete this damage report?')) {
      const updatedReports = damageReports.filter(report => report.id !== reportId);
      setDamageReports(updatedReports);
      localStorage.setItem('damageReports', JSON.stringify(updatedReports));
      
      if (selectedReport && selectedReport.id === reportId) {
        setSelectedReport(null);
        setShowDetails(false);
      }
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toLocaleString()}`;
  };

  const getReportStats = () => {
    const total = damageReports.length;
    const pending = damageReports.filter(r => r.status === 'pending_review').length;
    const approved = damageReports.filter(r => r.status === 'approved').length;
    const rejected = damageReports.filter(r => r.status === 'rejected').length;
    
    const totalCost = damageReports
      .filter(r => r.status === 'approved')
      .reduce((sum, r) => sum + parseFloat(r.estimatedCost || 0), 0);

    return { total, pending, approved, rejected, totalCost };
  };

  const stats = getReportStats();

  return (
    <div className="damage-review-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">🔍 Damage Review Dashboard</h1>
          <p className="page-subtitle">Review and manage vehicle damage reports with AI-powered insights</p>
        </div>

        {/* Enhanced Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Reports</div>
            </div>
          </div>
          
          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-value">{stats.pending}</div>
              <div className="stat-label">Pending Review</div>
            </div>
          </div>
          
          <div className="stat-card approved">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">{stats.approved}</div>
              <div className="stat-label">Approved</div>
            </div>
          </div>
          
          <div className="stat-card rejected">
            <div className="stat-icon">❌</div>
            <div className="stat-content">
              <div className="stat-value">{stats.rejected}</div>
              <div className="stat-label">Rejected</div>
            </div>
          </div>
          
          <div className="stat-card cost">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-value">{formatCurrency(stats.totalCost)}</div>
              <div className="stat-label">Total Approved Cost</div>
            </div>
          </div>
        </div>

        {/* Enhanced Filters and Controls */}
        <div className="controls-section">
          <div className="filters">
            <div className="filter-group">
              <label>Status:</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="pending_review">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Severity:</label>
              <select
                value={filters.severity}
                onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
                className="filter-select"
              >
                <option value="all">All Severity</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Vehicle:</label>
              <select
                value={filters.vehicleType}
                onChange={(e) => setFilters(prev => ({ ...prev, vehicleType: e.target.value }))}
                className="filter-select"
              >
                <option value="all">All Vehicles</option>
                <option value="car">Car</option>
                <option value="bike">Bike</option>
                <option value="suv">SUV</option>
                <option value="truck">Truck</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Date:</label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                className="filter-select"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>

          <div className="sort-controls">
            <div className="sort-group">
              <label>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="timestamp">Date</option>
                <option value="severity">Severity</option>
                <option value="vehicleId">Vehicle ID</option>
                <option value="estimatedCost">Cost</option>
              </select>
            </div>

            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="sort-order-btn"
              title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* Enhanced Reports Section */}
        <div className="reports-section">
          <div className="section-header">
            <h3>Damage Reports ({filteredReports.length})</h3>
            <div className="section-actions">
              <button
                onClick={() => navigate('/damage/capture')}
                className="btn btn-primary"
              >
                📸 Capture New Damage
              </button>
            </div>
          </div>
          
          {filteredReports.length === 0 ? (
            <div className="no-reports">
              <div className="empty-icon">📋</div>
              <h4>No damage reports found</h4>
              <p>No reports match the current filters. Try adjusting your search criteria or capture a new damage report.</p>
              <button
                onClick={() => navigate('/damage/capture')}
                className="btn btn-primary"
              >
                Capture First Report
              </button>
            </div>
          ) : (
            <div className="reports-grid">
              {filteredReports.map(report => (
                <div key={report.id} className="report-card">
                  <div className="report-header">
                    <div className="report-id">#{report.id.slice(-6)}</div>
                    <div className="report-status">
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(report.status) }}
                      >
                        {getStatusText(report.status)}
                      </span>
                    </div>
                  </div>

                  <div className="report-content">
                    <div className="report-info">
                      <div className="info-row">
                        <span className="info-label">Vehicle:</span>
                        <span className="info-value">
                          {report.vehicleType.toUpperCase()} - {report.vehicleId}
                        </span>
                      </div>
                      
                      <div className="info-row">
                        <span className="info-label">Severity:</span>
                        <span 
                          className="severity-badge"
                          style={{ backgroundColor: getSeverityColor(report.severity) }}
                        >
                          {report.severity}
                        </span>
                      </div>
                      
                      <div className="info-row">
                        <span className="info-label">Cost:</span>
                        <span className="info-value">{formatCurrency(report.estimatedCost)}</span>
                      </div>
                      
                      <div className="info-row">
                        <span className="info-label">Date:</span>
                        <span className="info-value">{formatDate(report.timestamp)}</span>
                      </div>
                    </div>

                    {report.description && (
                      <div className="report-description">
                        <p>{report.description}</p>
                      </div>
                    )}

                    {/* Enhanced Detection Results */}
                    {report.diffResult && (
                      <div className="detection-results">
                        <div className="result-item">
                          <span className="result-label">Severity Score:</span>
                          <span className="result-value">{report.diffResult.severityScore}/100</span>
                        </div>
                        <div className="result-item">
                          <span className="result-label">Damage Area:</span>
                          <span className="result-value">{report.diffResult.damagePercentage.toFixed(2)}%</span>
                        </div>
                        <div className="result-item">
                          <span className="result-label">Regions:</span>
                          <span className="result-value">{report.diffResult.regions.length}</span>
                        </div>
                      </div>
                    )}

                    {/* Enhanced AI Results */}
                    {report.aiResult && (
                      <div className="ai-results">
                        <div className="ai-source">{report.aiResult.source}</div>
                        <div className="ai-confidence">
                          {(report.aiResult.confidence * 100).toFixed(1)}% confidence
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="report-actions">
                    <button
                      onClick={() => {
                        setSelectedReport(report);
                        setShowDetails(true);
                      }}
                      className="btn btn-info btn-sm"
                    >
                      👁️ View Details
                    </button>

                    {report.status === 'pending_review' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(report.id, 'approved')}
                          className="btn btn-success btn-sm"
                        >
                          ✅ Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(report.id, 'rejected')}
                          className="btn btn-danger btn-sm"
                        >
                          ❌ Reject
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => handleDeleteReport(report.id)}
                      className="btn btn-secondary btn-sm"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Action Buttons */}
        <div className="action-buttons">
          <button
            onClick={() => navigate('/damage/capture')}
            className="btn btn-primary"
          >
            📸 Capture New Damage
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="btn btn-secondary"
          >
            🏠 Back to Home
          </button>
        </div>
      </div>

      {/* Enhanced Report Details Modal */}
      {showDetails && selectedReport && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🔍 Damage Report Details</h3>
              <button 
                className="modal-close"
                onClick={() => setShowDetails(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="detail-section">
                <h4>📋 Basic Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Report ID:</span>
                    <span className="detail-value">{selectedReport.id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Vehicle Type:</span>
                    <span className="detail-value">{selectedReport.vehicleType}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Vehicle ID:</span>
                    <span className="detail-value">{selectedReport.vehicleId}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Severity:</span>
                    <span className="detail-value">{selectedReport.severity}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Estimated Cost:</span>
                    <span className="detail-value">{formatCurrency(selectedReport.estimatedCost)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span className="detail-value">{getStatusText(selectedReport.status)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Timestamp:</span>
                    <span className="detail-value">{formatDate(selectedReport.timestamp)}</span>
                  </div>
                </div>
              </div>

              {selectedReport.description && (
                <div className="detail-section">
                  <h4>📝 Description</h4>
                  <p>{selectedReport.description}</p>
                </div>
              )}

              {selectedReport.diffResult && (
                <div className="detail-section">
                  <h4>🔍 Damage Detection Results</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Severity Score:</span>
                      <span className="detail-value">{selectedReport.diffResult.severityScore}/100</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Damage Area:</span>
                      <span className="detail-value">{selectedReport.diffResult.damagePercentage.toFixed(2)}%</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Total Pixels Changed:</span>
                      <span className="detail-value">{selectedReport.diffResult.totalDiffPixels}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Damage Regions:</span>
                      <span className="detail-value">{selectedReport.diffResult.regions.length}</span>
                    </div>
                  </div>

                  {selectedReport.diffResult.regions.length > 0 && (
                    <div className="regions-detail">
                      <h5>🎯 Damage Regions:</h5>
                      <div className="regions-list">
                        {selectedReport.diffResult.regions.map((region, index) => (
                          <div key={index} className="region-detail-item">
                            <div className="region-header">
                              <span className="region-number">Region #{index + 1}</span>
                              <span className="damage-type">
                                {region.classification.type.replace('_', ' ')}
                              </span>
                            </div>
                            <div className="region-details">
                              <p>Area: {region.area} pixels</p>
                              <p>Severity: {Math.round(region.severity)}</p>
                              <p>Confidence: {region.classification.confidence}%</p>
                              <p>Description: {region.classification.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedReport.aiResult && (
                <div className="detail-section">
                  <h4>🤖 AI Analysis Results</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">AI Service:</span>
                      <span className="detail-value">{selectedReport.aiResult.source}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Confidence:</span>
                      <span className="detail-value">{(selectedReport.aiResult.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Message:</span>
                      <span className="detail-value">{selectedReport.aiResult.message}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Images Display */}
              <div className="detail-section">
                <h4>📸 Images</h4>
                <div className="images-grid">
                  {selectedReport.beforeImage && (
                    <div className="image-item">
                      <h5>📷 Before</h5>
                      <img src={selectedReport.beforeImage} alt="Before" className="detail-image" />
                    </div>
                  )}
                  {selectedReport.afterImage && (
                    <div className="image-item">
                      <h5>📷 After</h5>
                      <img src={selectedReport.afterImage} alt="After" className="detail-image" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              {selectedReport.status === 'pending_review' && (
                <>
                  <button
                    onClick={() => {
                      handleStatusChange(selectedReport.id, 'approved');
                      setShowDetails(false);
                    }}
                    className="btn btn-success"
                  >
                    ✅ Approve Report
                  </button>
                  <button
                    onClick={() => {
                      handleStatusChange(selectedReport.id, 'rejected');
                      setShowDetails(false);
                    }}
                    className="btn btn-danger"
                  >
                    ❌ Reject Report
                  </button>
                </>
              )}
              <button
                onClick={() => setShowDetails(false)}
                className="btn btn-secondary"
              >
                ✖️ Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DamageReview;


