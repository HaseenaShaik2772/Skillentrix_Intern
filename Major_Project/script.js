/* =====================================================
   SKILLENTRIX PORTFOLIO
   Main JavaScript
===================================================== */


/* =========================
   THEME MANAGER
========================= */
const API_URL = "https://script.google.com/macros/s/AKfycbzpfOc9RzrjS426xziaKUEP8cjKq1-UmIQa9YUmQXjtRRwgc0rN8-iE9_6_IfwDYsWh/exec";
 

document.getElementById("adminForm").addEventListener("submit", async function (event) {

    event.preventDefault();

    const username = document.getElementById("adminUsername").value.trim();
    const password = document.getElementById("adminPassword").value.trim();

    const loginMessage = document.getElementById("loginMessage");

    // Test Admin Login
    if (username === "admin" && password === "admin123") {

        loginMessage.textContent = "Login successful!";
        loginMessage.className = "login-message success";

        document.getElementById("adminLogin").classList.add("hidden");
        document.getElementById("responsesPanel").classList.remove("hidden");

        return;
    }

    loginMessage.textContent = "Invalid username or password";
    loginMessage.className = "login-message error";
});
const ThemeManager = {

    init() {

        const savedTheme =
            localStorage.getItem("portfolioTheme");

        if (savedTheme === "dark") {
            document.body.classList.add("dark");
        }

        this.updateIcon();

        const button =
            document.getElementById("themeToggle");

        if (button) {
            button.addEventListener(
                "click",
                () => this.toggle()
            );
        }
    },


    toggle() {

        document.body.classList.toggle("dark");

        const isDark =
            document.body.classList.contains("dark");

        localStorage.setItem(
            "portfolioTheme",
            isDark ? "dark" : "light"
        );

        this.updateIcon();
    },


    updateIcon() {

        const button =
            document.getElementById("themeToggle");

        if (!button) return;

        const isDark =
            document.body.classList.contains("dark");

        button.textContent =
            isDark ? "☀️" : "🌙";
    }

};


/* =========================
   NAVIGATION
========================= */

const Navigation = {

    init() {

        const menuToggle =
            document.getElementById("menuToggle");

        const navMenu =
            document.getElementById("navMenu");

        const navLinks =
            document.querySelectorAll(".nav-link");

        if (!menuToggle || !navMenu) return;


        menuToggle.addEventListener(
            "click",
            () => {

                navMenu.classList.toggle("show");

                menuToggle.textContent =
                    navMenu.classList.contains("show")
                        ? "✕"
                        : "☰";
            }
        );


        navLinks.forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    navMenu.classList.remove("show");

                    menuToggle.textContent = "☰";
                }
            );

        });


        this.setupScrollSpy();
    },


    setupScrollSpy() {

        const sections =
            document.querySelectorAll("section[id]");

        const navLinks =
            document.querySelectorAll(".nav-link");


        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) return;

                        const id =
                            entry.target.getAttribute("id");

                        navLinks.forEach(link => {

                            link.classList.remove("active");

                            if (
                                link.getAttribute("href") ===
                                `#${id}`
                            ) {
                                link.classList.add("active");
                            }

                        });

                    });

                },
                {
                    rootMargin:
                        "-35% 0px -55% 0px"
                }
            );


        sections.forEach(section => {
            observer.observe(section);
        });

    }

};


/* =========================
   CONTACT STORAGE
========================= */

const ContactStorage = {

    KEY: "contactResponses",


    getResponses() {

        try {

            const stored =
                localStorage.getItem(this.KEY);

            if (!stored) {
                return [];
            }

            const parsed =
                JSON.parse(stored);

            if (!Array.isArray(parsed)) {
                return [];
            }

            return parsed;

        } catch (error) {

            console.error(
                "Unable to read contact responses:",
                error
            );

            return [];
        }
    },


    saveResponse(response) {

        const responses =
            this.getResponses();


        responses.push(response);


        localStorage.setItem(
            this.KEY,
            JSON.stringify(responses)
        );

    },


    getNextId() {

        const responses =
            this.getResponses();

        if (responses.length === 0) {
            return 1;
        }

        const ids =
            responses
                .map(item => Number(item.id))
                .filter(id => !Number.isNaN(id));


        return ids.length
            ? Math.max(...ids) + 1
            : 1;
    }

};


/* =========================
   CONTACT FORM
========================= */

const ContactForm = {

    init() {

        const form =
            document.getElementById("contactForm");

        if (!form) return;

        form.addEventListener(
            "submit",
            event => this.handleSubmit(event)
        );

    },


    handleSubmit(event) {

        event.preventDefault();


        const form =
            event.target;


        const name =
            document
                .getElementById("name")
                .value
                .trim();


        const email =
            document
                .getElementById("email")
                .value
                .trim();


        const message =
            document
                .getElementById("message")
                .value
                .trim();


        const formMessage =
            document.getElementById("formMessage");


        if (!name || !email || !message) {

            this.showMessage(
                formMessage,
                "Please fill in all fields.",
                "error"
            );

            return;
        }


        if (!this.validEmail(email)) {

            this.showMessage(
                formMessage,
                "Please enter a valid email address.",
                "error"
            );

            return;
        }


        const response = {

            id:
                ContactStorage.getNextId(),

            name:
                name,

            email:
                email,

            message:
                message,

            timestamp:
                new Date().toISOString()
        };


        try {

            ContactStorage.saveResponse(response);


            form.reset();


            this.showMessage(
                formMessage,
                "Thank you! Your message has been saved successfully.",
                "success"
            );


        } catch (error) {

            console.error(error);


            this.showMessage(
                formMessage,
                "Unable to save your message. Please try again.",
                "error"
            );

        }

    },


    validEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(email);

    },


    showMessage(element, text, type) {

        if (!element) return;

        element.textContent = text;

        element.className =
            `form-message ${type}`;


        setTimeout(() => {

            element.textContent = "";

            element.className =
                "form-message";

        }, 5000);

    }

};


/* =========================
   ADMIN
========================= */

const Admin = {

    /*
        Demo credentials for internship testing.

        Username:
        admin

        Password:
        skillentrix123
    */

    USERNAME: "admin",

    PASSWORD: "admin123",


    init() {

        const form =
            document.getElementById("adminForm");

        const logoutButton =
            document.getElementById("logoutBtn");


        if (form) {

            form.addEventListener(
                "submit",
                event => this.login(event)
            );

        }


        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                () => this.logout()
            );

        }


        this.checkSession();

    },


    login(event) {

        event.preventDefault();


        const username =
            document
                .getElementById("adminUsername")
                .value
                .trim();


        const password =
            document
                .getElementById("adminPassword")
                .value;


        const message =
            document.getElementById("loginMessage");


        if (
            username === this.USERNAME &&
            password === this.PASSWORD
        ) {

            sessionStorage.setItem(
                "adminLoggedIn",
                "true"
            );


            this.showDashboard();


        } else {

            if (message) {

                message.textContent =
                    "Invalid username or password.";

            }

        }

    },


    checkSession() {

        const loggedIn =
            sessionStorage.getItem(
                "adminLoggedIn"
            );


        if (loggedIn === "true") {

            this.showDashboard();

        }

    },


    showDashboard() {

        const login =
            document.getElementById("adminLogin");

        const panel =
            document.getElementById("responsesPanel");


        if (login) {
            login.classList.add("hidden");
        }


        if (panel) {
            panel.classList.remove("hidden");
        }


        this.renderResponses();

    },


    logout() {

        sessionStorage.removeItem(
            "adminLoggedIn"
        );


        const login =
            document.getElementById("adminLogin");

        const panel =
            document.getElementById("responsesPanel");


        if (panel) {
            panel.classList.add("hidden");
        }


        if (login) {
            login.classList.remove("hidden");
        }


        const username =
            document.getElementById("adminUsername");

        const password =
            document.getElementById("adminPassword");

        const message =
            document.getElementById("loginMessage");


        if (username) username.value = "";

        if (password) password.value = "";

        if (message) message.textContent = "";

    },


    renderResponses() {

        const container =
            document.getElementById("responsesList");

        if (!container) return;


        const responses =
            ContactStorage.getResponses();


        if (responses.length === 0) {

            container.innerHTML = `
                <div class="empty-response">
                    <h3>No responses yet</h3>
                    <p>
                        Contact form submissions will appear here.
                    </p>
                </div>
            `;

            return;
        }


        container.innerHTML = "";


        responses
            .slice()
            .reverse()
            .forEach(response => {

                const card =
                    document.createElement("article");

                card.className =
                    "response-card";


                const formattedTime =
                    this.formatDate(
                        response.timestamp
                    );


                card.innerHTML = `

                    <h3>
                        ${this.escapeHTML(response.name)}
                    </h3>

                    <a
                        class="response-email"
                        href="mailto:${this.escapeHTML(response.email)}"
                    >
                        ${this.escapeHTML(response.email)}
                    </a>

                    <p class="response-message">
                        ${this.escapeHTML(response.message)}
                    </p>

                    <p class="response-time">
                        Received: ${formattedTime}
                    </p>

                `;


                container.appendChild(card);

            });

    },


    formatDate(timestamp) {

        try {

            return new Date(timestamp)
                .toLocaleString();

        } catch {

            return timestamp;

        }

    },


    escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent =
            String(value);

        return div.innerHTML;

    }

};


/* =========================
   FOOTER YEAR
========================= */

function setCurrentYear() {

    const year =
        document.getElementById("currentYear");

    if (year) {

        year.textContent =
            new Date().getFullYear();

    }

}


/* =========================
   INITIALIZE
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        ThemeManager.init();

        Navigation.init();

        ContactForm.init();

        Admin.init();

        setCurrentYear();

    }
);

 function showAdminSection(event) {

    event.preventDefault();

    const adminSection = document.querySelector(".admin-section");

    if (!adminSection) return;

    adminSection.classList.toggle("hidden");

    if (!adminSection.classList.contains("hidden")) {
        adminSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

const contactForm = document.getElementById("contactForm");
const contactPopup = document.getElementById("contactPopup");

if (contactForm) {

    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();

        contactPopup.classList.add("show");

        contactForm.reset();

        setTimeout(function () {
            contactPopup.classList.remove("show");
        }, 3000);

    });

}

 