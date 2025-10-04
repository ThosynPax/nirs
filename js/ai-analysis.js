// AI Analysis functionality
let riskChart, featureChart;

document.addEventListener('DOMContentLoaded', function() {
    const user = AuthManager.requireAuth();
    initializeAIAnalysis(user);
});

function initializeAIAnalysis(user) {
    document.getElementById('userName').textContent = user.name;
    setupNavigation();
    
    // Show empty state initially
    showEmptyState();
}

function runAnalysis() {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const progressContainer = document.getElementById('progressContainer');
    
    // Show loading state
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = '<div class="loading-spinner"></div><span>Analyzing...</span>';
    progressContainer.classList.remove('hidden');

    // Simulate API call
    setTimeout(() => {
        const results = generateAnalysisResults();
        displayResults(results);
        
        // Reset button
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = '<span>🤖</span><span>Run AI Analysis</span>';
        progressContainer.classList.add('hidden');
        
    }, 2000);
}

function generateAnalysisResults() {
    const data = DataStore.getData();
    
    // Calculate risk distribution
    const riskDistribution = {
        low: data.filter(item => item.risk_score <= 0.3).length,
        medium: data.filter(item => item.risk_score > 0.3 && item.risk_score <= 0.7).length,
        high: data.filter(item => item.risk_score > 0.7).length
    };

    // Generate feature importance
    const features = ['Amount', 'Risk Score', 'Time Pattern', 'Institution', 'Historical Data'];
    const featureImportance = features.map(() => Math.random() * 0.3 + 0.1);
    const total = featureImportance.reduce((sum, val) => sum + val, 0);
    const normalizedImportance = featureImportance.map(val => (val / total) * 100);

    // Generate predictions
    const predictions = data.slice(0, 5).map(item => ({
        transaction_id: item.transaction_id,
        actual_risk: item.risk_score,
        predicted_risk: Math.min(1, Math.max(0, item.risk_score + (Math.random() - 0.5) * 0.2)),
        confidence: Math.random() * 0.3 + 0.7
    }));

    // Generate anomalies
    const anomalies = data
        .filter(item => item.risk_score > 0.7 || item.amount > 1000000)
        .slice(0, 3)
        .map(item => ({
            ...item,
            anomaly_type: item.amount > 1000000 ? 'High Value' : 'High Risk',
            confidence: Math.random() * 0.2 + 0.8
        }));

    return {
        riskDistribution,
        featureImportance: normalizedImportance,
        features,
        predictions,
        anomalies,
        modelAccuracy: (Math.random() * 0.2 + 0.8).toFixed(3)
    };
}

function displayResults(results) {
    // Hide empty state and show results
    document.getElementById('emptyState').classList.add('hidden');
    document.getElementById('resultsSection').classList.remove('hidden');

    // Create charts
    createRiskChart(results.riskDistribution);
    createFeatureChart(results.features, results.featureImportance);
    
    // Display predictions
    displayPredictions(results.predictions);
    
    // Display anomalies
    displayAnomalies(results.anomalies);
}

function createRiskChart(distribution) {
    const ctx = document.getElementById('riskChart').getContext('2d');
    
    if (riskChart) {
        riskChart.destroy();
    }

    riskChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Low Risk', 'Medium Risk', 'High Risk'],
            datasets: [{
                data: [distribution.low, distribution.medium, distribution.high],
                backgroundColor: [
                    '#10B981', // green
                    '#F59E0B', // yellow
                    '#EF4444'  // red
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw} transactions`;
                        }
                    }
                }
            }
        }
    });
}

function createFeatureChart(features, importance) {
    const ctx = document.getElementById('featureChart').getContext('2d');
    
    if (featureChart) {
        featureChart.destroy();
    }

    featureChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: features,
            datasets: [{
                label: 'Importance (%)',
                data: importance,
                backgroundColor: '#3B82F6',
                borderColor: '#1D4ED8',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Importance (%)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function displayPredictions(predictions) {
    const container = document.getElementById('predictionsList');
    
    container.innerHTML = predictions.map(pred => `
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex-1">
                <div class="flex items-center space-x-2 mb-1">
                    <span class="text-sm font-medium">TX-${pred.transaction_id}</span>
                    <span class="text-xs px-2 py-1 rounded-full ${
                        pred.predicted_risk > 0.7 ? 'bg-red-100 text-red-800' :
                        pred.predicted_risk > 0.4 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                    }">
                        ${(pred.predicted_risk * 100).toFixed(0)}% risk
                    </span>
                </div>
                <div class="text-xs text-gray-600">
                    Confidence: ${(pred.confidence * 100).toFixed(1)}%
                </div>
            </div>
            <div class="text-right">
                <div class="text-xs text-gray-500">Actual</div>
                <div class="text-sm font-medium">${(pred.actual_risk * 100).toFixed(0)}%</div>
            </div>
        </div>
    `).join('');
}

function displayAnomalies(anomalies) {
    const container = document.getElementById('anomaliesList');
    
    if (anomalies.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <div class="text-4xl mb-2">🎉</div>
                <p>No anomalies detected in the current dataset</p>
            </div>
        `;
        return;
    }

    container.innerHTML = anomalies.map(anomaly => `
        <div class="border border-red-200 rounded-lg p-4 bg-red-50">
            <div class="flex items-start justify-between mb-2">
                <div>
                    <span class="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                        ${anomaly.anomaly_type}
                    </span>
                    <span class="ml-2 text-sm font-medium">TX-${anomaly.transaction_id}</span>
                </div>
                <span class="text-xs text-red-600 font-semibold">
                    ${(anomaly.confidence * 100).toFixed(0)}% confidence
                </span>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                    <span class="text-gray-600">Amount:</span>
                    <div class="font-medium">${Utils.formatCurrency(anomaly.amount)}</div>
                </div>
                <div>
                    <span class="text-gray-600">Risk Score:</span>
                    <div class="font-medium">${anomaly.risk_score.toFixed(2)}</div>
                </div>
                <div>
                    <span class="text-gray-600">Institution:</span>
                    <div class="font-medium">${anomaly.institution}</div>
                </div>
                <div>
                    <span class="text-gray-600">Date:</span>
                    <div class="font-medium">${Utils.formatDate(anomaly.timestamp)}</div>
                </div>
            </div>
        </div>
    `).join('');
}

function generateInsights() {
    const data = DataStore.getData();
    
    if (data.length === 0) {
        Utils.showNotification('No data available for insights', 'error');
        return;
    }

    // Generate mock insights
    const insights = [
        "High-value transactions (> ₦1M) show 45% higher risk scores",
        "Transactions between 2-4 AM have 3x anomaly probability",
        "Bank C shows 25% lower compliance rate than industry average",
        "Weekend transactions are 60% more likely to be flagged",
        "Risk scores above 0.8 correlate with 90% fraud probability"
    ];

    const randomInsight = insights[Math.floor(Math.random() * insights.length)];
    
    Utils.showNotification(`💡 Insight: ${randomInsight}`, 'success');
}

function showEmptyState() {
    document.getElementById('emptyState').classList.remove('hidden');
    document.getElementById('resultsSection').classList.add('hidden');
}

function setupNavigation() {
    Navigation.setupNavigation();
}