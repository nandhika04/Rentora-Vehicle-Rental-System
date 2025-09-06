import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { computeImageDiff, classifyDamageType, getPrimaryDamageRegion } from './utils/imageDiff';
import { callHostedVisionAPI, getAvailableAIServices, validateServiceConfig } from './utils/hostedVision';
import './bike.css';

const DamageCapture = () => {
  const navigate = useNavigate();
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [beforeCanvas, setBeforeCanvas] = useState(null);
  const [afterCanvas, setAfterCanvas] = useState(null);
  const [diffResult, setDiffResult] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAIService, setSelectedAIService] = useState('roboflow');
  const [damageReport, setDamageReport] = useState({
    vehicleId: '',
    vehicleType: 'car',
    description: '',
    estimatedCost: '',
    severity: 'low'
  });

  const beforeCanvasRef = useRef(null);
  const afterCanvasRef = useRef(null);
  const diffCanvasRef = useRef(null);
  const beforeFileInputRef = useRef(null);
  const afterFileInputRef = useRef(null);

  const availableServices = getAvailableAIServices();

  useEffect(() => {
    if (beforeCanvasRef.current && afterCanvasRef.current) {
      setBeforeCanvas(beforeCanvasRef.current);
      setAfterCanvas(afterCanvasRef.current);
    }
  }, []);

  const handleImageUpload = (file, type) => {
    if (!file) return;
    
    const canvas = type === 'before' ? beforeCanvasRef.current : afterCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Clear canvas and draw image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      if (type === 'before') {
        setBeforeImage(file);
        setBeforeCanvas(canvas);
      } else {
        setAfterImage(file);
        setAfterCanvas(canvas);
      }
    };
    
    img.src = URL.createObjectURL(file);
  };

  const handleCanvasClick = (type) => {
    // Trigger file input when canvas is clicked
    if (type === 'before') {
      beforeFileInputRef.current?.click();
    } else {
      afterFileInputRef.current?.click();
    }
  };

  const handleFileInputChange = (e, type) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, type);
    }
  };

  const handleComputeDiff = () => {
    if (!beforeCanvas || !afterCanvas) {
      alert('Please upload both before and after images');
      return;
    }

    setIsProcessing(true);
    
    try {
      const result = computeImageDiff(beforeCanvas, afterCanvas);
      
      // Classify damage types for each region
      const classifiedRegions = result.regions.map(region => ({
        ...region,
        classification: classifyDamageType(region)
      }));
      
      const finalResult = {
        ...result,
        regions: classifiedRegions
      };
      
      setDiffResult(finalResult);
      
      // Draw the diff result on the diff canvas
      if (diffCanvasRef.current && result.diffCanvas) {
        const diffCtx = diffCanvasRef.current.getContext('2d');
        diffCanvasRef.current.width = result.diffCanvas.width;
        diffCanvasRef.current.height = result.diffCanvas.height;
        
        // Clear the canvas first
        diffCtx.clearRect(0, 0, diffCanvasRef.current.width, diffCanvasRef.current.height);
        
        // Draw the diff image
        diffCtx.drawImage(result.diffCanvas, 0, 0);
        
        // Draw bounding boxes around detected regions
        if (classifiedRegions.length > 0) {
          diffCtx.strokeStyle = '#00ff00';
          diffCtx.lineWidth = 3;
          diffCtx.font = '16px Arial';
          diffCtx.fillStyle = '#00ff00';
          
          classifiedRegions.forEach((region, index) => {
            const { boundingBox } = region;
            if (boundingBox) {
              // Draw rectangle around damage
              diffCtx.strokeRect(
                boundingBox.minX, 
                boundingBox.minY, 
                boundingBox.width, 
                boundingBox.height
              );
              
              // Add label
              const label = `${region.classification.type} ${index + 1}`;
              const textWidth = diffCtx.measureText(label).width;
              
              // Background for text
              diffCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
              diffCtx.fillRect(
                boundingBox.minX, 
                boundingBox.minY - 25, 
                textWidth + 10, 
                25
              );
              
              // Text
              diffCtx.fillStyle = '#ffffff';
              diffCtx.fillText(
                label, 
                boundingBox.minX + 5, 
                boundingBox.minY - 8
              );
            }
          });
        }
      }
      
    } catch (error) {
      console.error('Error computing diff:', error);
      alert('Error computing image difference');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAIDetect = async () => {
    if (!afterImage) {
      alert('Please upload an after image for AI analysis');
      return;
    }

    if (!validateServiceConfig(selectedAIService)) {
      alert(`Please configure ${selectedAIService} API key in your environment variables`);
      return;
    }

    setIsProcessing(true);
    
    try {
      const result = await callHostedVisionAPI(afterImage, {
        service: selectedAIService,
        confidence: 0.6
      });
      
      setAiResult(result);
      
      // Update damage report with AI findings
      if (result.damageDetected) {
        setDamageReport(prev => ({
          ...prev,
          severity: result.confidence > 0.8 ? 'high' : result.confidence > 0.6 ? 'medium' : 'low',
          description: `${prev.description} ${result.message}`.trim()
        }));
      }
      
    } catch (error) {
      console.error('AI detection error:', error);
      alert(`AI detection failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveReport = () => {
    if (!diffResult && !aiResult) {
      alert('Please compute damage detection first');
      return;
    }

    const report = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...damageReport,
      beforeImage: beforeImage ? URL.createObjectURL(beforeImage) : null,
      afterImage: afterImage ? URL.createObjectURL(afterImage) : null,
      diffResult,
      aiResult,
      status: 'pending_review'
    };

    // Save to localStorage
    const existingReports = JSON.parse(localStorage.getItem('damageReports') || '[]');
    existingReports.push(report);
    localStorage.setItem('damageReports', JSON.stringify(existingReports));

    alert('Damage report saved successfully!');
    navigate('/damage/review');
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getSeverityText = (score) => {
    if (score >= 70) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
  };

  return (
    <div className="damage-capture-page">
      <div className="container">
        <h1 className="page-title">Vehicle Damage Detection</h1>
        <p className="page-subtitle">Capture before and after images to detect damage automatically</p>

        <div className="capture-grid">
          {/* Before Image */}
          <div className="image-section">
            <h3>Before Image</h3>
            <div className="image-upload-area">
              <canvas
                ref={beforeCanvasRef}
                className="image-canvas"
                style={{ 
                  border: '2px dashed #ccc',
                  cursor: 'pointer',
                  backgroundColor: '#f8f9fa'
                }}
                onClick={() => handleCanvasClick('before')}
                title="Click to upload before image"
              />
              <input
                ref={beforeFileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileInputChange(e, 'before')}
                className="image-input"
                style={{ display: 'none' }}
              />
              <p className="upload-hint">Click the canvas above to upload before image</p>
            </div>
          </div>

          {/* After Image */}
          <div className="image-section">
            <h3>After Image</h3>
            <div className="image-upload-area">
              <canvas
                ref={afterCanvasRef}
                className="image-canvas"
                style={{ 
                  border: '2px dashed #ccc',
                  cursor: 'pointer',
                  backgroundColor: '#f8f9fa'
                }}
                onClick={() => handleCanvasClick('after')}
                title="Click to upload after image"
              />
              <input
                ref={afterFileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileInputChange(e, 'after')}
                className="image-input"
                style={{ display: 'none' }}
              />
              <p className="upload-hint">Click the canvas above to upload after image</p>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="control-buttons">
          <button
            onClick={handleComputeDiff}
            disabled={!beforeImage || !afterImage || isProcessing}
            className="btn btn-primary"
          >
            {isProcessing ? 'Processing...' : 'Detect Damage'}
          </button>

          {availableServices.length > 0 && (
            <div className="ai-controls">
              <select
                value={selectedAIService}
                onChange={(e) => setSelectedAIService(e.target.value)}
                className="ai-service-select"
              >
                {availableServices.map(service => (
                  <option key={service} value={service}>
                    {service.charAt(0).toUpperCase() + service.slice(1)} AI
                  </option>
                ))}
              </select>
              <button
                onClick={handleAIDetect}
                disabled={!afterImage || isProcessing}
                className="btn btn-secondary"
              >
                {isProcessing ? 'AI Analyzing...' : 'AI Detect'}
              </button>
            </div>
          )}
        </div>

        {/* Results Display */}
        {diffResult && (
          <div className="results-section">
            <h3>Damage Detection Results</h3>
            
            {/* Severity Score */}
            <div className="severity-display">
              <div className="severity-score">
                <span className="score-label">Severity Score:</span>
                <span 
                  className="score-value"
                  style={{ color: getSeverityColor(getSeverityText(diffResult.severityScore).toLowerCase()) }}
                >
                  {diffResult.severityScore}/100
                </span>
                <span className="severity-level">
                  ({getSeverityText(diffResult.severityScore)})
                </span>
              </div>
              <div className="damage-percentage">
                Damage Area: {diffResult.damagePercentage.toFixed(2)}%
              </div>
            </div>

            {/* Diff Canvas */}
            <div className="diff-display">
              <h4>Damage Visualization</h4>
              <div className="canvas-container">
                <canvas
                  ref={diffCanvasRef}
                  className="diff-canvas"
                  style={{
                    maxWidth: '100%',
                    border: '1px solid #ddd',
                    borderRadius: '8px'
                  }}
                />
              </div>
            </div>

            {/* Damage Regions */}
            <div className="damage-regions">
              <h4>Damage Analysis Summary</h4>
              <div className="damage-summary">
                <div className="summary-item">
                  <span className="summary-label">Total Damage Regions:</span>
                  <span className="summary-value">{diffResult.regions.length}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Primary Damage Type:</span>
                  <span className="summary-value">
                    {diffResult.regions.length > 0 
                      ? diffResult.regions[0].classification.type.replace('_', ' ')
                      : 'None detected'
                    }
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Largest Region:</span>
                  <span className="summary-value">
                    {diffResult.regions.length > 0 
                      ? `${diffResult.regions[0].area} pixels`
                      : 'N/A'
                    }
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Average Severity:</span>
                  <span className="summary-value">
                    {diffResult.regions.length > 0 
                      ? Math.round(diffResult.regions.reduce((sum, r) => sum + r.severity, 0) / diffResult.regions.length)
                      : 'N/A'
                    }
                  </span>
                </div>
              </div>
              
              {/* Show only significant regions (max 5) */}
              {diffResult.regions.length > 0 && diffResult.regions.length <= 5 && (
                <div className="regions-detail">
                  <h5>Detected Damage Details:</h5>
                  <div className="regions-grid">
                    {diffResult.regions.map((region, index) => (
                      <div key={index} className="region-card">
                        <div className="region-header">
                          <span className="region-number">#{index + 1}</span>
                          <span className="damage-type">
                            {region.classification.type.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="region-details">
                          <p>Area: {region.area} pixels</p>
                          <p>Severity: {Math.round(region.severity)}</p>
                          <p>Confidence: {region.classification.confidence}%</p>
                          <p className="damage-description">
                            {region.classification.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Show summary for many regions */}
              {diffResult.regions.length > 5 && (
                <div className="regions-summary">
                  <p className="summary-note">
                    <strong>Note:</strong> {diffResult.regions.length} damage regions detected. 
                    Showing top 5 most significant regions. All regions are included in the damage report.
                  </p>
                  <div className="regions-grid">
                    {diffResult.regions.slice(0, 5).map((region, index) => (
                      <div key={index} className="region-card">
                        <div className="region-header">
                          <span className="region-number">#{index + 1}</span>
                          <span className="damage-type">
                            {region.classification.type.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="region-details">
                          <p>Area: {region.area} pixels</p>
                          <p>Severity: {Math.round(region.severity)}</p>
                          <p>Confidence: {region.classification.confidence}%</p>
                          <p className="damage-description">
                            {region.classification.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* AI Results */}
        {aiResult && (
          <div className="ai-results-section">
            <h3>AI Analysis Results</h3>
            <div className="ai-result-card">
              <div className="ai-source">
                <span className="source-label">AI Service:</span>
                <span className="source-name">{aiResult.source}</span>
              </div>
              <div className="ai-message">{aiResult.message}</div>
              <div className="ai-confidence">
                Confidence: {(aiResult.confidence * 100).toFixed(1)}%
              </div>
              
              {aiResult.regions.length > 0 && (
                <div className="ai-regions">
                  <h4>AI Detected Regions:</h4>
                  <div className="ai-regions-list">
                    {aiResult.regions.map((region, index) => (
                      <div key={index} className="ai-region-item">
                        <span className="region-type">{region.type}</span>
                        <span className="region-confidence">
                          {(region.confidence * 100).toFixed(1)}%
                        </span>
                        {region.description && (
                          <span className="region-description">{region.description}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Damage Report Form */}
        <div className="damage-report-form">
          <h3>Damage Report Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Vehicle ID:</label>
              <input
                type="text"
                value={damageReport.vehicleId}
                onChange={(e) => setDamageReport(prev => ({...prev, vehicleId: e.target.value}))}
                placeholder="Enter vehicle ID"
              />
            </div>
            
            <div className="form-group">
              <label>Vehicle Type:</label>
              <select
                value={damageReport.vehicleType}
                onChange={(e) => setDamageReport(prev => ({...prev, vehicleType: e.target.value}))}
              >
                <option value="car">Car</option>
                <option value="bike">Bike</option>
                <option value="suv">SUV</option>
                <option value="truck">Truck</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={damageReport.description}
                onChange={(e) => setDamageReport(prev => ({...prev, description: e.target.value}))}
                placeholder="Describe the damage..."
                rows="3"
              />
            </div>
            
            <div className="form-group">
              <label>Estimated Cost (₹):</label>
              <input
                type="number"
                value={damageReport.estimatedCost}
                onChange={(e) => setDamageReport(prev => ({...prev, estimatedCost: e.target.value}))}
                placeholder="Enter estimated repair cost"
              />
            </div>
            
            <div className="form-group">
              <label>Severity Level:</label>
              <select
                value={damageReport.severity}
                onChange={(e) => setDamageReport(prev => ({...prev, severity: e.target.value}))}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            onClick={handleSaveReport}
            disabled={!diffResult && !aiResult}
            className="btn btn-success"
          >
            Save Damage Report
          </button>
          
          <button
            onClick={() => navigate('/damage/review')}
            className="btn btn-info"
          >
            View All Reports
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="btn btn-secondary"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default DamageCapture;


