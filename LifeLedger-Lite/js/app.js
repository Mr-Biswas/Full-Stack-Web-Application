/*
==========================================================
LifeLedger Lite
app.js
Application Controller
==========================================================
*/

"use strict";

const App = (() => {

    // Prevent modules from initializing twice
    const initializedModules = {};

    /*
    ==========================================
    Module Initializer
    ==========================================
    */

    function initializeModule(page) {

        if (initializedModules[page]) {
            return;
        }

        switch (page) {

            case "expense":

                if (
                    typeof Expense !== "undefined" &&
                    Expense.init
                ) {

                    Expense.init();

                    initializedModules.expense = true;

                }

                break;

            case "travel":

                if (
                    typeof Travel !== "undefined" &&
                    Travel.init
                ) {

                    Travel.init();

                    initializedModules.travel = true;

                }

                break;

            case "health":

                if (
                    typeof Health !== "undefined" &&
                    Health.init
                ) {

                    Health.init();

                    initializedModules.health = true;

                }

                break;

            case "notes":

                if (
                    typeof Notes !== "undefined" &&
                    Notes.init
                ) {

                    Notes.init();

                    initializedModules.notes = true;

                }

                break;

            case "dashboard":

                if (
                    typeof Dashboard !== "undefined" &&
                    Dashboard.init
                ) {

                    Dashboard.init();

                    initializedModules.dashboard = true;

                }

                break;

            case "settings":

                if (
                    typeof Settings !== "undefined" &&
                    Settings.init
                ) {

                    Settings.init();

                    initializedModules.settings = true;

                }

                break;

        }

    }

    /*
    ==========================================
    Page Changed Event
    ==========================================
    */

    document.addEventListener(

        "pageChanged",

        function (event) {

            initializeModule(
                event.detail.page
            );

        }

    );

    /*
    ==========================================
    App Start
    ==========================================
    */

    function init() {

        initializeModule("dashboard");

    }

    return {

        init

    };

})();

document.addEventListener(

    "DOMContentLoaded",

    function () {

        App.init();

    }

);