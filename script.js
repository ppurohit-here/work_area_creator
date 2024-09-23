// Get references to the inputs and table
const totalCountsInput = document.getElementById('totalCounts');
const totalUsersInput = document.getElementById('totalUsers');
const groupKeyInput = document.getElementById('groupKey');
const userBasedCheckbox = document.getElementById('userBased');
const taskBasedCheckbox = document.getElementById('taskBased');
const generateBtn = document.getElementById('generateBtn');
const workAreaTable = document.createElement('table'); // Create a new table element

// Maximum tasks per group when task-based allocation is selected
const MAX_TASKS_PER_AREA = 250;

// Initialize the table with a header
workAreaTable.innerHTML = '<tr><th>GrpKey</th><th>Count</th></tr>'; // Add header

// Event listener for button click
generateBtn.addEventListener('click', function() {
    // Clear previous results and reset the table with header
    workAreaTable.innerHTML = '<tr><th>GrpKey</th><th>Count</th></tr>'; 

    // Get the user inputs
    const totalCounts = parseInt(totalCountsInput.value);
    const totalUsers = parseInt(totalUsersInput.value);
    const groupKey = groupKeyInput.value.trim();
    const isUserBased = userBasedCheckbox.checked;
    const isTaskBased = taskBasedCheckbox.checked;

    // Validation checks
    if (isNaN(totalCounts) || (isUserBased && isNaN(totalUsers)) || groupKey === '') {
        alert('Please fill in all fields correctly.');
        return;
    }
    if (!isUserBased && !isTaskBased) {
        alert('Please select an allocation method (User-based or Task-based).');
        return;
    }

    // If user-based allocation is selected
    if (isUserBased) {
        // Calculate task allocation per user
        const tasksPerUser = Math.floor(totalCounts / totalUsers);
        let remainingTasks = totalCounts % totalUsers;

        // Assign tasks to each user
        for (let i = 1; i <= totalUsers; i++) {
            let currentTaskCount = tasksPerUser + (remainingTasks > 0 ? 1 : 0);
            remainingTasks--;

            // Create rows for current user's tasks
            for (let j = 0; j < currentTaskCount; j++) {
                const row = workAreaTable.insertRow(); // Insert a new row
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                cell1.textContent = `${groupKey} ${i}`; // Group key
                cell2.textContent = currentTaskCount; // Task count
            }
        }

    // If task-based allocation is selected
    } else if (isTaskBased) {
        let remainingTasks = totalCounts;
        let workAreaCount = 1; // Start with Work Area 1

        // Continue assigning tasks until all tasks are divided
        while (remainingTasks > 0) {
            // Assign either 250 tasks or remaining task count, whichever is smaller
            let currentTaskCount = Math.min(remainingTasks, MAX_TASKS_PER_AREA);

            // Create table rows with the groupKey repeated for currentTaskCount times
            for (let j = 0; j < currentTaskCount; j++) {
                const row = workAreaTable.insertRow(); // Insert a new row
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                cell1.textContent = `${groupKey} ${workAreaCount}`; // Group key
                cell2.textContent = currentTaskCount; // Task count
            }

            // Update remaining tasks and increment workAreaCount for the next set of tasks
            remainingTasks -= currentTaskCount;
            workAreaCount++;
        }
    }

    // Append the table to the result section
    document.getElementById('output-table').innerHTML = ''; // Clear previous content
    document.getElementById('output-table').appendChild(workAreaTable);
});

// Copy to clipboard functionality
document.getElementById('copyBtn').addEventListener('click', function() {
    const range = document.createRange();
    range.selectNode(workAreaTable);
    window.getSelection().removeAllRanges(); 
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges(); 
});
