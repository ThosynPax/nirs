// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    const user = AuthManager.requireAuth();
    initializeDashboard(user);
});

function initializeDashboard(user) {
    // Update user info
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userRole').textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    document.getElementById('welcomeMessage').textContent = `Welcome back, ${user.name}`;

    // Load dashboard data
    loadDashboardData();
    setupNavigation();
}

function loadDashboardData() {
    const data = DataStore.getData();
    
    // Calculate stats
    const totalTransactions = data.length;
    const highRiskCount = data.filter(item => item.risk_score > 0.7).length;
    const uniqueInstitutions = [...new Set(data.map(item => item.institution))].length;
    const complianceRate = Math.round(((totalTransactions - highRiskCount) / totalTransactions) * 100);

    // Update stats
    document.getElementById('totalTransactions').textContent = totalTransactions.toLocaleString();
    document.getElementById('highRiskCount').textContent = highRiskCount;
    document.getElementById('institutionCount').textContent = uniqueInstitutions;
    document.getElementById('complianceRate').textContent = `${complianceRate}%`;

    // Load recent activity
    loadRecentActivity(data);
    
    // Load system status
    loadSystemStatus();
}

function loadRecentActivity(data) {
    const recentActivity = [
        {
            action: 'Data Ingested',
            institution: 'System',
            time: '2 minutes ago',
            risk: 'low',
            icon: '📥'
        },
        {
            action: 'High Risk Detected',
            institution: 'Bank B',
            time: '15 minutes ago',
            risk: 'high',
            icon: '⚠️'
        },
        {
            action: 'Report Generated',
            institution: 'System',
            time: '1 hour ago',
            risk: 'medium',
            icon: '📊'
        },
        {
            action: 'System Update',
            institution: 'Admin',
            time: '2 hours ago',
            risk: 'low',
            icon: '🔄'
        }
    ];

    const activityContainer = document.getElementById('recentActivity');
    activityContainer.innerHTML = recentActivity.map(activity => `
        <div class="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg border-l-4 ${
            activity.risk === 'high' ? 'border-red-400' : 
            activity.risk === 'medium' ? 'border-yellow-400' : 'border-green-400'
        }">
            <div class="text-2xl">${activity.icon}</div>
            <div class="flex-1">
                <p class="font-medium text-gray-900">${activity.action}</p>
                <p class="text-sm text-gray-600">${activity.institution}</p>
            </div>
            <div class="text-sm text-gray-500">${activity.time}</div>
        </div>
    `).join('');
}

function loadSystemStatus() {
    const statusItems = [
        { component: 'Data Ingestion', status: 'operational', icon: '✅' },
        { component: 'AI Analysis', status: 'operational', icon: '✅' },
        { component: 'Digital Assets', status: 'degraded', icon: '⚠️' },
        { component: 'Reporting', status: 'operational', icon: '✅' },
        { component: 'API Gateway', status: 'operational', icon: '✅' },
        { component: 'Database', status: 'operational', icon: '✅' }
    ];

    const statusContainer = document.getElementById('systemStatus');
    statusContainer.innerHTML = statusItems.map(item => `
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center space-x-3">
                <span class="text-lg">${item.icon}</span>
                <span class="font-medium text-gray-900">${item.component}</span>
            </div>
            <span class="px-2 py-1 text-xs rounded-full ${
                item.status === 'operational' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }">
                ${item.status}
            </span>
        </div>
    `).join('');
}

function setupNavigation() {
    Navigation.setupNavigation();
}