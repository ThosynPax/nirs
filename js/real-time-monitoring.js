// Real-time Monitoring functionality
let alertInterval;
let isPaused = false;
let alertCount = 12;
let pendingReviews = 8;
let resolvedToday = 24;

document.addEventListener('DOMContentLoaded', function() {
    const user = AuthManager.requireAuth();
    initializeRealTimeMonitoring(user);
});

function initializeRealTimeMonitoring(user) {
    document.getElementById('userName').textContent = user.name;
    startAlertStream();
    updateStats();
    setupNavigation();
}

function startAlertStream() {
    // Initial alerts
    generateInitialAlerts();
    
    // Stream new alerts every 5-15 seconds
    alertInterval = setInterval(() => {
        if (!isPaused) {
            generateNewAlert();
        }
    }, Math.random() * 10000 + 5000);
}

function generateInitialAlerts() {
    const initialAlerts = [
        {
            id: 1,
            type: 'high_risk',
            title: 'High Value Transaction',
            description: 'Transaction exceeding ₦5,000,000 detected',
            institution: 'Bank B',
            amount: '₦7,500,000',
            risk: 'high',
            timestamp: new Date(Date.now() - 120000).toISOString()
        },
        {
            id: 2,
            type: 'suspicious_pattern',
            title: 'Rapid Successive Transfers',
            description: 'Multiple transfers to same recipient within 5 minutes',
            institution: 'Bank A',
            amount: '₦2,300,000',
            risk: 'medium',
            timestamp: new Date(Date.now() - 180000).toISOString()
        },
        {
            id: 3,
            type: 'compliance_violation',
            title: 'KYC Documentation Missing',
            description: 'New account with incomplete documentation',
            institution: 'Bank C',
            amount: 'N/A',
            risk: 'high',
            timestamp: new Date(Date.now() - 240000).toISOString()
        }
    ];

    initialAlerts.forEach(alert => addAlertToFeed(alert));
}

function generateNewAlert() {
    const alertTypes = [
        {
            type: 'high_risk',
            title: 'High Value Transaction',
            descriptions: [
                'Transaction exceeding ₦5,000,000 detected',
                'Large cash withdrawal from new account',
                'Cross-border transfer above threshold'
            ],
            risk: 'high'
        },
        {
            type: 'suspicious_pattern',
            title: 'Suspicious Activity',
            descriptions: [
                'Rapid successive transfers detected',
                'Unusual transaction timing patterns',
                'Multiple accounts from same IP'
            ],
            risk: 'medium'
        },
        {
            type: 'compliance_violation',
            title: 'Compliance Issue',
            descriptions: [
                'KYC documentation incomplete',
                'Sanctions list match found',
                'Regulatory filing overdue'
            ],
            risk: 'high'
        }
    ];

    const institutions = ['Bank A', 'Bank B', 'Bank C', 'Bank D'];
    const randomType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const randomInstitution = institutions[Math.floor(Math.random() * institutions.length)];
    
    const alert = {
        id: Date.now(),
        type: randomType.type,
        title: randomType.title,
        description: randomType.descriptions[Math.floor(Math.random() * randomType.descriptions.length)],
        institution: randomInstitution,
        amount: `₦${(Math.random() * 10000000 + 1000000).toLocaleString('en-NG', {maximumFractionDigits: 0})}`,
        risk: randomType.risk,
        timestamp: new Date().toISOString()
    };

    addAlertToFeed(alert);
    updateStats();
}

function addAlertToFeed(alert) {
    const feed = document.getElementById('alertFeed');
    const alertElement = document.createElement('div');
    
    const riskColors = {
        high: 'red',
        medium: 'yellow',
        low: 'green'
    };

    const color = riskColors[alert.risk];
    
    alertElement.className = `p-3 border-l-4 border-${color}-500 bg-${color}-50 rounded-lg fade-in`;
    alertElement.innerHTML = `
        <div class="flex justify-between items-start mb-2">
            <div class="flex items-center space-x-2">
                <span class="w-2 h-2 bg-${color}-500 rounded-full"></span>
                <span class="font-semibold text-${color}-800">${alert.title}</span>
            </div>
            <span class="text-xs text-gray-500">${new Date(alert.timestamp).toLocaleTimeString()}</span>
        </div>
        <p class="text-sm text-gray-700 mb-2">${alert.description}</p>
        <div class="flex justify-between text-xs text-gray-600">
            <span>${alert.institution}</span>
            <span>${alert.amount}</span>
        </div>
        <div class="mt-2 flex space-x-2">
            <button onclick="acknowledgeAlert(${alert.id})" class="text-xs bg-${color}-600 text-white px-2 py-1 rounded">Acknowledge</button>
            <button onclick="investigateAlert(${alert.id})" class="text-xs border border-${color}-600 text-${color}-600 px-2 py-1 rounded">Investigate</button>
        </div>
    `;

    // Add to top of feed
    feed.insertBefore(alertElement, feed.firstChild);
    
    // Update counters
    alertCount++;
    document.getElementById('liveAlertCount').textContent = alertCount;
    
    // Show notification
    Utils.showNotification(`New alert: ${alert.title}`, alert.risk === 'high' ? 'error' : 'info');
}

function updateStats() {
    // Simulate dynamic stat changes
    const trendUp = Math.random() > 0.5;
    const change = Math.floor(Math.random() * 3) + 1;
    
    document.getElementById('alertTrend').textContent = trendUp ? `↑ ${change} from yesterday` : `↓ ${change} from yesterday`;
    document.getElementById('alertTrend').className = `mt-2 text-sm ${trendUp ? 'text-red-600' : 'text-green-600'}`;
    
    document.getElementById('reviewTrend').textContent = `↑ ${Math.floor(Math.random() * 2) + 1} new`;
    document.getElementById('resolveTrend').textContent = `↑ ${Math.floor(Math.random() * 10) + 10}% efficiency`;
    document.getElementById('responseTrend').textContent = `↓ ${(Math.random() * 0.5).toFixed(1)}m faster`;
    
    document.getElementById('responseTime').textContent = `${(Math.random() * 1 + 1.5).toFixed(1)}m`;
}

function pauseAlerts() {
    isPaused = !isPaused;
    const button = event.target;
    button.textContent = isPaused ? 'Resume Feed' : 'Pause Feed';
    button.className = isPaused ? 
        'flex-1 bg-green-600 text-white py-2 rounded' : 
        'flex-1 bg-gray-600 text-white py-2 rounded';
    
    Utils.showNotification(isPaused ? 'Alert feed paused' : 'Alert feed resumed', 'info');
}

function clearAlerts() {
    document.getElementById('alertFeed').innerHTML = '';
    alertCount = 0;
    document.getElementById('liveAlertCount').textContent = '0';
    Utils.showNotification('All alerts cleared', 'success');
}

function acknowledgeAlert(alertId) {
    const alertElement = event.target.closest('.fade-in');
    alertElement.style.opacity = '0.5';
    alertElement.querySelector('button').textContent = 'Acknowledged';
    alertElement.querySelector('button').disabled = true;
    
    alertCount = Math.max(0, alertCount - 1);
    document.getElementById('liveAlertCount').textContent = alertCount;
    resolvedToday++;
    document.getElementById('resolvedToday').textContent = resolvedToday;
    
    Utils.showNotification('Alert acknowledged', 'success');
}

function investigateAlert(alertId) {
    Utils.showNotification('Opening investigation panel...', 'info');
    // In real app, this would open detailed investigation
}

function generateReport() {
    Utils.showNotification('Generating alert report...', 'success');
    // Report generation logic
}

function escalateAlerts() {
    Utils.showNotification('Critical alerts escalated to supervisors', 'info');
}

function acknowledgeAll() {
    document.querySelectorAll('.fade-in').forEach(alert => {
        const button = alert.querySelector('button');
        if (button) {
            button.textContent = 'Acknowledged';
            button.disabled = true;
        }
    });
    alertCount = 0;
    document.getElementById('liveAlertCount').textContent = '0';
    Utils.showNotification('All alerts acknowledged', 'success');
}

function configureAlerts() {
    Utils.showNotification('Opening alert configuration...', 'info');
}

// Cleanup on page leave
window.addEventListener('beforeunload', () => {
    if (alertInterval) {
        clearInterval(alertInterval);
    }
});

function setupNavigation() {
    Navigation.setupNavigation();
}