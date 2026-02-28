/**
 * ATTENDEE PAGE LOGIC
 * Handles all FR3.0 features: Browse, Register, Tickets, Profile, History, Feedback
 */

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
            const isRegistered = registrations.some(r => r.eventId === evt.id);
            const priceDisplay = evt.price && parseInt(evt.price) > 0 ? `From ${evt.price} SR` : 'Free';

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
        const isRegistered = registrations.some(r => r.eventId === evt.id);

        let ticketInfo = '<div style="color: #2e7d32; font-weight: 600;"><i class="fa-solid fa-ticket" style="margin-right: 6px;"></i>Free Event</div>';
        if (evt.price && parseInt(evt.price) > 0) {
            if (evt.tickets && evt.tickets.length > 0) {
                ticketInfo = evt.tickets.map(t =>
                    `<div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                        <span>${t.name}</span><strong>${t.price} SAR</strong>
                    </div>`
                ).join('');
            } else {
                ticketInfo = `<div style="color: #1976d2; font-weight: 600;"><i class="fa-solid fa-ticket" style="margin-right: 6px;"></i>${evt.price} SAR</div>`;
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
                `<option value="${t.name}|${t.price}">${t.name} - ${parseInt(t.price) > 0 ? t.price + ' SAR' : 'Free'}</option>`
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
                                <span id="reg-price-display" style="font-size:1.1rem;font-weight:700;color:#004e92;">${basePrice > 0 ? basePrice + ' SAR' : 'Free'}</span>
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
        if (priceEl) priceEl.textContent = p > 0 ? p + ' SAR' : 'Free';
        if (summaryTicket) summaryTicket.textContent = name + ' ticket';
        if (summaryPrice) summaryPrice.textContent = p > 0 ? p + ' SAR' : 'Free';
        if (summaryTotal) summaryTotal.textContent = p > 0 ? p + ' SAR' : 'Free';
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
            if (rcAmount) rcAmount.textContent = p > 0 ? p + ' SAR' : 'Free';

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
        const filtered = regs.filter(r => r.id !== regId);
        saveRegistrations(filtered);
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

    // Nav link click handlers (view switching)
    document.querySelectorAll('.att-nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const viewName = link.dataset.view;
            const scrollTo = link.dataset.scroll || null;
            switchAttendeeView(viewName, scrollTo);
        });
    });

    // Logo click -> home
    const logo = document.getElementById('nav-logo');
    if (logo) {
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            switchAttendeeView('home');
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

    // --- INIT ---
    localStorage.removeItem(READ_NOTIFS_KEY); // Just reset read status to test unread badge
    seedAttendeeData();
    loadProfile();
    renderAll();
    initNotifications();

})();

