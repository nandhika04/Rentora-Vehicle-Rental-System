import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './context/AuthContext';

// Attractive styles
const styles = {
  container: {
    maxWidth: '500px',
    margin: '2.5rem auto',
    background: 'linear-gradient(120deg, #eaf2ff 0%, #f8fafc 100%)',
    borderRadius: '20px',
    boxShadow: '0 4px 24px rgba(44,62,80,0.13)',
    padding: '2.5rem 2rem',
    textAlign: 'center',
    fontFamily: 'Poppins, sans-serif',
  },

  previewImg: {
    maxWidth: '200px',
    height: '130px',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(44,62,80,0.09)',
    objectFit: 'cover',
    background: '#eee',
    border: '2px solid #377dff',
  },
  previewBox: {
    width: '200px',
    height: '130px',
    background: '#f0f0f5',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#aaa',
    fontSize: '1.1rem',
    border: '2px dashed #b3c6ff',
  },
  btn: {
    background: '#377dff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '0.7rem 1.5rem',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    margin: '0.7rem 0.5rem 0.5rem 0',
    transition: 'background 0.2s, box-shadow 0.2s',
    boxShadow: '0 2px 8px rgba(44,62,80,0.07)',
  },
  btnPrimary: {
    background: 'linear-gradient(90deg, #4895ef 60%, #377dff 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '0.8rem 2rem',
    fontWeight: 700,
    fontSize: '1.1rem',
    cursor: 'pointer',
    margin: '1.2rem 0 0 0',
    transition: 'background 0.2s, box-shadow 0.2s',
    boxShadow: '0 2px 12px rgba(44,62,80,0.09)',
    letterSpacing: '1px',
  },
  detect: {
    background: 'linear-gradient(90deg, #f8961e 60%, #f72585 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '0.7rem 1.5rem',
    fontWeight: 700,
    fontSize: '1rem',
    cursor: 'pointer',
    margin: '0.7rem 0',
    transition: 'background 0.2s, box-shadow 0.2s',
    boxShadow: '0 2px 8px rgba(44,62,80,0.07)',
    letterSpacing: '0.5px',
  },
  result: {
    margin: '1.2rem 0',
    color: '#f72585',
    fontWeight: 700,
    fontSize: '1.1rem',
    background: '#fff0f6',
    borderRadius: '8px',
    padding: '0.7rem 1rem',
    border: '1px solid #f8961e',
    boxShadow: '0 1px 6px rgba(44,62,80,0.07)',
  },
  label: {
    fontWeight: 600,
    color: '#377dff',
    marginBottom: '0.3rem',
    display: 'block',
    fontSize: '1rem',
  }
};

const DamageCapture = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const bookingId = location.state?.bookingId;
  const inspectionType = location.state?.type || 'pre-rental'; // 'pre-rental' or 'post-rental'

  const beforeInputRef = useRef(null);
  const afterInputRef = useRef(null);
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [beforePreview, setBeforePreview] = useState(null);
  const [afterPreview, setAfterPreview] = useState(null);
  const [damageResult, setDamageResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState({});
  const [penaltyAmount, setPenaltyAmount] = useState(0);
  const [showPenaltySection, setShowPenaltySection] = useState(false);
  const [repairDetails, setRepairDetails] = useState('');
  const [savingPenalty, setSavingPenalty] = useState(false);
  const [penaltySaved, setPenaltySaved] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Uploading inspection image:', file.name);
      const previewUrl = URL.createObjectURL(file);
      setPhotos({
        main: { file, previewUrl }
      });
      console.log('Photo uploaded successfully');
    }
  };

  // Debug component initialization
  useEffect(() => {
    console.log('DamageCapture component initialized');
    console.log('Inspection type:', inspectionType);
    console.log('Booking ID:', bookingId);
  }, [inspectionType, bookingId]);

  // Simulate AI damage detection (replace with real API call as needed)
  const handleDetectDamage = async () => {
    if (!photos.main) {
      alert('Please upload an inspection photo first');
      return;
    }

    setLoading(true);
    setDamageResult('');
    setShowPenaltySection(false);
    setPenaltyAmount(0);

    // Simulate AI analysis
    setTimeout(() => {
      // Mock AI analysis - in real app, send images to AI service
      const hasDamage = Math.random() > 0.7;
      const mockAnalysis = {
        detectedDamages: hasDamage ? [{
          location: 'vehicle exterior',
          description: 'Scratches and minor dents',
          severity: 'moderate'
        }] : [],
        overallAssessment: hasDamage ? 'Damage detected requiring repair' : 'No significant damage detected'
      };

      setDamageResult(mockAnalysis.overallAssessment);

      // For post-rental inspections, calculate penalty if damage detected
      if (inspectionType === 'post-rental' && hasDamage) {
        const calculatedPenalty = Math.floor(Math.random() * 5000) + 1000; // Random penalty between 1000-6000
        setPenaltyAmount(calculatedPenalty);
        setRepairDetails('Estimated repair cost for scratches and minor dents');
        setShowPenaltySection(true);
      }

      setLoading(false);
    }, 2000);
  };

  // Save damage report to backend
  const handleSaveReport = async (e) => {
    e.preventDefault();

    // Validation
    if (!bookingId) {
      alert('No booking selected. Please restart the inspection process.');
      return;
    }

    if (!user) {
      alert('Please login to save the inspection report.');
      return;
    }

    if (!photos.main) {
      alert('Please upload an inspection photo first.');
      return;
    }

    if (!damageResult) {
      alert('Please analyze the damage before saving the report.');
      return;
    }

    try {
      // Prepare photo data for single image
      const photoData = [{
        angle: 'main',
        url: photos.main.previewUrl // In production, upload to cloud storage first
      }];

      const reportData = {
        bookingId,
        type: inspectionType,
        photos: photoData
      };

      console.log('Sending damage report data:', reportData);

      const response = await axios.post('http://localhost:5000/api/damage-reports', reportData);

      if (response.data.success && response.data.damageReport) {
        const reportId = response.data.damageReport._id;

        // For post-rental inspections with penalty, save penalty details
        if (inspectionType === 'post-rental' && penaltyAmount > 0) {
          await handleSavePenaltyDetails(reportId);
        }

        alert('Damage report saved successfully!');
        if (inspectionType === 'post-rental' && penaltyAmount > 0) {
          setPenaltySaved(true);
        } else {
          navigate('/profile'); // Redirect to profile to view reports
        }
      } else {
        throw new Error(response.data.message || 'Damage report creation failed');
      }
    } catch (error) {
      console.error('Save report failed:', error);
      const errorMessage = error.response?.data?.message ||
                          error.message ||
                          'Failed to save report. Please try again.';
      alert(errorMessage);
    }
  };

  // Save penalty details for post-rental inspections
  const handleSavePenaltyDetails = async (reportId) => {
    try {
      setSavingPenalty(true);

      const reviewData = {
        confirmedDamages: [{
          location: 'vehicle exterior',
          description: repairDetails,
          severity: 'moderate'
        }],
        totalRepairCost: penaltyAmount,
        notes: `Post-rental inspection completed. Damage detected: ${repairDetails}. Penalty amount: ₹${penaltyAmount}`
      };

      const response = await axios.patch(`http://localhost:5000/api/damage-reports/${reportId}/review`, reviewData);

      console.log('Penalty details saved:', response.data);
      setSavingPenalty(false);
    } catch (error) {
      console.error('Failed to save penalty details:', error);
      setSavingPenalty(false);
      alert('Report saved but penalty details could not be processed.');
    }
  };

  // Handle penalty payment (admin only)
  const handleMarkPenaltyPaid = async () => {
    if (!bookingId) {
      alert('No booking selected.');
      return;
    }

    try {
      // Get the booking details to find the post-rental inspection
      const bookingResponse = await axios.get(`http://localhost:5000/api/bookings/${bookingId}`);
      const booking = bookingResponse.data.booking;

      if (!booking.postRentalInspection) {
        alert('No post-rental inspection found for this booking.');
        return;
      }

      const postRentalInspectionId = booking.postRentalInspection._id;

      // Admin marks penalty as paid using admin endpoint
      const response = await axios.patch(`http://localhost:5000/api/damage-reports/${postRentalInspectionId}/admin-mark-paid`);

      alert('Penalty marked as paid successfully!');
      navigate('/admindashboard'); // Redirect to admin dashboard
    } catch (error) {
      console.error('Failed to mark penalty as paid:', error);
      const errorMessage = error.response?.data?.message || 'Failed to mark penalty as paid. Please try again.';
      alert(errorMessage);
    }
  };

  return (
    <div style={styles.container}>

      <h2 style={{ color: '#377dff', fontWeight: 800, marginBottom: '0.5rem' }}>
        {inspectionType === 'pre-rental' ? 'Pre-Rental Inspection' : 'Post-Rental Inspection'}
      </h2>
      <p style={{ color: '#4a5568', marginBottom: '1.5rem' }}>
        Take a photo of the vehicle for inspection. Our AI will analyze and detect any damage automatically.
      </p>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <label style={styles.label}>
          Vehicle Inspection Photo
          {photos.main && <span style={{ color: '#10b981', marginLeft: '0.5rem' }}>✓</span>}
        </label>

        {photos.main ? (
          <div style={{ marginTop: '1rem' }}>
            <img
              src={photos.main.previewUrl}
              alt="Vehicle inspection"
              style={{...styles.previewImg, width: '300px', height: '200px', margin: '0 auto'}}
            />
          </div>
        ) : (
          <div style={{...styles.previewBox, width: '300px', height: '200px', margin: '1rem auto'}}>
            No inspection photo uploaded
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          ref={beforeInputRef}
        />

        <button
          type="button"
          style={styles.btn}
          onClick={() => beforeInputRef.current?.click()}
        >
          📷 {photos.main ? 'Retake Photo' : 'Take Inspection Photo'}
        </button>
      </div>

      <button
        type="button"
        style={styles.detect}
        onClick={handleDetectDamage}
        disabled={!photos.main || loading}
      >
        {loading ? 'Analyzing...' : 'Analyze Damage'}
      </button>

      {damageResult && (
        <div style={styles.result}>
          {damageResult}
        </div>
      )}

      {/* Penalty Section for Post-Rental Inspections */}
      {showPenaltySection && (
        <div style={{
          background: 'linear-gradient(120deg, #ffeaa7 0%, #fab1a0 100%)',
          borderRadius: '12px',
          padding: '1.5rem',
          margin: '1.5rem 0',
          border: '2px solid #e17055',
          boxShadow: '0 4px 12px rgba(225, 112, 85, 0.2)'
        }}>
          <h3 style={{
            color: '#d63031',
            fontWeight: 800,
            marginBottom: '1rem',
            textAlign: 'center',
            fontSize: '1.3rem'
          }}>
            🚨 Damage Penalty Assessment
          </h3>

          <div style={{
            background: '#fff',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
            border: '1px solid #ddd'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 600, color: '#2d3436' }}>Penalty Amount:</span>
              <span style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#d63031'
              }}>
                ₹{penaltyAmount.toLocaleString()}
              </span>
            </div>
            <div style={{ color: '#636e72', fontSize: '0.9rem' }}>
              <strong>Details:</strong> {repairDetails}
            </div>
          </div>

          {savingPenalty && (
            <div style={{
              background: '#ffeaa7',
              color: '#d63031',
              padding: '0.5rem',
              borderRadius: '4px',
              textAlign: 'center',
              marginBottom: '1rem'
            }}>
              💾 Saving penalty details...
            </div>
          )}

          {penaltySaved && (
            <div style={{
              background: '#55efc4',
              color: '#00b894',
              padding: '0.5rem',
              borderRadius: '4px',
              textAlign: 'center',
              marginBottom: '1rem'
            }}>
              ✅ Penalty details saved successfully!
            </div>
          )}

          {/* Payment Section for Admins */}
          {user && (user.role === 'admin' || user.role === 'staff') && penaltySaved && (
            <div style={{
              background: '#a29bfe',
              borderRadius: '8px',
              padding: '1rem',
              marginTop: '1rem'
            }}>
              <h4 style={{ color: '#6c5ce7', marginBottom: '0.5rem', fontWeight: 700 }}>
                💰 Payment Management
              </h4>
              <p style={{ color: '#a29bfe', marginBottom: '1rem', fontSize: '0.9rem' }}>
                Customer needs to pay ₹{penaltyAmount.toLocaleString()} for vehicle damage
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <button
                  type="button"
                  style={{
                    ...styles.btn,
                    background: '#00b894',
                    flex: 1
                  }}
                  onClick={handleMarkPenaltyPaid}
                >
                  ✅ Mark as Paid
                </button>
                <button
                  type="button"
                  style={{
                    ...styles.btn,
                    background: '#fdcb6e',
                    color: '#2d3436',
                    flex: 1
                  }}
                  onClick={() => navigate('/admindashboard')}
                >
                  📊 Back to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSaveReport}>
        <button
          type="submit"
          style={styles.btnPrimary}
          disabled={savingPenalty}
        >
          {savingPenalty ? '💾 Saving Report...' : 'Save Inspection Report'}
        </button>
      </form>
    </div>
  );
};

export default DamageCapture;


