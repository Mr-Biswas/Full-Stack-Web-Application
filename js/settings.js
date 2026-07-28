/*
==========================================================
LifeLedger Lite
settings.js
==========================================================
*/

const Settings = (() => {

    "use strict";

    let page;

    /*
    ==========================================
    Initialize
    ==========================================
    */

    function init(){

        page =
            document.getElementById(
                "settings-page"
            );

        if(!page) return;

        renderLayout();

        bindEvents();

        loadSettings();

    }

    /*
    ==========================================
    Render Layout
    ==========================================
    */

    function renderLayout(){

        page.innerHTML = `

        <div class="page-header">

            <h2>Settings</h2>

            <p>

                আমার প্রোফাইল ও অ্যাপের পছন্দসমূহ

            </p>

        </div>

        <div class="card">

            <div class="section-header">

                <h3>

                    👤 Profile

                </h3>

            </div>

            <div class="form-group">

                <label>Name</label>

                <input
                    type="text"
                    id="settings-name"
                    placeholder="Your Name"
                >

            </div>

            <div class="form-group">

                <label>Email</label>

                <input
                    type="email"
                    id="settings-email"
                    placeholder="you@example.com"
                >

            </div>

            <div class="form-group">

                <label>Phone</label>

                <input
                    type="tel"
                    id="settings-phone"
                    placeholder="9876543210"
                >

            </div>

        </div>

        <div class="card">

            <div class="section-header">

                <h3>

                    ⚙️ Preferences

                </h3>

            </div>

            <div class="form-group">

                <label>Currency</label>

                <select id="settings-currency">

                    <option value="INR">

                        ₹ INR

                    </option>

                    <option value="USD">

                        $ USD

                    </option>

                    <option value="EUR">

                        € EUR

                    </option>

                    <option value="GBP">

                        £ GBP

                    </option>

                </select>

            </div>

            <div class="form-group">

                <label>

                    Dark Mode

                </label>

                <label class="switch">

                    <input
                        type="checkbox"
                        id="settings-darkmode"
                    >

                    <span class="slider"></span>

                </label>

            </div>

            <button
                id="save-settings"
                class="btn btn-primary"
            >

                Save Settings

            </button>

        </div>

        `;

    }

    /*
    ==========================================
    Events
    ==========================================
    */

    function bindEvents(){

        document
            .getElementById(
                "save-settings"
            )
            .addEventListener(
                "click",
                saveSettings
            );

        document
            .getElementById(
                "settings-darkmode"
            )
            .addEventListener(
                "change",
                toggleTheme
            );

    }

    /*
    ==========================================
    Validate
    ==========================================
    */

    function validateForm(){

        const name =
            document
            .getElementById(
                "settings-name"
            )
            .value
            .trim();

        const email =
            document
            .getElementById(
                "settings-email"
            )
            .value
            .trim();

        if(name===""){

            alert(
                "Please enter your name."
            );

            return false;

        }

        if(email===""){

            alert(
                "Please enter your email."
            );

            return false;

        }

        return true;

    }

    /*
    ==========================================
    Save Settings
    ==========================================
    */

    async function saveSettings(){

        if(!validateForm()){

            return;

        }

        const button =
            document.getElementById(
                "save-settings"
            );

        button.disabled = true;

        button.textContent =
            "Saving...";

        const settings = {

            Name:
                document.getElementById(
                    "settings-name"
                ).value,

            Email:
                document.getElementById(
                    "settings-email"
                ).value,

            Phone:
                document.getElementById(
                    "settings-phone"
                ).value,

            Currency:
                document.getElementById(
                    "settings-currency"
                ).value,

            DarkMode:
                document.getElementById(
                    "settings-darkmode"
                ).checked
                ? "Yes"
                : "No"

        };

        try{

            await GoogleSheets.saveData(

                "settings",

                settings

            );

            localStorage.setItem(

                "lifelogger-theme",

                settings.DarkMode

            );

            alert(

                "Settings saved successfully."

            );

        }

        catch(error){

            alert(

                error.message

            );

        }

        finally{

            button.disabled = false;

            button.textContent =
                "Save Settings";

        }

    }

        /*
    ==========================================
    Load Settings
    ==========================================
    */

    async function loadSettings(){

        try{

            const records =
                await GoogleSheets.getData(
                    "settings"
                );

            if(!records || records.length===0){

                applySavedTheme();

                return;

            }

            const settings =
                records[records.length-1];

            document.getElementById(
                "settings-name"
            ).value =
                settings.Name || "";

            document.getElementById(
                "settings-email"
            ).value =
                settings.Email || "";

            document.getElementById(
                "settings-phone"
            ).value =
                settings.Phone || "";

            document.getElementById(
                "settings-currency"
            ).value =
                settings.Currency || "INR";

            const darkMode =
                settings.DarkMode==="Yes";

            document.getElementById(
                "settings-darkmode"
            ).checked =
                darkMode;

            localStorage.setItem(

                "lifelogger-theme",

                darkMode
                ? "Yes"
                : "No"

            );

            applySavedTheme();

        }

        catch(error){

            console.error(error);

            applySavedTheme();

        }

    }

    /*
    ==========================================
    Toggle Theme
    ==========================================
    */

    function toggleTheme(){

        const enabled =
            document.getElementById(
                "settings-darkmode"
            ).checked;

        if(enabled){

            document.body.classList.add(
                "dark-mode"
            );

        }

        else{

            document.body.classList.remove(
                "dark-mode"
            );

        }

    }

    /*
    ==========================================
    Apply Saved Theme
    ==========================================
    */

    function applySavedTheme(){

        const theme =
            localStorage.getItem(
                "lifelogger-theme"
            );

        if(theme==="Yes"){

            document.body.classList.add(
                "dark-mode"
            );

            const toggle =
                document.getElementById(
                    "settings-darkmode"
                );

            if(toggle){

                toggle.checked = true;

            }

        }

        else{

            document.body.classList.remove(
                "dark-mode"
            );

        }

    }

    /*
    ==========================================
    Public
    ==========================================
    */

    return{

        init

    };

})();

/*
==========================================
Initialize when page opens
==========================================
*/

document.addEventListener(

    "pageChanged",

    (event)=>{

        if(event.detail.page==="settings"){

            Settings.init();

        }

    }

);
