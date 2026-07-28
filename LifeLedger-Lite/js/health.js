/*
==========================================================
LifeLedger Lite
health.js
==========================================================
*/

const Health = (() => {

    "use strict";

    let page;
    let historyContainer;

    /*
    ==========================================
    Initialize
    ==========================================
    */

    function init(){

        page = document.getElementById("health-page");

        if(!page) return;

        renderLayout();

        bindEvents();

        loadHealth();

    }

    /*
    ==========================================
    Render UI
    ==========================================
    */

    function renderLayout(){

        page.innerHTML = `

        <div class="page-header">

            <h2>Health Tracker</h2>

            <h3>
                দৈনন্দিন স্বাস্থ্য-অভ্যাসগুলো
            </h3>

        </div>

        <div class="card">

            <div class="form-group">

                <label>Date</label>

                <input
                    type="date"
                    id="health-date"
                >

            </div>

            <div class="form-group">

                <label>Weight (kg)</label>

                <input
                    type="number"
                    id="health-weight"
                    placeholder="70"
                >

            </div>

            <div class="form-group">

                <label>Water Intake (L)</label>

                <input
                    type="number"
                    id="health-water"
                    placeholder="3"
                >

            </div>

            <div class="form-group">

                <label>Sleep (Hours)</label>

                <input
                    type="number"
                    id="health-sleep"
                    placeholder="6"
                >

            </div>

            <div class="form-group">

                <label>Mood</label>

                <select id="health-mood">

                    <option value="">Select Mood</option>

                    <option>😊 Excellent</option>

                    <option>🙂 Good</option>

                    <option>😐 Average</option>

                    <option>😔 Bad</option>

                </select>

            </div>

            <div class="form-group">

                <label>Exercise</label>

                <select id="health-exercise">

                    <option value="">Select Exercise</option>

                    <option>Walking</option>

                    <option>Running</option>

                    <option>Gym</option>

                    <option>Yoga</option>

                    <option>Cycling</option>

                    <option>Other</option>

                </select>

            </div>

            <div class="form-group">

                <label>Notes</label>

                <textarea
                    id="health-notes"
                    rows="3"
                    placeholder="Write something..."
                ></textarea>

            </div>

            <button
                class="btn btn-primary"
                id="save-health">

                Save Health Record

            </button>

        </div>

        <div class="card">

            <div class="section-header">

                <h3>Recent Records</h3>

            </div>

            <div id="health-history">

                ${GoogleSheets.showLoading()}

            </div>

        </div>

        `;

        historyContainer =
            document.getElementById("health-history");

        document.getElementById("health-date").value =
            new Date().toISOString().split("T")[0];

    }

    /*
    ==========================================
    Events
    ==========================================
    */

    function bindEvents(){

        document
            .getElementById("save-health")
            .addEventListener(
                "click",
                saveHealth
            );

    }

    /*
    ==========================================
    Load Records
    ==========================================
    */

    async function loadHealth(){

        historyContainer.innerHTML =
            GoogleSheets.showLoading();

        try{

            const records =
                await GoogleSheets.getData("health");

            renderHealthRecords(records);

        }

        catch(error){

            historyContainer.innerHTML =
                GoogleSheets.showError(
                    error.message
                );

        }

    }

    /*
==========================================
Validate Form
==========================================
*/

function validateForm(){

    const weight =
        Number(
            document.getElementById("health-weight").value
        );

    const water =
        Number(
            document.getElementById("health-water").value
        );

    const sleep =
        Number(
            document.getElementById("health-sleep").value
        );

    const mood =
        document.getElementById("health-mood").value;

    const exercise =
        document.getElementById("health-exercise").value;

    if(weight <= 0 || weight > 300){

        alert("Please enter a valid weight.");

        return false;

    }

    if(water < 0 || water > 20){

        alert("Please enter a valid water intake.");

        return false;

    }

    if(sleep < 0 || sleep > 24){

        alert("Please enter valid sleep hours.");

        return false;

    }

    if(!mood){

        alert("Please select your mood.");

        return false;

    }

    if(!exercise){

        alert("Please select an exercise.");

        return false;

    }

    return true;

    }
    
    /*
==========================================
Save Health Record
==========================================
*/

async function saveHealth(){

    if(!validateForm()){

        return;

    }

    const button =
        document.getElementById("save-health");

    button.disabled = true;

    button.textContent = "Saving...";

    const record = {

        Date:
            document.getElementById("health-date").value,

        Weight:
            document.getElementById("health-weight").value,

        Water:
            document.getElementById("health-water").value,

        Sleep:
            document.getElementById("health-sleep").value,

        Mood:
            document.getElementById("health-mood").value,

        Exercise:
            document.getElementById("health-exercise").value,

        Notes:
            document.getElementById("health-notes").value

    };

    try{

        await GoogleSheets.saveData(
            "health",
            record
        );

        clearForm();

        await loadHealth();

        alert("Health record saved successfully.");

    }

    catch(error){

        alert(error.message);

    }

    finally{

        button.disabled = false;

        button.textContent =
            "Save Health Record";

    }

    }
    /*
==========================================
Clear Form
==========================================
*/

function clearForm(){

    document.getElementById("health-date").value =
        new Date()
            .toISOString()
            .split("T")[0];

    document.getElementById("health-weight").value = "";

    document.getElementById("health-water").value = "";

    document.getElementById("health-sleep").value = "";

    document.getElementById("health-mood").selectedIndex = 0;

    document.getElementById("health-exercise").selectedIndex = 0;

    document.getElementById("health-notes").value = "";

    }
    
    /*
==========================================
Render Records
==========================================
*/

/*
==========================================
Render Health Records
==========================================
*/

function renderHealthRecords(records){

    if(!records || records.length===0){

        historyContainer.innerHTML =
            GoogleSheets.showEmpty(
                "No health records found."
            );

        return;

    }

    records.sort(
        (a,b)=>
            new Date(b.Date)-new Date(a.Date)
    );

    historyContainer.innerHTML =
        records.map(record=>`

        <div class="card health-card">

            <div class="health-header">

                <strong>

                    ${formatDate(record.Date)}

                </strong>

            </div>

            <div class="health-grid">

                <div>

                    ⚖️ <strong>${record.Weight}</strong> kg

                </div>

                <div>

                    💧 <strong>${record.Water}</strong> L

                </div>

                <div>

                    😴 <strong>${record.Sleep}</strong> hrs

                </div>

                <div>

                    ${record.Mood}

                </div>

            </div>

            <div class="health-exercise">

                🏃 ${record.Exercise}

            </div>

            ${
                record.Notes
                ?`
                <div class="health-notes">

                    📝 ${record.Notes}

                </div>
                `
                :""
            }

        </div>

    `).join("");

    }
    /*
==========================================
Format Date
==========================================
*/

function formatDate(date){

    if(!date){

        return "-";

    }

    return new Date(date)
        .toLocaleDateString(
            "en-IN",
            {

                day:"2-digit",

                month:"short",

                year:"numeric"

            }

        );

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

        if(event.detail.page==="health"){

            Health.init();

        }

    }
);
