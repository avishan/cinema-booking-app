const params = new URLSearchParams(window.location.search);
const movieId = params.get("movie_id");

fetch(`http://127.0.0.1:5000/movies/${movieId}/showings`)
  .then(response => response.json())
  .then(showings => {
    const container = document.getElementById("showings-container");
    container.innerHTML = "";

    if (showings.length === 0) {
      container.textContent = "No showings available for this movie.";
      return;
    }

    showings.forEach(show => {
      const showingCard = document.createElement("div");
      showingCard.className = "showing-card";

      showingCard.innerHTML = `
        <h3>${show.title}</h3>
        <p><strong>Hall:</strong> ${show.hall_id}</p>
        <p><strong>Start:</strong> ${show.start_time}</p>
        <p><strong>End:</strong> ${show.end_time}</p>
        <p><strong>Price:</strong> €${(show.base_price_cents / 100).toFixed(2)}</p>
        
        <button class="btn-primary reserve-btn" data-id="${show.id}">
        Reserve Seats
        </button>
        `;

      container.appendChild(showingCard);

      //for finding seat
      const btn = showingCard.querySelector(".reserve-btn");

            btn.addEventListener("click", () => {
            const showingId = btn.getAttribute("data-id");
            window.location.href = `seats.html?showing_id=${showingId}`;
            });

            //End of finding seat
    });
  })
  .catch(error => {
    console.error("Error loading showings:", error);
    document.getElementById("showings-container").textContent =
      "Could not load showings.";
  });