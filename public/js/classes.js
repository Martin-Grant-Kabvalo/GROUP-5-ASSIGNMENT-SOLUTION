document.addEventListener('DOMContentLoaded', () => {
    updateClassesList();
});

const addClassButton = document.getElementById('addClassButton');
addClassButton.onclick = () =>{
    const classCode = document.getElementById('classCode').value;
    const className = document.getElementById('className').value;
    document.getElementById('classCode').value = "";
    document.getElementById('className').value = "";
    fetch('http://localhost:3000/addClass', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ classCode: classCode, className: className })
    })
    .then(res => res.json())
    .then(data => addClass(data['data']));
}

function loadHTMLTable(data) {
    const table = document.getElementById('classList');
    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='3'>No Classes</td></tr>";
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

            cell1.innerHTML = row.classCode;
            cell2.innerHTML = row.className;
            // Create edit and delete buttons with data attributes for easy access to row data
            cell3.innerHTML = `<button class="action edit" data-id="${row.classCode}" data-name="${row.className}"><i class="fa fa-pencil" aria-hidden="true"></i></button>
                              <button class="action delete" data-id="${row.classCode}"><i class="fa fa-trash" aria-hidden="true"></i></button>`;
        });

        // Add event listeners to the edit and delete buttons
        const editButtons = document.querySelectorAll('.action.edit');
        const deleteButtons = document.querySelectorAll('.action.delete');

         editButtons.forEach((button) => {
             button.addEventListener('click', editClass);
         });

         deleteButtons.forEach((button) => {
             button.addEventListener('click', deleteClass);
         });
    }
}

// Edit button click handler
function editClass(event) {
    const classCode = event.currentTarget.getAttribute('data-id');
    const className = event.currentTarget.getAttribute('data-name');

    document.getElementById('editClassCode').value = classCode;
    document.getElementById('editClassName').value = className;

    const updateButton = document.getElementById('updateClass');
    const discardButton = document.getElementById('discardEdit');

    const editModal = document.getElementById('editModal');
    editModal.style.display = 'block';

    updateButton.addEventListener('click', () => {
        // Handle the update logic here
        // You can send a request to update the class data and close the modal
        fetch('http://localhost:3000/updateClass', { 
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                },
            body: JSON.stringify({
                classCode: classCode,
                updatedClassName : document.getElementById('editClassName').value
            })
            
        })
        .then(res => res.json())
        .then(data => {
            if(data.success){
                location.reload();
            }
        })
        // Close the modal
        editModal.style.display = 'none';
    });


    discardButton.addEventListener('click', () => {
        const editModal = document.getElementById('editModal');
        editModal.style.display = 'none';
    });
    
} 

// Delete button click handler
function deleteClass(event) {
    const classCode = event.currentTarget.getAttribute('data-id');
    const deleteModal = document.getElementById('deleteModal');
    document.getElementById("deleteMessage").innerHTML = `Are you sure you want to delete the class ${classCode}`;
    deleteModal.style.display = 'block';

    const confirmDeleteButton = document.getElementById('confirmDelete');
    const cancelDeleteButton = document.getElementById('cancelDelete');

    confirmDeleteButton.addEventListener('click', () => {
        // Send a request to delete the row from the database
         fetch(`http://localhost:3000/deleteClass/${classCode}`, {
            method: 'DELETE'
         })
        .then(res => res.json())
        // Close the modal
        deleteModal.style.display = 'none';
        updateClassesList();
    });
    cancelDeleteButton.addEventListener('click', () => {
        // Close the modal without performing the delete action
        deleteModal.style.display = 'none';
        updateClassesList();
    });
}

function addClass(data) {
    // Trigger a function to update the classes list
    updateClassesList();  
}

function updateClassesList() {
    // Fetch the updated data from the server
    fetch('http://localhost:3000/getClasses')
    .then((res) => res.json())
    .then((data) => {
        // Call the loadHTMLTable function to refresh the table with the updated data
        loadHTMLTable(data['data']);
    });
}

// Inside the loadHTMLTable function, call it initially when loading the page
document.addEventListener('DOMContentLoaded', () => {
    updateClassesList();
});
