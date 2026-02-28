/**
 * VENDOR DASHBOARD LOGIC
 * Handles specific functionality for vendor-dashboard.html
 */

function initVendorDashboard() {
    console.log("Initializing Vendor Dashboard...");

    // Simulate logged-in vendor
    const CURRENT_VENDOR_ID = "v1"; // Luxe Catering Co.

    // Elements
    const sidebarItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const sections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('page-title');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');

    // Load Data
    let requests = JSON.parse(localStorage.getItem('eventia_requests_db')) || [];
    let events = JSON.parse(localStorage.getItem('eventia_events_db')) || [];
    const vendors = JSON.parse(localStorage.getItem('eventia_vendors_db')) || [];

    const currentVendor = vendors.find(v => v.id === CURRENT_VENDOR_ID);
    if (currentVendor) {
        document.getElementById('vendor-name-display').textContent = currentVendor.name;
    }

    // --- VIEW SWITCHING ---
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
            'overview': 'Vendor Dashboard',
            'invitations': 'Manage Invitations',
            'browse-events': 'Browse Events',
            'my-events': 'My Events',
            'event-manage': 'Event Management',
            'profile': 'Vendor Profile'
        };
        if (pageTitle) pageTitle.textContent = titles[viewId] || 'Dashboard';

        // Refresh Data
        if (viewId === 'overview') {
            renderUpcomingEvents();
            updateStats();
        }
        if (viewId === 'invitations') {
            renderMyApplications();
            renderInvitations();
        }
        if (viewId === 'browse-events') renderBrowseEvents();
        if (viewId === 'my-events') renderMyEvents();
        // event-manage data is loaded by openVendorEventManage before switching
        if (viewId !== 'overview') updateStats();

        // Mobile Sidebar Close
        if (window.innerWidth < 992) {
            sidebar.classList.remove('open');
        }
    };

    // Sidebar Click Listeners
    sidebarItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = item.dataset.view;
            if (view && view !== 'logout') switchView(view);
        });
    });

    // Sidebar Toggle
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // --- DATA RENDERING ---

    const INCOMING_REQUESTS_KEY = 'eventia_incoming_requests';

    function getIncomingRequests() {
        return JSON.parse(localStorage.getItem(INCOMING_REQUESTS_KEY)) || [];
    }

    function renderMyApplications() {
        const incomingRequests = getIncomingRequests();
        const myApplications = currentVendor
            ? incomingRequests.filter(r => r.vendorName === currentVendor.name)
            : [];

        const tableBody = document.getElementById('applications-table-body');
        const noMsg = document.getElementById('no-applications-msg');
        const statusFilterEl = document.getElementById('applications-status-filter');
        const tableEl = document.getElementById('applications-table');

        if (!tableBody) return;

        let filtered = myApplications;
        if (statusFilterEl && statusFilterEl.value !== 'all') {
            filtered = filtered.filter(r => r.status === statusFilterEl.value);
        }

        if (filtered.length === 0) {
            tableBody.innerHTML = '';
            if (noMsg) noMsg.style.display = 'block';
            if (tableEl) tableEl.style.display = 'none';
            return;
        }

        if (noMsg) noMsg.style.display = 'none';
        if (tableEl) tableEl.style.display = 'table';

        filtered.sort((a, b) => new Date(b.dateReceived) - new Date(a.dateReceived));

        tableBody.innerHTML = filtered.map(req => {
            const event = events.find(e => e.id === req.eventId);
            const eventTitle = event ? event.title : 'Unknown Event';
            const msgSnippet = req.message.substring(0, 35) + (req.message.length > 35 ? '...' : '');
            const msgEscaped = (req.message || '').replace(/'/g, "\\'").replace(/\n/g, ' ');
            const readMoreLink = req.message.length > 35
                ? `<a href="#" onclick="event.preventDefault(); openMessageModal('${msgEscaped}')" style="color: #3b82f6; font-size: 0.8rem; margin-left: 6px; text-decoration: none;">Read more</a>`
                : '';

            let statusClass = req.status === 'Pending' ? 'status-pending' : req.status === 'Approved' ? 'status-approved' : 'status-rejected';
            const dateStr = req.dateReceived ? new Date(req.dateReceived).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

            return `
                <tr>
                    <td><div style="display: flex; align-items: center; gap: 6px;"><i class="fa-solid fa-calendar" style="color: #94a3b8; font-size: 0.8rem;"></i><span style="color: #334155;">${eventTitle}</span></div></td>
                    <td><div style="font-weight: 500; color: #1e293b;">Event Organizer</div></td>
                    <td><span style="color: #64748b; font-size: 0.9rem;">${req.serviceType || '—'}</span></td>
                    <td><span style="color: #64748b; font-size: 0.85rem;">${dateStr}</span></td>
                    <td><div style="color: #475569; font-size: 0.9rem;">${msgSnippet}${readMoreLink}</div></td>
                    <td><span class="status-badge ${statusClass}">${req.status}</span></td>
                </tr>
            `;
        }).join('');
    }

    function renderInvitations() {
        // Filter requests for this vendor
        const myRequests = requests.filter(r => r.vendorId === CURRENT_VENDOR_ID);
        const pendingRequests = myRequests.filter(r => r.status === 'Pending');

        const container = document.getElementById('invitations-cards-container');
        const inviteFilterEl = document.getElementById('invite-filter');

        if (container) {
            const filter = inviteFilterEl ? inviteFilterEl.value : 'all';
            let displayRequests = filter !== 'all' ? myRequests.filter(r => r.status === filter) : myRequests;

            displayRequests.sort((a, b) => new Date(b.dateSent) - new Date(a.dateSent));

            if (displayRequests.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 3rem; background: #f8f9fa; border-radius: 12px; color: #666;">
                        <i class="fa-regular fa-envelope" style="font-size: 3rem; color: #ddd; margin-bottom: 1rem; display: block;"></i>
                        <p style="margin: 0; font-size: 1rem;">No invitations</p>
                        <p style="margin: 0.5rem 0 0; font-size: 0.85rem; color: #999;">Organizers will send you event invitations here</p>
                    </div>`;
            } else {
                container.innerHTML = displayRequests.map(req => {
                    const event = events.find(e => e.id === req.eventId);
                    if (!event) return '';

                    const eventDate = new Date(event.date);
                    const month = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();
                    const day = eventDate.getDate();

                    // Only show action buttons for Pending status
                    let actionButtons = '';
                    if (req.status === 'Pending') {
                        actionButtons = `
                            <button onclick="viewInvitationDetails('${req.id}')" class="btn btn-sm" style="padding: 8px 14px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 8px; font-size: 0.8rem; cursor: pointer; color: #555; font-weight: 500; transition: all 0.2s ease;">
                                <i class="fa-solid fa-eye" style="margin-right: 4px;"></i>View
                            </button>
                            <button onclick="acceptInvitation('${req.id}')" class="btn btn-sm btn-success" style="padding: 8px 14px; border-radius: 8px; font-size: 0.8rem; cursor: pointer; font-weight: 500;">
                                <i class="fa-solid fa-check" style="margin-right: 4px;"></i>Accept
                            </button>
                            <button onclick="openRejectModal('${req.id}')" class="btn btn-sm btn-danger" style="padding: 8px 14px; border-radius: 8px; font-size: 0.8rem; cursor: pointer; font-weight: 500;">
                                <i class="fa-solid fa-xmark" style="margin-right: 4px;"></i>Reject
                            </button>
                        `;
                    } else {
                        // Show status badge for non-Pending requests
                        const statusClass = req.status === 'Approved' ? 'status-approved' : 'status-rejected';
                        const statusColor = req.status === 'Approved' ? '#2e7d32' : '#c62828';
                        const statusBg = req.status === 'Approved' ? 'rgba(46, 125, 50, 0.1)' : 'rgba(198, 40, 40, 0.1)';
                        actionButtons = `
                            <span style="padding: 6px 14px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; background: ${statusBg}; color: ${statusColor};">${req.status}</span>
                        `;
                    }

                    return `
                        <div style="background: white; border: 1px solid #e8e8e8; border-radius: 12px; padding: 1rem 1.25rem; display: flex; align-items: center; gap: 1rem; transition: all 0.2s ease;">
                            <!-- Date Box -->
                            <div class="blue-date-box">
                                <span class="date-month">${month}</span>
                                <span class="date-day">${day}</span>
                            </div>
                            
                            <!-- Event Details -->
                            <div style="flex: 1;">
                                <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                                    <h4 style="margin: 0; font-size: 1.05rem; font-weight: 600; color: #222;">${event.title}</h4>
                                    <span style="background: #e8f0fe; color: #1a73e8; padding: 2px 10px; border-radius: 12px; font-size: 0.7rem; font-weight: 500;">${event.category || 'Event'}</span>
                                </div>
                                <div style="display: flex; gap: 1rem; margin-top: 0.5rem; font-size: 0.8rem; color: #666;">
                                    <span><i class="fa-regular fa-clock" style="margin-right: 4px;"></i>${event.time || 'TBD'}</span>
                                    <span><i class="fa-solid fa-location-dot" style="margin-right: 4px;"></i>${event.location || 'TBD'}</span>
                                </div>
                            </div>
                            
                            <!-- Actions -->
                            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                                ${actionButtons}
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }

        // Sidebar badge
        const sidebarBadge = document.getElementById('sidebar-invite-badge');
        if (sidebarBadge) {
            sidebarBadge.textContent = pendingRequests.length;
            sidebarBadge.style.display = pendingRequests.length > 0 ? 'inline-block' : 'none';
        }

        // Invitations tab badge
        const tabBadge = document.getElementById('invitations-tab-badge');
        if (tabBadge) {
            tabBadge.textContent = pendingRequests.length;
            tabBadge.style.display = pendingRequests.length > 0 ? 'inline-block' : 'none';
        }
    }

    window.openMessageModal = function (content) {
        const modal = document.getElementById('message-modal');
        const el = document.getElementById('full-message-content');
        if (modal && el) {
            el.textContent = content ? content.replace(/\\'/g, "'") : '';
            modal.classList.remove('hidden');
        }
    };

    window.closeMessageModal = function () {
        const modal = document.getElementById('message-modal');
        if (modal) modal.classList.add('hidden');
    };

    window.viewInvitationDetails = function (requestId) {
        const req = requests.find(r => r.id === requestId);
        if (!req) return;

        const event = events.find(e => e.id === req.eventId);
        if (!event) return;

        // Remove existing modal if any
        const existing = document.getElementById('invitation-details-modal');
        if (existing) existing.remove();

        // Build ticket info
        let ticketInfo = '<div style="color: #2e7d32; font-weight: 600; font-size: 1.1rem;"><i class="fa-solid fa-ticket" style="margin-right: 6px;"></i>Free Event</div>';
        if (event.price && event.price > 0) {
            if (event.tickets && event.tickets.length > 0) {
                ticketInfo = event.tickets.map(t =>
                    `<div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                        <span>${t.name}</span>
                        <strong>${t.price} SAR</strong>
                    </div>`
                ).join('');
            } else {
                ticketInfo = `<div style="color: #1976d2; font-weight: 600; font-size: 1.1rem;"><i class="fa-solid fa-ticket" style="margin-right: 6px;"></i>${event.price} SAR</div>`;
            }
        }

        // Build action buttons based on status
        let actionButtons = '';
        if (req.status === 'Pending') {
            actionButtons = `
                <div style="display: flex; gap: 12px; padding: 1rem 1.5rem; border-top: 1px solid #e5e7eb;">
                    <button onclick="document.getElementById('invitation-details-modal').remove(); acceptInvitation('${req.id}')" style="flex: 1; padding: 12px; background: #2e7d32; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 0.9rem;">
                        <i class="fa-solid fa-check" style="margin-right: 6px;"></i>Accept
                    </button>
                    <button onclick="document.getElementById('invitation-details-modal').remove(); openRejectModal('${req.id}')" style="flex: 1; padding: 12px; background: #c62828; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 0.9rem;">
                        <i class="fa-solid fa-xmark" style="margin-right: 6px;"></i>Reject
                    </button>
                </div>
            `;
        } else {
            actionButtons = `
                <div style="padding: 1rem 1.5rem; border-top: 1px solid #e5e7eb;">
                    <button onclick="document.getElementById('invitation-details-modal').remove()" style="width: 100%; padding: 12px; background: #004e92; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 0.9rem;">
                        Close
                    </button>
                </div>
            `;
        }

        // Create modal
        const modal = document.createElement('div');
        modal.id = 'invitation-details-modal';
        modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(3px);" onclick="if(event.target === this) this.parentElement.remove()">
                <div style="background: white; border-radius: 16px; width: 90%; max-width: 520px; max-height: 85vh; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                    
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #3C50C8, #004e92); color: white; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center;">
                        <h2 style="margin: 0; font-size: 1.2rem; font-weight: 600;">
                            <i class="fa-solid fa-file-lines" style="margin-right: 8px;"></i>Event Review
                        </h2>
                        <button onclick="document.getElementById('invitation-details-modal').remove()" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 1rem;">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 1.5rem; max-height: 55vh; overflow-y: auto;">
                        
                        <!-- Title & Category -->
                        <div style="margin-bottom: 1.25rem;">
                            <h3 style="margin: 0 0 8px 0; font-size: 1.4rem; color: #222;">${event.title}</h3>
                            <span style="display: inline-block; background: #e8f0fe; color: #1a73e8; padding: 4px 12px; border-radius: 16px; font-size: 0.8rem; font-weight: 500;">${event.category || 'General'}</span>
                        </div>
                        
                        <!-- Info Grid -->
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 1.25rem;">
                            <div style="text-align: center; padding: 12px; background: #f8f9fa; border-radius: 10px;">
                                <i class="fa-regular fa-calendar" style="color: #5f6368; font-size: 1.25rem;"></i>
                                <div style="font-size: 0.7rem; color: #5f6368; margin-top: 4px;">DATE</div>
                                <div style="font-weight: 600; font-size: 0.85rem;">${event.date}</div>
                            </div>
                            <div style="text-align: center; padding: 12px; background: #f8f9fa; border-radius: 10px;">
                                <i class="fa-regular fa-clock" style="color: #5f6368; font-size: 1.25rem;"></i>
                                <div style="font-size: 0.7rem; color: #5f6368; margin-top: 4px;">TIME</div>
                                <div style="font-weight: 600; font-size: 0.85rem;">${event.time || 'TBD'}</div>
                            </div>
                            <div style="text-align: center; padding: 12px; background: #f8f9fa; border-radius: 10px;">
                                <i class="fa-solid fa-location-dot" style="color: #5f6368; font-size: 1.25rem;"></i>
                                <div style="font-size: 0.7rem; color: #5f6368; margin-top: 4px;">LOCATION</div>
                                <div style="font-weight: 600; font-size: 0.75rem; word-break: break-word;">${event.location || 'TBD'}</div>
                            </div>
                        </div>
                        
                        <!-- Description -->
                        <div style="margin-bottom: 1.25rem;">
                            <div style="font-size: 0.8rem; color: #5f6368; text-transform: uppercase; font-weight: 600; margin-bottom: 8px;">DESCRIPTION</div>
                            <p style="margin: 0; line-height: 1.6; color: #333;">${event.description || 'No description provided.'}</p>
                        </div>

                        <!-- Withdrawal Policy -->
                        ${(function () {
                const policyLabels = { 'flexible': 'Flexible — Up to 7 days before event', 'moderate': 'Moderate — Up to 14 days before event', 'strict': 'Strict — Up to 30 days before event', 'non-refundable': 'Non-refundable — No withdrawal allowed' };
                const policyIcons = { 'flexible': 'fa-unlock', 'moderate': 'fa-clock', 'strict': 'fa-lock', 'non-refundable': 'fa-ban' };
                const policyColors = { 'flexible': '#2e7d32', 'moderate': '#ff9800', 'strict': '#e65100', 'non-refundable': '#c62828' };
                const policyBgs = { 'flexible': '#e8f5e9', 'moderate': '#fff3e0', 'strict': '#fbe9e7', 'non-refundable': '#ffebee' };
                const pol = event.withdrawalPolicy;
                if (!pol) return '';
                return `
                            <div style="margin-bottom: 1.25rem; background: ${policyBgs[pol] || '#f5f5f5'}; padding: 1rem; border-radius: 10px; border-left: 4px solid ${policyColors[pol] || '#666'};">
                                <div style="font-size: 0.8rem; color: ${policyColors[pol] || '#666'}; text-transform: uppercase; font-weight: 600; margin-bottom: 6px;">
                                    <i class="fa-solid fa-shield-halved" style="margin-right: 4px;"></i>WITHDRAWAL POLICY
                                </div>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <i class="fa-solid ${policyIcons[pol] || 'fa-shield'}" style="font-size: 1.2rem; color: ${policyColors[pol] || '#666'};"></i>
                                    <span style="font-weight: 600; color: #333; font-size: 0.95rem;">${policyLabels[pol] || pol}</span>
                                </div>
                            </div>`;
            })()}

                        <!-- Message from Organizer -->
                        ${req.message ? `
                        <div style="margin-bottom: 1.25rem; background: #e8f0fe; padding: 1rem; border-radius: 8px; border-left: 3px solid #1a73e8;">
                            <div style="font-size: 0.8rem; color: #1565c0; text-transform: uppercase; font-weight: 600; margin-bottom: 8px;">
                                <i class="fa-solid fa-envelope" style="margin-right: 4px;"></i>MESSAGE FROM ORGANIZER
                            </div>
                            <p style="margin: 0; line-height: 1.6; color: #333;">${req.message}</p>
                        </div>
                        ` : ''}
                        
                        <!-- Tickets -->
                        <div>
                            <div style="font-size: 0.8rem; color: #5f6368; text-transform: uppercase; font-weight: 600; margin-bottom: 8px;">TICKETS & PRICING</div>
                            ${ticketInfo}
                        </div>
                        
                    </div>
                    
                    <!-- Action Buttons -->
                    ${actionButtons}
                    
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    };

    function renderUpcomingEvents() {
        const container = document.getElementById('upcoming-events-container');
        if (!container) return;

        // Get approved requests for upcoming events only
        const approvedRequests = requests.filter(r => r.vendorId === CURRENT_VENDOR_ID && r.status === 'Approved');
        const upcomingEvents = approvedRequests
            .map(req => {
                const event = events.find(e => e.id === req.eventId);
                return event && new Date(event.date) >= new Date() ? { req, event } : null;
            })
            .filter(item => item !== null)
            .sort((a, b) => new Date(a.event.date) - new Date(b.event.date));

        if (upcomingEvents.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; background: #f8f9fa; border-radius: 12px; color: #666;">
                    <i class="fa-regular fa-calendar" style="font-size: 3rem; color: #ddd; margin-bottom: 1rem; display: block;"></i>
                    <p style="margin: 0; font-size: 1rem;">You have no upcoming events</p>
                    <p style="margin: 0.5rem 0 0; font-size: 0.85rem; color: #999;">Browse events and apply to participate</p>
                </div>`;
            return;
        }

        container.innerHTML = upcomingEvents.slice(0, 3).map(({ req, event }) => {
            const eventDate = new Date(event.date);
            const month = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();
            const day = eventDate.getDate();

            return `
                <div style="background: white; border: 1px solid #e8e8e8; border-radius: 12px; padding: 1rem 1.25rem; display: flex; align-items: center; gap: 1rem; transition: all 0.2s ease;">
                    <!-- Date Box -->
                    <div class="blue-date-box" style="min-width: 60px;">
                        <span class="date-month">${month}</span>
                        <span class="date-day">${day}</span>
                    </div>
                    
                    <!-- Event Details -->
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                            <h4 style="margin: 0; font-size: 1.05rem; font-weight: 600; color: #222;">${event.title}</h4>
                            <span style="background: #e8f0fe; color: #1a73e8; padding: 2px 10px; border-radius: 12px; font-size: 0.7rem; font-weight: 500;">${event.category || 'Event'}</span>
                        </div>
                        <div style="display: flex; gap: 1rem; margin-top: 0.5rem; font-size: 0.8rem; color: #666;">
                            <span><i class="fa-regular fa-clock" style="margin-right: 4px;"></i>${event.time || 'TBD'}</span>
                            <span><i class="fa-solid fa-location-dot" style="margin-right: 4px;"></i>${event.location || 'TBD'}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderMyEvents() {
        const myEventsContainer = document.getElementById('my-events-container');
        if (!myEventsContainer) return;

        const searchEl = document.getElementById('my-events-search');
        const searchTerm = (searchEl && searchEl.value.trim()) ? searchEl.value.toLowerCase() : '';

        // My Events are Approved requests
        let approvedRequests = requests.filter(r => r.vendorId === CURRENT_VENDOR_ID && r.status === 'Approved');

        // Filter by search (event title or location)
        if (searchTerm) {
            approvedRequests = approvedRequests.filter(req => {
                const event = events.find(e => e.id === req.eventId);
                if (!event) return false;
                const title = (event.title || '').toLowerCase();
                const location = (event.location || '').toLowerCase();
                return title.includes(searchTerm) || location.includes(searchTerm);
            });
        }

        if (approvedRequests.length === 0) {
            const isSearch = !!searchTerm;
            myEventsContainer.innerHTML = `
                <div class="vendor-my-events-empty">
                    <div class="vendor-my-events-empty-icon">
                        <i class="fa-solid fa-calendar-xmark"></i>
                    </div>
                    <h4 class="vendor-my-events-empty-title">${isSearch ? 'No events match your search' : "You haven't joined any events yet"}</h4>
                    <p class="vendor-my-events-empty-desc">${isSearch ? 'Try a different search term or clear the search.' : 'Browse events and apply to get confirmed for upcoming events.'}</p>
                    ${!isSearch ? '<button type="button" class="btn btn-primary" onclick="switchView(\'browse-events\')"><i class="fa-solid fa-earth-americas"></i> Browse Events</button>' : ''}
                </div>`;
            return;
        }

        myEventsContainer.innerHTML = approvedRequests.map(req => {
            const event = events.find(e => e.id === req.eventId);
            if (!event) return '';

            const isPast = new Date(event.date) < new Date();
            const eventStatus = isPast ? 'Past' : 'Upcoming';
            const monthShort = new Date(event.date).toLocaleString('default', { month: 'short' }).toUpperCase();
            const dayNum = new Date(event.date).getDate();

            return `
                <div class="event-card-horizontal">
                    <div class="blue-date-box" style="min-width: 60px;">
                        <span class="date-month">${monthShort}</span>
                        <span class="date-day">${dayNum}</span>
                    </div>
                    <div>
                        <h3>${event.title}</h3>
                        <div class="vendor-my-events-meta">
                            <span><i class="fa-solid fa-location-dot"></i> ${event.location}</span>
                            <span><i class="fa-regular fa-clock"></i> ${event.time}</span>
                        </div>
                    </div>
                    <div>
                        <span class="status-badge status-${eventStatus.toLowerCase()}">${eventStatus}</span>
                    </div>
                    <div>
                        <button class="btn btn-sm btn-primary" onclick="openVendorEventManage('${req.eventId}', '${req.id}')" style="font-size: 0.78rem;"><i class="fa-solid fa-sliders"></i> Manage</button>
                    </div>
                </div>`;
        }).join('');
    }

    function renderBrowseEvents() {
        const container = document.getElementById('browse-events-container');
        if (!container) return;

        const filter = document.getElementById('browse-events-filter') ? document.getElementById('browse-events-filter').value : 'all';
        const search = document.getElementById('browse-events-search') ? document.getElementById('browse-events-search').value.toLowerCase() : '';

        let incomingRequests = JSON.parse(localStorage.getItem('eventia_incoming_requests')) || [];

        // Filter events: Upcoming only
        let displayEvents = events.filter(e => {
            const isUpcoming = new Date(e.date) >= new Date();
            const matchesCategory = filter === 'all' || e.category === filter;
            const matchesSearch = e.title.toLowerCase().includes(search) || (e.location && e.location.toLowerCase().includes(search));
            return isUpcoming && matchesCategory && matchesSearch;
        });

        // Results count
        const resultsCountEl = document.getElementById('browse-events-results-count');
        if (resultsCountEl) {
            resultsCountEl.textContent = displayEvents.length === 0 ? 'No events found.' : `${displayEvents.length} event(s) found.`;
        }

        if (displayEvents.length === 0) {
            container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">No upcoming events found matching your criteria.</div>`;
            return;
        }

        container.innerHTML = displayEvents.map(event => {
            // Check if current vendor already applied to this event
            const hasApplied = currentVendor && incomingRequests.some(req => req.vendorName === currentVendor.name && req.eventId === event.id);

            let actionBtn = `<button class="btn btn-primary" style="width: 100%;" onclick="openApplyModal('${event.id}')">Apply Now</button>`;

            if (hasApplied) {
                actionBtn = `<button class="btn btn-outline" style="width: 100%; cursor: default; background: #e3f2fd; color: #1976d2; border-color: #e3f2fd;" disabled>Applied <i class="fa-solid fa-check"></i></button>`;
            }

            return `
                <div class="event-card" style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #f0f0f0; display: flex; flex-direction: column;">
                    <div style="height: 140px; background: linear-gradient(135deg, #004e92, #4dabf7); display: flex; align-items: center; justify-content: center; color: white; position: relative;">
                         <div style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.3); padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; backdrop-filter: blur(4px);">${event.category}</div>
                         <i class="fa-solid fa-calendar-days" style="font-size: 3rem; opacity: 0.3;"></i>
                    </div>
                    <div style="padding: 1.25rem; flex: 1; display: flex; flex-direction: column;">
                        <h3 style="margin: 0 0 0.5rem 0; font-size: 1.1rem;">${event.title}</h3>
                        <p style="margin: 0 0 1rem 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5; flex: 1;">${event.description.substring(0, 80)}...</p>
                        
                        <div style="display: flex; gap: 1rem; margin-bottom: 1rem; font-size: 0.85rem; color: #555;">
                            <span><i class="fa-solid fa-location-dot" style="color: var(--primary-color);"></i> ${event.location}</span>
                            <span><i class="fa-regular fa-clock" style="color: var(--primary-color);"></i> ${event.date}</span>
                        </div>
                        
                        ${actionBtn}
                    </div>
                </div>
            `;
        }).join('');
    }

    function updateStats() {
        const myRequests = requests.filter(r => r.vendorId === CURRENT_VENDOR_ID);
        const pending = myRequests.filter(r => r.status === 'Pending').length;
        const approved = myRequests.filter(r => r.status === 'Approved');

        let active = 0;
        let completed = 0;

        approved.forEach(req => {
            const event = events.find(e => e.id === req.eventId);
            if (event) {
                if (new Date(event.date) < new Date()) {
                    completed++;
                } else {
                    active++;
                }
            }
        });

        document.getElementById('stat-pending-invites').textContent = pending;
        document.getElementById('stat-active-events').textContent = active;
        document.getElementById('stat-completed-events').textContent = completed;
    }

    // --- ACTIONS ---

    window.acceptInvitation = function (requestId) {
        const reqIndex = requests.findIndex(r => r.id === requestId);
        if (reqIndex > -1) {
            requests[reqIndex].status = 'Approved';
            localStorage.setItem('eventia_requests_db', JSON.stringify(requests));
            showToast('Invitation Accepted!');

            // Refresh
            renderInvitations();
            renderMyEvents();
            updateStats();
        }
    };

    // Reject Logic
    window.openRejectModal = function (requestId) {
        const req = requests.find(r => r.id === requestId);
        if (!req) return;

        const event = events.find(e => e.id === req.eventId);
        const eventTitle = event ? event.title : 'Unknown Event';

        document.getElementById('reject-request-id').value = requestId;
        document.getElementById('reject-event-title').value = eventTitle;
        document.getElementById('reject-event-name-display').textContent = eventTitle;

        const modal = document.getElementById('reject-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    };

    window.closeRejectModal = function () {
        const modal = document.getElementById('reject-modal');
        if (modal) {
            modal.style.display = 'none';
        }
        document.getElementById('reject-form').reset();
    };

    document.getElementById('reject-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const requestId = document.getElementById('reject-request-id').value;
        const reason = document.getElementById('reject-reason').value;

        const reqIndex = requests.findIndex(r => r.id === requestId);
        if (reqIndex > -1) {
            requests[reqIndex].status = 'Rejected';
            requests[reqIndex].rejectionReason = reason; // Add reason to data
            localStorage.setItem('eventia_requests_db', JSON.stringify(requests));

            showToast('Invitation Rejected');
            closeRejectModal();
            renderInvitations();
            updateStats();
        }
    });

    // Withdraw Logic — with policy enforcement
    function getWithdrawalPolicyInfo(policy, eventDate) {
        const policyLabels = { 'flexible': 'Flexible — Up to 7 days before event', 'moderate': 'Moderate — Up to 14 days before event', 'strict': 'Strict — Up to 30 days before event', 'non-refundable': 'Non-refundable — No withdrawal allowed' };
        const policyColors = { 'flexible': '#2e7d32', 'moderate': '#ff9800', 'strict': '#e65100', 'non-refundable': '#c62828' };
        const policyBgs = { 'flexible': '#e8f5e9', 'moderate': '#fff3e0', 'strict': '#fbe9e7', 'non-refundable': '#ffebee' };
        const policyIcons = { 'flexible': 'fa-unlock', 'moderate': 'fa-clock', 'strict': 'fa-lock', 'non-refundable': 'fa-ban' };

        const label = policyLabels[policy] || 'No policy set';
        const color = policyColors[policy] || '#666';
        const bg = policyBgs[policy] || '#f5f5f5';
        const icon = policyIcons[policy] || 'fa-shield';

        // Check if withdrawal is allowed
        let allowed = true;
        let reason = '';
        const now = new Date();
        const evtDate = new Date(eventDate);
        const daysUntilEvent = Math.ceil((evtDate - now) / (1000 * 60 * 60 * 24));

        if (policy === 'non-refundable') {
            allowed = false;
            reason = 'This request has a non-refundable withdrawal policy. You cannot withdraw.';
        } else if (policy === 'strict' && daysUntilEvent < 30) {
            allowed = false;
            reason = `Withdrawal deadline has passed. Policy requires at least 30 days before the event (${daysUntilEvent} days remaining).`;
        } else if (policy === 'moderate' && daysUntilEvent < 14) {
            allowed = false;
            reason = `Withdrawal deadline has passed. Policy requires at least 14 days before the event (${daysUntilEvent} days remaining).`;
        } else if (policy === 'flexible' && daysUntilEvent < 7) {
            allowed = false;
            reason = `Withdrawal deadline has passed. Policy requires at least 7 days before the event (${daysUntilEvent} days remaining).`;
        }

        return { label, color, bg, icon, allowed, reason, daysUntilEvent };
    }

    window.openWithdrawModal = function (requestId) {
        const req = requests.find(r => r.id === requestId);
        if (!req) return;

        const event = events.find(e => e.id === req.eventId);
        const eventTitle = event ? event.title : 'Unknown Event';
        const eventDate = event ? event.date : null;

        // Check withdrawal policy
        const policy = event ? event.withdrawalPolicy : null;
        const policyInfo = getWithdrawalPolicyInfo(policy, eventDate);

        // Update policy banner in the modal
        const policyBanner = document.getElementById('withdraw-policy-banner');
        if (policyBanner) {
            if (policy) {
                policyBanner.style.display = 'block';
                policyBanner.style.background = policyInfo.bg;
                policyBanner.style.borderLeftColor = policyInfo.color;
                policyBanner.innerHTML = `
                <div style="display: flex; gap: 0.75rem; align-items: start;">
                        <i class="fa-solid fa-shield-halved" style="color: ${policyInfo.color}; font-size: 1.1rem; margin-top: 2px;"></i>
                        <div>
                            <strong style="color: ${policyInfo.color}; display: block; margin-bottom: 4px;">Withdrawal Policy</strong>
                            <p style="margin: 0; color: #555; font-size: 0.85rem; line-height: 1.5;">
                                <i class="fa-solid ${policyInfo.icon}" style="margin-right: 4px;"></i>${policyInfo.label}
                            </p>
                            ${!policyInfo.allowed ? `<p style="margin: 6px 0 0; color: ${policyInfo.color}; font-size: 0.85rem; font-weight: 600;"><i class="fa-solid fa-circle-exclamation" style="margin-right: 4px;"></i>${policyInfo.reason}</p>` : ''}
                        </div>
                    </div>
                `;
            } else {
                policyBanner.style.display = 'none';
            }
        }

        // If not allowed, block the form
        const submitBtn = document.querySelector('#withdraw-form button[type="submit"]');
        const reasonField = document.getElementById('withdraw-reason');
        if (!policyInfo.allowed) {
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.5';
                submitBtn.style.cursor = 'not-allowed';
            }
            if (reasonField) {
                reasonField.disabled = true;
                reasonField.placeholder = 'Withdrawal is not allowed under the current policy.';
                reasonField.required = false;
            }
        } else {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.style.cursor = 'pointer';
            }
            if (reasonField) {
                reasonField.disabled = false;
                reasonField.placeholder = 'Please provide a reason for your withdrawal...';
                reasonField.required = true;
            }
        }

        document.getElementById('withdraw-request-id').value = requestId;
        document.getElementById('withdraw-event-title').value = eventTitle;
        document.getElementById('withdraw-event-name-display').textContent = eventTitle;

        const modal = document.getElementById('withdraw-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    };

    window.closeWithdrawModal = function () {
        const modal = document.getElementById('withdraw-modal');
        if (modal) {
            modal.style.display = 'none';
        }
        document.getElementById('withdraw-form').reset();
    };

    document.getElementById('withdraw-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const requestId = document.getElementById('withdraw-request-id').value;
        const reason = document.getElementById('withdraw-reason').value;

        const reqIndex = requests.findIndex(r => r.id === requestId);
        if (reqIndex > -1) {
            // Double-check policy enforcement
            const req = requests[reqIndex];
            const event = events.find(ev => ev.id === req.eventId);
            const policyInfo = getWithdrawalPolicyInfo(event ? event.withdrawalPolicy : null, event ? event.date : null);
            if (!policyInfo.allowed) {
                showToast('Withdrawal blocked by policy');
                return;
            }

            requests[reqIndex].status = 'Rejected';
            requests[reqIndex].rejectionReason = `Withdrawn by Vendor: ${reason} `;
            localStorage.setItem('eventia_requests_db', JSON.stringify(requests));

            showToast('Withdrawn from event');
            closeWithdrawModal();
            renderMyEvents();
            updateStats();
        }
    });

    // Apply Modal Logic
    window.openApplyModal = function (eventId) {
        document.getElementById('apply-event-id').value = eventId;

        // Populate withdrawal policy
        const event = events.find(e => e.id === eventId);
        const policyBanner = document.getElementById('apply-policy-banner');
        if (event && policyBanner && event.withdrawalPolicy) {
            const policyInfo = getWithdrawalPolicyInfo(event.withdrawalPolicy, event.date);
            policyBanner.style.display = 'block';
            policyBanner.style.background = policyInfo.bg;
            policyBanner.style.borderLeftColor = policyInfo.color;
            policyBanner.innerHTML = `
                <div style="display: flex; gap: 0.75rem; align-items: start;">
                    <i class="fa-solid fa-shield-halved" style="color: ${policyInfo.color}; font-size: 1.1rem; margin-top: 2px;"></i>
                    <div>
                        <strong style="color: ${policyInfo.color}; display: block; margin-bottom: 4px;">Withdrawal Policy</strong>
                        <p style="margin: 0; color: #555; font-size: 0.85rem; line-height: 1.5;">
                            <i class="fa-solid ${policyInfo.icon}" style="margin-right: 4px;"></i>${policyInfo.label}
                        </p>
                    </div>
                </div>
            `;
        } else if (policyBanner) {
            policyBanner.style.display = 'none';
        }

        document.getElementById('apply-modal').classList.remove('hidden');
    };

    window.closeApplyModal = function () {
        document.getElementById('apply-modal').classList.add('hidden');
        document.getElementById('apply-form').reset();
        clearApplyAttachment();
    };

    window.clearApplyAttachment = function () {
        const fileInput = document.getElementById('apply-attachment');
        if (fileInput) fileInput.value = '';
        const preview = document.getElementById('apply-attachment-preview');
        if (preview) preview.style.display = 'none';
        const filenameEl = document.getElementById('apply-attachment-filename');
        if (filenameEl) filenameEl.textContent = '';
        const errorEl = document.getElementById('apply-attachment-error');
        if (errorEl) {
            errorEl.style.display = 'none';
            errorEl.textContent = '';
        }
    };

    const applyAttachmentInput = document.getElementById('apply-attachment');
    if (applyAttachmentInput) {
        applyAttachmentInput.addEventListener('change', function () {
            const preview = document.getElementById('apply-attachment-preview');
            const filenameEl = document.getElementById('apply-attachment-filename');
            const errorEl = document.getElementById('apply-attachment-error');
            if (!preview || !filenameEl || !errorEl) return;

            errorEl.style.display = 'none';
            errorEl.textContent = '';

            if (this.files && this.files[0]) {
                const file = this.files[0];
                const maxMb = 5;
                if (file.size > maxMb * 1024 * 1024) {
                    errorEl.textContent = 'File too large. Max ' + maxMb + 'MB.';
                    errorEl.style.display = 'flex';
                    this.value = '';
                    preview.style.display = 'none';
                    filenameEl.textContent = '';
                } else {
                    filenameEl.textContent = '\u2713 ' + file.name;
                    preview.style.display = 'flex';
                }
            } else {
                preview.style.display = 'none';
                filenameEl.textContent = '';
            }
        });
    }

    const applyForm = document.getElementById('apply-form');
    if (applyForm) {
        applyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const eventId = document.getElementById('apply-event-id').value;
            const service = document.getElementById('apply-service-type').value;
            const message = document.getElementById('apply-message').value;
            const fileInput = document.getElementById('apply-attachment');
            const file = fileInput && fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;

            const sendApplication = function (attachmentPayload) {
                let incomingRequests = JSON.parse(localStorage.getItem('eventia_incoming_requests')) || [];
                const newRequest = {
                    id: 'ir' + Date.now(),
                    vendorName: document.getElementById('vendor-name-display').textContent,
                    vendorEmail: 'contact@vendor.com',
                    serviceType: service,
                    eventId: eventId,
                    status: 'Pending',
                    dateReceived: new Date().toISOString().split('T')[0],
                    message: message
                };
                if (attachmentPayload) {
                    newRequest.attachmentFileName = attachmentPayload.name;
                    newRequest.attachmentData = attachmentPayload.data;
                    newRequest.attachmentMimeType = attachmentPayload.mimeType || 'application/octet-stream';
                }
                incomingRequests.push(newRequest);
                localStorage.setItem('eventia_incoming_requests', JSON.stringify(incomingRequests));
                showToast('Application Sent Successfully!');
                closeApplyModal();
                renderBrowseEvents();
            };

            if (file) {
                const maxMb = 5;
                if (file.size > maxMb * 1024 * 1024) {
                    showToast('Attachment must be under ' + maxMb + 'MB.');
                    return;
                }
                const reader = new FileReader();
                reader.onload = function () {
                    const dataUrl = reader.result;
                    const base64 = dataUrl.indexOf(',') >= 0 ? dataUrl.split(',')[1] : dataUrl;
                    sendApplication({
                        name: file.name,
                        data: base64,
                        mimeType: file.type || 'application/octet-stream'
                    });
                };
                reader.readAsDataURL(file);
            } else {
                sendApplication(null);
            }
        });
    }

    // Tab switching for Invitations view (My Applications / Invitations)
    const requestTabs = document.querySelectorAll('.request-tab');
    requestTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            requestTabs.forEach(t => {
                t.classList.remove('active');
                t.style.border = '2px solid #e0e0e0';
                t.style.background = 'white';
                t.style.boxShadow = 'none';
                const iconContainer = t.querySelector('div:first-child');
                if (iconContainer) {
                    iconContainer.style.background = 'linear-gradient(135deg, #f0f4f8, #e3e8ed)';
                    const icon = iconContainer.querySelector('i');
                    if (icon) icon.style.color = '#1565c0';
                }
                const textContainer = t.querySelector('div:nth-child(2)');
                if (textContainer) {
                    const title = textContainer.querySelector('div:first-child');
                    const subtitle = textContainer.querySelector('div:last-child');
                    if (title) title.style.color = '#333';
                    if (subtitle) subtitle.style.color = '#666';
                }
            });

            tab.classList.add('active');
            tab.style.border = 'none';
            tab.style.background = 'linear-gradient(135deg, #1565c0, #0d47a1)';
            tab.style.boxShadow = '0 4px 15px rgba(21, 101, 192, 0.3)';
            const activeIconContainer = tab.querySelector('div:first-child');
            if (activeIconContainer) {
                activeIconContainer.style.background = 'rgba(255,255,255,0.2)';
                const activeIcon = activeIconContainer.querySelector('i');
                if (activeIcon) activeIcon.style.color = 'white';
            }
            const activeTextContainer = tab.querySelector('div:nth-child(2)');
            if (activeTextContainer) {
                const title = activeTextContainer.querySelector('div:first-child');
                const subtitle = activeTextContainer.querySelector('div:last-child');
                if (title) title.style.color = 'white';
                if (subtitle) subtitle.style.color = 'rgba(255,255,255,0.8)';
            }

            const applicationsSection = document.getElementById('my-applications-section');
            const invitationsSection = document.getElementById('invitations-section');

            if (tab.dataset.tab === 'applications') {
                if (applicationsSection) applicationsSection.style.display = 'block';
                if (invitationsSection) invitationsSection.style.display = 'none';
                renderMyApplications();
            } else {
                if (applicationsSection) applicationsSection.style.display = 'none';
                if (invitationsSection) invitationsSection.style.display = 'block';
                renderInvitations();
            }
        });
    });

    // Filter Listeners
    const inviteFilter = document.getElementById('invite-filter');
    if (inviteFilter) inviteFilter.addEventListener('change', renderInvitations);

    const applicationsFilter = document.getElementById('applications-status-filter');
    if (applicationsFilter) applicationsFilter.addEventListener('change', renderMyApplications);

    // Listeners for My Events search
    const myEventsSearch = document.getElementById('my-events-search');
    if (myEventsSearch) myEventsSearch.addEventListener('input', renderMyEvents);

    // Listeners for Browse Events
    const browseSearch = document.getElementById('browse-events-search');
    if (browseSearch) browseSearch.addEventListener('input', renderBrowseEvents);

    const browseFilter = document.getElementById('browse-events-filter');
    if (browseFilter) browseFilter.addEventListener('change', renderBrowseEvents);

    // Browse Events category pills (same pattern as organizer)
    const browsePills = document.querySelectorAll('.browse-category-pill');
    browsePills.forEach(pill => {
        pill.addEventListener('click', () => {
            browsePills.forEach(p => {
                p.classList.remove('active');
                p.style.background = 'white';
                p.style.color = '#333';
                p.style.border = '1px solid #e0e0e0';
            });
            pill.classList.add('active');
            pill.style.background = '#004e92';
            pill.style.color = 'white';
            pill.style.border = 'none';

            const category = pill.dataset.category || 'all';
            if (browseFilter) browseFilter.value = category;
            renderBrowseEvents();
        });
    });

    // View All Event Categories Modal
    const showAllEventCategoriesBtn = document.getElementById('show-all-event-categories');
    if (showAllEventCategoriesBtn) {
        showAllEventCategoriesBtn.addEventListener('click', () => {
            showAllEventCategoriesModal();
        });
    }

    function showAllEventCategoriesModal() {
        // Remove existing modal
        const existing = document.getElementById('event-categories-modal');
        if (existing) existing.remove();

        const categories = [
            { group: 'Technology & Innovation', items: ['Tech', 'Innovation', 'Startup'] },
            { group: 'Arts & Culture', items: ['Art', 'Culture', 'Fashion', 'Design'] },
            { group: 'Business & Professional', items: ['Business', 'Conference', 'Networking', 'Trade Show'] },
            { group: 'Entertainment', items: ['Music', 'Entertainment', 'Concert', 'Festival', 'Theater'] },
            { group: 'Education & Learning', items: ['Education', 'Workshop', 'Training', 'Seminar'] },
            { group: 'Sports & Fitness', items: ['Sports', 'Marathon', 'Tournament', 'Fitness'] },
            { group: 'Food & Beverage', items: ['Food', 'Culinary', 'Wine Tasting', 'Food Festival'] },
            { group: 'Health & Wellness', items: ['Health', 'Wellness', 'Yoga', 'Meditation'] },
            { group: 'Community & Social', items: ['Charity', 'Fundraising', 'Community', 'Social'] },
            { group: 'Other', items: ['Other', 'Expo', 'Fair', 'Celebration'] }
        ];

        let categoriesHTML = '';
        categories.forEach(cat => {
            categoriesHTML += `
                < div style = "margin-bottom: 1rem;" >
                    <div style="font-weight: 600; color: #333; margin-bottom: 0.5rem; font-size: 0.9rem;">${cat.group}</div>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                        ${cat.items.map(item => `
                            <button class="modal-category-btn" data-category="${item}" 
                                style="padding: 6px 14px; border: 1px solid #e0e0e0; border-radius: 16px; background: white; cursor: pointer; font-size: 0.8rem; transition: all 0.2s ease;">
                                ${item}
                            </button>
                        `).join('')}
                    </div>
                </div >
                `;
        });

        const modal = document.createElement('div');
        modal.id = 'event-categories-modal';
        modal.innerHTML = `
                < div style = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(4px);" onclick = "if(event.target === this) this.parentElement.remove()" >
                    <div style="background: white; border-radius: 16px; width: 90%; max-width: 700px; max-height: 80vh; overflow: hidden; box-shadow: 0 25px 50px rgba(0,0,0,0.25);">
                        <div style="background: linear-gradient(135deg, #004e92, #4dabf7); color: white; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center;">
                            <h3 style="margin: 0; font-size: 1.1rem;">
                                <i class="fa-solid fa-grid-2" style="margin-right: 0.5rem;"></i>All Event Categories
                            </h3>
                            <button onclick="document.getElementById('event-categories-modal').remove()" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer;">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div style="padding: 1.5rem; overflow-y: auto; max-height: 60vh;">
                            ${categoriesHTML}
                        </div>
                    </div>
            </div >
                `;
        document.body.appendChild(modal);

        // Add click handlers to modal category buttons
        modal.querySelectorAll('.modal-category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                // Update hidden select
                if (browseFilter) browseFilter.value = category;

                // Update pills active state
                browsePills.forEach(p => {
                    p.classList.remove('active');
                    p.style.background = 'white';
                    p.style.color = '#333';
                    p.style.border = '1px solid #e0e0e0';
                });

                // Try to find matching pill
                const matchingPill = document.querySelector(`.browse - category - pill[data - category="${category}"]`);
                if (matchingPill) {
                    matchingPill.classList.add('active');
                    matchingPill.style.background = '#004e92';
                    matchingPill.style.color = 'white';
                    matchingPill.style.border = 'none';
                } else {
                    // If no matching pill, activate "All" pill
                    const allPill = document.querySelector('.browse-category-pill[data-category="all"]');
                    if (allPill) {
                        allPill.classList.add('active');
                        allPill.style.background = '#004e92';
                        allPill.style.color = 'white';
                        allPill.style.border = 'none';
                    }
                }

                modal.remove();
                renderBrowseEvents();
            });

            // Hover effect
            btn.addEventListener('mouseenter', () => {
                btn.style.background = '#004e92';
                btn.style.color = 'white';
                btn.style.border = '1px solid #004e92';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.background = 'white';
                btn.style.color = '#333';
                btn.style.border = '1px solid #e0e0e0';
            });
        });
    }

    // Initial Render
    renderUpcomingEvents();
    renderMyApplications();
    renderInvitations();
    renderMyEvents();
    updateStats();

    // ===================================================================
    // VENDOR EVENT MANAGEMENT MODULE
    // ===================================================================
    const MESSAGES_KEY = 'eventia_messages';
    const EVENT_VENDORS_KEY = 'eventia_event_vendors';
    let currentManagedEventId = null;
    let currentManagedRequestId = null;

    function getMessages() {
        return JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');
    }
    function getEventVendors() {
        return JSON.parse(localStorage.getItem(EVENT_VENDORS_KEY) || '[]');
    }

    // --- Preparation Status Config ---
    const PREP_STATUSES = ['Pending', 'Preparing', 'In Transit', 'Setting Up', 'Ready'];
    const PREP_ICONS = {
        'Pending': 'fa-clock',
        'Preparing': 'fa-wrench',
        'In Transit': 'fa-truck',
        'Setting Up': 'fa-tools',
        'Ready': 'fa-check'
    };
    const PREP_COLORS = {
        'Pending': '#e65100',
        'Preparing': '#1565c0',
        'In Transit': '#7b1fa2',
        'Setting Up': '#ff8f00',
        'Ready': '#2e7d32'
    };

    // --- Render Vendor Preparation Card (timeline stepper + update button) ---
    function renderVendorPreparationCard(eventId) {
        const container = document.getElementById('vem-preparation-card');
        if (!container) return;

        const evVendors = getEventVendors();
        const ev = evVendors.find(v => v.eventId === eventId && v.vendorId === CURRENT_VENDOR_ID);
        if (!ev || ev.status !== 'Confirmed') {
            container.innerHTML = '';
            return;
        }

        const prepStatus = ev.preparationStatus || 'Pending';
        const currentIdx = PREP_STATUSES.indexOf(prepStatus);
        const isReady = prepStatus === 'Ready';

        // Build horizontal timeline
        const steps = PREP_STATUSES.map((s, i) => {
            let stepClass = 'upcoming';
            if (i < currentIdx) stepClass = 'completed';
            else if (i === currentIdx) stepClass = (i === PREP_STATUSES.length - 1) ? 'completed' : 'active';
            const icon = PREP_ICONS[s];
            return `<div class="em-timeline-step ${stepClass}">
                <div class="em-timeline-circle"><i class="fa-solid ${icon}"></i></div>
                <span class="em-timeline-label">${s}</span>
            </div>`;
        }).join('');

        // Connectors
        let connectors = '';
        for (let i = 0; i < PREP_STATUSES.length - 1; i++) {
            let connClass = 'upcoming';
            if (i < currentIdx) connClass = 'completed';
            else if (i === currentIdx) connClass = 'active';
            const stepW = 100 / PREP_STATUSES.length;
            const left = (stepW * i + stepW / 2);
            connectors += `<div class="em-timeline-connector ${connClass}" style="left:${left}%;width:${stepW}%;"></div>`;
        }

        container.innerHTML = `
            <div class="em-detail-card em-card-blue" style="border-left-color: ${PREP_COLORS[prepStatus]};">
                <div class="em-detail-card-header">
                    <i class="fa-solid fa-timeline"></i> Your Preparation Status
                    <div style="margin-left: auto; display: flex; gap: 0.5rem;">
                        ${isReady
                ? `<span style="font-size: 0.78rem; font-weight: 600; color: #2e7d32; background: rgba(46,125,50,0.1); padding: 4px 12px; border-radius: 12px;"><i class="fa-solid fa-check-circle"></i> Ready</span>`
                : `<button class="vem-update-status-btn" onclick="openVendorStatusUpdateModal()"><i class="fa-solid fa-arrow-up-right-dots"></i> Update Status</button>`
            }
                    </div>
                </div>
                <div class="em-detail-card-body">
                    <div class="em-vendor-timeline" style="position: relative; padding: 0.5rem 0;">
                        ${connectors}
                        ${steps}
                    </div>
                </div>
            </div>`;
    }

    // --- Render Update Request Banner ---
    function renderUpdateRequestBanner(eventId) {
        const container = document.getElementById('vem-update-banner-container');
        if (!container) return;

        const evVendors = getEventVendors();
        const ev = evVendors.find(v => v.eventId === eventId && v.vendorId === CURRENT_VENDOR_ID);

        if (ev && ev.updateRequested) {
            container.innerHTML = `
                <div class="vem-update-banner">
                    <div class="vem-update-banner-icon"><i class="fa-solid fa-bell"></i></div>
                    <div class="vem-update-banner-text">
                        <strong>Status update requested!</strong><br>
                        The event organizer would like you to update your preparation progress.
                    </div>
                    <button class="vem-update-banner-btn" onclick="openVendorStatusUpdateModal()">
                        <i class="fa-solid fa-arrow-up-right-dots"></i> Update Now
                    </button>
                </div>`;
        } else {
            container.innerHTML = '';
        }
    }

    // --- Vendor Status Update Modal ---
    window.openVendorStatusUpdateModal = function () {
        const evVendors = getEventVendors();
        const ev = evVendors.find(v => v.eventId === currentManagedEventId && v.vendorId === CURRENT_VENDOR_ID);
        if (!ev) return;

        const prepStatus = ev.preparationStatus || 'Pending';
        const currentIdx = PREP_STATUSES.indexOf(prepStatus);
        const nextStatus = currentIdx < PREP_STATUSES.length - 1 ? PREP_STATUSES[currentIdx + 1] : null;

        if (!nextStatus) {
            showToast('You are already at the final status: Ready!');
            return;
        }

        // Populate modal
        const displayEl = document.getElementById('vem-status-current-display');
        displayEl.innerHTML = `
            <div class="vem-status-current-dot" style="background: ${PREP_COLORS[prepStatus]};"></div>
            <div class="vem-status-current-label">${prepStatus}</div>
            <div style="color: #bbb; font-size: 1rem;"><i class="fa-solid fa-arrow-right"></i></div>
            <div class="vem-status-current-dot" style="background: ${PREP_COLORS[nextStatus]};"></div>
            <div class="vem-status-current-label" style="color: ${PREP_COLORS[nextStatus]};">${nextStatus}</div>
        `;

        // Clear note textarea
        document.getElementById('vem-status-note').value = '';

        // Update submit button text
        const submitBtn = document.getElementById('vem-submit-status-btn');
        submitBtn.innerHTML = `<i class="fa-solid fa-arrow-right"></i> Advance to "${nextStatus}"`;

        const modal = document.getElementById('vem-status-update-modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
    };

    window.closeVendorStatusUpdateModal = function () {
        const modal = document.getElementById('vem-status-update-modal');
        modal.classList.add('hidden');
        setTimeout(() => { modal.style.display = 'none'; }, 300);
    };

    window.submitVendorStatusUpdate = function () {
        const note = document.getElementById('vem-status-note').value.trim();
        if (!note) {
            showToast('Please provide a progress note.');
            return;
        }

        const evVendors = getEventVendors();
        const idx = evVendors.findIndex(v => v.eventId === currentManagedEventId && v.vendorId === CURRENT_VENDOR_ID);
        if (idx === -1) return;

        const ev = evVendors[idx];
        const currentIdx = PREP_STATUSES.indexOf(ev.preparationStatus || 'Pending');
        const nextStatus = currentIdx < PREP_STATUSES.length - 1 ? PREP_STATUSES[currentIdx + 1] : null;
        if (!nextStatus) return;

        // Update status
        ev.preparationStatus = nextStatus;
        if (!ev.statusHistory) ev.statusHistory = [];
        ev.statusHistory.push({
            status: nextStatus,
            note: note,
            timestamp: new Date().toISOString(),
            source: 'vendor'
        });

        // Clear update request
        ev.updateRequested = false;

        localStorage.setItem(EVENT_VENDORS_KEY, JSON.stringify(evVendors));

        closeVendorStatusUpdateModal();
        renderVendorPreparationCard(currentManagedEventId);
        renderUpdateRequestBanner(currentManagedEventId);
        showToast(`Status updated to "${nextStatus}"!`);
    };

    // Backdrop close for status update modal
    const vemStatusModal = document.getElementById('vem-status-update-modal');
    if (vemStatusModal) {
        vemStatusModal.addEventListener('click', (e) => {
            if (e.target === vemStatusModal) closeVendorStatusUpdateModal();
        });
    }

    // --- Open Vendor Event Management ---
    window.openVendorEventManage = function (eventId, requestId) {
        const evt = events.find(e => e.id === eventId);
        if (!evt) return;

        const req = requests.find(r => r.id === requestId);
        currentManagedEventId = eventId;
        currentManagedRequestId = requestId;

        // Header
        document.getElementById('vem-event-title').textContent = evt.title;

        // State badge
        const todayStr = new Date().toISOString().split('T')[0];
        let stateTxt, stateColor, stateBg;
        if (evt.date === todayStr) { stateTxt = 'Ongoing'; stateColor = '#2e7d32'; stateBg = 'rgba(46,125,50,0.2)'; }
        else if (evt.date > todayStr) { stateTxt = 'Upcoming'; stateColor = '#7b1fa2'; stateBg = 'rgba(123,31,162,0.2)'; }
        else { stateTxt = 'Past'; stateColor = '#757575'; stateBg = 'rgba(117,117,117,0.2)'; }
        const stateBadge = document.getElementById('vem-event-state-badge');
        stateBadge.textContent = stateTxt;
        stateBadge.style.background = stateBg;
        stateBadge.style.color = stateColor;

        // Role badge — show service type from the request
        const roleBadge = document.getElementById('vem-role-badge');
        if (req && req.serviceType) {
            roleBadge.textContent = req.serviceType;
        } else {
            roleBadge.textContent = 'Vendor';
        }

        // Stats
        document.getElementById('vem-stat-organizer').textContent = evt.organizer || 'Event Organizer';
        document.getElementById('vem-stat-service').textContent = (req && req.serviceType) || currentVendor.category || '—';
        document.getElementById('vem-stat-attendees').textContent = evt.attendees || 0;

        // Countdown
        const diffMs = new Date(evt.date) - new Date(todayStr);
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        const countdownEl = document.getElementById('vem-stat-countdown');
        if (diffDays > 0) countdownEl.textContent = diffDays;
        else if (diffDays === 0) countdownEl.textContent = 'Today';
        else countdownEl.textContent = 'Ended';

        // --- Overview tab data ---
        document.getElementById('vem-ov-title').textContent = evt.title;
        document.getElementById('vem-ov-category').textContent = evt.category;
        document.getElementById('vem-ov-description').textContent = evt.description;
        const dateFormatted = new Date(evt.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        document.getElementById('vem-ov-date').textContent = dateFormatted;
        document.getElementById('vem-ov-time').textContent = evt.time;
        document.getElementById('vem-ov-location').textContent = evt.location;

        // Tickets
        const ticketsEl = document.getElementById('vem-ov-tickets');
        if (evt.tickets && evt.tickets.length > 0) {
            ticketsEl.innerHTML = '<div style="display:flex;flex-wrap:wrap;gap:0.5rem;">' +
                evt.tickets.map(t => `<div class="em-ticket-tier"><span class="tier-name">${t.name}</span><span class="tier-price">${t.price > 0 ? t.price + ' SAR' : 'Free'}</span></div>`).join('') + '</div>';
        } else {
            ticketsEl.innerHTML = '<p style="color:#888;margin:0;">No ticket tiers defined.</p>';
        }

        // Withdrawal Policy
        const policyMeta = {
            'flexible': { label: '✦ Flexible', css: 'em-policy-flexible', desc: 'Withdrawal allowed up to 7 days before the event.' },
            'moderate': { label: '✦ Moderate', css: 'em-policy-moderate', desc: 'Withdrawal allowed up to 14 days before the event.' },
            'strict': { label: '✦ Strict', css: 'em-policy-strict', desc: 'Withdrawal allowed up to 30 days before the event.' },
            'non-refundable': { label: '✦ Non-refundable', css: 'em-policy-non-refundable', desc: 'No withdrawal or cancellations permitted once confirmed.' }
        };
        const vendorBadgeEl = document.getElementById('vem-ov-vendor-policy-badge');
        const vendorDescEl = document.getElementById('vem-ov-vendor-policy-desc');
        const vendorPol = evt.withdrawalPolicy ? policyMeta[evt.withdrawalPolicy] : null;
        vendorBadgeEl.className = 'em-policy-badge ' + (vendorPol ? vendorPol.css : 'em-policy-none');
        vendorBadgeEl.textContent = vendorPol ? vendorPol.label : '— Not Set';
        vendorDescEl.textContent = vendorPol ? vendorPol.desc : 'No vendor withdrawal policy has been configured for this event.';

        // --- Communication tab ---
        renderVendorOrgConversation(eventId);
        renderVendorPreparationCard(eventId);
        renderUpdateRequestBanner(eventId);

        // --- Actions tab: Withdraw button ---
        const isPast = new Date(evt.date) < new Date();
        const withdrawBtn = document.getElementById('vem-withdraw-btn');
        if (isPast) {
            withdrawBtn.disabled = true;
            withdrawBtn.style.opacity = '0.5';
            withdrawBtn.style.cursor = 'not-allowed';
            withdrawBtn.textContent = 'Event Ended';
        } else {
            withdrawBtn.disabled = false;
            withdrawBtn.style.opacity = '1';
            withdrawBtn.style.cursor = 'pointer';
            withdrawBtn.innerHTML = '<i class="fa-solid fa-xmark"></i> Withdraw';
            withdrawBtn.onclick = function () { openWithdrawModal(requestId); };
        }

        // Reset to Overview tab
        document.querySelectorAll('[data-vemtab]').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('[id^="vem-tab-"]').forEach(tc => {
            if (tc.classList.contains('em-tab-content')) tc.classList.remove('active');
        });
        const overviewTab = document.querySelector('[data-vemtab="overview"]');
        if (overviewTab) overviewTab.classList.add('active');
        const overviewContent = document.getElementById('vem-tab-overview');
        if (overviewContent) overviewContent.classList.add('active');

        switchView('event-manage');
    };

    // --- Tab switching for vendor event manage ---
    document.querySelectorAll('[data-vemtab]').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('[data-vemtab]').forEach(t => t.classList.remove('active'));
            document.getElementById('vem-tab-overview').classList.remove('active');
            document.getElementById('vem-tab-communication').classList.remove('active');
            document.getElementById('vem-tab-actions').classList.remove('active');
            tab.classList.add('active');
            document.getElementById('vem-tab-' + tab.dataset.vemtab).classList.add('active');
        });
    });

    // --- Render organizer conversation preview ---
    function renderVendorOrgConversation(eventId) {
        const allMessages = getMessages();
        const msgs = allMessages.filter(m => m.eventId === eventId && m.vendorId === CURRENT_VENDOR_ID)
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : null;

        const evt = events.find(e => e.id === eventId);
        const orgName = (evt && evt.organizer) || 'Event Organizer';

        // Update conversation card
        const convNameEl = document.getElementById('vem-org-conv-name');
        const convMsgEl = document.getElementById('vem-org-conv-last-msg');
        const convTimeEl = document.getElementById('vem-org-conv-time');
        const convCountEl = document.getElementById('vem-org-conv-count');

        if (convNameEl) convNameEl.textContent = orgName;
        if (lastMsg) {
            const lastMsgText = (lastMsg.sender === 'vendor' ? 'You: ' : '') + lastMsg.text;
            if (convMsgEl) convMsgEl.textContent = lastMsgText;
            if (convTimeEl) convTimeEl.textContent = new Date(lastMsg.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } else {
            if (convMsgEl) convMsgEl.textContent = 'No messages yet — tap to start the conversation';
            if (convTimeEl) convTimeEl.textContent = '';
        }

        // Show count of organizer messages
        const orgMsgCount = msgs.filter(m => m.sender === 'organizer').length;
        if (convCountEl) {
            if (orgMsgCount > 0) {
                convCountEl.textContent = orgMsgCount;
                convCountEl.style.display = 'flex';
            } else {
                convCountEl.style.display = 'none';
            }
        }

        // Click handler on conversation card
        const convItem = document.getElementById('vem-organizer-conv');
        if (convItem) {
            convItem.onclick = function () { openOrganizerChat(eventId); };
        }
    }

    // --- Organizer Chat ---
    window.openOrganizerChat = function (eventId) {
        currentManagedEventId = eventId;
        const evt = events.find(e => e.id === eventId);
        const orgName = (evt && evt.organizer) || 'Event Organizer';

        document.getElementById('vem-chat-org-name').textContent = orgName;
        document.getElementById('vem-chat-event-name').textContent = evt ? evt.title : 'Event';

        renderVendorChatMessages(eventId);

        const modal = document.getElementById('vem-chat-modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
    };

    window.closeOrganizerChat = function () {
        const modal = document.getElementById('vem-chat-modal');
        modal.classList.add('hidden');
        setTimeout(() => { modal.style.display = 'none'; }, 300);
        // Refresh conversation preview
        if (currentManagedEventId) renderVendorOrgConversation(currentManagedEventId);
    };

    function renderVendorChatMessages(eventId) {
        const msgs = getMessages().filter(m => m.eventId === eventId && m.vendorId === CURRENT_VENDOR_ID)
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        const body = document.getElementById('vem-chat-body');

        if (msgs.length === 0) {
            body.innerHTML = '<div class="em-empty-state" style="margin:auto;"><i class="fa-solid fa-comments"></i><p>No messages yet. Start the conversation!</p></div>';
        } else {
            body.innerHTML = msgs.map(m => {
                // vendor's own messages are "sent", organizer messages are "received"
                const cls = m.sender === 'vendor' ? 'sent' : 'received';
                const time = new Date(m.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                return `<div class="em-chat-msg ${cls}">${m.text}<span class="em-chat-msg-time">${time}</span></div>`;
            }).join('');
        }

        // Auto-scroll to bottom
        setTimeout(() => { body.scrollTop = body.scrollHeight; }, 50);
    }

    // Send chat message as vendor
    const vemChatSendBtn = document.getElementById('vem-chat-send-btn');
    const vemChatInput = document.getElementById('vem-chat-input');
    if (vemChatSendBtn && vemChatInput) {
        function sendVendorChatMessage() {
            const text = vemChatInput.value.trim();
            if (!text || !currentManagedEventId) return;

            const msgs = getMessages();
            msgs.push({
                id: 'msg_' + Date.now(),
                eventId: currentManagedEventId,
                vendorId: CURRENT_VENDOR_ID,
                sender: 'vendor',
                text: text,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem(MESSAGES_KEY, JSON.stringify(msgs));
            vemChatInput.value = '';
            renderVendorChatMessages(currentManagedEventId);
        }

        vemChatSendBtn.addEventListener('click', sendVendorChatMessage);
        vemChatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); sendVendorChatMessage(); }
        });
    }

    // Chat modal backdrop close
    const vemChatModal = document.getElementById('vem-chat-modal');
    if (vemChatModal) {
        vemChatModal.addEventListener('click', (e) => {
            if (e.target === vemChatModal) closeOrganizerChat();
        });
    }

    function showToast(msg) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = msg;
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.background = '#333';
        toast.style.color = 'white';
        toast.style.padding = '12px 24px';
        toast.style.borderRadius = '8px';
        toast.style.zIndex = '9999';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}
