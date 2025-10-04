// User management and authentication utilities
class AuthManager {
    static getCurrentUser() {
        return JSON.parse(localStorage.getItem('nirs_user'));
    }

    static setCurrentUser(user) {
        localStorage.setItem('nirs_user', JSON.stringify(user));
    }

    static logout() {
        localStorage.removeItem('nirs_user');
        window.location.href = 'index.html';
    }

    static requireAuth() {
        const user = this.getCurrentUser();
        if (!user) {
            window.location.href = 'index.html';
        }
        return user;
    }

    static updateUserProfile(updates) {
        const user = this.getCurrentUser();
        const updatedUser = { ...user, ...updates };
        this.setCurrentUser(updatedUser);
        return updatedUser;
    }
}

// Mock data store
class DataStore {
    static getData() {
        return JSON.parse(localStorage.getItem('nirs_data')) || [
            { transaction_id: 1, amount: 15000, risk_score: 0.2, timestamp: '2024-01-15T10:30:00Z', signature: 'signed_MTUwMDA', institution: 'Bank A' },
            { transaction_id: 2, amount: 2500000, risk_score: 0.9, timestamp: '2024-01-15T11:15:00Z', signature: 'signed_MjUwMDAw', institution: 'Bank B' },
            { transaction_id: 3, amount: 50000, risk_score: 0.4, timestamp: '2024-01-15T12:00:00Z', signature: 'signed_NTAwMDA', institution: 'Bank C' }
        ];
    }

    static saveData(data) {
        localStorage.setItem('nirs_data', JSON.stringify(data));
    }

    static addData(newData) {
        const currentData = this.getData();
        const updatedData = [...currentData, ...newData];
        this.saveData(updatedData);
        return updatedData;
    }
}

// Navigation helper
class Navigation {
    static navigateTo(page) {
        window.location.href = page;
    }

    static setupNavigation() {
        // Add active state to current page
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('[data-page]');
        
        navLinks.forEach(link => {
            if (link.getAttribute('data-page') === currentPage) {
                link.classList.add('active');
            }
        });
    }
}

// Enhanced Navigation class
class Navigation {
    static navigateTo(page) {
        window.location.href = page;
    }

    static setupNavigation() {
        // Add active state to current page
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('[data-page]');
        
        navLinks.forEach(link => {
            if (link.getAttribute('data-page') === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Setup mobile navigation
        this.setupMobileNavigation();
    }

    static setupMobileNavigation() {
        // Mobile navigation toggle (if needed)
        const mobileNav = document.querySelector('.mobile-nav-toggle');
        if (mobileNav) {
            mobileNav.addEventListener('click', () => {
                const navMenu = document.querySelector('.nav-menu');
                navMenu.classList.toggle('hidden');
            });
        }
    }
}

// Enhanced DataStore with new features
class DataStore {
    static getData() {
        return JSON.parse(localStorage.getItem('nirs_data')) || [
            { transaction_id: 1, amount: 15000, risk_score: 0.2, timestamp: '2024-01-15T10:30:00Z', signature: 'signed_MTUwMDA', institution: 'Bank A' },
            { transaction_id: 2, amount: 2500000, risk_score: 0.9, timestamp: '2024-01-15T11:15:00Z', signature: 'signed_MjUwMDAw', institution: 'Bank B' },
            { transaction_id: 3, amount: 50000, risk_score: 0.4, timestamp: '2024-01-15T12:00:00Z', signature: 'signed_NTAwMDA', institution: 'Bank C' }
        ];
    }

    static saveData(data) {
        localStorage.setItem('nirs_data', JSON.stringify(data));
    }

    static addData(newData) {
        const currentData = this.getData();
        const updatedData = [...currentData, ...newData];
        this.saveData(updatedData);
        return updatedData;
    }

    // New method for analytics data
    static getAnalyticsData() {
        return JSON.parse(localStorage.getItem('nirs_analytics')) || {
            predictions: [],
            riskAssessments: [],
            complianceChecks: []
        };
    }

    static saveAnalyticsData(data) {
        localStorage.setItem('nirs_analytics', JSON.stringify(data));
    }
}

// Enhanced utility functions
const Utils = {
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN'
        }).format(amount);
    },

    formatDate: (dateString) => {
        return new Date(dateString).toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    showNotification: (message, type = 'success') => {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.custom-notification');
        existingNotifications.forEach(notif => notif.remove());

        const notification = document.createElement('div');
        notification.className = `custom-notification fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm transform transition-all duration-300 ${
            type === 'success' ? 'bg-green-500 text-white' : 
            type === 'error' ? 'bg-red-500 text-white' :
            type === 'warning' ? 'bg-yellow-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '💡'}</span>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    },

    simulateAPICall: (duration = 1000) => {
        return new Promise(resolve => {
            setTimeout(resolve, duration);
        });
    },

    generateRandomId: () => {
        return Math.random().toString(36).substr(2, 9);
    },

    // New utility for data export
    exportToCSV: (data, filename) => {
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => row[header]).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}_${new Date().getTime()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    },

    // New utility for risk level calculation
    calculateRiskLevel: (score) => {
        if (score >= 0.8) return { level: 'High', color: 'red' };
        if (score >= 0.5) return { level: 'Medium', color: 'yellow' };
        return { level: 'Low', color: 'green' };
    }
};