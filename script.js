const refreshButton = document.getElementById("refresh-button");
const productTableBody = document.querySelector("#product-table tbody");
const editsModal = document.getElementById("edits-modal");
const modalProductId = document.getElementById("modal-product-id");
const editsTableBody = document.querySelector("#edits-table tbody");
const closeModalButton = document.querySelector(".close");
const loader = document.getElementById("loader"); // Loader element

const showLoader = () => {
  loader.style.display = "block"; // Show the loader
};

const hideLoader = () => {
  loader.style.display = "none"; // Hide the loader
};

const fetchData = async () => {
  showLoader(); // Show loader before fetching data
  try {
    const response = await fetch(
      "https://vit-naman-agrawal-dev.onrender.com/product/"
    );
    const data = await response.json();
    displayData(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    hideLoader(); // Hide loader after fetching data
  }
};

const displayData = (data) => {
  productTableBody.innerHTML = ""; // Clear existing rows
  data.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${item.quantity}</td>
            <td>${item.price}</td>
            <td><button class="view-edits" data-id="${item.id}">View Edits</button></td>
        `;
    productTableBody.appendChild(row);
  });

  // Add event listeners for "View Edits" buttons
  document.querySelectorAll(".view-edits").forEach((button) => {
    button.addEventListener("click", () => viewEdits(button));
  });
};

const viewEdits = async (button) => {
  const productId = button.dataset.id;
  modalProductId.textContent = productId; // Display product ID in modal
  editsTableBody.innerHTML = ""; // Clear existing edits
  showLoader(); // Show loader before fetching edits

  try {
    const response = await fetch(
      `https://vit-naman-agrawal-dev.onrender.com/edit/${productId}`
    );
    const edits = await response.json();

    // Populate the edits table
    edits.forEach((edit) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${edit.product_id}</td>
                <td>${edit.name}</td>
                <td>${edit.category}</td>
                <td>${edit.quantity}</td>
                <td>${edit.price}</td>
                <td><button class="edit-action" data-id="${edit.product_id}" data-name="${edit.name}" data-category="${edit.category}" data-quantity="${edit.quantity}" data-price="${edit.price}">Edit</button></td>
            `;
      editsTableBody.appendChild(row);
    });

    // Show the modal
    editsModal.style.display = "block";

    // Add event listeners for "Edit" buttons in the modal
    document.querySelectorAll(".edit-action").forEach((editButton) => {
      editButton.addEventListener("click", () => postEdit(editButton));
    });
  } catch (error) {
    console.error("Error fetching edits:", error);
  } finally {
    hideLoader(); // Hide loader after fetching edits
  }
};

const postEdit = async (button) => {
  const productData = {
    id: button.dataset.id,
    name: button.dataset.name,
    category: button.dataset.category,
    quantity: button.dataset.quantity,
    price: button.dataset.price,
  };

  // Show loader before making a POST request
  showLoader();

  try {
    const response = await fetch(
      "https://vit-naman-agrawal-dev.onrender.com/edit",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([productData]), // Send all relevant data
      }
    );
    const result = await response.json();
    console.log("Edit response:", result); // Log the response
    editsModal.style.display = "none"; // Close modal after editing
  } catch (error) {
    console.error("Error posting edit:", error);
  } finally {
    hideLoader(); // Hide loader after the POST request
    fetchData();
  }
};

// Close the modal when the user clicks the close button
closeModalButton.onclick = function () {
  editsModal.style.display = "none";
};

// Close the modal when the user clicks outside of the modal
window.onclick = function (event) {
  if (event.target === editsModal) {
    editsModal.style.display = "none";
  }
};

refreshButton.addEventListener("click", fetchData);

// Initial data fetch
fetchData();
