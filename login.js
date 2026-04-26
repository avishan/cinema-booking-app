document.getElementById("login-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("login-message");

    try {
        const response = await fetch("http://127.0.0.1:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("user_id", data.user_id);
            localStorage.setItem("full_name", data.full_name);
            localStorage.setItem("role", data.role);

            message.innerText = "Login successful! Redirecting...";

            if (data.role === "admin") {
                setTimeout(() => {
                    window.location.href = "admin-dashboard.html";
                }, 1500);
            } else {
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1500);
            }

        } else {
            message.innerText = data.error;
        }

    } catch (error) {
        message.innerText = "Something went wrong.";
        console.error(error);
    }
});