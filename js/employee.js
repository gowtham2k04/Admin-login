
let editIndex = null;

document.getElementById('employeeForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const photoInput = document.getElementById('photo').files[0];

  const newEmployee = {
    id: document.getElementById('empId').value,
    name: document.getElementById('name').value,
    age: document.getElementById('age').value,
    email: document.getElementById('email').value,
    gender: document.getElementById('gender').value,
    department: document.getElementById('department').value,
    role: document.getElementById('role').value,
    joiningDate: document.getElementById('joiningDate').value,
    phone: document.getElementById('phone').value,
    address: document.getElementById('address').value,
    photo: "" // We'll fill this using FileReader
  };

  const reader = new FileReader();

  reader.onloadend = function () {
    newEmployee.photo = reader.result;

    let employees = JSON.parse(localStorage.getItem("employees")) || [];

    if (editIndex !== null) {
      employees[editIndex] = newEmployee;
      editIndex = null;
    } else {
      employees.push(newEmployee);
    }

    localStorage.setItem("employees", JSON.stringify(employees));
    alert("Employee Saved!");
    document.getElementById('employeeForm').reset();
    displayEmployees();
  };

  if (photoInput) {
    reader.readAsDataURL(photoInput); // Read image as base64
  } else {
    // If no new photo uploaded
    if (editIndex !== null) {
      let employees = JSON.parse(localStorage.getItem("employees")) || [];
      newEmployee.photo = employees[editIndex].photo;

      employees[editIndex] = newEmployee;
      localStorage.setItem("employees", JSON.stringify(employees));
      editIndex = null;
      alert("Employee Updated!");
      document.getElementById('employeeForm').reset();
      displayEmployees();
    } else {
      alert("Please select a photo!");
    }
  }
});

function displayEmployees() {
  const employeeList = document.getElementById("employeeList");
  employeeList.innerHTML = "";

  const employees = JSON.parse(localStorage.getItem("employees")) || [];

  employees.forEach((emp, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="employee-card">
        <img src="${emp.photo}" alt="Photo" class="emp-photo" width="100" height="100" />
        <div class="emp-details">
          <strong>${emp.name}</strong> (Emp No: ${emp.id})<br/>
          ${emp.role} - ${emp.department}<br/>
          Age: ${emp.age}, Gender: ${emp.gender}<br/>
          📅 Joined: ${emp.joiningDate}<br/>
          📞 ${emp.phone} | ✉️ ${emp.email}<br/>
          📍 ${emp.address}
        </div>
        <div class="emp-actions">
          <button onclick="editEmployee(${index})">✏️ Edit</button>
          <button onclick="deleteEmployee(${index})">🗑️ Delete</button>
        </div>
      </div>
    `;
    employeeList.appendChild(li);
  });
}

function editEmployee(index) {
  const employees = JSON.parse(localStorage.getItem("employees")) || [];
  const emp = employees[index];

  document.getElementById("empId").value = emp.id;
  document.getElementById("name").value = emp.name;
  document.getElementById("age").value = emp.age;
  document.getElementById("email").value = emp.email;
  document.getElementById("gender").value = emp.gender;
  document.getElementById("department").value = emp.department;
  document.getElementById("role").value = emp.role;
  document.getElementById("joiningDate").value = emp.joiningDate;
  document.getElementById("phone").value = emp.phone;
  document.getElementById("address").value = emp.address;

  editIndex = index;
}

function deleteEmployee(index) {
  let employees = JSON.parse(localStorage.getItem("employees")) || [];
  employees.splice(index, 1);
  localStorage.setItem("employees", JSON.stringify(employees));
  displayEmployees();
}

window.onload = displayEmployees;

