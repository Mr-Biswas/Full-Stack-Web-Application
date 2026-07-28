/*
==========================================================
LifeLedger Lite
navigation.js
==========================================================
*/

(() => {

    "use strict";

    // -----------------------------
    // Elements
    // -----------------------------

    const pages = document.querySelectorAll(".page");
    const navButtons = document.querySelectorAll(".nav-btn");

    // -----------------------------
    // Show Page
    // -----------------------------

    // function showPage(pageName) {

    //     pages.forEach(page => {

    //         page.classList.remove("active");

    //     });

    //     navButtons.forEach(button => {

    //         button.classList.remove("active");

    //     });

    //     const selectedPage = document.getElementById(`${pageName}-page`);

    //     const selectedButton =
    //         document.querySelector(`.nav-btn[data-page="${pageName}"]`);

    //     if (selectedPage) {

    //         selectedPage.classList.add("active");
    //         selectedPage.classList.add("fade-in");

    //         setTimeout(() => {

    //             selectedPage.classList.remove("fade-in");

    //         }, 300);

    //     }

    //     if (selectedButton) {

    //         selectedButton.classList.add("active");

    //     }

    //     window.scrollTo({

    //         top: 0,
    //         behavior: "smooth"

    //     });

    // }
    function showPage(pageName) {

        pages.forEach(page => {
            page.classList.remove("active");
        });

        navButtons.forEach(button => {
            button.classList.remove("active");
        });

        const selectedPage =
            document.getElementById(`${pageName}-page`);

        const selectedButton =
            document.querySelector(
                `.nav-btn[data-page="${pageName}"]`
            );

        if (selectedPage) {

            selectedPage.classList.add("active");
            selectedPage.classList.add("fade-in");

            setTimeout(() => {

                selectedPage.classList.remove("fade-in");

            },300);

        }

        if(selectedButton){

            selectedButton.classList.add("active");

        }

        window.scrollTo({

            top:0,
            behavior:"smooth"

        });

    // IMPORTANT
        document.dispatchEvent(

            new CustomEvent(
                "pageChanged",
                {
                    detail:{
                        page:pageName
                    }
                }
            )

        );

    }

    // -----------------------------
    // Navigation Click
    // -----------------------------

    navButtons.forEach(button => {

        button.addEventListener("click", () => {

            const page = button.dataset.page;

            showPage(page);

        });

    });

    // -----------------------------
    // Public Function
    // -----------------------------

    window.navigateTo = showPage;

    // -----------------------------
    // Default Page
    // -----------------------------

    showPage("dashboard");

})();