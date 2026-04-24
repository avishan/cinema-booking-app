//   <!-------Related to Api and dynamic page that page can  read the information related to the spcific film-------->
//     <script>
  const params = new URLSearchParams(window.location.search);
  const movieId = params.get("id");

  fetch(`http://127.0.0.1:5000/movies/${movieId}`) // calling backend (Flask)
    .then(response => response.json()) //geting the file in Json format
    .then(movie => {       // map Json format file to Javascript used
      document.getElementById("movie-title").textContent = movie.title;
      document.getElementById("movie-genre").textContent = movie.genre;
      document.getElementById("movie-duration").textContent = movie.duration_min;


      // Button for show that specific movie (inside)
      const showingsBtn = document.getElementById("showings-btn");

    showingsBtn.addEventListener("click", () => {
      window.location.href = `reserve.html?movie_id=${movieId}`;
    });
 

      const imageMap = {  // make a JavaScript object (dictionary) for each Movie picture
        1: "image/action/inception.jpg",
        2: "image/action/The Dark Knight.jpg",
        3: "image/action/Interstellar.jpg",
        4: "image/comedy/3 Idiots.jpg",
        5: "image/Romance/The Notebook.jpg",
        6: "image/Animation/The Polar Express.jpg",
        7: "image/Romance/Titanic.jpg",
        8: "image/Romance/La La Land.jpg",
        10: "image/comedy/Home Alone.jpg",
        11: "image/comedy/The Hangover.jpg",
        12: "image/Animation/toystory.jpg",
        13: "image/Animation/Frozen.jpg"
      };

       // for movie description
    const descriptionMap = {
  1: "Overview: A skilled thief enters people's dreams to steal secrets, but this time he is given the impossible task of planting an idea into someone's mind.",
  2: "Overview: When the Joker, a criminal mastermind of pure chaos, plunges Gotham City into violent anarchy, Batman must push his physical and psychological limits to restore order.",
  3: "Overview: A team of explorers travels through a wormhole in space in an attempt to save humanity and find a new habitable world.",
  4: "Overview: Two friends look back on their college years and the life lessons they learned while challenging a rigid education system.",
  5: "Overview: A young couple falls deeply in love, but life, class differences, and time test the strength of their bond.",
  6: "Overview: A boy boards a magical train on Christmas Eve and begins a journey to the North Pole that changes his understanding of belief.",
  7: "Overview: A young woman from a wealthy family and a poor artist fall in love aboard the ill-fated Titanic.",
  8: "Overview: A jazz musician and an aspiring actress fall in love while chasing their dreams in Los Angeles.",
  10: "Overview: A young boy accidentally left home alone must protect his house from two burglars using clever traps.",
  11: "Overview: Three friends wake up after a bachelor party in Las Vegas with no memory of the night before and must piece together what happened.",
  12: "Overview: A group of toys secretly comes to life whenever humans are not around, and their world changes when a new toy arrives.",
  13: "Overview: A young princess with magical ice powers learns to accept herself while trying to protect her kingdom."
};
     document.getElementById("movie-description").textContent =
        descriptionMap[movie.id] || "Overview: No description available.";

      const movieImage = document.getElementById("movie-image");
      movieImage.src = imageMap[movie.id] || "";
      movieImage.alt = movie.title + " poster";
    })
    .catch(error => {
      console.error("Error loading movie:", error);
      document.getElementById("movie-title").textContent = "Movie not found";
    });

   