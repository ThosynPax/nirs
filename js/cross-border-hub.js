// Cross-border Hub functionality
let exchangeHistory = [];

document.addEventListener('DOMContentLoaded', function() {
    const user = AuthManager.requireAuth();
    initializeCrossBorderHub(user);
});

function initializeCrossBorderHub(user) {
    document.getElementById('userName').textContent = user.name;
    loadExchangeHistory();
    setupNavigation();
}

function addJurisdiction() {
    const newJurisdiction = prompt('Enter new jurisdiction name (e.g., "🇹🇿 Tanzania"):');
    if (newJurisdiction) {
        Utils.showNotification(`Initiating connection with ${newJurisdiction}`, 'info');
        // In real app, this would start the jurisdiction onboarding process
    }
}

function initiateTransfer() {
    const jurisdiction = document.getElementById('targetJurisdiction').value;
    const dataType = document.getElementById('dataType').value;
    
    const jurisdictionNames = {
        ghana: 'Ghana',
        kenya: 'Kenya',
        south_africa: 'South Africa'
    };

    const dataTypes = {
        risk_data: 'Risk Data',
        compliance: 'Compliance Reports',
        suspicious: 'Suspicious Activity Reports'
    };

    // Simulate transfer process
    const transferId = 'TX_' + Date.now();
    const transfer = {
        id: transferId,
        type: 'outgoing',
        jurisdiction: jurisdictionNames[jurisdiction],
        dataType: dataTypes[dataType],
        status: 'processing',
        timestamp: new Date().toISOString(),
        size: (Math.random() * 50 + 10).toFixed(1) + 'MB'
    };

    addToExchangeHistory(transfer);
    
    // Simulate transfer completion
    setTimeout(() => {
        updateTransferStatus(transferId, 'completed');
        Utils.showNotification(`Data transfer to ${jurisdictionNames[jurisdiction]} completed`, 'success');
    }, 3000);

    Utils.showNotification(`Initiating data transfer to ${jurisdictionNames[jurisdiction]}...`, 'info');
}

function requestData() {
    const jurisdiction = document.getElementById('requestJurisdiction').value;
    const requestType = document.getElementById('requestType').value;
    
    const jurisdictionNames = {
        ghana: 'Ghana',
        kenya: 'Kenya'
    };

    const requestTypes = {
        sanctions: 'Sanctions List Updates',
        regulations: 'Regulatory Framework Changes',
        risk_patterns: 'Emerging Risk Patterns'
    };

    const requestId = 'REQ_' + Date.now();
    const request = {
        id: requestId,
        type: 'incoming_request',
        jurisdiction: jurisdictionNames[jurisdiction],
        dataType: requestTypes[requestType],
        status: 'pending_approval',
        timestamp: new Date().toISOString()
    };

    addToExchangeHistory(request);
    Utils.showNotification(`Data request sent to ${jurisdictionNames[jurisdiction]}`, 'success');
}

function addToExchangeHistory(entry) {
    exchangeHistory.unshift(entry);
    
    // Keep only last 10 entries
    if (exchangeHistory.length > 10) {
        exchangeHistory = exchangeHistory.slice(0, 10);
    }
    
    updateExchangeHistoryDisplay();
    saveExchangeHistory();
}

function updateExchangeHistoryDisplay() {
    const container = document.getElementById('exchangeHistory');
    
    if (exchangeHistory.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4 text-gray-500">
                <p>No recent exchanges</p>
            </div>
        `;
        return;
    }

    container.innerHTML = exchangeHistory.map(entry => {
        const statusColors = {
            processing: 'text-yellow-600',
            completed: 'text-green-600',
            pending_approval: 'text-blue-600',
            failed: 'text-red-600'
        };

        const typeIcons = {
            outgoing: '📤',
            incoming_request: '📥',
            incoming_data: '📨'
        };

        return `
            <div class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div class="flex items-center space-x-3">
                    <span class="text-lg">${typeIcons[entry.type]}</span>
                    <div>
                        <div class="text-sm font-medium">${entry.jurisdiction}</div>
                        <div class="text-xs text-gray-600">${entry.dataType}</div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-sm ${statusColors[entry.status]}">${entry.status.replace('_', ' ')}</div>
                    <div class="text-xs text-gray-500">${new Date(entry.timestamp).toLocaleTimeString()}</div>
                </div>
            </div>
        `;
    }).join('');
}

function updateTransferStatus(transferId, newStatus) {
    const transfer = exchangeHistory.find(t => t.id === transferId);
    if (transfer) {
        transfer.status = newStatus;
        updateExchangeHistoryDisplay();
        saveExchangeHistory();
    }
}

function loadExchangeHistory() {
    const savedHistory = JSON.parse(localStorage.getItem('cross_border_exchanges')) || [];
    exchangeHistory = savedHistory;
    updateExchangeHistoryDisplay();
}

function saveExchangeHistory() {
    localStorage.setItem('cross_border_exchanges', JSON.stringify(exchangeHistory));
}

function syncAllData() {
    Utils.showNotification('Initiating full data synchronization...', 'info');
    
    // Simulate sync process
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        Utils.showNotification(`Sync progress: ${progress}%`, 'info');
        
        if (progress >= 100) {
            clearInterval(interval);
            Utils.showNotification('Full data synchronization completed!', 'success');
        }
    }, 500);
}

function generateComplianceReport() {
    const report = {
        title: 'Cross-border Compliance Report',
        generatedAt: new Date().toISOString(),
        summary: {
            activeJurisdictions: 3,
            complianceRate: 89,
            dataExchanges: exchangeHistory.length,
            standardsCoverage: 85
        },
        recommendations: [
            'Expand jurisdiction network to include West African countries',
            'Improve data standardization with Kenya',
            'Automate compliance checking for incoming data'
        ]
    };

    const dataStr = JSON.stringify(report, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cross_border_report_${new Date().getTime()}.json`;
    a.click();
    
    Utils.showNotification('Compliance report generated!', 'success');
}

function viewTreatyDatabase() {
    Utils.showNotification('Opening international treaty database...', 'info');
    // In real app, this would open a treaty database interface
}

function setupNavigation() {
    Navigation.setupNavigation();
}