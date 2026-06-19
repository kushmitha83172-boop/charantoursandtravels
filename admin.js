import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const bookingTable = document.getElementById("bookingTable");

/* =========================
   LOAD BOOKINGS
========================= */

async function loadBookings() {

  bookingTable.innerHTML = "";

  let total = 0;
  let pending = 0;
  let approved = 0;
  let rejected = 0;

  const q = query(
    collection(db, "bookings"),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  snapshot.forEach((document) => {

    const data = document.data();

    total++;

    if (data.status === "Approved") {
      approved++;
    }
    else if (data.status === "Rejected") {
      rejected++;
    }
    else {
      pending++;
    }

    let badge = "";

    if (data.status === "Approved") {
      badge = `<span class="badge bg-success">Approved</span>`;
    }
    else if (data.status === "Rejected") {
      badge = `<span class="badge bg-danger">Rejected</span>`;
    }
    else {
      badge = `<span class="badge bg-warning text-dark">Pending</span>`;
    }

    bookingTable.innerHTML += `
      <tr>
        <td>${data.bookingId || ""}</td>
        <td>${data.name || ""}</td>
        <td>${data.phone || ""}</td>
        <td>${data.email || ""}</td>
        <td>${data.place || ""}</td>
        <td>₹${data.total || 0}</td>
        <td>${badge}</td>

        <td>

          <button
          class="btn btn-success btn-sm mb-1"
          onclick="approveBooking('${document.id}')">
          Approve
          </button>

          <button
          class="btn btn-warning btn-sm mb-1"
          onclick="rejectBooking('${document.id}')">
          Reject
          </button>

          <button
          class="btn btn-danger btn-sm mb-1"
          onclick="deleteBooking('${document.id}')">
          Delete
          </button>

          <br>

          <a
          class="btn btn-success btn-sm"
          target="_blank"
          href="https://wa.me/91${data.phone}">
          WhatsApp
          </a>

          <a
          class="btn btn-primary btn-sm"
          href="tel:${data.phone}">
          Call
          </a>

        </td>

      </tr>
    `;
  });

  document.getElementById("totalBookings").innerText = total;
  document.getElementById("pendingBookings").innerText = pending;
  document.getElementById("approvedBookings").innerText = approved;
  document.getElementById("rejectedBookings").innerText = rejected;
}

/* =========================
   LOAD USERS
========================= */

async function loadUsers() {

  const loginTable = document.getElementById("loginTable");

  if (!loginTable) return;

  loginTable.innerHTML = "";

  const q = query(
    collection(db, "users"),
    orderBy("loginTime", "desc")
  );

  const snapshot = await getDocs(q);

  const totalUsers = document.getElementById("totalUsers");

  if (totalUsers) {
    totalUsers.innerText = snapshot.size;
  }

  snapshot.forEach((document) => {

    const data = document.data();

    let loginTime = "";

    if (data.loginTime) {
      loginTime = data.loginTime.toDate().toLocaleString();
    }

    loginTable.innerHTML += `
      <tr>
        <td>${data.username || ""}</td>
        <td>${data.phone || ""}</td>
        <td>${loginTime}</td>

        <td>
          <button
          class="btn btn-danger btn-sm"
          onclick="deleteUser('${document.id}')">
          Delete
          </button>
        </td>

      </tr>
    `;
  });
}

/* =========================
   APPROVE BOOKING
========================= */

window.approveBooking = async function(id){

  await updateDoc(
    doc(db,"bookings",id),
    {
      status:"Approved"
    }
  );

  loadBookings();
};

/* =========================
   REJECT BOOKING
========================= */

window.rejectBooking = async function(id){

  await updateDoc(
    doc(db,"bookings",id),
    {
      status:"Rejected"
    }
  );

  loadBookings();
};

/* =========================
   DELETE BOOKING
========================= */

window.deleteBooking = async function(id){

  if(confirm("Delete booking?")){

    await deleteDoc(
      doc(db,"bookings",id)
    );

    loadBookings();
  }
};

/* =========================
   DELETE USER
========================= */

window.deleteUser = async function(id){

  if(confirm("Delete user record?")){

    await deleteDoc(
      doc(db,"users",id)
    );

    loadUsers();
  }
};

/* =========================
   LOGOUT
========================= */

window.logout = function(){

  localStorage.removeItem("admin");

  window.location.href = "admin-login.html";
};

/* =========================
   INITIAL LOAD
========================= */

loadBookings();
loadUsers();