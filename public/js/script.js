// public/js/script.js

document.addEventListener("DOMContentLoaded", () => {
  const errorMessage = document.getElementById("error-message");
  const usernameInput = document.getElementById("username");
  const usernameAvailability = document.getElementById("username-availability");
  let usernameTimer;

  // Function to check username availability
  async function checkUsernameAvailability(username) {
    try {
      const response = await fetch("/check-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.available) {
          // Username is available
          usernameAvailability.textContent = "Username is available";
          usernameAvailability.classList.add("text-success");
          usernameAvailability.classList.remove("text-danger");
        } else {
          // Username is not available
          usernameAvailability.textContent = "Username is not available";
          usernameAvailability.classList.add("text-danger");
          usernameAvailability.classList.remove("text-success");
        }
      } else if (response.status === 409) {
        // Username conflict
        usernameAvailability.textContent = "Username conflict";
        usernameAvailability.classList.add("text-warning");
        usernameAvailability.classList.remove("text-success", "text-danger");
      } else {
        // Other server-side errors
        throw new Error(`Server responded with ${response.status}`);
      }
    } catch (error) {
      console.error("Error checking username:", error);
      // Display a server-side error message
      errorMessage.textContent = "An error occurred. Please try again.";
    }
  }

  // Handle username input and check availability
  usernameInput.addEventListener("input", (event) => {
    clearTimeout(usernameTimer);
    const inputUsername = event.target.value.trim();

    if (inputUsername) {
      usernameTimer = setTimeout(() => {
        checkUsernameAvailability(inputUsername);
      }, 500); // Delay before checking (adjust as needed)
    } else {
      // Clear availability message if the field is empty
      usernameAvailability.textContent = "";
    }
  });

  // Handle form submission
  const form = document.querySelector("form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Clear any previous error messages
    errorMessage.textContent = "";

    // Fetch form data
    const formData = new FormData(form);

    // Send a POST request to the server
    try {
      const response = await fetch("/create-user", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.error) {
          errorMessage.textContent = data.error;
        }
      } else {
        // User created successfully, you can redirect or display a success message
        // For now, we'll clear the form
        form.reset();
      }
    } catch (error) {
      console.error("Error:", error);
      // Display a server-side error message
      errorMessage.textContent = "An error occurred. Please try again.";
    }
  });
});
