/*
==========================================================
LifeLedger Lite
dashboard.js
Dashboard Module
==========================================================
*/

"use strict";

const Dashboard = (() => {

    /*
    ==========================================
    Elements
    ==========================================
    */

    const page =
        document.getElementById("dashboard-page");

    let expenseContainer;

    /*
    ==========================================
    Initialize
    ==========================================
    */

    async function init() {

        renderLayout();

        expenseContainer =
            document.getElementById(
                "recent-expenses"
            );

        bindEvents();

        await loadDashboard();

    }

    /*
    ==========================================
    Dashboard Layout
    ==========================================
    */

    function renderLayout() {

        page.innerHTML = `

        <div class="page-header">

            <h2>Dashboard</h2>

            <h4>

                স্বাগতম অরিত্র


            </h4>

        </div>

        <div class="dashboard-grid">

            <div class="card stat-card">

                <h4>Total Expense 💸</h4>

                <h2 id="total-expense">

                    ₹0

                </h2>

            </div>

            <div class="card stat-card">

                <h4>Monthly Expense 💸</h4>

                <h2 id="monthly-expense">

                    ₹0

                </h2>

            </div>

        </div>

        <div class="card">

            <div class="section-header">

                <h3>

                    Recent Expenses

                </h3>

            </div>

            <div id="recent-expenses">

                ${GoogleSheets.showLoading()}

            </div>

        </div>

        <div class="card">

            <h3>

                Quick Actions

            </h3>

            <div class="quick-actions">

                <button
                    id="goto-expense"
                    class="btn-primary">

                    + Add Expense

                </button>

                <button
                    id="goto-notes"
                    class="btn-primary">

                    + Add Note

                </button>

                <button
                    id="goto-health"
                    class="btn-primary">

                    + Health

                </button>

                <button
                    id="goto-travel"
                    class="btn-primary">

                    + Travel

                </button>

            </div>

        </div>

        `;

    }
    /*
    ==========================================
    Load Dashboard Data
    ==========================================
    */

    async function loadDashboard() {

        try {

            const expenses =
                await GoogleSheets.getData(
                    "expense"
                );

            updateExpenseCards(
                expenses
            );

            renderRecentExpenses(
                expenses
            );

        }

        catch (error) {

            console.error(
                "Dashboard Error:",
                error
            );

            expenseContainer.innerHTML =
                GoogleSheets.showError(
                    error.message
                );

        }

    }

    /*
    ==========================================
    Expense Summary Cards
    ==========================================
    */

    function updateExpenseCards(expenses) {

        const totalExpenses = expenses.reduce(

            (sum, item) =>

                sum +

                Number(

                    item.Amount ||

                    item.amount ||

                    0

                ),

            0

        );

        const today = new Date();

        const currentMonth =
            today.getMonth();

        const currentYear =
            today.getFullYear();

        const monthlyExpenses =
            expenses.reduce(

                (sum, item) => {

                    const expenseDate =
                        new Date(

                            item.Date ||

                            item.date

                        );

                    if (

                        expenseDate.getMonth() === currentMonth &&

                        expenseDate.getFullYear() === currentYear

                    ) {

                        return (

                            sum +

                            Number(

                                item.Amount ||

                                item.amount ||

                                0

                            )

                        );

                    }

                    return sum;

                },

                0

            );

        document.getElementById(
            "total-expense"
        ).textContent =
            "₹" +
            totalExpenses.toLocaleString(
                "en-IN"
            );

        document.getElementById(
            "monthly-expense"
        ).textContent =
            "₹" +
            monthlyExpenses.toLocaleString(
                "en-IN"
            );

    }
    /*
    ==========================================
    Recent Expenses
    ==========================================
    */

function renderRecentExpenses(expenses) {

    if (!expenses.length) {

        expenseContainer.innerHTML =
            GoogleSheets.showEmpty(
                "No expenses found."
            );

        return;

    }

    const recentExpenses =
        expenses
        .slice()
        .sort(
            (a,b)=>
                new Date(
                    b.Date || b.date
                ) -
                new Date(
                    a.Date || a.date
                )
        )
        .slice(0,5);

    expenseContainer.innerHTML = `

        <div class="section-header recent-expense-header">

            <h3>

                Category

            </h3>

            <button
                id="view-all-expenses"
                class="link-btn"
            >

                Balance

            </button>

        </div>

    `;

    recentExpenses.forEach(item => {

        expenseContainer.innerHTML += `

            <div class="list-item">

                <div>

                    <strong>

                        ${item.Category || "-"}

                    </strong>

                    <br>

                    <small>

                        ${formatDate(
                            item.Date ||
                            item.date
                        )}

                    </small>

                </div>

                <div class="expense-amount">

                    ₹${Number(
                        item.Amount ||
                        item.amount ||
                        0
                    ).toLocaleString("en-IN")}

                </div>

            </div>

        `;

    });

    document
        .getElementById(
            "view-all-expenses"
        )
        .addEventListener(
            "click",
            () => {

                document.dispatchEvent(

                    new CustomEvent(
                        "navigate",
                        {

                            detail: {

                                page: "expense"

                            }

                        }

                    )

                );

            }

        );

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
            .getElementById("goto-expense")
            .addEventListener(
                "click",
                () => window.navigateTo("expense")
            );

        document
            .getElementById("goto-notes")
            .addEventListener(
                "click",
                () => window.navigateTo("notes")
            );

        document
            .getElementById("goto-health")
            .addEventListener(
                "click",
                () => window.navigateTo("health")
            );

        document
            .getElementById("goto-travel")
            .addEventListener(
                "click",
                () => window.navigateTo("travel")
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
