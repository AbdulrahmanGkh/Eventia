/* ===================================================================
   ORGANIZER ANALYTICS  (redesigned)
   KPI cards  →  highlight cards  →  tab-based single chart
   + Per-event report renderer
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    let activeChart = null;
    let activeEvtChart = null;
    let currentTab = 'attendance';
    let currentEvtTab = 'revenue-tier';
    let cachedData = null;

    const PALETTE = {
        primary: '#004e92',
        light:   '#4dabf7',
        teal:    '#00b894',
        purple:  '#6c5ce7',
        muted:   '#636e72',
        amber:   '#e17055'
    };

    const PIE_COLORS = [
        '#004e92', '#00b894', '#6c5ce7', '#e17055', '#fdcb6e',
        '#e84393', '#0984e3', '#00cec9', '#d63031', '#6ab04c',
        '#f9ca24', '#eb4d4b', '#22a6b3', '#7ed6df', '#b8e994',
        '#f8a5c2', '#778beb', '#cf6a87', '#574b90', '#e77f67'
    ];

    const CHART_TEXT = {
        primary:   '#2d3436',
        secondary: '#636e72',
        grid:      'rgba(0,0,0,0.06)'
    };

    function tip() {
        return {
            backgroundColor: '#ffffff',
            titleFont: { family: 'Inter', size: 13, weight: '600' },
            titleColor: '#2d3436',
            bodyFont:  { family: 'Inter', size: 12 },
            bodyColor: '#636e72',
            borderColor: '#e0e8f0',
            borderWidth: 1,
            padding: 10, cornerRadius: 8, displayColors: true, boxPadding: 4
        };
    }

    function trunc(s, n) { return !s ? '' : s.length > n ? s.slice(0, n - 1) + '…' : s; }

    /* ----------------------------------------------------------
       DATA LOADERS
    ---------------------------------------------------------- */
    function loadData() {
        return {
            events:        JSON.parse(localStorage.getItem('eventia_events_db')          || '[]'),
            vendors:       JSON.parse(localStorage.getItem('eventia_vendors_db')         || '[]'),
            eventVendors:  JSON.parse(localStorage.getItem('eventia_event_vendors')      || '[]'),
            requests:      JSON.parse(localStorage.getItem('eventia_requests_db')        || '[]'),
            messages:      JSON.parse(localStorage.getItem('eventia_messages')           || '[]'),
            broadcasts:    JSON.parse(localStorage.getItem('eventia_broadcasts')         || '[]'),
            registrations: JSON.parse(localStorage.getItem('eventia_all_registrations')  || '[]')
        };
    }

    /* ----------------------------------------------------------
       HELPERS  –  age group from birthday
    ---------------------------------------------------------- */
    function ageGroupFromBirthday(birthday) {
        if (!birthday) return null;
        const birth = new Date(birthday);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        if (age < 18)  return 'Under 18';
        if (age <= 24)  return '18–24';
        if (age <= 34)  return '25–34';
        if (age <= 44)  return '35–44';
        if (age <= 54)  return '45–54';
        return '55+';
    }

    /* ----------------------------------------------------------
       KPIs  (overview dashboard)
    ---------------------------------------------------------- */
    function renderKPIs(d) {
        const totalEvents   = d.events.length;
        const totalAtt      = d.events.reduce((s, e) => s + (e.attendees || 0), 0);
        const totalRevenue  = d.events.reduce((s, e) => {
            const minP = Math.min(...(e.tickets || []).map(t => parseFloat(t.price) || 0));
            return s + (e.attendees || 0) * minP;
        }, 0);
        const eventsWithAtt = d.events.filter(e => e.attendees > 0);
        const avgAtt        = eventsWithAtt.length ? Math.round(totalAtt / eventsWithAtt.length) : 0;

        const vendorWD = d.requests.filter(r =>
            r.rejectionReason && r.rejectionReason.startsWith('Withdrawn by Vendor')
        ).length;
        const attendeeWD = d.registrations.filter(r => r.status === 'Withdrawn').length;

        setText('kpi-total-events',        totalEvents);
        setText('kpi-total-attendees',     totalAtt.toLocaleString());
        const revenueEl = document.getElementById('kpi-total-revenue');
        if (revenueEl) revenueEl.innerHTML = totalRevenue.toLocaleString() + ' ' + SAR_ICON;
        setText('kpi-avg-attendance',      avgAtt.toLocaleString());
        setText('kpi-vendor-withdrawals',  vendorWD);
        setText('kpi-attendee-withdrawals', attendeeWD);
    }

    /* ----------------------------------------------------------
       HIGHLIGHT CARDS
    ---------------------------------------------------------- */
    function renderHighlights(d) {
        const sorted = [...d.events].filter(e => e.attendees > 0).sort((a, b) => b.attendees - a.attendees);
        const topEvt = sorted[0];
        setText('highlight-top-event', topEvt
            ? `${trunc(topEvt.title, 24)} — ${topEvt.attendees.toLocaleString()} attendees`
            : 'No data yet');

        const vendorMap = {};
        d.vendors.forEach(v => { vendorMap[v.id] = v; });
        const catCount = {};
        d.eventVendors.forEach(ev => {
            const v = vendorMap[ev.vendorId];
            if (!v) return;
            const cat = v.category || 'Other';
            catCount[cat] = (catCount[cat] || 0) + 1;
        });
        const topService = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0];
        setText('highlight-top-service', topService
            ? `${topService[0]} — ${topService[1]} booking${topService[1] !== 1 ? 's' : ''}`
            : 'No data yet');

        const catAtt = {};
        d.events.forEach(e => {
            if (!e.category) return;
            catAtt[e.category] = (catAtt[e.category] || 0) + (e.attendees || 0);
        });
        const bestCat = Object.entries(catAtt).sort((a, b) => b[1] - a[1])[0];
        setText('highlight-top-category', bestCat
            ? `${bestCat[0]} — ${bestCat[1].toLocaleString()} attendees`
            : 'No data yet');
    }

    /* ----------------------------------------------------------
       TAB SWITCHING  (overview)
    ---------------------------------------------------------- */
    function initTabs() {
        document.querySelectorAll('[data-ana-tab]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-ana-tab]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentTab = btn.dataset.anaTab;
                renderCurrentChart();
            });
        });
    }

    function renderCurrentChart() {
        if (!cachedData) return;
        if (activeChart) { activeChart.destroy(); activeChart = null; }
        const ctx = document.getElementById('ana-chart-canvas');
        if (!ctx) return;

        switch (currentTab) {
            case 'attendance':  activeChart = chartAttendance(ctx, cachedData); break;
            case 'revenue':     activeChart = chartRevenue(ctx, cachedData);    break;
            case 'services':    activeChart = chartServices(ctx, cachedData);   break;
            case 'categories':  activeChart = chartCategories(ctx, cachedData); break;
            case 'age-groups':  activeChart = chartAgeGroups(ctx, cachedData);  break;
        }
    }

    /* ----------------------------------------------------------
       CHART BUILDERS  (overview)
    ---------------------------------------------------------- */
    function chartAttendance(ctx, d) {
        const sorted = [...d.events].filter(e => e.attendees > 0).sort((a, b) => b.attendees - a.attendees);
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sorted.map(e => trunc(e.title, 22)),
                datasets: [{
                    label: 'Attendees',
                    data: sorted.map(e => e.attendees),
                    backgroundColor: PALETTE.primary,
                    borderRadius: 6, barPercentage: 0.65
                }]
            },
            options: barOpts(false, c => `${c.raw.toLocaleString()} attendees`, 'Attendance by Event', 'Number of Attendees', 'Event')
        });
    }

    function chartRevenue(ctx, d) {
        const sorted = [...d.events].filter(e => e.attendees > 0).sort((a, b) => b.attendees - a.attendees);
        const data = sorted.map(e => {
            const min = Math.min(...(e.tickets || []).map(t => parseFloat(t.price) || 0));
            return e.attendees * min;
        });
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sorted.map(e => trunc(e.title, 22)),
                datasets: [{
                    label: 'Revenue (SAR)',
                    data,
                    backgroundColor: PALETTE.teal,
                    borderRadius: 6, barPercentage: 0.65
                }]
            },
            options: barOpts(false, c => `${c.raw.toLocaleString()} SAR`, 'Revenue by Event', 'Revenue (SAR)', 'Event')
        });
    }

    function chartServices(ctx, d) {
        const vendorMap = {};
        d.vendors.forEach(v => { vendorMap[v.id] = v; });
        const catCount = {};
        d.eventVendors.forEach(ev => {
            const v = vendorMap[ev.vendorId];
            if (!v) return;
            const cat = v.category || 'Other';
            catCount[cat] = (catCount[cat] || 0) + 1;
        });
        const entries = Object.entries(catCount).sort((a, b) => b[1] - a[1]);
        const total = entries.reduce((s, e) => s + e[1], 0);
        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: entries.map(e => e[0]),
                datasets: [{
                    data: entries.map(e => e[1]),
                    backgroundColor: entries.map((_, i) => PIE_COLORS[i % PIE_COLORS.length]),
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            },
            plugins: [ChartDataLabels],
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: { family: 'Inter', size: 12 }, padding: 14, usePointStyle: true, color: CHART_TEXT.primary,
                            generateLabels: chart => {
                                const data = chart.data;
                                return data.labels.map((label, i) => {
                                    const val = data.datasets[0].data[i];
                                    const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                                    return {
                                        text: `${label}  (${pct}%)`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        strokeStyle: '#fff',
                                        lineWidth: 2,
                                        pointStyle: 'circle',
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                        }
                    },
                    tooltip: { ...tip(), callbacks: { label: c => {
                        const pct = total > 0 ? ((c.raw / total) * 100).toFixed(1) : 0;
                        return ` ${c.label}: ${c.raw} booking${c.raw !== 1 ? 's' : ''} (${pct}%)`;
                    }}},
                    datalabels: {
                        color: '#fff',
                        font: { family: 'Inter', weight: '600', size: 13 },
                        formatter: (value) => {
                            const pct = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return pct >= 5 ? pct + '%' : '';
                        },
                        anchor: 'center',
                        align: 'center',
                        textShadowBlur: 4,
                        textShadowColor: 'rgba(0,0,0,0.3)'
                    }
                }
            }
        });
    }

    function chartCategories(ctx, d) {
        const catMap = {};
        d.events.forEach(e => {
            if (!e.category) return;
            catMap[e.category] = (catMap[e.category] || 0) + (e.attendees || 0);
        });
        const entries = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
        const colors = [PALETTE.primary, PALETTE.light, PALETTE.teal, PALETTE.purple, PALETTE.muted];
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: entries.map(e => e[0]),
                datasets: [{
                    label: 'Total Attendees',
                    data: entries.map(e => e[1]),
                    backgroundColor: entries.map((_, i) => colors[i % colors.length]),
                    borderRadius: 8, barPercentage: 0.65
                }]
            },
            options: barOpts(true, c => `${c.raw.toLocaleString()} attendees`, 'Attendees by Category', 'Category', 'Total Attendees')
        });
    }

    function chartAgeGroups(ctx, d) {
        const groupOrder = ['Under 18', '18–24', '25–34', '35–44', '45–54', '55+'];
        const counts = {};
        groupOrder.forEach(g => { counts[g] = 0; });
        d.registrations.forEach(r => {
            if (r.status === 'Withdrawn') return;
            const g = ageGroupFromBirthday(r.birthday);
            if (g && counts[g] !== undefined) counts[g]++;
        });
        const colors = [PALETTE.light, PALETTE.primary, PALETTE.teal, PALETTE.purple, PALETTE.muted, PALETTE.amber];
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: groupOrder,
                datasets: [{
                    label: 'Attendees',
                    data: groupOrder.map(g => counts[g]),
                    backgroundColor: colors,
                    borderRadius: 8, barPercentage: 0.65
                }]
            },
            options: barOpts(true, c => `${c.raw} attendees`, 'Attendees by Age Group', 'Age Group', 'Number of Attendees')
        });
    }

    /* ----------------------------------------------------------
       SHARED CHART OPTIONS
    ---------------------------------------------------------- */
    function barOpts(vertical, labelCb, title, xLabel, yLabel) {
        const axis = vertical ? {} : { indexAxis: 'y' };
        return {
            ...axis,
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { ...tip(), callbacks: { label: labelCb } },
                datalabels: { display: false },
                title: {
                    display: !!title,
                    text: title || '',
                    font: { family: 'Inter', size: 15, weight: '600' },
                    color: CHART_TEXT.primary,
                    padding: { bottom: 16 }
                }
            },
            scales: {
                x: {
                    grid: { color: vertical ? 'transparent' : CHART_TEXT.grid },
                    ticks: { font: { family: 'Inter', size: 11 }, color: CHART_TEXT.primary },
                    beginAtZero: true,
                    title: {
                        display: !!xLabel,
                        text: xLabel || '',
                        font: { family: 'Inter', size: 12, weight: '500' },
                        color: CHART_TEXT.secondary,
                        padding: { top: 8 }
                    }
                },
                y: {
                    grid: { color: vertical ? CHART_TEXT.grid : 'transparent' },
                    ticks: { font: { family: 'Inter', size: 11 }, color: CHART_TEXT.secondary },
                    beginAtZero: true,
                    title: {
                        display: !!yLabel,
                        text: yLabel || '',
                        font: { family: 'Inter', size: 12, weight: '500' },
                        color: CHART_TEXT.secondary,
                        padding: { bottom: 8 }
                    }
                }
            }
        };
    }

    /* ----------------------------------------------------------
       PER-EVENT REPORT  (on analytics page)
       Dropdown selector  →  KPIs + tabbed charts
    ---------------------------------------------------------- */
    let selectedEventId = null;

    function populateEventDropdown(events) {
        const sel = document.getElementById('ana-event-select');
        if (!sel) return;
        sel.innerHTML = '<option value="">— Choose an event —</option>';
        events.forEach(e => {
            const opt = document.createElement('option');
            opt.value = e.id;
            opt.textContent = e.title;
            sel.appendChild(opt);
        });
    }

    function initEventSelector() {
        const sel = document.getElementById('ana-event-select');
        if (!sel) return;
        sel.addEventListener('change', () => {
            selectedEventId = sel.value || null;
            const body = document.getElementById('ana-event-report-body');
            const placeholder = document.getElementById('ana-event-report-placeholder');
            if (!selectedEventId) {
                if (body) body.style.display = 'none';
                if (placeholder) placeholder.style.display = '';
                return;
            }
            if (body) body.style.display = '';
            if (placeholder) placeholder.style.display = 'none';
            renderEventReport(selectedEventId);
        });
    }

    function renderEventReport(eventId) {
        const d = loadData();
        const evt = d.events.find(e => e.id === eventId);
        if (!evt) return;

        const allRegs     = d.registrations.filter(r => r.eventId === eventId);
        const activeRegs  = allRegs.filter(r => r.status !== 'Withdrawn');
        const attendeeWD  = allRegs.filter(r => r.status === 'Withdrawn').length;

        const totalRevenue = activeRegs.reduce((s, r) => s + (parseFloat(r.ticketPrice) || 0), 0);

        const retention = allRegs.length > 0
            ? Math.round((activeRegs.length / allRegs.length) * 100) + '%'
            : '--';

        const evVendors   = d.eventVendors.filter(v => v.eventId === eventId);
        const confirmed   = evVendors.filter(v => v.status === 'Confirmed');
        const vendorWD    = d.requests.filter(r =>
            r.eventId === eventId && r.rejectionReason && r.rejectionReason.startsWith('Withdrawn by Vendor')
        ).length;

        setText('ana-evt-title-name', evt.title);
        setText('ana-evt-title-date', evt.date || 'No date');
        setText('ana-evt-title-category', evt.category || 'Uncategorized');
        setText('ana-evt-title-status', evt.status || 'Active');

        setText('ana-evt-kpi-attendees',   activeRegs.length.toLocaleString());
        const evtRevenueEl = document.getElementById('ana-evt-kpi-revenue');
        if (evtRevenueEl) evtRevenueEl.innerHTML = totalRevenue.toLocaleString() + ' ' + SAR_ICON;
        setText('ana-evt-kpi-retention',   retention);
        setText('ana-evt-kpi-vendors',     confirmed.length);
        setText('ana-evt-kpi-vendor-wd',   vendorWD);
        setText('ana-evt-kpi-attendee-wd', attendeeWD);

        currentEvtTab = 'revenue-tier';
        document.querySelectorAll('[data-ana-evt-tab]').forEach(b => b.classList.remove('active'));
        const firstTab = document.querySelector('[data-ana-evt-tab="revenue-tier"]');
        if (firstTab) firstTab.classList.add('active');

        renderEvtChart(eventId, d);
    }

    function initEvtTabs() {
        document.querySelectorAll('[data-ana-evt-tab]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-ana-evt-tab]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentEvtTab = btn.dataset.anaEvtTab;
                if (selectedEventId) renderEvtChart(selectedEventId, loadData());
            });
        });
    }

    function renderEvtChart(eventId, d) {
        if (activeEvtChart) { activeEvtChart.destroy(); activeEvtChart = null; }
        const ctx = document.getElementById('ana-evt-report-chart-canvas');
        if (!ctx) return;

        switch (currentEvtTab) {
            case 'revenue-tier':    activeEvtChart = evtChartRevenueTier(ctx, eventId, d);   break;
            case 'age-groups':      activeEvtChart = evtChartAgeGroups(ctx, eventId, d);     break;
            case 'reg-timeline':    activeEvtChart = evtChartRegTimeline(ctx, eventId, d);   break;
            case 'vendor-services': activeEvtChart = evtChartVendorServices(ctx, eventId, d); break;
        }
    }

    function evtChartRevenueTier(ctx, eventId, d) {
        const evt = d.events.find(e => e.id === eventId);
        if (!evt || !evt.tickets || evt.tickets.length === 0) return null;

        const regs = d.registrations.filter(r => r.eventId === eventId && r.status !== 'Withdrawn');
        const tierRevenue = {};
        const tierCount = {};
        evt.tickets.forEach(t => { tierRevenue[t.name] = 0; tierCount[t.name] = 0; });
        regs.forEach(r => {
            if (r.ticketType && tierRevenue[r.ticketType] !== undefined) {
                tierRevenue[r.ticketType] += parseFloat(r.ticketPrice) || 0;
                tierCount[r.ticketType]++;
            }
        });

        const labels = evt.tickets.map(t => t.name);
        const colors = [PALETTE.primary, PALETTE.light, PALETTE.teal, PALETTE.purple, PALETTE.muted];
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Revenue (SAR)',
                    data: labels.map(l => tierRevenue[l] || 0),
                    backgroundColor: labels.map((_, i) => colors[i % colors.length]),
                    borderRadius: 8, barPercentage: 0.55
                }]
            },
            options: barOpts(true, c => `${c.raw.toLocaleString()} SAR`, 'Revenue by Ticket Tier', 'Ticket Tier', 'Revenue (SAR)')
        });
    }

    function evtChartAgeGroups(ctx, eventId, d) {
        const regs = d.registrations.filter(r => r.eventId === eventId && r.status !== 'Withdrawn');
        const groupOrder = ['Under 18', '18–24', '25–34', '35–44', '45–54', '55+'];
        const counts = {};
        groupOrder.forEach(g => { counts[g] = 0; });
        regs.forEach(r => {
            const g = ageGroupFromBirthday(r.birthday);
            if (g && counts[g] !== undefined) counts[g]++;
        });
        const colors = [PALETTE.light, PALETTE.primary, PALETTE.teal, PALETTE.purple, PALETTE.muted, PALETTE.amber];
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: groupOrder,
                datasets: [{
                    label: 'Attendees',
                    data: groupOrder.map(g => counts[g]),
                    backgroundColor: colors,
                    borderRadius: 8, barPercentage: 0.65
                }]
            },
            options: barOpts(true, c => `${c.raw} attendee${c.raw !== 1 ? 's' : ''}`, 'Attendees by Age Group', 'Age Group', 'Number of Attendees')
        });
    }

    function evtChartRegTimeline(ctx, eventId, d) {
        const regs = d.registrations.filter(r => r.eventId === eventId && r.registeredDate);
        if (regs.length === 0) return null;

        const sorted = [...regs].sort((a, b) => a.registeredDate.localeCompare(b.registeredDate));
        const dateMap = {};
        sorted.forEach(r => {
            dateMap[r.registeredDate] = (dateMap[r.registeredDate] || 0) + 1;
        });

        const dates = Object.keys(dateMap).sort();
        let cumulative = 0;
        const cumulativeData = dates.map(dt => {
            cumulative += dateMap[dt];
            return cumulative;
        });

        const shortLabels = dates.map(dt => {
            const parts = dt.split('-');
            return parts[1] + '/' + parts[2];
        });

        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: shortLabels,
                datasets: [{
                    label: 'Total Registrations',
                    data: cumulativeData,
                    borderColor: PALETTE.primary,
                    backgroundColor: 'rgba(0, 78, 146, 0.08)',
                    fill: true,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: PALETTE.primary,
                    borderWidth: 2.5,
                    tension: 0.35
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { ...tip(), callbacks: { label: c => `${c.raw} total registration${c.raw !== 1 ? 's' : ''}` } },
                    datalabels: { display: false },
                    title: {
                        display: true,
                        text: 'Registration Timeline',
                        font: { family: 'Inter', size: 15, weight: '600' },
                        color: CHART_TEXT.primary,
                        padding: { bottom: 16 }
                    }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11 }, color: CHART_TEXT.primary, maxRotation: 45 }, title: { display: true, text: 'Date', font: { family: 'Inter', size: 12, weight: '500' }, color: CHART_TEXT.secondary, padding: { top: 8 } } },
                    y: { grid: { color: CHART_TEXT.grid }, ticks: { font: { family: 'Inter', size: 11 }, color: CHART_TEXT.secondary, stepSize: 1 }, beginAtZero: true, title: { display: true, text: 'Total Registrations', font: { family: 'Inter', size: 12, weight: '500' }, color: CHART_TEXT.secondary, padding: { bottom: 8 } } }
                }
            }
        });
    }

    function evtChartVendorServices(ctx, eventId, d) {
        const evVendors = d.eventVendors.filter(v => v.eventId === eventId && v.status === 'Confirmed');
        const vendorMap = {};
        d.vendors.forEach(v => { vendorMap[v.id] = v; });

        const catCount = {};
        evVendors.forEach(ev => {
            const v = vendorMap[ev.vendorId];
            if (!v) return;
            const cat = v.category || 'Other';
            catCount[cat] = (catCount[cat] || 0) + 1;
        });

        const entries = Object.entries(catCount).sort((a, b) => b[1] - a[1]);
        if (entries.length === 0) return null;

        const total = entries.reduce((s, e) => s + e[1], 0);
        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: entries.map(e => e[0]),
                datasets: [{
                    data: entries.map(e => e[1]),
                    backgroundColor: entries.map((_, i) => PIE_COLORS[i % PIE_COLORS.length]),
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            },
            plugins: [ChartDataLabels],
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: { family: 'Inter', size: 12 }, padding: 14, usePointStyle: true, color: CHART_TEXT.primary,
                            generateLabels: chart => {
                                const data = chart.data;
                                return data.labels.map((label, i) => {
                                    const val = data.datasets[0].data[i];
                                    const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                                    return {
                                        text: `${label}  (${pct}%)`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        strokeStyle: '#fff',
                                        lineWidth: 2,
                                        pointStyle: 'circle',
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                        }
                    },
                    tooltip: { ...tip(), callbacks: { label: c => {
                        const pct = total > 0 ? ((c.raw / total) * 100).toFixed(1) : 0;
                        return ` ${c.label}: ${c.raw} vendor${c.raw !== 1 ? 's' : ''} (${pct}%)`;
                    }}},
                    datalabels: {
                        color: '#fff',
                        font: { family: 'Inter', weight: '600', size: 13 },
                        formatter: (value) => {
                            const pct = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return pct >= 5 ? pct + '%' : '';
                        },
                        anchor: 'center',
                        align: 'center',
                        textShadowBlur: 4,
                        textShadowColor: 'rgba(0,0,0,0.3)'
                    }
                }
            }
        });
    }

    /* ----------------------------------------------------------
       UTILITIES
    ---------------------------------------------------------- */
    function setText(id, val) {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    }

    /* ----------------------------------------------------------
       MAIN-LEVEL TAB SWITCHING  (Overview ↔ Event Report)
    ---------------------------------------------------------- */
    function initMainTabs() {
        document.querySelectorAll('[data-ana-main]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-ana-main]').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.ana-main-panel').forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                const panel = document.getElementById('ana-panel-' + btn.dataset.anaMain);
                if (panel) panel.classList.add('active');

                if (btn.dataset.anaMain === 'event-report') {
                    populateEventDropdown(loadData().events);
                }
            });
        });
    }

    /* ----------------------------------------------------------
       PDF EXPORT  (raster: sharper capture + layout boost for charts/KPIs)
    ---------------------------------------------------------- */
    function pdfRefreshChartsInTarget(root) {
        if (!root) return;
        if (root.querySelector('#ana-evt-report-chart-canvas') && activeEvtChart) {
            try {
                activeEvtChart.resize();
                activeEvtChart.update('none');
            } catch (e) { /* ignore */ }
        }
        if (root.querySelector('#ana-chart-canvas') && activeChart) {
            try {
                activeChart.resize();
                activeChart.update('none');
            } catch (e) { /* ignore */ }
        }
    }

    function pdfActivateCaptureLayout(root) {
        const shell = root && root.closest('.analytics-dashboard');
        if (shell) shell.classList.add('pdf-export-capture-pdf');
    }

    function pdfDeactivateCaptureLayout(root) {
        const shell = root && root.closest('.analytics-dashboard');
        if (shell) shell.classList.remove('pdf-export-capture-pdf');
        pdfRefreshChartsInTarget(root);
    }

    function pdfWaitForLayoutStable() {
        const fontsReady = document.fonts && document.fonts.ready
            ? document.fonts.ready.catch(() => {})
            : Promise.resolve();
        return fontsReady.then(() => new Promise(resolve => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setTimeout(resolve, 300);
                });
            });
        }));
    }

    function exportPDF(targetEl, filename, triggerBtn) {
        const btn = triggerBtn || null;

        function resetExportButton() {
            if (!btn) return;
            btn.disabled = false;
            const isOverview = targetEl && targetEl.id === 'ana-panel-overview';
            btn.innerHTML = isOverview
                ? '<i class="fa-solid fa-file-pdf"></i> Export Overview PDF'
                : '<i class="fa-solid fa-file-pdf"></i> Export PDF';
        }

        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating…';
        }

        if (window.location.protocol === 'file:') {
            alert(
                'PDF export does not work when you open the page as a local file (address bar shows file:///…).\n\n' +
                'Run a small web server in your project folder, then use http://localhost instead. Example:\n\n' +
                '  cd your-project-folder\n' +
                '  python3 -m http.server 8080\n\n' +
                'Open: http://localhost:8080/organizer-dashboard.html'
            );
            resetExportButton();
            return;
        }

        const jspdfMod = window.jspdf;
        const JsPDF = jspdfMod && (jspdfMod.jsPDF || jspdfMod);
        if (typeof JsPDF !== 'function') {
            alert('PDF library did not load. Check your network, refresh the page, and open the site over http(s), not file://.');
            resetExportButton();
            return;
        }
        if (typeof html2canvas !== 'function') {
            alert('Screenshot helper did not load. Refresh the page and try again.');
            resetExportButton();
            return;
        }

        const captureMs = 90000;
        const canvasScale = Math.min(3, Math.max(2.35, (window.devicePixelRatio || 1) * 2.25));
        const canvasOpts = {
            scale: canvasScale,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#f5f8fc',
            logging: false,
            foreignObjectRendering: false,
            imageTimeout: 15000
        };

        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Screenshot timed out.')), captureMs);
        });

        pdfActivateCaptureLayout(targetEl);

        pdfWaitForLayoutStable()
            .then(() => {
                pdfRefreshChartsInTarget(targetEl);
                return new Promise(resolve => {
                    requestAnimationFrame(() => {
                        pdfRefreshChartsInTarget(targetEl);
                        resolve();
                    });
                });
            })
            .then(() => Promise.race([html2canvas(targetEl, canvasOpts), timeoutPromise]))
            .then(canvas => {
                if (!canvas.width || !canvas.height) {
                    throw new Error('Empty screenshot.');
                }
                let imgData;
                try {
                    imgData = canvas.toDataURL('image/png');
                } catch (e) {
                    throw new Error('Could not read the page image (often blocked when opening the file directly).');
                }
                const imgW = canvas.width;
                const imgH = canvas.height;

                const pdfW = 210;
                const margin = 12;
                const contentW = pdfW - margin * 2;
                const contentH = (imgH * contentW) / imgW;

                const pdf = new JsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });

                const titleEl = targetEl.querySelector('#ana-evt-title-name');
                const eventName = titleEl && titleEl.textContent ? titleEl.textContent.trim() : '';
                const metaTitle = eventName ? `Eventia — ${eventName}` : 'Eventia analytics report';
                try {
                    pdf.setProperties({
                        title: metaTitle,
                        subject: 'Exported from Eventia organizer dashboard',
                        creator: 'Eventia'
                    });
                } catch (e) { /* ignore */ }

                const pageH = pdf.internal.pageSize.getHeight() - margin * 2;
                let yOffset = 0;

                while (yOffset < contentH) {
                    if (yOffset > 0) pdf.addPage();

                    pdf.addImage(
                        imgData, 'PNG',
                        margin,
                        margin - yOffset,
                        contentW,
                        contentH
                    );
                    yOffset += pageH;
                }

                pdf.save(filename);
            })
            .catch(err => {
                console.error('PDF export failed:', err);
                const hint =
                    err && err.message
                        ? '\n\nDetails: ' + err.message
                        : '';
                alert(
                    'Could not generate PDF. If the address bar shows file:///, serve the project over http://localhost instead (see python3 -m http.server).' +
                    hint
                );
            })
            .finally(() => {
                pdfDeactivateCaptureLayout(targetEl);
                resetExportButton();
            });
    }

    function initExportButtons() {
        const overviewBtn = document.getElementById('ana-overview-export-pdf');
        if (overviewBtn) {
            overviewBtn.addEventListener('click', (e) => {
                const panel = document.getElementById('ana-panel-overview');
                if (panel) exportPDF(panel, 'Eventia_Overview_Report.pdf', e.currentTarget);
            });
        }

        const evtBtn = document.getElementById('ana-evt-export-pdf');
        if (evtBtn) {
            evtBtn.addEventListener('click', (e) => {
                const body = document.getElementById('ana-event-report-body');
                const evtName = document.getElementById('ana-evt-title-name');
                const name = evtName ? evtName.textContent.replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/\s+/g, '_') : 'Event';
                if (body) exportPDF(body, 'Eventia_Report_' + name + '.pdf', e.currentTarget);
            });
        }
    }

    /* ----------------------------------------------------------
       MAIN ENTRY  –  called by switchView('analytics')
    ---------------------------------------------------------- */
    window.renderAnalytics = function () {
        cachedData = loadData();
        renderKPIs(cachedData);
        renderHighlights(cachedData);
        renderCurrentChart();
    };

    initMainTabs();
    initTabs();
    initEvtTabs();
    initEventSelector();
    initExportButtons();
});
