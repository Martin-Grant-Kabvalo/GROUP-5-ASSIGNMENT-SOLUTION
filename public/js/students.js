document.addEventListener('DOMContentLoaded', () => {
    updateStudentsList();
    updateClassesList();   
});

// Get the buttons
const addStudentButton = document.querySelector('.add-student-button');

// Add click event listener to the "Add Student" button
addStudentButton.addEventListener('click', () => {
    // Get and Display the modal when the button is clicked
    const addStudentModal = document.querySelector('.std-modal');
    addStudentModal.style.display = 'block';

    const addButton = document.getElementById('confirmAdd');
    const cancelButton = document.getElementById('cancelAdd');
    const genderRadios = document.querySelectorAll('input[name="gender"]');

    addButton.onclick = () =>{
        const regNO = document.getElementById('regNo').value;
        const firstname = document.getElementById('firstName').value;
        const lastname = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const studentClass = document.getElementById('class').value;

        let gender = null;
        console.log(regNO);
        console.log(firstname);
        console.log(lastname);
        console.log(email);
        console.log(studentClass);
        
        // Loop through the radio buttons to find the selected one
        genderRadios.forEach(function (radio) {
            if (radio.checked) {
                gender = radio.value;
            }
        });

        // Check if a gender was selected
        if (gender) {
            console.log("Selected Gender:", gender);
        } else {
            console.log("Please select a gender.");
        }

        fetch('http://localhost:3000/addStudent', {
            method: 'POST',
            headers: {
           'Content-Type': 'application/json',
            },
            body: JSON.stringify({ regNO: regNO, firstname: firstname, lastname: lastname, gender: gender, email: email, studentClass: studentClass })
        })
        .then(res => res.json())
        .then(data => addStudent(data['data']));
    }
    cancelButton.addEventListener('click', () => {
        addStudentModal.style.display = 'none';
    });
});

function loadHTMLTable(data) {
    const table = document.getElementById('studentList');
    console.log(data);
    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='7'>No Students</td></tr>";
        return;
    } else {
        // Clear the table
        table.innerHTML = "";
        // Iterate through the data and add rows to the table
        data.forEach((row) => {
            const newRow = table.insertRow(table.rows.length);
            const cell1 = newRow.insertCell(0);
            const cell2 = newRow.insertCell(1);
            const cell3 = newRow.insertCell(2);
            const cell4 = newRow.insertCell(3);
            const cell5 = newRow.insertCell(4);
            const cell6 = newRow.insertCell(5);
            const cell7 = newRow.insertCell(6);
            console.log(row);
            cell1.innerHTML = row.regNo;
            cell2.innerHTML = row.firstname;
            cell3.innerHTML = row.lastname;
            cell4.innerHTML = row.gender;
            cell5.innerHTML = row.email;
            cell6.innerHTML = row.class;
            // Create edit and delete buttons with data attributes for easy access to row data
            cell7.innerHTML = `<button class="action edit" data-id="${row.regNo}" first-name="${row.firstname}" last-name="${row.lastname}" gender="${row.gender}" email="${row.email}" student-class="${row.class}"><i class="fa fa-pencil" aria-hidden="true"></i></button>
                              <button class="action delete" data-id="${row.regNo}"><i class="fa fa-trash" aria-hidden="true"></i></button>
                              <button class="action email" data-email="${row.email}"><i class="fa fa-envelope" aria-hidden="true"></i></button>`;
        });

        // Add event listeners to the edit and delete buttons
        const editButtons = document.querySelectorAll('.action.edit');
        const deleteButtons = document.querySelectorAll('.action.delete');
        const emailButtons = document.querySelectorAll('.action.email');

         editButtons.forEach((button) => {
             button.addEventListener('click', editStudent);
         });

         deleteButtons.forEach((button) => {
             button.addEventListener('click', deleteStudent);
         });

         emailButtons.forEach((button) => {
            button.addEventListener('click', openEmailModal);
        });
    }
}

function loadHTMLListBox(data) {
    const select = document.getElementById('class'); // Get the select element

    // Reset the select options
    select.innerHTML = "<option value=''>Select a class</option>";

    if (data.length === 0) {
        return; // No data to populate, so we're done
    }

    // Iterate through the data and add options to the select
    data.forEach((row) => {
        // Create an option element for the select
        const option = document.createElement('option');
        option.value = row.classCode;
        option.textContent = row.className;

        // Append the option to the select
        select.appendChild(option);
    });

    // FOR EDIT
    const updateSelect = document.getElementById('editClass'); // Get the select element

    // Reset the select options
    updateSelect.innerHTML = "<option value=''>Select a class</option>";

    if (data.length === 0) {
        return; // No data to populate, so we're done
    }

    // Iterate through the data and add options to the select
    data.forEach((row) => {
        // Create an option element for the select
        const option = document.createElement('option');
        option.value = row.classCode;
        option.textContent = row.className;

        // Append the option to the select
        updateSelect.appendChild(option);
    });
}

function editStudent(event) {
    // Retrieve data from the button's data attributes
    const regNo = event.currentTarget.getAttribute('data-id');
    const firstName = event.currentTarget.getAttribute('first-name');
    const lastName = event.currentTarget.getAttribute('last-name');
    const gender = event.currentTarget.getAttribute('gender');
    const email = event.currentTarget.getAttribute('email');
    const classValue = event.currentTarget.getAttribute('student-class');

    // Populate the edit form fields with the retrieved data
    document.getElementById('editRegNo').value = regNo;
    document.getElementById('editFirstName').value = firstName;
    document.getElementById('editLastName').value = lastName;

    // Check the appropriate radio button based on the retrieved gender
    if (gender === 'Male') {
        document.getElementById('editMale').checked = true;
    } else if (gender === 'Female') {
        document.getElementById('editFemale').checked = true;
    }

    document.getElementById('editEmail').value = email;

    // Set the selected option in the editClass select box
    const editClassSelect = document.getElementById('editClass');
    for (let i = 0; i < editClassSelect.options.length; i++) {
        if (editClassSelect.options[i].value === classValue) {
            editClassSelect.options[i].selected = true;
            break;
        }
    }

    // Show the edit modal
    const editStudentModal = document.getElementById('editStudentModal');
    editStudentModal.style.display = 'block';

    // Get the confirm button from the edit modal
    const confirmEditButton = document.getElementById('updateStudent');
    confirmEditButton.addEventListener('click', () => {

        fetch('http://localhost:3000/updateStudent', { 
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                },
            body: JSON.stringify({
                regNo: regNo,
                firstname : document.getElementById('editFirstName').value,
                lastname: document.getElementById('editLastName').value,
                gender: document.querySelector('input[name="editGender"]:checked').value,
                email: document.getElementById('editEmail').value,
                studentClass: document.getElementById('editClass').value
            })
            
        })
        .then(res => res.json())
        .then(data => {
            if(data.success){
                location.reload();
            }
        })
        document.getElementById('editStudentModal').style.display = 'none';
    });

    // Get the cancel button from the edit modal
    const cancelEditButton = document.getElementById('cancelEdit');
    cancelEditButton.addEventListener('click', () => {
        // Close the modal without performing any action
        document.getElementById('editStudentModal').style.display = 'none';
    });
}
 
// Delete button click handler
function deleteStudent(event) {
    const regNo = event.currentTarget.getAttribute('data-id');
    const encodedRegNo = encodeURIComponent(regNo);
    const deleteModal = document.getElementById('deleteModal');
    document.getElementById("deleteMessage").innerHTML = `Are you sure you want to delete Student ${regNo}`;
    deleteModal.style.display = 'block';

    const confirmDeleteButton = document.getElementById('confirmDelete');
    const cancelDeleteButton = document.getElementById('cancelDelete');

    confirmDeleteButton.addEventListener('click', () => {
        // Send a request to delete the row from the database
         fetch(`http://localhost:3000/deleteStudent/${encodedRegNo}`, {
            method: 'DELETE'
         })
        .then(res => res.json())
        // Close the modal
        deleteModal.style.display = 'none';
        updateStudentsList();
    });
    cancelDeleteButton.addEventListener('click', () => {
        // Close the modal without performing the delete action
        deleteModal.style.display = 'none';
    });
}

function addStudent(event) {
    // Trigger a function to update the classes list
    updateStudentsList();
    
}

function updateStudentsList() {
    // Fetch the updated data from the server
    fetch('http://localhost:3000/getStudents')
    .then((res) => res.json())
    .then((data) => {
        // Call the loadHTMLTable function to refresh the table with the updated data
        loadHTMLTable(data['data']);
    });
}
function updateClassesList() {
    // Fetch the updated data from the server
    fetch('http://localhost:3000/getClasses')
    .then((res) => res.json())
    .then((data) => {
        // Call the loadHTMLListBox function to refresh the table with the updated data
        loadHTMLListBox(data['data']);
    });
}

function openEmailModal(event) {
    const studentEmailAddress = event.currentTarget.getAttribute('data-email');
    document.getElementById('recipient').value = studentEmailAddress;
    const emailModal = document.getElementById('emailModal');
    emailModal.style.display = 'block';

    const sendButton = document.getElementById('sendEmailButton');
    sendButton.addEventListener('click', sendEmail)
    const closeButton = document.getElementById('closeEmailModal');
    closeButton.addEventListener('click', closeEmailModal);
}

function closeEmailModal() {
    const emailModal = document.getElementById('emailModal');
    emailModal.style.display = 'none';
}

function sendEmail() {
    const recipient = document.getElementById('recipient').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    fetch('http://localhost:3000/sendEmail', {
            method: 'POST',
            headers: {
           'Content-Type': 'application/json',
            },
            body: JSON.stringify({ recipient: recipient, subject: subject, message: message })
        })
        .then(res => res.json())
}

