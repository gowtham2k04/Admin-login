// ✅ Fix 1: Properly load attendanceRecords from localStorage
let attendanceRecords = JSON.parse(localStorage.getItem("attendance")) || [];

// ✅ Fix 2: Wait for DOM to load before binding form event
window.onload = () => {
  loadEmployees();
  renderAttendance();

  const attendanceForm = document.getElementById("attendanceForm");
  if (attendanceForm) {
    attendanceForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const empSelect = document.getElementById("empSelect");
      const empId = empSelect.value;
      const name = empSelect.options[empSelect.selectedIndex].getAttribute("data-name");
      const status = document.getElementById("status").value;

      if (!empId || !status) {
        alert("Please select employee and status");
        return;
      }

      const now = new Date();
      const record = {
        empId,
        name,
        status,
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString()
      };

      attendanceRecords.push(record);
      localStorage.setItem("attendance", JSON.stringify(attendanceRecords));
      renderAttendance();
      attendanceForm.reset();
    });
  } else {
    console.error("attendanceForm not found");
  }
};

// ✅ Load employee options
function loadEmployees() {
  const employees = JSON.parse(localStorage.getItem("employees")) || [];
  const select = document.getElementById("empSelect");
  select.innerHTML = `<option value="">--Select Employee--</option>`;
  employees.forEach(emp => {
    const option = document.createElement("option");
    option.value = emp.empId;
    option.setAttribute("data-name", emp.name);
    option.textContent = `${emp.name} (${emp.empId})`;
    select.appendChild(option);
  });
}

// ✅ Render attendance table
function renderAttendance() {
  const attendanceTable = document.querySelector("#attendanceTable tbody");
  attendanceTable.innerHTML = "";

  attendanceRecords.forEach(record => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${record.name} (${record.empId})</td>
      <td>${record.status}</td>
      <td>${record.date}</td>
      <td>${record.time}</td>
    `;
    attendanceTable.appendChild(tr);
  });
}

// ✅ Search history by Employee ID
function searchAttendance() {
  const empIdInput = document.getElementById("searchEmpId").value.trim().toLowerCase();
  const resultTable = document.querySelector("#employeeHistoryTable tbody");
  const searchResultsDiv = document.getElementById("searchResults");
  const noHistoryMsg = document.getElementById("noHistoryMsg");

  resultTable.innerHTML = "";
  searchResultsDiv.style.display = "none";
  noHistoryMsg.style.display = "none";

  if (!empIdInput) {
    alert("Please enter an Employee ID.");
    return;
  }

  const matchedRecords = attendanceRecords.filter(
    r => r.empId.toLowerCase() === empIdInput
  );

  if (matchedRecords.length === 0) {
    searchResultsDiv.style.display = "block";
    noHistoryMsg.style.display = "block";
    return;
  }

  searchResultsDiv.style.display = "block";

  matchedRecords.forEach(record => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${record.name} (${record.empId})</td>
      <td>${record.status}</td>
      <td>${record.date}</td>
      <td>${record.time}</td>
    `;
    resultTable.appendChild(tr);
  });
}

// clear the history
function clearAllAttendance() {
  const confirmClear = confirm("Are you sure you want to delete all attendance records?");
  if (!confirmClear) return;

  // Optional: add backup before deletion
  // localStorage.setItem("attendance_backup", JSON.stringify(attendanceRecords));

  attendanceRecords = [];
  localStorage.setItem("attendance", JSON.stringify(attendanceRecords));
  renderAttendance();
  alert("All attendance records cleared.");
}

const clearBtn = document.getElementById("clearAttendanceBtn");
if (clearBtn) {
  clearBtn.addEventListener("click", clearAllAttendance);
}


// ✅ Export all attendance to PDF
function exportToPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("Employee Attendance Records", 10, 10);
  let y = 20;

  attendanceRecords.forEach((r, i) => {
    doc.text(`${i + 1}. ${r.name} (${r.empId}) - ${r.status} - ${r.date} - ${r.time}`, 10, y);
    y += 10;
  });

  doc.save("All_Attendance_Records.pdf");
}

// ✅ Export specific employee history to PDF
function downloadEmployeePDF() {
  const { jsPDF } = window.jspdf;
  const empId = document.getElementById("searchEmpId").value.trim();
  const filtered = attendanceRecords.filter(r => r.empId === empId);

  if (filtered.length === 0) {
    alert("No data to export.");
    return;
  }

  const empName = filtered[0].name;
  const doc = new jsPDF();
  doc.text(`Attendance for ${empName} (${empId})`, 10, 10);
  let y = 20;

  filtered.forEach((r, i) => {
    doc.text(`${i + 1}. ${r.status} - ${r.date} - ${r.time}`, 10, y);
    y += 10;
  });

  doc.save(`${empName}_${empId}_Attendance_History.pdf`);
}


// Optional: Show full details on click
profileCard.addEventListener("click", () => {
  alert("Full Details:\n" + profileCard.innerText);
});
