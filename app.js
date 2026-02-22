// =============================
// Language Switcher
// =============================
const I18N = {
    en: {
        "nav.home": "Home",
        "nav.login": "Log In",
        "nav.signup": "Sign Up",
        "hero.title": "Discover & Manage <br><span>Exceptional Events</span>",
        "hero.desc":
            "The centralized platform for seamless event management in Saudi Arabia. Connect with organizers, vendors, and attendees in one place.",
        "hero.browse": "Browse Events",
        "hero.create": "Create Event",
        "hero.premium": "Premium Events",
        "hero.networking": "Networking",
        "events.upcoming": "Upcoming Events",
        "event.badge.tech": "Tech",
        "event.badge.art": "Art",
        "event.badge.business": "Business",
        "event.viewDetails": "View Details",
        "login.title": "Welcome Back",
        "login.subtitle.attendee": "Login as an Attendee",
        "login.emailOrPhone": "Email Address or Phone Number",
        "login.password": "Password",
        "login.forgot": "Forgot Password?",
        "login.remember": "Remember me",
        "login.signin": "Sign In",
        "login.vendorOrg.q": "Are you a vendor or organizer?",
        "login.vendorOrg.btn": "Sign in as Vendor or Organizer",
        "login.new": "New to Eventia?",
        "login.create": "Create an account",
        "common.backHome": "Back to Home",
        "bLogin.title": "Business Login",
        "bLogin.subtitle": "Access your vendor or organizer dashboard",
        "bLogin.roleLabel": "I am a(n):",
        "bLogin.vendor": "Vendor",
        "bLogin.organizer": "Organizer",
        "bLogin.signInAs": "Sign In as",
        "bLogin.attendQuestion": "Just looking to attend events?",
        "bLogin.signInAttendee": "Sign in as Attendee",
        "bLogin.newTo": "New to Eventia?",
        "bLogin.createBusiness": "Create a business account",
        "signup.bizPrompt": "Want to host or provide services?",
        "signup.bizBtn": "Sign up as Vendor or Organizer",
        "signup.haveAccount": "Already have an account?",
        "signup.login": "Log in",
        "signup.subtitle": "Join Eventia as an Attendee",
        "biz.registerAsLabel": "Register as:",
        "biz.attendPrompt": "Just want to attend events?",
        "biz.attendBtn": "Sign up as Attendee",
        "biz.signupTitle": "Business Account",
        "biz.signupSubtitle": "Register as a Vendor or Organizer",
        "biz.signUpAs": "Sign Up as",
    },
    ar: {
        "nav.home": "الرئيسية",
        "nav.login": "تسجيل الدخول",
        "nav.signup": "إنشاء حساب",
        "hero.title": "اكتشف وأدر <br><span>أفضل الفعاليات</span>",
        "hero.desc":
            "المنصة المركزية لإدارة الفعاليات بسهولة في المملكة العربية السعودية. تواصل مع المنظمين، مزودي الخدمات، والمشاركين في مكان واحد.",
        "hero.browse": "تصفح الفعاليات",
        "hero.create": "إنشاء فعالية",
        "hero.premium": "فعاليات مميزة",
        "hero.networking": "شبكة علاقات",
        "events.upcoming": "الفعاليات القادمة",
        "event.badge.tech": "تقنية",
        "event.badge.art": "فن",
        "event.badge.business": "أعمال",
        "event.viewDetails": "عرض التفاصيل",
        "login.title": "مرحبًا بعودتك",
        "login.subtitle.attendee": "تسجيل الدخول كزائر",
        "login.emailOrPhone": "البريد الإلكتروني أو رقم الهاتف",
        "login.password": "كلمة المرور",
        "login.forgot": "نسيت كلمة المرور؟",
        "login.remember": "تذكرني",
        "login.signin": "تسجيل الدخول",
        "login.vendorOrg.q": "هل أنت مزود خدمة أو منظم؟",
        "login.vendorOrg.btn": "تسجيل الدخول كمزود خدمة أو منظم",
        "login.new": "جديد في Eventia؟",
        "login.create": "إنشاء حساب",
        "common.backHome": "العودة للرئيسية",
        "bLogin.title": "تسجيل دخول الأعمال",
        "bLogin.subtitle": "الدخول إلى لوحة تحكم مزود الخدمة أو المنظم",
        "bLogin.roleLabel": "أنا:",
        "bLogin.vendor": "مزود خدمة",
        "bLogin.organizer": "منظم",
        "bLogin.signInAs": "تسجيل الدخول ك",
        "bLogin.attendQuestion": "هل ترغب فقط بحضور الفعاليات؟",
        "bLogin.signInAttendee": "تسجيل الدخول كمشارك",
        "bLogin.newTo": "جديد في Eventia؟",
        "bLogin.createBusiness": "إنشاء حساب أعمال",
        "signup.bizPrompt": "هل ترغب في الاستضافة أو تقديم خدمات؟",
        "signup.bizBtn": "إنشاء حساب كمزود خدمة أو منظم",
        "signup.haveAccount": "لديك حساب بالفعل؟",
        "signup.login": "تسجيل الدخول",
        "signup.subtitle": "انضم إلى Eventia كزائر",
        "biz.registerAsLabel": "التسجيل كـ:",
        "biz.attendPrompt": "هل تريد حضور الفعاليات فقط؟",
        "biz.attendBtn": "إنشاء حساب كمشارك",
        "biz.signupTitle": "حساب أعمال",
        "biz.signupSubtitle": "سجّل كمزود خدمة أو منظم",
        "biz.signUpAs": "التسجيل كـ",
    },
};

function translateText(lang) {
    const dict = I18N[lang] || I18N.en;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        const val = dict[key];
        if (val != null) el.textContent = val;
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
        const key = el.getAttribute("data-i18n-html");
        const val = dict[key];
        if (val != null) el.innerHTML = val;
    });
}

function applyLang(lang) {
    localStorage.setItem("eventia_lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    translateText(lang);

    const btn = document.getElementById("lang-switch");
    if (btn) btn.textContent = lang === "ar" ? "EN" : "AR";

    const dict = I18N[lang] || I18N.en;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        const val = dict[key];
        if (val != null) el.textContent = val;
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
        const key = el.getAttribute("data-i18n-html");
        const val = dict[key];
        if (val != null) el.innerHTML = val;
    });

    // Refresh dynamic signup fields (safe)
    const signupDynamicContainerEl = document.getElementById(
        "signup-dynamic-fields",
    );
    const signupFormEl = document.getElementById("signup-form");
    const activeTab = document.querySelector(".role-tab.active");
    const role = activeTab?.dataset.role || signupFormEl?.dataset.role || "attendee";

    // Only call updateSignupFields if it exists in this scope
    if (signupDynamicContainerEl && typeof updateSignupFields === "function") {
        updateSignupFields(role);
    }

    // Update business submit button role text
    document.querySelectorAll(".current-role-text").forEach((span) => {
        const container = span.closest('[id$="-form-container"]');
        const active = container?.querySelector(".role-tab.active");
        const r = active?.dataset.role;
        if (!r) return;

        const map = {
            organizer: lang === "ar" ? "منظم" : "Organizer",
            vendor: lang === "ar" ? "مزود خدمة" : "Vendor",
        };
        span.textContent = map[r] || span.textContent;
    });
}

document.addEventListener('DOMContentLoaded', () => {


    // --- Navigation & View Management ---
    // Note: Routing is now handled by multi-page structure (index.html, login.html, signup.html)

    // Check which dashboard we are on
    const isScegaDashboard = document.querySelector('.sidebar-brand') && document.querySelector('.sidebar-brand').textContent.includes('SCEGA');
    const isOrganiserDashboard = document.querySelector('.sidebar-brand') && document.querySelector('.sidebar-brand').textContent.includes('EVENTIA');


    const heroBrowseBtn = document.getElementById('hero-browse-btn');

    if (heroBrowseBtn) {
        heroBrowseBtn.addEventListener('click', () => {
            const grid = document.querySelector('.events-container');
            if (grid) grid.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- Role Management (Login & Signup) ---
    const getLang = () => localStorage.getItem("eventia_lang") || document.documentElement.lang || "en";
    const isArabic = () => getLang() === "ar";

    const getTXT = () => isArabic() ? {
        // ======================
        // Common
        // ======================
        username: "اسم المستخدم",
        orgName: "اسم الجهة",
        vendorName: "اسم مزود الخدمة",
        phone: "رقم الهاتف",
        email: "البريد الإلكتروني",
        password: "كلمة المرور",
        confirmPassword: "تأكيد كلمة المرور",
        strongPassword: "أنشئ كلمة مرور قوية",
        reenterPassword: "أعد إدخال كلمة المرور",
        invalidEmail: "يرجى إدخال بريد إلكتروني صحيح",
        passwordPolicy: "يجب أن تحتوي كلمة المرور على: 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم، ورمز خاص.",
        passwordsNoMatch: "كلمتا المرور غير متطابقتين",

        // ======================
        // Attendee
        // ======================
        firstName: "الاسم الأول",
        lastName: "اسم العائلة",
        gender: "الجنس",
        selectGender: "اختر الجنس",
        male: "ذكر",
        female: "أنثى",
        birthday: "تاريخ الميلاد",
        month: "الشهر",
        day: "اليوم",
        year: "السنة",

        // ======================
        // Vendor
        // ======================
        serviceType: "نوع الخدمة",
        selectServiceType: "اختر نوع الخدمة",

        // --- Optgroup labels ---
        og_food: "الأطعمة والمشروبات",
        og_venues: "القاعات والمواقع",
        og_av: "الصوتيات والتقنية",
        og_decor: "الديكور والتصميم",
        og_photo: "التصوير والإعلام",
        og_ent: "الترفيه",
        og_transport: "النقل",
        og_security: "الأمن والسلامة",
        og_staff: "الكوادر والخدمات",
        og_rentals: "التأجير والمعدات",
        og_marketing: "التسويق والترويج",
        og_gov: "الجهات والتصاريح",
        og_sponsors: "الرعاة والشركاء",
        og_saudi: "الخدمات التراثية السعودية",
        og_special: "خدمات متخصصة",

        // --- Options (Food & Beverages) ---
        opt_catering: "تموين",
        opt_bakery: "مخابز وحلويات",
        opt_beverages: "مشروبات",
        opt_foodTrucks: "عربات طعام",

        // --- Options (Venues) ---
        opt_venueHall: "قاعة / موقع",
        opt_conferenceHall: "قاعة مؤتمرات",
        opt_outdoorVenue: "موقع خارجي",

        // --- Options (AV & Technology) ---
        opt_avEquipment: "معدات صوت وصورة",
        opt_ledScreens: "شاشات LED",
        opt_stageRigging: "منصات وتجهيزات",
        opt_liveStreaming: "بث مباشر",

        // --- Options (Decoration & Design) ---
        opt_decoration: "ديكور",
        opt_floralDesign: "تنسيق زهور",
        opt_balloonDecor: "ديكور بالونات",
        opt_eventLighting: "إضاءة فعاليات",

        // --- Options (Photography & Media) ---
        opt_photography: "تصوير",
        opt_aerialPhotography: "تصوير جوي",
        opt_photoBooth: "كشك تصوير",

        // --- Options (Entertainment) ---
        opt_djServices: "خدمات DJ",
        opt_liveEntertainment: "عروض مباشرة",
        opt_kidsEntertainment: "ترفيه للأطفال",
        opt_traditionalMusic: "موسيقى شعبية",
        opt_fireworks: "ألعاب نارية ومؤثرات",

        // --- Options (Transportation) ---
        opt_transportation: "نقل",
        opt_shuttleServices: "خدمات نقل جماعي",
        opt_valetParking: "مواقف فاليه",

        // --- Options (Security & Safety) ---
        opt_security: "أمن",
        opt_vipSecurity: "أمن كبار الشخصيات",
        opt_medicalServices: "خدمات طبية",

        // --- Options (Staffing & Services) ---
        opt_eventStaff: "طاقم فعاليات",
        opt_translation: "ترجمة",
        opt_mcHosting: "تقديم وإدارة الحفل",

        // --- Options (Rentals & Equipment) ---
        opt_tentRentals: "تأجير خيام",
        opt_furnitureRentals: "تأجير أثاث",
        opt_tableChairRentals: "تأجير طاولات/كراسي",
        opt_powerSupply: "توفير كهرباء",

        // --- Options (Marketing & Promotion) ---
        opt_printing: "طباعة",
        opt_socialMediaMarketing: "تسويق عبر السوشيال ميديا",
        opt_influencerMarketing: "تسويق عبر المؤثرين",

        // --- Options (Government & Permits) ---
        opt_governmentPermits: "تصاريح حكومية",
        opt_safetyPermits: "تصاريح سلامة",

        // --- Options (Sponsors & Partners) ---
        opt_sponsors: "رعاة",
        opt_brandPartners: "شركاء علامات تجارية",

        // --- Options (Saudi Cultural) ---
        opt_hennaArtists: "نقاشات حناء",
        opt_falconryShows: "عروض صقور",
        opt_horseShows: "عروض خيل",
        opt_arabianPerfumes: "عطور عربية",
        opt_arabicCalligraphy: "خط عربي",

        // --- Options (Specialized Services) ---
        opt_vrAr: "تجارب VR/AR",
        opt_ecoFriendly: "خدمات صديقة للبيئة",
        opt_giftsGiveaways: "هدايا وتوزيعات",

        // ======================
        // Months
        // ======================
        months: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",],
    } : {
        // ======================
        // Common
        // ======================
        username: "Username",
        orgName: "Organization Name",
        vendorName: "Vendor Name",
        phone: "Phone Number",
        email: "Email Address",
        password: "Password",
        confirmPassword: "Confirm Password",
        strongPassword: "Create a strong password",
        reenterPassword: "Re-enter password",
        invalidEmail: "Please enter a valid email address",
        passwordPolicy: "Password must include: At least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character.",
        passwordsNoMatch: "Passwords do not match",

        // ======================
        // Attendee
        // ======================
        firstName: "First Name",
        lastName: "Last Name",
        gender: "Gender",
        selectGender: "Select Gender",
        male: "Male",
        female: "Female",
        birthday: "Birthday",
        month: "Month",
        day: "Day",
        year: "Year",

        // ======================
        // Vendor
        // ======================
        serviceType: "Service Type",
        selectServiceType: "Select Service Type",

        // --- Optgroup labels ---
        og_food: "Food & Beverages",
        og_venues: "Venues",
        og_av: "AV & Technology",
        og_decor: "Decoration & Design",
        og_photo: "Photography & Media",
        og_ent: "Entertainment",
        og_transport: "Transportation",
        og_security: "Security & Safety",
        og_staff: "Staffing & Services",
        og_rentals: "Rentals & Equipment",
        og_marketing: "Marketing & Promotion",
        og_gov: "Government & Permits",
        og_sponsors: "Sponsors & Partners",
        og_saudi: "Saudi Cultural",
        og_special: "Specialized Services",

        // --- Options (Food & Beverages) ---
        opt_catering: "Catering",
        opt_bakery: "Bakery & Desserts",
        opt_beverages: "Beverages",
        opt_foodTrucks: "Food Trucks",

        // --- Options (Venues) ---
        opt_venueHall: "Venue / Hall",
        opt_conferenceHall: "Conference Hall",
        opt_outdoorVenue: "Outdoor Venue",

        // --- Options (AV & Technology) ---
        opt_avEquipment: "AV Equipment",
        opt_ledScreens: "LED Screens",
        opt_stageRigging: "Stage & Rigging",
        opt_liveStreaming: "Live Streaming",

        // --- Options (Decoration & Design) ---
        opt_decoration: "Decoration",
        opt_floralDesign: "Floral Design",
        opt_balloonDecor: "Balloon Decor",
        opt_eventLighting: "Event Lighting",

        // --- Options (Photography & Media) ---
        opt_photography: "Photography",
        opt_aerialPhotography: "Aerial Photography",
        opt_photoBooth: "Photo Booth",

        // --- Options (Entertainment) ---
        opt_djServices: "DJ Services",
        opt_liveEntertainment: "Live Entertainment",
        opt_kidsEntertainment: "Kids Entertainment",
        opt_traditionalMusic: "Traditional Music",
        opt_fireworks: "Fireworks & Pyro",

        // --- Options (Transportation) ---
        opt_transportation: "Transportation",
        opt_shuttleServices: "Shuttle Services",
        opt_valetParking: "Valet Parking",

        // --- Options (Security & Safety) ---
        opt_security: "Security",
        opt_vipSecurity: "VIP Security",
        opt_medicalServices: "Medical Services",

        // --- Options (Staffing & Services) ---
        opt_eventStaff: "Event Staff",
        opt_translation: "Translation",
        opt_mcHosting: "MC & Hosting",

        // --- Options (Rentals & Equipment) ---
        opt_tentRentals: "Tent Rentals",
        opt_furnitureRentals: "Furniture Rentals",
        opt_tableChairRentals: "Table/Chair Rentals",
        opt_powerSupply: "Power Supply",

        // --- Options (Marketing & Promotion) ---
        opt_printing: "Printing",
        opt_socialMediaMarketing: "Social Media Marketing",
        opt_influencerMarketing: "Influencer Marketing",

        // --- Options (Government & Permits) ---
        opt_governmentPermits: "Government Permits",
        opt_safetyPermits: "Safety Permits",

        // --- Options (Sponsors & Partners) ---
        opt_sponsors: "Sponsors",
        opt_brandPartners: "Brand Partners",

        // --- Options (Saudi Cultural) ---
        opt_hennaArtists: "Henna Artists",
        opt_falconryShows: "Falconry Shows",
        opt_horseShows: "Horse Shows",
        opt_arabianPerfumes: "Arabian Perfumes",
        opt_arabicCalligraphy: "Arabic Calligraphy",

        // --- Options (Specialized Services) ---
        opt_vrAr: "VR/AR Experiences",
        opt_ecoFriendly: "Eco-Friendly Services",
        opt_giftsGiveaways: "Gifts & Giveaways",

        // ======================
        // Months
        // ======================
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",],
    };

    const getRoleFields = (TXT) => ({
        organizer: `
            <div class="input-group">
                <label>${TXT.username}</label>
                <input type="text" class="ltr-input" placeholder="organizer123" required>
            </div>
            <div class="input-group">
                <label>${TXT.orgName}</label>
                <input type="text" placeholder="" required>
            </div>
            <div class="input-group">
                <label>${TXT.phone}</label>
                <input type="tel" placeholder="+966 5x xxx xxxx" required>
            </div>
            <div class="input-group">
                <label>${TXT.email}</label>
                <input type="email" class="signup-email" placeholder="name@company.org" required>
                <div class="error-message email-error">${TXT.invalidEmail}</div>
            </div>
            <div class="input-group">
                <label>${TXT.password}</label>
                <input type="password" class="signup-password" placeholder="${TXT.strongPassword}" required>
                <div class="password-policy-text">${TXT.passwordPolicy}</div>
                <div class="error-message password-strength-error"></div>
            </div>
            <div class="input-group">
                <label>${TXT.confirmPassword}</label>
                <input type="password" class="signup-confirm-password" placeholder="${TXT.reenterPassword}" required>
                <div class="error-message password-match-error">${TXT.passwordsNoMatch}</div>
            </div>
        `,
        vendor: `
            <div class="input-group">
                <label>${TXT.username}</label>
                <input type="text" class="ltr-input" placeholder="vendor123" required>
            </div>
            <div class="input-group">
                <label>${TXT.vendorName}</label>
                <input type="text" class="ltr-input" placeholder="Event Services Ltd." required>
            </div>
            <div class="input-group">
                <label>${TXT.phone}</label>
                <input type="tel" placeholder="+966 5x xxx xxxx" required>
            </div>
            <div class="input-group">
                <label>${TXT.serviceType}</label>
                <select required>
                    <option value="" disabled selected>${TXT.selectServiceType}</option>

                    <optgroup label="${TXT.og_food}">
                        <option value="Catering">${TXT.opt_catering}</option>
                        <option value="Bakery & Desserts">${TXT.opt_bakery}</option>
                        <option value="Beverages">${TXT.opt_beverages}</option>
                        <option value="Food Trucks">${TXT.opt_foodTrucks}</option>
                    </optgroup>

                    <optgroup label="${TXT.og_venues}">
                        <option value="Venue">${TXT.opt_venueHall}</option>
                        <option value="Conference Hall">${TXT.opt_conferenceHall}</option>
                        <option value="Outdoor Venue">${TXT.opt_outdoorVenue}</option>
                    </optgroup>

                    <optgroup label="${TXT.og_av}">
                        <option value="AV Equipment">${TXT.opt_avEquipment}</option>
                        <option value="LED Screens">${TXT.opt_ledScreens}</option>
                        <option value="Stage & Rigging">${TXT.opt_stageRigging}</option>
                        <option value="Live Streaming">${TXT.opt_liveStreaming}</option>
                    </optgroup>

                    <optgroup label="${TXT.og_decor}">
                        <option value="Decoration">${TXT.opt_decoration}</option>
                        <option value="Floral Design">${TXT.opt_floralDesign}</option>
                        <option value="Balloon Decor">${TXT.opt_balloonDecor}</option>
                        <option value="Event Lighting">${TXT.opt_eventLighting}</option>
                    </optgroup>

                    <optgroup label="${TXT.og_photo}">
                        <option value="Photography">${TXT.opt_photography}</option>
                        <option value="Aerial Photography">${TXT.opt_aerialPhotography}</option>
                        <option value="Photo Booth">${TXT.opt_photoBooth}</option>
                    </optgroup>

                    <optgroup label="${TXT.og_ent}">
                        <option value="DJ Services">${TXT.opt_djServices}</option>
                        <option value="Live Entertainment">${TXT.opt_liveEntertainment}</option>
                        <option value="Kids Entertainment">${TXT.opt_kidsEntertainment}</option>
                        <option value="Traditional Music">${TXT.opt_traditionalMusic}</option>
                        <option value="Fireworks & Pyro">${TXT.opt_fireworks}</option>
                    </optgroup>

                    <optgroup label="${TXT.og_transport}">
                        <option value="Transportation">${TXT.opt_transportation}</option>
                        <option value="Shuttle Services">${TXT.opt_shuttleServices}</option>
                        <option value="Valet Parking">${TXT.opt_valetParking}</option>
                    </optgroup>

                    <optgroup label="${TXT.og_security}">
                        <option value="Security">${TXT.opt_security}</option>
                        <option value="VIP Security">${TXT.opt_vipSecurity}</option>
                        <option value="Medical Services">${TXT.opt_medicalServices}</option>
                    </optgroup>

                    <optgroup label="${TXT.og_staff}">
                        <option value="Event Staff">${TXT.opt_eventStaff}</option>
                        <option value="Translation">${TXT.opt_translation}</option>
                        <option value="MC & Hosting">${TXT.opt_mcHosting}</option>
                    </optgroup>

                    <optgroup label="${TXT.og_rentals}">
                        <option value="Tent Rentals">${TXT.opt_tentRentals}</option>
                        <option value="Furniture Rentals">${TXT.opt_furnitureRentals}</option>
                        <option value="Table/Chair Rentals">${TXT.opt_tableChairRentals}</option>
                        <option value="Power Supply">${TXT.opt_powerSupply}</option>
                    </optgroup>

                    <optgroup label="${TXT.og_marketing}">
                        <option value="Printing">${TXT.opt_printing}</option>
                        <option value="Social Media Marketing">${TXT.opt_socialMediaMarketing}</option>
                        <option value="Influencer Marketing">${TXT.opt_influencerMarketing}</option>
                    </optgroup>

                    <optgroup label="${TXT.og_gov}">
                        <option value="Government Permits">${TXT.opt_governmentPermits}</option>
                        <option value="Safety Permits">${TXT.opt_safetyPermits}</option>
                    </optgroup>

                    <optgroup label="${TXT.og_sponsors}">
                        <option value="Sponsors">${TXT.opt_sponsors}</option>
                        <option value="Brand Partners">${TXT.opt_brandPartners}</option>
                    </optgroup>

                    <optgroup label="${TXT.og_saudi}">
                        <option value="Henna Artists">${TXT.opt_hennaArtists}</option>
                        <option value="Falconry Shows">${TXT.opt_falconryShows}</option>
                        <option value="Horse Shows">${TXT.opt_horseShows}</option>
                        <option value="Arabian Perfumes">${TXT.opt_arabianPerfumes}</option>
                        <option value="Arabic Calligraphy">${TXT.opt_arabicCalligraphy}</option>
                    </optgroup>

                    <optgroup label="${TXT.og_special}">
                        <option value="VR/AR Experiences">${TXT.opt_vrAr}</option>
                        <option value="Eco-Friendly Services">${TXT.opt_ecoFriendly}</option>
                        <option value="Gifts & Giveaways">${TXT.opt_giftsGiveaways}</option>
                    </optgroup>
                </select>
            </div>
            <div class="input-group">
                <label>${TXT.email}</label>
                <input type="email" class="signup-email" placeholder="contact@vendor.com" required>
                <div class="error-message email-error">${TXT.invalidEmail}</div>
            </div>
            <div class="input-group">
                <label>${TXT.password}</label>
                <input type="password" class="signup-password" placeholder="${TXT.strongPassword}" required>
                <div class="password-policy-text">${TXT.passwordPolicy}</div>
                <div class="error-message password-strength-error"></div>
            </div>
            <div class="input-group">
                <label>${TXT.confirmPassword}</label>
                <input type="password" class="signup-confirm-password" placeholder="${TXT.reenterPassword}" required>
                <div class="error-message password-match-error">${TXT.passwordsNoMatch}</div>
            </div>
        `,
        attendee: `
            <div class="form-row">
                <div class="input-group">
                    <label>${TXT.firstName}</label>
                    <input type="text" placeholder="" required>
                </div>
                <div class="input-group">
                    <label>${TXT.lastName}</label>
                    <input type="text" placeholder="" required>
                </div>
            </div>
            <div class="input-group">
                <label>${TXT.username}</label>
                <input type="text" class="ltr-input" placeholder="abdulrahman123" required>
            </div>
            <div class="input-group">
                <label>${TXT.email}</label>
                <input type="email" class="signup-email" placeholder="name@example.com" required>
            <div class="error-message email-error">${TXT.invalidEmail}</div>
            </div>
            <div class="input-group">
                <label>${TXT.phone}</label>
                <input type="tel" placeholder="+966 5x xxx xxxx" required>
            </div>
            <div class="input-group">
                <label>${TXT.gender}</label>
                <select required>
                    <option value="" disabled selected>${TXT.selectGender}</option>
                    <option value="male">${TXT.male}</option>
                    <option value="female">${TXT.female}</option>
                </select>
            </div>
            <div class="input-group">
                <label>${TXT.birthday}</label>
                <div class="date-inputs-wrapper">
                    <select class="date-select month-select" required>
                        <option value="" disabled selected>${TXT.month}</option>
                        <option value="1">${TXT.months[0]}</option>
                        <option value="2">${TXT.months[1]}</option>
                        <option value="3">${TXT.months[2]}</option>
                        <option value="4">${TXT.months[3]}</option>
                        <option value="5">${TXT.months[4]}</option>
                        <option value="6">${TXT.months[5]}</option>
                        <option value="7">${TXT.months[6]}</option>
                        <option value="8">${TXT.months[7]}</option>
                        <option value="9">${TXT.months[8]}</option>
                        <option value="10">${TXT.months[9]}</option>
                        <option value="11">${TXT.months[10]}</option>
                        <option value="12">${TXT.months[11]}</option>
                    </select>
                    <select class="date-select day-select" required>
                        <option value="" disabled selected>${TXT.day}</option>
                        <option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option>
                        <option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option>
                        <option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option>
                        <option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option>
                        <option value="21">21</option><option value="22">22</option><option value="23">23</option><option value="24">24</option><option value="25">25</option>
                        <option value="26">26</option><option value="27">27</option><option value="28">28</option><option value="29">29</option><option value="30">30</option>
                        <option value="31">31</option>
                    </select>
                    <select class="date-select year-select" required>
                        <option value="" disabled selected>${TXT.year}</option>
                    </select>
                </div>
            </div>
            <div class="input-group">
                <label>${TXT.password}</label>
                <input type="password" class="signup-password" placeholder="${TXT.strongPassword}" required>
                <div class="password-policy-text">${TXT.passwordPolicy}</div>
                <div class="error-message password-strength-error"></div>
            </div>
            <div class="input-group">
                <label>${TXT.confirmPassword}</label>
                <input type="password" class="signup-confirm-password" placeholder="${TXT.reenterPassword}" required>
                <div class="error-message password-match-error">${TXT.passwordsNoMatch}</div>
            </div>
        `,
    });

    const roleTabs = document.querySelectorAll('.role-tab');
    const signupDynamicContainer = document.getElementById('signup-dynamic-fields');
    const signupForm = document.getElementById('signup-form');

    // Initialize Signup Fields - check for role tabs or data-role attribute
    if (signupDynamicContainer) {
        // If there are role tabs, find the active one; otherwise use data-role from form
        const activeTab = document.querySelector('.role-tab.active');
        const initialRole = activeTab?.dataset.role || signupForm?.dataset.role || 'attendee';
        updateSignupFields(initialRole);
    }

    roleTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetForm = tab.dataset.target; // 'login' or 'signup'
            const role = tab.dataset.role;

            // 1. Update Tabs Visual State
            const parent = tab.parentElement;
            if (parent) {
                parent.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
            }
            tab.classList.add('active');

            // 2. Update Submit Button Text
            const formContainer = document.getElementById(`${targetForm}-form-container`,);
            if (formContainer) {
                const btnSpan = formContainer.querySelector(".current-role-text");

                const isArabic =
                    document.documentElement.lang === "ar" ||
                    document.documentElement.dir === "rtl";

                const roleMap = {
                    organizer: isArabic ? "منظم" : "Organizer",
                    vendor: isArabic ? "مزود خدمة" : "Vendor",
                };

                if (btnSpan) btnSpan.textContent = roleMap[role];
            }

            // 3. If Signup, inject fully dynamic fields
            if (targetForm === 'signup' && signupDynamicContainer) {
                updateSignupFields(role);
            }
        });
    });

    function updateSignupFields(role) {
        if (!signupDynamicContainer) return;
        signupDynamicContainer.style.opacity = '0';
        setTimeout(() => {
            const TXT = getTXT();
            const roleFields = getRoleFields(TXT);
            signupDynamicContainer.innerHTML = roleFields[role] || '';
            signupDynamicContainer.style.opacity = '1';

            // Populate Year Dropdown if attendee
            if (role === 'attendee') {
                const yearSelect = signupDynamicContainer.querySelector('.year-select');
                if (yearSelect) {
                    const currentYear = new Date().getFullYear();
                    const startYear = 1900;
                    for (let i = currentYear; i >= startYear; i--) {
                        const option = document.createElement('option');
                        option.value = i;
                        option.textContent = i;
                        yearSelect.appendChild(option);
                    }
                }
            }

            // Attach Password Validators after injection
            attachPasswordValidators();
            attachEmailCleaners();

        }, 200);
    }

    function attachEmailCleaners() {
        const emailInput = signupDynamicContainer.querySelector('.signup-email');
        if (emailInput) {
            emailInput.addEventListener('input', () => {
                if (emailInput.classList.contains('input-error')) {
                    const emailError = signupDynamicContainer.querySelector('.email-error');
                    if (emailError) emailError.classList.remove('visible');
                    emailInput.classList.remove('input-error');
                }
            });
        }
    }

    function attachPasswordValidators() {
        const passwordInput = signupDynamicContainer.querySelector('.signup-password');
        const confirmInput = signupDynamicContainer.querySelector('.signup-confirm-password');
        const strengthError = signupDynamicContainer.querySelector('.password-strength-error');
        const matchError = signupDynamicContainer.querySelector('.password-match-error');
        const submitButton = document.querySelector('#signup-form button[type="submit"]');

        if (!passwordInput || !confirmInput) return;

        function checkStrength(password) {
            let errors = [];
            if (password.length < 8) errors.push("At least 8 characters");
            if (!/[A-Z]/.test(password)) errors.push("1 uppercase letter");
            if (!/[a-z]/.test(password)) errors.push("1 lowercase letter");
            if (!/[0-9]/.test(password)) errors.push("1 number");
            if (!/[^A-Za-z0-9]/.test(password)) errors.push("and 1 special character");
            return errors;
        }

        function validate() {
            const pwd = passwordInput.value;
            const confirm = confirmInput.value;
            let isValid = true;

            // Strength Check
            const strengthErrors = checkStrength(pwd);
            if (pwd && strengthErrors.length > 0) {
                strengthError.textContent = "Password must include: " + strengthErrors.join(", ");
                strengthError.classList.add('visible');
                passwordInput.classList.add('input-error');
                passwordInput.classList.remove('input-success');
                isValid = false;
            } else {
                strengthError.classList.remove('visible');
                if (pwd) {
                    passwordInput.classList.remove('input-error');
                    passwordInput.classList.add('input-success');
                } else {
                    passwordInput.classList.remove('input-success'); // reset if empty
                }
            }

            // Match Check
            if (confirm && pwd !== confirm) {
                matchError.classList.add('visible');
                confirmInput.classList.add('input-error');
                confirmInput.classList.remove('input-success');
                isValid = false;
            } else {
                matchError.classList.remove('visible');
                if (confirm) {
                    confirmInput.classList.remove('input-error');
                    confirmInput.classList.add('input-success');
                } else {
                    confirmInput.classList.remove('input-success');
                }
            }

            // Also disable submit if invalid (optional, but good UX)
            // submitButton.disabled = !isValid;
            return isValid;
        }

        // Validate on Blur (when user leaves the field)
        // REMOVED per user request - only validate on submit
        // passwordInput.addEventListener('blur', validate);
        // confirmInput.addEventListener('blur', validate);

        // Clear error when user starts typing again (to remove the red text while they are fixing it)
        passwordInput.addEventListener('input', () => {
            if (passwordInput.classList.contains('input-error')) {
                const strengthError = signupDynamicContainer.querySelector('.password-strength-error');
                strengthError.classList.remove('visible');
                passwordInput.classList.remove('input-error');
            }
        });

        confirmInput.addEventListener('input', () => {
            if (confirmInput.classList.contains('input-error')) {
                const matchError = signupDynamicContainer.querySelector('.password-match-error');
                matchError.classList.remove('visible');
                confirmInput.classList.remove('input-error');
            }
        });

        // Validate on Submit
        const form = document.getElementById('signup-form');
        if (form) {
            // Remove any existing listener to prevent duplicates if function called multiple times
            // Note: In this simple structure, we are relying on 'signupForm' event listener at bottom.
            // But we need to intercept it.
            // Better approach: Let the global submit listener call a validation check.
            form.setAttribute('novalidate', true); // Disable browser default
        }
    }

    // Form Submit Mock
    // Form Submit Logic for Login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Check active role tab
            const activeTab = document.querySelector('.role-tab.active');
            const role = activeTab ? activeTab.dataset.role : 'attendee';

            // Simple role-based redirect for demo
            if (role === 'organizer') {
                window.location.href = 'organizer-dashboard.html';
            } else if (role === 'vendor') {
                window.location.href = 'vendor-dashboard.html';
            } else if (role === 'scega') {
                window.location.href = 'scega-dashboard.html';
            } else {
                // Default attendee
                alert("Login successful! Redirecting to home...");
                window.location.href = 'index.html';
            }
        });
    }


    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Trigger validation on all password fields before submitting
            const passwordInput = signupDynamicContainer.querySelector('.signup-password');
            const confirmInput = signupDynamicContainer.querySelector('.signup-confirm-password');
            const emailInput = signupDynamicContainer.querySelector('.signup-email');

            let isValid = true;

            // Email Validation
            if (emailInput) {
                const email = emailInput.value;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const emailError = signupDynamicContainer.querySelector('.email-error');

                if (!emailRegex.test(email)) {
                    if (emailError) emailError.classList.add('visible');
                    emailInput.classList.add('input-error');
                    isValid = false;
                }
            }

            // Password Validation
            if (passwordInput && confirmInput) {
                // We can manually trigger the blur event or call logic that creates the errors
                // But simply checking validity is better.
                function checkStrength(password) {
                    let errors = [];
                    if (password.length < 8) errors.push("At least 8 characters");
                    if (!/[A-Z]/.test(password)) errors.push("1 uppercase letter");
                    if (!/[a-z]/.test(password)) errors.push("1 lowercase letter");
                    if (!/[0-9]/.test(password)) errors.push("1 number");
                    if (!/[^A-Za-z0-9]/.test(password)) errors.push("and 1 special character");
                    return errors;
                }

                const pwd = passwordInput.value;
                const confirm = confirmInput.value;
                const strengthError = signupDynamicContainer.querySelector('.password-strength-error');
                const matchError = signupDynamicContainer.querySelector('.password-match-error');

                const strengthErrors = checkStrength(pwd);
                if (strengthErrors.length > 0) {
                    strengthError.textContent = "Password must include: " + strengthErrors.join(", ");
                    strengthError.classList.add('visible');
                    passwordInput.classList.add('input-error');
                    isValid = false;
                }

                if (pwd !== confirm) {
                    matchError.classList.add('visible');
                    confirmInput.classList.add('input-error');
                    isValid = false;
                }
            }

            if (isValid) {
                alert("Signup functionality would trigger here!");
            }
        });
    }


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
                'analytics': 'Event Analytics'
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

        // Helper to attach listeners to avoid code dup
        function attachActionListeners() {
            // Attach Delete Listeners
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent triggering other clicks
                    if (confirm('Are you sure you want to delete this event?')) {
                        deleteEvent(btn.dataset.id);
                    }
                });
            });

            // Attach Edit Listeners (New)
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openEditView(btn.dataset.id);
                });
            });
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
                    <div class="event-actions">
                        <button class="btn btn-sm btn-outline edit-btn" data-id="${evt.id}"><i class="fa-solid fa-pen"></i> Edit</button>
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

            // Action buttons - add Resubmit for rejected events
            let actionButtons = `
                <button class="btn btn-sm btn-outline edit-btn" data-id="${evt.id}"><i class="fa-solid fa-pen"></i> Edit</button>
                <button class="btn btn-sm btn-outline delete-btn" data-id="${evt.id}" style="color: #c62828; border-color: #c62828;"><i class="fa-solid fa-trash"></i></button>
            `;
            if (evt.status === 'Rejected') {
                actionButtons = `
                    <button class="btn btn-sm btn-success edit-btn" data-id="${evt.id}"><i class="fa-solid fa-rotate"></i> Resubmit</button>
                    <button class="btn btn-sm btn-outline delete-btn" data-id="${evt.id}" style="color: #c62828; border-color: #c62828;"><i class="fa-solid fa-trash"></i></button>
                `;
            }

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
                const policyLabels = { 'flexible': 'Flexible', 'moderate': 'Moderate (7 days)', 'strict': 'Strict (14 days)', 'non-refundable': 'Non-refundable' };
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
                'vendors': 'Vendor Marketplace',
                'requests': 'Manage Requests',
                'analytics': 'Event Analytics'
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
    }

    const langBtn = document.getElementById("lang-switch");

    if (langBtn) {
        langBtn.addEventListener("click", () => {
            const current = localStorage.getItem("eventia_lang") || "en";
            const newLang = current === "en" ? "ar" : "en";
            applyLang(newLang);
        });
    }

    // set initial language on load
    applyLang(localStorage.getItem("eventia_lang") || "en");

});


// --- SCEGA DASHBOARD LOGIC ---
// REMOVED: initScegaDashboard is now in scega-logic.js
// This comment prevents app.js from overwriting the updated function

