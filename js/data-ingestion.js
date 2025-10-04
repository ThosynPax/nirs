// Data Ingestion functionality
document.addEventListener('DOMContentLoaded', function() {
    const user = AuthManager.requireAuth();
    initializeDataIngestion(user);
});

function initializeDataIngestion(user) {
    document.getElementById('userName').textContent = user.name;
    loadDataTable();
    setupNavigation();
}

function loadDataTable() {
    const data = DataStore.getData();
    const tableBody = document.getElementById('dataTableBody');
    const recordCount = document.getElementById('recordCount');

    recordCount.textContent = data.length;

    if (data.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="px-4 py-8 text-center text-gray-500">
                    No data available. Upload some data to get started.
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = data.map(item => `
        <tr class="${item.risk_score > 0.7 ? 'bg-red-50' : ''} hover:bg-gray-50 transition-colors">
            <td class="px-4 py-3 text-sm font-medium text-gray-900">${item.transaction_id}</td>
            <td class="px-4 py-3 text-sm text-gray-900">${Utils.formatCurrency(item.amount)}</td>
            <td class="px-4 py-3">
                <span class="risk-badge ${item.risk_score > 0.7 ? 'high' : item.risk_score > 0.4 ? 'medium' : 'low'}">
                    ${item.risk_score.toFixed(2)}
                </span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">${item.institution}</td>
            <td class="px-4 py-3 text-sm text-gray-500">${Utils.formatDate(item.timestamp)}</td>
        </tr>
    `).join('');
}

function ingestData() {
    const jsonInput = document.getElementById('jsonInput').value;
    const messageContainer = document.getElementById('messageContainer');

    if (!jsonInput.trim()) {
        showMessage('Please enter JSON data', 'error');
        return;
    }

    try {
        const parsedData = JSON.parse(jsonInput);
        
        // Validate required fields
        const requiredFields = ['transaction_id', 'amount', 'risk_score'];
        const missingFields = requiredFields.filter(field => !parsedData[field]);
        
        if (missingFields.length > 0) {
            showMessage(`Missing required fields: ${missingFields.join(', ')}`, 'error');
            return;
        }

        // Process data
        const user = AuthManager.getCurrentUser();
        const newEntries = Object.entries(parsedData).reduce((acc, [key, values]) => {
            values.forEach((val, idx) => {
                acc[idx] = acc[idx] || {};
                acc[idx][key] = val;
            });
            return acc;
        }, []).map(entry => ({
            ...entry,
            timestamp: new Date().toISOString(),
            signature: `signed_${btoa(JSON.stringify(entry)).slice(0, 10)}`,
            institution: user.institution
        }));

        // Save to data store
        DataStore.addData(newEntries);
        
        // Update UI
        loadDataTable();
        showMessage(`Successfully ingested ${newEntries.length} records`, 'success');
        
        // Clear input
        document.getElementById('jsonInput').value = '';

    } catch (e) {
        showMessage('Invalid JSON format. Please check your input.', 'error');
    }
}

function loadExampleData() {
    const exampleData = {
        "transaction_id": [4, 5, 6],
        "amount": [75000, 1200000, 500000],
        "risk_score": [0.3, 0.85, 0.6]
    };
    
    document.getElementById('jsonInput').value = JSON.stringify(exampleData, null, 2);
    showMessage('Example data loaded. Click "Ingest Data" to add it to the system.', 'info');
}

function clearData() {
    document.getElementById('jsonInput').value = '';
    showMessage('Input cleared', 'info');
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

    // Auto-clear success messages after 3 seconds
    if (type === 'success') {
        setTimeout(() => {
            messageContainer.innerHTML = '';
        }, 3000);
    }
}

function setupNavigation() {
    Navigation.setupNavigation();
}