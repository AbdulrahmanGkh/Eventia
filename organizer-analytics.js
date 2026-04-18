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

    const BRAND_SERIES = [
        '#004e92',  // navy (brand primary)
        '#1565c0',  // azure
        '#4dabf7',  // sky (brand light)
        '#22d3ee',  // cyan
        '#14b8a6',  // teal
        '#6366f1',  // indigo
        '#8b5cf6',  // violet
        '#0ea5e9',  // sky-500 (replaces pink — stays cool-toned)
        '#f59e0b',  // amber
        '#10b981'   // emerald
    ];

    const PALETTE = {
        primary: '#004e92',
        light:   '#4dabf7',
        teal:    '#14b8a6',
        purple:  '#6366f1',
        muted:   '#8b5cf6',
        amber:   '#f59e0b'
    };

    /* Brand-forward chart theme for the Overview panel.
       Anchors in the navy→sky brand gradient and cascades cool→warm so
       the dominant series is always brand-blue and warm tones appear only
       as tertiary accents. */
    const OVERVIEW_THEME = {
        title: '#0f3558',
        label: '#587084',
        grid: 'rgba(21, 101, 192, 0.12)',
        tooltipBorder: 'rgba(21, 101, 192, 0.16)',
        // Single-series gradients (brand signature → differentiated cyan accent)
        attendanceStart: '#004e92',   // primary navy
        attendanceEnd:   '#4dabf7',   // primary sky
        revenueStart:    '#003366',   // deep navy
        revenueEnd:      '#22d3ee',   // cyan
        series: BRAND_SERIES
    };

    const PIE_COLORS = BRAND_SERIES;

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

    function overviewTip() {
        return {
            ...tip(),
            borderColor: OVERVIEW_THEME.tooltipBorder
        };
    }

    function chartGradient(chart, startColor, endColor, horizontal = false) {
        const { ctx, chartArea } = chart;
        if (!chartArea) return startColor;

        const gradient = horizontal
            ? ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0)
            : ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);

        gradient.addColorStop(0, startColor);
        gradient.addColorStop(1, endColor);
        return gradient;
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

        // Avg satisfaction from attendee survey scores
        const surveyed = d.registrations.filter(r => r.status !== 'Withdrawn' && r.satisfactionScore != null);
        const satEl = document.getElementById('highlight-avg-satisfaction');
        if (satEl) {
            if (surveyed.length > 0) {
                const avg = surveyed.reduce((s, r) => s + r.satisfactionScore, 0) / surveyed.length;
                satEl.innerHTML = `${avg.toFixed(1)} ★<br><span style="font-size:0.7rem;font-weight:500;color:#636e72">${surveyed.length} response${surveyed.length !== 1 ? 's' : ''}</span>`;
            } else {
                satEl.textContent = 'No data yet';
            }
        }
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
                    backgroundColor: c => chartGradient(c.chart, OVERVIEW_THEME.attendanceStart, OVERVIEW_THEME.attendanceEnd, true),
                    borderRadius: 8,
                    borderSkipped: false,
                    barPercentage: 0.65
                }]
            },
            options: overviewBarOpts(false, c => `${c.raw.toLocaleString()} attendees`, 'Attendance by Event', 'Number of Attendees', 'Event')
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
                    backgroundColor: c => chartGradient(c.chart, OVERVIEW_THEME.revenueStart, OVERVIEW_THEME.revenueEnd, true),
                    borderRadius: 8,
                    borderSkipped: false,
                    barPercentage: 0.65
                }]
            },
            options: overviewBarOpts(false, c => `${c.raw.toLocaleString()} SAR`, 'Revenue by Event', 'Revenue (SAR)', 'Event')
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
                    backgroundColor: entries.map((_, i) => OVERVIEW_THEME.series[i % OVERVIEW_THEME.series.length]),
                    borderColor: '#f8fbff',
                    borderWidth: 3,
                    spacing: 2,
                    hoverOffset: 10
                }]
            },
            plugins: [ChartDataLabels],
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '62%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: { family: 'Inter', size: 12 },
                            padding: 14,
                            usePointStyle: true,
                            color: OVERVIEW_THEME.title,
                            generateLabels: chart => {
                                const data = chart.data;
                                return data.labels.map((label, i) => {
                                    const val = data.datasets[0].data[i];
                                    const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                                    return {
                                        text: `${label}  (${pct}%)`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        strokeStyle: '#f8fbff',
                                        lineWidth: 3,
                                        pointStyle: 'circle',
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                        }
                    },
                    tooltip: { ...overviewTip(), callbacks: { label: c => {
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
        const colors = OVERVIEW_THEME.series;
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: entries.map(e => e[0]),
                datasets: [{
                    label: 'Total Attendees',
                    data: entries.map(e => e[1]),
                    backgroundColor: entries.map((_, i) => colors[i % colors.length]),
                    borderRadius: 8,
                    borderSkipped: false,
                    barPercentage: 0.65
                }]
            },
            options: overviewBarOpts(true, c => `${c.raw.toLocaleString()} attendees`, 'Attendees by Category', 'Category', 'Total Attendees')
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
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: groupOrder,
                datasets: [{
                    label: 'Attendees',
                    data: groupOrder.map(g => counts[g]),
                    backgroundColor: groupOrder.map((_, i) => BRAND_SERIES[i % BRAND_SERIES.length]),
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

    function overviewBarOpts(vertical, labelCb, title, xLabel, yLabel) {
        const axis = vertical ? {} : { indexAxis: 'y' };
        return {
            ...axis,
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { ...overviewTip(), callbacks: { label: labelCb } },
                datalabels: { display: false },
                title: {
                    display: !!title,
                    text: title || '',
                    font: { family: 'Inter', size: 15, weight: '600' },
                    color: OVERVIEW_THEME.title,
                    padding: { bottom: 16 }
                }
            },
            scales: {
                x: {
                    grid: { color: vertical ? 'transparent' : OVERVIEW_THEME.grid },
                    ticks: { font: { family: 'Inter', size: 11 }, color: OVERVIEW_THEME.title },
                    beginAtZero: true,
                    title: {
                        display: !!xLabel,
                        text: xLabel || '',
                        font: { family: 'Inter', size: 12, weight: '500' },
                        color: OVERVIEW_THEME.label,
                        padding: { top: 8 }
                    }
                },
                y: {
                    grid: { color: vertical ? OVERVIEW_THEME.grid : 'transparent' },
                    ticks: { font: { family: 'Inter', size: 11 }, color: OVERVIEW_THEME.label },
                    beginAtZero: true,
                    title: {
                        display: !!yLabel,
                        text: yLabel || '',
                        font: { family: 'Inter', size: 12, weight: '500' },
                        color: OVERVIEW_THEME.label,
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

        // Per-event satisfaction
        const evtSurveyed = activeRegs.filter(r => r.satisfactionScore != null);
        const satKpi = document.getElementById('ana-evt-kpi-satisfaction');
        if (satKpi) {
            if (evtSurveyed.length > 0) {
                const avg = evtSurveyed.reduce((s, r) => s + r.satisfactionScore, 0) / evtSurveyed.length;
                satKpi.innerHTML = `${avg.toFixed(1)} ★<br><span style="font-size:0.6rem;font-weight:500;color:#636e72">${evtSurveyed.length} response${evtSurveyed.length !== 1 ? 's' : ''}</span>`;
            } else {
                satKpi.textContent = '--';
            }
        }

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
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Revenue (SAR)',
                    data: labels.map(l => tierRevenue[l] || 0),
                    backgroundColor: labels.map((_, i) => BRAND_SERIES[i % BRAND_SERIES.length]),
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
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: groupOrder,
                datasets: [{
                    label: 'Attendees',
                    data: groupOrder.map(g => counts[g]),
                    backgroundColor: groupOrder.map((_, i) => BRAND_SERIES[i % BRAND_SERIES.length]),
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
                    borderColor: BRAND_SERIES[0],
                    backgroundColor: 'rgba(0, 78, 146, 0.08)',
                    fill: true,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: BRAND_SERIES[0],
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
       MARKET INSIGHTS  (tabbed: events-by-month / avg ticket price)
    ---------------------------------------------------------- */
    let activeMarketChart = null;
    let currentMarketTab = 'events-month';

    function initMarketTabs() {
        document.querySelectorAll('[data-ana-market-tab]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-ana-market-tab]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentMarketTab = btn.dataset.anaMarketTab;
                renderMarketInsights();
            });
        });

        const tierSelect = document.getElementById('ana-market-tier-select');
        if (tierSelect) {
            tierSelect.addEventListener('change', () => {
                renderMarketInsights();
            });
        }
    }

    function renderMarketInsights() {
        if (activeMarketChart) { activeMarketChart.destroy(); activeMarketChart = null; }
        const ctx = document.getElementById('ana-market-chart-canvas');
        if (!ctx) return;
        const d = loadData();

        const tierFilter = document.getElementById('ana-market-tier-filter');
        if (currentMarketTab === 'avg-price') {
            populateTierDropdown(d);
            if (tierFilter) tierFilter.style.display = '';
            const selectedTier = document.getElementById('ana-market-tier-select')?.value || 'all';
            activeMarketChart = chartAvgTicketPrice(ctx, d, selectedTier);
        } else {
            if (tierFilter) tierFilter.style.display = 'none';
            if (currentMarketTab === 'events-month') {
                activeMarketChart = chartEventsPerMonth(ctx, d);
            } else if (currentMarketTab === 'revenue-potential') {
                activeMarketChart = chartRevenuePotential(ctx, d);
            }
        }
    }

    function populateTierDropdown(d) {
        const sel = document.getElementById('ana-market-tier-select');
        if (!sel) return;
        const tiers = new Set();
        d.events.forEach(e => {
            if (!e.tickets) return;
            e.tickets.forEach(t => { if (t.name) tiers.add(t.name); });
        });
        const current = sel.value;
        sel.innerHTML = '<option value="all">All Tiers</option>';
        [...tiers].sort().forEach(tier => {
            const opt = document.createElement('option');
            opt.value = tier;
            opt.textContent = tier;
            sel.appendChild(opt);
        });
        // Preserve selection if still valid
        if ([...sel.options].some(o => o.value === current)) sel.value = current;
    }

    function chartEventsPerMonth(ctx, d) {
        const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const monthCounts = new Array(12).fill(0);
        d.events.forEach(e => {
            if (!e.date) return;
            const m = new Date(e.date).getMonth();
            if (!isNaN(m)) monthCounts[m]++;
        });
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: monthNames,
                datasets: [{
                    label: 'Events',
                    data: monthCounts,
                    backgroundColor: c => chartGradient(c.chart, BRAND_SERIES[0], BRAND_SERIES[2], true),
                    borderRadius: 8,
                    barPercentage: 0.65
                }]
            },
            options: barOpts(true, c => `${c.raw} event${c.raw !== 1 ? 's' : ''}`, 'Number of Events by Month', 'Month', 'Events')
        });
    }

    function chartAvgTicketPrice(ctx, d, tierFilter) {
        // Gather all categories first
        const allCategories = new Set();
        const catPrices = {};
        d.events.forEach(e => {
            if (!e.category || !e.tickets || e.tickets.length === 0) return;
            allCategories.add(e.category);
            const tickets = tierFilter === 'all'
                ? e.tickets
                : e.tickets.filter(t => t.name === tierFilter);
            if (tickets.length === 0) return;
            if (!catPrices[e.category]) catPrices[e.category] = [];
            tickets.forEach(t => {
                const price = parseFloat(t.price) || 0;
                catPrices[e.category].push(price);
            });
        });

        // Build entries for ALL categories, 0 if no matching tier
        const entries = [...allCategories]
            .map(cat => {
                const prices = catPrices[cat] || [];
                const avg = prices.length > 0 ? Math.round(prices.reduce((s, p) => s + p, 0) / prices.length) : 0;
                return [cat, avg];
            })
            .sort((a, b) => b[1] - a[1]);

        const chartTitle = tierFilter === 'all'
            ? 'Average Ticket Price by Category'
            : `Average "${tierFilter}" Price by Category`;

        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: entries.map(e => e[0]),
                datasets: [{
                    label: 'Avg. Price (SAR)',
                    data: entries.map(e => e[1]),
                    backgroundColor: entries.map((_, i) => BRAND_SERIES[i % BRAND_SERIES.length]),
                    borderRadius: 8,
                    barPercentage: 0.6
                }]
            },
            options: barOpts(true, c => `${c.raw.toLocaleString()} SAR`, chartTitle, 'Event Category', 'Avg. Price (SAR)')
        });
    }

    function chartRevenuePotential(ctx, d) {
        const catRevenue = {};
        const catCount = {};
        d.events.forEach(e => {
            if (!e.category) return;
            const minPrice = Math.min(...(e.tickets || []).map(t => parseFloat(t.price) || 0));
            const revenue = (e.attendees || 0) * minPrice;
            catRevenue[e.category] = (catRevenue[e.category] || 0) + revenue;
            catCount[e.category] = (catCount[e.category] || 0) + 1;
        });
        const entries = Object.entries(catRevenue)
            .map(([cat, rev]) => [cat, Math.round(rev / (catCount[cat] || 1))])
            .sort((a, b) => b[1] - a[1]);

        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: entries.map(e => e[0]),
                datasets: [{
                    label: 'Avg. Revenue / Event (SAR)',
                    data: entries.map(e => e[1]),
                    backgroundColor: entries.map((_, i) => BRAND_SERIES[i % BRAND_SERIES.length]),
                    borderRadius: 8,
                    barPercentage: 0.6
                }]
            },
            options: barOpts(true, c => `${c.raw.toLocaleString()} SAR`, 'Avg. Revenue Potential per Event by Category', 'Event Category', 'Revenue (SAR)')
        });
    }

    /* ----------------------------------------------------------
       ATTENDEES PANEL  (age groups + KPIs)
    ---------------------------------------------------------- */
    let activeAttChart = null;
    let currentAttTab = 'age-groups';

    function renderAttendeesPanel() {
        const d = loadData();

        const allRegs    = d.registrations;
        const active     = allRegs.filter(r => r.status !== 'Withdrawn');
        const withdrawn  = allRegs.filter(r => r.status === 'Withdrawn');
        const retention  = allRegs.length > 0
            ? Math.round((active.length / allRegs.length) * 100) + '%'
            : '--';

        setText('att-kpi-total',     allRegs.length.toLocaleString());
        setText('att-kpi-active',    active.length.toLocaleString());
        setText('att-kpi-withdrawn', withdrawn.length.toLocaleString());
        setText('att-kpi-retention', retention);

        renderAttChart(d);
    }

    function initAttTabs() {
        document.querySelectorAll('[data-ana-att-tab]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-ana-att-tab]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentAttTab = btn.dataset.anaAttTab;

                const chartArea = document.querySelector('#ana-panel-attendees .ana-chart-area');
                const loyaltyContent = document.getElementById('att-loyalty-content');

                if (currentAttTab === 'loyalty') {
                    if (chartArea) chartArea.style.display = 'none';
                    if (loyaltyContent) loyaltyContent.style.display = '';
                    renderLoyalAttendees(loadData());
                } else {
                    if (chartArea) chartArea.style.display = '';
                    if (loyaltyContent) loyaltyContent.style.display = 'none';
                    renderAttChart(loadData());
                }
            });
        });
    }

    function renderAttChart(d) {
        if (activeAttChart) { activeAttChart.destroy(); activeAttChart = null; }
        const ctx = document.getElementById('ana-att-chart-canvas');
        if (!ctx) return;

        switch (currentAttTab) {
            case 'age-groups':            activeAttChart = chartAgeGroups(ctx, d);             break;
            case 'ticket-types':          activeAttChart = chartTicketTypes(ctx, d);           break;
            case 'satisfaction-category': activeAttChart = chartSatisfactionByCategory(ctx, d); break;
        }
    }

    /* --- Ticket Type Distribution (doughnut) --- */
    function chartTicketTypes(ctx, d) {
        const active = d.registrations.filter(r => r.status !== 'Withdrawn');
        const typeCount = {};
        active.forEach(r => {
            const t = r.ticketType || 'Unknown';
            typeCount[t] = (typeCount[t] || 0) + 1;
        });
        const entries = Object.entries(typeCount).sort((a, b) => b[1] - a[1]);
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
                                        strokeStyle: '#fff', lineWidth: 2,
                                        pointStyle: 'circle', hidden: false, index: i
                                    };
                                });
                            }
                        }
                    },
                    tooltip: { ...tip(), callbacks: { label: c => {
                        const pct = total > 0 ? ((c.raw / total) * 100).toFixed(1) : 0;
                        return ` ${c.label}: ${c.raw} attendee${c.raw !== 1 ? 's' : ''} (${pct}%)`;
                    }}},
                    datalabels: {
                        color: '#fff',
                        font: { family: 'Inter', weight: '600', size: 13 },
                        formatter: (value) => {
                            const pct = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return pct >= 5 ? pct + '%' : '';
                        },
                        anchor: 'center', align: 'center',
                        textShadowBlur: 4, textShadowColor: 'rgba(0,0,0,0.3)'
                    }
                }
            }
        });
    }

    /* --- Satisfaction by Event Category (bar) --- */
    function chartSatisfactionByCategory(ctx, d) {
        const eventMap = {};
        d.events.forEach(e => { eventMap[e.id] = e; });

        const catScores = {};
        d.registrations.forEach(r => {
            if (r.status === 'Withdrawn' || r.satisfactionScore == null) return;
            const evt = eventMap[r.eventId];
            if (!evt || !evt.category) return;
            if (!catScores[evt.category]) catScores[evt.category] = [];
            catScores[evt.category].push(r.satisfactionScore);
        });

        const entries = Object.entries(catScores)
            .map(([cat, scores]) => [cat, scores.reduce((s, v) => s + v, 0) / scores.length, scores.length])
            .sort((a, b) => b[1] - a[1]);

        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: entries.map(e => e[0]),
                datasets: [{
                    label: 'Avg. Satisfaction',
                    data: entries.map(e => parseFloat(e[1].toFixed(2))),
                    backgroundColor: entries.map((_, i) => BRAND_SERIES[i % BRAND_SERIES.length]),
                    borderRadius: 8, barPercentage: 0.6
                }]
            },
            options: {
                ...barOpts(true, c => {
                    const idx = c.dataIndex;
                    const count = entries[idx] ? entries[idx][2] : 0;
                    return `${c.raw.toFixed(1)} ★  (${count} response${count !== 1 ? 's' : ''})`;
                }, 'Average Satisfaction by Event Category', 'Event Category', 'Avg. Score (out of 5)'),
                scales: {
                    ...barOpts(true, null, '', '', '').scales,
                    y: {
                        ...barOpts(true, null, '', '', '').scales.y,
                        min: 0, max: 5,
                        ticks: {
                            font: { family: 'Inter', size: 11 },
                            color: CHART_TEXT.secondary,
                            stepSize: 1,
                            callback: v => v + ' ★'
                        },
                        title: {
                            display: true, text: 'Avg. Score (out of 5)',
                            font: { family: 'Inter', size: 12, weight: '500' },
                            color: CHART_TEXT.secondary, padding: { bottom: 8 }
                        }
                    }
                }
            }
        });
    }

    /* --- Loyal Attendees Honor List --- */
    function renderLoyalAttendees(d) {
        const container = document.getElementById('att-loyalty-list');
        if (!container) return;

        const eventMap = {};
        d.events.forEach(e => { eventMap[e.id] = e; });

        const attendeeMap = {};
        d.registrations.filter(r => r.status !== 'Withdrawn').forEach(r => {
            const key = r.name.trim().toLowerCase();
            if (!attendeeMap[key]) {
                attendeeMap[key] = { name: r.name, events: new Set(), totalSpent: 0, scores: [] };
            }
            attendeeMap[key].events.add(r.eventId);
            attendeeMap[key].totalSpent += parseFloat(r.ticketPrice) || 0;
            if (r.satisfactionScore != null) attendeeMap[key].scores.push(r.satisfactionScore);
        });

        const loyalList = Object.values(attendeeMap)
            .filter(a => a.events.size >= 2)
            .sort((a, b) => {
                if (b.events.size !== a.events.size) return b.events.size - a.events.size;
                return b.totalSpent - a.totalSpent;
            });

        if (loyalList.length === 0) {
            container.innerHTML = '<div class="att-loyalty-empty"><i class="fa-solid fa-user-group"></i>No repeat attendees found yet.</div>';
            return;
        }

        container.innerHTML = loyalList.map((a, i) => {
            const rank = i + 1;
            const rankClass = rank <= 3 ? `rank-${rank}` : '';
            const badgeClass = rank === 1 ? 'badge-gold' : rank === 2 ? 'badge-silver' : rank === 3 ? 'badge-bronze' : 'badge-regular';
            const badgeLabel = rank === 1 ? 'Gold' : rank === 2 ? 'Silver' : rank === 3 ? 'Bronze' : 'Loyal';
            return `<div class="att-loyalty-card">
                <div class="att-loyalty-rank ${rankClass}">${rank <= 3 ? '<i class="fa-solid fa-crown"></i>' : rank}</div>
                <div class="att-loyalty-info">
                    <div class="att-loyalty-name">${a.name}</div>
                    <div class="att-loyalty-meta">
                        <span><i class="fa-solid fa-calendar-check"></i> ${a.events.size} events</span>
                        <span><i class="fa-solid fa-sack-dollar"></i> ${a.totalSpent.toLocaleString()} SAR</span>
                    </div>
                </div>
                <span class="att-loyalty-badge ${badgeClass}"><i class="fa-solid fa-medal"></i> ${badgeLabel}</span>
            </div>`;
        }).join('');
    }

    /* ----------------------------------------------------------
       UTILITIES
    ---------------------------------------------------------- */
    function setText(id, val) {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    }

    /* ----------------------------------------------------------
       VENDOR ANALYTICS PANEL
    ---------------------------------------------------------- */
    let activeVndChart = null;
    let currentVndTab = 'category-dist';

    function renderVendorsPanel() {
        const d = loadData();
        renderVendorKPIs(d);
        renderVendorHighlights(d);
        renderVndChart(d);
    }

    function renderVendorKPIs(d) {
        const vendorMap = {};
        d.vendors.forEach(v => { vendorMap[v.id] = v; });

        const uniqueVendorIds = new Set(d.eventVendors.map(ev => ev.vendorId));
        const totalEngaged = uniqueVendorIds.size;
        const confirmed = d.eventVendors.filter(ev => ev.status === 'Confirmed').length;
        const pending = d.eventVendors.filter(ev => ev.status === 'Pending').length;
        const declined = d.eventVendors.filter(ev => ev.status === 'Declined').length;

        const vendorWithdrawals = d.requests.filter(r =>
            r.rejectionReason && r.rejectionReason.startsWith('Withdrawn by Vendor')
        ).length;
        const totalDeclinedOrWD = declined + vendorWithdrawals;

        const totalAssignments = d.eventVendors.length;
        const acceptanceRate = totalAssignments > 0
            ? Math.round((confirmed / totalAssignments) * 100) + '%'
            : '--';

        const vendorEventMap = {};
        d.eventVendors.filter(ev => ev.status === 'Confirmed').forEach(ev => {
            if (!vendorEventMap[ev.vendorId]) vendorEventMap[ev.vendorId] = new Set();
            vendorEventMap[ev.vendorId].add(ev.eventId);
        });
        const repeatVendors = Object.values(vendorEventMap).filter(s => s.size >= 2).length;

        setText('vnd-kpi-total', totalEngaged);
        setText('vnd-kpi-confirmed', confirmed);
        setText('vnd-kpi-pending', pending);
        setText('vnd-kpi-declined', totalDeclinedOrWD);
        setText('vnd-kpi-acceptance', acceptanceRate);
        setText('vnd-kpi-repeat', repeatVendors);
    }

    function renderVendorHighlights(d) {
        const vendorMap = {};
        d.vendors.forEach(v => { vendorMap[v.id] = v; });

        const bookingCount = {};
        d.eventVendors.filter(ev => ev.status === 'Confirmed').forEach(ev => {
            bookingCount[ev.vendorId] = (bookingCount[ev.vendorId] || 0) + 1;
        });
        const topVendorEntry = Object.entries(bookingCount).sort((a, b) => b[1] - a[1])[0];
        const topVendor = topVendorEntry ? vendorMap[topVendorEntry[0]] : null;
        setText('vnd-highlight-top-vendor', topVendor
            ? `${trunc(topVendor.name, 22)} — ${topVendorEntry[1]} event${topVendorEntry[1] !== 1 ? 's' : ''}`
            : 'No data yet');

        const ratedVendors = d.vendors.filter(v => v.rating > 0).sort((a, b) => b.rating - a.rating);
        setText('vnd-highlight-top-rated', ratedVendors.length > 0
            ? `${trunc(ratedVendors[0].name, 22)} — ${ratedVendors[0].rating} ★`
            : 'No data yet');

        const catCount = {};
        d.eventVendors.filter(ev => ev.status === 'Confirmed').forEach(ev => {
            const v = vendorMap[ev.vendorId];
            if (!v) return;
            const cat = v.category || 'Other';
            catCount[cat] = (catCount[cat] || 0) + 1;
        });
        const topCat = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0];
        setText('vnd-highlight-top-category', topCat
            ? `${topCat[0]} — ${topCat[1]} booking${topCat[1] !== 1 ? 's' : ''}`
            : 'No data yet');

        const eventIds = [...new Set(d.eventVendors.map(ev => ev.eventId))];
        const eventsWithVendors = eventIds.length;
        const totalConfirmed = d.eventVendors.filter(ev => ev.status === 'Confirmed').length;
        const avgPerEvent = eventsWithVendors > 0
            ? (totalConfirmed / eventsWithVendors).toFixed(1)
            : '0';
        setText('vnd-highlight-avg-per-event', avgPerEvent);
    }

    function initVndTabs() {
        document.querySelectorAll('[data-ana-vnd-tab]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-ana-vnd-tab]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentVndTab = btn.dataset.anaVndTab;

                const chartArea = document.querySelector('#ana-panel-vendors .ana-chart-area');
                const allContent = document.getElementById('vnd-all-vendors-content');

                if (currentVndTab === 'all-vendors') {
                    if (chartArea) chartArea.style.display = 'none';
                    if (allContent) allContent.style.display = '';
                    renderAllVendorsList(loadData());
                } else {
                    if (chartArea) chartArea.style.display = '';
                    if (allContent) allContent.style.display = 'none';
                    renderVndChart(loadData());
                }
            });
        });
    }

    function renderVndChart(d) {
        if (activeVndChart) { activeVndChart.destroy(); activeVndChart = null; }
        const ctx = document.getElementById('ana-vnd-chart-canvas');
        if (!ctx) return;

        switch (currentVndTab) {
            case 'category-dist':    activeVndChart = vndChartCategoryDist(ctx, d);    break;
            case 'status-breakdown': activeVndChart = vndChartStatusBreakdown(ctx, d); break;
            case 'vendors-per-event': activeVndChart = vndChartVendorsPerEvent(ctx, d); break;
        }
    }

    function vndChartCategoryDist(ctx, d) {
        const vendorMap = {};
        d.vendors.forEach(v => { vendorMap[v.id] = v; });
        const catCount = {};
        d.eventVendors.filter(ev => ev.status === 'Confirmed').forEach(ev => {
            const v = vendorMap[ev.vendorId];
            if (!v) return;
            catCount[v.category || 'Other'] = (catCount[v.category || 'Other'] || 0) + 1;
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
                                        strokeStyle: '#fff', lineWidth: 2,
                                        pointStyle: 'circle', hidden: false, index: i
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
                        anchor: 'center', align: 'center',
                        textShadowBlur: 4, textShadowColor: 'rgba(0,0,0,0.3)'
                    }
                }
            }
        });
    }

    function vndChartStatusBreakdown(ctx, d) {
        const confirmed = d.eventVendors.filter(ev => ev.status === 'Confirmed').length;
        const pending   = d.eventVendors.filter(ev => ev.status === 'Pending').length;
        const declined  = d.eventVendors.filter(ev => ev.status === 'Declined').length;
        const total = confirmed + pending + declined;
        if (total === 0) return null;

        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Confirmed', 'Pending', 'Declined'],
                datasets: [{
                    data: [confirmed, pending, declined],
                    backgroundColor: ['#2e7d32', '#ff9800', '#c62828'],
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
                                        strokeStyle: '#fff', lineWidth: 2,
                                        pointStyle: 'circle', hidden: false, index: i
                                    };
                                });
                            }
                        }
                    },
                    tooltip: { ...tip(), callbacks: { label: c => {
                        const pct = total > 0 ? ((c.raw / total) * 100).toFixed(1) : 0;
                        return ` ${c.label}: ${c.raw} assignment${c.raw !== 1 ? 's' : ''} (${pct}%)`;
                    }}},
                    datalabels: {
                        color: '#fff',
                        font: { family: 'Inter', weight: '600', size: 14 },
                        formatter: (value) => {
                            const pct = total > 0 ? ((value / total) * 100).toFixed(0) : 0;
                            return value > 0 ? pct + '%' : '';
                        },
                        anchor: 'center', align: 'center',
                        textShadowBlur: 4, textShadowColor: 'rgba(0,0,0,0.3)'
                    }
                }
            }
        });
    }

    function vndChartVendorsPerEvent(ctx, d) {
        const eventMap = {};
        d.events.forEach(e => { eventMap[e.id] = e; });

        const evtCount = {};
        d.eventVendors.filter(ev => ev.status === 'Confirmed').forEach(ev => {
            evtCount[ev.eventId] = (evtCount[ev.eventId] || 0) + 1;
        });

        const entries = Object.entries(evtCount)
            .map(([eid, count]) => {
                const evt = eventMap[eid];
                return [evt ? trunc(evt.title, 22) : eid, count];
            })
            .sort((a, b) => b[1] - a[1]);

        if (entries.length === 0) return null;

        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: entries.map(e => e[0]),
                datasets: [{
                    label: 'Confirmed Vendors',
                    data: entries.map(e => e[1]),
                    backgroundColor: entries.map((_, i) => BRAND_SERIES[i % BRAND_SERIES.length]),
                    borderRadius: 8, barPercentage: 0.6
                }]
            },
            options: barOpts(true, c => `${c.raw} vendor${c.raw !== 1 ? 's' : ''}`, 'Confirmed Vendors per Event', 'Event', 'Number of Vendors')
        });
    }

    function renderAllVendorsList(d) {
        const container = document.getElementById('vnd-all-vendors-list');
        if (!container) return;

        const bookingStats = {};
        d.eventVendors.forEach(ev => {
            if (!bookingStats[ev.vendorId]) bookingStats[ev.vendorId] = { confirmed: 0, pending: 0, events: new Set() };
            const s = bookingStats[ev.vendorId];
            s.events.add(ev.eventId);
            if (ev.status === 'Confirmed') s.confirmed++;
            else if (ev.status === 'Pending') s.pending++;
        });

        const vendorMap = {};
        d.vendors.forEach(v => { vendorMap[v.id] = v; });

        const list = Object.entries(bookingStats).map(([vid, stats]) => {
            const v = vendorMap[vid];
            return {
                name: v ? v.name : vid,
                category: v ? (v.category || 'Other') : 'Other',
                rating: v ? (v.rating || 0) : 0,
                location: v ? (v.location || '') : '',
                confirmed: stats.confirmed,
                pending: stats.pending,
                events: stats.events.size
            };
        }).sort((a, b) => b.events - a.events || b.confirmed - a.confirmed);

        if (list.length === 0) {
            container.innerHTML = '<div class="att-loyalty-empty"><i class="fa-solid fa-store"></i>No vendors available.</div>';
            return;
        }

        container.innerHTML = list.map((v, i) => {
            const rank = i + 1;
            const rankClass = rank <= 3 && v.events > 0 ? `rank-${rank}` : '';
            return `<div class="att-loyalty-card">
                <div class="att-loyalty-rank ${rankClass}">${rank <= 3 && v.events > 0 ? '<i class="fa-solid fa-crown"></i>' : rank}</div>
                <div class="att-loyalty-info">
                    <div class="att-loyalty-name">${v.name}</div>
                    <div class="att-loyalty-meta">
                        <span><i class="fa-solid fa-calendar-check"></i> ${v.events} event${v.events !== 1 ? 's' : ''}</span>
                        <span><i class="fa-solid fa-handshake"></i> ${v.confirmed} confirmed</span>
                        ${v.pending > 0 ? `<span><i class="fa-solid fa-hourglass-half" style="color:#f59e0b"></i> ${v.pending} pending</span>` : ''}
                        <span><i class="fa-solid fa-tag"></i> ${v.category}</span>
                        ${v.location ? `<span><i class="fa-solid fa-location-dot"></i> ${v.location}</span>` : ''}
                        ${v.rating > 0 ? `<span><i class="fa-solid fa-star" style="color:#f59e0b"></i> ${v.rating}</span>` : ''}
                    </div>
                </div>
            </div>`;
        }).join('');
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

                if (btn.dataset.anaMain === 'attendees') {
                    renderAttendeesPanel();
                }
                if (btn.dataset.anaMain === 'event-report') {
                    populateEventDropdown(loadData().events);
                }
                if (btn.dataset.anaMain === 'market-insights') {
                    renderMarketInsights();
                }
                if (btn.dataset.anaMain === 'vendors') {
                    renderVendorsPanel();
                }
            });
        });
    }

    /* ----------------------------------------------------------
       PDF EXPORT — Full-report multi-chart export
       Builds an off-screen staging container that includes KPIs
       and ALL chart tabs so the exported PDF is a complete report.
    ---------------------------------------------------------- */

    function pdfWaitForLayoutStable() {
        const fontsReady = document.fonts && document.fonts.ready
            ? document.fonts.ready.catch(() => {})
            : Promise.resolve();
        return fontsReady.then(() => new Promise(resolve => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setTimeout(resolve, 500);
                });
            });
        }));
    }

    function pdfMakeCanvasOpts(canvasScale) {
        return {
            scale: canvasScale,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#f5f8fc',
            logging: false,
            foreignObjectRendering: false,
            imageTimeout: 15000,
            onclone: (clonedDoc) => {
                try {
                    const style = clonedDoc.createElement('style');
                    style.textContent = `
                        .pdf-staging-container,
                        .pdf-staging-container *,
                        .pdf-staging-container *::before,
                        .pdf-staging-container *::after {
                            animation: none !important;
                            transition: none !important;
                        }
                        .pdf-staging-container .ana-kpi-card,
                        .pdf-staging-container .ana-kpi-value,
                        .pdf-staging-container .ana-kpi-label,
                        .pdf-staging-container .ana-highlight-card,
                        .pdf-staging-container .evt-kpi,
                        .pdf-staging-container .evt-kpi-value,
                        .pdf-staging-container .evt-kpi-label,
                        .pdf-staging-container .ana-evt-title-banner,
                        .pdf-staging-container .pdf-chart-wrapper,
                        .pdf-staging-container .pdf-section-heading,
                        .pdf-staging-container .pdf-report-title-banner {
                            opacity: 1 !important;
                            transform: none !important;
                        }
                    `;
                    clonedDoc.head.appendChild(style);
                } catch (e) { /* ignore */ }
            }
        };
    }

    function pdfSectionHeading(text) {
        const h = document.createElement('div');
        h.className = 'pdf-section-heading';
        h.textContent = text;
        return h;
    }

    function nextFrame() {
        return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    }

    function pdfRenderChartToImage(chartFn, width, height) {
        const w = width || 900;
        const h = height || 420;
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'position:absolute;left:-9999px;top:0;width:' + w + 'px;height:' + h + 'px;background:#ffffff;';
        const tmpCanvas = document.createElement('canvas');
        tmpCanvas.style.cssText = 'display:block;width:100%;height:100%;';
        wrapper.appendChild(tmpCanvas);
        document.body.appendChild(wrapper);

        // Force Chart.js to skip animations for this render by overriding
        // its global defaults before creating the instance. We restore the
        // previous values when we're done. Without this, new Chart() draws
        // an empty first frame and toDataURL() captures a blank canvas.
        const ChartGlobal = window.Chart;
        const prevAnim = ChartGlobal && ChartGlobal.defaults ? ChartGlobal.defaults.animation : undefined;
        const prevAnimations = ChartGlobal && ChartGlobal.defaults ? ChartGlobal.defaults.animations : undefined;
        const prevTransitions = ChartGlobal && ChartGlobal.defaults ? ChartGlobal.defaults.transitions : undefined;
        if (ChartGlobal && ChartGlobal.defaults) {
            ChartGlobal.defaults.animation = false;
            ChartGlobal.defaults.animations = {};
            ChartGlobal.defaults.transitions = {
                active: { animation: { duration: 0 } },
                resize: { animation: { duration: 0 } },
                show:   { animations: {} },
                hide:   { animations: {} }
            };
        }

        let instance = null;
        try {
            instance = chartFn(tmpCanvas);
        } catch (e) {
            console.warn('Chart render failed in PDF staging:', e);
        }

        return nextFrame()
            .then(() => {
                if (!instance) return null;
                try {
                    instance.resize();
                    instance.update('none');
                } catch (e) { /* ignore */ }
                return nextFrame().then(() => {
                    let dataUrl = null;
                    try {
                        dataUrl = tmpCanvas.toDataURL('image/png');
                    } catch (e) { /* ignore */ }
                    try { instance.destroy(); } catch (e) { /* ignore */ }
                    return dataUrl;
                });
            })
            .then(dataUrl => {
                if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
                if (ChartGlobal && ChartGlobal.defaults) {
                    ChartGlobal.defaults.animation = prevAnim;
                    ChartGlobal.defaults.animations = prevAnimations;
                    ChartGlobal.defaults.transitions = prevTransitions;
                }
                if (!dataUrl) return null;
                const img = document.createElement('img');
                img.src = dataUrl;
                img.style.width = '100%';
                img.style.display = 'block';
                return img;
            });
    }

    function pdfAppendChartSection(stage, label, chartFn) {
        stage.appendChild(pdfSectionHeading(label));
        const chartWrap = document.createElement('div');
        chartWrap.className = 'pdf-chart-wrapper';
        stage.appendChild(chartWrap);
        return pdfRenderChartToImage(chartFn, 900, 420).then(img => {
            if (img) {
                chartWrap.appendChild(img);
            } else {
                chartWrap.innerHTML = '<div style="padding:2rem;text-align:center;color:#8aa0b3;font-size:0.85rem;">No data available for this chart.</div>';
            }
        });
    }

    function pdfBuildOverviewStaging() {
        const d = loadData();
        if (!d) return Promise.resolve(null);

        const stage = document.createElement('div');
        stage.className = 'pdf-staging-container';

        const titleBanner = document.createElement('div');
        titleBanner.className = 'pdf-report-title-banner';
        titleBanner.innerHTML = '<h2><i class="fa-solid fa-chart-bar"></i> Eventia — Overview Report</h2>' +
            '<p>Generated on ' + new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + '</p>';
        stage.appendChild(titleBanner);

        const kpiSource = document.querySelector('#ana-panel-overview .ana-kpi-grid');
        if (kpiSource) {
            stage.appendChild(pdfSectionHeading('Key Performance Indicators'));
            stage.appendChild(kpiSource.cloneNode(true));
        }

        const hlSource = document.querySelector('#ana-panel-overview .ana-highlight-grid');
        if (hlSource) {
            stage.appendChild(pdfSectionHeading('Highlights'));
            stage.appendChild(hlSource.cloneNode(true));
        }

        const overviewCharts = [
            { label: 'Attendance by Event',    fn: ctx => chartAttendance(ctx, d) },
            { label: 'Revenue by Event',       fn: ctx => chartRevenue(ctx, d) },
            { label: 'Services Distribution',  fn: ctx => chartServices(ctx, d) },
            { label: 'Event Categories',       fn: ctx => chartCategories(ctx, d) }
        ];

        return overviewCharts.reduce(
            (p, c) => p.then(() => pdfAppendChartSection(stage, c.label, c.fn)),
            Promise.resolve()
        ).then(() => stage);
    }

    function pdfBuildEventStaging(eventId) {
        const d = loadData();
        if (!d) return Promise.resolve(null);
        const evt = d.events.find(e => e.id === eventId);
        if (!evt) return Promise.resolve(null);

        const stage = document.createElement('div');
        stage.className = 'pdf-staging-container';

        const bannerSource = document.querySelector('.ana-evt-title-banner');
        if (bannerSource) {
            stage.appendChild(bannerSource.cloneNode(true));
            const clonedBtn = stage.querySelector('#ana-evt-export-pdf');
            if (clonedBtn) clonedBtn.remove();
        }

        const kpiSource = document.querySelector('.evt-report-kpi-grid');
        if (kpiSource) {
            stage.appendChild(pdfSectionHeading('Key Performance Indicators'));
            stage.appendChild(kpiSource.cloneNode(true));
        }

        const evtCharts = [
            { label: 'Revenue by Tier',        fn: ctx => evtChartRevenueTier(ctx, eventId, d) },
            { label: 'Age Groups',             fn: ctx => evtChartAgeGroups(ctx, eventId, d) },
            { label: 'Registration Timeline',  fn: ctx => evtChartRegTimeline(ctx, eventId, d) },
            { label: 'Vendor Services',        fn: ctx => evtChartVendorServices(ctx, eventId, d) }
        ];

        return evtCharts.reduce(
            (p, c) => p.then(() => pdfAppendChartSection(stage, c.label, c.fn)),
            Promise.resolve()
        ).then(() => stage);
    }

    function runFullPDFExport(stagingPromise, filename, triggerBtn, metaTitle) {
        const btn = triggerBtn || null;
        const isOverview = metaTitle && metaTitle.includes('Overview');

        function resetExportButton() {
            if (!btn) return;
            btn.disabled = false;
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

        const captureMs = 120000;
        const canvasScale = Math.min(3, Math.max(2.35, (window.devicePixelRatio || 1) * 2.25));
        const canvasOpts = pdfMakeCanvasOpts(canvasScale);
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Screenshot timed out.')), captureMs);
        });

        let stagingEl = null;

        stagingPromise
            .then(el => {
                if (!el) throw new Error('Could not build report.');
                stagingEl = el;
                document.body.appendChild(stagingEl);
                return pdfWaitForLayoutStable();
            })
            .then(() => Promise.race([html2canvas(stagingEl, canvasOpts), timeoutPromise]))
            .then(canvas => {
                if (!canvas.width || !canvas.height) throw new Error('Empty screenshot.');
                let imgData;
                try {
                    imgData = canvas.toDataURL('image/png');
                } catch (e) {
                    throw new Error('Could not read the page image (often blocked when opening the file directly).');
                }

                const pdfW = 210;
                const margin = 12;
                const contentW = pdfW - margin * 2;
                const contentH = (canvas.height * contentW) / canvas.width;

                const pdf = new JsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
                try {
                    pdf.setProperties({
                        title: metaTitle || 'Eventia analytics report',
                        subject: 'Exported from Eventia organizer dashboard',
                        creator: 'Eventia'
                    });
                } catch (e) { /* ignore */ }

                const pageH = pdf.internal.pageSize.getHeight() - margin * 2;
                let yOffset = 0;
                while (yOffset < contentH) {
                    if (yOffset > 0) pdf.addPage();
                    pdf.addImage(imgData, 'PNG', margin, margin - yOffset, contentW, contentH);
                    yOffset += pageH;
                }
                pdf.save(filename);
            })
            .catch(err => {
                console.error('PDF export failed:', err);
                const hint = err && err.message ? '\n\nDetails: ' + err.message : '';
                alert('Could not generate PDF. If the address bar shows file:///, serve the project over http://localhost instead.' + hint);
            })
            .finally(() => {
                if (stagingEl && stagingEl.parentNode) stagingEl.parentNode.removeChild(stagingEl);
                resetExportButton();
            });
    }

    function initExportButtons() {
        const overviewBtn = document.getElementById('ana-overview-export-pdf');
        if (overviewBtn) {
            overviewBtn.addEventListener('click', (e) => {
                runFullPDFExport(
                    pdfBuildOverviewStaging(),
                    'Eventia_Overview_Report.pdf',
                    e.currentTarget,
                    'Eventia — Overview Report'
                );
            });
        }

        const evtBtn = document.getElementById('ana-evt-export-pdf');
        if (evtBtn) {
            evtBtn.addEventListener('click', (e) => {
                if (!selectedEventId) return;
                const evtNameEl = document.getElementById('ana-evt-title-name');
                const name = evtNameEl ? evtNameEl.textContent.replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/\s+/g, '_') : 'Event';
                runFullPDFExport(
                    pdfBuildEventStaging(selectedEventId),
                    'Eventia_Report_' + name + '.pdf',
                    e.currentTarget,
                    'Eventia — ' + (evtNameEl ? evtNameEl.textContent.trim() : 'Event Report')
                );
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
    initAttTabs();
    initEvtTabs();
    initMarketTabs();
    initVndTabs();
    initEventSelector();
    initExportButtons();
});
