document.addEventListener("DOMContentLoaded", () => {
  const launchesContainer = document.getElementById("launchesContainer");
  const allLaunchesBtn = document.getElementById("allLaunchesBtn");
  const successfulFlightsBtn = document.getElementById("successfulFlightsBtn");

  // Function to fetch past launches' data
  async function fetchPastLaunches() {
    try {
      const response = await fetch(
        "https://api.spacexdata.com/v5/launches/past"
      );
      const launches = await response.json();

      // Extracting required data from each launch
      const formattedLaunches = launches.map((launch) => ({
        flight_number: launch.flight_number,
        name: launch.name,
        date_utc: launch.date_utc,
        rocket: launch.rocket,
        success: launch.success,
        failures: launch.failures ? launch.failures : "not found",
      }));

      return formattedLaunches;
    } catch (error) {
      console.error("Error fetching past launches:", error);
      throw error;
    }
  }
  // Function to filter successful flights
  function filterSuccessfulFlights(allFlights) {
    return allFlights.filter((flight) => flight.success === true);
  }

  // Function to render launches
  function displayLaunches(launches) {
    launchesContainer.innerHTML = "";

    launches.forEach((launch) => {
      const launchCard = document.createElement("div");
      launchCard.classList.add("flightCard");

      launchCard.innerHTML = `
          <div class="launchInfo">
            <strong>Flight Number:</strong> ${launch.flight_number}<br>
            <strong>Name:</strong> ${launch.name}<br>
            <strong>Date (UTC):</strong> ${launch.date_utc}<br>
            <strong>Rocket:</strong> ${launch.rocket}<br>
            <strong>Success:</strong> ${launch.success ? "Yes" : "No"}<br>
            <strong>Failures:</strong> ${
              JSON.stringify(launch.failures) || "None"
            }<br>
          </div>
          <br>
        `;

      launchesContainer.appendChild(launchCard);
    });

    // Display the launches container
    launchesContainer.style.display = "grid";
  }
  // Event listener for "All Launches" button
  allLaunchesBtn.addEventListener("click", async () => {
    try {
      const allLaunches = await fetchPastLaunches();
      displayLaunches(allLaunches);
    } catch (error) {
      console.error("Error fetching all launches:", error);
    }
  });

  // Event listener for "Successful Flights" button
  successfulFlightsBtn.addEventListener("click", async () => {
    try {
      const allLaunches = await fetchPastLaunches();
      const successfulFlights = filterSuccessfulFlights(allLaunches);
      displayLaunches(successfulFlights);
    } catch (error) {
      console.error("Error fetching successful flights:", error);
    }
  });

  // Fetch all launches initially
  allLaunchesBtn.click();
});
