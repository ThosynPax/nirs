// Quantum Security functionality
let migrationProgress = {
    legacy: 65,
    quantum: 35,
    hybrid: 45
};

document.addEventListener('DOMContentLoaded', function() {
    const user = AuthManager.requireAuth();
    initializeQuantumSecurity(user);
});

function initializeQuantumSecurity(user) {
    document.getElementById('userName').textContent = user.name;
    updateMigrationProgress();
    setupNavigation();
}

function updateMigrationProgress() {
    // Update progress bars and percentages
    document.getElementById('legacyProgress').textContent = migrationProgress.legacy + '%';
    document.getElementById('quantumProgress').textContent = migrationProgress.quantum + '%';
    document.getElementById('hybridProgress').textContent = migrationProgress.hybrid + '%';
    
    // Update progress bar widths
    document.querySelectorAll('.bg-yellow-500').forEach(el => {
        el.style.width = migrationProgress.legacy + '%';
    });
    document.querySelectorAll('.bg-green-500').forEach(el => {
        el.style.width = migrationProgress.quantum + '%';
    });
    document.querySelectorAll('.bg-blue-500').forEach(el => {
        el.style.width = migrationProgress.hybrid + '%';
    });
}

function accelerateMigration() {
    Utils.showNotification('Accelerating quantum migration...', 'info');
    
    // Simulate migration progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += 5;
        
        migrationProgress.legacy = Math.max(0, migrationProgress.legacy - 2);
        migrationProgress.quantum = Math.min(100, migrationProgress.quantum + 3);
        migrationProgress.hybrid = Math.min(100, migrationProgress.hybrid + 1);
        
        updateMigrationProgress();
        
        if (progress >= 100) {
            clearInterval(interval);
            Utils.showNotification('Migration acceleration completed!', 'success');
            saveMigrationProgress();
        }
    }, 200);
}

function rotateKeys() {
    Utils.showNotification('Initiating encryption key rotation...', 'info');
    
    // Simulate key rotation
    setTimeout(() => {
        Utils.showNotification('All encryption keys successfully rotated!', 'success');
        
        // Update last rotation time
        const now = new Date();
        document.querySelector('.text-green-800').innerHTML = `
            <div>• Key Rotation: Every 24h</div>
            <div>• Last Rotation: Just now</div>
            <div>• Next Rotation: 24h</div>
        `;
    }, 3000);
}

function runSecurityAudit() {
    Utils.showNotification('Running comprehensive security audit...', 'info');
    
    // Simulate audit process
    let auditProgress = 0;
    const auditInterval = setInterval(() => {
        auditProgress += 10;
        Utils.showNotification(`Security audit progress: ${auditProgress}%`, 'info');
        
        if (auditProgress >= 100) {
            clearInterval(auditInterval);
            
            // Generate audit results
            const vulnerabilities = Math.floor(Math.random() * 5);
            const recommendations = [
                'Update Kyber implementation to latest version',
                'Increase key rotation frequency for high-risk systems',
                'Implement additional quantum random number generators',
                'Enhance post-quantum certificate validation'
            ].slice(0, Math.floor(Math.random() * 3) + 1);
            
            let message = `Security audit completed! `;
            if (vulnerabilities === 0) {
                message += 'No critical vulnerabilities found.';
            } else {
                message += `Found ${vulnerabilities} potential vulnerability${vulnerabilities > 1 ? 'ies' : ''}.`;
            }
            
            if (recommendations.length > 0) {
                message += ` Recommendations: ${recommendations.join(', ')}`;
            }
            
            Utils.showNotification(message, vulnerabilities === 0 ? 'success' : 'error');
        }
    }, 500);
}

function updateAlgorithms() {
    Utils.showNotification('Checking for algorithm updates...', 'info');
    
    setTimeout(() => {
        const updatesAvailable = Math.random() > 0.5;
        
        if (updatesAvailable) {
            Utils.showNotification('New quantum-safe algorithms available! Updating...', 'info');
            
            // Simulate update process
            setTimeout(() => {
                Utils.showNotification('Algorithms successfully updated to latest versions!', 'success');
            }, 2000);
        } else {
            Utils.showNotification('All algorithms are up to date!', 'success');
        }
    }, 1500);
}

function generateMigrationReport() {
    const report = {
        title: 'Quantum Migration Progress Report',
        generatedAt: new Date().toISOString(),
        progress: migrationProgress,
        assessment: {
            infrastructure: 85,
            dataProtection: 70,
            communications: 90,
            legacySystems: 60
        },
        recommendations: [
            'Prioritize migration of legacy payment systems',
            'Implement hybrid cryptography for transitional period',
            'Schedule quantum security training for IT staff',
            'Establish quantum incident response team'
        ],
        timeline: {
            phase1: 'Q2 2024 - Core systems migration',
            phase2: 'Q4 2024 - Data encryption upgrade',
            phase3: 'Q2 2025 - Full quantum readiness'
        }
    };

    const dataStr = JSON.stringify(report, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum_migration_report_${new Date().getTime()}.json`;
    a.click();
    
    Utils.showNotification('Migration report generated successfully!', 'success');
}

function saveMigrationProgress() {
    localStorage.setItem('quantum_migration', JSON.stringify(migrationProgress));
}

function loadMigrationProgress() {
    const savedProgress = JSON.parse(localStorage.getItem('quantum_migration'));
    if (savedProgress) {
        migrationProgress = savedProgress;
    }
}

function setupNavigation() {
    Navigation.setupNavigation();
}

// Load migration progress on init
loadMigrationProgress();