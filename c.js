import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* =========================
   PLACE DATA
========================= */

const places = {
  hill: ["Manali", "Ooty", "Munnar", "Shimla"],
  nature: ["Leh Ladakh", "Rishikesh", "Spiti"],
  beach: ["Goa", "Gokarna", "Pondicherry"],
  heritage: ["Jaipur", "Taj Mahal", "Hampi"]
};

/* =========================
   LOAD PLACES
========================= */

document.getElementById("category").addEventListener("change", function () {

  const category = this.value;
  const place = document.getElementById("place");

  place.innerHTML = `<option value="">Select Place</option>`;

  if (places[category]) {
    places[category].forEach(p => {
      const opt = document.createElement("option");
      opt.value = p;
      opt.textContent = p;
      place.appendChild(opt);
    });
  }
});

/* =========================
   TOTAL CALCULATION
========================= */

function updateTotal() {
  const days = Number(document.getElementById("days").value || 0);
  const members = Number(document.getElementById("members").value || 0);

  const total = (days * 1000) + (members * 300);

  document.getElementById("total").innerText = total;
}

document.getElementById("days").addEventListener("input", updateTotal);
document.getElementById("members").addEventListener("input", updateTotal);

/* =========================
   UPI BOX
========================= */

function showPaymentInfo() {
  const payment = document.getElementById("payment").value;
  const box = document.getElementById("upiBox");

  if (payment === "upi") {
    box.style.display = "block";
    box.innerHTML = "<b>UPI ID:</b> charangowda2005@ybl";
  } else {
    box.style.display = "none";
  }
}

window.showPaymentInfo = showPaymentInfo;

/* =========================
   BOOKING + FIREBASE + RECEIPT
========================= */

window.bookTrip = async function () {

  const category = document.getElementById("category").value;
  const place = document.getElementById("place").value;
  const days = document.getElementById("days").value;
  const members = document.getElementById("members").value;
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const payment = document.getElementById("payment").value;
  const total = document.getElementById("total").innerText;

  if (!category || !place || !days || !members || !name || !phone || !email || !payment) {
    alert("❌ Please fill all fields");
    return;
  }

  if (!/^[0-9]{10}$/.test(phone)) {
    alert("❌ Invalid phone number");
    return;
  }

  const bookingId = "CT" + Date.now();

  const data = {
    bookingId,
    category,
    place,
    days,
    members,
    name,
    phone,
    email,
    payment,
    total,
    createdAt: new Date()
  };

  try {

    // ✅ SAVE TO FIREBASE
    await addDoc(collection(db, "bookings"), data);

    alert("✅ Booking Successful ");

    // ✅ GENERATE RECEIPT
    generateReceipt(data);

    // ✅ RESET FORM
    resetForm();

  } catch (error) {
    console.error("Firebase Error:", error);
    alert("❌ Booking Failed (Firebase Error)");
  }
};

/* =========================
   RECEIPT GENERATION
========================= */

function generateReceipt(data) {

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("CHARAN TOURS & TRAVELS", 20, 20);

  doc.setFontSize(12);
  doc.text("BOOKING RECEIPT", 20, 30);

  doc.setFont("helvetica", "normal");

  doc.text("Booking ID: " + data.bookingId, 20, 45);
  doc.text("Name: " + data.name, 20, 55);
  doc.text("Phone: " + data.phone, 20, 65);
  doc.text("Email: " + data.email, 20, 75);

  doc.text("Category: " + data.category, 20, 85);
  doc.text("Place: " + data.place, 20, 95);
  doc.text("Days: " + data.days, 20, 105);
  doc.text("Members: " + data.members, 20, 115);

  doc.text("Payment mode: " + data.payment, 20, 125);

//   if (data.payment === "upi") {
//     doc.text("UPI ID: charantours@upi", 20, 135);
//   }

  doc.text("TOTAL: Rs. " + data.total, 20, 150);

  doc.save("Receipt_" + data.bookingId + ".pdf");
}

/* =========================
   RESET FORM
========================= */

function resetForm() {
  document.getElementById("category").value = "";
  document.getElementById("place").innerHTML = `<option value="">Select Place</option>`;
  document.getElementById("days").value = "";
  document.getElementById("members").value = "";
  document.getElementById("name").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("email").value = "";
  document.getElementById("payment").value = "";
  document.getElementById("total").innerText = "0";
//   document.getElementById("upiBox").style.display = "none";
}

/* =========================
   MAKE GLOBAL
========================= */

window.bookTrip = bookTrip;