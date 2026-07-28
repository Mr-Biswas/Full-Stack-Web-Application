/*
==========================================================
LifeLedger Lite
travel.js
==========================================================
*/

const Travel = (() => {

    const page =
        document.getElementById("travel-page");

    let travelList;

    /*
    ==========================================
    Initialize
    ==========================================
    */

    async function init() {

        renderLayout();

        travelList =
            document.getElementById("travel-list");

        setToday();

        bindEvents();

        await loadTrips();

    }

    /*
    ==========================================
    Render UI
    ==========================================
    */

    function renderLayout() {

        page.innerHTML = `

        <div class="page-header">

            <h2>Travel Planner</h2>

            <h3>
                ভ্রমণের পরিকল্পনা ও ব্যবস্থাপনা
            </h3>

        </div>

        <div class="card">

            <div class="form-group">

                <label>Destination</label>

                <input
                    id="trip-destination"
                    type="text"
                    placeholder="Darjeeling"
                >

            </div>

            <div class="form-group">

                <label>Start Date</label>

                <input
                    id="trip-start"
                    type="date"
                >

            </div>

            <div class="form-group">

                <label>End Date</label>

                <input
                    id="trip-end"
                    type="date"
                >

            </div>

            <div class="form-group">

                <label>Expected Budget (₹)</label>

                <input
                    id="trip-budget"
                    type="number"
                    placeholder="5000"
                >

            </div>

            <div class="form-group">

                <label>Transport</label>

                <select id="trip-transport">

                    <option value="">
                        Select Transport
                    </option>

                    <option>Train</option>
                    <option>Flight</option>
                    <option>Bus</option>
                    <option>Car</option>
                    <option>Bike</option>
                    <option>Other</option>

                </select>

            </div>

            <div class="form-group">

                <label>Notes</label>

                <textarea
                    id="trip-note"
                    rows="3"
                    placeholder="Hotel, itinerary, packing..."
                ></textarea>

            </div>

            <button
                id="save-trip"
                class="btn btn-primary"
            >
                Save Trip
            </button>

        </div>

        <h3 class="section-title">

            Planned Trips

        </h3>

        <div id="travel-list"></div>

        `;

    }

    /*
    ==========================================
    Load Trips
    ==========================================
    */

    async function loadTrips() {

        travelList.innerHTML =
            GoogleSheets.showLoading();

        try {

            const response =
                await GoogleSheets.getData(
                    "travel"
                );

            if (
                !response.length
            ) {

                travelList.innerHTML =
                    GoogleSheets.showEmpty(
                        "No trips planned."
                    );

                return;

            }

            renderTrips(response);

        }

        catch (error) {

            travelList.innerHTML =
                GoogleSheets.showError(
                    error.message
                );

        }

    }

    /*
    ==========================================
    Render Trips
    ==========================================
    */

    function renderTrips(data) {

        travelList.innerHTML = "";

        data.reverse().forEach(item => {

            travelList.appendChild(

                createTripCard(item)

            );

        });

    }

    /*
    ==========================================
    Trip Card
    ==========================================
    */

    function createTripCard(item) {

        const card =
            document.createElement("div");

        card.className =
            "card";

        card.innerHTML = `

            <h3>

                ${item.Destination}

            </h3>

            <p>

                📅
                ${formatDate(item["Start Date"])}
                →
                ${formatDate(item["End Date"])}

            </p>

            <p>

                💰 ₹${item.Budget}

            </p>

            <p>

                🚆 ${item.Transport}

            </p>

            ${
                item.Note
                ?
                `<p>${item.Note}</p>`
                :
                ""
            }

        `;

        return card;

    }

    /*
    ==========================================
    Form Validation
    ==========================================
    */

    function validateForm() {

        const destination =
            document
                .getElementById("trip-destination")
                .value
                .trim();

        const start =
            document
                .getElementById("trip-start")
                .value;

        const end =
            document
                .getElementById("trip-end")
                .value;

        const budget =
            document
                .getElementById("trip-budget")
                .value
                .trim();

        const transport =
            document
                .getElementById("trip-transport")
                .value;

        if (!destination) {

            alert("Please enter destination.");

            return false;

        }

        if (!start) {

            alert("Please select start date.");

            return false;

        }

        if (!end) {

            alert("Please select end date.");

            return false;

        }

        if (new Date(end) < new Date(start)) {

            alert("End date cannot be before start date.");

            return false;

        }

        if (!budget || Number(budget) <= 0) {

            alert("Please enter a valid budget.");

            return false;

        }

        if (!transport) {

            alert("Please select transport.");

            return false;

        }

        return true;

    }

    /*
    ==========================================
    Save Trip
    ==========================================
    */

    async function saveTrip() {

        if (!validateForm()) {

            return;

        }

        const button =
            document.getElementById("save-trip");

        button.disabled = true;

        button.textContent = "Saving...";

        const trip = {

            Destination:
                document
                    .getElementById("trip-destination")
                    .value
                    .trim(),

            "Start Date":
                document
                    .getElementById("trip-start")
                    .value,

            "End Date":
                document
                    .getElementById("trip-end")
                    .value,

            Budget:
                document
                    .getElementById("trip-budget")
                    .value
                    .trim(),

            Transport:
                document
                    .getElementById("trip-transport")
                    .value,

            Note:
                document
                    .getElementById("trip-note")
                    .value
                    .trim()

        };

        try {

            await GoogleSheets.saveData(
                "travel",
                trip
            );

            clearForm();

            await loadTrips();

            alert("Trip saved successfully.");

        }

        catch (error) {

            alert(error.message);

        }

        finally {

            button.disabled = false;

            button.textContent = "Save Trip";

        }

    }

    /*
    ==========================================
    Clear Form
    ==========================================
    */

    function clearForm() {

        document.getElementById(
            "trip-destination"
        ).value = "";

        document.getElementById(
            "trip-budget"
        ).value = "";

        document.getElementById(
            "trip-note"
        ).value = "";

        document.getElementById(
            "trip-transport"
        ).selectedIndex = 0;

        setToday();

        document.getElementById(
            "trip-end"
        ).value =
        document.getElementById(
            "trip-start"
        ).value;

    }

    /*
    ==========================================
    Set Today's Date
    ==========================================
    */

    function setToday() {

        const today =
            new Date()
                .toISOString()
                .split("T")[0];

        document.getElementById(
            "trip-start"
        ).value = today;

        document.getElementById(
            "trip-end"
        ).value = today;

    }
        /*
    ==========================================
    Format Date
    ==========================================
    */

    function formatDate(date) {

        if (!date) {

            return "-";

        }

        const formattedDate =
            new Date(date);

        if (
            isNaN(formattedDate.getTime())
        ) {

            return "-";

        }

        return formattedDate.toLocaleDateString(

            "en-IN",

            {

                day: "2-digit",

                month: "short",

                year: "numeric"

            }

        );

    }



    /*
    ==========================================
    Events
    ==========================================
    */

    function bindEvents() {

        document
            .getElementById("save-trip")
            .addEventListener(
                "click",
                saveTrip
            );

    }

    /*
    ==========================================
    Public API
    ==========================================
    */

    return {

        init

    };

})();
