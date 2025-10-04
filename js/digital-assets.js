// Digital Assets functionality
let network = null;

document.addEventListener('DOMContentLoaded', function() {
    const user = AuthManager.requireAuth();
    initializeDigitalAssets(user);
});

function initializeDigitalAssets(user) {
    document.getElementById('userName').textContent = user.name;
    loadRecentAlerts();
    setupNavigation();
}

function analyzeContract() {
    const contractInput = document.getElementById('contractInput').value;
    
    if (!contractInput.trim()) {
        showMessage('Please enter transaction data', 'error');
        return;
    }

    try {
        const parsedData = JSON.parse(contractInput);
        const results = processContractAnalysis(parsedData);
        displayResults(results);
        showMessage(`Analysis complete: ${results.anomalies.length} anomalies detected`, 'success');
        
    } catch (e) {
        showMessage('Invalid JSON format. Please check your input.', 'error');
    }
}

function processContractAnalysis(data) {
    const transactions = data.transactions || [];
    
    // Detect anomalies
    const anomalies = transactions.filter(tx => 
        tx.value > 1000000 || 
        (tx.asset === 'BTC' && tx.value > 10) ||
        (tx.asset === 'ETH' && tx.value > 100)
    );

    // Generate network graph data
    const nodes = [];
    const edges = [];
    const addressMap = new Map();
    let nodeId = 1;

    transactions.forEach((tx, index) => {
        // Add from address
        if (!addressMap.has(tx.from)) {
            addressMap.set(tx.from, nodeId);
            nodes.push({
                id: nodeId,
                label: tx.from.substring(0, 8) + '...',
                title: `Address: ${tx.from}\nType: Wallet`,
                color: anomalies.some(a => a.from === tx.from) ? '#EF4444' : '#3B82F6',
                value: 5
            });
            nodeId++;
        }

        // Add to address
        if (!addressMap.has(tx.to)) {
            addressMap.set(tx.to, nodeId);
            nodes.push({
                id: nodeId,
                label: tx.to.substring(0, 8) + '...',
                title: `Address: ${tx.to}\nType: Wallet`,
                color: anomalies.some(a => a.to === tx.to) ? '#EF4444' : '#10B981',
                value: 5
            });
            nodeId++;
        }

        // Add edge
        edges.push({
            from: addressMap.get(tx.from),
            to: addressMap.get(tx.to),
            label: `₦${(tx.value / 1000000).toFixed(1)}M`,
            value: Math.min(tx.value / 500000, 10),
            color: tx.value > 1000000 ? '#EF4444' : '#6B7280'
        });
    });

    // Update stats
    updateStats(transactions, anomalies, addressMap.size);

    return {
        anomalies,
        networkData: { nodes, edges },
        summary: `${anomalies.length} anomalies detected in ${transactions.length} transactions`
    };
}

function displayResults(results) {
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.classList.remove('hidden');

    // Display network graph
    displayNetworkGraph(results.networkData);
    
    // Display anomalies
    displayAnomalies(results.anomalies);
}

function displayNetworkGraph(networkData) {
    const container = document.getElementById('networkGraph');
    container.innerHTML = ''; // Clear previous graph

    const data = {
        nodes: new vis.DataSet(networkData.nodes),
        edges: new vis.DataSet(networkData.edges)
    };

    const options = {
        layout: {
            improvedLayout: true
        },
        physics: {
            enabled: true,
            stabilization: { iterations: 100 }
        },
        nodes: {
            shape: 'dot',
            size: 20,
            font: {
                size: 12,
                face: 'Tahoma'
            },
            borderWidth: 2
        },
        edges: {
            width: 2,
            smooth: {
                type: 'continuous'
            },
            font: {
                size: 10,
                face: 'Tahoma',
                align: 'middle'
            },
            arrows: {
                to: {
                    enabled: true,
                    scaleFactor: 0.8
                }
            }
        },
        interaction: {
            hover: true,
            tooltipDelay: 200
        }
    };

    network = new vis.Network(container, data, options);
}

function displayAnomalies(anomalies) {
    const container = document.getElementById('anomaliesContainer');
    
    if (anomalies.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <div class="text-4xl mb-2">✅</div>
                <p class="font-semibold">No anomalies detected</p>
                <p class="text-sm">All transactions appear normal</p>
            </div>
        `;
        return;
    }

    container.innerHTML = anomalies.map((anomaly, index) => `
        <div class="border border-red-200 rounded-lg p-4 bg-red-50 mb-4">
            <div class="flex items-center justify-between mb-3">
                <div class="flex items-center space-x-2">
                    <span class="w-3 h-3 bg-red-500 rounded-full"></span>
                    <span class="font-semibold text-red-800">High Risk Transaction</span>
                </div>
                <span class="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Alert #${index + 1}</span>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                    <span class="text-gray-600">From:</span>
                    <div class="font-mono text-xs bg-white p-2 rounded border">${anomaly.from}</div>
                </div>
                <div>
                    <span class="text-gray-600">To:</span>
                    <div class="font-mono text-xs bg-white p-2 rounded border">${anomaly.to}</div>
                </div>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                <div>
                    <span class="text-gray-600">Amount:</span>
                    <div class="font-semibold text-red-700">${Utils.formatCurrency(anomaly.value)}</div>
                </div>
                <div>
                    <span class="text-gray-600">Asset:</span>
                    <div class="font-semibold">${anomaly.asset || 'N/A'}</div>
                </div>
                <div>
                    <span class="text-gray-600">Risk Level:</span>
                    <div class="font-semibold text-red-700">High</div>
                </div>
                <div>
                    <span class="text-gray-600">Type:</span>
                    <div class="font-semibold">${anomaly.value > 1000000 ? 'High Value' : 'Suspicious Pattern'}</div>
                </div>
            </div>
            
            <div class="mt-3 flex space-x-2">
                <button onclick="investigateAnomaly(${index})" class="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                    Investigate
                </button>
                <button onclick="flagForReview(${index})" class="text-xs border border-red-300 text-red-700 px-3 py-1 rounded hover:bg-red-50">
                    Flag for Review
                </button>
            </div>
        </div>
    `).join('');
}

function updateStats(transactions, anomalies, uniqueAddresses) {
    document.getElementById('totalTxCount').textContent = transactions.length;
    document.getElementById('uniqueAddresses').textContent = uniqueAddresses;
    document.getElementById('highValueTx').textContent = transactions.filter(tx => tx.value > 1000000).length;
    document.getElementById('suspiciousPatterns').textContent = anomalies.length;
}

function loadExampleContract() {
    const exampleData = {
        "transactions": [
            {
                "from": "0x742d35Cc6634C0532925a3b8D6B3985a0e5d6a2b",
                "to": "0x8a3b1d3e24b45b6a8e8e6d7c0f3e2a1b9c8d7e6f",
                "value": 500000,
                "asset": "ETH"
            },
            {
                "from": "0x8a3b1d3e24b45b6a8e8e6d7c0f3e2a1b9c8d7e6f",
                "to": "0xb91d5b3e24b45b6a8e8e6d7c0f3e2a1b9c8d7e6f",
                "value": 2500000,
                "asset": "USDT"
            },
            {
                "from": "0xb91d5b3e24b45b6a8e8e6d7c0f3e2a1b9c8d7e6f",
                "to": "0xc22d5b3e24b45b6a8e8e6d7c0f3e2a1b9c8d7e6f",
                "value": 750000,
                "asset": "BTC"
            },
            {
                "from": "0xc22d5b3e24b45b6a8e8e6d7c0f3e2a1b9c8d7e6f",
                "to": "0xd33d5b3e24b45b6a8e8e6d7c0f3e2a1b9c8d7e6f",
                "value": 3000000,
                "asset": "USDC"
            }
        ]
    };
    
    document.getElementById('contractInput').value = JSON.stringify(exampleData, null, 2);
    showMessage('Example contract data loaded. Click "Analyze Contract" to process it.', 'info');
}

function clearContract() {
    document.getElementById('contractInput').value = '';
    document.getElementById('resultsSection').classList.add('hidden');
    showMessage('Input cleared', 'info');
}

function loadRecentAlerts() {
    const alerts = [
        {
            type: 'High Value',
            address: '0x8a3b1...7e6f',
            amount: '₦2.5M',
            time: '2 hours ago',
            severity: 'high'
        },
        {
            type: 'New Wallet',
            address: '0xc22d5...7e6f',
            amount: '₦3.0M',
            time: '5 hours ago',
            severity: 'medium'
        },
        {
            type: 'Rapid Transfer',
            address: '0xb91d5...7e6f',
            amount: '₦1.2M',
            time: '1 day ago',
            severity: 'medium'
        }
    ];

    const container = document.getElementById('recentAlerts');
    container.innerHTML = alerts.map(alert => `
        <div class="flex items-center justify-between p-3 bg-${alert.severity === 'high' ? 'red' : 'yellow'}-50 rounded-lg border border-${alert.severity === 'high' ? 'red' : 'yellow'}-200">
            <div class="flex-1">
                <div class="flex items-center space-x-2 mb-1">
                    <span class="w-2 h-2 bg-${alert.severity === 'high' ? 'red' : 'yellow'}-500 rounded-full"></span>
                    <span class="text-sm font-medium">${alert.type}</span>
                </div>
                <div class="text-xs text-gray-600">${alert.address} • ${alert.amount}</div>
            </div>
            <div class="text-xs text-gray-500">${alert.time}</div>
        </div>
    `).join('');
}

function investigateAnomaly(index) {
    Utils.showNotification(`Investigation started for anomaly #${index + 1}`, 'success');
    // In a real app, this would open a detailed investigation panel
}

function flagForReview(index) {
    Utils.showNotification(`Anomaly #${index + 1} flagged for regulatory review`, 'success');
    // In a real app, this would add to review queue
}

function showMessage(message, type) {
    const messageContainer = document.getElementById('messageContainer');
    const bgColor = type === 'success' ? 'bg-green-100 border-green-400 text-green-700' :
                   type === 'error' ? 'bg-red-100 border-red-400 text-red-700' :
                   'bg-blue-100 border-blue-400 text-blue-700';
    
    messageContainer.innerHTML = `
        <div class="p-4 rounded-lg border ${bgColor}">
            ${message}
        </div>
    `;

    if (type === 'success') {
        setTimeout(() => {
            messageContainer.innerHTML = '';
        }, 3000);
    }
}

function setupNavigation() {
    Navigation.setupNavigation();
}