// Regulatory Sandbox functionality
let testCounter = 0;
let successfulTests = 0;
let failedTests = 0;
let totalDuration = 0;

document.addEventListener('DOMContentLoaded', function() {
    const user = AuthManager.requireAuth();
    initializeSandbox(user);
});

function initializeSandbox(user) {
    document.getElementById('userName').textContent = user.name;
    loadSandboxActivity();
    updateStats();
    setupNavigation();
}

function runTest(testType) {
    const button = event.target;
    const originalText = button.textContent;
    
    // Show loading state
    button.disabled = true;
    button.textContent = 'Running...';
    button.className = 'w-full bg-gray-600 text-white py-2 rounded text-sm';

    // Simulate test execution
    const duration = Math.random() * 3000 + 2000; // 2-5 seconds
    const success = Math.random() > 0.2; // 80% success rate

    setTimeout(() => {
        testCounter++;
        totalDuration += duration;

        if (success) {
            successfulTests++;
            showTestResult(testType, true, duration);
            button.className = 'w-full bg-green-600 text-white py-2 rounded text-sm hover:bg-green-700';
        } else {
            failedTests++;
            showTestResult(testType, false, duration);
            button.className = 'w-full bg-red-600 text-white py-2 rounded text-sm hover:bg-red-700';
        }

        button.textContent = success ? 'Success!' : 'Failed!';
        updateStats();
        addActivity(testType, success, duration);
        
        // Reset button after 2 seconds
        setTimeout(() => {
            button.disabled = false;
            button.textContent = originalText;
            button.className = button.className.replace('bg-gray-600', 
                testType === 'money_laundering' ? 'bg-red-600' :
                testType === 'cross_border' ? 'bg-blue-600' :
                testType === 'digital_assets' ? 'bg-purple-600' : 'bg-green-600');
        }, 2000);

    }, duration);
}

function showTestResult(testType, success, duration) {
    const resultsContainer = document.getElementById('simulationResults');
    
    const testConfigs = {
        money_laundering: {
            title: 'Money Laundering Pattern Test',
            description: 'Testing AML detection systems against known money laundering patterns',
            successMessage: 'System correctly identified 98% of money laundering patterns',
            failureMessage: 'System missed 15% of sophisticated money laundering patterns'
        },
        cross_border: {
            title: 'Cross-border Compliance Test',
            description: 'Testing compliance with international regulatory standards',
            successMessage: 'All cross-border transactions compliant with FATF standards',
            failureMessage: '3 compliance gaps identified in cross-border protocols'
        },
        digital_assets: {
            title: 'Digital Asset Risk Assessment',
            description: 'Testing cryptocurrency and digital asset compliance systems',
            successMessage: 'Digital asset monitoring effective against 95% of risk scenarios',
            failureMessage: 'Gaps identified in DeFi protocol monitoring'
        },
        regulation_impact: {
            title: 'New Regulation Impact Analysis',
            description: 'Testing system adaptation to new regulatory requirements',
            successMessage: 'System successfully adapted to new regulatory framework',
            failureMessage: 'System requires updates to handle new compliance requirements'
        }
    };

    const config = testConfigs[testType] || {
        title: 'Custom Test',
        description: 'User-defined test scenario',
        successMessage: 'Test completed successfully',
        failureMessage: 'Test encountered issues'
    };

    const resultElement = document.createElement('div');
    resultElement.className = `border-l-4 ${success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'} p-4 rounded fade-in`;
    resultElement.innerHTML = `
        <div class="flex justify-between items-start mb-2">
            <div class="flex items-center space-x-2">
                <span class="w-2 h-2 ${success ? 'bg-green-500' : 'bg-red-500'} rounded-full"></span>
                <span class="font-semibold ${success ? 'text-green-800' : 'text-red-800'}">${config.title}</span>
            </div>
            <span class="text-xs text-gray-500">${(duration / 1000).toFixed(1)}s</span>
        </div>
        <p class="text-sm text-gray-700 mb-2">${config.description}</p>
        <p class="text-sm ${success ? 'text-green-700' : 'text-red-700'} font-medium">
            ${success ? config.successMessage : config.failureMessage}
        </p>
        <div class="mt-3 flex space-x-2">
            <button onclick="viewDetailedResults('${testType}')" class="text-xs bg-blue-600 text-white px-3 py-1 rounded">
                View Details
            </button>
            <button onclick="exportTestResult('${testType}')" class="text-xs border border-gray-600 text-gray-600 px-3 py-1 rounded">
                Export
            </button>
            ${!success ? `<button onclick="createMitigationPlan('${testType}')" class="text-xs bg-red-600 text-white px-3 py-1 rounded">
                Create Mitigation
            </button>` : ''}
        </div>
    `;

    // Add to top of results
    resultsContainer.insertBefore(resultElement, resultsContainer.firstChild);

    // Remove empty state if present
    const emptyState = resultsContainer.querySelector('.text-center');
    if (emptyState) {
        emptyState.remove();
    }
}

function createCustomTest() {
    const name = document.getElementById('testName').value;
    const description = document.getElementById('testDescription').value;

    if (!name || !description) {
        Utils.showNotification('Please fill in both test name and description', 'error');
        return;
    }

    // Create custom test scenario
    const customTest = {
        type: 'custom_' + Date.now(),
        title: name,
        description: description,
        successMessage: 'Custom test completed successfully',
        failureMessage: 'Custom test identified issues'
    };

    // Add to available tests
    const testsContainer = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2');
    const testElement = document.createElement('div');
    testElement.className = 'border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow';
    testElement.innerHTML = `
        <div class="flex items-center space-x-3 mb-3">
            <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span class="text-indigo-600">🔧</span>
            </div>
            <div>
                <h3 class="font-semibold text-gray-900">${name}</h3>
                <p class="text-sm text-gray-600">${description}</p>
            </div>
        </div>
        <button onclick="runCustomTest('${customTest.type}')" class="w-full bg-indigo-600 text-white py-2 rounded text-sm hover:bg-indigo-700">
            Run Test
        </button>
    `;

    testsContainer.appendChild(testElement);

    // Clear form
    document.getElementById('testName').value = '';
    document.getElementById('testDescription').value = '';

    Utils.showNotification('Custom test created successfully!', 'success');
}

function runCustomTest(testType) {
    // For demo purposes, run with 70% success rate
    const success = Math.random() > 0.3;
    const duration = Math.random() * 4000 + 1000;
    
    const customTest = {
        type: testType,
        title: 'Custom Test',
        description: 'User-defined test scenario',
        successMessage: 'Custom test completed successfully',
        failureMessage: 'Custom test identified areas for improvement'
    };

    showTestResult(testType, success, duration);
    testCounter++;
    totalDuration += duration;
    
    if (success) successfulTests++;
    else failedTests++;
    
    updateStats();
    addActivity('custom_test', success, duration);
}

function updateStats() {
    document.getElementById('testsToday').textContent = testCounter;
    document.getElementById('successfulTests').textContent = successfulTests;
    document.getElementById('failedTests').textContent = failedTests;
    
    const avgDuration = testCounter > 0 ? (totalDuration / testCounter / 1000).toFixed(1) : 0;
    document.getElementById('avgDuration').textContent = avgDuration + 's';
}

function addActivity(testType, success, duration) {
    const activityContainer = document.getElementById('sandboxActivity');
    
    const activityTypes = {
        money_laundering: 'AML Pattern Test',
        cross_border: 'Cross-border Test',
        digital_assets: 'Digital Assets Test',
        regulation_impact: 'Regulation Impact Test',
        custom_test: 'Custom Test'
    };

    const activityElement = document.createElement('div');
    activityElement.className = 'flex justify-between items-center text-sm p-2 hover:bg-gray-50 rounded';
    activityElement.innerHTML = `
        <div class="flex items-center space-x-2">
            <span class="w-2 h-2 ${success ? 'bg-green-500' : 'bg-red-500'} rounded-full"></span>
            <span>${activityTypes[testType] || 'Test'}</span>
        </div>
        <span class="text-xs text-gray-500">${(duration / 1000).toFixed(1)}s</span>
    `;

    // Add to top and limit to 5 activities
    activityContainer.insertBefore(activityElement, activityContainer.firstChild);
    if (activityContainer.children.length > 5) {
        activityContainer.removeChild(activityContainer.lastChild);
    }
}

function loadSandboxActivity() {
    // Load any existing activity from localStorage
    const savedActivity = JSON.parse(localStorage.getItem('sandbox_activity')) || [];
    const activityContainer = document.getElementById('sandboxActivity');
    
    savedActivity.forEach(activity => {
        const activityElement = document.createElement('div');
        activityElement.className = 'flex justify-between items-center text-sm p-2 hover:bg-gray-50 rounded';
        activityElement.innerHTML = `
            <div class="flex items-center space-x-2">
                <span class="w-2 h-2 ${activity.success ? 'bg-green-500' : 'bg-red-500'} rounded-full"></span>
                <span>${activity.type}</span>
            </div>
            <span class="text-xs text-gray-500">${activity.duration}s</span>
        `;
        activityContainer.appendChild(activityElement);
    });
}

function viewDetailedResults(testType) {
    Utils.showNotification(`Opening detailed results for ${testType}`, 'info');
    // In real app, this would open a detailed results modal
}

function exportTestResult(testType) {
    const result = {
        testType: testType,
        timestamp: new Date().toISOString(),
        exportedBy: AuthManager.getCurrentUser().name
    };
    
    const dataStr = JSON.stringify(result, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sandbox_test_${testType}_${new Date().getTime()}.json`;
    a.click();
    
    Utils.showNotification('Test result exported successfully!', 'success');
}

function createMitigationPlan(testType) {
    Utils.showNotification(`Creating mitigation plan for ${testType} issues`, 'info');
    // In real app, this would open a mitigation plan creator
}

function setupNavigation() {
    Navigation.setupNavigation();
}