/**
 * EVENTIA - Dummy Data for Frontend Demonstration
 * ================================================
 * This file contains sample data for testing and presentation purposes.
 */

// ============================================================================
// DUMMY EVENTS
// ============================================================================
const DUMMY_EVENTS = [
    {
        id: "101",
        title: "Ongoing Tech Expo (Today)",
        category: "Tech",
        date: new Date().toISOString().split('T')[0], // Today's date for "Ongoing"
        time: "09:00",
        location: "Riyadh Exhibition Center",
        description: "The largest technology exhibition in the region featuring the latest innovations in AI, robotics, and sustainable tech solutions.",
        price: "299",
        tickets: [{ name: 'Standard', price: '299' }, { name: 'VIP', price: '599' }],
        status: "Upcoming",
        withdrawalPolicy: "strict",
        attendeeWithdrawalPolicy: "moderate",
        attendees: 1250
    },
    {
        id: "102",
        title: "Riyadh Art Week",
        category: "Art",
        date: "2026-01-20",
        time: "10:00",
        location: "Riyadh Art District",
        description: "A week-long celebration of contemporary and traditional Saudi art.",
        price: "150",
        tickets: [{ name: 'General', price: '150' }],
        status: "Upcoming",
        withdrawalPolicy: "moderate",
        attendeeWithdrawalPolicy: "flexible",
        attendees: 800
    },
    {
        id: "103",
        title: "Business Leadership Summit",
        category: "Business",
        date: "2026-02-15",
        time: "08:30",
        location: "King Abdullah Financial District",
        description: "Connect with industry leaders and learn cutting-edge business strategies.",
        price: "750",
        tickets: [{ name: 'Executive', price: '750' }, { name: 'Standard', price: '450' }],
        status: "Upcoming",
        withdrawalPolicy: "moderate",
        attendeeWithdrawalPolicy: "moderate",
        attendees: 500
    },
    {
        id: "104",
        title: "Saudi Music Festival",
        category: "Music",
        date: "2026-03-01",
        time: "18:00",
        location: "Boulevard Riyadh City",
        description: "Experience the best of Saudi and international music artists.",
        price: "200",
        tickets: [{ name: 'General', price: '200' }, { name: 'VIP', price: '500' }],
        status: "Pending",
        withdrawalPolicy: "flexible",
        attendeeWithdrawalPolicy: "flexible",
        attendees: 0
    },
    {
        id: "105",
        title: "Past Education Conference",
        category: "Education",
        date: "2025-12-01",
        time: "09:00",
        location: "King Saud University",
        description: "Annual education conference showcasing innovations in learning.",
        price: "100",
        tickets: [{ name: 'Standard', price: '100' }],
        status: "Past",
        withdrawalPolicy: "strict",
        attendeeWithdrawalPolicy: "strict",
        attendees: 350
    },
    {
        id: "106",
        title: "Riyadh Marathon",
        category: "Sports",
        date: "2026-04-10",
        time: "06:00",
        location: "King Fahd Road",
        description: "The annual Riyadh Marathon attracting runners from around the world.",
        price: "50",
        tickets: [{ name: 'Participant', price: '50' }],
        status: "Upcoming",
        withdrawalPolicy: "non-refundable",
        attendeeWithdrawalPolicy: "non-refundable",
        attendees: 2000
    },
    {
        id: "107",
        title: "Rejected Event Example",
        category: "Other",
        date: "2026-05-01",
        time: "14:00",
        location: "Desert Highway",
        description: "An unofficial race for speed enthusiasts.",
        price: "0",
        tickets: [{ name: 'Free', price: '0' }],
        status: "Rejected",
        rejectionReason: "Safety concerns and lack of official authorization.",
        withdrawalPolicy: "flexible",
        attendeeWithdrawalPolicy: "flexible",
        attendees: 0
    }
];



// ============================================================================
// DUMMY VENDORS (54 vendors across all categories)
// ============================================================================
const DUMMY_VENDORS = [
    // === CATERING & FOOD ===
    {
        id: "v1",
        name: "Luxe Catering Co.",
        category: "Catering",
        location: "Riyadh",
        rating: 4.8,
        priceRange: "$$$",
        image: "fa-utensils",
        description: "Premium catering for corporate events and galas."
    },
    {
        id: "v2",
        name: "Arabian Feast Catering",
        category: "Catering",
        location: "Jeddah",
        rating: 4.7,
        priceRange: "$$",
        image: "fa-bowl-food",
        description: "Traditional Saudi and Middle Eastern cuisine specialists."
    },
    {
        id: "v3",
        name: "Sweet Delights Bakery",
        category: "Bakery & Desserts",
        location: "Riyadh",
        rating: 4.9,
        priceRange: "$$",
        image: "fa-cake-candles",
        description: "Custom cakes, pastries, and dessert displays."
    },
    {
        id: "v4",
        name: "Coffee Culture Kiosk",
        category: "Beverages",
        location: "Dammam",
        rating: 4.6,
        priceRange: "$",
        image: "fa-mug-hot",
        description: "Mobile coffee bars with barista service."
    },
    {
        id: "v5",
        name: "Fresh Juice Bar",
        category: "Beverages",
        location: "Riyadh",
        rating: 4.5,
        priceRange: "$",
        image: "fa-blender",
        description: "Fresh juices and smoothies for healthy refreshments."
    },
    {
        id: "v6",
        name: "Gourmet Food Trucks",
        category: "Food Trucks",
        location: "Jeddah",
        rating: 4.4,
        priceRange: "$$",
        image: "fa-truck",
        description: "Mobile gourmet food trucks for outdoor events."
    },
    // === VENUES ===
    {
        id: "v7",
        name: "Royal Grand Hotel",
        category: "Venue",
        location: "Riyadh",
        rating: 4.9,
        priceRange: "$$$",
        image: "fa-hotel",
        description: "Luxury ballrooms and conference spaces for premium events."
    },
    {
        id: "v8",
        name: "Desert Oasis Resort",
        category: "Venue",
        location: "Al Khobar",
        rating: 4.7,
        priceRange: "$$$",
        image: "fa-umbrella-beach",
        description: "Outdoor desert venue with stunning sunset views."
    },
    {
        id: "v9",
        name: "Convention Center Riyadh",
        category: "Venue",
        location: "Riyadh",
        rating: 4.8,
        priceRange: "$$$",
        image: "fa-building",
        description: "Large-scale convention and exhibition spaces."
    },
    {
        id: "v10",
        name: "Garden Wedding Venue",
        category: "Venue",
        location: "Jeddah",
        rating: 4.6,
        priceRange: "$$",
        image: "fa-tree",
        description: "Beautiful garden settings for weddings and celebrations."
    },
    // === GOVERNMENT & PERMITS ===
    {
        id: "v11",
        name: "City Municipality",
        category: "Permits & Licensing",
        location: "Riyadh",
        rating: 4.2,
        priceRange: "$",
        image: "fa-landmark",
        description: "Official permits and event licensing."
    },
    {
        id: "v12",
        name: "Fire Safety Department",
        category: "Permits & Licensing",
        location: "Riyadh",
        rating: 4.3,
        priceRange: "$",
        image: "fa-fire-extinguisher",
        description: "Fire safety certifications for venues."
    },
    // === ENTERTAINMENT ===
    {
        id: "v13",
        name: "DJ ProSound",
        category: "Entertainment",
        location: "Jeddah",
        rating: 4.8,
        priceRange: "$$",
        image: "fa-music",
        description: "Professional DJs and sound systems for events."
    },
    {
        id: "v14",
        name: "Live Band Arabia",
        category: "Entertainment",
        location: "Riyadh",
        rating: 4.7,
        priceRange: "$$$",
        image: "fa-guitar",
        description: "Live bands for weddings and corporate events."
    },
    {
        id: "v15",
        name: "Magic Show Entertainment",
        category: "Entertainment",
        location: "Dammam",
        rating: 4.5,
        priceRange: "$$",
        image: "fa-wand-sparkles",
        description: "Magicians and illusionists for family events."
    },
    {
        id: "v16",
        name: "Stand-Up Comedy Shows",
        category: "Entertainment",
        location: "Riyadh",
        rating: 4.6,
        priceRange: "$$",
        image: "fa-face-laugh",
        description: "Comedy acts and stand-up performers."
    },
    // === PHOTOGRAPHY & VIDEO ===
    {
        id: "v17",
        name: "Photo Magic Studios",
        category: "Photography",
        location: "Riyadh",
        rating: 4.9,
        priceRange: "$$",
        image: "fa-camera",
        description: "Event photography and videography services."
    },
    {
        id: "v18",
        name: "360 Photo Booth",
        category: "Photography",
        location: "Jeddah",
        rating: 4.7,
        priceRange: "$$",
        image: "fa-camera-rotate",
        description: "Interactive 360-degree photo booth experiences."
    },
    {
        id: "v19",
        name: "Drone Aerial Photography",
        category: "Photography",
        location: "Riyadh",
        rating: 4.8,
        priceRange: "$$$",
        image: "fa-helicopter",
        description: "Aerial drone photography and video."
    },
    // === AUDIO VISUAL & EQUIPMENT ===
    {
        id: "v20",
        name: "TechAV Solutions",
        category: "Audio Visual",
        location: "Riyadh",
        rating: 4.7,
        priceRange: "$$$",
        image: "fa-tv",
        description: "LED screens, projectors, and AV equipment rental."
    },
    {
        id: "v21",
        name: "Stage & Lighting Pro",
        category: "Audio Visual",
        location: "Jeddah",
        rating: 4.8,
        priceRange: "$$$",
        image: "fa-lightbulb",
        description: "Professional stage lighting and effects."
    },
    {
        id: "v22",
        name: "Sound Systems Rental",
        category: "Audio Visual",
        location: "Dammam",
        rating: 4.5,
        priceRange: "$$",
        image: "fa-volume-high",
        description: "Professional sound systems and PA equipment."
    },
    // === FURNITURE & RENTALS ===
    {
        id: "v23",
        name: "Event Furnishings Co.",
        category: "Furniture Rental",
        location: "Dammam",
        rating: 4.5,
        priceRange: "$$",
        image: "fa-couch",
        description: "Tables, chairs, and lounge furniture for events."
    },
    {
        id: "v24",
        name: "Luxury Tent Rentals",
        category: "Furniture Rental",
        location: "Riyadh",
        rating: 4.6,
        priceRange: "$$$",
        image: "fa-tent",
        description: "Premium tents and marquees for outdoor events."
    },
    {
        id: "v25",
        name: "Table Settings & More",
        category: "Furniture Rental",
        location: "Jeddah",
        rating: 4.4,
        priceRange: "$$",
        image: "fa-utensils",
        description: "Tableware, linens, and dining accessories."
    },
    // === DECOR & FLORISTS ===
    {
        id: "v26",
        name: "Bloom & Petal Florists",
        category: "Florists",
        location: "Riyadh",
        rating: 4.8,
        priceRange: "$$",
        image: "fa-leaf",
        description: "Floral arrangements and event decorations."
    },
    {
        id: "v27",
        name: "Sparkle Events Decor",
        category: "Event Decoration",
        location: "Jeddah",
        rating: 4.6,
        priceRange: "$$$",
        image: "fa-wand-magic-sparkles",
        description: "Full event theming and decoration services."
    },
    {
        id: "v28",
        name: "Balloon Art & More",
        category: "Event Decoration",
        location: "Riyadh",
        rating: 4.5,
        priceRange: "$",
        image: "fa-dollar-sign",
        description: "Creative balloon decorations and displays."
    },
    {
        id: "v29",
        name: "Arabian Nights Decor",
        category: "Event Decoration",
        location: "Dammam",
        rating: 4.7,
        priceRange: "$$",
        image: "fa-moon",
        description: "Traditional Arabian themed decorations."
    },
    // === TRANSPORTATION ===
    {
        id: "v30",
        name: "Elite Limo Service",
        category: "Transportation",
        location: "Riyadh",
        rating: 4.7,
        priceRange: "$$$",
        image: "fa-car",
        description: "Luxury vehicle hire and VIP transportation."
    },
    {
        id: "v31",
        name: "Event Shuttle Co.",
        category: "Transportation",
        location: "Jeddah",
        rating: 4.4,
        priceRange: "$",
        image: "fa-bus",
        description: "Bus and shuttle services for large groups."
    },
    {
        id: "v32",
        name: "Valet Parking Services",
        category: "Transportation",
        location: "Riyadh",
        rating: 4.6,
        priceRange: "$$",
        image: "fa-square-parking",
        description: "Professional valet parking for events."
    },
    // === SECURITY ===
    {
        id: "v33",
        name: "SafeGuard Security",
        category: "Security",
        location: "Riyadh",
        rating: 4.6,
        priceRange: "$$",
        image: "fa-shield-halved",
        description: "Professional event security and crowd management."
    },
    {
        id: "v34",
        name: "VIP Protection Services",
        category: "Security",
        location: "Jeddah",
        rating: 4.8,
        priceRange: "$$$",
        image: "fa-user-shield",
        description: "Executive protection and VIP security."
    },
    // === STAFFING ===
    {
        id: "v35",
        name: "ProStaff Events",
        category: "Staffing",
        location: "Riyadh",
        rating: 4.5,
        priceRange: "$$",
        image: "fa-users",
        description: "Hostesses, ushers, and event staff."
    },
    {
        id: "v36",
        name: "Waitstaff Plus",
        category: "Staffing",
        location: "Jeddah",
        rating: 4.6,
        priceRange: "$$",
        image: "fa-user-tie",
        description: "Professional waiters and bartenders."
    },
    // === PRINTING & SIGNAGE ===
    {
        id: "v37",
        name: "QuickPrint Solutions",
        category: "Printing",
        location: "Dammam",
        rating: 4.3,
        priceRange: "$",
        image: "fa-print",
        description: "Banners, signage, and promotional materials."
    },
    {
        id: "v38",
        name: "LED Signage Co.",
        category: "Printing",
        location: "Riyadh",
        rating: 4.5,
        priceRange: "$$",
        image: "fa-display",
        description: "Digital signage and LED displays."
    },
    // === HEALTH & MEDICAL ===
    {
        id: "v39",
        name: "Event Medics",
        category: "Medical Services",
        location: "Riyadh",
        rating: 4.7,
        priceRange: "$$",
        image: "fa-kit-medical",
        description: "On-site medical teams and first aid."
    },
    {
        id: "v40",
        name: "Ambulance Services",
        category: "Medical Services",
        location: "Jeddah",
        rating: 4.8,
        priceRange: "$$$",
        image: "fa-truck-medical",
        description: "Emergency medical response for large events."
    },
    // === TECHNOLOGY ===
    {
        id: "v41",
        name: "Event App Solutions",
        category: "Technology",
        location: "Riyadh",
        rating: 4.6,
        priceRange: "$$",
        image: "fa-mobile-screen",
        description: "Custom event apps and registration systems."
    },
    {
        id: "v42",
        name: "WiFi Events Co.",
        category: "Technology",
        location: "Dammam",
        rating: 4.4,
        priceRange: "$$",
        image: "fa-wifi",
        description: "Temporary WiFi solutions for large gatherings."
    },
    {
        id: "v43",
        name: "Live Streaming Pro",
        category: "Technology",
        location: "Riyadh",
        rating: 4.7,
        priceRange: "$$$",
        image: "fa-video",
        description: "Professional live streaming services."
    },
    // === CLEANING & MAINTENANCE ===
    {
        id: "v44",
        name: "Sparkle Cleaners",
        category: "Cleaning",
        location: "Riyadh",
        rating: 4.5,
        priceRange: "$",
        image: "fa-broom",
        description: "Post-event cleaning and waste management."
    },
    {
        id: "v45",
        name: "Portable Restrooms Co.",
        category: "Facilities",
        location: "Jeddah",
        rating: 4.3,
        priceRange: "$",
        image: "fa-restroom",
        description: "Luxury portable restroom rentals."
    },
    // === SPECIAL SERVICES ===
    {
        id: "v46",
        name: "Fireworks Arabia",
        category: "Special Effects",
        location: "Riyadh",
        rating: 4.9,
        priceRange: "$$$",
        image: "fa-fire",
        description: "Professional fireworks displays."
    },
    {
        id: "v47",
        name: "Laser Light Shows",
        category: "Special Effects",
        location: "Jeddah",
        rating: 4.7,
        priceRange: "$$$",
        image: "fa-bolt",
        description: "Laser and light show productions."
    },
    {
        id: "v48",
        name: "Kids Entertainment Zone",
        category: "Children Services",
        location: "Riyadh",
        rating: 4.6,
        priceRange: "$$",
        image: "fa-child",
        description: "Children's entertainment and activities."
    },
    {
        id: "v49",
        name: "Face Painters & Artists",
        category: "Children Services",
        location: "Dammam",
        rating: 4.5,
        priceRange: "$",
        image: "fa-palette",
        description: "Face painting and art activities."
    },
    {
        id: "v50",
        name: "Translation Services",
        category: "Professional Services",
        location: "Riyadh",
        rating: 4.7,
        priceRange: "$$",
        image: "fa-language",
        description: "Simultaneous translation and interpretation."
    },
    {
        id: "v51",
        name: "Event Insurance Co.",
        category: "Professional Services",
        location: "Jeddah",
        rating: 4.4,
        priceRange: "$$",
        image: "fa-file-shield",
        description: "Event liability and cancellation insurance."
    },
    {
        id: "v52",
        name: "Sustainability Events Co.",
        category: "Eco-Friendly Services",
        location: "Riyadh",
        rating: 4.6,
        priceRange: "$$",
        image: "fa-leaf",
        description: "Sustainable event planning and eco-friendly supplies."
    },
    {
        id: "v53",
        name: "VR Experience Zone",
        category: "VR/AR Experiences",
        location: "Riyadh",
        rating: 4.7,
        priceRange: "$$$",
        image: "fa-vr-cardboard",
        description: "Virtual and augmented reality experiences for events."
    },
    {
        id: "v54",
        name: "Gift & Giveaway Co.",
        category: "Gifts & Giveaways",
        location: "Jeddah",
        rating: 4.5,
        priceRange: "$",
        image: "fa-gift",
        description: "Custom branded gifts and event giveaways."
    }
];



// ============================================================================
// DUMMY OUTGOING REQUESTS (Organizer → Vendor)
// ============================================================================
const DUMMY_REQUESTS = [
    {
        id: "r1",
        vendorId: "v1", // Luxe Catering
        eventId: "101", // Ongoing Tech Expo
        status: "Approved",
        dateSent: "2025-01-15",
        message: "We would like to request catering for 200 VIP guests."
    },
    {
        id: "r2",
        vendorId: "v3", // Sweet Delights Bakery
        eventId: "102", // Riyadh Art Week
        status: "Pending",
        dateSent: "2026-01-20",
        message: "Requesting a quote for main stage lighting and sound."
    },
    {
        id: "r3",
        vendorId: "v11", // City Municipality
        eventId: "102", // Riyadh Art Week
        status: "Pending",
        dateSent: "2026-01-22",
        message: "Application for outdoor event permit."
    },
    {
        id: "r4",
        vendorId: "v4", // Coffee Culture
        eventId: "103", // Business Summit
        status: "Rejected",
        dateSent: "2025-12-10",
        message: "Request for coffee station at entrance.",
        rejectionReason: "We are fully booked for that period and cannot take on additional events."
    },
    {
        id: "r5",
        vendorId: "v1", // Luxe Catering
        eventId: "106", // Riyadh Marathon
        status: "Approved",
        dateSent: "2026-03-05",
        message: "Invitation to provide healthy snacks and refreshments for marathon runners at 3 stations."
    },
    {
        id: "r6",
        vendorId: "v1", // Luxe Catering
        eventId: "103", // Business Summit
        status: "Approved",
        dateSent: "2026-02-10",
        message: "Requesting executive lunch service for 50 VIPs."
    },
    {
        id: "r7",
        vendorId: "v1", // Luxe Catering
        eventId: "102", // Riyadh Art Week
        status: "Approved",
        dateSent: "2026-01-18",
        message: "Please provide gourmet catering for 150 guests at the opening ceremony."
    },
    {
        id: "r8",
        vendorId: "v1", // Luxe Catering - PENDING invitation
        eventId: "104", // Saudi Music Festival
        status: "Pending",
        dateSent: "2026-02-20",
        message: "We would love to have your catering services for our music festival. Expected attendance: 2000+ guests. We need food trucks and beverage stations."
    },
    {
        id: "r9",
        vendorId: "v1", // Luxe Catering - REJECTED invitation
        eventId: "105", // Past Education Conference (for history)
        status: "Rejected",
        dateSent: "2025-11-15",
        message: "Invitation to provide catering for academic conference with 500 attendees.",
        rejectionReason: "Our team is not available on that date due to a prior commitment."
    },
    {
        id: "r10",
        vendorId: "v1", // Luxe Catering - PENDING invitation
        eventId: "106", // Riyadh Marathon - another pending
        status: "Pending",
        dateSent: "2026-03-25",
        message: "Additional invitation: We need premium catering for VIP lounge area for marathon sponsors and officials (approx 100 people)."
    }
];



// ============================================================================
// DUMMY INCOMING REQUESTS (Vendor → Organizer)
// ============================================================================
const DUMMY_INCOMING_REQUESTS = [
    {
        id: "ir1",
        vendorName: "Sparkle Cleaners",
        vendorEmail: "contact@sparkleclean.com",
        serviceType: "Cleaning",
        eventId: "102", // Riyadh Art Week
        status: "Pending",
        dateReceived: "2026-02-01",
        message: "We offer post-event cleaning services with eco-friendly products."
    },
    {
        id: "ir2",
        vendorName: "SafeGuard Security",
        vendorEmail: "info@safeguard.sa",
        serviceType: "Security",
        eventId: "103", // Business Summit
        status: "Approved",
        dateReceived: "2026-01-28",
        message: "Providing 10 security personnel for the main entrance and hall."
    },
    {
        id: "ir3",
        vendorName: "Quick Print Solutions",
        vendorEmail: "orders@quickprint.com",
        serviceType: "Printing",
        eventId: "101", // Ongoing Tech Expo
        status: "Rejected",
        dateReceived: "2026-01-15",
        message: "Proposal for on-site badge printing services."
    },
    // Example WITH ATTACHMENT – Organizer: go to Requests → From vendors → find "Ongoing Tech Expo" → click View on "Luxe Catering Co." to see the attachment card
    {
        id: "ir4",
        vendorName: "Luxe Catering Co.",
        vendorEmail: "contact@luxecatering.sa",
        serviceType: "Catering",
        eventId: "101", // Ongoing Tech Expo
        status: "Pending",
        dateReceived: new Date().toISOString().split('T')[0],
        message: "We would love to provide catering for your Tech Expo. We specialize in corporate events and can offer buffet, plated, or station options. Please see our company profile attached.",
        attachmentFileName: "Luxe_Catering_Company_Profile.pdf",
        attachmentMimeType: "application/pdf",
        // Tiny PDF (1-page) in base64 – clicking View opens it in a new tab; Download saves the file
        attachmentData: "JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKL01lZGlhQm94IFswIDAgNjEyIDc5Ml0KPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovUmVzb3VyY2VzIDw8Ci9Gb250IDw8Ci9GMSA0IDAgUgo+Pgo+PgovQ29udGVudHMgNSAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvSGVsdmV0aWNhCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCi9GMSAxMiBUZgoxMDAgNzAwIFRkCihMdXhlIENhdGVyaW5nIENvLiAtIERlbW8gYXR0YWNobWVudCkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmIDAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1MiAwMDAwMCBuIAowMDAwMDAwMTM3IDAwMDAwIG4gCjAwMDAwMDAxOTIgMDAwMDAgbiAKMDAwMDAwMDI3NyAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDYKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjM2MAolJUVPRgo="
    }
];



// ============================================================================
// DUMMY EVENT-VENDOR ASSIGNMENTS (which vendors are assigned to each event)
// ============================================================================
const DUMMY_EVENT_VENDORS = [

    // =========================================================
    // Ongoing Tech Expo (101) — 4 vendors, all 5 stages covered
    // =========================================================

    // v1 — "In Transit" stage, organizer has requested an update
    {
        eventId: "101", vendorId: "v1", status: "Confirmed",
        assignedDate: "2026-01-10",
        preparationStatus: "In Transit",
        updateRequested: true,
        statusHistory: [
            {
                status: "Pending",
                note: "Vendor confirmed for the event.",
                timestamp: "2026-01-10T09:00:00",
                source: "system"
            },
            {
                status: "Preparing",
                note: "Started prepping the Mediterranean buffet. Ingredients sourced and staff briefed for the 200-guest setup.",
                timestamp: "2026-02-10T11:30:00",
                source: "vendor"
            },
            {
                status: "In Transit",
                note: "Our catering truck is on the way — carrying all equipment and pre-prepared dishes. ETA to venue: 2 hours. Will call on arrival.",
                timestamp: "2026-02-28T08:15:00",
                source: "vendor"
            }
        ]
    },

    // v20 — TechAV Solutions — "Setting Up" stage, no update request
    {
        eventId: "101", vendorId: "v20", status: "Confirmed",
        assignedDate: "2026-01-12",
        preparationStatus: "Setting Up",
        updateRequested: false,
        statusHistory: [
            {
                status: "Pending",
                note: "Vendor confirmed for the event.",
                timestamp: "2026-01-12T08:00:00",
                source: "system"
            },
            {
                status: "Preparing",
                note: "All four 65\" 4K LED screens loaded and tested at our warehouse. Projector calibration done. Wireless mics charged and paired.",
                timestamp: "2026-02-20T14:00:00",
                source: "vendor"
            },
            {
                status: "In Transit",
                note: "Equipment loaded into two vans. Departed warehouse at 6 AM — on schedule for the 7 AM venue arrival.",
                timestamp: "2026-02-28T06:05:00",
                source: "vendor"
            },
            {
                status: "Setting Up",
                note: "Arrived at Hall A. LED screens are up, projector aligned. Running final sound-check for the mics now. Should be done by 9 AM.",
                timestamp: "2026-02-28T07:40:00",
                source: "vendor"
            }
        ]
    },

    // v33 — SafeGuard Security — fully "Ready" ✅
    {
        eventId: "101", vendorId: "v33", status: "Confirmed",
        assignedDate: "2026-01-14",
        preparationStatus: "Ready",
        updateRequested: false,
        statusHistory: [
            {
                status: "Pending",
                note: "Vendor confirmed for the event.",
                timestamp: "2026-01-14T10:00:00",
                source: "system"
            },
            {
                status: "Preparing",
                note: "Team briefed on event layout, entry/exit points, and emergency procedures. Uniforms and radios assigned to all 12 personnel.",
                timestamp: "2026-02-15T09:00:00",
                source: "vendor"
            },
            {
                status: "In Transit",
                note: "Team departed from HQ. Split into 3 groups heading to Gate 1, Gate 2, and the main hall.",
                timestamp: "2026-02-28T05:30:00",
                source: "vendor"
            },
            {
                status: "Setting Up",
                note: "All personnel at designated positions. Radios tested, perimeter walk completed, access control system online.",
                timestamp: "2026-02-28T06:45:00",
                source: "vendor"
            },
            {
                status: "Ready",
                note: "Security team is fully in position and operational. All systems are green. We are ready for attendee arrival. ✅",
                timestamp: "2026-02-28T07:30:00",
                source: "vendor"
            }
        ]
    },

    // v17 — Photo Magic Studios — still "Pending" approval (no timeline shown)
    { eventId: "101", vendorId: "v17", status: "Pending", assignedDate: "2026-02-18" },


    // =========================================================
    // Riyadh Art Week (102) — 3 vendors
    // =========================================================

    // v2 — Arabian Feast Catering — "Preparing" stage
    {
        eventId: "102", vendorId: "v2", status: "Confirmed",
        assignedDate: "2025-12-20",
        preparationStatus: "Preparing",
        updateRequested: false,
        statusHistory: [
            {
                status: "Pending",
                note: "Vendor confirmed for the event.",
                timestamp: "2025-12-20T14:00:00",
                source: "system"
            },
            {
                status: "Preparing",
                note: "Sourcing fresh ingredients for the mandi and kabsa. Custom dessert display stands are being assembled at our kitchen. On track for delivery.",
                timestamp: "2026-01-15T10:30:00",
                source: "vendor"
            }
        ]
    },

    // v26 — Bloom & Petal Florists — "Pending" prep (just confirmed, organizer requested update)
    {
        eventId: "102", vendorId: "v26", status: "Confirmed",
        assignedDate: "2025-12-22",
        preparationStatus: "Pending",
        updateRequested: true,
        statusHistory: [
            {
                status: "Pending",
                note: "Vendor confirmed for the event.",
                timestamp: "2025-12-22T09:00:00",
                source: "system"
            }
        ]
    },

    // v44 — Sparkle Cleaners — still Pending approval
    { eventId: "102", vendorId: "v44", status: "Pending", assignedDate: "2026-01-30" },


    // =========================================================
    // Business Leadership Summit (103) — 3 vendors
    // =========================================================

    // v1 — Luxe Catering — "Ready" ✅
    {
        eventId: "103", vendorId: "v1", status: "Confirmed",
        assignedDate: "2026-01-05",
        preparationStatus: "Ready",
        updateRequested: false,
        statusHistory: [
            {
                status: "Pending",
                note: "Vendor confirmed for the event.",
                timestamp: "2026-01-05T10:00:00",
                source: "system"
            },
            {
                status: "Preparing",
                note: "Executive plated menu confirmed: wagyu steak and truffle risotto. 3 chefs assigned, all ingredients sourced from premium suppliers.",
                timestamp: "2026-02-12T09:00:00",
                source: "vendor"
            },
            {
                status: "In Transit",
                note: "Leaving our kitchen now with all pre-prepared dishes and equipment. ETA to Summit venue: 45 minutes.",
                timestamp: "2026-02-14T08:00:00",
                source: "vendor"
            },
            {
                status: "Setting Up",
                note: "Plating station set up in the banquet kitchen. Coffee and pastry station assembled at the entrance lobby. Looks great!",
                timestamp: "2026-02-14T09:15:00",
                source: "vendor"
            },
            {
                status: "Ready",
                note: "Everything is set. Plated service ready for 50 VIP guests. Coffee station stocked. Team is standing by — we're all yours! ✅",
                timestamp: "2026-02-14T10:00:00",
                source: "vendor"
            }
        ]
    },

    // v33 — SafeGuard Security — "Setting Up" at Summit
    {
        eventId: "103", vendorId: "v33", status: "Confirmed",
        assignedDate: "2026-01-08",
        preparationStatus: "Setting Up",
        updateRequested: false,
        statusHistory: [
            {
                status: "Pending",
                note: "Vendor confirmed for the event.",
                timestamp: "2026-01-08T10:00:00",
                source: "system"
            },
            {
                status: "Preparing",
                note: "6-person team selected. Briefed on conference floor plan, VIP areas, and press zone access control.",
                timestamp: "2026-02-10T13:00:00",
                source: "vendor"
            },
            {
                status: "In Transit",
                note: "Team en route to the Conference Center. Will be on-site by 7:30 AM.",
                timestamp: "2026-02-14T07:00:00",
                source: "vendor"
            },
            {
                status: "Setting Up",
                note: "Positions taken at main entrance and VIP corridor. Scanning equipment tested. Final walk-through underway.",
                timestamp: "2026-02-14T07:45:00",
                source: "vendor"
            }
        ]
    },

    // v50 — Translation Services — Declined
    { eventId: "103", vendorId: "v50", status: "Declined", assignedDate: "2026-01-10" },


    // =========================================================
    // Riyadh Marathon (106) — 2 vendors
    // =========================================================

    // v1 — Luxe Catering at Marathon — "In Transit"
    {
        eventId: "106", vendorId: "v1", status: "Confirmed",
        assignedDate: "2026-03-01",
        preparationStatus: "In Transit",
        updateRequested: false,
        statusHistory: [
            {
                status: "Pending",
                note: "Vendor confirmed for the event.",
                timestamp: "2026-03-01T09:00:00",
                source: "system"
            },
            {
                status: "Preparing",
                note: "Preparing 3 hydration stations with energy bars, bananas, and isotonic drinks. Ready by tomorrow morning.",
                timestamp: "2026-03-28T15:00:00",
                source: "vendor"
            },
            {
                status: "In Transit",
                note: "Truck loaded with all supplies for Stations A, B, and C along the route. Heading to the first drop-off point now.",
                timestamp: "2026-03-29T05:00:00",
                source: "vendor"
            }
        ]
    },

    // v39 — Event Medics — still Pending approval
    { eventId: "106", vendorId: "v39", status: "Pending", assignedDate: "2026-03-15" }

];



// ============================================================================
// DUMMY MESSAGES (Organizer ↔ Vendor conversations per event)
// ============================================================================
const DUMMY_MESSAGES = [
    // --- Tech Expo (101) + Luxe Catering (v1) ---
    { id: "msg1", eventId: "101", vendorId: "v1", sender: "organizer", text: "Hi! We'd like to confirm catering for 200 VIP guests at the Tech Expo. Can you handle this?", timestamp: "2026-01-10T09:00:00" },
    { id: "msg2", eventId: "101", vendorId: "v1", sender: "vendor", text: "Absolutely! We can provide a full premium buffet with live stations. Would you prefer Mediterranean or Asian fusion?", timestamp: "2026-01-10T09:45:00" },
    { id: "msg3", eventId: "101", vendorId: "v1", sender: "organizer", text: "Mediterranean sounds perfect. Please send us the menu options and pricing breakdown.", timestamp: "2026-01-10T10:15:00" },
    { id: "msg4", eventId: "101", vendorId: "v1", sender: "vendor", text: "Menu sent to your email! The package includes appetizers, 3 main courses, dessert station, and beverages. Total: 45,000 SAR for 200 guests.", timestamp: "2026-01-10T14:30:00" },
    // --- Tech Expo (101) + TechAV Solutions (v20) ---
    { id: "msg5", eventId: "101", vendorId: "v20", sender: "organizer", text: "We need 4 LED screens (65\"), a main stage projector, and wireless mic setup for the Tech Expo.", timestamp: "2026-01-12T08:00:00" },
    { id: "msg6", eventId: "101", vendorId: "v20", sender: "vendor", text: "Got it. We'll provide 4x 65\" 4K LED displays, a 12,000 lumen projector, and 8 wireless lavalier mics. Delivery and setup included.", timestamp: "2026-01-12T10:00:00" },
    { id: "msg7", eventId: "101", vendorId: "v20", sender: "organizer", text: "Great. What time will you arrive for setup? The venue opens at 6 AM on the event day.", timestamp: "2026-01-12T11:30:00" },
    // --- Art Week (102) + Arabian Feast Catering (v2) ---
    { id: "msg8", eventId: "102", vendorId: "v2", sender: "organizer", text: "Hello! We're planning the opening ceremony for Riyadh Art Week. Can you provide traditional Saudi cuisine for 150 guests?", timestamp: "2025-12-20T14:00:00" },
    { id: "msg9", eventId: "102", vendorId: "v2", sender: "vendor", text: "We'd love to! Our Arabian Nights package includes mandi, kabsa, grilled meats, and a full dessert spread. Perfect for cultural events.", timestamp: "2025-12-20T15:30:00" },
    { id: "msg10", eventId: "102", vendorId: "v2", sender: "organizer", text: "Sounds excellent. Please confirm availability for January 20th.", timestamp: "2025-12-20T16:00:00" },
    // --- Business Summit (103) + Luxe Catering (v1) ---
    { id: "msg11", eventId: "103", vendorId: "v1", sender: "organizer", text: "We need executive lunch service for the Business Leadership Summit — 50 VIP guests. What options do you have?", timestamp: "2026-01-05T10:00:00" },
    { id: "msg12", eventId: "103", vendorId: "v1", sender: "vendor", text: "For an executive setting, I recommend our plated 3-course meal: grilled salmon, wagyu steak, or truffle risotto options. 850 SAR per guest.", timestamp: "2026-01-05T11:00:00" },
    { id: "msg13", eventId: "103", vendorId: "v1", sender: "organizer", text: "Let's go with the mixed plated option. Please also include a coffee and pastry station for the morning session.", timestamp: "2026-01-05T11:30:00" }
];



// ============================================================================
// DUMMY BROADCASTS (Organizer → All Attendees per event)
// ============================================================================
const DUMMY_BROADCASTS = [
    { id: "bc1", eventId: "101", message: "🎉 Welcome to the Tech Expo! Gates open at 8:30 AM. Don't forget to bring your digital ticket for fast entry. See you there!", timestamp: "2026-02-22T07:00:00" },
    { id: "bc2", eventId: "101", message: "📢 Reminder: The keynote speech by Dr. Sarah Al-Fahad starts at 10:00 AM in Hall A. Seats are limited — arrive early!", timestamp: "2026-02-22T09:30:00" },
    { id: "bc3", eventId: "102", message: "🎨 Riyadh Art Week is just 2 days away! Parking info: use Gate 3 for the closest access. Free shuttles from King Abdullah Station.", timestamp: "2026-01-18T10:00:00" },
    { id: "bc4", eventId: "103", message: "📋 Business Leadership Summit Schedule Update: The networking session has been moved to 3:00 PM in Conference Room B.", timestamp: "2026-02-14T16:00:00" },
    // --- Riyadh Marathon (106) Broadcasts for Attendee Demo ---
    { id: "bc5", eventId: "106", message: "🏃‍♂️ Welcome to the Riyadh Marathon 2026! Packet pickup begins tomorrow at the main stadium entrance from 9 AM to 6 PM. Please bring your Eventia digital ticket and a valid ID.", timestamp: "2026-02-23T10:00:00" },
    { id: "bc6", eventId: "106", message: "⚠️ URGENT WEATHER UPDATE & ROUTE CHANGES: Due to expected high temperatures this weekend, we have decided to adjust the starting times and the route for the Full and Half Marathon categories. The Full Marathon will now start exactly at 5:00 AM instead of 6:30 AM, and the Half Marathon will begin at 5:45 AM. Additionally, we have added three more hydration and medical stations along the King Khalid Road stretch (at KM 12, KM 18, and KM 25). Please ensure you hydrate well 48 hours before the race and dress appropriately for the heat. Shuttle services will also begin operations an hour earlier at 3:30 AM from the designated remote parking lots. Your safety is our absolute priority, and we appreciate your flexibility. Let's make this a fantastic and safe race for everyone!", timestamp: "2026-02-23T14:30:00" }
];



// ============================================================================
// SEED DATA FUNCTION - ACTIVE FOR PRESENTATION
// ============================================================================
(function seedDummyData() {
    const EVENTS_DB_KEY = 'eventia_events_db';
    const VENDORS_DB_KEY = 'eventia_vendors_db';
    const REQUESTS_DB_KEY = 'eventia_requests_db';
    const INCOMING_REQUESTS_KEY = 'eventia_incoming_requests';
    const EVENT_VENDORS_KEY = 'eventia_event_vendors';
    const MESSAGES_KEY = 'eventia_messages';
    const BROADCASTS_KEY = 'eventia_broadcasts';

    console.log("Seeding Dummy Data for Presentation...");
    localStorage.setItem(EVENTS_DB_KEY, JSON.stringify(DUMMY_EVENTS));
    localStorage.setItem(VENDORS_DB_KEY, JSON.stringify(DUMMY_VENDORS));
    localStorage.setItem(REQUESTS_DB_KEY, JSON.stringify(DUMMY_REQUESTS));
    localStorage.setItem(INCOMING_REQUESTS_KEY, JSON.stringify(DUMMY_INCOMING_REQUESTS));
    localStorage.setItem(EVENT_VENDORS_KEY, JSON.stringify(DUMMY_EVENT_VENDORS));
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(DUMMY_MESSAGES));
    localStorage.setItem(BROADCASTS_KEY, JSON.stringify(DUMMY_BROADCASTS));
})();
