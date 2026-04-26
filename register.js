document.getElementById("register-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const full_name = document.getElementById("full_name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("register-message");

    try {
        const response = await fetch("http://127.0.0.1:5000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                full_name,
                email,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {
            message.innerText = "Registration successful! Redirecting to login...";
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);
        } else {
            message.innerText = data.error;
        }

    } catch (error) {
        message.innerText = "Something went wrong.";
        console.error(error);
    }
});