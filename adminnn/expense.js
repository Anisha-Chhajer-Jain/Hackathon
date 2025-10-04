// // script.js - Enhanced with new features

// let currentUser = null;
// let currentCompany = null;
// let users = [];
// let expenses = [];
// let approvalRules = [];

// // Initialize the application
// function init() {
//     loadFromLocalStorage();
//     showAuthSection();
    
//     // Set max date to today for expense date
//     const today = new Date().toISOString().split('T')[0];
//     if (document.getElementById('expense-date')) {
//         document.getElementById('expense-date').max = today;
//     }
    
//     // Add real-time preview for expense form
//     const expenseInputs = ['expense-amount', 'expense-currency', 'expense-category', 'expense-description', 'expense-date'];
//     expenseInputs.forEach(inputId => {
//         const element = document.getElementById(inputId);
//         if (element) {
//             element.addEventListener('input', updateExpensePreview);
//         }
//     });
// }

// // Enhanced Authentication
// function handleSignup() {
//     const email = document.getElementById('email').value;
//     const country = document.getElementById('country').value;
    
//     if (!email || !country) {
//         alert('Please enter email and select country');
//         return;
//     }
    
//     // Auto-create company and admin user
//     currentCompany = {
//         id: generateId(),
//         name: `${email.split('@')[0]}'s Company`,
//         country: country,
//         default_currency: getCurrencyForCountry(country),
//         created_at: new Date().toISOString()
//     };
    
//     currentUser = {
//         id: generateId(),
//         email: email,
//         role: 'ADMIN',
//         company_id: currentCompany.id,
//         is_manager_approver: true,
//         created_at: new Date().toISOString()
//     };
    
//     users = [currentUser];
//     expenses = [];
//     approvalRules = [];
    
//     saveToLocalStorage();
//     showAdminDashboard();
// }

// // Enhanced Admin Dashboard
// function showAdminDashboard() {
//     hideAllSections();
//     document.getElementById('admin-dashboard').classList.add('active');
//     document.getElementById('admin-email').textContent = currentUser.email;
//     document.getElementById('company-name').textContent = currentCompany.name;
//     document.getElementById('company-currency').textContent = currentCompany.default_currency;
    
//     updateAdminStats();
//     loadUsers();
//     loadRules();
//     loadAllExpenses();
// }

// function updateAdminStats() {
//     document.getElementById('total-users').textContent = users.length;
//     document.getElementById('total-expenses').textContent = expenses.length;
    
//     const pendingCount = expenses.filter(exp => exp.status === 'PENDING').length;
//     document.getElementById('pending-approvals-count').textContent = pendingCount;
// }

// // Enhanced User Management
// function showAddUserModal() {
//     const managerSelect = document.getElementById('new-user-manager');
//     managerSelect.innerHTML = '<option value="">No Manager</option>';
    
//     // Only show managers in the manager dropdown
//     users.filter(user => user.role === 'MANAGER').forEach(manager => {
//         const option = document.createElement('option');
//         option.value = manager.id;
//         option.textContent = `${manager.email} (Manager)`;
//         managerSelect.appendChild(option);
//     });
    
//     document.getElementById('add-user-modal').style.display = 'block';
// }

// function toggleManagerFields() {
//     const role = document.getElementById('new-user-role').value;
//     const managerApproverGroup = document.getElementById('manager-approver-group');
    
//     if (role === 'MANAGER') {
//         managerApproverGroup.style.display = 'block';
//     } else {
//         managerApproverGroup.style.display = 'none';
//         document.getElementById('is-manager-approver').checked = false;
//     }
// }

// function addUser() {
//     const email = document.getElementById('new-user-email').value;
//     const role = document.getElementById('new-user-role').value;
//     const managerId = document.getElementById('new-user-manager').value;
//     const isManagerApprover = document.getElementById('is-manager-approver').checked;
    
//     if (!email) {
//         alert('Please enter email');
//         return;
//     }
    
//     // Check if email already exists
//     if (users.find(user => user.email === email)) {
//         alert('User with this email already exists');
//         return;
//     }
    
//     const newUser = {
//         id: generateId(),
//         email: email,
//         role: role,
//         company_id: currentCompany.id,
//         manager_id: managerId || null,
//         is_manager_approver: isManagerApprover,
//         created_at: new Date().toISOString()
//     };
    
//     users.push(newUser);
//     saveToLocalStorage();
//     loadUsers();
//     updateAdminStats();
//     closeModal('add-user-modal');
    
//     // Reset form
//     document.getElementById('new-user-email').value = '';
//     document.getElementById('new-user-role').value = 'EMPLOYEE';
//     document.getElementById('new-user-manager').value = '';
//     document.getElementById('is-manager-approver').checked = false;
// }

// function loadUsers() {
//     const usersList = document.getElementById('users-list');
//     usersList.innerHTML = '';
    
//     const searchTerm = document.getElementById('user-search').value.toLowerCase();
//     const roleFilter = document.getElementById('role-filter').value;
    
//     let filteredUsers = users;
    
//     if (searchTerm) {
//         filteredUsers = filteredUsers.filter(user => 
//             user.email.toLowerCase().includes(searchTerm)
//         );
//     }
    
//     if (roleFilter) {
//         filteredUsers = filteredUsers.filter(user => user.role === roleFilter);
//     }
    
//     filteredUsers.forEach(user => {
//         const userCard = document.createElement('div');
//         userCard.className = `user-card ${user.role.toLowerCase()}`;
        
//         const manager = user.manager_id ? users.find(u => u.id === user.manager_id) : null;
        
//         userCard.innerHTML = `
//             <div class="user-header">
//                 <div class="user-email">${user.email}</div>
//                 <span class="user-role">${user.role}</span>
//             </div>
//             <div class="user-details">
//                 <div><strong>Joined:</strong> ${new Date(user.created_at).toLocaleDateString()}</div>
//                 <div><strong>Manager:</strong> ${manager ? manager.email : 'None'}</div>
//                 ${user.role === 'MANAGER' ? `<div><strong>Can Approve:</strong> ${user.is_manager_approver ? 'Yes' : 'No'}</div>` : ''}
//             </div>
//             <div class="user-actions">
//                 <button class="btn-warning" onclick="changeRole('${user.id}')">
//                     Change Role
//                 </button>
//                 <button class="btn-secondary" onclick="assignManager('${user.id}')">
//                     Assign Manager
//                 </button>
//                 ${user.id !== currentUser.id ? `
//                     <button class="btn-danger" onclick="deleteUser('${user.id}')">
//                         Delete
//                     </button>
//                 ` : ''}
//             </div>
//         `;
//         usersList.appendChild(userCard);
//     });
// }

// function filterUsers() {
//     loadUsers();
// }

// function changeRole(userId) {
//     const user = users.find(u => u.id === userId);
//     if (!user) return;
    
//     const newRole = user.role === 'EMPLOYEE' ? 'MANAGER' : 'EMPLOYEE';
//     user.role = newRole;
    
//     // If changing to employee, remove manager approver status
//     if (newRole === 'EMPLOYEE') {
//         user.is_manager_approver = false;
//     }
    
//     saveToLocalStorage();
//     loadUsers();
//     updateAdminStats();
// }

// function assignManager(userId) {
//     const user = users.find(u => u.id === userId);
//     if (!user) return;
    
//     const availableManagers = users.filter(u => 
//         u.role === 'MANAGER' && u.id !== userId
//     );
    
//     let managerOptions = '<option value="">No Manager</option>';
//     availableManagers.forEach(manager => {
//         const selected = user.manager_id === manager.id ? 'selected' : '';
//         managerOptions += `<option value="${manager.id}" ${selected}>${manager.email}</option>`;
//     });
    
//     const newManagerId = prompt(`Assign manager for ${user.email}:\n\n${managerOptions.replace(/<option/g, '\n<option')}`);
    
//     if (newManagerId !== null) {
//         user.manager_id = newManagerId || null;
//         saveToLocalStorage();
//         loadUsers();
//     }
// }

// function deleteUser(userId) {
//     if (userId === currentUser.id) {
//         alert('You cannot delete your own account');
//         return;
//     }
    
//     if (confirm('Are you sure you want to delete this user?')) {
//         users = users.filter(user => user.id !== userId);
        
//         // Also remove user from manager relationships
//         users.forEach(user => {
//             if (user.manager_id === userId) {
//                 user.manager_id = null;
//             }
//         });
        
//         saveToLocalStorage();
//         loadUsers();
//         updateAdminStats();
//     }
// }

// // Enhanced Expense Submission
// function updateExpensePreview() {
//     const amount = document.getElementById('expense-amount').value;
//     const currency = document.getElementById('expense-currency').value;
//     const category = document.getElementById('expense-category').value;
//     const description = document.getElementById('expense-description').value;
//     const date = document.getElementById('expense-date').value;
    
//     const preview = document.getElementById('expense-preview');
    
//     if (!amount && !category && !description && !date) {
//         preview.innerHTML = '<p>Fill the form to see preview</p>';
//         return;
//     }
    
//     let previewHTML = '';
    
//     if (amount && currency) {
//         const convertedAmount = convertCurrency(parseFloat(amount), currency, currentCompany.default_currency);
//         previewHTML += `
//             <div class="expense-amount-preview">
//                 <strong>Amount:</strong> ${parseFloat(amount).toFixed(2)} ${currency}
//                 <br><small>(${convertedAmount.toFixed(2)} ${currentCompany.default_currency})</small>
//             </div>
//         `;
//     }
    
//     if (category) {
//         previewHTML += `<div><strong>Category:</strong> ${category}</div>`;
//     }
    
//     if (description) {
//         previewHTML += `<div><strong>Description:</strong> ${description}</div>`;
//     }
    
//     if (date) {
//         previewHTML += `<div><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</div>`;
//     }
    
//     preview.innerHTML = previewHTML;
// }

// function submitExpense() {
//     const amount = parseFloat(document.getElementById('expense-amount').value);
//     const currency = document.getElementById('expense-currency').value;
//     const category = document.getElementById('expense-category').value;
//     const description = document.getElementById('expense-description').value;
//     const date = document.getElementById('expense-date').value;
    
//     if (!amount || !category || !description || !date) {
//         alert('Please fill all required fields');
//         return;
//     }
    
//     if (amount <= 0) {
//         alert('Amount must be greater than 0');
//         return;
//     }
    
//     const convertedAmount = convertCurrency(amount, currency, currentCompany.default_currency);
    
//     // const expense = {
//     //     id: generateId(),
//     //     employee_id:na,
//     // }
// }
// script.js - Complete Expense Reimbursement System

let currentUser = null;
let currentCompany = null;
let users = [];
let expenses = [];
let approvalRules = [];

// Initialize the application
function init() {
    loadFromLocalStorage();
    showAuthSection();
    
    // Set max date to today for expense date
    const today = new Date().toISOString().split('T')[0];
    if (document.getElementById('expense-date')) {
        document.getElementById('expense-date').max = today;
        document.getElementById('expense-date').value = today;
    }
    
    // Add real-time preview for expense form
    const expenseInputs = ['expense-amount', 'expense-currency', 'expense-category', 'expense-description', 'expense-date'];
    expenseInputs.forEach(inputId => {
        const element = document.getElementById(inputId);
        if (element) {
            element.addEventListener('input', updateExpensePreview);
        }
    });
}

// Authentication
function handleSignup() {
    const email = document.getElementById('email').value;
    const country = document.getElementById('country').value;
    
    if (!email || !country) {
        alert('Please enter email and select country');
        return;
    }
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        // Login existing user
        currentUser = existingUser;
        currentCompany = getCompanyById(existingUser.company_id);
        saveToLocalStorage();
        redirectToDashboard();
        return;
    }
    
    // Auto-create company and admin user for new signup
    currentCompany = {
        id: generateId(),
        name: `${email.split('@')[0]}'s Company`,
        country: country,
        default_currency: getCurrencyForCountry(country),
        created_at: new Date().toISOString()
    };
    
    currentUser = {
        id: generateId(),
        email: email,
        role: 'ADMIN',
        company_id: currentCompany.id,
        is_manager_approver: true,
        created_at: new Date().toISOString()
    };
    
    users = [currentUser];
    expenses = [];
    approvalRules = [];
    
    saveToLocalStorage();
    redirectToDashboard();
}

function redirectToDashboard() {
    switch(currentUser.role) {
        case 'ADMIN':
            showAdminDashboard();
            break;
        case 'MANAGER':
            showManagerDashboard();
            break;
        case 'EMPLOYEE':
            showEmployeeDashboard();
            break;
    }
}

function logout() {
    currentUser = null;
    showAuthSection();
    
    // Clear form fields on logout
    document.getElementById('email').value = '';
    document.getElementById('country').value = '';
}

// Dashboard Navigation
function showAuthSection() {
    hideAllSections();
    document.getElementById('auth-section').classList.add('active');
}

function showAdminDashboard() {
    hideAllSections();
    document.getElementById('admin-dashboard').classList.add('active');
    document.getElementById('admin-email').textContent = currentUser.email;
    document.getElementById('company-name').textContent = currentCompany.name;
    document.getElementById('company-currency').textContent = currentCompany.default_currency;
    
    updateAdminStats();
    loadUsers();
    loadRules();
    loadAllExpenses();
}

function showEmployeeDashboard() {
    hideAllSections();
    document.getElementById('employee-dashboard').classList.add('active');
    document.getElementById('employee-email').textContent = currentUser.email;
    
    updateEmployeeStats();
    loadEmployeeExpenses();
    loadExpenseHistory();
}

function showManagerDashboard() {
    hideAllSections();
    document.getElementById('manager-dashboard').classList.add('active');
    document.getElementById('manager-email').textContent = currentUser.email;
    
    updateManagerStats();
    loadPendingApprovals();
    loadTeamExpenses();
}

function hideAllSections() {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
}

// Tab Management
function openTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

function openEmpTab(tabName) {
    document.querySelectorAll('#employee-dashboard .tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('#employee-dashboard .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

function openMgrTab(tabName) {
    document.querySelectorAll('#manager-dashboard .tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('#manager-dashboard .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

// Stats Management
function updateAdminStats() {
    document.getElementById('total-users').textContent = users.length;
    document.getElementById('total-expenses').textContent = expenses.length;
    
    const pendingCount = expenses.filter(exp => exp.status === 'PENDING').length;
    document.getElementById('pending-approvals-count').textContent = pendingCount;
}

function updateEmployeeStats() {
    const myExpenses = expenses.filter(exp => exp.employee_id === currentUser.id);
    const submitted = myExpenses.length;
    const approved = myExpenses.filter(exp => exp.status === 'APPROVED').length;
    const rejected = myExpenses.filter(exp => exp.status === 'REJECTED').length;
    const pending = myExpenses.filter(exp => exp.status === 'PENDING').length;
    
    document.getElementById('my-submitted-expenses').textContent = submitted;
    document.getElementById('my-approved-expenses').textContent = approved;
    document.getElementById('my-rejected-expenses').textContent = rejected;
    document.getElementById('my-pending-expenses').textContent = pending;
    
    // Update monthly total
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyExpenses = myExpenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear && exp.status === 'APPROVED';
    });
    
    const monthlyTotal = monthlyExpenses.reduce((sum, exp) => sum + exp.converted_amount, 0);
    document.getElementById('monthly-total').textContent = formatCurrency(monthlyTotal, currentCompany.default_currency);
    
    // Update average expense
    const average = submitted > 0 ? monthlyExpenses.reduce((sum, exp) => sum + exp.converted_amount, 0) / monthlyExpenses.length : 0;
    document.getElementById('average-expense').textContent = formatCurrency(average, currentCompany.default_currency);
}

function updateManagerStats() {
    const teamMembers = users.filter(user => user.manager_id === currentUser.id);
    const teamExpenses = expenses.filter(exp => teamMembers.some(member => member.id === exp.employee_id));
    const pendingApprovals = expenses.filter(exp => exp.current_approver_id === currentUser.id && exp.status === 'PENDING');
    
    document.getElementById('team-members-count').textContent = teamMembers.length;
    document.getElementById('team-total-expenses').textContent = teamExpenses.length;
    document.getElementById('team-pending-approvals').textContent = pendingApprovals.length;
}

// User Management
function showAddUserModal() {
    const managerSelect = document.getElementById('new-user-manager');
    managerSelect.innerHTML = '<option value="">No Manager</option>';
    
    // Only show managers in the manager dropdown
    users.filter(user => user.role === 'MANAGER').forEach(manager => {
        const option = document.createElement('option');
        option.value = manager.id;
        option.textContent = `${manager.email} (Manager)`;
        managerSelect.appendChild(option);
    });
    
    document.getElementById('add-user-modal').style.display = 'block';
}

function toggleManagerFields() {
    const role = document.getElementById('new-user-role').value;
    const managerApproverGroup = document.getElementById('manager-approver-group');
    
    if (role === 'MANAGER') {
        managerApproverGroup.style.display = 'block';
    } else {
        managerApproverGroup.style.display = 'none';
        document.getElementById('is-manager-approver').checked = false;
    }
}

function addUser() {
    const email = document.getElementById('new-user-email').value;
    const role = document.getElementById('new-user-role').value;
    const managerId = document.getElementById('new-user-manager').value;
    const isManagerApprover = document.getElementById('is-manager-approver').checked;
    
    if (!email) {
        alert('Please enter email');
        return;
    }
    
    // Check if email already exists
    if (users.find(user => user.email === email)) {
        alert('User with this email already exists');
        return;
    }
    
    const newUser = {
        id: generateId(),
        email: email,
        role: role,
        company_id: currentCompany.id,
        manager_id: managerId || null,
        is_manager_approver: role === 'MANAGER' ? isManagerApprover : false,
        created_at: new Date().toISOString()
    };
    
    users.push(newUser);
    saveToLocalStorage();
    loadUsers();
    updateAdminStats();
    closeModal('add-user-modal');
    
    // Reset form
    document.getElementById('new-user-email').value = '';
    document.getElementById('new-user-role').value = 'EMPLOYEE';
    document.getElementById('new-user-manager').value = '';
    document.getElementById('is-manager-approver').checked = false;
}

function loadUsers() {
    const usersList = document.getElementById('users-list');
    usersList.innerHTML = '';
    
    const searchTerm = document.getElementById('user-search').value.toLowerCase();
    const roleFilter = document.getElementById('role-filter').value;
    
    let filteredUsers = users;
    
    if (searchTerm) {
        filteredUsers = filteredUsers.filter(user => 
            user.email.toLowerCase().includes(searchTerm)
        );
    }
    
    if (roleFilter) {
        filteredUsers = filteredUsers.filter(user => user.role === roleFilter);
    }
    
    filteredUsers.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = `user-card ${user.role.toLowerCase()}`;
        
        const manager = user.manager_id ? users.find(u => u.id === user.manager_id) : null;
        
        userCard.innerHTML = `
            <div class="user-header">
                <div class="user-email">${user.email}</div>
                <span class="user-role">${user.role}</span>
            </div>
            <div class="user-details">
                <div><strong>Joined:</strong> ${new Date(user.created_at).toLocaleDateString()}</div>
                <div><strong>Manager:</strong> ${manager ? manager.email : 'None'}</div>
                ${user.role === 'MANAGER' ? `<div><strong>Can Approve:</strong> ${user.is_manager_approver ? 'Yes' : 'No'}</div>` : ''}
            </div>
            <div class="user-actions">
                <button class="btn-warning" onclick="changeRole('${user.id}')">
                    Change Role
                </button>
                <button class="btn-secondary" onclick="assignManager('${user.id}')">
                    Assign Manager
                </button>
                ${user.id !== currentUser.id ? `
                    <button class="btn-danger" onclick="deleteUser('${user.id}')">
                        Delete
                    </button>
                ` : ''}
            </div>
        `;
        usersList.appendChild(userCard);
    });
}

function filterUsers() {
    loadUsers();
}

function changeRole(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const newRole = user.role === 'EMPLOYEE' ? 'MANAGER' : 'EMPLOYEE';
    user.role = newRole;
    
    // If changing to employee, remove manager approver status and manager relationships
    if (newRole === 'EMPLOYEE') {
        user.is_manager_approver = false;
        user.manager_id = null;
    }
    
    saveToLocalStorage();
    loadUsers();
    updateAdminStats();
}

function assignManager(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const availableManagers = users.filter(u => 
        u.role === 'MANAGER' && u.id !== userId && u.id !== currentUser.id
    );
    
    let managerOptions = '<option value="">No Manager</option>';
    availableManagers.forEach(manager => {
        const selected = user.manager_id === manager.id ? 'selected' : '';
        managerOptions += `<option value="${manager.id}" ${selected}>${manager.email}</option>`;
    });
    
    const managerSelection = prompt(`Assign manager for ${user.email}:\n\nSelect manager ID:\n${managerOptions.replace(/<option value="([^"]*)"([^>]*)>([^<]*)<\/option>/g, '$1: $3\n')}`);
    
    if (managerSelection !== null) {
        user.manager_id = managerSelection || null;
        saveToLocalStorage();
        loadUsers();
    }
}

function deleteUser(userId) {
    if (userId === currentUser.id) {
        alert('You cannot delete your own account');
        return;
    }
    
    if (confirm('Are you sure you want to delete this user?')) {
        users = users.filter(user => user.id !== userId);
        
        // Also remove user from manager relationships
        users.forEach(user => {
            if (user.manager_id === userId) {
                user.manager_id = null;
            }
        });
        
        // Remove user's expenses
        expenses = expenses.filter(exp => exp.employee_id !== userId);
        
        saveToLocalStorage();
        loadUsers();
        updateAdminStats();
    }
}

// Expense Management
function updateExpensePreview() {
    const amount = document.getElementById('expense-amount').value;
    const currency = document.getElementById('expense-currency').value;
    const category = document.getElementById('expense-category').value;
    const description = document.getElementById('expense-description').value;
    const date = document.getElementById('expense-date').value;
    
    const preview = document.getElementById('expense-preview');
    
    if (!amount && !category && !description && !date) {
        preview.innerHTML = '<p>Fill the form to see preview</p>';
        return;
    }
    
    let previewHTML = '';
    
    if (amount && currency) {
        const convertedAmount = convertCurrency(parseFloat(amount), currency, currentCompany.default_currency);
        previewHTML += `
            <div class="expense-amount-preview">
                <strong>Amount:</strong> ${parseFloat(amount).toFixed(2)} ${currency}
                <br><small>(${convertedAmount.toFixed(2)} ${currentCompany.default_currency})</small>
            </div>
        `;
    }
    
    if (category) {
        previewHTML += `<div><strong>Category:</strong> ${category}</div>`;
    }
    
    if (description) {
        previewHTML += `<div><strong>Description:</strong> ${description}</div>`;
    }
    
    if (date) {
        previewHTML += `<div><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</div>`;
    }
    
    preview.innerHTML = previewHTML;
}

function submitExpense() {
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const currency = document.getElementById('expense-currency').value;
    const category = document.getElementById('expense-category').value;
    const description = document.getElementById('expense-description').value;
    const date = document.getElementById('expense-date').value;
    
    if (!amount || !category || !description || !date) {
        alert('Please fill all required fields');
        return;
    }
    
    if (amount <= 0) {
        alert('Amount must be greater than 0');
        return;
    }
    
    const convertedAmount = convertCurrency(amount, currency, currentCompany.default_currency);
    
    const expense = {
        id: generateId(),
        employee_id: currentUser.id,
        amount: amount,
        currency: currency,
        converted_amount: convertedAmount,
        category: category,
        description: description,
        date: date,
        status: 'PENDING',
        approval_flow: [],
        current_approver_id: null,
        created_at: new Date().toISOString()
    };
    
    // Initialize approval workflow
    initiateApprovalWorkflow(expense);
    
    expenses.push(expense);
    saveToLocalStorage();
    
    // Clear form
    document.getElementById('expense-amount').value = '';
    document.getElementById('expense-category').value = '';
    document.getElementById('expense-description').value = '';
    document.getElementById('expense-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('expense-preview').innerHTML = '<p>Fill the form to see preview</p>';
    
    alert('Expense submitted successfully!');
    updateEmployeeStats();
    loadEmployeeExpenses();
}

function loadEmployeeExpenses() {
    const expensesList = document.getElementById('employee-expenses-list');
    expensesList.innerHTML = '';
    
    const statusFilter = document.getElementById('my-expense-status-filter').value;
    let userExpenses = expenses.filter(exp => exp.employee_id === currentUser.id);
    
    if (statusFilter) {
        userExpenses = userExpenses.filter(exp => exp.status === statusFilter);
    }
    
    // Sort by creation date, newest first
    userExpenses.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    userExpenses.forEach(expense => {
        expensesList.appendChild(createExpenseCard(expense));
    });
}

function loadExpenseHistory() {
    const historyList = document.getElementById('expense-history-list');
    historyList.innerHTML = '';
    
    const userExpenses = expenses.filter(exp => exp.employee_id === currentUser.id);
    
    // Sort by creation date, newest first
    userExpenses.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    userExpenses.forEach(expense => {
        historyList.appendChild(createExpenseCard(expense));
    });
}

function loadAllExpenses() {
    const expensesList = document.getElementById('all-expenses-list');
    expensesList.innerHTML = '';
    
    const statusFilter = document.getElementById('expense-status-filter').value;
    const categoryFilter = document.getElementById('expense-category-filter').value;
    
    let filteredExpenses = expenses;
    
    if (statusFilter) {
        filteredExpenses = filteredExpenses.filter(exp => exp.status === statusFilter);
    }
    
    if (categoryFilter) {
        filteredExpenses = filteredExpenses.filter(exp => exp.category === categoryFilter);
    }
    
    // Sort by creation date, newest first
    filteredExpenses.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    filteredExpenses.forEach(expense => {
        expensesList.appendChild(createExpenseCard(expense, true));
    });
}

function filterAllExpenses() {
    loadAllExpenses();
}

function filterMyExpenses() {
    loadEmployeeExpenses();
}

function createExpenseCard(expense, showEmployee = false) {
    const card = document.createElement('div');
    card.className = `expense-card ${expense.status.toLowerCase()}`;
    
    const employee = users.find(user => user.id === expense.employee_id);
    
    card.innerHTML = `
        <div class="expense-header">
            <div class="expense-title">
                <h4>${expense.description}</h4>
                ${showEmployee ? `<div class="expense-employee">Submitted by: ${employee.email}</div>` : ''}
            </div>
            <div class="expense-amount">
                <div class="original">${expense.amount} ${expense.currency}</div>
                <div class="converted">${expense.converted_amount} ${currentCompany.default_currency}</div>
            </div>
        </div>
        <div class="expense-details">
            <div class="expense-detail-item">
                <span>Category:</span>
                <span>${expense.category}</span>
            </div>
            <div class="expense-detail-item">
                <span>Date:</span>
                <span>${new Date(expense.date).toLocaleDateString()}</span>
            </div>
            <div class="expense-detail-item">
                <span>Submitted:</span>
                <span>${new Date(expense.created_at).toLocaleDateString()}</span>
            </div>
            <div class="expense-detail-item">
                <span>Status:</span>
                <span class="expense-status status-${expense.status.toLowerCase()}">${expense.status}</span>
            </div>
        </div>
        <div class="expense-actions">
            ${expense.approval_flow.length > 0 ? `
                <button class="btn-secondary" onclick="showApprovalHistory('${expense.id}')">
                    View History
                </button>
            ` : ''}
            ${currentUser.role === 'ADMIN' ? `
                <button class="btn-warning" onclick="adminOverride('${expense.id}')">
                    Override
                </button>
            ` : ''}
        </div>
    `;
    
    return card;
}

// Approval Workflow
function initiateApprovalWorkflow(expense) {
    const employee = users.find(user => user.id === expense.employee_id);
    
    // Start with manager approval if configured
    if (employee.manager_id) {
        const manager = users.find(user => user.id === employee.manager_id);
        if (manager && manager.is_manager_approver) {
            expense.current_approver_id = manager.id;
            expense.approval_flow.push({
                approver_id: manager.id,
                sequence: 1,
                status: 'PENDING',
                acted_at: null,
                comments: ''
            });
            return;
        }
    }
    
    // If no manager approval needed, auto-approve for demo
    expense.status = 'APPROVED';
    expense.approval_flow.push({
        approver_id: currentUser.id,
        sequence: 1,
        status: 'APPROVED',
        acted_at: new Date().toISOString(),
        comments: 'Auto-approved (no approval workflow configured)'
    });
}

// Manager Functions
function loadPendingApprovals() {
    const approvalsList = document.getElementById('pending-approvals-list');
    approvalsList.innerHTML = '';
    
    const pendingExpenses = expenses.filter(exp => 
        exp.status === 'PENDING' && 
        exp.current_approver_id === currentUser.id
    );
    
    pendingExpenses.forEach(expense => {
        const card = createExpenseCard(expense, true);
        const approveBtn = document.createElement('button');
        approveBtn.className = 'btn-success';
        approveBtn.textContent = 'Review';
        approveBtn.onclick = () => showApprovalModal(expense.id);
        
        card.querySelector('.expense-actions').appendChild(approveBtn);
        approvalsList.appendChild(card);
    });
}

function loadTeamExpenses() {
    const expensesList = document.getElementById('team-expenses-list');
    expensesList.innerHTML = '';
    
    const teamUserIds = users
        .filter(user => user.manager_id === currentUser.id)
        .map(user => user.id);
    
    const teamExpenses = expenses.filter(exp => teamUserIds.includes(exp.employee_id));
    
    teamExpenses.forEach(expense => {
        expensesList.appendChild(createExpenseCard(expense, true));
    });
}

function showApprovalModal(expenseId) {
    const expense = expenses.find(exp => exp.id === expenseId);
    if (!expense) return;
    
    const employee = users.find(user => user.id === expense.employee_id);
    
    document.getElementById('approval-expense-details').innerHTML = `
        <div class="expense-card">
            <div class="expense-header">
                <div>
                    <h4>${expense.description}</h4>
                    <p>Submitted by: ${employee.email}</p>
                </div>
                <div class="expense-amount">
                    ${expense.amount} ${expense.currency}
                    <div>(${expense.converted_amount} ${currentCompany.default_currency})</div>
                </div>
            </div>
            <div class="expense-details">
                <p><strong>Category:</strong> ${expense.category}</p>
                <p><strong>Date:</strong> ${expense.date}</p>
                <p><strong>Submitted:</strong> ${new Date(expense.created_at).toLocaleDateString()}</p>
            </div>
        </div>
    `;
    
    document.getElementById('approval-modal').style.display = 'block';
    document.getElementById('approval-modal').dataset.expenseId = expenseId;
}

function handleApproval(decision) {
    const expenseId = document.getElementById('approval-modal').dataset.expenseId;
    const comments = document.getElementById('approval-comments').value;
    
    const expense = expenses.find(exp => exp.id === expenseId);
    if (!expense) return;
    
    // Update current approval step
    const currentStep = expense.approval_flow.find(step => step.status === 'PENDING');
    if (currentStep) {
        currentStep.status = decision;
        currentStep.comments = comments;
        currentStep.acted_at = new Date().toISOString();
    }
    
    if (decision === 'APPROVE') {
        // Check if there are more approvers
        const nextStep = expense.approval_flow.find(step => step.status === 'PENDING');
        if (nextStep) {
            expense.current_approver_id = nextStep.approver_id;
        } else {
            expense.status = 'APPROVED';
            expense.current_approver_id = null;
        }
    } else {
        expense.status = 'REJECTED';
        expense.current_approver_id = null;
    }
    
    saveToLocalStorage();
    closeModal('approval-modal');
    
    if (currentUser.role === 'MANAGER') {
        loadPendingApprovals();
        updateManagerStats();
    }
    
    alert(`Expense ${decision.toLowerCase()}d successfully!`);
}

function showApprovalHistory(expenseId) {
    const expense = expenses.find(exp => exp.id === expenseId);
    if (!expense) return;
    
    let history = 'Approval History:\n\n';
    expense.approval_flow.forEach(step => {
        const approver = users.find(user => user.id === step.approver_id);
        history += `Approver: ${approver.email}\n`;
        history += `Decision: ${step.status}\n`;
        if (step.comments) history += `Comments: ${step.comments}\n`;
        history += `Date: ${step.acted_at ? new Date(step.acted_at).toLocaleString() : 'Pending'}\n\n`;
    });
    
    alert(history);
}

// Admin Override
function adminOverride(expenseId) {
    const expense = expenses.find(exp => exp.id === expenseId);
    if (!expense) return;
    
    const newStatus = prompt(`Override expense status for: ${expense.description}\n\nCurrent status: ${expense.status}\nEnter new status (APPROVED/REJECTED):`);
    
    if (newStatus && ['APPROVED', 'REJECTED'].includes(newStatus.toUpperCase())) {
        expense.status = newStatus.toUpperCase();
        expense.approval_flow.push({
            approver_id: currentUser.id,
            sequence: expense.approval_flow.length + 1,
            status: newStatus.toUpperCase(),
            acted_at: new Date().toISOString(),
            comments: 'Admin override'
        });
        saveToLocalStorage();
        loadAllExpenses();
        alert('Expense status updated!');
    }
}

// Approval Rules
function showAddRuleModal() {
    document.getElementById('add-rule-modal').style.display = 'block';
}

function addRule() {
    const name = document.getElementById('rule-name').value;
    const condition = document.getElementById('rule-condition').value;
    const threshold = parseFloat(document.getElementById('threshold-amount').value);
    const flowType = document.getElementById('approval-flow-type').value;
    
    if (!name) {
        alert('Please enter rule name');
        return;
    }
    
    const rule = {
        id: generateId(),
        company_id: currentCompany.id,
        name: name,
        condition_type: condition,
        threshold_amount: threshold,
        approval_flow_type: flowType,
        created_at: new Date().toISOString()
    };
    
    approvalRules.push(rule);
    saveToLocalStorage();
    loadRules();
    closeModal('add-rule-modal');
    
    // Reset form
    document.getElementById('rule-name').value = '';
    document.getElementById('threshold-amount').value = '';
}

function loadRules() {
    const rulesList = document.getElementById('rules-list');
    rulesList.innerHTML = '';
    
    approvalRules.forEach(rule => {
        const ruleCard = document.createElement('div');
        ruleCard.className = 'card';
        ruleCard.innerHTML = `
            <h4>${rule.name}</h4>
            <p><strong>Condition:</strong> ${rule.condition_type}</p>
            <p><strong>Threshold:</strong> ${rule.threshold_amount || 'N/A'}</p>
            <p><strong>Flow Type:</strong> ${rule.approval_flow_type}</p>
            <div class="expense-actions">
                <button class="btn-danger" onclick="deleteRule('${rule.id}')">Delete</button>
            </div>
        `;
        rulesList.appendChild(ruleCard);
    });
}

function deleteRule(ruleId) {
    if (confirm('Are you sure you want to delete this rule?')) {
        approvalRules = approvalRules.filter(rule => rule.id !== ruleId);
        saveToLocalStorage();
        loadRules();
    }
}

// Export Functionality
function exportMyExpenses() {
    const myExpenses = expenses.filter(exp => exp.employee_id === currentUser.id);
    
    let csvContent = "Date,Description,Category,Amount,Currency,Converted Amount,Status\n";
    
    myExpenses.forEach(expense => {
        const row = [
            expense.date,
            `"${expense.description}"`,
            expense.category,
            expense.amount,
            expense.currency,
            expense.converted_amount,
            expense.status
        ].join(',');
        csvContent += row + '\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'my_expenses.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    alert('Expense report exported successfully!');
}

// Utility Functions
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function getCompanyById(companyId) {
    // In a real app, this would fetch from database
    return currentCompany;
}

function convertCurrency(amount, fromCurrency, toCurrency) {
    // Simplified conversion rates for demo
    const rates = {
        USD: { EUR: 0.85, GBP: 0.73, INR: 83.0, CAD: 1.35, AUD: 1.52, JPY: 150.0 },
        EUR: { USD: 1.18, GBP: 0.86, INR: 97.5, CAD: 1.47, AUD: 1.65, JPY: 160.0 },
        GBP: { USD: 1.37, EUR: 1.16, INR: 113.5, CAD: 1.65, AUD: 1.85, JPY: 175.0 },
        INR: { USD: 0.012, EUR: 0.010, GBP: 0.0088, CAD: 0.016, AUD: 0.018, JPY: 1.80 },
        CAD: { USD: 0.74, EUR: 0.68, GBP: 0.61, INR: 62.5, AUD: 1.12, JPY: 111.0 },
        AUD: { USD: 0.66, EUR: 0.61, GBP: 0.54, INR: 55.5, CAD: 0.89, JPY: 98.5 },
        JPY: { USD: 0.0067, EUR: 0.0063, GBP: 0.0057, INR: 0.56, CAD: 0.0090, AUD: 0.010 }
    };
    
    if (fromCurrency === toCurrency) return amount;
    return parseFloat((amount * (rates[fromCurrency]?.[toCurrency] || 1)).toFixed(2));
}

function getCurrencyForCountry(country) {
    const currencies = {
        'US': 'USD',
        'UK': 'GBP',
        'EU': 'EUR',
        'IN': 'INR',
        'CA': 'CAD',
        'AU': 'AUD',
        'JP': 'JPY'
    };
    return currencies[country] || 'USD';
}

function formatCurrency(amount, currency) {
    const symbols = {
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'INR': '₹',
        'CAD': 'C$',
        'AUD': 'A$',
        'JPY': '¥'
    };
    
    return `${symbols[currency] || ''}${amount.toFixed(2)}`;
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Local Storage Management
function saveToLocalStorage() {
    localStorage.setItem('expenseUsers', JSON.stringify(users));
    localStorage.setItem('expenseCompany', JSON.stringify(currentCompany));
    localStorage.setItem('expenseExpenses', JSON.stringify(expenses));
    localStorage.setItem('expenseRules', JSON.stringify(approvalRules));
    if (currentUser) {
        localStorage.setItem('expenseCurrentUser', JSON.stringify(currentUser));
    }
}

function loadFromLocalStorage() {
    try {
        users = JSON.parse(localStorage.getItem('expenseUsers') || '[]');
        currentCompany = JSON.parse(localStorage.getItem('expenseCompany') || 'null');
        expenses = JSON.parse(localStorage.getItem('expenseExpenses') || '[]');
        approvalRules = JSON.parse(localStorage.getItem('expenseRules') || '[]');
        currentUser = JSON.parse(localStorage.getItem('expenseCurrentUser') || 'null');
        
        if (currentUser && currentCompany) {
            redirectToDashboard();
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        // Reset data if corrupted
        users = [];
        expenses = [];
        approvalRules = [];
        currentUser = null;
        currentCompany = null;
    }
}

// Initialize the application when page loads
window.onload = init;