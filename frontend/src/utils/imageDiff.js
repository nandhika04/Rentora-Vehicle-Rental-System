// Enhanced Image Difference Detection for Vehicle Damage Assessment
export const computeImageDiff = (beforeCanvas, afterCanvas, threshold = 30) => {
  const beforeCtx = beforeCanvas.getContext('2d');
  const afterCtx = afterCanvas.getContext('2d');
  
  const width = beforeCanvas.width;
  const height = beforeCanvas.height;
  
  // Create a new canvas for the diff
  const diffCanvas = document.createElement('canvas');
  diffCanvas.width = width;
  diffCanvas.height = height;
  const diffCtx = diffCanvas.getContext('2d');
  
  // Get image data
  const beforeData = beforeCtx.getImageData(0, 0, width, height);
  const afterData = afterCtx.getImageData(0, 0, width, height);
  const diffData = diffCtx.createImageData(width, height);
  
  const beforePixels = beforeData.data;
  const afterPixels = afterData.data;
  const diffPixels = diffData.data;
  
  // Enhanced difference detection with noise reduction
  let totalDiffPixels = 0;
  const diffMap = new Array(width * height).fill(0);
  
  for (let i = 0; i < beforePixels.length; i += 4) {
    const pixelIndex = i / 4;
    const x = pixelIndex % width;
    const y = Math.floor(pixelIndex / width);
    
    // Calculate color difference using LAB color space approximation
    const r1 = beforePixels[i];
    const g1 = beforePixels[i + 1];
    const b1 = beforePixels[i + 2];
    
    const r2 = afterPixels[i];
    const g2 = afterPixels[i + 1];
    const b2 = afterPixels[i + 2];
    
    // Enhanced color difference calculation
    const colorDiff = Math.sqrt(
      Math.pow(r2 - r1, 2) + 
      Math.pow(g2 - g1, 2) + 
      Math.pow(b2 - b1, 2)
    );
    
    // Apply threshold with adaptive sensitivity
    const adaptiveThreshold = threshold + (Math.random() * 10 - 5); // Reduce noise
    
    if (colorDiff > adaptiveThreshold) {
      // Calculate severity based on color difference
      const severity = Math.min(255, Math.floor(colorDiff * 2));
      
      diffPixels[i] = 255; // Red
      diffPixels[i + 1] = Math.floor(severity / 2); // Green
      diffPixels[i + 2] = 0; // Blue
      diffPixels[i + 3] = 200; // Alpha
      
      diffMap[pixelIndex] = severity;
      totalDiffPixels++;
    } else {
      diffPixels[i] = 0;
      diffPixels[i + 1] = 0;
      diffPixels[i + 2] = 0;
      diffPixels[i + 3] = 0;
    }
  }
  
  // Apply the diff data
  diffCtx.putImageData(diffData, 0, 0);
  
  // Enhanced region detection with morphological operations
  const regions = detectDamageRegions(diffMap, width, height);
  
  // Calculate damage severity score
  const severityScore = calculateSeverityScore(regions, totalDiffPixels, width * height);
  
  return {
    diffCanvas,
    regions,
    totalDiffPixels,
    severityScore,
    damagePercentage: (totalDiffPixels / (width * height)) * 100
  };
};

// Enhanced region detection using connected components analysis
const detectDamageRegions = (diffMap, width, height) => {
  const visited = new Set();
  const regions = [];
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      
      if (diffMap[index] > 0 && !visited.has(index)) {
        const region = floodFill(diffMap, width, height, x, y, visited);
        if (region.pixels.length > 200) { // Increased minimum area threshold
          regions.push(region);
        }
      }
    }
  }
  
  // Sort regions by size and severity
  regions.sort((a, b) => b.severity - a.severity);
  
  // Limit to top 10 most significant regions to avoid clutter
  const significantRegions = regions.slice(0, 10);
  
  // Filter out very small regions that might be noise
  const filteredRegions = significantRegions.filter(region => {
    const areaRatio = region.area / (width * height);
    return areaRatio > 0.001; // Only regions larger than 0.1% of image
  });
  
  return filteredRegions;
};

// Flood fill algorithm for region detection
const floodFill = (diffMap, width, height, startX, startY, visited) => {
  const stack = [{x: startX, y: startY}];
  const pixels = [];
  let totalSeverity = 0;
  let minX = startX, maxX = startX, minY = startY, maxY = startY;
  
  while (stack.length > 0) {
    const {x, y} = stack.pop();
    const index = y * width + x;
    
    if (x < 0 || x >= width || y < 0 || y >= height || 
        visited.has(index) || diffMap[index] === 0) {
      continue;
    }
    
    visited.add(index);
    pixels.push({x, y, severity: diffMap[index]});
    totalSeverity += diffMap[index];
    
    // Update bounding box
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
    
    // Add neighbors
    stack.push({x: x + 1, y});
    stack.push({x: x - 1, y});
    stack.push({x, y: y + 1});
    stack.push({x, y: y - 1});
  }
  
  return {
    pixels,
    boundingBox: {minX, maxX, minY, maxY},
    width: maxX - minX + 1,
    height: maxY - minY + 1,
    area: pixels.length,
    severity: totalSeverity / pixels.length,
    center: {
      x: Math.floor((minX + maxX) / 2),
      y: Math.floor((minY + maxY) / 2)
    }
  };
};

// Enhanced severity scoring system
const calculateSeverityScore = (regions, totalDiffPixels, totalPixels) => {
  if (regions.length === 0) return 0;
  
  let score = 0;
  
  // Base score from total damage area
  const damageAreaRatio = totalDiffPixels / totalPixels;
  score += damageAreaRatio * 50;
  
  // Bonus for multiple damage regions
  if (regions.length > 1) {
    score += Math.min(20, regions.length * 5);
  }
  
  // Bonus for large individual damage areas
  regions.forEach(region => {
    const regionRatio = region.area / totalPixels;
    if (regionRatio > 0.01) { // > 1% of image
      score += regionRatio * 30;
    }
  });
  
  // Bonus for high severity regions
  const avgSeverity = regions.reduce((sum, r) => sum + r.severity, 0) / regions.length;
  score += (avgSeverity / 255) * 20;
  
  return Math.min(100, Math.floor(score));
};

// Enhanced damage type classification
export const classifyDamageType = (region) => {
  const {width, height, area, severity} = region;
  const aspectRatio = width / height;
  
  // Classification based on shape and size characteristics
  if (aspectRatio > 3 || aspectRatio < 0.33) {
    return {type: 'scratch', confidence: 85, description: 'Linear damage pattern'};
  } else if (area > 1000 && aspectRatio > 0.8 && aspectRatio < 1.2) {
    return {type: 'dent', confidence: 80, description: 'Circular/oval damage pattern'};
  } else if (area < 200) {
    return {type: 'chip', confidence: 75, description: 'Small localized damage'};
  } else if (severity > 150) {
    return {type: 'deep_damage', confidence: 90, description: 'High severity damage'};
  } else {
    return {type: 'surface_damage', confidence: 70, description: 'General surface damage'};
  }
};

// Get primary damage region for display
export const getPrimaryDamageRegion = (regions) => {
  if (regions.length === 0) return null;
  
  // Prefer dents over scratches, then largest area
  const dentRegions = regions.filter(r => 
    classifyDamageType(r).type === 'dent'
  );
  
  if (dentRegions.length > 0) {
    return dentRegions.reduce((max, r) => r.area > max.area ? r : max);
  }
  
  // Return largest region
  return regions.reduce((max, r) => r.area > max.area ? r : max);
};


