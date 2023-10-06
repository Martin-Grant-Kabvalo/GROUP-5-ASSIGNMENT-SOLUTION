document.addEventListener('DOMContentLoaded', () => {
    updateClassesList(); 
    updateModulesList();   
    updateAssessmentsList();
});

// Get the buttons
const addAssessmentButton = document.querySelector('#addAssessmentButton');

// Add click event listener to the "Add Student" button
addAssessmentButton.addEventListener('click', () => {
    const assessmentName = document.getElementById('assessmentName').value;
    const studentClass = document.getElementById('classSelect').value;
    const moduleCode = document.getElementById('moduleSelect').value;
    fetch('http://localhost:3000/addAssessment', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assessmentName: assessmentName, studentClass: studentClass, moduleCode: moduleCode})
    })
    .then(res => res.json())
    .then(data => addAssessment(data['data']));
});

function loadHTMLTable(data) {
    const table = document.getElementById('assessmentList');
    console.log(data);
    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No Assessments</td></tr>";
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
            console.log(row);
            cell1.innerHTML = row.assessmentID;
            cell2.innerHTML = row.assessmentName;
            cell3.innerHTML = row.class;
            cell4.innerHTML = row.moduleCode;
            // Create edit and delete buttons with data attributes for easy access to row data
            cell5.innerHTML = `<button class="action edit" data-id="${row.assessmentID}" assessment-name="${row.assessmentName}" module-code="${row.moduleCode}" student-class="${row.class}"><i class="fa fa-pencil" aria-hidden="true"></i></button>
                              <button class="action delete" data-id="${row.assessmentID}"><i class="fa fa-trash" aria-hidden="true"></i></button>`;
        });

        // Add event listeners to the edit and delete buttons
        const editButtons = document.querySelectorAll('.action.edit');
        const deleteButtons = document.querySelectorAll('.action.delete');

         editButtons.forEach((button) => {
             button.addEventListener('click', editAssessment);
         });

         deleteButtons.forEach((button) => {
             button.addEventListener('click', deleteAssessment);
         });
    }
}

function loadHTMLClassListBox(data) {
    const select = document.getElementById('classSelect'); // Get the select element

    // Reset the select options
    select.innerHTML = "<option value=''>Select a Class</option>";

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

    // EDIT ASSESSMENT MODAL
    const editSelect = document.getElementById('editClassSelect'); // Get the select element

    // Reset the select options
    editSelect.innerHTML = "<option value=''>Select a Class</option>";

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
        editSelect.appendChild(option);
    });
}

function loadHTMLModuleListBox(data) {
    const select = document.getElementById('moduleSelect'); // Get the select element

    // Reset the select options
    select.innerHTML = "<option value=''>Select a Module</option>";

    if (data.length === 0) {
        return; // No data to populate, so we're done
    }

    // Iterate through the data and add options to the select
    data.forEach((row) => {
        // Create an option element for the select
        const option = document.createElement('option');
        option.value = row.moduleCode;
        option.textContent = row.moduleName;

        // Append the option to the select
        select.appendChild(option);
    });

    // EDIT ASSESSMENT MODAL
    const editSelect = document.getElementById('editModuleSelect'); // Get the select element

    // Reset the select options
    editSelect.innerHTML = "<option value=''>Select a Module</option>";

    if (data.length === 0) {
        return; // No data to populate, so we're done
    }

    // Iterate through the data and add options to the select
    data.forEach((row) => {
        // Create an option element for the select
        const option = document.createElement('option');
        option.value = row.moduleCode;
        option.textContent = row.moduleName;

        // Append the option to the select
        editSelect.appendChild(option);
    });
}

function editAssessment(event) {
    // Retrieve data from the button's data attributes
    const assessmentID = event.currentTarget.getAttribute('data-id');
    const assessmentName = event.currentTarget.getAttribute('assessment-name');
    const studentClass = event.currentTarget.getAttribute('student-class');
    const moduleCode = event.currentTarget.getAttribute('module-code');

    // Populate the edit form fields with the retrieved data
    document.getElementById('editAssessmentName').value = assessmentName;
    document.getElementById('editClassSelect').value = studentClass;
    document.getElementById('editModuleSelect').value = moduleCode;

    // Show the edit modal
    const editAssessmentModal = document.getElementById('editAssessmentModal');
    editAssessmentModal.style.display = 'block';

    // Get the confirm button from the edit modal
    const confirmEditButton = document.getElementById('saveEdit');
    confirmEditButton.addEventListener('click', () => {

        fetch('http://localhost:3000/updateAssessment', { 
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                },
            body: JSON.stringify({
                assessmentID: assessmentID,
                assessmentName : document.getElementById('editAssessmentName').value,
                studentClass: document.getElementById('editClassSelect').value,
                moduleCode: document.getElementById('editModuleSelect').value
            })
            
        })
        .then(res => res.json())
        .then(data => {
            if(data.success){
                location.reload();
            }
        })
        editAssessmentModal.style.display = 'none';
    });

    // Get the cancel button from the edit modal
    const cancelEditButton = document.getElementById('discardEdit');
    cancelEditButton.addEventListener('click', () => {
        // Close the modal without performing any action
        editAssessmentModal.style.display = 'none';
    });
}
 

// Delete button click handler
function deleteAssessment(event) {
    const assessmentID = event.currentTarget.getAttribute('data-id');
    const deleteModal = document.getElementById('deleteModal');
    document.getElementById("deleteMessage").innerHTML = `Are you sure you want to delete Assessment ${assessmentID}`;
    deleteModal.style.display = 'block';

    const confirmDeleteButton = document.getElementById('confirmDelete');
    const cancelDeleteButton = document.getElementById('cancelDelete');

    confirmDeleteButton.addEventListener('click', () => {
        // Send a request to delete the row from the database
         fetch(`http://localhost:3000/deleteAssessment/${assessmentID}`, {
            method: 'DELETE'
         })
        .then(res => res.json())
        // Close the modal
        deleteModal.style.display = 'none';
        updateAssessmentsList();
    });
    cancelDeleteButton.addEventListener('click', () => {
        // Close the modal without performing the delete action
        deleteModal.style.display = 'none';
        updateAssessmentsList();
    });
}

function addAssessment(event) {
    // Trigger a function to update the classes list
    updateStudentsList();
    
}

function updateAssessmentsList() {
    // Fetch the updated data from the server
    fetch('http://localhost:3000/getAssessments')
    .then((res) => res.json())
    .then((data) => {
        // Call the loadHTMLTable function to refresh the table with the updated data
        loadHTMLTable(data['data']);
    });
}

function updateModulesList() {
    // Fetch the updated data from the server
    fetch('http://localhost:3000/getModules')
    .then((res) => res.json())
    .then((data) => {
        // Call the loadHTMLTable function to refresh the table with the updated data
        loadHTMLModuleListBox(data['data']);
    });
}

function updateClassesList() {
    // Fetch the updated data from the server
    fetch('http://localhost:3000/getClasses')
    .then((res) => res.json())
    .then((data) => {
        // Call the loadHTMLListBox function to refresh the table with the updated data
        loadHTMLClassListBox(data['data']);
    });
}

