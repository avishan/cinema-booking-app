const params = new URLSearchParams(window.location.search);
const showingId = params.get("showing_id");



fetch(`http://127.0.0.1:5000/showings/${showingId}`)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    return response.json();
  })
  .then(show => {
    const price = show.base_price_cents / 100;

    document.getElementById("showing-info").innerHTML = `
      <p><strong>Movie:</strong> ${show.title}</p>
      <p><strong>Hall:</strong> ${show.hall_id}</p>
      <p><strong>Start:</strong> ${show.start_time}</p>
      <p><strong>End:</strong> ${show.end_time}</p>
      <p><strong>Price per seat:</strong> €${price.toFixed(2)}</p>
    `;

    // fetch booked seats for this showing
    fetch(`http://127.0.0.1:5000/showings/${showingId}/seats`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        return response.json();
      })
      .then(seatsFromDB => {
  bookedSeats = seatsFromDB;
  createSeatGrid(price);
  setupConfirmButton(price);
});
  })
  .catch(error => {
    console.error("Error loading showing details:", error);
    document.getElementById("showing-info").textContent =
      "Could not load showing details.";
  });

  // ---------------- BELOW FETCH (OUTSIDE) ----------------


// ---------------- GLOBAL VARIABLES ----------------
let selectedSeats = [];
let bookedSeats = [];   // now empty (will come from DB)


// ---------------- FUNCTIONS  createSeatGrid----------------

function createSeatGrid(seatPrice) {
  const container = document.getElementById("seats-container");
  container.innerHTML = "";

  const rows = ["A", "B", "C", "D"];
  const seatsPerRow = 6;

  rows.forEach(rowLetter => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "seat-row";

    for (let i = 1; i <= seatsPerRow; i++) {
      const seatId = `${rowLetter}${i}`;
      const seat = document.createElement("button");

      seat.className = "seat";
      seat.textContent = seatId;

      // Check if this seat is already booked
      if (bookedSeats.includes(seatId)) {
        seat.classList.add("booked");
        seat.disabled = true;
      } else {
        seat.addEventListener("click", () => {
          toggleSeat(seat, seatId, seatPrice);
        });
      }

      rowDiv.appendChild(seat);
    }

    container.appendChild(rowDiv);
  });
}

//toggleSeat  select a seat by click. Unselect a seat by click it again

function toggleSeat(seatElement, seatId, seatPrice) {
  const index = selectedSeats.indexOf(seatId);

  if (index === -1) {
    selectedSeats.push(seatId);
    seatElement.classList.add("selected");
  } else {
    selectedSeats.splice(index, 1);
    seatElement.classList.remove("selected");
  }

  updateTotal(seatPrice);
}


function updateTotal(seatPrice) {
  const total = selectedSeats.length * seatPrice;

  document.getElementById("total-price").textContent =
    `Total: €${total.toFixed(2)}`;
}


function setupConfirmButton(seatPrice) {
  const confirmBtn = document.getElementById("confirm-btn");

  confirmBtn.addEventListener("click", () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    fetch("http://127.0.0.1:5000/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        showing_id: Number(showingId),
        seats: selectedSeats
      })
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => {
            throw new Error(err.error || "Booking failed");
          });
        }
        return response.json();
      })
      .then(result => {
        // alert(`Booking confirmed! Booking ID: ${result.booking_id}`);

        const bookingMessage = document.getElementById("booking-message");

          bookingMessage.style.display = "block";
          bookingMessage.innerHTML = `
            <strong>✅ Booking confirmed!</strong><br>
            Booking ID: ${result.booking_id}<br>
            Movie: ${document.querySelector("#showing-info p:nth-child(1)").textContent.replace("Movie: ", "")}<br>
            Hall: ${document.querySelector("#showing-info p:nth-child(2)").textContent.replace("Hall: ", "")}<br>
            Start: ${document.querySelector("#showing-info p:nth-child(3)").textContent.replace("Start: ", "")}<br>
            Seats: ${selectedSeats.join(", ")}<br>
            Total: €${(result.total_price_cents / 100).toFixed(2)}
          `;


          // ✅ DISABLE BUTTON HERE
          const confirmBtn = document.getElementById("confirm-btn");
          confirmBtn.disabled = true;
          confirmBtn.textContent = "Booking Confirmed";

        // Move selected seats to booked seats THEN update state
        bookedSeats = [...bookedSeats, ...selectedSeats];
        selectedSeats = [];

        // Reset total
        document.getElementById("total-price").textContent = "Total: €0.00";

        // Rebuild grid so new booked seats become disabled
        createSeatGrid(seatPrice);
      })
      .catch(error => {
        alert(error.message);
        console.error("Booking error:", error);
      });
  });
}