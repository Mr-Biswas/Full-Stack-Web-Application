/*
==========================================================
LifeLedger Lite
googleSheets.js
==========================================================
*/

"use strict";

const WEB_APP_URL =
"https://script.google.com/macros/s/AKfycby4iWdHAxhe0_dDoMv92rpdanQmoCBS6iETbF_750TrIb8OgnHf9OxJGEEinZcTAy6a/exec";


/* ==========================================
GET DATA
========================================== */

async function getData(module){

    try{

        const response = await fetch(
            `${WEB_APP_URL}?module=${encodeURIComponent(module)}`
        );

        if(!response.ok){
            throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();

        if(!result.success){
            throw new Error(
                result.message || "Unable to fetch data."
            );
        }

        return result.data;

    }

    catch(error){

        console.error(error);

        throw error;

    }

}


/* ==========================================
SAVE DATA
========================================== */

async function saveData(module,data){

    try{

        const form = new URLSearchParams();

        form.append("module",module);

        Object.keys(data).forEach(key=>{

            form.append(key,data[key]);

        });

        const response = await fetch(
            WEB_APP_URL,
            {
                method:"POST",
                body:form
            }
        );

        if(!response.ok){

            throw new Error(
                `HTTP ${response.status}`
            );

        }

        const result = await response.json();

        if(!result.success){

            throw new Error(
                result.message || "Unable to save."
            );

        }

        return result;

    }

    catch(error){

        console.error(error);

        throw error;

    }

}


/* ==========================================
UI HELPERS
========================================== */

function showLoading(){

    return `
        <div class="loader"></div>
    `;

}

function showEmpty(message="No records found."){

    return `
        <div class="empty-state">

            <h3>No Data</h3>

            <p>${message}</p>

        </div>
    `;

}

function showError(message="Something went wrong."){

    return `
        <div class="card">

            <h3>Error</h3>

            <p>${message}</p>

        </div>
    `;

}


/* ==========================================
GLOBAL
========================================== */

window.GoogleSheets = {

    getData,
    saveData,
    showLoading,
    showEmpty,
    showError

};