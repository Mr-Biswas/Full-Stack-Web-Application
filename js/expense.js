/*
==========================================================
LifeLedger Lite
expense.js
Part 1 / 2
==========================================================
*/

"use strict";

const Expense = (() => {

    const page = document.getElementById("expense-page");

    let expenseList;

    /* ==========================================
       Initialize
    ========================================== */

    async function init() {

        renderLayout();

        expenseList = document.getElementById("expense-list");

        await loadExpenses();

        bindEvents();

    }

    /* ==========================================
       Layout
    ========================================== */

    function renderLayout() {

        page.innerHTML = `

        <div class="section-header">

            <div>

                <h2 class="section-title">
                    Expense Tracker
                </h2>

                <h3 class="section-subtitle">
                    দৈনন্দিন খরচ
                </h3>

            </div>

        </div>

        <div class="card">

            <div class="form-group">

                <label>
                    Amount
                </label>

                <input
                    type="number"
                    id="expense-amount"
                    placeholder="Enter amount">

            </div>

            <div class="form-group">

                <label>
                    Category
                </label>

                <select id="expense-category">

                    <option value="">
                        Select Category
                    </option>

                    <option>Food</option>

                    <option>Travel</option>

                    <option>Shopping</option>

                    <option>Medical</option>

                    <option>Bills</option>

                    <option>Entertainment</option>

                    <option>Education</option>

                    <option>Others</option>

                </select>

            </div>

            <div class="form-group">

                <label>
                    Date
                </label>

                <input
                    type="date"
                    id="expense-date">

            </div>

            <div class="form-group">

                <label>
                   Note
                </label>

                <textarea
                    id="expense-note"
                    placeholder="Optional note"></textarea>

            </div>

            <button
                class="btn btn-primary"
                id="save-expense">

                Save Expense

            </button>

        </div>

        <div class="mt-3">

            <h2>

                Recent Expenses

            </h2>

        </div>

        <div
            id="expense-list"
            class="list">

        </div>

        `;

    }

    /* ==========================================
       Load Expenses
    ========================================== */

    async function loadExpenses() {

        GoogleSheets.showLoading(expenseList);

        try {

            const data =
                await GoogleSheets.getData("expense");

            if (!data.length) {

                GoogleSheets.showEmpty(
                    expenseList,
                    "No expenses added yet."
                );

                return;

            }

            renderExpenses(data);

        }

        catch (error) {

            GoogleSheets.showError(
                expenseList,
                error.message
            );

        }

    }

    /* ==========================================
       Render Expense Cards
    ========================================== */
/* ==========================================
   Render Expense Cards
========================================== */

function renderExpenses(data) {

    expenseList.innerHTML = "";

    data
        .slice()
        .sort((a, b) => {

            return new Date(b.Date) - new Date(a.Date);

        })
        .slice(0, 10)
        .forEach(item => {

            expenseList.appendChild(
                createExpenseCard(item)
            );

        });

}

    /* ==========================================
       Expense Card
    ========================================== */

    function createExpenseCard(item) {

        const card =
            document.createElement("div");

        card.className =
            "card fade-in";

        card.innerHTML = `

        <div class="card-row">

            <div class="card-left">

                <div class="card-title">

                    ₹ ${item.Amount}

                </div>

                <div class="card-subtitle">

                    ${item.Category}

                </div>

                <div class="card-subtitle">

                    ${formatDate(item.Date)}

                </div>

                ${
                    item.Note
                    ?
                    `<div class="mt-1">
                        ${item.Note}
                    </div>`
                    :
                    ""
                }

            </div>

        </div>

        `;

        return card;

    }

    /* ==========================================
       Form Validation
    ========================================== */

    function validateForm() {

        const amount =
            document
                .getElementById("expense-amount")
                .value
                .trim();

        const category =
            document
                .getElementById("expense-category")
                .value;

        const date =
            document
                .getElementById("expense-date")
                .value;

        if (!amount) {

            alert("Please enter amount.");

            return false;

        }

        if (Number(amount) <= 0) {

            alert("Amount should be greater than 0.");

            return false;

        }

        if (!category) {

            alert("Please select category.");

            return false;

        }

        if (!date) {

            alert("Please select date.");

            return false;

        }

        return true;

    }

    /* ==========================================
       Save Expense
    ========================================== */

    async function saveExpense() {

        if (!validateForm()) {

            return;

        }

        const saveButton =
            document.getElementById("save-expense");

        saveButton.disabled = true;

        saveButton.textContent = "Saving...";

        const expense = {

            Amount:
                document
                    .getElementById("expense-amount")
                    .value
                    .trim(),

            Category:
                document
                    .getElementById("expense-category")
                    .value,

            Date:
                document
                    .getElementById("expense-date")
                    .value,

            Note:
                document
                    .getElementById("expense-note")
                    .value
                    .trim()

        };

        try {

            await GoogleSheets.saveData(
                "expense",
                expense
            );

            clearForm();

            await loadExpenses();

            alert("Saved Successfully");

        }

        catch (error) {

            alert(error.message);

        }

        finally {

            saveButton.disabled = false;

            saveButton.textContent =
                "Save Expense";

        }

    }

    /* ==========================================
       Clear Form
    ========================================== */

    function clearForm() {

        document.getElementById(
            "expense-amount"
        ).value = "";

        document.getElementById(
            "expense-category"
        ).selectedIndex = 0;

        document.getElementById(
            "expense-note"
        ).value = "";

        setToday();

    }

    /* ==========================================
       Today's Date
    ========================================== */

    function setToday() {

        const today =
            new Date()
                .toISOString()
                .split("T")[0];

        document.getElementById(
            "expense-date"
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

    /* ==========================================
       Events
    ========================================== */

    function bindEvents() {

        document
            .getElementById("save-expense")
            .addEventListener(
                "click",
                saveExpense
            );

    }

    /* ==========================================
       Public API
    ========================================== */

    return {

        init

    };

})();

/* ==========================================
   Auto Initialize
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        Expense.init();

    }
);
