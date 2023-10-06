const addGradesModal = document.getElementById('addGradesModal');
const modalTitle = document.getElementById('modalTitle');
const gradesTableBody = document.getElementById('gradesTableBody');
const submitGradesButton = document.getElementById('submitGradesButton');

function openGradesModal(assessmentName) {
    modalTitle.textContent = assessmentName;
    addGradesModal.style.display = 'block';
}

function closeGradesModal() {
    addGradesModal.style.display = 'none';
}

document.getElementById('addGradesButton').addEventListener('click', () => {
    updateStudentsList();
    openGradesModal(document.getElementById('moduleDropdown').value);
});

submitGradesButton.addEventListener('click', () => {
    const table = document.getElementById('gradesTableBody');
    const rows = table.querySelectorAll('tr');
    const allGrades = [];

    rows.forEach((row) => {
        const cells = row.querySelectorAll('td'); // Get all cells in the row

        const rowData = {
            regNo: cells[0].textContent,
            assessmentID: parseInt(document.getElementById('assessmentDropdown').value),
            score: parseInt(cells[3].querySelector('input').value), // Get the input value as a number
        };

        allGrades.push(rowData); // Add the row data to the array
    });

    fetch('http://localhost:3000/addGrades', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ grades:allGrades })
    })
    .then(res => res.json())
    .then(data => addGrades(data['data']));

    // Now, dataToSubmit contains the data for each row
    closeGradesModal();
});
// JavaScript to close the modal when the close button is clicked
document.getElementById('closeModal').addEventListener('click', function() {
    document.getElementById('addGradesModal').style.display = 'none';
});

document.addEventListener('DOMContentLoaded', () => {
    updateGradesList();
    updateClassesList(); 
});


function addGrades(data) {
    // Trigger a function to update the Grades list
    updateGradesList();  
}
function updateStudentsList() {
    // Fetch the updated data from the server
    const studentClass = document.getElementById('classDropdown').value;
    fetch(`http://localhost:3000/getSpecificStudents/${studentClass}`)
    .then((res) => res.json())
    .then((data) => {
        // Call the loadHTMLTable function to refresh the table with the updated data
        loadHTMLTable(data['data']);
    });
}

function loadHTMLTable(data) {
    const table = document.getElementById('gradesTableBody');
    console.log(data);
    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='4'>No Students Found</td></tr>";
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
            cell1.innerHTML = row.regNo;
            cell2.innerHTML = row.firstname;
            cell3.innerHTML = row.lastname;
            
            // Create an input element for cell 4
            const input = document.createElement('input');
            input.type = 'number';
            input.min = 0;
            input.max = 100;
            input.classList.add('custom-input');
            cell4.appendChild(input);
        });
    }
}

function loadHTMLGradesTable(data){
    const table = document.getElementById('gradesTableContent');
    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='7'>No Grades</td></tr>";
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
            cell1.innerHTML = row.gradeID;
            cell2.innerHTML = row.classCode;
            cell3.innerHTML = row.moduleCode;
            cell4.innerHTML = row.assessmentName;
            cell5.innerHTML = row.regNo;
            cell6.innerHTML = row.score;
            // Create edit and delete buttons with data attributes for easy access to row data
            cell7.innerHTML = `<button class="action edit" data-id="${row.gradeID}" regNo="${row.regNo}" moduleCode="${row.moduleCode}" score="${row.score}" assessmentName="${row.assessmentName}" student-class="${row.classCode}"><i class="fa fa-pencil" aria-hidden="true"></i></button>
                              <button class="action delete" data-id="${row.gradeID}" regNo="${row.regNo}"><i class="fa fa-trash" aria-hidden="true"></i></button>`;

        });

        // Add event listeners to the edit and delete buttons
        const editButtons = document.querySelectorAll('.action.edit');
        const deleteButtons = document.querySelectorAll('.action.delete');

         editButtons.forEach((button) => {
             button.addEventListener('click', editGrade);
         });

         deleteButtons.forEach((button) => {
             button.addEventListener('click', deleteGrade);
         });
    }
}

function loadHTMLClassListBox(data) {
    const select = document.getElementById('classDropdown'); // Get the select element

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
        option.textContent = row.classCode;

        // Append the option to the select
        select.appendChild(option);
    });

    select.addEventListener('change', updateModuleCode)
}

function updateModuleCode() {
    const assessmentDropdown = document.getElementById('assessmentDropdown');
    assessmentDropdown.innerHTML = '';
    const selectedClass = classDropdown.value;
    updateModulesList(selectedClass);
}

function loadHTMLModuleListBox(data) {
    const select = document.getElementById('moduleDropdown'); // Get the select element

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
        option.textContent = row.moduleCode;

        // Append the option to the select
        select.appendChild(option);
    });

    select.addEventListener('change', updateAssessments)
}

function updateAssessments() {
    const classDropdown = document.getElementById('classDropdown');
    const moduleDropdown = document.getElementById('moduleDropdown');
    const selectedClass = classDropdown.value;
    const selectedModule = moduleDropdown.value;
    updateAssessmentsList(selectedClass, selectedModule)
}

function loadHTMLAssessmentListBox(data) {
    const select = document.getElementById('assessmentDropdown'); // Get the select element

    // Reset the select options
    select.innerHTML = "<option value=''>Select an Assessment</option>";

    if (data.length === 0) {
        return; // No data to populate, so we're done
    }

    // Iterate through the data and add options to the select
    data.forEach((row) => {
        // Create an option element for the select
        const option = document.createElement('option');
        option.value = row.assessmentID;
        option.textContent = row.assessmentName;

        // Append the option to the select
        select.appendChild(option);
    });
}

function updateAssessmentsList(classCode, moduleCode) {
    // Fetch the updated data from the server
    fetch(`http://localhost:3000/getModuleAssessments/${classCode}/${moduleCode}`)
    .then((res) => res.json())
    .then((data) => {
        // Call the loadHTMLTable function to refresh the table with the updated data
        loadHTMLAssessmentListBox(data['data']);
    });
}

function updateModulesList(classCode) {
    // Fetch the updated data from the server
    fetch(`http://localhost:3000/getAssessmentModules/${classCode}`)
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

function updateGradesList() {
    // Fetch the updated data from the server
    fetch('http://localhost:3000/getGrades')
    .then((res) => res.json())
    .then((data) => {
        // Call the loadHTMLListBox function to refresh the table with the updated data
        loadHTMLGradesTable(data['data']);
    });
}

function editGrade(event) {
    // Retrieve data from the button's data attributes
    const gradeID = event.currentTarget.getAttribute('data-id');
    const moduleCode = event.currentTarget.getAttribute('moduleCode');
    const regNo = event.currentTarget.getAttribute('regNo');
    
    document.getElementById('editModuleCode').value = moduleCode;
    document.getElementById('editRegNo').value = regNo;

    // Show the edit modal
    const editStudentModal = document.getElementById('editGradeModal');
    editStudentModal.style.display = 'block';

    // Get the confirm button from the edit modal
    const confirmEditButton = document.getElementById('updateGradeButton');
    confirmEditButton.addEventListener('click', () => {

        fetch('http://localhost:3000/updateGrade', { 
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                },
            body: JSON.stringify({
                gradeID: gradeID,
                score : document.getElementById('editScore').value
            })
            
        })
        .then(res => res.json())
        .then(data => {
            if(data.success){
                location.reload();
            }
        })
        document.getElementById('editGradeModal').style.display = 'none';
    });

    // Get the cancel button from the edit modal
    const cancelEditButton = document.getElementById('discardGradeButton');
    cancelEditButton.addEventListener('click', () => {
        // Close the modal without performing any action
        document.getElementById('editGradeModal').style.display = 'none';
    });
}
 
// Delete button click handler
function deleteGrade(event) {
    const gradeID = event.currentTarget.getAttribute('data-id');
    const regNo = event.currentTarget.getAttribute('regNo');
    const deleteModal = document.getElementById('deleteModal');
    document.getElementById("deleteMessage").innerHTML = `Are you sure you want to delete grade for student ${regNo}`;
    deleteModal.style.display = 'block';

    const confirmDeleteButton = document.getElementById('confirmDelete');
    const cancelDeleteButton = document.getElementById('cancelDelete');

    confirmDeleteButton.addEventListener('click', () => {
        // Send a request to delete the row from the database
         fetch(`http://localhost:3000/deleteGrade/${gradeID}`, {
            method: 'DELETE'
         })
        .then(res => res.json())
        // Close the modal
        deleteModal.style.display = 'none';
        updateGradesList();
    });
    cancelDeleteButton.addEventListener('click', () => {
        // Close the modal without performing the delete action
        deleteModal.style.display = 'none';
    });
}


// MODAL
 