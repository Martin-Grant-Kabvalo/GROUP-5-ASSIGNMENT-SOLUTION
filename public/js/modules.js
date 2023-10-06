document.addEventListener('DOMContentLoaded', () => {
    updateModulesList();
    
});

const addModlueButton = document.getElementById('addModuleButton');
addModuleButton.onclick = () =>{
    const moduleCode = document.getElementById('moduleCode').value;
    const moduleName = document.getElementById('moduleName').value;
    document.getElementById('moduleCode').value = "";
    document.getElementById('moduleName').value = "";
    fetch('http://localhost:3000/addModule', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ moduleCode: moduleCode, moduleName: moduleName })
    })
    .then(res => res.json())
    .then(data => addModule(data['data']));
}

function loadHTMLTable(data) {
    const table = document.getElementById('moduleList');
    console.log(data);
    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='3'>No Modules</td></tr>";
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

            cell1.innerHTML = row.moduleCode;
            cell2.innerHTML = row.moduleName;
            // Create edit and delete buttons with data attributes for easy access to row data
            cell3.innerHTML = `<button class="action edit" data-id="${row.moduleCode}" data-name="${row.moduleName}"><i class="fa fa-pencil" aria-hidden="true"></i></button>
                              <button class="action delete" data-id="${row.moduleCode}"><i class="fa fa-trash" aria-hidden="true"></i></button>`;
        });

        // Add event listeners to the edit and delete buttons
        const editButtons = document.querySelectorAll('.action.edit');
        const deleteButtons = document.querySelectorAll('.action.delete');

         editButtons.forEach((button) => {
             button.addEventListener('click', editModule);
         });

         deleteButtons.forEach((button) => {
             button.addEventListener('click', deleteModule);
         });
    }
}

// Edit button click handler
function editModule(event) {
    const moduleCode = event.currentTarget.getAttribute('data-id');
    const moduleName = event.currentTarget.getAttribute('data-name');

    document.getElementById('editModuleCode').value = moduleCode;
    document.getElementById('editModuleName').value = moduleName;

    const updateButton = document.getElementById('updateModule');
    const discardButton = document.getElementById('discardEdit');

    const editModal = document.getElementById('editModal');
    editModal.style.display = 'block';

    updateButton.addEventListener('click', () => {
        // Handle the update logic here
        // You can send a request to update module data and close the modal
        fetch('http://localhost:3000/updateModule', { 
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                },
            body: JSON.stringify({
                moduleCode: moduleCode,
                updatedModuleName : document.getElementById('editModuleName').value
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
function deleteModule(event) {
    const moduleCode = event.currentTarget.getAttribute('data-id');
    const deleteModal = document.getElementById('deleteModal');
    document.getElementById("deleteMessage").innerHTML = `Are you sure you want to delete the module ${moduleCode}`;
    deleteModal.style.display = 'block';

    const confirmDeleteButton = document.getElementById('confirmDelete');
    const cancelDeleteButton = document.getElementById('cancelDelete');

    confirmDeleteButton.addEventListener('click', () => {
        // Send a request to delete the row from the database
         fetch(`http://localhost:3000/deleteModule/${moduleCode}`, {
            method: 'DELETE'
         })
        .then(res => res.json())
        // Close the modal
        deleteModal.style.display = 'none';
        updateModulesList();
    });
    cancelDeleteButton.addEventListener('click', () => {
        // Close the modal without performing the delete action
        deleteModal.style.display = 'none';
        updateModulesList();
    });
}

function addModule(data) {
    // Trigger a function to update the modules list
    updateModulesList();  
}

function updateModulesList() {
    // Fetch the updated data from the server
    fetch('http://localhost:3000/getModules')
    .then((res) => res.json())
    .then((data) => {
        // Call the loadHTMLTable function to refresh the table with the updated data
        loadHTMLTable(data['data']);
    });
}

// Inside the loadHTMLTable function, call it initially when loading the page
document.addEventListener('DOMContentLoaded', () => {
    updateModulesList();
});
