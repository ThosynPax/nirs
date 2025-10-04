// Predictive Analytics functionality
let riskChart;

document.addEventListener('DOMContentLoaded', function() {
    const user = AuthManager.requireAuth();
    initializePredictiveAnalytics(user);
});

function initializePredictiveAnalytics(user) {
    document.getElementById('userName').textContent = user.name;
    showEmptyState();
    setupNavigation();
}

function generatePredictions() {
    const forecastPeriod = parseInt(document.getElementById('forecastPeriod').value);
    const modelType = document.getElementById('modelType').value;
    const confidenceLevel = parseInt(document.getElementById('confidenceLevel').value);

    // Show loading
    document.getElementById('emptyState').classList.add('hidden');
    document.getElementById('resultsSection').classList.remove('hidden');

    // Simulate AI processing
    setTimeout(() => {
        const predictions = generatePredictionData(forecastPeriod, modelType, confidenceLevel);
        displayPredictions(predictions);
    }, 1500);
}

function generatePredictionData(period, type, confidence) {
    const data = DataStore.getData();
    const baseRisk = data.filter(d => d.risk_score > 0.7).length / data.length;
    
    // Generate forecast data
    const forecast = [];
    for (let i = 0; i < period; i++) {
        forecast.push({
            day: i + 1,
            risk: Math.min(1, baseRisk + (Math.random() - 0.5) * 0.2),
            volume: Math.floor(Math.random() * 1000) + 500,
            anomalies: Math.floor(Math.random() * 20) + 5
        });
    }

    // Calculate probabilities based on confidence
    const confidenceFactor = confidence / 100;
    
    return {
        forecast,
        probabilities: {
            volumeSpike: Math.floor((0.3 + Math.random() * 0.5) * 100 * confidenceFactor),
            institutionRisk: Math.floor((0.5 + Math.random() * 0.4) * 100 * confidenceFactor),
            weekendRisk: Math.floor((0.2 + Math.random() * 0.3) * 100 * confidenceFactor),
            crossBorderRisk: Math.floor((0.4 + Math.random() * 0.3) * 100 * confidenceFactor)
        },
        summary: {
            totalTransactions: forecast.reduce((sum, day) => sum + day.volume, 0),
            highRiskTransactions: Math.floor(forecast.reduce((sum, day) => sum + day.volume * day.risk, 0)),
            modelAccuracy: Math.floor(80 + Math.random() * 15)
        },
        recommendations: generateRecommendations(forecast, confidence)
    };
}

function displayPredictions(predictions) {
    // Update risk bars
    updateRiskBars(predictions.probabilities);
    
    // Update summary numbers
    document.getElementById('predictedTransactions').textContent = 
        predictions.summary.totalTransactions.toLocaleString();
    document.getElementById('predictedRisks').textContent = 
        predictions.summary.highRiskTransactions.toLocaleString();
    document.getElementById('modelAccuracy').textContent = 
        predictions.summary.modelAccuracy + '%';
    
    // Create forecast chart
    createForecastChart(predictions.forecast);
    
    // Display recommendations
    displayRecommendations(predictions.recommendations);
}

function updateRiskBars(probabilities) {
    const risks = [
        { id: 'volumeSpike', value: probabilities.volumeSpike },
        { id: 'institutionRisk', value: probabilities.institutionRisk },
        { id: 'weekendRisk', value: probabilities.weekendRisk },
        { id: 'crossBorderRisk', value: probabilities.crossBorderRisk }
    ];

    risks.forEach(risk => {
        const bar = document.getElementById(risk.id);
        const text = document.getElementById(risk.id + 'Text');
        
        if (bar && text) {
            bar.style.width = risk.value + '%';
            text.textContent = risk.value + '%';
            
            // Update color based on risk level
            let color = 'green';
            if (risk.value > 70) color = 'red';
            else if (risk.value > 50) color = 'yellow';
            else if (risk.value > 30) color = 'orange';
            
            bar.className = `bg-${color}-500 h-2 rounded-full`;
        }
    });
}

function createForecastChart(forecast) {
    const ctx = document.getElementById('riskForecastChart').getContext('2d');
    
    if (riskChart) {
        riskChart.destroy();
    }

    riskChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: forecast.map(day => `Day ${day.day}`),
            datasets: [
                {
                    label: 'Risk Level',
                    data: forecast.map(day => day.risk * 100),
                    borderColor: '#EF4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Transaction Volume',
                    data: forecast.map(day => day.volume / 10), // Scale for visibility
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Risk Level (%) / Volume (scaled)'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (context.datasetIndex === 0) {
                                return `Risk: ${context.raw.toFixed(1)}%`;
                            } else {
                                return `Volume: ${(context.raw * 10).toLocaleString()}`;
                            }
                        }
                    }
                }
            }
        }
    });
}

function generateRecommendations(forecast, confidence) {
    const avgRisk = forecast.reduce((sum, day) => sum + day.risk, 0) / forecast.length;
    const highRiskDays = forecast.filter(day => day.risk > 0.7).length;
    
    const recommendations = [];
    
    if (avgRisk > 0.6) {
        recommendations.push({
            type: 'high_risk',
            title: 'High Overall Risk Period',
            description: `Predicted ${highRiskDays} high-risk days in the forecast period`,
            action: 'Increase monitoring staff during peak risk days',
            priority: 'high'
        });
    }
    
    if (confidence < 90) {
        recommendations.push({
            type: 'confidence',
            title: 'Low Confidence Prediction',
            description: `Model confidence at ${confidence}%, consider conservative measures`,
            action: 'Validate predictions with additional data sources',
            priority: 'medium'
        });
    }
    
    // Always include these
    recommendations.push(
        {
            type: 'optimization',
            title: 'Model Optimization Opportunity',
            description: 'Consider retraining model with recent anomaly data',
            action: 'Schedule model retraining session',
            priority: 'medium'
        },
        {
            type: 'monitoring',
            title: 'Enhanced Monitoring Recommended',
            description: 'Predicted volume spikes detected in weekend periods',
            action: 'Activate weekend monitoring protocol',
            priority: 'low'
        }
    );

    return recommendations;
}

function displayRecommendations(recommendations) {
    const container = document.getElementById('recommendationsList');
    
    container.innerHTML = recommendations.map(rec => `
        <div class="flex items-start space-x-3 p-3 border-l-4 ${
            rec.priority === 'high' ? 'border-red-500 bg-red-50' :
            rec.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
            'border-green-500 bg-green-50'
        } rounded">
            <div class="flex-shrink-0 w-2 h-2 mt-2 ${
                rec.priority === 'high' ? 'bg-red-500' :
                rec.priority === 'medium' ? 'bg-yellow-500' :
                'bg-green-500'
            } rounded-full"></div>
            <div class="flex-1">
                <div class="font-semibold text-gray-900">${rec.title}</div>
                <div class="text-sm text-gray-600 mb-1">${rec.description}</div>
                <div class="text-sm font-medium text-blue-600">${rec.action}</div>
            </div>
            <button onclick="implementRecommendation('${rec.type}')" class="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                Implement
            </button>
        </div>
    `).join('');
}

function implementRecommendation(type) {
    Utils.showNotification(`Implementing recommendation: ${type}`, 'success');
    // In real app, this would trigger specific actions
}

function saveScenario() {
    const scenario = {
        forecastPeriod: document.getElementById('forecastPeriod').value,
        modelType: document.getElementById('modelType').value,
        confidenceLevel: document.getElementById('confidenceLevel').value,
        savedAt: new Date().toISOString()
    };
    
    // Save to localStorage
    const scenarios = JSON.parse(localStorage.getItem('prediction_scenarios')) || [];
    scenarios.push(scenario);
    localStorage.setItem('prediction_scenarios', JSON.stringify(scenarios));
    
    Utils.showNotification('Scenario saved successfully!', 'success');
}

function showEmptyState() {
    document.getElementById('emptyState').classList.remove('hidden');
    document.getElementById('resultsSection').classList.add('hidden');
}

function setupNavigation() {
    Navigation.setupNavigation();
}