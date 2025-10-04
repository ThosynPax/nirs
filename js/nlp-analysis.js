// NLP Analysis functionality
let analysisHistory = [];

document.addEventListener('DOMContentLoaded', function() {
    const user = AuthManager.requireAuth();
    initializeNlpAnalysis(user);
});

function initializeNlpAnalysis(user) {
    document.getElementById('userName').textContent = user.name;
    loadAnalysisHistory();
    setupFileUpload();
    setupNavigation();
}

function analyzeText() {
    const text = document.getElementById('regulatoryText').value;
    const analysisType = document.getElementById('analysisType').value;

    if (!text.trim()) {
        Utils.showNotification('Please enter text to analyze', 'error');
        return;
    }

    // Show loading state
    document.getElementById('emptyState').classList.add('hidden');
    document.getElementById('nlpResults').classList.remove('hidden');
    
    // Simulate NLP processing
    setTimeout(() => {
        const results = processNlpAnalysis(text, analysisType);
        displayResults(results);
        addToHistory(text.substring(0, 100) + '...', analysisType, results.complianceScore);
    }, 2000);

    Utils.showNotification('Analyzing document with AI...', 'info');
}

function processNlpAnalysis(text, type) {
    // Mock NLP processing - in real app, this would call an AI service
    const words = text.toLowerCase().split(/\s+/);
    
    // Risk keywords detection
    const riskKeywords = [
        'fraud', 'money laundering', 'terrorism', 'sanctions', 'violation',
        'non-compliance', 'penalty', 'fine', 'investigation', 'suspicious',
        'high risk', 'prohibited', 'illegal', 'breach', 'unauthorized'
    ];

    const complianceKeywords = [
        'compliance', 'regulation', 'standard', 'requirement', 'guideline',
        'policy', 'procedure', 'approval', 'certified', 'audit',
        'documentation', 'training', 'monitoring', 'reporting', 'oversight'
    ];

    const positiveSentiment = [
        'approved', 'compliant', 'successful', 'effective', 'efficient',
        'improved', 'enhanced', 'secure', 'reliable', 'transparent'
    ];

    const negativeSentiment = [
        'failed', 'rejected', 'deficient', 'inadequate', 'violation',
        'penalty', 'warning', 'suspended', 'revoked', 'investigation'
    ];

    // Calculate scores
    const riskScore = calculateKeywordDensity(words, riskKeywords);
    const complianceScore = calculateKeywordDensity(words, complianceKeywords);
    const positiveScore = calculateKeywordDensity(words, positiveSentiment);
    const negativeScore = calculateKeywordDensity(words, negativeSentiment);
    
    const sentimentScore = Math.max(0, ((positiveScore - negativeScore) + 1) * 50);
    const overallCompliance = Math.max(0, Math.min(100, complianceScore * 200 - riskScore * 100));

    // Generate findings
    const findings = generateFindings(text, riskScore, complianceScore);
    const recommendations = generateRecommendations(overallCompliance, riskScore, findings);

    return {
        complianceScore: Math.round(overallCompliance),
        riskLevel: getRiskLevel(riskScore),
        sentimentScore: Math.round(sentimentScore),
        riskKeywords: findMatchingKeywords(words, riskKeywords),
        findings: findings,
        recommendations: recommendations
    };
}

function calculateKeywordDensity(words, keywords) {
    const matches = words.filter(word => keywords.includes(word)).length;
    return matches / words.length;
}

function findMatchingKeywords(words, keywords) {
    return keywords.filter(keyword => 
        words.some(word => word.includes(keyword))
    ).slice(0, 10); // Limit to top 10
}

function getRiskLevel(riskScore) {
    if (riskScore > 0.05) return 'High';
    if (riskScore > 0.02) return 'Medium';
    return 'Low';
}

function generateFindings(text, riskScore, complianceScore) {
    const findings = [];
    
    if (riskScore > 0.03) {
        findings.push('High concentration of risk-related terminology detected');
    }
    
    if (complianceScore > 0.04) {
        findings.push('Strong compliance framework terminology present');
    }
    
    if (text.length > 1000) {
        findings.push('Document shows comprehensive regulatory coverage');
    }
    
    if (riskScore === 0 && complianceScore === 0) {
        findings.push('Limited regulatory terminology detected - may not be compliance-focused document');
    }

    return findings.length > 0 ? findings : ['Document appears to be standard regulatory content'];
}

function generateRecommendations(complianceScore, riskScore, findings) {
    const recommendations = [];
    
    if (complianceScore < 70) {
        recommendations.push({
            text: 'Enhance compliance framework documentation',
            priority: 'high',
            action: 'Review and update compliance procedures'
        });
    }
    
    if (riskScore > 0.03) {
        recommendations.push({
            text: 'Implement additional risk mitigation controls',
            priority: 'high',
            action: 'Develop risk assessment protocol'
        });
    }
    
    if (findings.some(f => f.includes('terminology'))) {
        recommendations.push({
            text: 'Standardize regulatory terminology across documents',
            priority: 'medium',
            action: 'Create terminology guideline document'
        });
    }

    // Always include these
    recommendations.push(
        {
            text: 'Schedule regular compliance reviews',
            priority: 'medium',
            action: 'Set up quarterly review calendar'
        },
        {
            text: 'Train staff on identified risk areas',
            priority: 'low',
            action: 'Develop training materials'
        }
    );

    return recommendations;
}

function displayResults(results) {
    // Update scores
    document.getElementById('complianceScore').textContent = results.complianceScore + '%';
    document.getElementById('riskLevel').textContent = results.riskLevel;
    document.getElementById('sentimentScore').textContent = results.sentimentScore + '%';

    // Update risk level color
    const riskElement = document.getElementById('riskLevel');
    riskElement.className = `text-2xl font-bold ${
        results.riskLevel === 'High' ? 'text-red-600' :
        results.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-green-600'
    }`;

    // Display key findings
    const findingsContainer = document.getElementById('keyFindings');
    findingsContainer.innerHTML = results.findings.map(finding => `
        <div class="flex items-start space-x-2">
            <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
            <span class="text-sm">${finding}</span>
        </div>
    `).join('');

    // Display risk keywords
    const keywordsContainer = document.getElementById('riskKeywords');
    keywordsContainer.innerHTML = results.riskKeywords.map(keyword => `
        <span class="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">${keyword}</span>
    `).join('');

    // Display recommendations
    const recommendationsContainer = document.getElementById('nlpRecommendations');
    recommendationsContainer.innerHTML = results.recommendations.map(rec => `
        <div class="flex items-start space-x-3 p-3 border-l-4 ${
            rec.priority === 'high' ? 'border-red-500 bg-red-50' :
            rec.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
            'border-green-500 bg-green-50'
        } rounded">
            <div class="flex-1">
                <div class="font-medium text-gray-900">${rec.text}</div>
                <div class="text-sm text-gray-600 mt-1">${rec.action}</div>
            </div>
            <button onclick="implementRecommendation('${rec.text}')" class="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                Implement
            </button>
        </div>
    `).join('');
}

function implementRecommendation(recommendation) {
    Utils.showNotification(`Implementing: ${recommendation}`, 'success');
}

function loadExample() {
    const exampleText = `COMPLIANCE FRAMEWORK AND RISK MANAGEMENT POLICY

This document outlines the compliance requirements for all financial transactions exceeding $10,000. All institutions must maintain adequate anti-money laundering controls and report suspicious activities immediately.

Key Requirements:
- Customer Due Diligence (CDD) must be performed for all new accounts
- Enhanced Due Diligence (EDD) required for high-risk customers
- Suspicious Activity Reports (SARs) must be filed within 24 hours
- Regular internal audits and compliance training mandatory

Non-compliance may result in significant penalties, including fines up to $1,000,000 and license revocation. All staff must complete annual anti-fraud training.

Recent updates include new requirements for digital asset transactions and cross-border payments. Failure to comply with these regulations constitutes a serious violation.`;

    document.getElementById('regulatoryText').value = exampleText;
    Utils.showNotification('Example regulatory document loaded', 'info');
}

function setupFileUpload() {
    const fileInput = document.getElementById('fileUpload');
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            Utils.showNotification(`File "${file.name}" selected for analysis`, 'info');
            // In real app, this would process the file and extract text
        }
    });
}

function addToHistory(text, type, score) {
    const analysis = {
        id: Date.now(),
        text: text,
        type: type,
        score: score,
        timestamp: new Date().toISOString()
    };

    analysisHistory.unshift(analysis);
    if (analysisHistory.length > 5) {
        analysisHistory = analysisHistory.slice(0, 5);
    }

    updateAnalysisHistory();
    saveAnalysisHistory();
}

function updateAnalysisHistory() {
    const container = document.getElementById('analysisHistory');
    
    if (analysisHistory.length === 0) {
        container.innerHTML = '<div class="text-gray-500 text-sm">No recent analyses</div>';
        return;
    }

    container.innerHTML = analysisHistory.map(analysis => `
        <div class="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
            <div class="flex-1">
                <div class="text-sm font-medium truncate">${analysis.text}</div>
                <div class="text-xs text-gray-500">${analysis.type} • ${analysis.score}%</div>
            </div>
            <div class="text-xs text-gray-500">${new Date(analysis.timestamp).toLocaleTimeString()}</div>
        </div>
    `).join('');
}

function loadAnalysisHistory() {
    const savedHistory = JSON.parse(localStorage.getItem('nlp_analysis_history')) || [];
    analysisHistory = savedHistory;
    updateAnalysisHistory();
}

function saveAnalysisHistory() {
    localStorage.setItem('nlp_analysis_history', JSON.stringify(analysisHistory));
}

function setupNavigation() {
    Navigation.setupNavigation();
}