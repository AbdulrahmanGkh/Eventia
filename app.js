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



    // --- ORGANIZER DASHBOARD LOGIC ---
    // Moved to organizer-logic.js for better file organisation.
    // organizer-logic.js is loaded separately in organizer-dashboard.html.


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

