// Toast notification system
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        ${message}
    `;
    toastContainer.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Format date for display
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Format date only (without time)
function formatDateOnly(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Update summary statistics
async function updateSummaryStats() {
    try {
        // Fetch dashboard analytics data
        const analytics = await fetchData('analytics/dashboard');
        
        // Update total counts
        document.getElementById('totalStudents').textContent = analytics.totals.students || 0;
        document.getElementById('totalTimetables').textContent = analytics.totals.timetables || 0;
        document.getElementById('totalRooms').textContent = analytics.totals.rooms || 0;
        
        // Update student distribution
        updateStudentDistribution(analytics.studentsBySection);
        
        // Update recent notifications
        updateRecentNotifications(analytics.recentNotifications);
        
        // Update upcoming exams
        updateUpcomingExams(analytics.upcomingExams);
        
        // Update seating arrangement
        updateSeatingArrangement();
        
    } catch (error) {
        console.error('Failed to update summary stats:', error);
        showToast('Failed to load dashboard data: ' + error.message, 'error');
    }
}

// Update student distribution section
function updateStudentDistribution(studentsBySection) {
    const container = document.getElementById('studentDistribution');
    
    if (!studentsBySection || studentsBySection.length === 0) {
        container.innerHTML = '<p class="no-data">No student data available</p>';
        return;
    }
    
    let html = '<div class="student-distribution">';
    
    studentsBySection.forEach(section => {
        html += `
            <div class="distribution-item">
                <h4>${section.count}</h4>
                <p>Section ${section.section}</p>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Update recent notifications section
function updateRecentNotifications(notifications) {
    const container = document.getElementById('recentNotifications');
    
    if (!notifications || notifications.length === 0) {
        container.innerHTML = '<p class="no-data">No recent notifications</p>';
        return;
    }
    
    let html = '<ul class="notification-list">';
    
    notifications.slice(0, 5).forEach(notification => {
        // Determine type class
        let typeClass = 'type-info';
        if (notification.type === 'warning') typeClass = 'type-warning';
        if (notification.type === 'success') typeClass = 'type-success';
        if (notification.type === 'error') typeClass = 'type-error';
        
        html += `
            <li class="notification-item">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-message">${notification.message}</div>
                <div class="notification-meta">
                    <span class="notification-type ${typeClass}">${notification.type}</span>
                    <span class="notification-date">${formatDate(notification.createdAt)}</span>
                </div>
            </li>
        `;
    });
    
    html += '</ul>';
    container.innerHTML = html;
}

// Update upcoming exams section
function updateUpcomingExams(exams) {
    const container = document.getElementById('upcomingExams');
    
    if (!exams || exams.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <i class="fas fa-calendar-check" style="font-size: 2rem; color: #666; margin-bottom: 10px;"></i>
                <p class="no-data">No upcoming exams in the next 30 days</p>
                <p style="font-size: 0.9rem; color: #888; margin-top: 5px;">
                    Check the Timetable section for all exam schedules
                </p>
            </div>
        `;
        return;
    }
    
    let html = '<ul class="exam-list">';
    
    exams.slice(0, 5).forEach(exam => {
        // Determine status class
        let statusClass = 'status-scheduled';
        if (exam.status === 'completed') statusClass = 'status-completed';
        if (exam.status === 'cancelled') statusClass = 'status-cancelled';
        
        html += `
            <li class="exam-item">
                <div class="exam-subject">${exam.subject}</div>
                <div class="exam-date">${formatDateOnly(exam.date)} at ${exam.time || 'TBD'}</div>
                <span class="exam-status ${statusClass}">${exam.status || 'Scheduled'}</span>
            </li>
        `;
    });
    
    html += '</ul>';
    container.innerHTML = html;
}

// Update seating arrangement section
async function updateSeatingArrangement() {
    const container = document.getElementById('seatingArrangement');
    
    try {
        // Fetch room assignments data
        const assignmentsData = await fetchData('roomAssignments');
        
        if (!assignmentsData || !assignmentsData.assignments || assignmentsData.assignments.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <i class="fas fa-chair" style="font-size: 2rem; color: #666; margin-bottom: 10px;"></i>
                    <p class="no-data">No seating arrangements available</p>
                    <p style="font-size: 0.9rem; color: #888; margin-top: 5px;">
                        Generate seating plans in the Room Management section
                    </p>
                </div>
            `;
            return;
        }
        
        // Get stats
        const stats = assignmentsData.stats || {};
        const totalRooms = stats.total_rooms || assignmentsData.assignments.length;
        const assignedStudents = stats.assigned_students || 0;
        
        let html = `
            <div class="availability-stats">
                <div class="availability-item">
                    <span class="availability-label">Total Rooms</span>
                    <span class="availability-count">${totalRooms}</span>
                </div>
                <div class="availability-item">
                    <span class="availability-label">Students Assigned</span>
                    <span class="availability-count available-count">${assignedStudents}</span>
                </div>
                <div class="availability-item">
                    <span class="availability-label">Assignment Source</span>
                    <span class="availability-count">${stats.source === 'shuffled_plans' ? 'Shuffled Plans' : 'Auto Generated'}</span>
                </div>
            </div>
            
            <div style="margin-top: 15px; max-height: 200px; overflow-y: auto;">
                <h4 style="margin: 10px 0 5px 0; color: #333; font-size: 1rem;">Room Assignments Preview:</h4>
        `;
        
        // Show first 3 room assignments as preview
        const previewAssignments = assignmentsData.assignments.slice(0, 3);
        previewAssignments.forEach(room => {
            const studentCount = room.students ? room.students.length : 0;
            html += `
                <div style="padding: 8px 0; border-bottom: 1px solid #eee;">
                    <strong>${room.building} - Room ${room.number}</strong>
                    <span style="float: right; color: #666;">${studentCount} students</span>
                </div>
            `;
        });
        
        if (assignmentsData.assignments.length > 3) {
            html += `<div style="text-align: center; padding: 10px; color: #666; font-style: italic;">
                ... and ${assignmentsData.assignments.length - 3} more rooms
            </div>`;
        }
        
        html += '</div>';
        container.innerHTML = html;
        
    } catch (error) {
        console.error('Failed to load seating arrangement data:', error);
        container.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: #f44336; margin-bottom: 10px;"></i>
                <p class="no-data">Error loading seating data</p>
                <p style="font-size: 0.9rem; color: #888; margin-top: 5px;">
                    ${error.message}
                </p>
            </div>
        `;
    }
}

// Update system information
async function updateSystemInfo() {
    try {
        // Fetch database status
        const dbStatus = await fetchData('database/status');
        
        if (dbStatus.status === 'connected') {
            document.getElementById('databaseStatus').innerHTML = `<span class="status-success"><i class="fas fa-check-circle"></i> Connected</span>`;
        } else {
            document.getElementById('databaseStatus').innerHTML = `<span class="status-error"><i class="fas fa-times-circle"></i> Disconnected</span>`;
        }
        
        // Update last updated time
        const now = new Date();
        document.getElementById('lastUpdated').textContent = now.toLocaleString();
    } catch (error) {
        console.error('Failed to update system info:', error);
        document.getElementById('databaseStatus').innerHTML = `<span class="status-error"><i class="fas fa-times-circle"></i> Error</span>`;
    }
}

// Update current date/time
function updateCurrentDateTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Kolkata'
    };
    const dateTimeElement = document.getElementById('currentDateTime');
    if (dateTimeElement) {
        dateTimeElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    updateSummaryStats();
    updateSystemInfo();
    updateCurrentDateTime();
    setInterval(updateCurrentDateTime, 60000); // Update every minute
    setInterval(updateSystemInfo, 300000); // Update system info every 5 minutes
    setInterval(updateSummaryStats, 60000); // Update summary stats every minute
});