/*
==========================================================
LifeLedger Lite
notes.js
==========================================================
*/

const Notes = (() => {

    "use strict";

    let page;
    let notesContainer;

    /*
    ==========================================
    Initialize
    ==========================================
    */

    function init(){

        page =
            document.getElementById(
                "notes-page"
            );

        if(!page) return;

        renderLayout();

        bindEvents();

        loadNotes();

    }

    /*
    ==========================================
    Render Layout
    ==========================================
    */

    function renderLayout(){

        page.innerHTML = `

        <div class="page-header">

            <h2>Notes</h2>

            <h3>
                আমার ধারণা, রিমাইন্ডার এবং গুরুত্বপূর্ণ তথ্য 
            </h3>

        </div>

        <div class="card">

            <div class="form-group">

                <label>Date</label>

                <input
                    type="date"
                    id="note-date"
                >

            </div>

            <div class="form-group">

                <label>Title</label>

                <input
                    type="text"
                    id="note-title"
                    maxlength="100"
                    placeholder="Meeting Notes"
                >

            </div>

            <div class="form-group">

                <label>Category</label>

                <select id="note-category">

                    <option value="">
                        Select Category
                    </option>

                    <option>
                        Personal
                    </option>

                    <option>
                        Work
                    </option>

                    <option>
                        Finance
                    </option>

                    <option>
                        Health
                    </option>

                    <option>
                        Travel
                    </option>

                    <option>
                        Shopping
                    </option>

                    <option>
                        Other
                    </option>

                </select>

            </div>

            <div class="form-group">

                <label>Notes</label>

                <textarea
                    id="note-content"
                    rows="5"
                    placeholder="Write your note here..."
                ></textarea>

            </div>

            <button
                id="save-note"
                class="btn btn-primary"
            >

                Save Note

            </button>

        </div>

        <div class="card">

            <div class="section-header">

                <h3>

                    Recent Notes

                </h3>

            </div>

            <div id="notes-history">

                ${GoogleSheets.showLoading()}

            </div>

        </div>

        `;

        notesContainer =
            document.getElementById(
                "notes-history"
            );

        document
            .getElementById("note-date")
            .value =
            new Date()
            .toISOString()
            .split("T")[0];

    }

    /*
    ==========================================
    Events
    ==========================================
    */

    function bindEvents(){

        document
            .getElementById(
                "save-note"
            )
            .addEventListener(
                "click",
                saveNote
            );

    }

    /*
    ==========================================
    Validate Form
    ==========================================
    */

    function validateForm(){

        const title =
            document
            .getElementById(
                "note-title"
            )
            .value
            .trim();

        const category =
            document
            .getElementById(
                "note-category"
            )
            .value;

        const content =
            document
            .getElementById(
                "note-content"
            )
            .value
            .trim();

        if(title===""){

            alert(
                "Please enter note title."
            );

            return false;

        }

        if(category===""){

            alert(
                "Please select a category."
            );

            return false;

        }

        if(content===""){

            alert(
                "Please write your note."
            );

            return false;

        }

        return true;

    }

    /*
    ==========================================
    Save Note
    ==========================================
    */

    async function saveNote(){

        if(!validateForm()){

            return;

        }

        const button =
            document.getElementById(
                "save-note"
            );

        button.disabled = true;

        button.textContent =
            "Saving...";

        const note = {

            Date:
                document
                .getElementById(
                    "note-date"
                )
                .value,

            Title:
                document
                .getElementById(
                    "note-title"
                )
                .value,

            Category:
                document
                .getElementById(
                    "note-category"
                )
                .value,

            Notes:
                document
                .getElementById(
                    "note-content"
                )
                .value

        };

        try{

            await GoogleSheets.saveData(

                "notes",

                note

            );

            clearForm();

            await loadNotes();

            alert(
                "Note saved successfully."
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
                "Save Note";

        }

    }

        /*
    ==========================================
    Load Notes
    ==========================================
    */

    async function loadNotes(){

        notesContainer.innerHTML =
            GoogleSheets.showLoading();

        try{

            const records =
                await GoogleSheets.getData(
                    "notes"
                );

            renderNotes(records);

        }

        catch(error){

            notesContainer.innerHTML =
                GoogleSheets.showError(
                    error.message
                );

        }

    }

    /*
    ==========================================
    Clear Form
    ==========================================
    */

    function clearForm(){

        document.getElementById(
            "note-date"
        ).value =
            new Date()
            .toISOString()
            .split("T")[0];

        document.getElementById(
            "note-title"
        ).value = "";

        document.getElementById(
            "note-category"
        ).selectedIndex = 0;

        document.getElementById(
            "note-content"
        ).value = "";

    }

    /*
    ==========================================
    Render Notes
    ==========================================
    */

    function renderNotes(records){

        if(!records || records.length===0){

            notesContainer.innerHTML =
                GoogleSheets.showEmpty(
                    "No notes found."
                );

            return;

        }

        records.sort(
            (a,b)=>
                new Date(b.Date)-
                new Date(a.Date)
        );

        notesContainer.innerHTML =
            records.map(record=>`

            <div class="card note-card">

                <div class="note-header">

                    <div>

                        <h3>

                            ${record.Title}

                        </h3>

                        <span class="note-category">

                            ${record.Category}

                        </span>

                    </div>

                    <div class="note-date">

                        ${formatDate(record.Date)}

                    </div>

                </div>

                <div class="note-content">

                    ${record.Notes}

                </div>

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
Initialize when page changes
==========================================
*/

document.addEventListener(

    "pageChanged",

    (event)=>{

        if(event.detail.page==="notes"){

            Notes.init();

        }

    }

);