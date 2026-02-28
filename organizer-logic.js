// ============================================================
// ORGANIZER DASHBOARD LOGIC
// All organizer-specific logic extracted from app.js
// for better file organisation.
// Loaded by organizer-dashboard.html only.
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    // --- DASHBOARD LOGIC ---
    if (document.body.classList.contains('dashboard-body')) {
        initDashboard();
    }

    function initDashboard() {
        // Elements
        const sidebarItems = document.querySelectorAll('.sidebar-nav .nav-item');
        const sections = document.querySelectorAll('.content-section');
        const pageTitle = document.getElementById('page-title');
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const sidebar = document.getElementById('sidebar');

        let currentEditingId = null; // State for Edit Mode

        // Toast Notification Helper
        function showToast(message) {
            // Remove existing toasts
            const existing = document.querySelectorAll('.toast-notification');
            existing.forEach(t => t.remove());

            // Create new toast
            const toast = document.createElement('div');
            toast.className = 'toast-notification';
            toast.innerHTML = `
                <div class="toast-icon"><i class="fa-solid fa-check"></i></div>
                <div class="toast-message">${message}</div>
            `;

            document.body.appendChild(toast);

            // Animate in
            setTimeout(() => {
                toast.classList.add('show');
            }, 10);

            // Remove after 3s
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    toast.remove();
                }, 400);
            }, 3000);
        }

        // Show full rejection reason in a modal popup
        window.showFullRejectionReason = function (encodedReason) {
            const reason = decodeURIComponent(encodedReason);

            // Remove existing modal if any
            const existing = document.getElementById('rejection-comment-modal');
            if (existing) existing.remove();

            // Create modal
            const modal = document.createElement('div');
            modal.id = 'rejection-comment-modal';
            modal.innerHTML = `
                <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 1000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(4px);">
                    <div style="background: white; padding: 2rem; border-radius: 16px; width: 90%; max-width: 500px; box-shadow: 0 25px 50px rgba(0,0,0,0.25);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                            <h3 style="margin: 0; color: #c62828;"><i class="fa-solid fa-circle-xmark" style="margin-right: 0.5rem;"></i> Rejection Reason</h3>
                            <button class="btn btn-sm btn-outline" onclick="document.getElementById('rejection-comment-modal').remove()">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div style="background: #ffebee; padding: 1rem; border-radius: 8px; font-size: 0.95rem; line-height: 1.6; color: #c62828; max-height: 300px; overflow-y: auto;">${reason}</div>
                        <button class="btn btn-primary" style="margin-top: 1.5rem; width: 100%;" onclick="document.getElementById('rejection-comment-modal').remove()">Close</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        // Sidebar Toggle (Mobile)
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }

        // View Switching Logic
        window.switchView = function (viewId) {
            // Update Sidebar Active State
            sidebarItems.forEach(item => {
                item.classList.remove('active');
                if (item.dataset.view === viewId) {
                    item.classList.add('active');
                }
            });

            // Show Target Section
            sections.forEach(sec => {
                sec.classList.remove('active');
                if (sec.id === `view-${viewId}`) {
                    sec.classList.add('active');
                }
            });

            // Update Header Title
            const titles = {
                'overview': 'Dashboard Overview',
                'create-event': 'Create New Event',
                'events-list': 'My Events',
                'vendors': 'Vendor Marketplace',
                'analytics': 'Event Analytics',
                'profile': 'My Profile'
            };
            if (pageTitle) pageTitle.textContent = titles[viewId] || 'Dashboard';

            // Close sidebar on mobile after selection
            if (window.innerWidth < 992) {
                sidebar.classList.remove('open');
            }

            // Refresh data if needed
            if (viewId === 'overview' || viewId === 'events-list') {
                renderEvents();
                updateStats();
            } else if (viewId === 'vendors') {
                renderVendors();
            }
        };

        // Attach Click Handlers to Sidebar
        sidebarItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.dataset.view;
                if (view) {
                    if (view === 'create-event') {
                        resetCreateForm();
                    }
                    switchView(view);
                }
            });
        });

        // Initialize Vendor Category Pills
        const categoryPills = document.querySelectorAll('.category-pill');
        categoryPills.forEach(pill => {
            pill.addEventListener('click', () => {
                // Update active state
                categoryPills.forEach(p => {
                    p.classList.remove('active');
                    p.style.background = 'white';
                    p.style.color = '#333';
                    p.style.border = '1px solid #e0e0e0';
                });
                pill.classList.add('active');
                pill.style.background = '#004e92';
                pill.style.color = 'white';
                pill.style.border = 'none';

                // Update hidden select and render
                const vendorFilterSelect = document.getElementById('vendor-category-select');
                if (vendorFilterSelect) {
                    vendorFilterSelect.value = pill.dataset.category;
                }
                renderVendors();
            });
        });

        // Initialize Vendor Filter Listener (hidden select for programmatic use)
        const vendorFilterSelect = document.getElementById('vendor-category-select');
        if (vendorFilterSelect) {
            vendorFilterSelect.addEventListener('change', () => {
                renderVendors();
            });
        }

        const vendorSearchInput = document.getElementById('vendor-search');
        if (vendorSearchInput) {
            vendorSearchInput.addEventListener('input', () => {
                renderVendors();
            });
        }

        // Location filter
        const vendorLocationFilter = document.getElementById('vendor-location-filter');
        if (vendorLocationFilter) {
            vendorLocationFilter.addEventListener('change', () => {
                renderVendors();
            });
        }

        // View All Categories Modal
        const showAllCategoriesBtn = document.getElementById('show-all-categories');
        if (showAllCategoriesBtn) {
            showAllCategoriesBtn.addEventListener('click', () => {
                showAllCategoriesModal();
            });
        }

        function showAllCategoriesModal() {
            // Remove existing modal
            const existing = document.getElementById('categories-modal');
            if (existing) existing.remove();

            const categories = [
                { group: 'Food & Beverages', items: ['Catering', 'Bakery & Desserts', 'Beverages', 'Food Trucks'] },
                { group: 'Venues', items: ['Venue', 'Conference Hall', 'Outdoor Venue'] },
                { group: 'AV & Technology', items: ['AV Equipment', 'LED Screens', 'Stage & Rigging', 'Live Streaming'] },
                { group: 'Decoration & Design', items: ['Decoration', 'Floral Design', 'Balloon Decor', 'Event Lighting'] },
                { group: 'Photography & Media', items: ['Photography', 'Aerial Photography', 'Photo Booth'] },
                { group: 'Entertainment', items: ['DJ Services', 'Live Entertainment', 'Kids Entertainment', 'Traditional Music', 'Fireworks & Pyro'] },
                { group: 'Transportation', items: ['Transportation', 'Shuttle Services', 'Valet Parking'] },
                { group: 'Security & Safety', items: ['Security', 'VIP Security', 'Medical Services'] },
                { group: 'Staffing & Services', items: ['Event Staff', 'Translation', 'MC & Hosting'] },
                { group: 'Rentals & Equipment', items: ['Tent Rentals', 'Furniture Rentals', 'Table/Chair Rentals', 'Power Supply'] },
                { group: 'Marketing & Promotion', items: ['Printing', 'Social Media Marketing', 'Influencer Marketing'] },
                { group: 'Government & Permits', items: ['Government Permits', 'Safety Permits'] },
                { group: 'Sponsors & Partners', items: ['Sponsors', 'Brand Partners'] },
                { group: 'Saudi Cultural', items: ['Henna Artists', 'Falconry Shows', 'Horse Shows', 'Arabian Perfumes', 'Arabic Calligraphy'] },
                { group: 'Specialized Services', items: ['VR/AR Experiences', 'Eco-Friendly Services', 'Gifts & Giveaways'] }
            ];

            let categoriesHTML = '';
            categories.forEach(cat => {
                categoriesHTML += `
                    <div style="margin-bottom: 1rem;">
                        <div style="font-weight: 600; color: #333; margin-bottom: 0.5rem; font-size: 0.9rem;">${cat.group}</div>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                            ${cat.items.map(item => `
                                <button class="modal-category-btn" data-category="${item}" 
                                    style="padding: 6px 14px; border: 1px solid #e0e0e0; border-radius: 16px; background: white; cursor: pointer; font-size: 0.8rem; transition: all 0.2s ease;">
                                    ${item}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                `;
            });

            const modal = document.createElement('div');
            modal.id = 'categories-modal';
            modal.innerHTML = `
                <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(4px);" onclick="if(event.target === this) this.parentElement.remove()">
                    <div style="background: white; border-radius: 16px; width: 90%; max-width: 700px; max-height: 80vh; overflow: hidden; box-shadow: 0 25px 50px rgba(0,0,0,0.25);">
                        <div style="background: linear-gradient(135deg, #004e92, #4dabf7); color: white; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center;">
                            <h3 style="margin: 0; font-size: 1.1rem;">
                                <i class="fa-solid fa-grid-2" style="margin-right: 0.5rem;"></i>All Categories
                            </h3>
                            <button onclick="document.getElementById('categories-modal').remove()" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer;">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div style="padding: 1.5rem; overflow-y: auto; max-height: 60vh;">
                            ${categoriesHTML}
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Add click handlers to modal category buttons
            modal.querySelectorAll('.modal-category-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const category = btn.dataset.category;
                    // Update hidden select
                    const vendorFilterSelect = document.getElementById('vendor-category-select');
                    if (vendorFilterSelect) vendorFilterSelect.value = category;

                    // Update pills active state
                    const pills = document.querySelectorAll('.category-pill');
                    pills.forEach(p => {
                        p.classList.remove('active');
                        p.style.background = 'white';
                        p.style.color = '#333';
                        p.style.border = '1px solid #e0e0e0';
                    });

                    // Try to find matching pill
                    const matchingPill = document.querySelector(`.category-pill[data-category="${category}"]`);
                    if (matchingPill) {
                        matchingPill.classList.add('active');
                        matchingPill.style.background = '#004e92';
                        matchingPill.style.color = 'white';
                        matchingPill.style.border = 'none';
                    }

                    modal.remove();
                    renderVendors();
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

        function resetCreateForm() {
            currentEditingId = null;
            if (createEventForm) {
                createEventForm.reset();
                const btn = createEventForm.querySelector('button[type="submit"]');
                if (btn) btn.textContent = 'Publish Event';

                // Reset Headings
                const formHeader = document.querySelector('#view-create-event .section-header h2');
                if (formHeader) formHeader.textContent = 'Create New Event';

                // Reset Ticket Categories to Default
                const container = document.getElementById('ticket-categories-container');
                if (container) {
                    container.innerHTML = `
                        <div class="ticket-row" style="display: flex; gap: 10px; margin-bottom: 10px;">
                            <input type="text" class="ticket-name" placeholder="Name (e.g. General)" value="Standard" required style="flex: 2;">
                            <input type="number" class="ticket-price" placeholder="Price (SAR)" min="0" required style="flex: 1;">
                            <input type="number" class="ticket-capacity" placeholder="Max Attendees" min="1" style="flex: 1;">
                            <button type="button" class="btn btn-sm btn-outline remove-ticket-btn" style="color: var(--danger-color); border-color: var(--danger-color);"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    `;
                }
            }
        }

        function openEditView(id) {
            const events = getEvents();
            const evt = events.find(e => e.id === id);
            if (!evt) return;

            currentEditingId = id;
            switchView('create-event');

            // Override Page Title
            if (pageTitle) pageTitle.textContent = 'Edit Event';

            // Override Form Header
            const formHeader = document.querySelector('#view-create-event .section-header h2');
            if (formHeader) formHeader.textContent = 'Edit Event';


            // Populate Form
            document.getElementById('event-title').value = evt.title;
            document.getElementById('event-category').value = evt.category;
            document.getElementById('event-date').value = evt.date;
            document.getElementById('event-time').value = evt.time;
            document.getElementById('event-location').value = evt.location;
            document.getElementById('event-description').value = evt.description;
            // Also repopulate withdrawal policies
            const vendorPolicyEl = document.getElementById('event-withdrawal-policy');
            if (vendorPolicyEl && evt.withdrawalPolicy) vendorPolicyEl.value = evt.withdrawalPolicy;
            const attendeePolicyEl = document.getElementById('event-attendee-withdrawal-policy');
            if (attendeePolicyEl && evt.attendeeWithdrawalPolicy) attendeePolicyEl.value = evt.attendeeWithdrawalPolicy;

            // Handle Tickets
            const container = document.getElementById('ticket-categories-container');
            container.innerHTML = ''; // Clear default

            let ticketsToLoad = evt.tickets || [];
            if (ticketsToLoad.length === 0 && evt.price !== undefined) {
                // Backward compatibility for old single-price events
                ticketsToLoad.push({ name: 'Standard', price: evt.price });
            }

            if (ticketsToLoad.length === 0) {
                // Fallback for completely empty (shouldn't happen but safe)
                ticketsToLoad.push({ name: 'General', price: '' });
            }

            ticketsToLoad.forEach(ticket => {
                const row = document.createElement('div');
                row.className = 'ticket-row';
                row.style.cssText = 'display: flex; gap: 10px; margin-bottom: 10px;';
                row.innerHTML = `
                    <input type="text" class="ticket-name" placeholder="Name (e.g. General)" value="${ticket.name}" required style="flex: 2;">
                    <input type="number" class="ticket-price" placeholder="Price (SR)" value="${ticket.price}" min="0" required style="flex: 1;">
                    <input type="number" class="ticket-capacity" placeholder="Max Attendees" value="${ticket.capacity || ''}" min="1" style="flex: 1;">
                    <button type="button" class="btn btn-sm btn-outline remove-ticket-btn" style="color: var(--danger-color); border-color: var(--danger-color);"><i class="fa-solid fa-trash"></i></button>
                `;
                container.appendChild(row);
            });

            // Update Button
            const btn = createEventForm.querySelector('button[type="submit"]');
            if (btn) btn.textContent = 'Update Event';
        }

        // --- CRUD Operations ---
        const EVENTS_DB_KEY = 'eventia_events_db';
        const VENDORS_DB_KEY = 'eventia_vendors_db';


        function getEvents() {
            const stored = localStorage.getItem(EVENTS_DB_KEY);
            return stored ? JSON.parse(stored) : [];
        }

        function getVendors() {
            const stored = localStorage.getItem(VENDORS_DB_KEY);
            return stored ? JSON.parse(stored) : [];
        }

        // Logic to setup Ticket UI handlers
        function setupTicketHandlers() {
            const container = document.getElementById('ticket-categories-container');
            const addBtn = document.getElementById('add-ticket-btn');

            if (addBtn && container) {
                // Check if listener already attached to avoid duplicates? 
                // A simple way is to clone and replace or just use a flag. 
                // Since initDashboard runs once, we are safe.

                addBtn.addEventListener('click', () => {
                    const row = document.createElement('div');
                    row.className = 'ticket-row';
                    row.style.cssText = 'display: flex; gap: 10px; margin-bottom: 10px;';
                    row.innerHTML = `
                        <input type="text" class="ticket-name" placeholder="Name (e.g. General)" required style="flex: 2;">
                        <input type="number" class="ticket-price" placeholder="Price (SR)" min="0" required style="flex: 1;">
                        <input type="number" class="ticket-capacity" placeholder="Max Attendees" min="1" style="flex: 1;">
                        <button type="button" class="btn btn-sm btn-outline remove-ticket-btn" style="color: var(--danger-color); border-color: var(--danger-color);"><i class="fa-solid fa-trash"></i></button>
                    `;
                    container.appendChild(row);
                });

                container.addEventListener('click', (e) => {
                    if (e.target.closest('.remove-ticket-btn')) {
                        const row = e.target.closest('.ticket-row');
                        // Ensure at least one row remains
                        if (container.querySelectorAll('.ticket-row').length > 1) {
                            row.remove();
                        } else {
                            // Optionally clear values instead of removing
                            row.querySelector('.ticket-name').value = '';
                            row.querySelector('.ticket-price').value = '';
                            showToast('At least one ticket category is required.');
                        }
                    }
                });
            }
        }
        setupTicketHandlers(); // Call it



        function saveEvent(eventData) {
            const events = getEvents();
            if (currentEditingId) {
                // Update existing
                const index = events.findIndex(e => e.id === currentEditingId);
                if (index !== -1) {
                    events[index] = { ...events[index], ...eventData, id: currentEditingId }; // Keep ID
                }
            } else {
                // Create new
                events.push(eventData);
            }
            localStorage.setItem(EVENTS_DB_KEY, JSON.stringify(events));
        }

        function deleteEvent(eventId) {
            const events = getEvents();
            const updated = events.filter(e => e.id !== eventId);
            localStorage.setItem(EVENTS_DB_KEY, JSON.stringify(updated));
            renderEvents();
            updateStats();
        }

        function updateEventStatuses() {
            const events = getEvents();
            const now = new Date();
            const todayStr = now.toISOString().split('T')[0];
            let changed = false;

            const updatedEvents = events.map(evt => {
                // IMPORTANT: Preserve Pending and Rejected statuses
                // These are set by SCEGA and should NOT be overwritten by date logic
                if (evt.status === 'Pending' || evt.status === 'Rejected') {
                    return evt; // Keep as-is, don't change status
                }

                // Only update date-based status for approved events
                let newStatus = evt.status;

                if (evt.date === todayStr) {
                    newStatus = 'Ongoing';
                } else if (evt.date > todayStr) {
                    newStatus = 'Upcoming';
                } else {
                    newStatus = 'Past';
                }

                if (newStatus !== evt.status) {
                    changed = true;
                    return { ...evt, status: newStatus };
                }
                return evt;
            });

            if (changed) {
                localStorage.setItem(EVENTS_DB_KEY, JSON.stringify(updatedEvents));
            }
        }

        // Form Handling
        const createEventForm = document.getElementById('create-event-form');
        if (createEventForm) {
            createEventForm.addEventListener('submit', (e) => {
                e.preventDefault();


                // Collect Tickets
                const ticketRows = document.querySelectorAll('.ticket-row');
                const tickets = [];
                ticketRows.forEach(row => {
                    const name = row.querySelector('.ticket-name').value;
                    const price = row.querySelector('.ticket-price').value;
                    const capacity = row.querySelector('.ticket-capacity').value; // Get Capacity
                    if (name && price !== '') {
                        tickets.push({ name, price, capacity }); // Store Capacity
                    }
                });

                // Calculate display price (min price)
                const prices = tickets.map(t => parseFloat(t.price));
                const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

                const newEvent = {
                    id: Date.now().toString(), // Will be ignored if editing
                    title: document.getElementById('event-title').value,
                    category: document.getElementById('event-category').value,
                    date: document.getElementById('event-date').value,
                    time: document.getElementById('event-time').value,
                    location: document.getElementById('event-location').value,
                    description: document.getElementById('event-description').value,
                    withdrawalPolicy: document.getElementById('event-withdrawal-policy').value,
                    attendeeWithdrawalPolicy: document.getElementById('event-attendee-withdrawal-policy').value,
                    price: minPrice, // For sorting/display logic compatibility
                    tickets: tickets, // New Structure
                    status: 'Pending', // Default status for new events
                    attendees: 0 // Should preserve if editing
                };

                // Preserve status/attendees if editing
                if (currentEditingId) {
                    const existing = getEvents().find(e => e.id === currentEditingId);
                    if (existing) {
                        // If editing a rejected event, maybe set back to Pending? For now keep status unless re-submitted logic.
                        // Let's reset to Pending if it was Rejected to allow re-approval
                        if (existing.status === 'Rejected') {
                            newEvent.status = 'Pending';
                            // Clear rejection reason
                            newEvent.rejectionReason = null;
                        } else {
                            newEvent.status = existing.status;
                        }
                        newEvent.attendees = existing.attendees;
                    }
                }

                saveEvent(newEvent);

                // Determine Message BEFORE resetting state
                const msg = currentEditingId
                    ? 'Event Updated Successfully!'
                    : 'Event Submitted for Approval! SCEGA will review your event shortly.';

                // Show Toast
                showToast(msg);

                // Reset state
                resetCreateForm();

                // Return to overview
                switchView('overview');
            });
        }

        // Render Functions
        function renderEvents() {
            // 1. Update Statuses first
            updateEventStatuses();

            const events = getEvents();

            // 2. Render in Overview (Recent Events) - ONLY APPROVED EVENTS (Ongoing/Upcoming, no Past)
            const recentContainer = document.getElementById('recent-events-list');
            if (recentContainer) {
                // Dashboard only shows approved events that are ongoing or upcoming (not Past)
                const todayStr = new Date().toISOString().split('T')[0];
                const activeEvents = events.filter(e =>
                    (e.status === 'Upcoming' || e.status === 'Ongoing') ||
                    (e.status !== 'Pending' && e.status !== 'Rejected' && e.date >= todayStr)
                );

                if (activeEvents.length === 0) {
                    recentContainer.innerHTML = '<p class="text-muted" style="text-align: center; padding: 2rem;">No upcoming or ongoing events. Create an event and wait for SCEGA approval.</p>';
                } else {
                    // Sort by Date and show only 3
                    const sorted = activeEvents.sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 3);
                    recentContainer.innerHTML = sorted.map(evt => createDashboardEventItem(evt)).join('');
                }
            }

            // 3. Render in All Events List - WITH FILTER INPUT
            const allContainer = document.getElementById('all-events-container');
            const filterSelect = document.getElementById('event-filter-select');
            const filterValue = filterSelect ? filterSelect.value : 'all';

            if (allContainer) {
                let displayedEvents = events;

                if (filterValue !== 'all') {
                    displayedEvents = events.filter(e => e.status === filterValue);
                }

                if (filterValue !== 'all') {
                    displayedEvents = events.filter(e => e.status === filterValue);
                }

                if (displayedEvents.length === 0) {
                    allContainer.innerHTML = `
                        <div style="text-align: center; padding: 4rem;">
                            <i class="fa-regular fa-calendar-xmark" style="font-size: 3rem; color: #ddd; margin-bottom: 1rem;"></i>
                            <p class="text-muted">No ${filterValue !== 'all' ? filterValue.toLowerCase() : ''} events found.</p>
                        </div>`;
                } else {
                    // Sort by event state: Ongoing first, then Upcoming, then Past
                    // Within each group, sort by date
                    const todayStr = new Date().toISOString().split('T')[0];

                    const getEventPriority = (evt) => {
                        if (evt.date === todayStr) return 0; // Ongoing
                        if (evt.date > todayStr) return 1;   // Upcoming
                        return 2;                            // Past
                    };

                    const sorted = displayedEvents.slice().sort((a, b) => {
                        const priorityDiff = getEventPriority(a) - getEventPriority(b);
                        if (priorityDiff !== 0) return priorityDiff;
                        // Within same priority, sort by date (nearest first for Ongoing/Upcoming, latest first for Past)
                        if (getEventPriority(a) === 2) {
                            return new Date(b.date) - new Date(a.date); // Past: latest first
                        }
                        return new Date(a.date) - new Date(b.date); // Others: earliest first
                    });

                    allContainer.innerHTML = sorted.map(evt => createEventListItem(evt)).join('');
                }
            }

            // Attach listeners (Delete/Edit) - Logic remains same
            attachActionListeners();
        }

        function renderVendors() {
            const vendors = getVendors();
            const grid = document.getElementById('vendors-grid');
            const filterSelect = document.getElementById('vendor-category-select');
            const searchInput = document.getElementById('vendor-search');
            const locationFilter = document.getElementById('vendor-location-filter');
            const resultsCount = document.getElementById('vendor-results-count');

            if (!grid) return;

            let filtered = vendors;

            // Category Filter
            if (filterSelect && filterSelect.value !== 'all') {
                const selectedCategory = filterSelect.value;
                // Also match parent categories (e.g., "Entertainment" matches "DJ Services", "Live Entertainment", etc.)
                const entertainmentCategories = ['DJ Services', 'Live Entertainment', 'Kids Entertainment', 'Traditional Music', 'Fireworks & Pyro'];
                const venueCategories = ['Venue', 'Conference Hall', 'Outdoor Venue'];

                if (selectedCategory === 'Entertainment') {
                    filtered = filtered.filter(v => entertainmentCategories.includes(v.category) || v.category === 'Entertainment');
                } else if (selectedCategory === 'Venue') {
                    filtered = filtered.filter(v => venueCategories.includes(v.category));
                } else {
                    filtered = filtered.filter(v => v.category === selectedCategory);
                }
            }

            // Location Filter
            if (locationFilter && locationFilter.value !== 'all') {
                filtered = filtered.filter(v => v.location === locationFilter.value || v.location === 'Any' || v.location === 'Global');
            }

            // Search Filter
            if (searchInput && searchInput.value.trim() !== '') {
                const term = searchInput.value.toLowerCase();
                filtered = filtered.filter(v =>
                    v.name.toLowerCase().includes(term) ||
                    v.description.toLowerCase().includes(term) ||
                    v.category.toLowerCase().includes(term) ||
                    v.location.toLowerCase().includes(term)
                );
            }

            // Update results count
            if (resultsCount) {
                const categoryLabel = filterSelect && filterSelect.value !== 'all' ? filterSelect.value : 'all categories';
                resultsCount.innerHTML = `<strong>${filtered.length}</strong> vendors found${filterSelect && filterSelect.value !== 'all' ? ` in ${categoryLabel}` : ''}`;
            }

            if (filtered.length === 0) {
                grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <i class="fa-solid fa-store-slash" style="font-size: 3rem; color: #ddd; margin-bottom: 1rem;"></i>
                    <p style="color: #888; margin: 0;">No vendors found matching your criteria.</p>
                    <button onclick="document.getElementById('vendor-search').value=''; document.getElementById('vendor-category-select').value='all'; document.querySelectorAll('.category-pill').forEach(p => { p.classList.remove('active'); p.style.background='white'; p.style.color='#333'; p.style.border='1px solid #e0e0e0'; }); document.querySelector('.category-pill[data-category=\\'all\\']').classList.add('active'); document.querySelector('.category-pill[data-category=\\'all\\']').style.background='#004e92'; document.querySelector('.category-pill[data-category=\\'all\\']').style.color='white'; renderVendors();" 
                        style="margin-top: 1rem; padding: 8px 16px; border: 1px solid #004e92; border-radius: 8px; background: white; color: #004e92; cursor: pointer; font-size: 0.85rem;">
                        Clear Filters
                    </button>
                </div>`;
                return;
            }

            grid.innerHTML = filtered.map(vendor => `
                <div class="vendor-card">
                    <div class="vendor-image">
                        <i class="fa-solid ${vendor.image || 'fa-store'}"></i>
                        <div class="vendor-rating">
                            <i class="fa-solid fa-star"></i> ${vendor.rating}
                        </div>
                    </div>
                    <div class="vendor-details">
                        <div class="vendor-category">${vendor.category}</div>
                        <h3>${vendor.name}</h3>
                        <div class="vendor-location">
                            <i class="fa-solid fa-location-dot"></i> ${vendor.location}
                        </div>
                        <p class="vendor-description">${vendor.description}</p>
                        
                        <div class="vendor-footer">
                            <span class="vendor-price">${vendor.priceRange}</span>
                            <button class="btn btn-sm btn-outline send-request-btn" data-id="${vendor.id}" data-name="${vendor.name}">Send Request</button>
                        </div>
                    </div>
                </div>
            `).join('');

            // Attach listeners to new buttons
            document.querySelectorAll('.send-request-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const vendorId = e.target.dataset.id;
                    const vendorName = e.target.dataset.name;
                    openRequestModal(vendorId, vendorName);
                });
            });
        }

        // Attach listeners for event list action buttons
        function attachActionListeners() {
            // Manage button is handled via event delegation in the all-events-container click listener
        }

        // Simplified event item for Dashboard Overview (no SCEGA status column)
        function createDashboardEventItem(evt) {
            const dateObj = new Date(evt.date);
            const month = dateObj.toLocaleString('default', { month: 'short' });
            const day = dateObj.getDate();

            // Price Display Logic
            let priceDisplay = 'Free';
            if (evt.price > 0) {
                priceDisplay = `${evt.price} SAR`;
                if (evt.tickets && evt.tickets.length > 1) {
                    priceDisplay = `From ${evt.price} SAR`;
                }
            }

            // Calculate Event State with consistent colors
            const todayStr = new Date().toISOString().split('T')[0];
            let stateColor, stateBg;
            if (evt.date === todayStr) {
                stateColor = '#2e7d32'; // Green for Ongoing
                stateBg = 'rgba(46, 125, 50, 0.15)';
            } else if (evt.date > todayStr) {
                stateColor = '#7b1fa2'; // Purple for Upcoming
                stateBg = 'rgba(123, 31, 162, 0.15)';
            } else {
                stateColor = '#757575'; // Grey for Past
                stateBg = 'rgba(117, 117, 117, 0.15)';
            }

            return `
                <div class="event-list-item" style="display: flex; align-items: center; gap: 1rem;">
                    <div class="event-date-box">
                        <span class="date-month">${month}</span>
                        <span class="date-day">${day}</span>
                    </div>
                    <div class="event-details-text" style="flex: 1;">
                        <h4 style="margin: 0 0 0.25rem 0;">${evt.title}</h4>
                        <div class="event-meta-info" style="display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.85rem; color: var(--text-muted);">
                            <span><i class="fa-regular fa-clock"></i> ${evt.time}</span>
                            <span><i class="fa-solid fa-location-dot"></i> ${evt.location}</span>
                            <span><i class="fa-solid fa-ticket"></i> ${priceDisplay}</span>
                            <span style="padding: 2px 8px; border-radius: 12px; background: ${stateBg}; color: ${stateColor}; font-weight: 500; font-size: 0.75rem;">${evt.status}</span>
                        </div>
                    </div>
                </div>
            `;
        }

        function createEventListItem(evt) {
            const dateObj = new Date(evt.date);
            const month = dateObj.toLocaleString('default', { month: 'short' });
            const day = dateObj.getDate();

            // Price Display Logic
            let priceDisplay = 'Free';
            if (evt.price > 0) {
                priceDisplay = `${evt.price} SAR`;
                if (evt.tickets && evt.tickets.length > 1) {
                    priceDisplay = `From ${evt.price} SAR`;
                }
            }

            // Calculate Event State (temporal) - based on date comparison
            const todayStr = new Date().toISOString().split('T')[0];
            let eventState, stateColor, stateBg;
            if (evt.date === todayStr) {
                eventState = 'Ongoing';
                stateColor = '#2e7d32'; // Green
                stateBg = 'rgba(46, 125, 50, 0.15)';
            } else if (evt.date > todayStr) {
                eventState = 'Upcoming';
                stateColor = '#7b1fa2';
                stateBg = 'rgba(123, 31, 162, 0.15)';
            } else {
                eventState = 'Past';
                stateColor = '#757575';
                stateBg = 'rgba(117, 117, 117, 0.15)';
            }
            const eventStateBadge = `<span style="font-size: 0.7rem; padding: 2px 8px; border-radius: 12px; background: ${stateBg}; color: ${stateColor}; font-weight: 500; margin-left: 8px;">${eventState}</span>`;

            // SCEGA Approval Status Column - Dedicated visual display
            let scegaStatusIcon, scegaStatusColor, scegaStatusBg, scegaStatusText;
            switch (evt.status) {
                case 'Pending':
                    scegaStatusIcon = 'fa-clock';
                    scegaStatusColor = '#ff9800';
                    scegaStatusBg = 'rgba(255, 152, 0, 0.1)';
                    scegaStatusText = 'Pending Review';
                    break;
                case 'Rejected':
                    scegaStatusIcon = 'fa-circle-xmark';
                    scegaStatusColor = '#c62828';
                    scegaStatusBg = 'rgba(198, 40, 40, 0.1)';
                    scegaStatusText = 'Rejected';
                    break;
                default: // Upcoming, Ongoing, Past = Approved
                    scegaStatusIcon = 'fa-circle-check';
                    scegaStatusColor = '#2e7d32';
                    scegaStatusBg = 'rgba(46, 125, 50, 0.1)';
                    scegaStatusText = 'Approved';
            }

            // Rejection info for rejected events
            let rejectionInfo = '';
            if (evt.status === 'Rejected' && evt.rejectionReason) {
                const maxLen = 40;
                if (evt.rejectionReason.length <= maxLen) {
                    rejectionInfo = `
                        <div style="font-size: 0.75rem; color: #c62828; margin-top: 0.25rem;">
                            <i class="fa-solid fa-comment"></i> ${evt.rejectionReason}
                        </div>
                    `;
                } else {
                    const truncated = evt.rejectionReason.substring(0, maxLen) + '...';
                    rejectionInfo = `
                        <div style="font-size: 0.75rem; color: #c62828; margin-top: 0.25rem;">
                            <i class="fa-solid fa-comment"></i> ${truncated}
                            <button class="btn btn-sm" style="padding: 1px 6px; font-size: 0.65rem; margin-left: 4px; background: #c62828; color: white; border: none; border-radius: 4px; cursor: pointer;" onclick="showFullRejectionReason('${encodeURIComponent(evt.rejectionReason)}')">
                                <i class="fa-solid fa-eye"></i> View
                            </button>
                        </div>
                    `;
                }
            }

            // Single Manage button — edit & delete accessed inside the manage view
            const actionButtons = `
                <button class="btn btn-sm btn-primary manage-btn" data-id="${evt.id}"><i class="fa-solid fa-sliders"></i> Manage</button>
            `;

            return `
                <div class="event-list-item" style="display: grid; grid-template-columns: 80px 1fr 140px 120px; align-items: center; gap: 1.5rem;">
                    <!-- Date Column -->
                    <div class="event-date-box">
                        <span class="date-month">${month}</span>
                        <span class="date-day">${day}</span>
                    </div>
                    
                    <!-- Event Info Column -->
                    <div class="event-details-text">
                        <h4 style="margin: 0 0 0.25rem 0;">${evt.title} ${eventStateBadge}</h4>
                        <div class="event-meta-info" style="display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.85rem; color: var(--text-muted);">
                            <span><i class="fa-regular fa-clock"></i> ${evt.time}</span>
                            <span><i class="fa-solid fa-location-dot"></i> ${evt.location}</span>
                            <span><i class="fa-solid fa-ticket"></i> ${priceDisplay}</span>
                        </div>
                    </div>
                    
                    <!-- SCEGA Approval Status Column -->
                    <div class="scega-status-column" style="text-align: center; min-width: 120px;">
                        <div style="background: ${scegaStatusBg}; padding: 0.75rem 1rem; border-radius: 12px; border: 1px solid ${scegaStatusColor}20;">
                            <i class="fa-solid ${scegaStatusIcon}" style="font-size: 1.25rem; color: ${scegaStatusColor}; display: block; margin-bottom: 0.25rem;"></i>
                            <span style="font-size: 0.75rem; font-weight: 600; color: ${scegaStatusColor};">${scegaStatusText}</span>
                            ${rejectionInfo}
                        </div>
                    </div>
                    
                    <!-- Actions Column -->
                    <div class="event-actions" style="display: flex; flex-direction: column; gap: 0.5rem;">
                        ${actionButtons}
                    </div>
                </div>
            `;
        }

        function updateStats() {
            const events = getEvents();
            const total = events.length;
            const upcoming = events.filter(e => e.status === 'Upcoming').length;
            const pending = events.filter(e => e.status === 'Pending').length;

            // Safe Update
            const totalEl = document.getElementById('stat-total-events');
            if (totalEl) totalEl.textContent = total;

            const upcomingEl = document.getElementById('stat-upcoming');
            if (upcomingEl) upcomingEl.textContent = upcoming;

            const pendingEl = document.getElementById('stat-pending');
            if (pendingEl) pendingEl.textContent = pending;
        }

        // Filter Change Listener
        const filterSelect = document.getElementById('event-filter-select');
        if (filterSelect) {
            filterSelect.addEventListener('change', () => {
                renderEvents();
            });
        }

        // Initial Load
        renderEvents();
        updateStats();

        // Make functions global for inline onclicks if needed
        window.deleteEvent = deleteEvent;

        // --- REQUESTS LOGIC ---
        const REQUESTS_DB_KEY = 'eventia_requests_db';

        function getRequests() {
            const stored = localStorage.getItem(REQUESTS_DB_KEY);
            return stored ? JSON.parse(stored) : [];
        }

        function saveRequest(request) {
            const requests = getRequests();
            requests.push(request);
            localStorage.setItem(REQUESTS_DB_KEY, JSON.stringify(requests));
        }

        function populateRequestEventFilters() {
            const events = getEvents();
            const outgoingSelect = document.getElementById('request-event-filter');
            const incomingSelect = document.getElementById('incoming-event-filter');
            const optionHtml = '<option value="all">All Events</option>' + (events || []).map(e => `<option value="${e.id}">${e.title}</option>`).join('');
            if (outgoingSelect) outgoingSelect.innerHTML = optionHtml;
            if (incomingSelect) incomingSelect.innerHTML = optionHtml;
        }

        function renderRequests() {
            const requests = getRequests();
            const vendors = getVendors();
            const events = getEvents();
            const container = document.getElementById('outgoing-requests-tables');
            const noMsg = document.getElementById('no-requests-msg');
            const statusFilter = document.getElementById('request-status-filter');
            const eventFilter = document.getElementById('request-event-filter');
            const countLabel = document.getElementById('outgoing-count');

            if (!container) return;

            let filtered = requests;
            if (statusFilter && statusFilter.value !== 'all') filtered = filtered.filter(r => r.status === statusFilter.value);

            // Group by eventId
            const byEvent = {};
            filtered.forEach(r => {
                const eid = r.eventId || 'unknown';
                if (!byEvent[eid]) byEvent[eid] = [];
                byEvent[eid].push(r);
            });

            // If one event selected, only that event
            const eventIds = eventFilter && eventFilter.value !== 'all' ? [eventFilter.value] : Object.keys(byEvent);

            if (countLabel) countLabel.textContent = filtered.length ? `${filtered.length} request${filtered.length > 1 ? 's' : ''}` : '';

            if (filtered.length === 0 || eventIds.length === 0) {
                container.innerHTML = '';
                if (noMsg) noMsg.style.display = 'block';
                return;
            }

            if (noMsg) noMsg.style.display = 'none';

            // Sort event IDs by event title
            const eventList = eventIds.map(eid => ({ id: eid, evt: events.find(e => e.id === eid) || { title: 'Unlinked Event' } }));
            eventList.sort((a, b) => (a.evt.title || '').localeCompare(b.evt.title || ''));

            container.innerHTML = eventList.map(({ id: eventId, evt }) => {
                const rows = (byEvent[eventId] || []).sort((a, b) => new Date(b.dateSent) - new Date(a.dateSent));
                const rowsHtml = rows.map(req => {
                    const vendor = vendors.find(v => v.id === req.vendorId) || { name: 'Unknown Vendor', category: 'N/A' };
                    let statusClass = 'status-pending';
                    let statusIcon = '<i class="fa-solid fa-clock"></i>';
                    if (req.status === 'Approved') { statusClass = 'status-approved'; statusIcon = '<i class="fa-solid fa-check-circle"></i>'; }
                    else if (req.status === 'Rejected') { statusClass = 'status-rejected'; statusIcon = '<i class="fa-solid fa-circle-xmark"></i>'; }
                    const formattedDate = new Date(req.dateSent).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    return `
                        <tr>
                            <td>
                                <div class="req-table-vendor">
                                    <span class="req-table-vendor-name">${vendor.name}</span>
                                    <span class="req-table-vendor-cat">${vendor.category}</span>
                                </div>
                            </td>
                            <td><span class="status-badge ${statusClass}">${statusIcon} ${req.status}</span></td>
                            <td class="req-table-details-cell">
                                <button type="button" class="btn btn-sm btn-outline req-btn-view" onclick="openRequestDetailModal('${req.id}', 'outgoing')">
                                    <i class="fa-solid fa-eye"></i> View
                                </button>
                            </td>
                        </tr>`;
                }).join('');

                return `
                    <div class="req-event-block">
                        <h3 class="req-event-header"><i class="fa-solid fa-calendar-days"></i> ${evt.title}</h3>
                        <div class="table-container">
                            <table class="data-table req-table">
                                <thead>
                                    <tr>
                                        <th class="req-th-vendor">Vendor</th>
                                        <th class="req-th-status">Status</th>
                                        <th class="req-th-details">Details</th>
                                    </tr>
                                </thead>
                                <tbody>${rowsHtml}</tbody>
                            </table>
                        </div>
                    </div>`;
            }).join('');
        }

        // Request Modal Logic
        const requestModal = document.getElementById('request-modal');
        const closeModalBtns = document.querySelectorAll('.close-modal-btn');
        const requestForm = document.getElementById('send-request-form');

        function openRequestModal(vendorId, vendorName) {
            if (!requestModal) return;

            document.getElementById('request-vendor-id').value = vendorId;
            document.getElementById('modal-vendor-name').textContent = vendorName;

            const eventSelect = document.getElementById('request-event-select');
            const events = getEvents().filter(e => e.status === 'Upcoming' || e.status === 'Ongoing');

            eventSelect.innerHTML = '<option value="" disabled selected>Choose an event...</option>';
            events.forEach(evt => {
                const option = document.createElement('option');
                option.value = evt.id;
                option.textContent = evt.title;
                eventSelect.appendChild(option);
            });

            requestModal.classList.remove('hidden');
        }

        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (requestModal) requestModal.classList.add('hidden');
            });
        });

        if (requestForm) {
            requestForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const vendorId = document.getElementById('request-vendor-id').value;
                const eventId = document.getElementById('request-event-select').value;
                const message = document.getElementById('request-message').value;
                const now = new Date();

                const newRequest = {
                    id: 'r' + Date.now(),
                    vendorId: vendorId,
                    eventId: eventId,
                    message: message,
                    status: 'Pending',
                    dateSent: now.toISOString().split('T')[0]
                };

                saveRequest(newRequest);
                showToast("Request sent successfully!");
                if (requestModal) requestModal.classList.add('hidden');
                requestForm.reset();
                renderRequests();
            });
        }

        // Incoming Requests Functions
        const INCOMING_REQUESTS_KEY = 'eventia_incoming_requests';

        function getIncomingRequests() {
            return JSON.parse(localStorage.getItem(INCOMING_REQUESTS_KEY)) || [];
        }

        function saveIncomingRequests(requests) {
            localStorage.setItem(INCOMING_REQUESTS_KEY, JSON.stringify(requests));
        }

        function renderIncomingRequests() {
            const requests = getIncomingRequests();
            const events = getEvents();
            const container = document.getElementById('incoming-requests-tables');
            const noMsg = document.getElementById('no-incoming-requests-msg');
            const statusFilter = document.getElementById('incoming-status-filter');
            const eventFilter = document.getElementById('incoming-event-filter');
            const badge = document.getElementById('incoming-badge');
            const countLabel = document.getElementById('incoming-count');

            if (!container) return;

            const pendingCount = requests.filter(r => r.status === 'Pending').length;
            if (badge) {
                badge.textContent = pendingCount;
                badge.style.display = pendingCount > 0 ? 'inline' : 'none';
            }

            let filtered = requests;
            if (statusFilter && statusFilter.value !== 'all') filtered = filtered.filter(r => r.status === statusFilter.value);

            const byEvent = {};
            filtered.forEach(r => {
                const eid = r.eventId || 'unknown';
                if (!byEvent[eid]) byEvent[eid] = [];
                byEvent[eid].push(r);
            });

            const eventIds = eventFilter && eventFilter.value !== 'all' ? [eventFilter.value] : Object.keys(byEvent);

            if (countLabel) countLabel.textContent = filtered.length ? `${filtered.length} request${filtered.length > 1 ? 's' : ''}` : '';

            if (filtered.length === 0 || eventIds.length === 0) {
                container.innerHTML = '';
                if (noMsg) noMsg.style.display = 'block';
                return;
            }

            if (noMsg) noMsg.style.display = 'none';

            const eventList = eventIds.map(eid => ({ id: eid, evt: events.find(e => e.id === eid) || { title: 'Unknown Event' } }));
            eventList.sort((a, b) => (a.evt.title || '').localeCompare(b.evt.title || ''));

            container.innerHTML = eventList.map(({ id: eventId, evt }) => {
                const rows = (byEvent[eventId] || []).sort((a, b) => new Date(b.dateReceived) - new Date(a.dateReceived));
                const rowsHtml = rows.map(req => {
                    let statusClass = 'status-pending';
                    let statusIcon = '<i class="fa-solid fa-clock"></i>';
                    if (req.status === 'Approved') { statusClass = 'status-approved'; statusIcon = '<i class="fa-solid fa-check-circle"></i>'; }
                    else if (req.status === 'Rejected') { statusClass = 'status-rejected'; statusIcon = '<i class="fa-solid fa-circle-xmark"></i>'; }
                    const isPending = req.status === 'Pending';
                    const actionsHtml = isPending
                        ? `
                            <button type="button" class="btn btn-sm btn-success" onclick="handleIncomingRequest('${req.id}', 'approve')"><i class="fa-solid fa-check"></i> Approve</button>
                            <button type="button" class="btn btn-sm btn-danger" onclick="handleIncomingRequest('${req.id}', 'reject')"><i class="fa-solid fa-xmark"></i> Reject</button>
                        `
                        : '<span class="req-table-no-action">—</span>';
                    return `
                        <tr>
                            <td>
                                <div class="req-table-vendor">
                                    <span class="req-table-vendor-name">${req.vendorName}</span>
                                    <span class="req-table-vendor-cat">${req.vendorEmail || '—'}</span>
                                </div>
                            </td>
                            <td><span class="status-badge ${statusClass}">${statusIcon} ${req.status}</span></td>
                            <td class="req-table-details-cell">
                                <button type="button" class="btn btn-sm btn-outline req-btn-view" onclick="openRequestDetailModal('${req.id}', 'incoming')">
                                    <i class="fa-solid fa-eye"></i> View
                                </button>
                            </td>
                            <td class="req-table-actions-cell">${actionsHtml}</td>
                        </tr>`;
                }).join('');

                return `
                    <div class="req-event-block">
                        <h3 class="req-event-header"><i class="fa-solid fa-calendar-days"></i> ${evt.title}</h3>
                        <div class="table-container">
                            <table class="data-table req-table">
                                <thead>
                                    <tr>
                                        <th class="req-th-vendor">Vendor</th>
                                        <th class="req-th-status">Status</th>
                                        <th class="req-th-details">Details</th>
                                        <th class="req-th-actions">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>${rowsHtml}</tbody>
                            </table>
                        </div>
                    </div>`;
            }).join('');
        }

        window.openRequestDetailModal = function (requestId, type) {
            const modal = document.getElementById('request-detail-modal');
            if (!modal) return;

            const events = getEvents();
            const titleEl = document.getElementById('request-detail-modal-title');
            const eventTitleEl = document.getElementById('request-detail-event-title');
            const categoryEl = document.getElementById('request-detail-event-category');
            const vendorWrap = document.getElementById('request-detail-vendor-wrap');
            const chipsEl = document.getElementById('request-detail-chips');
            const messageLabelEl = document.getElementById('request-detail-message-label');
            const messageEl = document.getElementById('request-detail-message');
            const rejectionWrap = document.getElementById('request-detail-rejection-wrap');
            const rejectionEl = document.getElementById('request-detail-rejection');
            const statusEl = document.getElementById('request-detail-status');

            if (vendorWrap) vendorWrap.style.display = 'none';
            const attachmentWrapEl = document.getElementById('request-detail-attachment-wrap');
            if (attachmentWrapEl) attachmentWrapEl.style.display = 'none';

            if (type === 'outgoing') {
                const requests = getRequests();
                const req = requests.find(r => r.id === requestId);
                if (!req) return;
                const evt = events.find(e => e.id === req.eventId) || {};
                const vendors = getVendors();
                const vendor = vendors.find(v => v.id === req.vendorId) || { name: 'Unknown Vendor' };

                titleEl.textContent = 'Request Details';
                eventTitleEl.textContent = evt.title || 'Unlinked Event';
                categoryEl.textContent = evt.category || 'Event';
                categoryEl.style.display = evt.category ? 'inline-block' : 'none';

                const sentDate = new Date(req.dateSent).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const eventDate = evt.date ? new Date(evt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
                const policyLabels = { 'flexible': 'Flexible', 'moderate': 'Moderate (14 days)', 'strict': 'Strict (30 days)', 'non-refundable': 'Non-refundable' };
                const policyColors = { 'flexible': '#2e7d32', 'moderate': '#ff9800', 'strict': '#e65100', 'non-refundable': '#c62828' };
                const pol = evt.withdrawalPolicy;
                const policyLabel = policyLabels[pol] || 'Not set';
                const policyColor = policyColors[pol] || '#666';

                chipsEl.innerHTML = `
                    <div class="req-chip"><i class="fa-regular fa-clock"></i><div class="req-chip-inner"><span class="req-chip-label">Sent</span><span class="req-chip-value">${sentDate}</span></div></div>
                    <div class="req-chip"><i class="fa-solid fa-calendar-days"></i><div class="req-chip-inner"><span class="req-chip-label">Event date</span><span class="req-chip-value">${eventDate}</span></div></div>
                    <div class="req-chip"><i class="fa-solid fa-location-dot"></i><div class="req-chip-inner"><span class="req-chip-label">Location</span><span class="req-chip-value">${evt.location || '—'}</span></div></div>
                    ${pol ? `<div class="req-chip"><i class="fa-solid fa-shield-halved" style="color: ${policyColor}"></i><div class="req-chip-inner"><span class="req-chip-label">Withdrawal</span><span class="req-chip-value" style="color: ${policyColor}; font-weight: 600;">${policyLabel}</span></div></div>` : ''}
                `;

                messageLabelEl.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Your invitation';
                messageEl.textContent = req.message || '—';

                if (req.status === 'Rejected' && (req.rejectionReason || '').trim()) {
                    rejectionWrap.style.display = 'block';
                    rejectionEl.textContent = req.rejectionReason;
                } else {
                    rejectionWrap.style.display = 'none';
                }

                let statusClass = 'status-pending';
                let statusIcon = '<i class="fa-solid fa-clock"></i>';
                if (req.status === 'Approved') { statusClass = 'status-approved'; statusIcon = '<i class="fa-solid fa-check-circle"></i>'; }
                else if (req.status === 'Rejected') { statusClass = 'status-rejected'; statusIcon = '<i class="fa-solid fa-circle-xmark"></i>'; }
                statusEl.className = 'status-badge ' + statusClass;
                statusEl.innerHTML = statusIcon + ' ' + req.status;
            } else {
                const requests = getIncomingRequests();
                const req = requests.find(r => r.id === requestId);
                if (!req) return;
                const evt = events.find(e => e.id === req.eventId) || {};

                titleEl.textContent = 'Application Details';
                eventTitleEl.textContent = evt.title || 'Unknown Event';
                categoryEl.textContent = evt.category || 'Event';
                categoryEl.style.display = evt.category ? 'inline-block' : 'none';

                if (vendorWrap) {
                    vendorWrap.style.display = 'block';
                    document.getElementById('request-detail-vendor-name').textContent = req.vendorName || '—';
                    document.getElementById('request-detail-vendor-email').textContent = req.vendorEmail || '—';
                    document.getElementById('request-detail-vendor-service').textContent = req.serviceType || '—';
                }

                const receivedDate = new Date(req.dateReceived).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const eventDate = evt.date ? new Date(evt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
                chipsEl.innerHTML = `
                    <div class="req-chip"><i class="fa-regular fa-clock"></i><div class="req-chip-inner"><span class="req-chip-label">Received</span><span class="req-chip-value">${receivedDate}</span></div></div>
                    <div class="req-chip"><i class="fa-solid fa-calendar-days"></i><div class="req-chip-inner"><span class="req-chip-label">Event date</span><span class="req-chip-value">${eventDate}</span></div></div>
                    <div class="req-chip"><i class="fa-solid fa-location-dot"></i><div class="req-chip-inner"><span class="req-chip-label">Location</span><span class="req-chip-value">${evt.location || '—'}</span></div></div>
                `;

                messageLabelEl.innerHTML = '<i class="fa-solid fa-message"></i> Vendor\'s proposal';
                messageEl.textContent = req.message || '—';

                // Show vendor attachment if present (card layout with View / Download)
                const attachmentWrap = document.getElementById('request-detail-attachment-wrap');
                const attachmentNameEl = document.getElementById('request-detail-attachment-name');
                const attachmentView = document.getElementById('request-detail-attachment-view');
                const attachmentDownload = document.getElementById('request-detail-attachment-download');
                const attachmentIcon = document.getElementById('request-detail-attachment-icon');
                const attachmentIconWrap = document.getElementById('request-detail-attachment-icon-wrap');
                if (attachmentWrap && attachmentNameEl && attachmentView && attachmentDownload && attachmentIcon && attachmentIconWrap) {
                    if (req.attachmentFileName && req.attachmentData) {
                        attachmentWrap.style.display = 'block';
                        attachmentNameEl.textContent = req.attachmentFileName;
                        const mime = (req.attachmentMimeType || 'application/octet-stream').toLowerCase();
                        const dataUrl = 'data:' + (req.attachmentMimeType || 'application/octet-stream') + ';base64,' + req.attachmentData;
                        attachmentView.href = dataUrl;
                        attachmentDownload.href = dataUrl;
                        attachmentDownload.download = req.attachmentFileName;
                        var ext = (req.attachmentFileName || '').split('.').pop().toLowerCase();
                        var isPdf = mime.indexOf('pdf') !== -1 || ext === 'pdf';
                        var isWord = mime.indexOf('word') !== -1 || mime.indexOf('document') !== -1 || ['doc', 'docx'].indexOf(ext) !== -1;
                        var isImage = mime.indexOf('image') !== -1 || ['jpg', 'jpeg', 'png', 'gif', 'webp'].indexOf(ext) !== -1;
                        attachmentIcon.className = 'fa-solid ' + (isPdf ? 'fa-file-pdf' : isWord ? 'fa-file-word' : isImage ? 'fa-file-image' : 'fa-file-lines');
                        attachmentIconWrap.className = 'req-detail-attachment-icon-wrap' + (isPdf ? ' req-detail-attachment-icon-pdf' : isWord ? ' req-detail-attachment-icon-word' : isImage ? ' req-detail-attachment-icon-image' : '');
                    } else {
                        attachmentWrap.style.display = 'none';
                    }
                }

                rejectionWrap.style.display = 'none';

                let statusClass = 'status-pending';
                let statusIcon = '<i class="fa-solid fa-clock"></i>';
                if (req.status === 'Approved') { statusClass = 'status-approved'; statusIcon = '<i class="fa-solid fa-check-circle"></i>'; }
                else if (req.status === 'Rejected') { statusClass = 'status-rejected'; statusIcon = '<i class="fa-solid fa-circle-xmark"></i>'; }
                statusEl.className = 'status-badge ' + statusClass;
                statusEl.innerHTML = statusIcon + ' ' + req.status;
            }

            modal.classList.remove('hidden');
        };

        window.closeRequestDetailModal = function () {
            const modal = document.getElementById('request-detail-modal');
            if (modal) modal.classList.add('hidden');
        };

        // Handle incoming request approval/rejection
        // Rejection Modal Logic
        let currentRejectionId = null;

        window.openRejectionModal = function (requestId) {
            currentRejectionId = requestId;
            const modal = document.getElementById('rejection-modal');
            if (modal) {
                modal.style.display = 'flex';
                document.getElementById('rejection-reason').value = '';
            }
        };

        window.closeRejectionModal = function () {
            currentRejectionId = null;
            const modal = document.getElementById('rejection-modal');
            if (modal) modal.style.display = 'none';
        };

        window.confirmRejection = function () {
            if (!currentRejectionId) return;
            const reason = document.getElementById('rejection-reason').value;

            const requests = getIncomingRequests();
            const idx = requests.findIndex(r => r.id === currentRejectionId);

            if (idx !== -1) {
                requests[idx].status = 'Rejected';
                requests[idx].rejectionReason = reason;
                saveIncomingRequests(requests);
                renderIncomingRequests();
                showToast('Request rejected.');
                closeRejectionModal();
            }
        };

        // Handle incoming request approval
        window.handleIncomingRequest = function (requestId, action) {
            if (action === 'reject') {
                openRejectionModal(requestId);
                return;
            }

            const requests = getIncomingRequests();
            const requestIndex = requests.findIndex(r => r.id === requestId);

            if (requestIndex !== -1 && action === 'approve') {
                requests[requestIndex].status = 'Approved';
                saveIncomingRequests(requests);
                renderIncomingRequests();
                showToast('Request approved!');
            }
        };

        // Tab switching for Requests page
        const requestTabs = document.querySelectorAll('.request-tab');
        requestTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Reset all tabs to inactive (white card with border)
                requestTabs.forEach(t => {
                    t.classList.remove('active');
                    t.style.border = '2px solid #e0e0e0';
                    t.style.background = 'white';
                    t.style.boxShadow = 'none';
                    // Reset icon container and text
                    const iconContainer = t.querySelector('div:first-child');
                    if (iconContainer) {
                        iconContainer.style.background = 'linear-gradient(135deg, #f0f4f8, #e3e8ed)';
                        const icon = iconContainer.querySelector('i');
                        if (icon) icon.style.color = '#1565c0';
                    }
                    // Reset text colors
                    const textContainer = t.querySelector('div:nth-child(2)');
                    if (textContainer) {
                        const title = textContainer.querySelector('div:first-child');
                        const subtitle = textContainer.querySelector('div:last-child');
                        if (title) title.style.color = '#333';
                        if (subtitle) subtitle.style.color = '#666';
                    }
                });

                // Style active tab (blue gradient)
                tab.classList.add('active');
                tab.style.border = 'none';
                tab.style.background = 'linear-gradient(135deg, #1565c0, #0d47a1)';
                tab.style.boxShadow = '0 4px 15px rgba(21, 101, 192, 0.3)';
                // Style active icon container
                const activeIconContainer = tab.querySelector('div:first-child');
                if (activeIconContainer) {
                    activeIconContainer.style.background = 'rgba(255,255,255,0.2)';
                    const activeIcon = activeIconContainer.querySelector('i');
                    if (activeIcon) activeIcon.style.color = 'white';
                }
                // Style active text colors
                const activeTextContainer = tab.querySelector('div:nth-child(2)');
                if (activeTextContainer) {
                    const title = activeTextContainer.querySelector('div:first-child');
                    const subtitle = activeTextContainer.querySelector('div:last-child');
                    if (title) title.style.color = 'white';
                    if (subtitle) subtitle.style.color = 'rgba(255,255,255,0.8)';
                }

                // Show correct section
                const outgoingSection = document.getElementById('outgoing-requests-section');
                const incomingSection = document.getElementById('incoming-requests-section');

                if (tab.dataset.tab === 'outgoing') {
                    if (outgoingSection) outgoingSection.style.display = 'block';
                    if (incomingSection) incomingSection.style.display = 'none';
                    renderRequests();
                } else {
                    if (outgoingSection) outgoingSection.style.display = 'none';
                    if (incomingSection) incomingSection.style.display = 'block';
                    renderIncomingRequests();
                }
            });
        });

        // Listeners for Request View
        const reqStatusFilter = document.getElementById('request-status-filter');
        if (reqStatusFilter) reqStatusFilter.addEventListener('change', renderRequests);

        const reqEventFilter = document.getElementById('request-event-filter');
        if (reqEventFilter) reqEventFilter.addEventListener('change', renderRequests);

        const incomingStatusFilter = document.getElementById('incoming-status-filter');
        if (incomingStatusFilter) incomingStatusFilter.addEventListener('change', renderIncomingRequests);

        const incomingEventFilter = document.getElementById('incoming-event-filter');
        if (incomingEventFilter) incomingEventFilter.addEventListener('change', renderIncomingRequests);

        // Update SwitchView to handle requests
        const originalSwitchView = window.switchView;
        window.switchView = function (viewId) {
            // Update Sidebar Active State
            sidebarItems.forEach(item => {
                item.classList.remove('active');
                if (item.dataset.view === viewId) {
                    item.classList.add('active');
                }
            });

            // Show Target Section
            sections.forEach(sec => {
                sec.classList.remove('active');
                if (sec.id === `view-${viewId}`) {
                    sec.classList.add('active');
                }
            });

            // Update Header Title
            const titles = {
                'overview': 'Dashboard Overview',
                'create-event': 'Create New Event',
                'events-list': 'My Events',
                'event-manage': 'Event Management',
                'vendors': 'Vendor Marketplace',
                'requests': 'Manage Requests',
                'analytics': 'Event Analytics',
                'profile': 'My Profile'
            };
            if (pageTitle) pageTitle.textContent = titles[viewId] || 'Dashboard';

            // Close sidebar on mobile
            if (window.innerWidth < 992) {
                sidebar.classList.remove('open');
            }

            // Data Refresh
            if (viewId === 'overview' || viewId === 'events-list') {
                renderEvents();
                updateStats();
            } else if (viewId === 'vendors') {
                renderVendors();
            } else if (viewId === 'requests') {
                if (typeof populateRequestEventFilters === 'function') populateRequestEventFilters();
                renderRequests();
                renderIncomingRequests();
            } else if (viewId === 'event-manage') {
                // Data is loaded by openEventManage before switching
            }
        };

        // Message Modal Logic
        window.openMessageModal = function (message) {
            const modal = document.getElementById('message-modal');
            const content = document.getElementById('full-message-content');
            if (modal && content) {
                content.textContent = message;
                modal.classList.remove('hidden');
                modal.style.display = 'flex';
                modal.style.alignItems = 'center';
                modal.style.justifyContent = 'center';
            }
        };

        window.closeMessageModal = function () {
            const modal = document.getElementById('message-modal');
            if (modal) {
                modal.classList.add('hidden');
                setTimeout(() => { modal.style.display = 'none'; }, 300);
            }
        };

        const messageModal = document.getElementById('message-modal');
        if (messageModal) {
            messageModal.addEventListener('click', (e) => {
                if (e.target === messageModal) closeMessageModal();
            });
        }

        const requestDetailModal = document.getElementById('request-detail-modal');
        if (requestDetailModal) {
            requestDetailModal.addEventListener('click', (e) => {
                if (e.target === requestDetailModal) closeRequestDetailModal();
            });
        }

        // ===================================================================
        // EVENT MANAGEMENT MODULE
        // ===================================================================
        const EVENT_VENDORS_KEY = 'eventia_event_vendors';
        const MESSAGES_KEY = 'eventia_messages';
        const BROADCASTS_KEY = 'eventia_broadcasts';

        let currentManagedEventId = null;

        function getEventVendors() {
            return JSON.parse(localStorage.getItem(EVENT_VENDORS_KEY) || '[]');
        }
        function getMessages() {
            return JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');
        }
        function getBroadcasts() {
            return JSON.parse(localStorage.getItem(BROADCASTS_KEY) || '[]');
        }

        // --- Open Event Management ---
        window.openEventManage = function (eventId) {
            const events = getEvents();
            const evt = events.find(e => e.id === eventId);
            if (!evt) return;

            currentManagedEventId = eventId;

            // Populate Header
            document.getElementById('em-event-title').textContent = evt.title;

            // State badge
            const todayStr = new Date().toISOString().split('T')[0];
            let stateTxt, stateColor, stateBg;
            if (evt.date === todayStr) { stateTxt = 'Ongoing'; stateColor = '#2e7d32'; stateBg = 'rgba(46,125,50,0.2)'; }
            else if (evt.date > todayStr) { stateTxt = 'Upcoming'; stateColor = '#7b1fa2'; stateBg = 'rgba(123,31,162,0.2)'; }
            else { stateTxt = 'Past'; stateColor = '#757575'; stateBg = 'rgba(117,117,117,0.2)'; }
            const stateBadge = document.getElementById('em-event-state-badge');
            stateBadge.textContent = stateTxt;
            stateBadge.style.background = stateBg;
            stateBadge.style.color = stateColor;

            // SCEGA badge
            let scegaTxt, scegaColor, scegaBg;
            if (evt.status === 'Pending') { scegaTxt = '⏳ Pending Approval'; scegaColor = '#e65100'; scegaBg = 'rgba(255,152,0,0.2)'; }
            else if (evt.status === 'Rejected') { scegaTxt = '❌ Rejected'; scegaColor = '#c62828'; scegaBg = 'rgba(198,40,40,0.2)'; }
            else { scegaTxt = '✅ SCEGA Approved'; scegaColor = '#2e7d32'; scegaBg = 'rgba(46,125,50,0.2)'; }
            const scegaBadge = document.getElementById('em-scega-badge');
            scegaBadge.textContent = scegaTxt;
            scegaBadge.style.background = scegaBg;
            scegaBadge.style.color = scegaColor;

            // Stats
            const evVendors = getEventVendors().filter(v => v.eventId === eventId);
            document.getElementById('em-stat-vendors').textContent = evVendors.length;
            document.getElementById('em-stat-pending-vendors').textContent = evVendors.filter(v => v.status === 'Pending').length;
            document.getElementById('em-stat-attendees').textContent = evt.attendees || 0;

            // Countdown
            const diffMs = new Date(evt.date) - new Date(todayStr);
            const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
            const countdownEl = document.getElementById('em-stat-countdown');
            if (diffDays > 0) countdownEl.textContent = diffDays;
            else if (diffDays === 0) countdownEl.textContent = 'Today';
            else countdownEl.textContent = 'Ended';

            // Overview tab data
            document.getElementById('em-ov-title').textContent = evt.title;
            document.getElementById('em-ov-category').textContent = evt.category;
            document.getElementById('em-ov-description').textContent = evt.description;
            const dateFormatted = new Date(evt.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            document.getElementById('em-ov-date').textContent = dateFormatted;
            document.getElementById('em-ov-time').textContent = evt.time;
            document.getElementById('em-ov-location').textContent = evt.location;

            // Tickets
            const ticketsEl = document.getElementById('em-ov-tickets');
            if (evt.tickets && evt.tickets.length > 0) {
                ticketsEl.innerHTML = '<div style="display:flex;flex-wrap:wrap;gap:0.5rem;">' +
                    evt.tickets.map(t => `<div class="em-ticket-tier"><span class="tier-name">${t.name}</span><span class="tier-price">${t.price > 0 ? t.price + ' SAR' : 'Free'}</span></div>`).join('') + '</div>';
            } else {
                ticketsEl.innerHTML = '<p style="color:#888;margin:0;">No ticket tiers defined.</p>';
            }

            // Withdrawal Policies
            const policyMeta = {
                'flexible': { label: '✦ Flexible', css: 'em-policy-flexible', desc: 'Vendors can withdraw up to 7 days before the event starts.' },
                'moderate': { label: '✦ Moderate', css: 'em-policy-moderate', desc: 'Withdrawal allowed up to 14 days before the event.' },
                'strict': { label: '✦ Strict', css: 'em-policy-strict', desc: 'Withdrawal allowed up to 30 days before the event.' },
                'non-refundable': { label: '✦ Non-refundable', css: 'em-policy-non-refundable', desc: 'No withdrawal or cancellations permitted once confirmed.' }
            };
            const attendeePolicyMeta = {
                'flexible': { label: '✦ Flexible', css: 'em-policy-flexible', desc: 'Full refund available up to 1 day before the event.' },
                'moderate': { label: '✦ Moderate', css: 'em-policy-moderate', desc: 'Full refund available up to 7 days before the event.' },
                'strict': { label: '✦ Strict', css: 'em-policy-strict', desc: 'Full refund available up to 30 days before the event.' },
                'non-refundable': { label: '✦ Non-refundable', css: 'em-policy-non-refundable', desc: 'No refunds allowed once tickets are purchased.' }
            };

            const vendorBadgeEl = document.getElementById('em-ov-vendor-policy-badge');
            const vendorDescEl = document.getElementById('em-ov-vendor-policy-desc');
            const vendorPol = evt.withdrawalPolicy ? policyMeta[evt.withdrawalPolicy] : null;
            vendorBadgeEl.className = 'em-policy-badge ' + (vendorPol ? vendorPol.css : 'em-policy-none');
            vendorBadgeEl.textContent = vendorPol ? vendorPol.label : '— Not Set';
            vendorDescEl.textContent = vendorPol ? vendorPol.desc : 'No vendor withdrawal policy has been configured for this event.';

            const attendeeBadgeEl = document.getElementById('em-ov-attendee-policy-badge');
            const attendeeDescEl = document.getElementById('em-ov-attendee-policy-desc');
            const attendeePol = evt.attendeeWithdrawalPolicy ? attendeePolicyMeta[evt.attendeeWithdrawalPolicy] : null;
            attendeeBadgeEl.className = 'em-policy-badge ' + (attendeePol ? attendeePol.css : 'em-policy-none');
            attendeeBadgeEl.textContent = attendeePol ? attendeePol.label : '— Not Set';
            attendeeDescEl.textContent = attendeePol ? attendeePol.desc : 'No attendee refund policy has been configured for this event.';

            // Render sub-sections
            renderEventManageVendors(eventId);
            renderEventManageConversations(eventId);
            renderEventManageBroadcasts(eventId);

            // Setup action buttons
            document.getElementById('em-edit-btn').onclick = function () { openEditView(eventId); };
            document.getElementById('em-delete-btn').onclick = function () {
                if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
                    deleteEvent(eventId);
                    switchView('events-list');
                    showToast('Event deleted successfully.');
                }
            };

            // --- Inline description edit ---
            const descDisplayEl = document.getElementById('em-description-display');
            const descEditEl = document.getElementById('em-description-edit');
            const descTextEl = document.getElementById('em-ov-description');
            const descTextarea = document.getElementById('em-desc-textarea');
            const editDescBtn = document.getElementById('em-edit-desc-btn');
            const saveDescBtn = document.getElementById('em-save-desc-btn');
            const cancelDescBtn = document.getElementById('em-cancel-desc-btn');

            // Reset to display mode each time manage opens
            descDisplayEl.style.display = 'flex';
            descEditEl.style.display = 'none';

            editDescBtn.onclick = function () {
                descTextarea.value = descTextEl.textContent.trim();
                descDisplayEl.style.display = 'none';
                descEditEl.style.display = 'flex';
                descTextarea.focus();
            };

            cancelDescBtn.onclick = function () {
                descDisplayEl.style.display = 'flex';
                descEditEl.style.display = 'none';
            };

            saveDescBtn.onclick = function () {
                const newDesc = descTextarea.value.trim();
                if (!newDesc) { showToast('Description cannot be empty.'); return; }
                const allEvents = getEvents();
                const idx = allEvents.findIndex(e => e.id === eventId);
                if (idx !== -1) {
                    allEvents[idx].description = newDesc;
                    localStorage.setItem(EVENTS_DB_KEY, JSON.stringify(allEvents));
                    descTextEl.textContent = newDesc;
                    descDisplayEl.style.display = 'flex';
                    descEditEl.style.display = 'none';
                    showToast('Description updated successfully!');
                }
            };

            // Reset to Overview tab
            document.querySelectorAll('.em-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.em-tab-content').forEach(tc => tc.classList.remove('active'));
            document.querySelector('.em-tab[data-emtab="overview"]').classList.add('active');
            document.getElementById('em-tab-overview').classList.add('active');

            // Reset comm sub-tabs
            document.querySelectorAll('.em-comm-subtab').forEach(s => s.classList.remove('active'));
            document.querySelectorAll('.em-comm-panel').forEach(p => p.classList.remove('active'));
            document.querySelector('.em-comm-subtab[data-commtab="vendor-msgs"]').classList.add('active');
            document.getElementById('em-comm-vendor-msgs').classList.add('active');

            switchView('event-manage');
        };

        // --- Tab Switching ---
        document.querySelectorAll('.em-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.em-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.em-tab-content').forEach(tc => tc.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById('em-tab-' + tab.dataset.emtab).classList.add('active');
            });
        });

        // Communication sub-tabs
        document.querySelectorAll('.em-comm-subtab').forEach(st => {
            st.addEventListener('click', () => {
                document.querySelectorAll('.em-comm-subtab').forEach(s => s.classList.remove('active'));
                document.querySelectorAll('.em-comm-panel').forEach(p => p.classList.remove('active'));
                st.classList.add('active');
                document.getElementById('em-comm-' + st.dataset.commtab).classList.add('active');
            });
        });

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

        // Helper: ensure vendor has preparation data
        function ensurePreparationData(ev) {
            if (!ev.preparationStatus) {
                ev.preparationStatus = 'Pending';
            }
            if (!ev.statusHistory) {
                ev.statusHistory = [{
                    status: 'Pending',
                    note: 'Vendor confirmed for the event.',
                    timestamp: new Date().toISOString(),
                    source: 'system'
                }];
            }
            return ev;
        }

        // --- Render Vendors for Event ---
        function renderEventManageVendors(eventId) {
            let evVendors = getEventVendors().filter(v => v.eventId === eventId);
            const allVendors = getVendors();
            const listEl = document.getElementById('em-vendors-list');
            const countEl = document.getElementById('em-vendors-count');

            countEl.textContent = evVendors.length + ' vendor' + (evVendors.length !== 1 ? 's' : '');

            if (evVendors.length === 0) {
                listEl.innerHTML = '<div class="em-empty-state"><i class="fa-solid fa-store-slash"></i><p>No vendors assigned yet. Invite vendors from the marketplace.</p></div>';
                return;
            }

            // Ensure all vendors have preparation data
            let needSave = false;
            const allEvVendors = getEventVendors();
            evVendors.forEach(ev => {
                if (!ev.preparationStatus || !ev.statusHistory) {
                    const idx = allEvVendors.findIndex(v => v.eventId === ev.eventId && v.vendorId === ev.vendorId);
                    if (idx !== -1) {
                        ensurePreparationData(allEvVendors[idx]);
                        ev.preparationStatus = allEvVendors[idx].preparationStatus;
                        ev.statusHistory = allEvVendors[idx].statusHistory;
                        needSave = true;
                    }
                }
            });
            if (needSave) {
                localStorage.setItem(EVENT_VENDORS_KEY, JSON.stringify(allEvVendors));
            }

            listEl.innerHTML = evVendors.map(ev => {
                const vendor = allVendors.find(v => v.id === ev.vendorId) || { name: 'Unknown', category: 'N/A', image: 'fa-store' };
                const statusClass = ev.status.toLowerCase();
                const prepStatus = ev.preparationStatus || 'Pending';
                const isConfirmed = ev.status === 'Confirmed';

                // Build timeline stepper HTML for confirmed vendors
                let timelineHtml = '';
                if (isConfirmed) {
                    const currentIdx = PREP_STATUSES.indexOf(prepStatus);
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

                    // Connector lines
                    let connectors = '';
                    for (let i = 0; i < PREP_STATUSES.length - 1; i++) {
                        let connClass = 'upcoming';
                        if (i < currentIdx) connClass = 'completed';
                        else if (i === currentIdx) connClass = 'active';
                        // Position: each step is (100 / n)% wide, connector spans between centers
                        const stepW = 100 / PREP_STATUSES.length;
                        const left = (stepW * i + stepW / 2);
                        const width = stepW;
                        connectors += `<div class="em-timeline-connector ${connClass}" style="left:${left}%;width:${width}%;"></div>`;
                    }

                    // Update requested badge
                    const updateBadge = ev.updateRequested
                        ? `<span class="em-update-requested-badge"><i class="fa-solid fa-bell"></i> Update Requested</span>`
                        : '';

                    // Latest vendor note
                    const history = ev.statusHistory || [];
                    const latestVendorEntry = [...history].reverse().find(h => h.source === 'vendor');
                    let latestNoteHtml = '';
                    if (latestVendorEntry && latestVendorEntry.note) {
                        const noteTime = new Date(latestVendorEntry.timestamp).toLocaleString('en-US', {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        });
                        latestNoteHtml = `
                            <div style="margin-top: 0.65rem; padding: 0.6rem 0.85rem; background: #f5f7fa; border-radius: 10px; border-left: 3px solid ${PREP_COLORS[latestVendorEntry.status]};">
                                <div style="display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.25rem;">
                                    <i class="fa-solid fa-quote-left" style="font-size: 0.6rem; color: ${PREP_COLORS[latestVendorEntry.status]};"></i>
                                    <span style="font-size: 0.7rem; font-weight: 700; color: ${PREP_COLORS[latestVendorEntry.status]};">${latestVendorEntry.status}</span>
                                    <span style="font-size: 0.65rem; color: #aaa; margin-left: auto;">${noteTime}</span>
                                </div>
                                <p style="margin: 0; font-size: 0.8rem; color: #555; line-height: 1.45;">${latestVendorEntry.note}</p>
                            </div>`;
                    }

                    timelineHtml = `
                        <div class="em-vendor-timeline-wrap">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="font-size: 0.72rem; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.03em;">Preparation</span>
                                    ${updateBadge}
                                </div>
                                <button class="em-view-timeline-btn" onclick="event.stopPropagation(); openVendorStatusModal('${eventId}', '${ev.vendorId}')">
                                    <i class="fa-solid fa-timeline"></i> View Details
                                </button>
                            </div>
                            <div class="em-vendor-timeline" style="position: relative;">
                                ${connectors}
                                ${steps}
                            </div>
                            ${latestNoteHtml}
                        </div>`;
                }

                // Request update button for confirmed vendors
                const requestUpdateBtn = isConfirmed
                    ? (ev.updateRequested
                        ? `<button class="em-request-update-btn requested" title="Update already requested"><i class="fa-solid fa-bell"></i> Requested</button>`
                        : `<button class="em-request-update-btn" onclick="requestVendorUpdate('${eventId}', '${ev.vendorId}')" title="Ask vendor to update their status"><i class="fa-solid fa-bell"></i> Request Update</button>`)
                    : '';

                return `
                    <div class="em-vendor-card">
                        <div class="em-vendor-avatar"><i class="fa-solid ${vendor.image || 'fa-store'}"></i></div>
                        <div class="em-vendor-info">
                            <h4>${vendor.name}</h4>
                            <span>${vendor.category} · ${vendor.location || 'N/A'}</span>
                        </div>
                        <span class="em-vendor-status ${statusClass}">${ev.status}</span>
                        <div class="em-vendor-actions">
                            ${requestUpdateBtn}
                            <button class="btn btn-sm btn-outline" onclick="openVendorChat('${eventId}', '${ev.vendorId}')" title="Message"><i class="fa-solid fa-comment"></i></button>
                            <button class="btn btn-sm btn-outline" onclick="removeEventVendor('${eventId}', '${ev.vendorId}')" title="Remove" style="color:#c62828;border-color:#c62828;"><i class="fa-solid fa-user-minus"></i></button>
                        </div>
                        ${timelineHtml}
                    </div>`;
            }).join('');
        }

        // --- Remove Vendor ---
        window.removeEventVendor = function (eventId, vendorId) {
            if (!confirm('Remove this vendor from the event?')) return;
            let evVendors = getEventVendors();
            evVendors = evVendors.filter(v => !(v.eventId === eventId && v.vendorId === vendorId));
            localStorage.setItem(EVENT_VENDORS_KEY, JSON.stringify(evVendors));
            renderEventManageVendors(eventId);
            // Update stats
            const remaining = evVendors.filter(v => v.eventId === eventId);
            document.getElementById('em-stat-vendors').textContent = remaining.length;
            document.getElementById('em-stat-pending-vendors').textContent = remaining.filter(v => v.status === 'Pending').length;
            showToast('Vendor removed from event.');
        };

        // --- Request Vendor Update ---
        window.requestVendorUpdate = function (eventId, vendorId) {
            const evVendors = getEventVendors();
            const idx = evVendors.findIndex(v => v.eventId === eventId && v.vendorId === vendorId);
            if (idx === -1) return;

            evVendors[idx].updateRequested = true;
            localStorage.setItem(EVENT_VENDORS_KEY, JSON.stringify(evVendors));
            renderEventManageVendors(eventId);
            showToast('Update request sent to vendor!');
        };

        // --- Open Vendor Status Detail Modal ---
        window.openVendorStatusModal = function (eventId, vendorId) {
            const evVendors = getEventVendors();
            const ev = evVendors.find(v => v.eventId === eventId && v.vendorId === vendorId);
            if (!ev) return;

            const allVendors = getVendors();
            const vendor = allVendors.find(v => v.id === vendorId) || { name: 'Unknown' };

            document.getElementById('em-status-modal-vendor-name').textContent = vendor.name + ' — Preparation';

            const bodyEl = document.getElementById('em-status-modal-body');
            const prepStatus = ev.preparationStatus || 'Pending';
            const currentIdx = PREP_STATUSES.indexOf(prepStatus);
            const history = ev.statusHistory || [];

            // Build vertical history timeline
            let historyHtml = '<div class="em-history-timeline">';
            PREP_STATUSES.forEach((status, i) => {
                let itemClass = 'upcoming';
                let dotClass = 'upcoming';
                if (i < currentIdx) { itemClass = 'completed'; dotClass = 'completed'; }
                else if (i === currentIdx) { itemClass = 'active'; dotClass = 'active'; }

                const icon = PREP_ICONS[status];
                const historyEntry = history.find(h => h.status === status);

                let noteHtml = '';
                let timeHtml = '';
                if (historyEntry) {
                    if (historyEntry.note) {
                        noteHtml = `<div class="em-history-note">${historyEntry.note}</div>`;
                    }
                    const time = new Date(historyEntry.timestamp).toLocaleString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                    });
                    const source = historyEntry.source === 'vendor' ? 'Updated by vendor' : (historyEntry.source === 'system' ? 'System' : 'Updated');
                    timeHtml = `<div class="em-history-timestamp"><i class="fa-regular fa-clock"></i> ${time} · ${source}</div>`;
                } else if (itemClass === 'upcoming') {
                    noteHtml = `<div style="font-size: 0.78rem; color: #bbb; font-style: italic;">Awaiting this step</div>`;
                }

                historyHtml += `
                    <div class="em-history-item ${itemClass}">
                        <div class="em-history-dot ${dotClass}"><i class="fa-solid ${icon}"></i></div>
                        <div class="em-history-card">
                            <div class="em-history-status" style="color: ${PREP_COLORS[status]}">${status}</div>
                            ${noteHtml}
                            ${timeHtml}
                        </div>
                    </div>`;
            });
            historyHtml += '</div>';

            bodyEl.innerHTML = historyHtml;

            const modal = document.getElementById('em-status-modal');
            modal.classList.remove('hidden');
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
        };

        // --- Close Vendor Status Modal ---
        window.closeVendorStatusModal = function () {
            const modal = document.getElementById('em-status-modal');
            modal.classList.add('hidden');
            setTimeout(() => { modal.style.display = 'none'; }, 300);
        };

        // Status modal backdrop close
        const statusModal = document.getElementById('em-status-modal');
        if (statusModal) {
            statusModal.addEventListener('click', (e) => {
                if (e.target === statusModal) closeVendorStatusModal();
            });
        }

        // --- Render Conversations ---
        function renderEventManageConversations(eventId) {
            const evVendors = getEventVendors().filter(v => v.eventId === eventId);
            const allVendors = getVendors();
            const allMessages = getMessages();
            const convEl = document.getElementById('em-vendor-conversations');

            if (evVendors.length === 0) {
                convEl.innerHTML = '<div class="em-empty-state"><i class="fa-solid fa-comments"></i><p>No vendor conversations yet.</p></div>';
                return;
            }

            convEl.innerHTML = evVendors.map(ev => {
                const vendor = allVendors.find(v => v.id === ev.vendorId) || { name: 'Unknown', category: 'N/A', image: 'fa-store' };
                const msgs = allMessages.filter(m => m.eventId === eventId && m.vendorId === ev.vendorId).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : null;
                const lastMsgText = lastMsg ? (lastMsg.sender === 'organizer' ? 'You: ' : '') + lastMsg.text : 'No messages yet';
                const lastTime = lastMsg ? new Date(lastMsg.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
                const msgCount = msgs.filter(m => m.sender === 'vendor').length;

                return `
                    <div class="em-conversation-item" onclick="openVendorChat('${eventId}', '${ev.vendorId}')">
                        <div class="em-conv-avatar"><i class="fa-solid ${vendor.image || 'fa-store'}"></i></div>
                        <div class="em-conv-info">
                            <h4>${vendor.name}</h4>
                            <p>${lastMsgText}</p>
                        </div>
                        <div class="em-conv-meta">
                            <span class="em-conv-time">${lastTime}</span>
                            ${msgCount > 0 ? '<span class="em-conv-count">' + msgCount + '</span>' : ''}
                        </div>
                    </div>`;
            }).join('');
        }

        // --- Vendor Chat ---
        let currentChatVendorId = null;
        let currentChatEventId = null;

        window.openVendorChat = function (eventId, vendorId) {
            currentChatEventId = eventId;
            currentChatVendorId = vendorId;
            const vendor = getVendors().find(v => v.id === vendorId) || { name: 'Unknown', category: 'N/A', image: 'fa-store' };

            document.getElementById('em-chat-vendor-name').textContent = vendor.name;
            document.getElementById('em-chat-vendor-cat').textContent = vendor.category;

            renderChatMessages(eventId, vendorId);

            const modal = document.getElementById('em-chat-modal');
            modal.classList.remove('hidden');
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
        };

        window.closeVendorChat = function () {
            const modal = document.getElementById('em-chat-modal');
            modal.classList.add('hidden');
            setTimeout(() => { modal.style.display = 'none'; }, 300);
            // Refresh conversations list
            if (currentManagedEventId) renderEventManageConversations(currentManagedEventId);
        };

        function renderChatMessages(eventId, vendorId) {
            const msgs = getMessages().filter(m => m.eventId === eventId && m.vendorId === vendorId).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            const body = document.getElementById('em-chat-body');

            if (msgs.length === 0) {
                body.innerHTML = '<div class="em-empty-state" style="margin:auto;"><i class="fa-solid fa-comments"></i><p>No messages yet. Start the conversation!</p></div>';
            } else {
                body.innerHTML = msgs.map(m => {
                    const cls = m.sender === 'organizer' ? 'sent' : 'received';
                    const time = new Date(m.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                    return `<div class="em-chat-msg ${cls}">${m.text}<span class="em-chat-msg-time">${time}</span></div>`;
                }).join('');
            }

            // Auto-scroll to bottom
            setTimeout(() => { body.scrollTop = body.scrollHeight; }, 50);
        }

        // Send Chat Message
        const chatSendBtn = document.getElementById('em-chat-send-btn');
        const chatInput = document.getElementById('em-chat-input');
        if (chatSendBtn && chatInput) {
            function sendChatMessage() {
                const text = chatInput.value.trim();
                if (!text || !currentChatEventId || !currentChatVendorId) return;

                const msgs = getMessages();
                msgs.push({
                    id: 'msg_' + Date.now(),
                    eventId: currentChatEventId,
                    vendorId: currentChatVendorId,
                    sender: 'organizer',
                    text: text,
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem(MESSAGES_KEY, JSON.stringify(msgs));
                chatInput.value = '';
                renderChatMessages(currentChatEventId, currentChatVendorId);
            }

            chatSendBtn.addEventListener('click', sendChatMessage);
            chatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') { e.preventDefault(); sendChatMessage(); }
            });
        }

        // Chat modal backdrop close
        const chatModal = document.getElementById('em-chat-modal');
        if (chatModal) {
            chatModal.addEventListener('click', (e) => {
                if (e.target === chatModal) closeVendorChat();
            });
        }

        // --- Broadcasts ---
        function renderEventManageBroadcasts(eventId) {
            const broadcasts = getBroadcasts().filter(b => b.eventId === eventId).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            const listEl = document.getElementById('em-broadcasts-list');

            if (broadcasts.length === 0) {
                listEl.innerHTML = '<div class="em-empty-state"><i class="fa-solid fa-bullhorn"></i><p>No broadcasts sent yet.</p></div>';
                return;
            }

            listEl.innerHTML = broadcasts.map(b => {
                const time = new Date(b.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                return `
                    <div class="em-broadcast-item">
                        <div class="em-broadcast-item-header">
                            <span><i class="fa-solid fa-bullhorn"></i> Broadcast</span>
                            <span><i class="fa-regular fa-clock"></i> ${time}</span>
                        </div>
                        <p>${b.message}</p>
                    </div>`;
            }).join('');
        }

        // Send Broadcast
        const broadcastSendBtn = document.getElementById('em-send-broadcast-btn');
        const broadcastTextarea = document.getElementById('em-broadcast-text');
        if (broadcastSendBtn && broadcastTextarea) {
            broadcastSendBtn.addEventListener('click', () => {
                const msg = broadcastTextarea.value.trim();
                if (!msg || !currentManagedEventId) return;

                const broadcasts = getBroadcasts();
                broadcasts.push({
                    id: 'bc_' + Date.now(),
                    eventId: currentManagedEventId,
                    message: msg,
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem(BROADCASTS_KEY, JSON.stringify(broadcasts));
                broadcastTextarea.value = '';
                renderEventManageBroadcasts(currentManagedEventId);
                showToast('Broadcast sent to all attendees!');
            });
        }

        // --- Manage button handler in events list ---
        document.addEventListener('click', (e) => {
            const manageBtn = e.target.closest('.manage-btn');
            if (manageBtn) {
                const eventId = manageBtn.dataset.id;
                if (eventId) openEventManage(eventId);
            }
        });
    }


});
