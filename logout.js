const logoutBtn = document.getElementById("logout-btn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("user_id");
        localStorage.removeItem("full_name");
        localStorage.removeItem("role");

        alert("Logged out successfully!");

        window.location.href = "index.html";
    });
}