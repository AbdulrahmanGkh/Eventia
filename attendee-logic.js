/**
 * ATTENDEE PAGE LOGIC
 * Handles all FR3.0 features: Browse, Register, Tickets, Profile, History, Feedback
 */

const SAR_ICON = '<img src="assets/sar_symbol.svg" class="sar-icon" alt="SAR">';

(function () {
    const EVENTS_DB = 'eventia_events_db';
    const REGISTRATIONS_DB = 'eventia_registrations_db';
    const PROFILE_DB = 'eventia_attendee_profile';

    // --- DATA ACCESS ---
    function getEvents() {
        return JSON.parse(localStorage.getItem(EVENTS_DB)) || [];
    }

    function getRegistrations() {
        return JSON.parse(localStorage.getItem(REGISTRATIONS_DB)) || [];
    }

    function saveRegistrations(regs) {
        localStorage.setItem(REGISTRATIONS_DB, JSON.stringify(regs));
    }

    function getProfile() {
        return JSON.parse(localStorage.getItem(PROFILE_DB)) || {
            firstName: 'Ahmed',
            lastName: 'Al-Rashid',
            email: 'ahmed@example.com',
            phone: '+966 55 123 4567',
            jobTitle: '',
            avatar: null
        };
    }

    function saveProfile(profile) {
        localStorage.setItem(PROFILE_DB, JSON.stringify(profile));
    }

    // --- SEED ATTENDEE DATA ---
    function seedAttendeeData() {
        // TEMPORARY: Clear registrations to force the update for testing
        localStorage.removeItem(REGISTRATIONS_DB);

        if (!localStorage.getItem(REGISTRATIONS_DB)) {
            const events = getEvents();
            const dummyRegs = [];

            // Register for some past and upcoming events
            events.forEach(evt => {
                // Commented out 3 existing dummy examples to allow checking the buying flow
                /* 
                if (evt.id === '101') {
                    dummyRegs.push({
                        id: 'reg_' + evt.id,
                        eventId: evt.id,
                        ticketType: 'VIP',
                        ticketPrice: '599',
                        registeredDate: '2025-12-20',
                        ticketCode: 'EVT-101-VIP-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
                        attended: true,
                        rating: 4,
                        feedback: 'Great event! Loved the AI showcase.',
                        feedbackDate: '2026-01-02'
                    });
                }
                */
                if (evt.id === '105') {
                    dummyRegs.push({
                        id: 'reg_' + evt.id,
                        eventId: evt.id,
                        ticketType: 'Standard',
                        ticketPrice: '100',
                        registeredDate: '2025-11-15',
                        ticketCode: 'EVT-105-STD-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
                        attended: true,
                        rating: 5,
                        feedback: 'Excellent conference! Very informative sessions.',
                        feedbackDate: '2025-12-05'
                    });
                }
                /*
                if (evt.id === '103') {
                    dummyRegs.push({
                        id: 'reg_' + evt.id,
                        eventId: evt.id,
                        ticketType: 'Executive',
                        ticketPrice: '750',
                        registeredDate: '2026-01-28',
                        ticketCode: 'EVT-103-EXE-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
                        attended: false,
                        rating: null,
                        feedback: null,
                        feedbackDate: null
                    });
                }
                */
                if (evt.id === '106') {
                    dummyRegs.push({
                        id: 'reg_' + evt.id,
                        eventId: evt.id,
                        ticketType: 'Participant',
                        ticketPrice: '50',
                        registeredDate: '2026-02-01',
                        ticketCode: 'EVT-106-PRT-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
                        attended: false,
                        rating: null,
                        feedback: null,
                        feedbackDate: null
                    });
                }
            });
            saveRegistrations(dummyRegs);
        }
    }

    // --- GRADIENT MAP ---
    const categoryGradients = {
        'Tech': 'linear-gradient(135deg, #0052D4, #4364F7, #6FB1FC)',
        'Art': 'linear-gradient(135deg, #8E2DE2, #4A00E0)',
        'Business': 'linear-gradient(135deg, #0F2027, #203A43, #2C5364)',
        'Music': 'linear-gradient(135deg, #eb3349, #f45c43)',
        'Education': 'linear-gradient(135deg, #11998e, #38ef7d)',
        'Sports': 'linear-gradient(135deg, #fc4a1a, #f7b733)',
        'Other': 'linear-gradient(135deg, #636363, #a2ab58)'
    };

    const categoryIcons = {
        'Tech': 'fa-laptop-code',
        'Art': 'fa-palette',
        'Business': 'fa-briefcase',
        'Music': 'fa-music',
        'Education': 'fa-graduation-cap',
        'Sports': 'fa-futbol',
        'Other': 'fa-calendar'
    };

    // --- RENDER BROWSE EVENTS ---
    function renderBrowseEvents() {
        const events = getEvents();
        const registrations = getRegistrations();
        const grid = document.getElementById('landing-events-grid');
        if (!grid) return;

        const searchVal = (document.getElementById('landing-search')?.value || '').toLowerCase();
        const locVal = document.getElementById('landing-location-filter')?.value || 'all';
        const catVal = document.querySelector('.cat-pill.active')?.dataset.category || 'all';

        // Only show upcoming/ongoing events
        let filtered = events.filter(e => {
            if (e.status === 'Rejected' || e.status === 'Pending') return false;
            const matchesCat = catVal === 'all' || e.category === catVal;
            const matchesLoc = locVal === 'all' || (e.location && e.location.includes(locVal));
            const matchesSearch = !searchVal ||
                e.title.toLowerCase().includes(searchVal) ||
                (e.description && e.description.toLowerCase().includes(searchVal)) ||
                (e.location && e.location.toLowerCase().includes(searchVal));
            return matchesCat && matchesLoc && matchesSearch;
        });

        if (filtered.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem; color: #888;">
                <i class="fa-regular fa-calendar-xmark" style="font-size: 3rem; margin-bottom: 1rem; display: block; color: #ccc;"></i>
                <h3 style="margin: 0 0 0.5rem; color: #555;">No events found</h3>
                <p style="margin: 0;">Try adjusting your search or filters.</p>
            </div>`;
            return;
        }

        grid.innerHTML = filtered.map(evt => {
            const gradient = categoryGradients[evt.category] || categoryGradients['Other'];
            const icon = categoryIcons[evt.category] || 'fa-calendar';
            const isRegistered = registrations.some(r => r.eventId === evt.id && r.status !== 'Withdrawn');
            const priceDisplay = evt.price && parseInt(evt.price) > 0 ? `From ${evt.price} ${SAR_ICON}` : 'Free';

            const eventDate = new Date(evt.date);
            const dateFormatted = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            return `
                <div class="lp-event-card reveal-on-scroll revealed" data-category="${evt.category}">
                    <div class="lp-card-image" style="background: ${gradient};">
                        <i class="fa-solid ${icon}"></i>
                        <div class="lp-card-badge">${evt.category || 'Event'}</div>
                        <div class="lp-card-price">${priceDisplay}</div>
                    </div>
                    <div class="lp-card-body">
                        <h3 class="lp-card-title">${evt.title}</h3>
                        <div class="lp-card-meta">
                            <span><i class="fa-regular fa-calendar"></i> ${dateFormatted}</span>
                            <span><i class="fa-solid fa-location-dot"></i> ${evt.location || 'TBD'}</span>
                        </div>
                        <p class="lp-card-desc">${(evt.description || '').substring(0, 100)}${evt.description && evt.description.length > 100 ? '...' : ''}</p>
                        <div class="lp-card-footer" style="display: flex; gap: 0.5rem;">
                            <button class="btn btn-primary btn-sm lp-view-btn" onclick="viewEventDetails('${evt.id}')">View Details</button>
                            ${isRegistered
                    ? `<button class="btn btn-sm" style="background: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9; cursor: default;" disabled><i class="fa-solid fa-check"></i> Registered</button>`
                    : `<button class="btn btn-sm" style="background: #e3f2fd; color: #1565c0; border: 1px solid #bbdefb;" onclick="openRegisterModal('${evt.id}')"><i class="fa-solid fa-ticket"></i> Register</button>`
                }
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // --- VIEW EVENT DETAILS MODAL ---
    window.viewEventDetails = function (eventId) {
        const events = getEvents();
        const evt = events.find(e => e.id === eventId);
        if (!evt) return;

        const existing = document.getElementById('event-detail-modal');
        if (existing) existing.remove();

        const registrations = getRegistrations();
        const isRegistered = registrations.some(r => r.eventId === evt.id && r.status !== 'Withdrawn');

        let ticketInfo = '<div style="color: #2e7d32; font-weight: 600;"><i class="fa-solid fa-ticket" style="margin-right: 6px;"></i>Free Event</div>';
        if (evt.price && parseInt(evt.price) > 0) {
            if (evt.tickets && evt.tickets.length > 0) {
                ticketInfo = evt.tickets.map(t =>
                    `<div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                        <span>${t.name}</span><strong>${t.price} ${SAR_ICON}</strong>
                    </div>`
                ).join('');
            } else {
                ticketInfo = `<div style="color: #1976d2; font-weight: 600;"><i class="fa-solid fa-ticket" style="margin-right: 6px;"></i>${evt.price} ${SAR_ICON}</div>`;
            }
        }

        let actionBtn = isRegistered
            ? `<button style="flex: 1; padding: 12px; background: #e8f5e9; color: #2e7d32; border: none; border-radius: 8px; font-weight: 600; font-size: 0.9rem;" disabled><i class="fa-solid fa-check-circle"></i> Already Registered</button>`
            : `<button onclick="document.getElementById('event-detail-modal').remove(); openRegisterModal('${evt.id}')" style="flex: 1; padding: 12px; background: #004e92; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 0.9rem;"><i class="fa-solid fa-ticket"></i> Register Now</button>`;

        const modal = document.createElement('div');
        modal.id = 'event-detail-modal';
        modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(3px);" onclick="if(event.target === this) this.parentElement.remove()">
                <div style="background: white; border-radius: 16px; width: 90%; max-width: 520px; max-height: 85vh; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                    <div style="background: linear-gradient(135deg, #3C50C8, #004e92); color: white; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center;">
                        <h2 style="margin: 0; font-size: 1.2rem; font-weight: 600;"><i class="fa-solid fa-file-lines" style="margin-right: 8px;"></i>Event Details</h2>
                        <button onclick="document.getElementById('event-detail-modal').remove()" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 1rem;"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div style="padding: 1.5rem; max-height: 55vh; overflow-y: auto;">
                        <div style="margin-bottom: 1.25rem;">
                            <h3 style="margin: 0 0 8px 0; font-size: 1.4rem; color: #222;">${evt.title}</h3>
                            <span style="display: inline-block; background: #e8f0fe; color: #1a73e8; padding: 4px 12px; border-radius: 16px; font-size: 0.8rem; font-weight: 500;">${evt.category || 'Event'}</span>
                        </div>
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
                        <div style="margin-bottom: 1.25rem;">
                            <div style="font-size: 0.8rem; color: #5f6368; text-transform: uppercase; font-weight: 600; margin-bottom: 8px;">DESCRIPTION</div>
                            <p style="margin: 0; line-height: 1.6; color: #333;">${evt.description || 'No description.'}</p>
                        </div>
                        <div>
                            <div style="font-size: 0.8rem; color: #5f6368; text-transform: uppercase; font-weight: 600; margin-bottom: 8px;">TICKETS & PRICING</div>
                            ${ticketInfo}
                        </div>
                    </div>
                    <div style="display: flex; gap: 12px; padding: 1rem 1.5rem; border-top: 1px solid #e5e7eb;">
                        ${actionBtn}
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    };

    // ==========================================================================
    // --- MULTI-STEP REGISTRATION + PAYMENT FLOW ---
    // ==========================================================================

    window.openRegisterModal = function (eventId) {
        const events = getEvents();
        const evt = events.find(e => e.id === eventId);
        if (!evt) return;

        // Check duplicate
        const regs = getRegistrations();
        if (regs.some(r => r.eventId === eventId)) {
            showToast('You are already registered for this event.');
            return;
        }

        const existing = document.getElementById('register-modal');
        if (existing) existing.remove();

        let ticketOptions = '<option value="Standard|0">Standard - Free</option>';
        if (evt.tickets && evt.tickets.length > 0) {
            ticketOptions = evt.tickets.map(t =>
                `<option value="${t.name}|${t.price}">${t.name} - ${parseInt(t.price) > 0 ? t.price + ' ' + SAR_ICON : 'Free'}</option>`
            ).join('');
        }

        const isFree = !evt.price || parseInt(evt.price) === 0;
        const basePrice = evt.tickets && evt.tickets.length > 0 ? parseInt(evt.tickets[0].price) : (parseInt(evt.price) || 0);

        const modal = document.createElement('div');
        modal.id = 'register-modal';
        modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.55); z-index: 1000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(4px);" onclick="if(event.target === this) document.getElementById('register-modal').remove()">
                <div style="background: white; border-radius: 20px; width: 92%; max-width: 500px; overflow: hidden; box-shadow: 0 24px 70px rgba(0,0,0,0.35); animation: modalSlideIn 0.3s ease;">

                    <!-- STEP INDICATOR -->
                    <div id="reg-step-indicator" style="background: linear-gradient(135deg, #004e92, #4dabf7); padding: 1.75rem 2rem 1.25rem;">
                        <div style="display: flex; justify-content: center; gap: 0.5rem; margin-bottom: 1rem;">
                            <div class="reg-step-dot active" id="sdot-1" style="width:10px;height:10px;border-radius:50%;background:white;transition:all 0.3s;"></div>
                            <div class="reg-step-dot" id="sdot-2" style="width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,0.4);transition:all 0.3s;"></div>
                            <div class="reg-step-dot" id="sdot-3" style="width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,0.4);transition:all 0.3s;"></div>
                        </div>
                        <div style="text-align:center;">
                            <div style="width:56px;height:56px;background:rgba(255,255,255,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 0.75rem;">
                                <i id="reg-header-icon" class="fa-solid fa-ticket" style="font-size:1.5rem;color:white;"></i>
                            </div>
                            <h3 id="reg-header-title" style="color:white;font-size:1.15rem;margin:0;font-weight:700;">Select Your Ticket</h3>
                            <p style="color:rgba(255,255,255,0.85);margin:0.4rem 0 0;font-size:0.85rem;">${evt.title}</p>
                        </div>
                    </div>

                    <!-- STEP 1: TICKET SELECTION -->
                    <div id="reg-step-1" style="padding: 1.75rem 2rem;">
                        <div style="margin-bottom: 1.25rem;">
                            <label style="display:block;font-weight:600;color:#333;margin-bottom:0.5rem;font-size:0.9rem;"><i class="fa-solid fa-tag" style="margin-right:6px;color:#004e92;"></i>Select Ticket Type</label>
                            <select id="reg-ticket-select" onchange="regUpdatePrice()" style="width:100%;padding:12px 14px;border:2px solid #e0e0e0;border-radius:10px;font-size:0.95rem;outline:none;transition:border-color 0.2s;cursor:pointer;" onfocus="this.style.borderColor='#004e92'" onblur="this.style.borderColor='#e0e0e0'">
                                ${ticketOptions}
                            </select>
                        </div>
                        <div id="reg-price-summary" style="background:#f0f7ff;border:1px solid #bbdefb;border-radius:12px;padding:1rem;margin-bottom:1.25rem;">
                            <div style="display:flex;justify-content:space-between;align-items:center;">
                                <span style="color:#555;font-size:0.9rem;">Ticket Price</span>
                                <span id="reg-price-display" style="font-size:1.1rem;font-weight:700;color:#004e92;">${basePrice > 0 ? basePrice + ' ' + SAR_ICON : 'Free'}</span>
                            </div>
                        </div>
                        <div style="display:flex;gap:0.75rem;">
                            <button onclick="document.getElementById('register-modal').remove()" style="flex:1;padding:12px;background:white;color:#555;border:2px solid #e0e0e0;border-radius:10px;font-weight:600;cursor:pointer;font-size:0.9rem;">Cancel</button>
                            <button onclick="regGoToStep2('${evt.id}')" style="flex:1;padding:12px;background:linear-gradient(135deg,#004e92,#4dabf7);color:white;border:none;border-radius:10px;font-weight:700;cursor:pointer;font-size:0.9rem;"><i class="fa-solid fa-arrow-right" style="margin-right:6px;"></i>Continue</button>
                        </div>
                    </div>

                    <!-- STEP 2: PAYMENT -->
                    <div id="reg-step-2" style="padding:1.75rem 2rem;display:none;">
                        <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:0.75rem 1rem;margin-bottom:1.25rem;display:flex;align-items:center;gap:0.5rem;">
                            <i class="fa-solid fa-shield-halved" style="color:#f59e0b;font-size:1rem;"></i>
                            <span style="font-size:0.8rem;color:#78350f;font-weight:500;">Demo payment — no real charge will be made</span>
                        </div>

                        <!-- Payment Method Tabs -->
                        <div style="display:flex;gap:0.5rem;margin-bottom:1.25rem;">
                            <button onclick="regSelectPayMethod(this,'card')" class="pay-method-btn active" style="flex:1;padding:10px 8px;border:2px solid #004e92;border-radius:10px;background:#e8f0fe;color:#004e92;font-weight:600;cursor:pointer;font-size:0.82rem;display:flex;flex-direction:column;align-items:center;gap:4px;">
                                <i class="fa-solid fa-credit-card" style="font-size:1.1rem;"></i> Credit Card
                            </button>
                            <button onclick="regSelectPayMethod(this,'mada')" class="pay-method-btn" style="flex:1;padding:10px 8px;border:2px solid #e0e0e0;border-radius:10px;background:white;color:#555;font-weight:600;cursor:pointer;font-size:0.82rem;display:flex;flex-direction:column;align-items:center;gap:4px;">
                                <i class="fa-solid fa-wallet" style="font-size:1.1rem;"></i> Mada
                            </button>
                            <button onclick="regSelectPayMethod(this,'apple')" class="pay-method-btn" style="flex:1;padding:10px 8px;border:2px solid #e0e0e0;border-radius:10px;background:white;color:#555;font-weight:600;cursor:pointer;font-size:0.82rem;display:flex;flex-direction:column;align-items:center;gap:4px;">
                                <i class="fa-brands fa-apple-pay" style="font-size:1.1rem;"></i> Apple Pay
                            </button>
                        </div>

                        <!-- Card Form -->
                        <div id="pay-card-form">
                            <div style="margin-bottom:1rem;">
                                <label style="display:block;font-size:0.82rem;font-weight:600;color:#444;margin-bottom:0.35rem;">CARDHOLDER NAME</label>
                                <input id="pay-name" type="text" placeholder="Ahmed Al-Rashid" value="Ahmed Al-Rashid" style="width:100%;padding:11px 14px;border:2px solid #e0e0e0;border-radius:10px;font-size:0.9rem;outline:none;box-sizing:border-box;" onfocus="this.style.borderColor='#004e92'" onblur="this.style.borderColor='#e0e0e0'">
                            </div>
                            <div style="margin-bottom:1rem;">
                                <label style="display:block;font-size:0.82rem;font-weight:600;color:#444;margin-bottom:0.35rem;">CARD NUMBER</label>
                                <div style="position:relative;">
                                    <input id="pay-card" type="text" placeholder="4242 4242 4242 4242" maxlength="19" oninput="regFormatCard(this)" style="width:100%;padding:11px 14px;border:2px solid #e0e0e0;border-radius:10px;font-size:0.9rem;outline:none;box-sizing:border-box;letter-spacing:1px;" onfocus="this.style.borderColor='#004e92'" onblur="this.style.borderColor='#e0e0e0'">
                                    <i class="fa-brands fa-cc-visa" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);font-size:1.4rem;color:#1a1f71;"></i>
                                </div>
                            </div>
                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1rem;">
                                <div>
                                    <label style="display:block;font-size:0.82rem;font-weight:600;color:#444;margin-bottom:0.35rem;">EXPIRY DATE</label>
                                    <input id="pay-expiry" type="text" placeholder="MM/YY" maxlength="5" oninput="regFormatExpiry(this)" style="width:100%;padding:11px 14px;border:2px solid #e0e0e0;border-radius:10px;font-size:0.9rem;outline:none;box-sizing:border-box;" onfocus="this.style.borderColor='#004e92'" onblur="this.style.borderColor='#e0e0e0'">
                                </div>
                                <div>
                                    <label style="display:block;font-size:0.82rem;font-weight:600;color:#444;margin-bottom:0.35rem;">CVV</label>
                                    <input id="pay-cvv" type="text" placeholder="123" maxlength="3" style="width:100%;padding:11px 14px;border:2px solid #e0e0e0;border-radius:10px;font-size:0.9rem;outline:none;box-sizing:border-box;" onfocus="this.style.borderColor='#004e92'" onblur="this.style.borderColor='#e0e0e0'">
                                </div>
                            </div>
                        </div>

                        <!-- Order Summary -->
                        <div id="reg-order-summary" style="background:#f8f9fa;border-radius:10px;padding:0.9rem 1rem;margin-bottom:1.25rem;">
                            <div style="display:flex;justify-content:space-between;font-size:0.85rem;color:#666;margin-bottom:6px;"><span id="pay-summary-ticket">Ticket</span><span id="pay-summary-price">0 SAR</span></div>
                            <div style="display:flex;justify-content:space-between;font-size:0.85rem;color:#666;margin-bottom:6px;"><span>Service fee</span><span>0 SAR</span></div>
                            <div style="height:1px;background:#e0e0e0;margin:8px 0;"></div>
                            <div style="display:flex;justify-content:space-between;font-weight:700;color:#222;"><span>Total</span><span id="pay-summary-total">0 SAR</span></div>
                        </div>

                        <div style="display:flex;gap:0.75rem;">
                            <button onclick="regGoToStep1()" style="padding:12px 16px;background:white;color:#555;border:2px solid #e0e0e0;border-radius:10px;font-weight:600;cursor:pointer;font-size:0.9rem;"><i class="fa-solid fa-arrow-left"></i></button>
                            <button onclick="regProcessPayment('${evt.id}')" style="flex:1;padding:12px;background:linear-gradient(135deg,#16a34a,#22c55e);color:white;border:none;border-radius:10px;font-weight:700;cursor:pointer;font-size:0.9rem;"><i class="fa-solid fa-lock" style="margin-right:6px;"></i>Pay & Confirm</button>
                        </div>
                    </div>

                    <!-- STEP 3: PROCESSING -->
                    <div id="reg-step-3" style="padding:3rem 2rem;text-align:center;display:none;">
                        <div style="width:80px;height:80px;border:6px solid #e8f0fe;border-top-color:#004e92;border-radius:50%;animation:regSpin 0.9s linear infinite;margin:0 auto 1.5rem;"></div>
                        <h3 style="margin:0 0 0.5rem;color:#222;font-size:1.15rem;">Processing Payment...</h3>
                        <p style="margin:0;color:#888;font-size:0.9rem;">Please wait while we confirm your booking</p>
                    </div>

                    <!-- STEP 4: SUCCESS -->
                    <div id="reg-step-4" style="padding:1.75rem 2rem;display:none;">
                        <div style="text-align:center;margin-bottom:1.5rem;">
                            <div style="width:72px;height:72px;background:#dcfce7;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;">
                                <i class="fa-solid fa-circle-check" style="font-size:2rem;color:#16a34a;"></i>
                            </div>
                            <h3 style="margin:0 0 0.5rem;color:#166534;font-size:1.2rem;">Payment Successful!</h3>
                            <p style="margin:0;color:#555;font-size:0.85rem;">Your ticket has been confirmed</p>
                        </div>

                        <!-- Ticket Card -->
                        <div id="reg-receipt-card" style="background:linear-gradient(135deg,#004e92,#4dabf7);border-radius:16px;padding:1.5rem;margin-bottom:1.25rem;color:white;">
                            <div style="font-size:0.75rem;opacity:0.8;text-transform:uppercase;letter-spacing:1px;margin-bottom:0.4rem;">Event</div>
                            <div id="rc-event-title" style="font-size:1rem;font-weight:700;margin-bottom:1rem;">${evt.title}</div>
                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1rem;">
                                <div><div style="font-size:0.7rem;opacity:0.75;margin-bottom:2px;">DATE</div><div id="rc-date" style="font-weight:600;font-size:0.85rem;">${evt.date}</div></div>
                                <div><div style="font-size:0.7rem;opacity:0.75;margin-bottom:2px;">TIME</div><div style="font-weight:600;font-size:0.85rem;">${evt.time || 'TBD'}</div></div>
                                <div><div style="font-size:0.7rem;opacity:0.75;margin-bottom:2px;">TICKET TYPE</div><div id="rc-ticket-type" style="font-weight:600;font-size:0.85rem;"></div></div>
                                <div><div style="font-size:0.7rem;opacity:0.75;margin-bottom:2px;">AMOUNT PAID</div><div id="rc-amount" style="font-weight:600;font-size:0.85rem;"></div></div>
                            </div>
                            <div style="border-top:1px dashed rgba(255,255,255,0.4);padding-top:0.75rem;">
                                <div style="font-size:0.7rem;opacity:0.75;margin-bottom:4px;">TICKET CODE</div>
                                <div id="rc-code" style="font-family:monospace;font-size:0.9rem;font-weight:700;letter-spacing:1.5px;"></div>
                            </div>
                        </div>

                        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:0.75rem 1rem;margin-bottom:1.25rem;">
                            <p style="margin:0;font-size:0.8rem;color:#166534;line-height:1.6;">
                                <i class="fa-solid fa-ticket" style="margin-right:6px;"></i>
                                Your ticket is ready! Head to the <strong>My Tickets</strong> tab to view your digital ticket and badge.
                            </p>
                        </div>
                        <button onclick="document.getElementById('register-modal').remove()" style="width:100%;padding:13px;background:linear-gradient(135deg,#004e92,#4dabf7);color:white;border:none;border-radius:10px;font-weight:700;cursor:pointer;font-size:0.95rem;"><i class="fa-solid fa-check" style="margin-right:8px;"></i>Done</button>
                    </div>

                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Inject spinner keyframe if needed
        if (!document.getElementById('reg-pay-styles')) {
            const s = document.createElement('style');
            s.id = 'reg-pay-styles';
            s.textContent = `
                @keyframes regSpin { to { transform: rotate(360deg); } }
                .pay-method-btn { transition: all 0.2s; }
            `;
            document.head.appendChild(s);
        }

        // Initialize price display
        regUpdatePrice();
    };

    // --- Payment helper functions ---
    window.regUpdatePrice = function () {
        const sel = document.getElementById('reg-ticket-select');
        const priceEl = document.getElementById('reg-price-display');
        const summaryTicket = document.getElementById('pay-summary-ticket');
        const summaryPrice = document.getElementById('pay-summary-price');
        const summaryTotal = document.getElementById('pay-summary-total');
        if (!sel) return;
        const [name, price] = sel.value.split('|');
        const p = parseInt(price) || 0;
        if (priceEl) priceEl.innerHTML = p > 0 ? p + ' ' + SAR_ICON : 'Free';
        if (summaryTicket) summaryTicket.textContent = name + ' ticket';
        if (summaryPrice) summaryPrice.innerHTML = p > 0 ? p + ' ' + SAR_ICON : 'Free';
        if (summaryTotal) summaryTotal.innerHTML = p > 0 ? p + ' ' + SAR_ICON : 'Free';
    };

    window.regFormatCard = function (input) {
        let v = input.value.replace(/\D/g, '');
        v = v.match(/.{1,4}/g)?.join(' ') || v;
        input.value = v;
    };

    window.regFormatExpiry = function (input) {
        let v = input.value.replace(/\D/g, '');
        if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2);
        input.value = v;
    };

    window.regSelectPayMethod = function (btn, method) {
        document.querySelectorAll('.pay-method-btn').forEach(b => {
            b.style.border = '2px solid #e0e0e0';
            b.style.background = 'white';
            b.style.color = '#555';
        });
        btn.style.border = '2px solid #004e92';
        btn.style.background = '#e8f0fe';
        btn.style.color = '#004e92';
        const cardForm = document.getElementById('pay-card-form');
        if (cardForm) cardForm.style.display = method === 'card' ? 'block' : 'none';
    };

    window.regGoToStep2 = function (eventId) {
        document.getElementById('reg-step-1').style.display = 'none';
        document.getElementById('reg-step-2').style.display = 'block';
        document.getElementById('sdot-1').style.background = 'rgba(255,255,255,0.5)';
        document.getElementById('sdot-2').style.background = 'white';
        document.getElementById('reg-header-icon').className = 'fa-solid fa-credit-card';
        document.getElementById('reg-header-title').textContent = 'Payment Details';
        // Update order summary price
        regUpdatePrice();
    };

    window.regGoToStep1 = function () {
        document.getElementById('reg-step-2').style.display = 'none';
        document.getElementById('reg-step-1').style.display = 'block';
        document.getElementById('sdot-2').style.background = 'rgba(255,255,255,0.4)';
        document.getElementById('sdot-1').style.background = 'white';
        document.getElementById('reg-header-icon').className = 'fa-solid fa-ticket';
        document.getElementById('reg-header-title').textContent = 'Select Your Ticket';
    };

    window.regProcessPayment = function (eventId) {
        // Show processing spinner
        document.getElementById('reg-step-2').style.display = 'none';
        document.getElementById('reg-step-3').style.display = 'block';
        document.getElementById('sdot-2').style.background = 'rgba(255,255,255,0.5)';
        document.getElementById('sdot-3').style.background = 'white';
        document.getElementById('reg-header-icon').className = 'fa-solid fa-shield-halved';
        document.getElementById('reg-header-title').textContent = 'Securing Payment...';

        setTimeout(() => {
            // Get ticket details
            const sel = document.getElementById('reg-ticket-select');
            const [ticketName, ticketPrice] = (sel ? sel.value : 'Standard|0').split('|');
            const ticketCode = 'EVT-' + eventId + '-' + ticketName.substring(0, 3).toUpperCase() + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();

            // Save registration
            const newReg = {
                id: 'reg_' + eventId,
                eventId: eventId,
                ticketType: ticketName,
                ticketPrice: ticketPrice,
                registeredDate: new Date().toISOString().split('T')[0],
                ticketCode: ticketCode,
                attended: false,
                rating: null,
                feedback: null,
                feedbackDate: null
            };
            const regs = getRegistrations();
            regs.push(newReg);
            saveRegistrations(regs);

            // Populate receipt
            const rcCode = document.getElementById('rc-code');
            const rcType = document.getElementById('rc-ticket-type');
            const rcAmount = document.getElementById('rc-amount');
            const p = parseInt(ticketPrice) || 0;
            if (rcCode) rcCode.textContent = ticketCode;
            if (rcType) rcType.textContent = ticketName;
            if (rcAmount) rcAmount.innerHTML = p > 0 ? p + ' ' + SAR_ICON : 'Free';

            // Show success
            document.getElementById('reg-step-3').style.display = 'none';
            document.getElementById('reg-step-4').style.display = 'block';
            document.getElementById('reg-header-icon').className = 'fa-solid fa-circle-check';
            document.getElementById('reg-header-title').textContent = 'Booking Confirmed!';

            renderAll();
        }, 2200);
    };

    window.switchAttendeeViewPublic = function (view) {
        document.querySelectorAll('.attendee-view').forEach(v => v.style.display = 'none');
        const target = document.getElementById('view-' + view);
        if (target) target.style.display = '';
        document.querySelectorAll('.nav-links .att-nav-link').forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-links .att-nav-link[data-view="${view}"]`);
        if (activeLink) activeLink.classList.add('active');
        renderAll();
        if (view === 'notifications') renderNotifList();
        const _navPanel = document.getElementById('att-nav-links');
        const _backdrop = document.getElementById('att-mobile-backdrop');
        if (_navPanel) _navPanel.classList.remove('open');
        if (_backdrop) _backdrop.classList.remove('active');
        document.body.style.overflow = '';
    };

    // --- LEGACY confirmRegistration (kept for safety, now unused) ---
    window.confirmRegistration = function (eventId) {
        const selectEl = document.getElementById('reg-ticket-select');
        if (!selectEl) return;
        const [ticketName, ticketPrice] = selectEl.value.split('|');
        const ticketCode = 'EVT-' + eventId + '-' + ticketName.substring(0, 3).toUpperCase() + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        const newReg = {
            id: 'reg_' + eventId,
            eventId: eventId,
            ticketType: ticketName,
            ticketPrice: ticketPrice,
            registeredDate: new Date().toISOString().split('T')[0],
            ticketCode: ticketCode,
            attended: false,
            rating: null,
            feedback: null,
            feedbackDate: null
        };
        const regs = getRegistrations();
        regs.push(newReg);
        saveRegistrations(regs);
        document.getElementById('register-modal')?.remove();
        showToast('Registration successful! Your ticket: ' + ticketCode);
        renderAll();
    };

    // --- BARCODE HELPERS (uses JsBarcode from CDN) ---
    function renderBarcodeToCanvas(canvasOrId, ticketCode) {
        try {
            if (typeof JsBarcode !== 'undefined') {
                const target = typeof canvasOrId === 'string' && !canvasOrId.startsWith('#')
                    ? '#' + canvasOrId
                    : canvasOrId;
                JsBarcode(target, ticketCode, {
                    format: 'CODE128',
                    width: 2,
                    height: 48,
                    displayValue: true,
                    fontSize: 12,
                    margin: 4
                });
            }
        } catch (e) {
            console.warn('JsBarcode failed:', e);
        }
    }

    // --- SHOW BADGE MODAL (bigger, clearer layout with name, job title, barcode) ---
    window.openBadgeModal = function (regId) {
        const reg = getRegistrations().find(r => r.id === regId);
        if (!reg) return;
        const evt = getEvents().find(e => e.id === reg.eventId);
        if (!evt) return;
        const profile = getProfile();
        const eventDate = new Date(evt.date);
        const dateStr = eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        const gradient = categoryGradients[evt.category] || categoryGradients['Other'];

        const existing = document.getElementById('badge-modal');
        if (existing) existing.remove();

        const fullName = (profile.firstName + ' ' + profile.lastName).trim() || 'Attendee';
        const jobTitle = (profile.jobTitle || '').trim();

        const modal = document.createElement('div');
        modal.id = 'badge-modal';
        modal.className = 'badge-modal-overlay';
        modal.innerHTML = `
            <div class="badge-modal-backdrop" onclick="if(event.target === this) document.getElementById('badge-modal').remove()"></div>
            <div class="badge-modal-box" id="badge-modal-box">
                <div class="badge-modal-header">
                    <h3><i class="fa-solid fa-id-card"></i> Event Badge</h3>
                    <button type="button" class="badge-modal-close" onclick="document.getElementById('badge-modal').remove()" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div class="badge-content badge-content-print" style="background: ${gradient};">
                    <div class="badge-event-name">${evt.title}</div>
                    <div class="badge-event-meta">
                        <span><i class="fa-regular fa-calendar"></i> ${dateStr}</span>
                        <span><i class="fa-regular fa-clock"></i> ${evt.time || 'TBD'}</span>
                        <span><i class="fa-solid fa-location-dot"></i> ${evt.location || 'TBD'}</span>
                    </div>
                    <div class="badge-divider"></div>
                    <div class="badge-name">${fullName}</div>
                    ${jobTitle ? `<div class="badge-job-title">${jobTitle}</div>` : ''}
                    <div class="badge-ticket-type">${reg.ticketType}</div>
                    <div class="badge-barcode-wrap">
                        <canvas id="badge-barcode-canvas-${reg.id}"></canvas>
                    </div>
                    <div class="badge-code-text">${reg.ticketCode}</div>
                </div>
                <div class="badge-modal-actions no-print">
                    <button type="button" class="badge-action-btn badge-action-print" onclick="window.printBadge()"><i class="fa-solid fa-print"></i> Print</button>
                    <a href="#" class="badge-action-btn badge-action-email" id="badge-email-link"><i class="fa-solid fa-envelope"></i> Send to my email</a>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        setTimeout(() => {
            renderBarcodeToCanvas('badge-barcode-canvas-' + reg.id, reg.ticketCode);
        }, 50);

        // Send to email: mailto with pre-filled subject and body
        const email = (profile.email || '').trim();
        const subject = encodeURIComponent('Your event badge – ' + evt.title);
        const body = encodeURIComponent(
            'Hello ' + fullName + ',\n\nYour event badge details for "' + evt.title + '":\n\n' +
            'Date: ' + dateStr + '\nTime: ' + (evt.time || 'TBD') + '\nLocation: ' + (evt.location || 'TBD') + '\nTicket type: ' + reg.ticketType + '\nTicket code: ' + reg.ticketCode + '\n\n— Eventia'
        );
        const emailLink = document.getElementById('badge-email-link');
        if (emailLink) {
            emailLink.href = email ? ('mailto:' + email + '?subject=' + subject + '&body=' + body) : '#';
            emailLink.onclick = function (e) {
                if (!email) {
                    e.preventDefault();
                    showToast('Add your email in Profile to use this option.');
                }
            };
        }
    };

    window.printBadge = function () {
        document.body.classList.add('badge-print-active');
        window.print();
        window.addEventListener('afterprint', function onAfterPrint() {
            document.body.classList.remove('badge-print-active');
            window.removeEventListener('afterprint', onAfterPrint);
        });
    };

    // --- RENDER MY TICKETS ---
    function renderMyTickets() {
        const container = document.getElementById('my-tickets-container');
        if (!container) return;

        const events = getEvents();
        const registrations = getRegistrations();
        const upcomingRegs = registrations.filter(r => {
            if (r.status === 'Withdrawn') return false;
            const evt = events.find(e => e.id === r.eventId);
            return evt && new Date(evt.date) >= new Date();
        });

        if (upcomingRegs.length === 0) {
            container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem; color: #888;">
                <i class="fa-regular fa-ticket" style="font-size: 3rem; margin-bottom: 1rem; display: block; color: #ccc;"></i>
                <h3 style="margin: 0 0 0.5rem; color: #555;">No upcoming tickets</h3>
                <p style="margin: 0;">Browse events above and register to get your digital tickets.</p>
            </div>`;
            return;
        }

        // Attendee withdrawal policy metadata
        const attendeePolicyMeta = {
            'flexible': { label: 'Flexible', color: '#2e7d32', bg: '#e8f5e9', border: '#c8e6c9', desc: 'Full refund available up to 1 day before the event.' },
            'moderate': { label: 'Moderate', color: '#e65100', bg: '#fff3e0', border: '#ffe0b2', desc: 'Full refund available up to 7 days before the event.' },
            'strict': { label: 'Strict', color: '#c62828', bg: '#fbe9e7', border: '#ffccbc', desc: 'Full refund available up to 30 days before the event.' },
            'non-refundable': { label: 'Non-refundable', color: '#b71c1c', bg: '#ffebee', border: '#ffcdd2', desc: 'No refunds allowed once tickets are purchased.' }
        };

        container.innerHTML = upcomingRegs.map(reg => {
            const evt = events.find(e => e.id === reg.eventId);
            if (!evt) return '';

            const eventDate = new Date(evt.date);
            const month = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();
            const day = eventDate.getDate();
            const gradient = categoryGradients[evt.category] || categoryGradients['Other'];
            const barcodeId = 'ticket-barcode-' + reg.id.replace(/[^a-zA-Z0-9-_]/g, '_');



            return `
                <div class="ticket-card">
                    <div class="ticket-card-header ticket-card-header-gradient" style="background: ${gradient};">
                        <div class="ticket-card-header-inner">
                            <div class="ticket-card-category-pill">${evt.category}</div>
                            <h3 class="ticket-card-title">${evt.title}</h3>
                            <div class="ticket-card-meta">
                                <span><i class="fa-regular fa-calendar"></i> ${month} ${day}</span>
                                <span><i class="fa-regular fa-clock"></i> ${evt.time || 'TBD'}</span>
                                <span><i class="fa-solid fa-location-dot"></i> ${evt.location || 'TBD'}</span>
                            </div>
                        </div>
                    </div>
                    <div class="ticket-card-body">
                        <div class="ticket-card-type-row">
                            <span class="ticket-card-type-label">Ticket type</span>
                            <span class="ticket-card-type-value">${reg.ticketType}</span>
                        </div>
                        <div class="ticket-barcode-box">
                            <canvas id="${barcodeId}" class="ticket-barcode-canvas"></canvas>
                        </div>
                        <div style="font-size: 0.75rem; color: #64748b; text-align: center; margin-top: 0.5rem;">Registered: ${reg.registeredDate}</div>
                        <button type="button" class="btn btn-primary btn-sm ticket-show-badge-btn" onclick="openBadgeModal('${reg.id}')" style="width: 100%; margin-top: 1rem;">
                            <i class="fa-solid fa-id-card"></i> Show my badge
                        </button>
                        <button type="button" onclick="openWithdrawModal('${reg.id}', '${evt.id}')" style="width:100%;margin-top:0.5rem;padding:9px;background:white;color:#c62828;border:1.5px solid #ffcdd2;border-radius:8px;font-weight:600;font-size:0.82rem;cursor:pointer;transition:all 0.2s;" onmouseover="this.style.background='#ffebee'" onmouseout="this.style.background='white'">
                            <i class="fa-solid fa-right-from-bracket" style="margin-right:5px;"></i>Withdraw Registration
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Render barcodes after DOM is updated
        upcomingRegs.forEach(reg => {
            const evt = events.find(e => e.id === reg.eventId);
            if (!evt) return;
            const barcodeId = 'ticket-barcode-' + reg.id.replace(/[^a-zA-Z0-9-_]/g, '_');
            const canvas = document.getElementById(barcodeId);
            if (canvas && typeof JsBarcode !== 'undefined') {
                try {
                    JsBarcode(canvas, reg.ticketCode, { format: 'CODE128', width: 1.5, height: 36, displayValue: true, fontSize: 10, margin: 2 });
                } catch (e) { console.warn('JsBarcode failed:', e); }
            }
        });
    }

    // --- RENDER EVENT HISTORY ---
    function renderHistory() {
        const container = document.getElementById('history-container');
        if (!container) return;

        const events = getEvents();
        const registrations = getRegistrations();
        const pastRegs = registrations.filter(r => {
            if (r.status === 'Withdrawn') return false;
            const evt = events.find(e => e.id === r.eventId);
            return evt && new Date(evt.date) < new Date();
        });

        if (pastRegs.length === 0) {
            container.innerHTML = `<div style="text-align: center; padding: 4rem 2rem; color: #888;">
                <i class="fa-regular fa-clock" style="font-size: 3rem; margin-bottom: 1rem; display: block; color: #ccc;"></i>
                <h3 style="margin: 0 0 0.5rem; color: #555;">No past events</h3>
                <p style="margin: 0;">Events you attend will appear here with options to leave feedback.</p>
            </div>`;
            return;
        }

        container.innerHTML = pastRegs.map(reg => {
            const evt = events.find(e => e.id === reg.eventId);
            if (!evt) return '';

            const eventDate = new Date(evt.date);
            const dateFormatted = eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

            // Star rating display
            let starsHTML = '';
            if (reg.rating) {
                for (let i = 1; i <= 5; i++) {
                    starsHTML += `<i class="fa-solid fa-star" style="color: ${i <= reg.rating ? '#ffc107' : '#e0e0e0'}; font-size: 1rem;"></i>`;
                }
            }

            const feedbackSection = reg.feedback
                ? `<div style="margin-top: 1rem; background: #f0f4f8; padding: 1rem; border-radius: 8px; border-left: 3px solid #004e92;">
                        <div style="font-size: 0.75rem; color: #666; text-transform: uppercase; font-weight: 600; margin-bottom: 0.5rem;">Your Feedback</div>
                        <div style="margin-bottom: 0.5rem;">${starsHTML}</div>
                        <p style="margin: 0; color: #333; font-size: 0.9rem; line-height: 1.5;">${reg.feedback}</p>
                        <div style="font-size: 0.75rem; color: #999; margin-top: 0.5rem;">Submitted: ${reg.feedbackDate}</div>
                   </div>`
                : `<div style="margin-top: 1rem;">
                        <button class="btn btn-primary btn-sm" onclick="openFeedbackModal('${reg.id}', '${evt.id}')" style="width: 100%;">
                            <i class="fa-solid fa-star"></i> Rate & Leave Feedback
                        </button>
                   </div>`;

            return `
                <div style="background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 15px rgba(0,0,0,0.06); border: 1px solid #e8e8e8;">
                    <div style="display: flex; gap: 1rem; align-items: start;">
                        <div style="min-width: 60px; text-align: center; background: #f5f5f5; padding: 0.5rem; border-radius: 8px;">
                            <div style="font-size: 0.7rem; color: #666; text-transform: uppercase; font-weight: 600;">${eventDate.toLocaleString('default', { month: 'short' }).toUpperCase()}</div>
                            <div style="font-size: 1.4rem; font-weight: 700; line-height: 1;">${eventDate.getDate()}</div>
                        </div>
                        <div style="flex: 1;">
                            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                                <h4 style="margin: 0; font-size: 1.1rem; font-weight: 600; color: #222;">${evt.title}</h4>
                                <span style="background: #e8f0fe; color: #1a73e8; padding: 2px 10px; border-radius: 12px; font-size: 0.7rem; font-weight: 500;">${evt.category}</span>
                                <span style="background: #e8f5e9; color: #2e7d32; padding: 2px 10px; border-radius: 12px; font-size: 0.7rem; font-weight: 500;">Attended</span>
                            </div>
                            <div style="display: flex; gap: 1rem; margin-top: 0.5rem; font-size: 0.8rem; color: #666;">
                                <span><i class="fa-regular fa-calendar" style="margin-right: 4px;"></i>${dateFormatted}</span>
                                <span><i class="fa-solid fa-location-dot" style="margin-right: 4px;"></i>${evt.location || 'TBD'}</span>
                                <span><i class="fa-solid fa-ticket" style="margin-right: 4px;"></i>${reg.ticketType}</span>
                            </div>
                        </div>
                    </div>
                    ${feedbackSection}
                </div>
            `;
        }).join('');
    }

    // --- FEEDBACK MODAL ---
    window.openFeedbackModal = function (regId, eventId) {
        const events = getEvents();
        const evt = events.find(e => e.id === eventId);
        if (!evt) return;

        const existing = document.getElementById('feedback-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'feedback-modal';
        modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(3px);" onclick="if(event.target === this) this.parentElement.remove()">
                <div style="background: white; border-radius: 16px; width: 90%; max-width: 480px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3); animation: modalSlideIn 0.3s ease;">
                    <div style="background: linear-gradient(135deg, #004e92, #4dabf7); padding: 2rem; text-align: center;">
                        <div style="width: 64px; height: 64px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
                            <i class="fa-solid fa-star" style="font-size: 1.8rem; color: white;"></i>
                        </div>
                        <h3 style="color: white; font-size: 1.3rem; margin: 0;">Rate & Review</h3>
                        <p style="color: rgba(255,255,255,0.8); margin: 0.5rem 0 0; font-size: 0.9rem;">${evt.title}</p>
                    </div>
                    <div style="padding: 2rem;">
                        <div style="text-align: center; margin-bottom: 1.5rem;">
                            <label style="display: block; font-weight: 600; color: #333; margin-bottom: 0.75rem;">Overall Rating</label>
                            <div id="star-rating" style="display: flex; justify-content: center; gap: 0.5rem;">
                                ${[1, 2, 3, 4, 5].map(i => `<i class="fa-regular fa-star feedback-star" data-rating="${i}" style="font-size: 2rem; color: #ffc107; cursor: pointer; transition: transform 0.2s;" onmouseenter="this.style.transform='scale(1.2)'" onmouseleave="this.style.transform='scale(1)'"></i>`).join('')}
                            </div>
                            <input type="hidden" id="feedback-rating" value="0">
                        </div>
                        <div style="margin-bottom: 1.5rem;">
                            <label style="display: block; font-weight: 600; color: #333; margin-bottom: 0.5rem;">Your Feedback</label>
                            <textarea id="feedback-text" rows="4" required
                                style="width: 100%; border: 2px solid #e0e0e0; padding: 1rem; border-radius: 12px; font-size: 1rem; font-family: inherit; resize: vertical; transition: border-color 0.2s; outline: none;"
                                placeholder="Share your experience..." onfocus="this.style.borderColor='#004e92'" onblur="this.style.borderColor='#e0e0e0'"></textarea>
                        </div>
                        <div style="display: flex; gap: 1rem;">
                            <button onclick="document.getElementById('feedback-modal').remove()" style="flex: 1; padding: 12px; background: white; color: #333; border: 2px solid #e0e0e0; border-radius: 8px; font-weight: 600; cursor: pointer;">Cancel</button>
                            <button onclick="submitFeedback('${regId}')" style="flex: 1; padding: 12px; background: #004e92; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;"><i class="fa-solid fa-paper-plane"></i> Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Star click handlers
        modal.querySelectorAll('.feedback-star').forEach(star => {
            star.addEventListener('click', () => {
                const rating = parseInt(star.dataset.rating);
                document.getElementById('feedback-rating').value = rating;
                modal.querySelectorAll('.feedback-star').forEach((s, idx) => {
                    s.classList.remove('fa-regular', 'fa-solid');
                    s.classList.add(idx < rating ? 'fa-solid' : 'fa-regular');
                });
            });
        });
    };

    window.submitFeedback = function (regId) {
        const rating = parseInt(document.getElementById('feedback-rating').value);
        const text = document.getElementById('feedback-text').value.trim();

        if (rating === 0) {
            showToast('Please select a rating.');
            return;
        }
        if (!text) {
            showToast('Please write your feedback.');
            return;
        }

        const regs = getRegistrations();
        const idx = regs.findIndex(r => r.id === regId);
        if (idx > -1) {
            regs[idx].rating = rating;
            regs[idx].feedback = text;
            regs[idx].feedbackDate = new Date().toISOString().split('T')[0];
            saveRegistrations(regs);
        }

        document.getElementById('feedback-modal')?.remove();
        showToast('Thank you for your feedback!');
        renderHistory();
    };

    // --- WITHDRAW REGISTRATION ---
    window.openWithdrawModal = function (regId, eventId) {
        const events = getEvents();
        const evt = events.find(e => e.id === eventId);
        if (!evt) return;

        const existing = document.getElementById('withdraw-modal');
        if (existing) existing.remove();

        const attendeePolicyMeta = {
            'flexible': { label: 'Flexible', color: '#2e7d32', desc: 'Full refund available up to 1 day before the event.' },
            'moderate': { label: 'Moderate', color: '#e65100', desc: 'Full refund available up to 7 days before the event.' },
            'strict': { label: 'Strict', color: '#c62828', desc: 'Full refund available up to 30 days before the event.' },
            'non-refundable': { label: 'Non-refundable', color: '#b71c1c', desc: 'No refunds allowed once tickets are purchased.' }
        };

        const pol = evt.attendeeWithdrawalPolicy;
        const polMeta = pol ? attendeePolicyMeta[pol] : null;

        const policySection = polMeta
            ? `<div style="background:#fff8f8;border:1px solid #ffcdd2;border-radius:10px;padding:1rem;margin-bottom:1.25rem;">
                <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.4rem;">
                    <i class="fa-solid fa-shield-halved" style="color:${polMeta.color};"></i>
                    <span style="font-weight:700;color:${polMeta.color};font-size:0.9rem;">Refund Policy: ${polMeta.label}</span>
                </div>
                <p style="margin:0;font-size:0.82rem;color:#555;line-height:1.5;">${polMeta.desc}</p>
               </div>`
            : `<div style="background:#f5f5f5;border-radius:10px;padding:1rem;margin-bottom:1.25rem;">
                <p style="margin:0;font-size:0.82rem;color:#777;"><i class="fa-solid fa-circle-info" style="margin-right:5px;"></i>No refund policy set for this event. Please contact the organizer.</p>
               </div>`;

        const modal = document.createElement('div');
        modal.id = 'withdraw-modal';
        modal.innerHTML = `
            <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:1000;display:flex;justify-content:center;align-items:center;backdrop-filter:blur(3px);" onclick="if(event.target===this)document.getElementById('withdraw-modal').remove()">
                <div style="background:white;border-radius:16px;width:90%;max-width:440px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.3);animation:modalSlideIn 0.3s ease;">
                    <div style="background:linear-gradient(135deg,#c62828,#ef5350);padding:1.75rem 2rem;text-align:center;">
                        <div style="width:60px;height:60px;background:rgba(255,255,255,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 0.75rem;">
                            <i class="fa-solid fa-right-from-bracket" style="font-size:1.6rem;color:white;"></i>
                        </div>
                        <h3 style="color:white;font-size:1.2rem;margin:0 0 0.25rem;">Withdraw Registration</h3>
                        <p style="color:rgba(255,255,255,0.85);margin:0;font-size:0.85rem;">${evt.title}</p>
                    </div>
                    <div style="padding:1.75rem 2rem;">
                        <p style="margin:0 0 1.25rem;color:#333;font-size:0.9rem;line-height:1.6;">Are you sure you want to withdraw from this event? This action cannot be undone.</p>
                        ${policySection}
                        <div style="display:flex;gap:0.75rem;">
                            <button onclick="document.getElementById('withdraw-modal').remove()" style="flex:1;padding:12px;background:white;color:#333;border:2px solid #e0e0e0;border-radius:8px;font-weight:600;cursor:pointer;">Cancel</button>
                            <button onclick="confirmWithdraw('${regId}')" style="flex:1;padding:12px;background:linear-gradient(135deg,#c62828,#ef5350);color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;"><i class="fa-solid fa-right-from-bracket" style="margin-right:6px;"></i>Confirm Withdrawal</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    };

    window.confirmWithdraw = function (regId) {
        const regs = getRegistrations();
        const reg = regs.find(r => r.id === regId);
        if (reg) {
            reg.status = 'Withdrawn';
            reg.withdrawnDate = new Date().toISOString().split('T')[0];
            saveRegistrations(regs);
        }
        document.getElementById('withdraw-modal')?.remove();
        showToast('You have successfully withdrawn from this event.');
        renderAll();
    };

    // --- PROFILE ---
    function loadProfile() {
        const profile = getProfile();
        const firstNameEl = document.getElementById('profile-firstname');
        const lastNameEl = document.getElementById('profile-lastname');
        const emailEl = document.getElementById('profile-email');
        const phoneEl = document.getElementById('profile-phone');
        const jobTitleEl = document.getElementById('profile-jobtitle');
        const avatarText = document.getElementById('profile-avatar-text');
        const avatarImg = document.getElementById('profile-avatar-img');
        const displayName = document.getElementById('profile-display-name');
        const heroName = document.getElementById('attendee-hero-name');

        if (firstNameEl) firstNameEl.value = profile.firstName;
        if (lastNameEl) lastNameEl.value = profile.lastName;
        if (emailEl) emailEl.value = profile.email;
        if (phoneEl) phoneEl.value = profile.phone;
        if (jobTitleEl) jobTitleEl.value = profile.jobTitle || '';
        if (displayName) displayName.textContent = profile.firstName + ' ' + profile.lastName;
        if (heroName) heroName.textContent = profile.firstName;
        if (avatarText) avatarText.textContent = profile.firstName.charAt(0).toUpperCase();

        if (profile.avatar && avatarImg) {
            avatarImg.src = profile.avatar;
            avatarImg.style.display = 'block';
            if (avatarText) avatarText.style.display = 'none';
        }
    }

    // Profile form submit
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const profile = getProfile();
            profile.firstName = document.getElementById('profile-firstname').value;
            profile.lastName = document.getElementById('profile-lastname').value;
            profile.email = document.getElementById('profile-email').value;
            profile.phone = document.getElementById('profile-phone').value;
            const jobEl = document.getElementById('profile-jobtitle');
            profile.jobTitle = jobEl ? jobEl.value.trim() : '';
            saveProfile(profile);
            loadProfile();
            showToast('Profile updated successfully!');
        });
    }

    // Profile picture upload [FR 3.3.1]
    const pfpInput = document.getElementById('pfp-upload');
    if (pfpInput) {
        pfpInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                const profile = getProfile();
                profile.avatar = ev.target.result;
                saveProfile(profile);
                loadProfile();
                showToast('Profile picture updated!');
            };
            reader.readAsDataURL(file);
        });
    }

    // --- STATS ---
    function updateStats() {
        const events = getEvents();
        const regs = getRegistrations();
        const now = new Date();

        const upcoming = regs.filter(r => {
            const evt = events.find(e => e.id === r.eventId);
            return evt && new Date(evt.date) >= now;
        }).length;

        const attended = regs.filter(r => {
            const evt = events.find(e => e.id === r.eventId);
            return evt && new Date(evt.date) < now;
        }).length;

        const statReg = document.getElementById('stat-registered');
        const statUp = document.getElementById('stat-upcoming-count');
        const statAtt = document.getElementById('stat-attended');

        if (statReg) statReg.textContent = regs.length;
        if (statUp) statUp.textContent = upcoming;
        if (statAtt) statAtt.textContent = attended;
    }

    // --- VIEW SWITCHING ---
    function switchAttendeeView(viewName, scrollTo) {
        document.querySelectorAll('.attendee-view').forEach(v => v.style.display = 'none');
        const target = document.getElementById('view-' + viewName);
        if (target) target.style.display = '';

        // Update nav active state (only top nav buttons)
        document.querySelectorAll('.nav-links .att-nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.view === viewName && !link.dataset.scroll) {
                link.classList.add('active');
            }
        });
        // Special: if clicking "My Tickets", highlight that button
        if (viewName === 'home' && scrollTo === 'my-tickets-section') {
            document.querySelectorAll('.nav-links .att-nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.dataset.scroll === 'my-tickets-section') link.classList.add('active');
            });
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (scrollTo) {
            setTimeout(() => {
                const scrollTarget = document.getElementById(scrollTo);
                if (scrollTarget) scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }

    // --- MOBILE MENU TOGGLE ---
    const mobileToggle = document.getElementById('att-mobile-toggle');
    const navLinksPanel = document.getElementById('att-nav-links');
    const mobileBackdrop = document.getElementById('att-mobile-backdrop');

    function openMobileMenu() {
        if (navLinksPanel) navLinksPanel.classList.add('open');
        if (mobileBackdrop) mobileBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeMobileMenu() {
        if (navLinksPanel) navLinksPanel.classList.remove('open');
        if (mobileBackdrop) mobileBackdrop.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            if (navLinksPanel && navLinksPanel.classList.contains('open')) closeMobileMenu();
            else openMobileMenu();
        });
    }
    if (mobileBackdrop) {
        mobileBackdrop.addEventListener('click', closeMobileMenu);
    }
    const drawerClose = document.getElementById('att-drawer-close');
    if (drawerClose) {
        drawerClose.addEventListener('click', closeMobileMenu);
    }

    // Nav link click handlers (view switching)
    document.querySelectorAll('.att-nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const viewName = link.dataset.view;
            const scrollTo = link.dataset.scroll || null;
            switchAttendeeView(viewName, scrollTo);
            if (window.innerWidth <= 868) closeMobileMenu();
        });
    });

    // Logo click -> home
    const logo = document.getElementById('nav-logo');
    if (logo) {
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            switchAttendeeView('home');
            if (window.innerWidth <= 868) closeMobileMenu();
        });
    }

    // --- SEARCH & FILTER LISTENERS ---
    const searchInput = document.getElementById('landing-search');
    if (searchInput) searchInput.addEventListener('input', renderBrowseEvents);

    const locFilter = document.getElementById('landing-location-filter');
    if (locFilter) locFilter.addEventListener('change', renderBrowseEvents);

    const searchBtn = document.getElementById('landing-search-btn');
    if (searchBtn) searchBtn.addEventListener('click', renderBrowseEvents);

    document.querySelectorAll('.cat-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            renderBrowseEvents();
        });
    });

    // --- SMOOTH SCROLL (within home view) ---
    document.querySelectorAll('.nav-scroll-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('landing-navbar');
        if (nav) {
            if (window.scrollY > 50) {
                nav.classList.add('nav-scrolled');
            } else {
                nav.classList.remove('nav-scrolled');
            }
        }
    });

    // --- TOAST ---
    function showToast(msg) {
        const toast = document.createElement('div');
        toast.textContent = msg;
        toast.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: #333; color: white; padding: 14px 28px; border-radius: 10px; z-index: 9999; font-size: 0.9rem; box-shadow: 0 4px 15px rgba(0,0,0,0.2); animation: modalSlideIn 0.3s ease;';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // --- RENDER ALL ---
    function renderAll() {
        renderBrowseEvents();
        renderMyTickets();
        renderHistory();
        updateStats();
    }

    // ==========================================================================
    // --- BROADCAST NOTIFICATIONS ---
    // ==========================================================================

    const BROADCASTS_KEY = 'eventia_broadcasts';
    const READ_NOTIFS_KEY = 'eventia_read_notifs';

    function getBroadcasts() {
        return JSON.parse(localStorage.getItem(BROADCASTS_KEY)) || [];
    }

    function getReadNotifIds() {
        return JSON.parse(localStorage.getItem(READ_NOTIFS_KEY)) || [];
    }

    function saveReadNotifIds(ids) {
        localStorage.setItem(READ_NOTIFS_KEY, JSON.stringify(ids));
    }

    function getAttendeeRelevantBroadcasts() {
        const regs = getRegistrations();
        const registeredEventIds = regs.map(r => r.eventId);
        const broadcasts = getBroadcasts();
        // Only show broadcasts for events the attendee is registered for
        return broadcasts.filter(b => registeredEventIds.includes(b.eventId))
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Newest first
    }

    function initNotifications() {
        renderNotifBadge();
    }

    function renderNotifBadge() {
        const badge = document.getElementById('notif-badge');
        if (!badge) return;
        const broadcasts = getAttendeeRelevantBroadcasts();
        const readIds = getReadNotifIds();
        const unreadCount = broadcasts.filter(b => !readIds.includes(b.id)).length;
        if (unreadCount > 0) {
            badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }

    function renderNotifList() {
        const list = document.getElementById('notif-list');
        if (!list) return;
        const broadcasts = getAttendeeRelevantBroadcasts();
        const readIds = getReadNotifIds();
        const events = getEvents();

        // Update toolbar count label
        const unreadCount = broadcasts.filter(b => !readIds.includes(b.id)).length;
        const countLabel = document.getElementById('notif-count-label');
        if (countLabel) {
            countLabel.innerHTML = broadcasts.length === 0 ? '' :
                `<span style="color:#004e92;font-weight:600;">${unreadCount} unread</span> of ${broadcasts.length} messages`;
        }

        if (broadcasts.length === 0) {
            list.innerHTML = `
                <div style="background:white;border-radius:16px;padding:4rem 2rem;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
                    <i class="fa-regular fa-bell-slash" style="font-size:3.5rem;color:#d1d5db;display:block;margin-bottom:1.25rem;"></i>
                    <div style="font-weight:700;color:#374151;font-size:1.1rem;margin-bottom:0.4rem;">No updates yet</div>
                    <div style="font-size:0.875rem;color:#9ca3af;max-width:320px;margin:0 auto;line-height:1.6;">When organizers send broadcasts for your registered events, they'll appear here.</div>
                </div>
            `;
            return;
        }

        list.innerHTML = broadcasts.map(b => {
            const isRead = readIds.includes(b.id);
            const evt = events.find(e => e.id === b.eventId);
            const evtTitle = evt ? evt.title : 'Event';
            const evtCategory = evt ? evt.category : '';
            const ts = new Date(b.timestamp);
            const dateStr = ts.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
            const timeStr = ts.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            return `
                <div style="position:relative;background:white;border-radius:14px;margin-bottom:1rem;box-shadow:0 2px 12px rgba(0,0,0,${isRead ? '0.05' : '0.09'});overflow:hidden;border:1.5px solid ${isRead ? '#e5e7eb' : '#bfdbfe'};transition:box-shadow 0.2s;"
                    onmouseenter="this.style.boxShadow='0 6px 24px rgba(0,0,0,0.12)'" onmouseleave="this.style.boxShadow='0 2px 12px rgba(0,0,0,${isRead ? '0.05' : '0.09'})'">

                    <!-- Unread bar -->
                    ${!isRead ? `<div style="position:absolute;top:0;left:0;width:4px;height:100%;background:linear-gradient(180deg,#004e92,#4dabf7);border-radius:14px 0 0 14px;"></div>` : ''}

                    <div style="padding:1.25rem 1.5rem ${!isRead ? '1.25rem 1.75rem' : '1.25rem 1.5rem'};">
                        <!-- Card header -->
                        <div style="display:flex;align-items:center;gap:0.875rem;margin-bottom:1rem;">
                            <div style="width:42px;height:42px;border-radius:50%;background:${isRead ? '#f1f5f9' : 'linear-gradient(135deg,#004e92,#4dabf7)'};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                <i class="fa-solid fa-bullhorn" style="font-size:1rem;color:${isRead ? '#94a3b8' : 'white'};"></i>
                            </div>
                            <div style="flex:1;min-width:0;">
                                <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;">
                                    <span style="font-size:0.78rem;font-weight:700;color:#004e92;background:#eff6ff;padding:3px 10px;border-radius:20px;white-space:nowrap;">${evtTitle}</span>
                                    ${evtCategory ? `<span style="font-size:0.72rem;color:#6b7280;background:#f3f4f6;padding:2px 8px;border-radius:20px;">${evtCategory}</span>` : ''}
                                    ${!isRead ? `<span style="font-size:0.72rem;font-weight:700;color:#ef4444;background:#fef2f2;padding:2px 8px;border-radius:20px;">● NEW</span>` : ''}
                                </div>
                                <div style="font-size:0.75rem;color:#9ca3af;margin-top:3px;">
                                    <i class="fa-regular fa-calendar" style="margin-right:4px;"></i>${dateStr} · ${timeStr}
                                </div>
                            </div>
                        </div>

                        <!-- Message body -->
                        <p style="margin:0 0 1rem;font-size:0.95rem;color:#1f2937;line-height:1.75;word-break:break-word;">${b.message}</p>

                        <!-- Footer action -->
                        ${!isRead ? `
                        <div style="display:flex;justify-content:flex-end;">
                            <button onclick="markNotifRead('${b.id}')" style="background:transparent;border:1.5px solid #004e92;color:#004e92;border-radius:8px;padding:5px 14px;cursor:pointer;font-size:0.8rem;font-weight:600;transition:all 0.2s;"
                                onmouseenter="this.style.background='#004e92';this.style.color='white'" onmouseleave="this.style.background='transparent';this.style.color='#004e92'">
                                <i class="fa-solid fa-check" style="margin-right:4px;"></i>Mark as read
                            </button>
                        </div>` : `<div style="font-size:0.75rem;color:#d1d5db;"><i class="fa-solid fa-check-double" style="margin-right:4px;"></i>Read</div>`}
                    </div>
                </div>
            `;
        }).join('');
    }


    window.markNotifRead = function (notifId) {
        const readIds = getReadNotifIds();
        if (!readIds.includes(notifId)) {
            readIds.push(notifId);
            saveReadNotifIds(readIds);
        }
        renderNotifBadge();
        renderNotifList();
    };

    window.markAllNotifsRead = function () {
        const broadcasts = getAttendeeRelevantBroadcasts();
        const readIds = getReadNotifIds();
        broadcasts.forEach(b => {
            if (!readIds.includes(b.id)) readIds.push(b.id);
        });
        saveReadNotifIds(readIds);
        renderNotifBadge();
        renderNotifList();
    };

    // ==========================================================================
    // --- AI ASSISTANT (Eventia AI) ---
    // Frontend-only simulation. Interprets user text against DUMMY_EVENTS and
    // returns a reply with event recommendations + follow-up chips.
    // Swap `sendMessage` with a real API later without touching the DOM layer.
    // ==========================================================================

    const AIAssistant = (function () {
        const CATEGORIES = ['Tech', 'Art', 'Business', 'Music', 'Education', 'Sports'];
        const CATEGORY_SYNONYMS = {
            'Tech': ['tech', 'technology', 'ai', 'coding', 'developer', 'startup', 'robotics', 'software'],
            'Art': ['art', 'arts', 'exhibition', 'gallery', 'painting', 'design', 'culture'],
            'Business': ['business', 'leadership', 'entrepreneur', 'networking', 'workshop', 'career', 'finance'],
            'Music': ['music', 'concert', 'festival', 'band', 'dj', 'live'],
            'Education': ['education', 'learning', 'course', 'conference', 'academic', 'university', 'school'],
            'Sports': ['sports', 'sport', 'marathon', 'run', 'running', 'football', 'fitness', 'game', 'match']
        };
        const CITIES = ['Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Al Ula'];
        const MOOD_SYNONYMS = {
            fun: ['Music', 'Sports', 'Art'],
            chill: ['Art', 'Education'],
            learn: ['Education', 'Tech', 'Business'],
            network: ['Business', 'Tech']
        };

        let state = {
            history: [],           // array of { role: 'user'|'ai', html, eventIds? }
            lastQuery: null,       // last interpreted query object
            opened: false,
            currentConvId: null,   // active conversation id or null for "not yet started"
            lastFollowUps: []
        };

        const CONV_STORAGE_KEY = 'eventia_ai_conversations';
        const MAX_STORED_CONVS = 50;

        // ---------- DOM refs (lazy) ----------
        let ui = null;
        let welcomeTemplate = '';
        function refs() {
            if (ui) return ui;
            ui = {
                root: document.getElementById('ai-assistant'),
                sparkleBtn: document.getElementById('ai-search-sparkle-btn'),
                sparkleNudge: document.getElementById('ai-sparkle-nudge'),
                nudgeCloseBtn: document.getElementById('ai-nudge-close'),
                searchInput: document.getElementById('landing-search'),
                closeBtn: document.getElementById('ai-close-btn'),
                resetBtn: document.getElementById('ai-reset-btn'),
                historyBtn: document.getElementById('ai-history-btn'),
                overlay: document.getElementById('ai-panel-overlay'),
                backdrop: document.getElementById('ai-panel-backdrop'),
                panel: document.getElementById('ai-panel'),
                messages: document.getElementById('ai-messages'),
                welcome: document.getElementById('ai-welcome'),
                chips: document.getElementById('ai-suggested-chips'),
                form: document.getElementById('ai-input-form'),
                input: document.getElementById('ai-input'),
                sendBtn: document.getElementById('ai-send-btn'),
                historyView: document.getElementById('ai-history-view'),
                historyList: document.getElementById('ai-history-list'),
                historyClearBtn: document.getElementById('ai-history-clear-btn')
            };
            if (ui.welcome) welcomeTemplate = ui.welcome.outerHTML;
            return ui;
        }

        // ---------- Conversation persistence ----------
        function loadConversations() {
            try {
                const raw = localStorage.getItem(CONV_STORAGE_KEY);
                const list = raw ? JSON.parse(raw) : [];
                return Array.isArray(list) ? list : [];
            } catch (_) {
                return [];
            }
        }

        function saveConversations(list) {
            try {
                const trimmed = (list || []).slice(0, MAX_STORED_CONVS);
                localStorage.setItem(CONV_STORAGE_KEY, JSON.stringify(trimmed));
            } catch (_) { /* ignore quota errors */ }
        }

        function makeConvId() {
            return 'c_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
        }

        function truncateTitle(text, max) {
            const s = (text || '').trim();
            if (s.length <= max) return s;
            return s.slice(0, max - 1).trimEnd() + '\u2026';
        }

        function persistMessage(role, data) {
            const all = loadConversations();
            let conv = null;
            if (state.currentConvId) {
                conv = all.find(c => c.id === state.currentConvId) || null;
            }
            if (!conv) {
                conv = {
                    id: makeConvId(),
                    title: role === 'user' ? truncateTitle(data.plainText || data.html, 60) : 'New conversation',
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                    messages: []
                };
                state.currentConvId = conv.id;
                all.unshift(conv);
            }
            conv.messages.push({
                role,
                html: data.html || '',
                eventIds: Array.isArray(data.eventIds) ? data.eventIds : undefined,
                emptySuggest: data.emptySuggest || undefined,
                followUps: data.followUps || undefined
            });
            if (role === 'user' && (!conv.title || conv.title === 'New conversation')) {
                conv.title = truncateTitle(data.plainText || data.html, 60);
            }
            conv.updatedAt = Date.now();
            // move to top
            const filtered = all.filter(c => c.id !== conv.id);
            filtered.unshift(conv);
            saveConversations(filtered);
        }

        function deleteConversation(id) {
            const all = loadConversations().filter(c => c.id !== id);
            saveConversations(all);
            if (state.currentConvId === id) {
                state.currentConvId = null;
            }
        }

        function clearAllConversations() {
            saveConversations([]);
            state.currentConvId = null;
        }

        function formatRelativeTime(ts) {
            const diff = Date.now() - ts;
            const sec = Math.floor(diff / 1000);
            if (sec < 45) return 'Just now';
            const min = Math.floor(sec / 60);
            if (min < 60) return `${min}m ago`;
            const hr = Math.floor(min / 60);
            if (hr < 24) return `${hr}h ago`;
            const day = Math.floor(hr / 24);
            if (day === 1) return 'Yesterday';
            if (day < 7) return `${day}d ago`;
            return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }

        // ---------- Utilities ----------
        function escapeHtml(str) {
            return String(str || '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        function formatDate(dateStr) {
            if (!dateStr) return 'TBD';
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr;
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }

        function isToday(dateStr) {
            const d = new Date(dateStr);
            const today = new Date();
            return d.toDateString() === today.toDateString();
        }

        function isThisWeekend(dateStr) {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return false;
            const today = new Date();
            const day = today.getDay(); // 0 Sun..6 Sat
            const daysUntilFri = (5 - day + 7) % 7;
            const friday = new Date(today);
            friday.setDate(today.getDate() + daysUntilFri);
            friday.setHours(0, 0, 0, 0);
            const sunday = new Date(friday);
            sunday.setDate(friday.getDate() + 2);
            sunday.setHours(23, 59, 59, 999);
            return d >= friday && d <= sunday;
        }

        function daysFromNow(dateStr, days) {
            const d = new Date(dateStr);
            const target = new Date();
            target.setHours(23, 59, 59, 999);
            target.setDate(target.getDate() + days);
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            return d >= now && d <= target;
        }

        // ---------- NLP-lite interpreter ----------
        function interpret(text) {
            const t = (text || '').toLowerCase();
            const q = {
                raw: text,
                categories: [],
                cities: [],
                timeframe: null,   // 'today'|'tonight'|'weekend'|'thisweek'|'nextweek'|null
                maxPrice: null,    // number | null
                freeOnly: false,
                keywords: []
            };

            CATEGORIES.forEach(cat => {
                const syns = CATEGORY_SYNONYMS[cat] || [];
                if (syns.some(s => t.includes(s))) q.categories.push(cat);
            });
            Object.keys(MOOD_SYNONYMS).forEach(mood => {
                if (t.includes(mood)) {
                    MOOD_SYNONYMS[mood].forEach(c => {
                        if (!q.categories.includes(c)) q.categories.push(c);
                    });
                }
            });

            CITIES.forEach(city => {
                if (t.includes(city.toLowerCase())) q.cities.push(city);
            });

            if (/\btonight\b/.test(t)) q.timeframe = 'tonight';
            else if (/\btoday\b/.test(t)) q.timeframe = 'today';
            else if (/\bthis\s+weekend\b|\bweekend\b/.test(t)) q.timeframe = 'weekend';
            else if (/\bthis\s+week\b/.test(t)) q.timeframe = 'thisweek';
            else if (/\bnext\s+week\b/.test(t)) q.timeframe = 'nextweek';

            if (/\bfree\b|\bno\s*cost\b|\bno\s*charge\b/.test(t)) q.freeOnly = true;
            const priceMatch = t.match(/(?:under|below|less than|<=?)\s*(\d{2,5})/);
            if (priceMatch) q.maxPrice = parseInt(priceMatch[1], 10);
            else {
                const sarMatch = t.match(/(\d{2,5})\s*(sar|riyal|riyals|\u0631)/);
                if (sarMatch && /under|below|less than|cheap/.test(t)) q.maxPrice = parseInt(sarMatch[1], 10);
            }

            const stop = new Set(['the', 'a', 'an', 'and', 'or', 'for', 'to', 'me', 'i', 'want', 'looking', 'find', 'show',
                'please', 'any', 'some', 'event', 'events', 'in', 'at', 'on', 'this', 'that', 'with', 'about',
                'like', 'near', 'around', 'can', 'you', 'help', 'today', 'tonight', 'weekend', 'week', 'next',
                'free', 'under', 'below', 'less', 'than', 'cheap', 'sar', 'riyal', 'riyals']);
            q.keywords = t.split(/[^a-z0-9\u0600-\u06FF]+/)
                .filter(w => w && w.length > 2 && !stop.has(w)
                    && !CATEGORIES.some(c => c.toLowerCase() === w)
                    && !CITIES.some(c => c.toLowerCase() === w));

            return q;
        }

        function matches(evt, q) {
            if (evt.status === 'Rejected' || evt.status === 'Pending') return false;

            if (q.categories.length && !q.categories.includes(evt.category)) return false;

            if (q.cities.length) {
                const loc = (evt.location || '').toLowerCase();
                const hit = q.cities.some(c => loc.includes(c.toLowerCase()));
                if (!hit) return false;
            }

            if (q.timeframe) {
                switch (q.timeframe) {
                    case 'today':
                    case 'tonight':
                        if (!isToday(evt.date)) return false;
                        break;
                    case 'weekend':
                        if (!isThisWeekend(evt.date)) return false;
                        break;
                    case 'thisweek':
                        if (!daysFromNow(evt.date, 7)) return false;
                        break;
                    case 'nextweek':
                        if (!daysFromNow(evt.date, 14) || daysFromNow(evt.date, 7)) return false;
                        break;
                }
            }

            const priceNum = parseInt(evt.price, 10) || 0;
            if (q.freeOnly && priceNum > 0) return false;
            if (q.maxPrice !== null && priceNum > q.maxPrice) return false;

            if (q.keywords.length) {
                const haystack = [evt.title, evt.description, evt.location].join(' ').toLowerCase();
                const matched = q.keywords.filter(k => haystack.includes(k));
                if (matched.length === 0 && !q.categories.length && !q.cities.length
                    && !q.timeframe && !q.freeOnly && q.maxPrice === null) return false;
            }

            return true;
        }

        function rankEvents(list) {
            const now = Date.now();
            return list.slice().sort((a, b) => {
                const da = new Date(a.date).getTime() - now;
                const db = new Date(b.date).getTime() - now;
                const aFuture = da >= 0 ? da : Infinity;
                const bFuture = db >= 0 ? db : Infinity;
                if (aFuture !== bFuture) return aFuture - bFuture;
                return (b.attendees || 0) - (a.attendees || 0);
            });
        }

        function summarize(q, total) {
            const bits = [];
            if (q.categories.length === 1) bits.push(`<strong>${escapeHtml(q.categories[0])}</strong>`);
            else if (q.categories.length > 1) bits.push(`<strong>${q.categories.map(escapeHtml).join(' / ')}</strong>`);
            else bits.push('events');

            if (q.cities.length) bits.push(`in <strong>${q.cities.map(escapeHtml).join(' or ')}</strong>`);
            if (q.timeframe === 'today' || q.timeframe === 'tonight') bits.push('happening <strong>today</strong>');
            if (q.timeframe === 'weekend') bits.push('<strong>this weekend</strong>');
            if (q.timeframe === 'thisweek') bits.push('<strong>this week</strong>');
            if (q.timeframe === 'nextweek') bits.push('<strong>next week</strong>');
            if (q.freeOnly) bits.push('that are <strong>free</strong>');
            else if (q.maxPrice !== null) bits.push(`under <strong>${q.maxPrice} SAR</strong>`);

            const prefix = total === 0
                ? `I couldn't find `
                : (total === 1 ? `I found <strong>1</strong> match &mdash; ` : `I found <strong>${total}</strong> `);
            return prefix + bits.join(' ') + (total === 0 ? ' matching that yet.' : '.');
        }

        function buildFollowUps(q, results) {
            const chips = [];
            if (results.length > 3) chips.push({ label: 'Show more', icon: 'fa-list', prompt: `${q.raw || ''} (show more)` });
            if (!q.freeOnly && results.some(e => parseInt(e.price, 10) > 0)) {
                chips.push({ label: 'Only free ones', icon: 'fa-tag', prompt: `${q.raw || ''} free only` });
            }
            if (!q.cities.length) chips.push({ label: 'In Riyadh only', icon: 'fa-location-dot', prompt: `${q.raw || ''} in Riyadh` });
            if (q.timeframe !== 'weekend') chips.push({ label: 'This weekend', icon: 'fa-calendar-week', prompt: `${q.raw || ''} this weekend` });
            if (!q.categories.length) chips.push({ label: 'Surprise me', icon: 'fa-shuffle', prompt: 'surprise me with something fun' });
            return chips.slice(0, 4);
        }

        // ---------- Fake async reply ----------
        function sendMessage(userText) {
            return new Promise(resolve => {
                const delay = 650 + Math.random() * 750;
                setTimeout(() => {
                    const q = interpret(userText);
                    state.lastQuery = q;
                    const events = getEvents();
                    let filtered = events.filter(e => matches(e, q));

                    if (filtered.length === 0 && q.categories.length === 0
                        && q.cities.length === 0 && q.keywords.length === 0
                        && !q.timeframe && !q.freeOnly && q.maxPrice === null) {
                        filtered = events.filter(e => e.status !== 'Rejected' && e.status !== 'Pending');
                    }

                    filtered = rankEvents(filtered);
                    const top = filtered.slice(0, 3);
                    const reply = {
                        text: summarize(q, filtered.length),
                        events: top,
                        followUps: buildFollowUps(q, filtered),
                        total: filtered.length
                    };

                    if (filtered.length === 0) {
                        reply.emptySuggest = buildEmptySuggest(q);
                    }
                    resolve(reply);
                }, delay);
            });
        }

        function buildEmptySuggest(q) {
            const alt = [];
            if (q.categories.length) alt.push('removing the category filter');
            if (q.cities.length) alt.push('trying a different city');
            if (q.maxPrice !== null || q.freeOnly) alt.push('widening your budget');
            if (q.timeframe) alt.push('looking at a later date');
            if (alt.length === 0) return 'Try describing what you enjoy &mdash; a category, a mood, or a city.';
            return 'Want to try ' + alt.join(' or ') + '?';
        }

        // ---------- Renderers ----------
        function categoryGradientFor(cat) { return categoryGradients[cat] || categoryGradients['Other']; }
        function categoryIconFor(cat) { return categoryIcons[cat] || 'fa-calendar'; }

        function renderEventCard(evt) {
            const priceNum = parseInt(evt.price, 10) || 0;
            const priceHtml = priceNum > 0
                ? `<div class="ai-event-price">${priceNum} ${SAR_ICON}</div>`
                : `<div class="ai-event-price free"><i class="fa-solid fa-gift"></i> Free</div>`;

            return `
                <div class="ai-event-card" data-event-id="${escapeHtml(evt.id)}" role="button" tabindex="0">
                    <div class="ai-event-thumb" style="background: ${categoryGradientFor(evt.category)};">
                        <i class="fa-solid ${categoryIconFor(evt.category)}"></i>
                    </div>
                    <div class="ai-event-info">
                        <h4 class="ai-event-title">${escapeHtml(evt.title)}</h4>
                        <div class="ai-event-meta">
                            <span><i class="fa-regular fa-calendar"></i> ${escapeHtml(formatDate(evt.date))}</span>
                            <span><i class="fa-solid fa-location-dot"></i> ${escapeHtml(evt.location || 'TBD')}</span>
                        </div>
                        <span class="ai-event-category-pill">${escapeHtml(evt.category || 'Event')}</span>
                    </div>
                    <div class="ai-event-actions">
                        ${priceHtml}
                        <button type="button" class="ai-event-view-btn" data-view-event="${escapeHtml(evt.id)}">
                            View <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            `;
        }

        function appendMessage(role, html, opts = {}) {
            const r = refs();
            const row = document.createElement('div');
            row.className = `ai-msg ai-msg-${role}`;

            const avatar = document.createElement('div');
            avatar.className = 'ai-msg-avatar';
            avatar.innerHTML = role === 'ai'
                ? '<i class="fa-solid fa-wand-magic-sparkles"></i>'
                : '<i class="fa-solid fa-user"></i>';

            const body = document.createElement('div');
            body.className = 'ai-msg-body';

            const bubble = document.createElement('div');
            bubble.className = 'ai-bubble';
            bubble.innerHTML = html;
            body.appendChild(bubble);

            if (opts.events && opts.events.length) {
                const list = document.createElement('div');
                list.className = 'ai-event-list';
                list.innerHTML = opts.events.map(renderEventCard).join('');
                body.appendChild(list);
            }

            if (opts.emptySuggest) {
                const s = document.createElement('div');
                s.className = 'ai-empty-suggest';
                s.innerHTML = opts.emptySuggest;
                body.appendChild(s);
            }

            row.appendChild(avatar);
            row.appendChild(body);
            r.messages.appendChild(row);

            state.history.push({ role, html, events: opts.events || [] });
            scrollToBottom();
        }

        function scrollToBottom() {
            const r = refs();
            requestAnimationFrame(() => {
                r.messages.scrollTop = r.messages.scrollHeight;
            });
        }

        function showTyping() {
            const r = refs();
            removeTyping();
            const row = document.createElement('div');
            row.className = 'ai-msg ai-msg-ai';
            row.id = 'ai-typing-row';
            row.innerHTML = `
                <div class="ai-msg-avatar"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
                <div class="ai-msg-body">
                    <div class="ai-typing" aria-label="Eventia AI is typing">
                        <span class="ai-typing-dot"></span>
                        <span class="ai-typing-dot"></span>
                        <span class="ai-typing-dot"></span>
                    </div>
                </div>
            `;
            r.messages.appendChild(row);
            scrollToBottom();
        }

        function removeTyping() {
            const existing = document.getElementById('ai-typing-row');
            if (existing) existing.remove();
        }

        function renderChips(chips) {
            const r = refs();
            r.chips.innerHTML = '';
            if (!chips || chips.length === 0) return;
            chips.forEach(c => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'ai-chip';
                btn.dataset.prompt = c.prompt;
                btn.innerHTML = `<i class="fa-solid ${c.icon}"></i> ${escapeHtml(c.label)}`;
                btn.addEventListener('click', () => submitPrompt(c.prompt));
                r.chips.appendChild(btn);
            });
        }

        // ---------- Welcome (empty-state) helpers ----------
        function hasWelcome() {
            const w = document.getElementById('ai-welcome');
            return !!w && !w.classList.contains('ai-welcome-leaving');
        }

        function hideWelcome() {
            const w = document.getElementById('ai-welcome');
            if (!w) return;
            w.classList.add('ai-welcome-leaving');
            setTimeout(() => { if (w.parentNode) w.parentNode.removeChild(w); }, 260);
        }

        function restoreWelcome() {
            const r = refs();
            const existing = document.getElementById('ai-welcome');
            if (existing) existing.remove();
            if (welcomeTemplate) {
                r.messages.insertAdjacentHTML('afterbegin', welcomeTemplate);
            }
        }

        // ---------- Actions ----------
        async function submitPrompt(text) {
            const clean = (text || '').trim();
            if (!clean) return;
            const r = refs();

            if (r.root && r.root.dataset.view === 'history') showChatView();
            if (hasWelcome()) hideWelcome();

            const userHtml = escapeHtml(clean);
            appendMessage('user', userHtml);
            persistMessage('user', { html: userHtml, plainText: clean });

            r.input.value = '';
            r.sendBtn.disabled = true;
            r.chips.innerHTML = '';
            showTyping();
            try {
                const reply = await sendMessage(clean);
                removeTyping();
                appendMessage('ai', reply.text, { events: reply.events, emptySuggest: reply.emptySuggest });
                renderChips(reply.followUps);
                state.lastFollowUps = reply.followUps || [];
                persistMessage('ai', {
                    html: reply.text,
                    eventIds: (reply.events || []).map(e => e.id),
                    emptySuggest: reply.emptySuggest,
                    followUps: reply.followUps
                });
            } catch (err) {
                removeTyping();
                const failHtml = 'Something went wrong on my side. Mind trying again?';
                appendMessage('ai', failHtml);
                persistMessage('ai', { html: failHtml });
            } finally {
                r.sendBtn.disabled = false;
                r.input.focus();
            }
        }

        // ---------- History view ----------
        function showHistoryView() {
            const r = refs();
            if (!r.root) return;
            r.root.dataset.view = 'history';
            if (r.messages) r.messages.hidden = true;
            if (r.chips) r.chips.hidden = true;
            if (r.form) r.form.hidden = true;
            if (r.historyView) r.historyView.hidden = false;
            renderHistoryList();
        }

        function showChatView() {
            const r = refs();
            if (!r.root) return;
            r.root.dataset.view = 'chat';
            if (r.messages) r.messages.hidden = false;
            if (r.chips) r.chips.hidden = false;
            if (r.form) r.form.hidden = false;
            if (r.historyView) r.historyView.hidden = true;
        }

        function toggleHistoryView() {
            const r = refs();
            if (r.root && r.root.dataset.view === 'history') {
                showChatView();
            } else {
                showHistoryView();
            }
        }

        function renderHistoryList() {
            const r = refs();
            if (!r.historyList) return;
            const all = loadConversations();
            r.historyList.innerHTML = '';

            if (r.historyClearBtn) r.historyClearBtn.hidden = all.length === 0;

            if (all.length === 0) {
                const empty = document.createElement('div');
                empty.className = 'ai-history-empty';
                empty.innerHTML = `
                    <div class="ai-history-empty-icon"><i class="fa-solid fa-comments"></i></div>
                    <h5>No past conversations yet</h5>
                    <p>Once you start chatting, your conversations will appear here so you can pick up where you left off.</p>
                `;
                r.historyList.appendChild(empty);
                return;
            }

            all.forEach(conv => {
                const item = document.createElement('div');
                item.className = 'ai-history-item';
                if (state.currentConvId === conv.id) item.classList.add('ai-history-item-active');
                item.tabIndex = 0;
                item.dataset.convId = conv.id;

                const msgCount = (conv.messages || []).length;
                item.innerHTML = `
                    <div class="ai-history-item-icon" aria-hidden="true">
                        <i class="fa-solid fa-message"></i>
                    </div>
                    <div class="ai-history-item-body">
                        <div class="ai-history-item-title">${escapeHtml(conv.title || 'Conversation')}</div>
                        <div class="ai-history-item-meta">
                            <span class="ai-history-item-time">${escapeHtml(formatRelativeTime(conv.updatedAt || conv.createdAt))}</span>
                            <span class="dot"></span>
                            <span class="ai-history-item-count">
                                <i class="fa-regular fa-comment"></i> ${msgCount} ${msgCount === 1 ? 'message' : 'messages'}
                            </span>
                        </div>
                    </div>
                    <button type="button" class="ai-history-item-delete" title="Delete conversation" aria-label="Delete conversation">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                `;

                item.addEventListener('click', (e) => {
                    if (e.target.closest('.ai-history-item-delete')) return;
                    loadConversationIntoChat(conv.id);
                });
                item.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        loadConversationIntoChat(conv.id);
                    }
                });

                const delBtn = item.querySelector('.ai-history-item-delete');
                delBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    deleteConversation(conv.id);
                    renderHistoryList();
                });

                r.historyList.appendChild(item);
            });
        }

        function replayMessage(msg) {
            if (msg.role === 'user') {
                appendMessage('user', msg.html || '');
                return;
            }
            const opts = {};
            if (msg.emptySuggest) opts.emptySuggest = msg.emptySuggest;
            if (Array.isArray(msg.eventIds) && msg.eventIds.length) {
                const events = getEvents();
                const resolved = msg.eventIds.map(id => events.find(e => e.id === id)).filter(Boolean);
                if (resolved.length) opts.events = resolved;
            }
            appendMessage('ai', msg.html || '', opts);
        }

        function loadConversationIntoChat(id) {
            const r = refs();
            const all = loadConversations();
            const conv = all.find(c => c.id === id);
            if (!conv) return;

            state.currentConvId = id;
            state.history = [];
            r.messages.innerHTML = '';
            r.chips.innerHTML = '';

            (conv.messages || []).forEach(m => replayMessage(m));

            // Restore follow-up chips from last AI message (if any)
            const lastAi = [...(conv.messages || [])].reverse().find(m => m.role === 'ai');
            if (lastAi && Array.isArray(lastAi.followUps) && lastAi.followUps.length) {
                renderChips(lastAi.followUps);
                state.lastFollowUps = lastAi.followUps;
            }

            showChatView();
            setTimeout(() => r.input.focus(), 50);
        }

        function openAssistant(initialPrompt) {
            const r = refs();
            if (!r.overlay) return;
            r.overlay.hidden = false;
            document.body.classList.add('ai-open');
            if (r.root) r.root.dataset.state = 'open';
            state.opened = true;
            showChatView();

            setTimeout(() => {
                if (initialPrompt) {
                    submitPrompt(initialPrompt);
                } else {
                    r.input.focus();
                }
            }, 150);
        }

        function closeAssistant() {
            const r = refs();
            if (!r.overlay) return;
            r.overlay.hidden = true;
            document.body.classList.remove('ai-open');
            if (r.root) r.root.dataset.state = 'collapsed';
            state.opened = false;
        }

        function resetConversation() {
            const r = refs();
            r.messages.innerHTML = '';
            r.chips.innerHTML = '';
            state.history = [];
            state.lastQuery = null;
            state.currentConvId = null;
            state.lastFollowUps = [];
            restoreWelcome();
            showChatView();
            r.input.focus();
        }

        // ---------- Discovery nudge (one-time) ----------
        const NUDGE_KEY = 'eventia_ai_nudge_dismissed';

        function dismissNudge() {
            const r = refs();
            if (r.sparkleNudge) r.sparkleNudge.hidden = true;
            try { localStorage.setItem(NUDGE_KEY, '1'); } catch (_) {}
        }

        function initNudge() {
            const r = refs();
            if (!r.sparkleNudge) return;
            const wasDismissed = localStorage.getItem(NUDGE_KEY) === '1';
            if (wasDismissed) {
                r.sparkleNudge.hidden = true;
                return;
            }
            r.sparkleNudge.hidden = false;
            if (r.nudgeCloseBtn) {
                r.nudgeCloseBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    dismissNudge();
                });
            }
        }

        // ---------- Wiring ----------
        function init() {
            const r = refs();
            if (!r.root) return;

            if (r.sparkleBtn) {
                r.sparkleBtn.addEventListener('click', () => {
                    const typed = (r.searchInput && r.searchInput.value || '').trim();
                    dismissNudge();
                    openAssistant(typed || null);
                });
            }

            const hintLink = document.getElementById('ai-hint-link');
            if (hintLink) {
                hintLink.addEventListener('click', () => {
                    dismissNudge();
                    openAssistant(null);
                });
            }

            initNudge();

            r.closeBtn.addEventListener('click', closeAssistant);
            r.resetBtn.addEventListener('click', resetConversation);

            if (r.historyBtn) {
                r.historyBtn.addEventListener('click', toggleHistoryView);
            }
            if (r.historyClearBtn) {
                r.historyClearBtn.addEventListener('click', () => {
                    if (!confirm('Clear all past conversations? This cannot be undone.')) return;
                    clearAllConversations();
                    renderHistoryList();
                });
            }

            if (r.backdrop) {
                r.backdrop.addEventListener('click', closeAssistant);
            }

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && state.opened) {
                    e.preventDefault();
                    closeAssistant();
                }
            });

            r.form.addEventListener('submit', (e) => {
                e.preventDefault();
                submitPrompt(r.input.value);
            });

            r.input.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    closeAssistant();
                }
            });

            r.messages.addEventListener('click', (e) => {
                const viewBtn = e.target.closest('[data-view-event]');
                if (viewBtn) {
                    e.stopPropagation();
                    const id = viewBtn.dataset.viewEvent;
                    if (typeof window.viewEventDetails === 'function') window.viewEventDetails(id);
                    return;
                }
                const card = e.target.closest('.ai-event-card');
                if (card) {
                    const id = card.dataset.eventId;
                    if (typeof window.viewEventDetails === 'function') window.viewEventDetails(id);
                }
            });
            r.messages.addEventListener('keydown', (e) => {
                if (e.key !== 'Enter' && e.key !== ' ') return;
                const card = e.target.closest('.ai-event-card');
                if (card) {
                    e.preventDefault();
                    const id = card.dataset.eventId;
                    if (typeof window.viewEventDetails === 'function') window.viewEventDetails(id);
                }
            });
        }

        return {
            init,
            open: openAssistant,
            close: closeAssistant,
            ask: submitPrompt
        };
    })();

    window.openAIAssistant = AIAssistant.open;
    window.askAIAssistant = AIAssistant.ask;

    // --- INIT ---
    localStorage.removeItem(READ_NOTIFS_KEY); // Just reset read status to test unread badge
    seedAttendeeData();
    loadProfile();
    renderAll();
    initNotifications();
    AIAssistant.init();

})();

