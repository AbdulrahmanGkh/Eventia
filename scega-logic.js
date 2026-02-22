
/**
 * SCEGA DASHBOARD LOGIC
 * Separated from app.js to ensure stability and isolation.
 */

window.initScegaDashboard = function () {
    console.log("Initializing SCEGA Dashboard...");

    // Elements
    const sidebarItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const sections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('page-title');
    const pendingContainer = document.getElementById('recent-requests-list');
    const pendingTableBody = document.getElementById('pending-events-body');
    const historyTableBody = document.getElementById('history-events-body');
    const sidebar = document.getElementById('sidebar');

    // Stats
    const statPending = document.getElementById('stat-pending');
    const statApproved = document.getElementById('stat-approved');
    const statRejected = document.getElementById('stat-rejected');

    const EVENTS_DB_KEY = 'eventia_events_db';
    let currentRejectionId = null;

    function getEvents() {
        const stored = localStorage.getItem(EVENTS_DB_KEY);
        try {
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error("Error parsing events:", e);
            return [];
        }
    }

    function saveEvents(events) {
        localStorage.setItem(EVENTS_DB_KEY, JSON.stringify(events));
        renderScegaDashboard();
    }

    // View Switcher
    window.switchView = function (viewId) {
        // Update Sidebar
        sidebarItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.view === viewId) item.classList.add('active');
        });

        // Update Sections
        sections.forEach(sec => {
            sec.classList.remove('active');
            if (sec.id === `view-${viewId}`) sec.classList.add('active');
        });

        // Update Title
        const titles = {
            'overview': 'Dashboard Overview',
            'pending-requests': 'Pending Requests',
            'history': 'Approval History'
        };
        if (pageTitle) pageTitle.textContent = titles[viewId] || 'Admin Dashboard';

        // Mobile Sidebar
        if (window.innerWidth < 992 && sidebar) {
            sidebar.classList.remove('open');
        }
    };

    // Render Dashboard
    function renderScegaDashboard() {
        const events = getEvents();
        console.log("Rendering events:", events.length);

        // Stats
        const pendingEvents = events.filter(e => e.status === 'Pending');
        const approvedEvents = events.filter(e => e.status === 'Upcoming' || e.status === 'Ongoing' || e.status === 'Past');
        const rejectedEvents = events.filter(e => e.status === 'Rejected');

        if (statPending) statPending.textContent = pendingEvents.length;
        if (statApproved) statApproved.textContent = approvedEvents.length;
        if (statRejected) statRejected.textContent = rejectedEvents.length;

        // Render Pending List (Overview)
        if (pendingContainer) {
            if (pendingEvents.length === 0) {
                pendingContainer.innerHTML = '<p class="text-muted" style="text-align: center; padding: 2rem;">No pending requests.</p>';
            } else {
                pendingContainer.innerHTML = pendingEvents.slice(0, 3).map(evt => createRequestCard(evt)).join('');
            }
        }

        // Render Pending Cards
        const pendingCardsContainer = document.getElementById('pending-events-cards');
        if (pendingCardsContainer) {
            if (pendingEvents.length === 0) {
                pendingCardsContainer.innerHTML = `
                    <div style="text-align: center; padding: 3rem; background: #f8f9fa; border-radius: 12px; color: #666;">
                        <i class="fa-regular fa-calendar-check" style="font-size: 3rem; color: #ddd; margin-bottom: 1rem; display: block;"></i>
                        <p style="margin: 0; font-size: 1rem;">No pending requests at the moment</p>
                        <p style="margin: 0.5rem 0 0; font-size: 0.85rem; color: #999;">All caught up! 🎉</p>
                    </div>`;
            } else {
                pendingCardsContainer.innerHTML = pendingEvents.map(evt => `
                    <div style="background: white; border: 1px solid #e0e0e0; border-radius: 12px; padding: 1.25rem; display: grid; grid-template-columns: 1fr auto; gap: 1rem; align-items: center; transition: box-shadow 0.2s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
                        
                        <!-- Event Info -->
                        <div style="display: flex; gap: 1rem; align-items: center;">
                            <!-- Date Badge -->
                            <div style="background: linear-gradient(135deg, #004e92, #4dabf7); color: white; padding: 0.75rem; border-radius: 10px; text-align: center; min-width: 55px; box-shadow: 0 4px 12px rgba(0, 78, 146, 0.25);">
                                <div style="font-size: 0.65rem; text-transform: uppercase; opacity: 0.9;">${new Date(evt.date).toLocaleString('default', { month: 'short' })}</div>
                                <div style="font-size: 1.4rem; font-weight: 700; line-height: 1;">${new Date(evt.date).getDate()}</div>
                            </div>
                            
                            <!-- Details -->
                            <div style="flex: 1;">
                                <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                                    <h4 style="margin: 0; font-size: 1.05rem; font-weight: 600; color: #222;">${evt.title}</h4>
                                    <span style="background: #e8f0fe; color: #1a73e8; padding: 2px 10px; border-radius: 12px; font-size: 0.7rem; font-weight: 500;">${evt.category || 'General'}</span>
                                </div>
                                <div style="display: flex; gap: 1rem; margin-top: 0.5rem; font-size: 0.8rem; color: #666;">
                                    <span><i class="fa-regular fa-clock" style="margin-right: 4px;"></i>${evt.time || 'TBD'}</span>
                                    <span><i class="fa-solid fa-location-dot" style="margin-right: 4px;"></i>${evt.location || 'TBD'}</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Actions -->
                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            <button onclick="viewEventDetails('${evt.id}')" class="btn btn-sm" style="padding: 8px 14px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 8px; font-size: 0.8rem; cursor: pointer; color: #555; font-weight: 500; transition: all 0.2s ease;">
                                <i class="fa-solid fa-eye" style="margin-right: 4px;"></i>View
                            </button>
                            <button onclick="approveEvent('${evt.id}')" class="btn btn-sm btn-success" style="padding: 8px 14px; border-radius: 8px; font-size: 0.8rem; cursor: pointer; font-weight: 500;">
                                <i class="fa-solid fa-check" style="margin-right: 4px;"></i>Approve
                            </button>
                            <button onclick="openRejectionModal('${evt.id}')" class="btn btn-sm btn-danger" style="padding: 8px 14px; border-radius: 8px; font-size: 0.8rem; cursor: pointer; font-weight: 500;">
                                <i class="fa-solid fa-xmark" style="margin-right: 4px;"></i>Reject
                            </button>
                        </div>
                    </div>
                `).join('');
            }
        }

        // Render History Cards
        const historyCardsContainer = document.getElementById('history-events-cards');
        if (historyCardsContainer) {
            const historyEvents = [...approvedEvents, ...rejectedEvents].sort((a, b) => new Date(b.date) - new Date(a.date));

            if (historyEvents.length === 0) {
                historyCardsContainer.innerHTML = `
                    <div style="text-align: center; padding: 3rem; background: #f8f9fa; border-radius: 12px; color: #666;">
                        <i class="fa-regular fa-folder-open" style="font-size: 3rem; color: #ddd; margin-bottom: 1rem; display: block;"></i>
                        <p style="margin: 0; font-size: 1rem;">No history yet</p>
                    </div>`;
            } else {
                historyCardsContainer.innerHTML = historyEvents.map(evt => {
                    const isRejected = evt.status === 'Rejected';
                    const statusIcon = isRejected ? 'fa-circle-xmark' : 'fa-circle-check';
                    const statusColor = isRejected ? '#c62828' : '#2e7d32';
                    const statusBg = isRejected ? 'rgba(198, 40, 40, 0.1)' : 'rgba(46, 125, 50, 0.1)';
                    const statusText = isRejected ? 'Rejected' : 'Approved';

                    // Build rejection note section
                    let noteSection = '';
                    if (isRejected && evt.rejectionReason) {
                        const reason = evt.rejectionReason;
                        const maxLen = 80;
                        if (reason.length <= maxLen) {
                            noteSection = `
                                <div style="margin-top: 0.75rem; padding: 0.75rem; background: rgba(198, 40, 40, 0.05); border-radius: 8px; border-left: 3px solid #c62828;">
                                    <div style="font-size: 0.7rem; color: #999; text-transform: uppercase; margin-bottom: 4px;">Rejection Reason</div>
                                    <div style="font-size: 0.85rem; color: #555;">${reason}</div>
                                </div>`;
                        } else {
                            noteSection = `
                                <div style="margin-top: 0.75rem; padding: 0.75rem; background: rgba(198, 40, 40, 0.05); border-radius: 8px; border-left: 3px solid #c62828;">
                                    <div style="font-size: 0.7rem; color: #999; text-transform: uppercase; margin-bottom: 4px;">Rejection Reason</div>
                                    <div style="font-size: 0.85rem; color: #555;">${reason.substring(0, maxLen)}...
                                        <button onclick="showFullComment('${encodeURIComponent(reason)}')" style="background: none; border: none; color: #c62828; cursor: pointer; font-size: 0.8rem; font-weight: 500;">Read more</button>
                                    </div>
                                </div>`;
                        }
                    }

                    return `
                    <div class="history-card" data-status="${isRejected ? 'rejected' : 'approved'}" style="background: white; border: 1px solid #e8e8e8; border-radius: 12px; padding: 1rem 1.25rem; display: flex; align-items: flex-start; gap: 1rem; transition: all 0.2s ease;">
                        <!-- Status Icon -->
                        <div style="width: 42px; height: 42px; background: ${statusBg}; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <i class="fa-solid ${statusIcon}" style="font-size: 1.2rem; color: ${statusColor};"></i>
                        </div>
                        
                        <!-- Content -->
                        <div style="flex: 1; min-width: 0;">
                            <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
                                <div>
                                    <h4 style="margin: 0; font-size: 1rem; font-weight: 600; color: #222;">${evt.title}</h4>
                                    <div style="display: flex; align-items: center; gap: 0.75rem; margin-top: 4px; font-size: 0.8rem; color: #888;">
                                        <span><i class="fa-regular fa-calendar" style="margin-right: 4px;"></i>${evt.date}</span>
                                        <span><i class="fa-solid fa-tag" style="margin-right: 4px;"></i>${evt.category || 'Event'}</span>
                                    </div>
                                </div>
                                <span style="padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; background: ${statusBg}; color: ${statusColor};">${statusText}</span>
                            </div>
                            ${noteSection}
                        </div>
                    </div>
                `}).join('');
            }
        }
    }

    // History Filter Buttons
    const filterButtons = document.querySelectorAll('.history-filter-btn');
    filterButtons.forEach(btn => {
        // Style the buttons
        btn.style.background = btn.classList.contains('active') ? '#004e92' : '#f0f0f0';
        btn.style.color = btn.classList.contains('active') ? 'white' : '#666';

        btn.addEventListener('click', function () {
            // Update active state
            filterButtons.forEach(b => {
                b.classList.remove('active');
                b.style.background = '#f0f0f0';
                b.style.color = '#666';
            });
            this.classList.add('active');
            this.style.background = '#004e92';
            this.style.color = 'white';

            // Filter cards
            const filter = this.dataset.filter;
            const cards = document.querySelectorAll('.history-card');
            cards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'flex';
                } else {
                    card.style.display = card.dataset.status === filter ? 'flex' : 'none';
                }
            });
        });
    });

    // Helper: Create Card for Overview
    function createRequestCard(evt) {
        return `
            <div class="event-list-item" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 1px solid #eee;">
                <div class="event-info-main">
                    <div class="event-details-text">
                        <h4 style="margin: 0 0 0.5rem 0;">${evt.title}</h4>
                        <div class="event-meta-info" style="font-size: 0.85rem; color: #666;">
                            <span style="margin-right: 1rem;"><i class="fa-regular fa-calendar"></i> ${evt.date}</span>
                            <span><i class="fa-solid fa-ticket"></i> ${evt.category}</span>
                        </div>
                    </div>
                </div>
                 <div class="event-actions">
                    <button class="btn btn-sm btn-primary" style="background: var(--primary-color); color: white; border: none; padding: 0.4rem 1rem; border-radius: 4px; cursor: pointer;" onclick="approveEvent('${evt.id}')">Approve</button>
                </div>
            </div>
        `;
    }

    // Actions
    window.approveEvent = function (id) {
        if (confirm('Are you sure you want to approve this event?')) {
            const events = getEvents();
            const idx = events.findIndex(e => e.id === id);
            if (idx !== -1) {
                events[idx].status = 'Upcoming'; // Default to Upcoming
                saveEvents(events);
                alert('Event Approved Successfully!');
            }
        }
    }

    // View Event Details Modal
    window.viewEventDetails = function (id) {
        const events = getEvents();
        const evt = events.find(e => e.id === id);
        if (!evt) return;

        // Remove existing modal if any
        const existing = document.getElementById('event-details-modal');
        if (existing) existing.remove();

        // Build ticket info
        let ticketInfo = '<div style="color: #2e7d32; font-weight: 600; font-size: 1.1rem;">🎟️ Free Event</div>';
        if (evt.price && evt.price > 0) {
            if (evt.tickets && evt.tickets.length > 0) {
                ticketInfo = evt.tickets.map(t =>
                    `<div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                        <span>${t.name}</span>
                        <strong>${t.price} SAR</strong>
                    </div>`
                ).join('');
            } else {
                ticketInfo = `<div style="color: #1976d2; font-weight: 600; font-size: 1.1rem;">🎟️ ${evt.price} SAR</div>`;
            }
        }

        // Create modal
        const modal = document.createElement('div');
        modal.id = 'event-details-modal';
        modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(3px);" onclick="if(event.target === this) this.parentElement.remove()">
                <div style="background: white; border-radius: 16px; width: 90%; max-width: 520px; max-height: 85vh; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                    
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #3C50C8, #004e92); color: white; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center;">
                        <h2 style="margin: 0; font-size: 1.2rem; font-weight: 600;">
                            <i class="fa-solid fa-file-lines" style="margin-right: 8px;"></i>Event Review
                        </h2>
                        <button onclick="document.getElementById('event-details-modal').remove()" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 1rem;">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 1.5rem; max-height: 55vh; overflow-y: auto;">
                        
                        <!-- Title & Category -->
                        <div style="margin-bottom: 1.25rem;">
                            <h3 style="margin: 0 0 8px 0; font-size: 1.4rem; color: #222;">${evt.title}</h3>
                            <span style="display: inline-block; background: #e8f0fe; color: #1a73e8; padding: 4px 12px; border-radius: 16px; font-size: 0.8rem; font-weight: 500;">${evt.category || 'General'}</span>
                        </div>
                        
                        <!-- Info Grid -->
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 1.25rem;">
                            <div style="text-align: center; padding: 12px; background: #f8f9fa; border-radius: 10px;">
                                <i class="fa-regular fa-calendar" style="color: #5f6368; font-size: 1.25rem;"></i>
                                <div style="font-size: 0.7rem; color: #5f6368; margin-top: 4px;">DATE</div>
                                <div style="font-weight: 600; font-size: 0.85rem;">${evt.date}</div>
                            </div>
                            <div style="text-align: center; padding: 12px; background: #f8f9fa; border-radius: 10px;">
                                <i class="fa-regular fa-clock" style="color: #5f6368; font-size: 1.25rem;"></i>
                                <div style="font-size: 0.7rem; color: #5f6368; margin-top: 4px;">TIME</div>
                                <div style="font-weight: 600; font-size: 0.85rem;">${evt.time || 'TBD'}</div>
                            </div>
                            <div style="text-align: center; padding: 12px; background: #f8f9fa; border-radius: 10px;">
                                <i class="fa-solid fa-location-dot" style="color: #5f6368; font-size: 1.25rem;"></i>
                                <div style="font-size: 0.7rem; color: #5f6368; margin-top: 4px;">LOCATION</div>
                                <div style="font-weight: 600; font-size: 0.75rem; word-break: break-word;">${evt.location || 'TBD'}</div>
                            </div>
                        </div>
                        
                        <!-- Description -->
                        <div style="margin-bottom: 1.25rem;">
                            <div style="font-size: 0.75rem; color: #5f6368; text-transform: uppercase; font-weight: 600; margin-bottom: 6px;">Description</div>
                            <div style="background: #f8f9fa; padding: 12px; border-radius: 8px; font-size: 0.9rem; line-height: 1.5; color: #333;">${evt.description || 'No description provided.'}</div>
                        </div>
                        
                        <!-- Tickets -->
                        <div>
                            <div style="font-size: 0.75rem; color: #5f6368; text-transform: uppercase; font-weight: 600; margin-bottom: 6px;">Tickets & Pricing</div>
                            <div style="background: #f8f9fa; padding: 12px; border-radius: 8px;">${ticketInfo}</div>
                        </div>
                        
                    </div>
                    
                    <!-- Action Footer -->
                    <div style="padding: 1rem 1.5rem; background: #f8f9fa; border-top: 1px solid #e0e0e0; display: flex; gap: 12px;">
                        <button onclick="document.getElementById('event-details-modal').remove(); approveEvent('${evt.id}')" style="flex: 1; padding: 12px; background: #2e7d32; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 0.9rem;">
                            <i class="fa-solid fa-check" style="margin-right: 6px;"></i>Approve
                        </button>
                        <button onclick="document.getElementById('event-details-modal').remove(); openRejectionModal('${evt.id}')" style="flex: 1; padding: 12px; background: #c62828; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 0.9rem;">
                            <i class="fa-solid fa-xmark" style="margin-right: 6px;"></i>Reject
                        </button>
                    </div>
                    
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.openRejectionModal = function (id) {
        currentRejectionId = id;
        const modal = document.getElementById('rejection-modal');
        if (modal) {
            modal.style.display = 'flex';
            document.getElementById('rejection-reason').value = ''; // Clear previous
        }
    }

    window.closeRejectionModal = function () {
        currentRejectionId = null;
        const modal = document.getElementById('rejection-modal');
        if (modal) modal.style.display = 'none';
    }

    window.confirmRejection = function () {
        if (!currentRejectionId) return;
        const reason = document.getElementById('rejection-reason').value;
        // Reason is optional

        const events = getEvents();
        const idx = events.findIndex(e => e.id === currentRejectionId);
        if (idx !== -1) {
            events[idx].status = 'Rejected';
            events[idx].rejectionReason = reason;
            saveEvents(events);
            closeRejectionModal();
            alert('Event Rejected.');
        }
    }

    // Show full rejection comment in a modal popup
    window.showFullComment = function (encodedReason) {
        const reason = decodeURIComponent(encodedReason);

        // Remove existing modal first
        const existing = document.getElementById('comment-modal');
        if (existing) existing.remove();

        // Create new modal
        const modal = document.createElement('div');
        modal.id = 'comment-modal';
        modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 1000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(4px);" onclick="if(event.target === this) this.parentElement.remove()">
                <div style="background: white; padding: 0; border-radius: 16px; width: 90%; max-width: 550px; max-height: 80vh; box-shadow: 0 25px 50px rgba(0,0,0,0.25); overflow: hidden; display: flex; flex-direction: column;">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #c62828, #ef5350); color: white; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center;">
                        <h3 style="margin: 0; font-size: 1.1rem; font-weight: 600;">
                            <i class="fa-solid fa-comment" style="margin-right: 0.5rem;"></i>Rejection Reason
                        </h3>
                        <button onclick="document.getElementById('comment-modal').remove()" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 1rem;">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    
                    <!-- Content - Scrollable for long messages -->
                    <div style="padding: 1.5rem; overflow-y: auto; flex: 1; max-height: 50vh;">
                        <div style="background: #f8f9fa; padding: 1.25rem; border-radius: 10px; border-left: 4px solid #c62828;">
                            <p id="comment-content" style="margin: 0; font-size: 0.95rem; line-height: 1.7; color: #333; white-space: pre-wrap; word-wrap: break-word;"></p>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div style="padding: 1rem 1.5rem; background: #f8f9fa; border-top: 1px solid #e0e0e0;">
                        <button onclick="document.getElementById('comment-modal').remove()" style="width: 100%; padding: 12px; background: #333; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 0.9rem;">Close</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('comment-content').textContent = reason;
    }

    // Sidebar Navigation Interactions
    sidebarItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = item.dataset.view;
            if (view) switchView(view);
        });
    });

    // Mobile Sidebar Toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // Initial Render
    renderScegaDashboard();
};
