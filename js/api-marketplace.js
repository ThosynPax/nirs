// API Marketplace functionality
let apiSubscriptions = [];
let apiUsage = {
    requestsToday: 0,
    monthlyLimit: 1000,
    monthlyUsed: 0
};

const apiCatalog = [
    {
        id: 'risk-assessment',
        name: 'Risk Assessment API',
        description: 'Real-time risk scoring for financial transactions',
        category: 'risk',
        pricing: 'paid',
        price: '$0.10 per call',
        status: 'active',
        features: ['Real-time scoring', 'AML detection', 'Pattern analysis'],
        documentation: 'https://docs.nirs.gov/risk-api',
        rating: 4.8
    },
    {
        id: 'compliance-check',
        name: 'Compliance Check API',
        description: 'Automated regulatory compliance validation',
        category: 'compliance',
        pricing: 'enterprise',
        price: 'Custom pricing',
        status: 'active',
        features: ['Multi-jurisdiction', 'Real-time updates', 'Audit trail'],
        documentation: 'https://docs.nirs.gov/compliance-api',
        rating: 4.9
    },
    {
        id: 'sanctions-screening',
        name: 'Sanctions Screening',
        description: 'Global sanctions and PEP screening service',
        category: 'compliance',
        pricing: 'paid',
        price: '$0.05 per check',
        status: 'active',
        features: ['Global coverage', 'Real-time updates', 'Fuzzy matching'],
        documentation: 'https://docs.nirs.gov/sanctions-api',
        rating: 4.7
    },
    {
        id: 'transaction-monitoring',
        name: 'Transaction Monitoring',
        description: 'Continuous monitoring of financial transactions',
        category: 'monitoring',
        pricing: 'enterprise',
        price: 'Custom pricing',
        status: 'active',
        features: ['Real-time alerts', 'Pattern detection', 'Custom rules'],
        documentation: 'https://docs.nirs.gov/monitoring-api',
        rating: 4.6
    },
    {
        id: 'data-enrichment',
        name: 'Data Enrichment API',
        description: 'Enhance transaction data with additional context',
        category: 'data',
        pricing: 'free',
        price: 'Free tier available',
        status: 'active',
        features: ['Entity resolution', 'Data validation', 'Context enrichment'],
        documentation: 'https://docs.nirs.gov/enrichment-api',
        rating: 4.5
    },
    {
        id: 'reporting-api',
        name: 'Reporting & Analytics API',
        description: 'Generate regulatory reports and analytics',
        category: 'data',
        pricing: 'paid',
        price: '$0.02 per report',
        status: 'active',
        features: ['Custom reports', 'Real-time analytics', 'Export capabilities'],
        documentation: 'https://docs.nirs.gov/reporting-api',
        rating: 4.4
    }
];

document.addEventListener('DOMContentLoaded', function() {
    const user = AuthManager.requireAuth();
    initializeAPIMarketplace(user);
});

function initializeAPIMarketplace(user) {
    document.getElementById('userName').textContent = user.name;
    loadAPICatalog();
    loadSubscriptions();
    updateUsageStats();
    setupEventListeners();
    setupNavigation();
}

function loadAPICatalog() {
    const container = document.getElementById('apiListings');
    
    container.innerHTML = apiCatalog.map(api => `
        <div class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow" data-category="${api.category}" data-pricing="${api.pricing}">
            <div class="flex justify-between items-start mb-3">
                <div>
                    <h3 class="font-semibold text-gray-900 text-lg">${api.name}</h3>
                    <div class="flex items-center space-x-2 mt-1">
                        <span class="text-sm px-2 py-1 rounded-full ${
                            api.pricing === 'free' ? 'bg-green-100 text-green-800' :
                            api.pricing === 'paid' ? 'bg-blue-100 text-blue-800' :
                            'bg-purple-100 text-purple-800'
                        }">
                            ${api.pricing}
                        </span>
                        <span class="text-yellow-500">⭐ ${api.rating}</span>
                    </div>
                </div>
                <span class="text-sm font-semibold text-gray-900">${api.price}</span>
            </div>
            
            <p class="text-gray-600 text-sm mb-4">${api.description}</p>
            
            <div class="space-y-2 mb-4">
                ${api.features.map(feature => `
                    <div class="flex items-center text-sm text-gray-600">
                        <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        ${feature}
                    </div>
                `).join('')}
            </div>
            
            <div class="flex space-x-2">
                <button onclick="viewAPIDetails('${api.id}')" class="flex-1 bg-indigo-600 text-white py-2 rounded text-sm hover:bg-indigo-700">
                    View Details
                </button>
                <button onclick="subscribeToAPI('${api.id}')" class="flex-1 border border-indigo-600 text-indigo-600 py-2 rounded text-sm hover:bg-indigo-50">
                    Subscribe
                </button>
            </div>
        </div>
    `).join('');
}

function viewAPIDetails(apiId) {
    const api = apiCatalog.find(a => a.id === apiId);
    if (!api) return;

    document.getElementById('modalApiName').textContent = api.name;
    
    const modalContent = document.getElementById('modalApiContent');
    modalContent.innerHTML = `
        <div class="space-y-4">
            <div>
                <h3 class="font-semibold text-gray-900 mb-2">Description</h3>
                <p class="text-gray-600">${api.description}</p>
            </div>
            
            <div>
                <h3 class="font-semibold text-gray-900 mb-2">Features</h3>
                <div class="grid grid-cols-2 gap-2">
                    ${api.features.map(feature => `
                        <div class="flex items-center text-sm">
                            <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            ${feature}
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div>
                <h3 class="font-semibold text-gray-900 mb-2">Pricing</h3>
                <div class="bg-gray-50 p-3 rounded">
                    <div class="font-semibold">${api.price}</div>
                    <div class="text-sm text-gray-600 mt-1">
                        ${api.pricing === 'free' ? 'No credit card required' :
                          api.pricing === 'paid' ? 'Pay-as-you-go pricing' :
                          'Contact sales for enterprise pricing'}
                    </div>
                </div>
            </div>
            
            <div>
                <h3 class="font-semibold text-gray-900 mb-2">Documentation</h3>
                <a href="${api.documentation}" target="_blank" class="text-indigo-600 hover:text-indigo-800">
                    View API Documentation →
                </a>
            </div>
            
            <div class="flex space-x-3 pt-4 border-t">
                <button onclick="subscribeToAPI('${api.id}')" class="flex-1 bg-indigo-600 text-white py-3 rounded font-semibold hover:bg-indigo-700">
                    Subscribe Now
                </button>
                <button onclick="testAPI('${api.id}')" class="flex-1 border border-gray-600 text-gray-600 py-3 rounded font-semibold hover:bg-gray-50">
                    Test API
                </button>
            </div>
        </div>
    `;

    document.getElementById('apiModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('apiModal').classList.add('hidden');
}

function subscribeToAPI(apiId) {
    const api = apiCatalog.find(a => a.id === apiId);
    if (!api) return;

    // Check if already subscribed
    if (apiSubscriptions.some(sub => sub.id === apiId)) {
        Utils.showNotification(`Already subscribed to ${api.name}`, 'info');
        return;
    }

    // Add to subscriptions
    apiSubscriptions.push({
        id: apiId,
        name: api.name,
        subscribedAt: new Date().toISOString(),
        status: 'active'
    });

    saveSubscriptions();
    loadSubscriptions();
    Utils.showNotification(`Successfully subscribed to ${api.name}`, 'success');
    closeModal();
}

function loadSubscriptions() {
    const savedSubscriptions = JSON.parse(localStorage.getItem('api_subscriptions')) || [];
    apiSubscriptions = savedSubscriptions;

    const container = document.getElementById('mySubscriptions');
    
    if (apiSubscriptions.length === 0) {
        container.innerHTML = '<div class="text-gray-500 text-sm">No active subscriptions</div>';
        return;
    }

    container.innerHTML = apiSubscriptions.map(sub => `
        <div class="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
            <div class="flex-1">
                <div class="text-sm font-medium">${sub.name}</div>
                <div class="text-xs text-gray-500">Subscribed ${new Date(sub.subscribedAt).toLocaleDateString()}</div>
            </div>
            <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
        </div>
    `).join('');
}

function saveSubscriptions() {
    localStorage.setItem('api_subscriptions', JSON.stringify(apiSubscriptions));
}

function testAPI(apiId) {
    const api = apiCatalog.find(a => a.id === apiId);
    if (!api) return;

    Utils.showNotification(`Testing ${api.name} API endpoint...`, 'info');
    
    // Simulate API test
    setTimeout(() => {
        apiUsage.requestsToday++;
        apiUsage.monthlyUsed++;
        updateUsageStats();
        saveUsageStats();
        
        Utils.showNotification(`${api.name} API test successful!`, 'success');
    }, 1500);
}

function updateUsageStats() {
    document.getElementById('requestsToday').textContent = apiUsage.requestsToday;
    document.getElementById('monthlyLimit').textContent = apiUsage.monthlyLimit.toLocaleString();
    
    const requestsPercent = Math.min(100, (apiUsage.requestsToday / 100) * 100);
    const monthlyPercent = Math.min(100, (apiUsage.monthlyUsed / apiUsage.monthlyLimit) * 100);
    
    document.getElementById('requestsBar').style.width = requestsPercent + '%';
    document.getElementById('monthlyBar').style.width = monthlyPercent + '%';
}

function saveUsageStats() {
    localStorage.setItem('api_usage', JSON.stringify(apiUsage));
}

function loadUsageStats() {
    const savedUsage = JSON.parse(localStorage.getItem('api_usage'));
    if (savedUsage) {
        apiUsage = savedUsage;
    }
}

function setupEventListeners() {
    // Search functionality
    document.getElementById('apiSearch').addEventListener('input', filterAPIs);
    document.getElementById('categoryFilter').addEventListener('change', filterAPIs);
    document.getElementById('pricingFilter').addEventListener('change', filterAPIs);
}

function filterAPIs() {
    const searchTerm = document.getElementById('apiSearch').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const pricingFilter = document.getElementById('pricingFilter').value;
    
    const apiCards = document.querySelectorAll('#apiListings > div');
    
    apiCards.forEach(card => {
        const apiName = card.querySelector('h3').textContent.toLowerCase();
        const apiCategory = card.getAttribute('data-category');
        const apiPricing = card.getAttribute('data-pricing');
        
        const matchesSearch = !searchTerm || apiName.includes(searchTerm);
        const matchesCategory = !categoryFilter || apiCategory === categoryFilter;
        const matchesPricing = !pricingFilter || apiPricing === pricingFilter;
        
        if (matchesSearch && matchesCategory && matchesPricing) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function generateApiKey() {
    const apiKey = 'nirs_' + Math.random().toString(36).substr(2, 32);
    
    Utils.showNotification('New API key generated!', 'success');
    
    // In real app, this would show the key in a secure way
    setTimeout(() => {
        alert(`Your new API Key: ${apiKey}\n\nPlease store this securely. It will not be shown again.`);
    }, 500);
}

function viewDocumentation() {
    Utils.showNotification('Opening API documentation portal...', 'info');
    window.open('https://docs.nirs.gov', '_blank');
}

function manageBilling() {
    Utils.showNotification('Opening billing management...', 'info');
    // In real app, this would open billing interface
}

function setupNavigation() {
    Navigation.setupNavigation();
}

// Load usage stats on init
loadUsageStats();