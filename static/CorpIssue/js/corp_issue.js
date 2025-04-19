// -------------------- corp_list.js --------------------

// Function to toggle the create version button state
function toggleCreateButton() {
    const select = $('#version-select');
    const button = $('#create-version-btn');
    if (select.val() === "") {
        button.prop('disabled', true);
        button.css('background-color', '#ccc'); // Gray color
    } else {
        button.prop('disabled', false);
        button.css('background-color', '#007bff'); // Blue color
    }
}

// Initial call to set the button state based on the default selection
$(document).ready(function() {
    toggleCreateButton();
});

// -------------------- InvoiceTask_form.js --------------------

// Function to approve a task
function approveTask(taskId) {
    const remainingUnapprovedTasks = document.querySelectorAll('tr[data-task-id] td:nth-child(8) .status-pill:not(.status-approved)').length;
    const taskRow = document.querySelector(`tr[data-task-id="${taskId}"]`);
    const status = taskRow.querySelector('td:nth-child(8)').textContent.trim();

    if (status === 'رد شده توسط مشتری') {
        showResponseModal(taskId);
        return;
    }
    
    const executeApproval = () => {
        $.ajax({
            url: `/SalesManagement/CorpIssue/approve_task/${taskId}/`,
            type: 'POST',
            headers: {
                'X-CSRFToken': csrfToken
            },
            contentType: 'application/json',
            success: function(data) {
                if (data.success) {
                    location.reload();
                } else {
                    alert('Error approving task: ' + data.error);
                }
            }
        });
    };

    // If this is the last unapproved task (only 1 remaining), show the modal
    if (remainingUnapprovedTasks === 1) {
        showSendToSalesManagerModal(executeApproval);
    } else {
        executeApproval();
    }
}


// Function to show the rejection modal
function showRejectionModal(taskId) {
    const button = document.querySelector(`tr[data-task-id="${taskId}"] .reject-btn`);
    const icon = button.querySelector('.reject-icon');
    icon.src = icon.dataset.selected;
    button.classList.add('selected');
    
    $('#rejection-task-id').val(taskId);
    $('#rejection-modal').css('display', 'block');
}

// Function to close the rejection modal
function closeRejectionModal() {
    $('#rejection-modal').css('display', 'none');
}

// Function to submit the rejection form
function submitRejectionForm(event) {
    event.preventDefault();
    const taskId = $('#rejection-task-id').val();
    const reasonId = $('#rejection-reason').val();
    const explanation = $('#rejection-explanation').val();

    $.ajax({
        url: `/SalesManagement/CorpIssue/reject_task/${taskId}/`,
        type: 'POST',
        headers: {
            'X-CSRFToken': csrfToken
        },
        contentType: 'application/json',
        data: JSON.stringify({
            reason_id: reasonId,
            explanation: explanation
        }),
        success: function(data) {
            if (data.success) {
                location.reload();
            } else {
                alert('Error rejecting task: ' + data.error);
            }
        }
    });
}

// Function to show the rejection details modal
function showRejectionDetails(taskId) {
    $.ajax({
        url: `/SalesManagement/CorpIssue/rejection_details/${taskId}/`,
        type: 'GET',
        success: function(data) {
            if (data.success) {
                $('#rejection-details-title').text(data.rejection_title);
                $('#rejection-details-explanation').text(data.rejection_explanation);
                $('#rejection-details-modal').css('display', 'block');
            } else {
                alert('Error fetching rejection details: ' + data.error);
            }
        }
    });
}

// Function to close the rejection details modal
function closeRejectionDetailsModal() {
    $('#rejection-details-modal').css('display', 'none');
}

// Function to show the filter modal
function showFilterModal() {
    $('#filter-modal').css('display', 'block');
}

// Function to close the filter modal
function closeFilterModal() {
    $('#filter-modal').css('display', 'none');
}

// Function to toggle the display of subtasks
function toggleSubTasks(taskId) {
    const realWorkHoursCell = $(`#sub-tasks-${taskId}`).closest('.real-work-hours');
    const subTasksContainer = $(`#sub-tasks-${taskId}`);
    
    if (subTasksContainer.hasClass('expanded')) {
        // Collapse
        subTasksContainer.removeClass('expanded');
        setTimeout(() => {
            subTasksContainer.empty();
        }, 300); // Wait for animation to complete
    } else {
        // Expand
        $.ajax({
            url: `/SalesManagement/CorpIssue/sub_tasks/${taskId}/`,
            type: 'GET',
            success: function(data) {
                if (data.success) {
                    subTasksContainer.empty();
                    
                    if (data.sub_tasks.length > 0) {
                        data.sub_tasks.forEach((subTask, index) => {
                            // Remove the task kind mapping and use the value directly from backend
                            const taskKind = subTask.task_kind;
                            const delay = index * 100; // Stagger the animations
                            const subTaskElement = $(`<div class="sub-task" style="animation-delay: ${delay}ms">
                                ${taskKind}: ${subTask.real_work_hours} ساعت
                            </div>`);
                            subTasksContainer.append(subTaskElement);
                        });
                    } else {
                        subTasksContainer.append('<div class="sub-task">این تسک ریز تسک اعلامی ندارد</div>');
                    }
                    
                    // Trigger reflow before adding expanded class
                    subTasksContainer[0].offsetHeight;
                    subTasksContainer.addClass('expanded');
                    realWorkHoursCell.addClass('expanded');
                } else {
                    alert('Error fetching subtasks: ' + data.error);
                }
            }
        });
    }
}

//Function to Approve all the Tasks as ProductAssistant
function approveAllTasks(invoiceId) {
    const executeApprovalAll = () => {
        $.ajax({
            url: `/SalesManagement/CorpIssue/approve_all_tasks/${invoiceId}/`,
            type: 'POST',
            headers: {
                'X-CSRFToken': csrfToken
            },
            success: function(data) {
                if (data.success) {
                    location.reload();
                } else {
                    alert('Error approving all tasks: ' + data.error);
                }
            }
        });
    };

    showSendToSalesManagerModal(executeApprovalAll);
}
// Add click event listener for closing modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('send-to-sales-manager-modal');
    if (event.target === modal) {
        closeSendToSalesManagerModal();
    }
});

let pendingApprovalAction = null;

function showSendToSalesManagerModal(action) {
    pendingApprovalAction = action;
    const modal = document.getElementById('send-to-sales-manager-modal');
    modal.style.display = 'block';
}

function closeSendToSalesManagerModal() {
    const modal = document.getElementById('send-to-sales-manager-modal');
    modal.style.display = 'none';
    pendingApprovalAction = null;
}

function confirmSendToSalesManager() {
    if (pendingApprovalAction) {
        pendingApprovalAction();
    }
    closeSendToSalesManagerModal();
}

//filter slider
function initializeWorkHoursFilters() {
    document.querySelectorAll('.work-hours-type').forEach(select => {
        const container = select.closest('.work-hours-filter');
        const selectContainer = select.closest('.filter-select-container');
        let inputsWrapper = selectContainer.querySelector('.work-hours-inputs-wrapper');
        const clearButton = inputsWrapper.querySelector('.clear-filter');
        const clearIcon = clearButton.querySelector('.clear-filter-icon');
        const normalSrc = clearIcon.src;
        const hoverSrc = clearIcon.dataset.hover;

        // Get existing input values from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const typeValue = urlParams.get(select.name);
        const minValue = urlParams.get(select.name.replace('type', 'min'));
        const maxValue = urlParams.get(select.name.replace('type', 'max'));

        const comparisonLabel = inputsWrapper.querySelector('.comparison-label');
        const minInput = inputsWrapper.querySelector('[name$="_min"]');
        const maxInput = inputsWrapper.querySelector('[name$="_max"]');
        const separator = inputsWrapper.querySelector('.between-separator');

        // If we have values in the URL, show the input fields instead of select
        if (minValue) {
            select.value = typeValue || 'gt'; // Default to 'gt' if no type specified
            minInput.value = minValue;
            
            if (typeValue === 'between' && maxValue) {
                maxInput.value = maxValue;
                maxInput.style.display = 'block';
                separator.style.display = 'block';
            }
            
            // Show inputs, hide select
            select.style.display = 'none';
            inputsWrapper.style.display = 'flex';
            comparisonLabel.textContent = select.options[select.selectedIndex].text;
        }

        // Rest of your existing event listeners...
        clearButton.addEventListener('click', function() {
            select.value = 'all';
            select.style.display = 'block';
            inputsWrapper.style.display = 'none';
            minInput.value = '';
            maxInput.value = '';
            // Submit form when clearing
            select.closest('form').submit();
        });

        select.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex].text;
            
            if (this.value === 'all') {
                select.style.display = 'block';
                inputsWrapper.style.display = 'none';
                minInput.value = '';
                maxInput.value = '';
            } else {
                select.style.display = 'none';
                inputsWrapper.style.display = 'flex';
                comparisonLabel.textContent = selectedOption;
                
                if (this.value === 'between') {
                    maxInput.style.display = 'block';
                    separator.style.display = 'block';
                } else {
                    maxInput.style.display = 'none';
                    separator.style.display = 'none';
                    maxInput.value = '';
                }
            }
        });
    });
}
    
        // Initialize filters based on URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        document.querySelectorAll('.work-hours-type').forEach(select => {
            const target = select.dataset.target;
            const type = urlParams.get(`${target}_work_hours_type`);
            if (type) {
                select.value = type;
                select.dispatchEvent(new Event('change'));
            }
        });
    

        document.addEventListener('DOMContentLoaded', function() {
            const filterToggle = document.querySelector('.filter-toggle');
            const filterPanel = document.querySelector('.filter-panel');
        
            filterToggle.addEventListener('click', function() {
                filterToggle.classList.toggle('active');
                filterPanel.classList.toggle('active');
                
                // Calculate and set the panel height
                if (filterPanel.classList.contains('active')) {
                    filterPanel.style.maxHeight = filterPanel.scrollHeight + "px";
                    filterPanel.style.padding = "20px";
                    // Initialize filters when panel opens
                    initializeWorkHoursFilters();
                } else {
                    filterPanel.style.maxHeight = "0";
                    filterPanel.style.padding = "0";
                }

                document.querySelectorAll('.status-icon').forEach(icon => {
                    const normalSrc = icon.src;
                    const hoverSrc = icon.dataset.hover;
                    
                    icon.addEventListener('mouseenter', () => {
                        if (hoverSrc) {
                            icon.src = hoverSrc;
                        }
                    });
                    
                    icon.addEventListener('mouseleave', () => {
                        icon.src = normalSrc;
                    });
                });
            });
        
            // Initialize filters on page load if there are active filters
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('real_work_hours_type') || urlParams.has('invoice_work_hours_type')) {
                filterToggle.classList.add('active');
                filterPanel.classList.add('active');
                filterPanel.style.maxHeight = filterPanel.scrollHeight + "px";
                filterPanel.style.padding = "20px";
                initializeWorkHoursFilters();
            }

            initializeRatioFilters();
        });

        function initializeFilterState(select, inputsWrapper, minInput, maxInput, separator) {
            const urlParams = new URLSearchParams(window.location.search);
            const filterType = select.name;
            const selectedType = urlParams.get(filterType);
            
            if (selectedType && selectedType !== 'all') {
                select.value = selectedType;
                select.style.display = 'none';
                inputsWrapper.style.display = 'flex';
                
                const minValue = urlParams.get(filterType.replace('type', 'min'));
                if (minValue) minInput.value = minValue;
                
                if (selectedType === 'between') {
                    const maxValue = urlParams.get(filterType.replace('type', 'max'));
                    if (maxValue) maxInput.value = maxValue;
                    maxInput.style.display = 'block';
                    separator.style.display = 'block';
                }
            }
        }

function initializeRatioFilters() {
    document.querySelectorAll('.ratio-type').forEach(select => {
        const container = select.closest('.work-hours-filter');
        const selectContainer = select.closest('.filter-select-container');
        
        
        // Create input wrapper if it doesn't exist
        let inputsWrapper = selectContainer.querySelector('.work-hours-inputs-wrapper');
        if (!inputsWrapper) {
            inputsWrapper = document.createElement('div');
            inputsWrapper.className = 'work-hours-inputs-wrapper';
            inputsWrapper.style.display = 'none';
            inputsWrapper.innerHTML = `
                <div class="comparison-label"></div>
                <div class="inputs-container">
                    <input type="number" 
                           step="0.1" 
                           name="${select.name.replace('type', 'value')}" 
                           class="filter-input work-hours-input" 
                           placeholder="درصد">
                </div>
                <button type="button" class="clear-filter" aria-label="پاک کردن فیلتر">
                    <img src="/static/icons/clear-icon.png" class="clear-filter-icon" data-hover="/static/icons/clear-icon-hover.png">
                </button>
            `;
            selectContainer.appendChild(inputsWrapper);
        }

        const comparisonLabel = inputsWrapper.querySelector('.comparison-label');
        const input = inputsWrapper.querySelector('input');
        const clearButton = inputsWrapper.querySelector('.clear-filter');
        const clearIcon = clearButton.querySelector('.clear-filter-icon');
        const normalSrc = clearIcon.src;
        const hoverSrc = clearIcon.dataset.hover;

        // Initialize state from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get(select.name);
        const value = urlParams.get(select.name.replace('type', 'value'));
        
        if (type && type !== 'all') {
            select.value = type;
            select.style.display = 'none';
            inputsWrapper.style.display = 'flex';
            comparisonLabel.textContent = select.options[select.selectedIndex].text;
            if (value) input.value = value;
        }

        // Handle select change
        select.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex].text;
            
            if (this.value === 'all') {
                select.style.display = 'block';
                inputsWrapper.style.display = 'none';
                input.value = '';
                
                // Submit form when selecting 'all'
                this.closest('form').submit();
            } else {
                select.style.display = 'none';
                inputsWrapper.style.display = 'flex';
                comparisonLabel.textContent = selectedOption;
            }
        });

        // Handle clear button
        clearButton.addEventListener('click', function() {
            select.value = 'all';
            select.style.display = 'block';
            inputsWrapper.style.display = 'none';
            input.value = '';
            
            // Submit form when clearing filter
            select.closest('form').submit();
        });

        // Add hover effect for clear filter icon
        clearButton.addEventListener('mouseenter', () => {
            clearIcon.src = hoverSrc;
        });

        clearButton.addEventListener('mouseleave', () => {
            clearIcon.src = normalSrc;
        });

        // Handle input change
        input.addEventListener('change', function() {
            if (this.value) {
                select.closest('form').submit();
            }
        });
    });
}

function initializeIconFilters() {
    // Handle team icons
    document.querySelectorAll('.team-filter .multi-select-item').forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const icon = item.querySelector('.team-icon');

        // Handle hover
        item.addEventListener('mouseenter', () => {
            if (!checkbox.checked) {
                icon.src = icon.dataset.hover;
            }
        });

        item.addEventListener('mouseleave', () => {
            if (!checkbox.checked) {
                icon.src = icon.src.replace('-hover.png', '-grey.png');
            }
        });

        // Handle click
        item.addEventListener('click', () => {
            checkbox.checked = !checkbox.checked;
            if (checkbox.checked) {
                icon.src = icon.dataset.selected;
                item.classList.add('selected');
            } else {
                icon.src = icon.src.replace('.png', '-grey.png');
                item.classList.remove('selected');
            }
            updateProjects();
        });
    });

    // Initialize project icons if they exist
    initializeProjectIcons();
}

function initializeProjectIcons() {
    document.querySelectorAll('.project-filter .multi-select-item').forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const icon = item.querySelector('.project-icon');
        const teamCode = checkbox.getAttribute('data-team-code');

        // Handle hover
        item.addEventListener('mouseenter', () => {
            if (!checkbox.checked) {
                icon.src = `/static/CorpIssue/images/InvoiceTaskForm Icons/icons V/${teamCode}-hover.png`;
            }
        });

        item.addEventListener('mouseleave', () => {
            if (!checkbox.checked) {
                icon.src = `/static/CorpIssue/images/InvoiceTaskForm Icons/icons V/${teamCode}-grey.png`;
            } else {
                icon.src = `/static/CorpIssue/images/InvoiceTaskForm Icons/icons V/${teamCode}.png`;
            }
        });

        // Handle click
        item.addEventListener('click', () => {
            checkbox.checked = !checkbox.checked;
            if (checkbox.checked) {
                icon.src = `/static/CorpIssue/images/InvoiceTaskForm Icons/icons V/${teamCode}.png`;
                item.classList.add('selected');
                icon.classList.remove('grey');
            } else {
                icon.src = `/static/CorpIssue/images/InvoiceTaskForm Icons/icons V/${teamCode}-grey.png`;
                item.classList.remove('selected');
                icon.classList.add('grey');
            }
        });
    });
}

function updateProjects() {
    const teamCheckboxes = document.querySelectorAll('.team-checkbox');
    const projectFilter = document.getElementById('project-filter');
    
    if (!projectFilter) {
        console.error("Project filter container not found");
        return;
    }
    
    const projectContainer = projectFilter.querySelector('.multi-select-container');
    if (!projectContainer) {
        console.error("Project multi-select container not found");
        return;
    }

    const selectedTeams = Array.from(teamCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    console.log("Selected teams:", selectedTeams);

    if (selectedTeams.length === 0) {
        projectFilter.classList.remove('active');
        projectContainer.innerHTML = '';
        return;
    }

    // Show loading state
    projectFilter.classList.add('active');
    projectContainer.innerHTML = '<div class="loading">در حال بارگذاری...</div>';

    $.ajax({
        url: '/SalesManagement/CorpIssue/get_team_projects/',
        type: 'GET',
        data: { teams: selectedTeams.join(',') },
        headers: {
            'X-CSRFToken': csrfToken,
            'X-Requested-With': 'XMLHttpRequest'
        },
        success: function(data) {
            console.log("Server response:", data);
            
            if (data.success && Array.isArray(data.projects)) {
                if (data.projects.length === 0) {
                    projectContainer.innerHTML = '<div class="no-projects">پروژه‌ای یافت نشد</div>';
                } else {
                    const urlParams = new URLSearchParams(window.location.search);
                    const selectedProjects = urlParams.getAll('project');
                    
                    projectContainer.innerHTML = data.projects.map(project => {
                        // Ensure team_code exists and use it for the icon
                        if (!project.team_code) {
                            console.error('Missing team_code for project:', project);
                            return '';
                        }
                        const isSelected = selectedProjects.includes(project.id.toString());
                        return `
                            <div class="multi-select-item ${isSelected ? 'selected' : ''}">
                                <input type="checkbox" 
                                       id="project_${project.id}" 
                                       name="project" 
                                       value="${project.id}"
                                       class="project-checkbox"
                                       data-team-code="${project.team_code}"
                                       ${isSelected ? 'checked' : ''}>
                                <img src="/static/CorpIssue/images/InvoiceTaskForm Icons/icons V/${project.team_code}${isSelected ? '.png' : '-grey.png'}"
                                     alt="${project.project_name}"
                                     class="project-icon big ${isSelected ? '' : 'grey'}"
                                     data-hover="/static/CorpIssue/images/InvoiceTaskForm Icons/icons V/${project.team_code}-hover.png"
                                     data-selected="/static/CorpIssue/images/InvoiceTaskForm Icons/icons V/${project.team_code}.png"
                                     title="${project.project_name}">
                                <span class="project-name">${project.project_name}</span>
                            </div>
                        `;
                    }).join('');

                    // Initialize project icons with instant update
                    document.querySelectorAll('.project-filter .multi-select-item').forEach(item => {
                        const checkbox = item.querySelector('input[type="checkbox"]');
                        const icon = item.querySelector('.project-icon');
                        const teamCode = checkbox.getAttribute('data-team-code');

                        // Handle click
                        item.addEventListener('click', () => {
                            checkbox.checked = !checkbox.checked;
                            if (checkbox.checked) {
                                icon.src = `/static/CorpIssue/images/InvoiceTaskForm Icons/icons V/${teamCode}.png`;
                                item.classList.add('selected');
                                icon.classList.remove('grey');
                            } else {
                                icon.src = `/static/CorpIssue/images/InvoiceTaskForm Icons/icons V/${teamCode}-grey.png`;
                                item.classList.remove('selected');
                                icon.classList.add('grey');
                            }
                        });

                        // Handle hover
                        item.addEventListener('mouseenter', () => {
                            if (!checkbox.checked) {
                                icon.src = `/static/CorpIssue/images/InvoiceTaskForm Icons/icons V/${teamCode}-hover.png`;
                            }
                        });

                        item.addEventListener('mouseleave', () => {
                            if (!checkbox.checked) {
                                icon.src = `/static/CorpIssue/images/InvoiceTaskForm Icons/icons V/${teamCode}-grey.png`;
                            } else {
                                icon.src = `/static/CorpIssue/images/InvoiceTaskForm Icons/icons V/${teamCode}.png`;
                            }
                        });
                    });
                }
            } else {
                projectContainer.innerHTML = '<div class="error">خطا در دریافت پروژه‌ها</div>';
                console.error("Invalid server response:", data);
            }
        },
        error: function(xhr, status, error) {
            console.error("AJAX Error:", xhr.responseText);
            projectContainer.innerHTML = '<div class="error">خطا در ارتباط با سرور</div>';
        }
    });
}

function showResponseModal(taskId) {
    const modal = document.getElementById('response-modal');
    document.getElementById('response-task-id').value = taskId;
    modal.style.display = 'block';
}

function closeResponseModal() {
    const modal = document.getElementById('response-modal');
    modal.style.display = 'none';
}

function submitResponse(event) {
    event.preventDefault();
    
    const taskId = document.getElementById('response-task-id').value;
    const responseText = document.getElementById('response-text').value;

    if (!taskId) {
        console.error('Task ID not found');
        return;
    }

    if (!responseText) {
        alert('لطفا پاسخ را وارد کنید');
        return;
    }

    $.ajax({
        url: `/SalesManagement/CorpIssue/approve_task/${taskId}/`,
        type: 'POST',
        data: JSON.stringify({ response: responseText }),
        contentType: 'application/json',
        headers: {
            'X-CSRFToken': csrfToken
        },
        success: function(data) {
            if (data.success) {
                closeResponseModal();
                location.reload();
            } else {
                alert('خطا: ' + data.error);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
            alert('خطا در ارتباط با سرور');
        }
    });
}


function initializeTeamProjectFilters() {
    console.log("Initializing team project filters"); // Debug logging
    
    const teamCheckboxes = document.querySelectorAll('.team-checkbox');
    console.log("Found team checkboxes:", teamCheckboxes.length); // Debug logging
    
    teamCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            console.log("Team checkbox changed:", checkbox.value); // Debug logging
            updateProjects();
        });
    });

    // Initialize projects if teams are selected
    if (document.querySelectorAll('.team-checkbox:checked').length > 0) {
        console.log("Found checked teams, initializing projects"); // Debug logging
        updateProjects();
    }
}

//------------------------------------sales_manager_form.js----------------------------

function uploadSelectedFile(invoiceId) {
    const mainFileInput = document.getElementById('main_upload_file');
    const successMsg = document.getElementById(`upload-success-${invoiceId}`);
    
    if (!mainFileInput || !mainFileInput.files.length) {
        alert('لطفا ابتدا فایلی را انتخاب کنید');
        return;
    }

    const file = mainFileInput.files[0];
    if (!file.name.endsWith('.xlsx')) {
        alert('لطفا فقط فایل اکسل با پسوند .xlsx آپلود کنید');
        return;
    }

    const formData = new FormData();
    formData.append('upload', file);

    $.ajax({
        url: `/SalesManagement/CorpIssue/sales_manager/${invoiceId}/`,
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        success: function(response) {
            if (response.success) {
                successMsg.textContent = 'فایل با موفقیت آپلود شد';
                successMsg.style.display = 'block';
                mainFileInput.value = ''; // Clear the file input
                document.querySelector('.file-name').style.display = 'none'; // Hide filename
                showNextStageModal();
            } else {
                alert('خطا در آپلود فایل: ' + response.error);
            }
        },
        error: function() {
            alert('خطا در ارتباط با سرور');
        }
    });
}

function initializeSalesManagerForm() {
    const uploadZone = document.querySelector('.upload-zone');
    const mainFileInput = document.getElementById('main_upload_file');
    const fileName = document.querySelector('.file-name');
    const selectFileBtn = document.querySelector('.select-file-btn');

    if (!uploadZone || !mainFileInput) return;

    // Handle file selection
    mainFileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            const file = this.files[0];
            if (file.name.endsWith('.xlsx')) {
                fileName.textContent = file.name;
                fileName.style.display = 'block';
            } else {
                alert('لطفا فقط فایل اکسل با پسوند .xlsx آپلود کنید');
                this.value = '';
                fileName.style.display = 'none';
            }
        }
    });

    // Handle drag and drop
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        
        if (e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (file.name.endsWith('.xlsx')) {
                mainFileInput.files = e.dataTransfer.files;
                fileName.textContent = file.name;
                fileName.style.display = 'block';
            } else {
                alert('لطفا فقط فایل اکسل با پسوند .xlsx آپلود کنید');
            }
        }
    });

    // Handle select file button click
    if (selectFileBtn) {
        selectFileBtn.onclick = function(e) {
            e.preventDefault();
            mainFileInput.click();
        };
    }
}

// Modal functions
function showNextStageModal() {
    const modal = document.getElementById('next-stage-modal');
    const status = document.querySelector('.status-pill').textContent.trim();
    const modalTitle = modal.querySelector('h3');
    
    if (status === 'ارسال شده برای مدیر فروش') {
        modalTitle.textContent = 'آیا مایل به ارسال تسک ها برای مشتری هستید؟';
    } else if (status === 'ارسال شده به مشتری') {
        modalTitle.textContent =' آیا از آپلود فایل مطمئن هستید و میخواهید تسک های رد شده را برای مدیران پروژه ارسال کنید؟';
    }
    
    modal.style.display = 'block';
}

function closeNextStageModal() {
    const modal = document.getElementById('next-stage-modal');
    modal.style.display = 'none';
}

function confirmNextStage(invoiceId) {
    $.ajax({
        url: `/SalesManagement/CorpIssue/sales_manager/${invoiceId}/next_stage/`,
        type: 'POST',
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        success: function(response) {
            if (response.success) {
                location.reload();
            } else {
                alert('خطا: ' + response.error);
            }
        },
        error: function() {
            alert('خطا در ارتباط با سرور');
        }
    });
    closeNextStageModal();
}

// Add DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    // Initialize upload buttons and modals
    document.querySelectorAll('.file-input-container').forEach(form => {
        const invoiceId = form.dataset.invoiceId;
        if (invoiceId) {
            const uploadBtn = form.querySelector('.upload-btn');
            if (uploadBtn) {
                uploadBtn.onclick = () => uploadSelectedFile(invoiceId);
            }
        }
    });

    // Close modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('next-stage-modal');
        if (event.target === modal) {
            closeNextStageModal();
        }
    };
    initializeSalesManagerForm();
});

// Add the new function for team and project filters
function updateProjects() {
    const teamCheckboxes = document.querySelectorAll('.team-checkbox');
    const projectFilter = document.getElementById('project-filter');
    
    
    if (!projectFilter) {
        console.error("Project filter container not found");
        return;
    }
    
    const projectContainer = projectFilter.querySelector('.multi-select-container');
    if (!projectContainer) {
        console.error("Project multi-select container not found");
        return;
    }

    const selectedTeams = Array.from(teamCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    console.log("Selected teams:", selectedTeams);

    if (selectedTeams.length === 0) {
        projectFilter.classList.remove('active');
        projectContainer.innerHTML = '';
        return;
    }

    // Show loading state
    projectFilter.classList.add('active');
    projectContainer.innerHTML = '<div class="loading">در حال بارگذاری...</div>';

    $.ajax({
        url: '/SalesManagement/CorpIssue/get_team_projects/',
        type: 'GET',
        data: { teams: selectedTeams.join(',') },
        headers: {
            'X-CSRFToken': csrfToken,
            'X-Requested-With': 'XMLHttpRequest'
        },
    success: function(data) {
        if (data.success && Array.isArray(data.projects)) {
            if (data.projects.length === 0) {
                projectContainer.innerHTML = '<div class="no-projects">پروژه‌ای یافت نشد</div>';
            } else {
                const urlParams = new URLSearchParams(window.location.search);
                const selectedProjects = urlParams.getAll('project');
                
                projectContainer.innerHTML = data.projects.map(project => {
                    // Ensure team_code exists and use it for the icon
                    if (!project.team_code) {
                        console.error('Missing team_code for project:', project);
                        return '';
                    }
                    const isSelected = selectedProjects.includes(project.id.toString());
                    return `
                        <div class="multi-select-item ${isSelected ? 'selected' : ''}">
                            <input type="checkbox" 
                                   id="project_${project.id}" 
                                   name="project" 
                                   value="${project.id}"
                                   class="project-checkbox"
                                   data-team-code="${project.team_code}"
                                   ${isSelected ? 'checked' : ''}>
                            <img src="/static/CorpIssue/images/InvoiceTaskForm Icons/icons V/${project.team_code}${isSelected ? '.png' : '-grey.png'}"
                                 alt="${project.project_name}"
                                 class="project-icon ${isSelected ? '' : 'grey'}"
                                 data-hover="/static/CorpIssue/images/InvoiceTaskForm Icons/icons V/${project.team_code}-hover.png"
                                 data-selected="/static/CorpIssue/images/InvoiceTaskForm Icons/icons V/${project.team_code}.png"
                                 data-team-code="${project.team_code}"
                                 title="${project.project_name}">
                            <span class="project-name">${project.project_name}</span>
                        </div>
                    `;
                }).join('');

                // Initialize project icons with their states
                document.querySelectorAll('.project-filter .multi-select-item').forEach(item => {
                    const checkbox = item.querySelector('input[type="checkbox"]');
                    const icon = item.querySelector('.project-icon');
                    const teamCode = checkbox.getAttribute('data-team-code');

                    // Set initial state
                    if (checkbox.checked) {
                        icon.src = `/static/CorpIssue/images/InvoiceTaskForm Icons/icons V/${teamCode}.png`;
                        item.classList.add('selected');
                        icon.classList.remove('grey');
                    }

                    // Add click handler
                    item.addEventListener('click', () => {
                        checkbox.checked = !checkbox.checked;
                        if (checkbox.checked) {
                            icon.src = `/static/CorpIssue/images/InvoiceTaskForm Icons/icons V/${teamCode}.png`;
                            item.classList.add('selected');
                            icon.classList.remove('grey');
                        } else {
                            icon.src = `/static/CorpIssue/images/InvoiceTaskForm Icons/icons V/${teamCode}-grey.png`;
                            item.classList.remove('selected');
                            icon.classList.add('grey');
                        }
                        document.querySelector('.filter-panel form').submit();
                    });

                    // Handle hover
                    item.addEventListener('mouseenter', () => {
                        if (!checkbox.checked) {
                            icon.src = `/static/CorpIssue/images/InvoiceTaskForm Icons/icons V/${teamCode}-hover.png`;
                        }
                    });

                    item.addEventListener('mouseleave', () => {
                        if (!checkbox.checked) {
                            icon.src = `/static/CorpIssue/images/InvoiceTaskForm Icons/icons V/${teamCode}-grey.png`;
                        } else {
                            icon.src = `/static/CorpIssue/images/InvoiceTaskForm Icons/icons V/${teamCode}.png`;
                        }
                    });
                });
            }
        }
    },
        error: function(xhr, status, error) {
            console.error("AJAX Error:", xhr.responseText);
            projectContainer.innerHTML = '<div class="error">خطا در ارتباط با سرور</div>';
        }
    });
}

function initializeTeamProjectFilters() {
    console.log("Initializing team project filters"); // Debug logging
    
    const teamCheckboxes = document.querySelectorAll('.team-checkbox');
    console.log("Found team checkboxes:", teamCheckboxes.length); // Debug logging
    
    teamCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            console.log("Team checkbox changed:", checkbox.value); // Debug logging
            updateProjects();
        });
    });

    // Initialize projects if teams are selected
    if (document.querySelectorAll('.team-checkbox:checked').length > 0) {
        console.log("Found checked teams, initializing projects"); // Debug logging
        updateProjects();
    }
}

// Add this function to handle clear filters
function handleClearFilters() {
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    const filterForm = document.querySelector('.filter-panel form');

    // Check if there are any active filters on page load
    function checkActiveFilters() {
        const urlParams = new URLSearchParams(window.location.search);
        const hasFilters = Array.from(urlParams.entries()).some(([key, value]) => {
            return value !== '' && key !== 'page';
        });
        clearFiltersBtn.classList.toggle('visible', hasFilters);
    }

    // Clear all filters and submit form
    function clearAllFilters() {
        // Reset all inputs
        filterForm.querySelectorAll('input').forEach(input => {
            if (input.type === 'checkbox') {
                input.checked = false;
            } else {
                input.value = '';
            }
        });

        // Reset all selects
        filterForm.querySelectorAll('select').forEach(select => {
            select.value = select.options[0].value;
        });

        // Reset work hours filters
        document.querySelectorAll('.work-hours-type').forEach(select => {
            select.value = 'all';
            const wrapper = select.closest('.filter-select-container')
                .querySelector('.work-hours-inputs-wrapper');
            if (wrapper) {
                wrapper.style.display = 'none';
            }
        });

        // Reset ratio filters
        document.querySelectorAll('.ratio-type').forEach(select => {
            select.value = 'all';
            const wrapper = select.closest('.filter-select-container')
                .querySelector('.work-hours-inputs-wrapper');
            if (wrapper) {
                wrapper.style.display = 'none';
            }
        });

        // Submit form
        filterForm.submit();
    }

    // Add event listeners
    clearFiltersBtn.addEventListener('click', clearAllFilters);
    window.addEventListener('load', checkActiveFilters);

    // Check filters on form changes
    filterForm.addEventListener('change', () => {
        const hasActiveFilters = Array.from(filterForm.elements).some(element => {
            if (element.type === 'checkbox') return element.checked;
            if (element.type === 'select-one') return element.value !== '' && element.value !== 'all';
            return element.value !== '';
        });
        clearFiltersBtn.classList.toggle('visible', hasActiveFilters);
    });
}


// Add to your existing DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all existing functionality
    initializeTeamProjectFilters();
    
    // Add modal event listeners
    const nextStageBtn = document.querySelector('.next-stage-btn');
    const modal = document.getElementById('next-stage-modal');
    
    if (nextStageBtn) {
        nextStageBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Next stage button clicked'); // Debug log
            showNextStageModal();
        });
    }

    if (modal) {
        // Close modal when clicking outside
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeNextStageModal();
            }
        });

        // Add click events for modal buttons
        const closeBtn = modal.querySelector('.close');
        const confirmBtn = modal.querySelector('.confirm-btn');
        const cancelBtn = modal.querySelector('.cancel-btn');

        // Only call confirmNextStage on confirm button
        if (confirmBtn) {
            confirmBtn.addEventListener('click', function() {
                const invoiceId = document.querySelector('.content-wrapper').dataset.invoiceId;
                if (invoiceId) {
                    confirmNextStage(invoiceId);
                }
            });
        }

        // Cancel and close just closes the modal, no status change
        if (cancelBtn) cancelBtn.addEventListener('click', closeNextStageModal);

        if (closeBtn) closeBtn.addEventListener('click', closeNextStageModal);
    }

    // Initialize form state based on current status
    const status = document.querySelector('.status-pill')?.textContent.trim();
    const contentWrapper = document.querySelector('.content-wrapper');
    
    if (status === 'ارسال شده برای مدیر فروش') {
        contentWrapper.classList.add('sales-manager-view');
        contentWrapper.classList.remove('customer-view');
    } else if (status === 'ارسال شده به مشتری') {
        contentWrapper.classList.add('customer-view');
        contentWrapper.classList.remove('sales-manager-view');
        initializeSalesManagerForm();
    }
    initializeIconFilters();

    // Team icon instant update and project show
    document.querySelectorAll('.team-column .multi-select-item').forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const icon = item.querySelector('.team-icon');
        const teamCode = checkbox.value;

        item.addEventListener('click', function(e) {
            // Only toggle if not clicking the checkbox directly
            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
            }
            if (checkbox.checked) {
                icon.src = `/static/CorpIssue/images/InvoiceTaskForm Icons/icons V/${teamCode}.png`;
                item.classList.add('selected');
                icon.classList.remove('grey');
            } else {
                icon.src = `/static/CorpIssue/images/InvoiceTaskForm Icons/icons V/${teamCode}-grey.png`;
                item.classList.remove('selected');
                icon.classList.add('grey');
            }
            updateProjects(); // Show projects instantly
            // Instantly submit the filter form to reload the page
            document.querySelector('.filter-panel form').submit();
        });
    });

    // TEAM ICONS
    document.querySelectorAll('.team-column .multi-select-item').forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const icon = item.querySelector('.team-icon');
        const teamCode = checkbox.value;

        item.addEventListener('click', function(e) {
            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
            }
            if (checkbox.checked) {
                icon.src = `/static/CorpIssue/images/InvoiceTaskForm Icons/icons V/${teamCode}.png`;
                item.classList.add('selected');
                icon.classList.remove('grey');
            } else {
                icon.src = `/static/CorpIssue/images/InvoiceTaskForm Icons/icons V/${teamCode}-grey.png`;
                item.classList.remove('selected');
                icon.classList.add('grey');
            }
            document.querySelector('.filter-panel form').submit();
        });
    });

    // PROJECT ICONS
    document.querySelectorAll('.project-column .multi-select-item').forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const icon = item.querySelector('.project-icon');
        const teamCode = checkbox.getAttribute('data-team-code');

        item.addEventListener('click', function(e) {
            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
            }
            if (checkbox.checked) {
                icon.src = `/static/CorpIssue/images/InvoiceTaskForm Icons/icons V/${teamCode}.png`;
                item.classList.add('selected');
                icon.classList.remove('grey');
            } else {
                icon.src = `/static/CorpIssue/images/InvoiceTaskForm Icons/icons V/${teamCode}-grey.png`;
                item.classList.remove('selected');
                icon.classList.add('grey');
            }
            document.querySelector('.filter-panel form').submit();
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Handle status filter icons
    document.querySelectorAll('.status-icon-label').forEach(label => {
        const checkbox = label.querySelector('.status-checkbox');
        const icon = label.querySelector('.status-filter-icon');
        const normalSrc = icon.src;
        const hoverSrc = icon.dataset.hover;
        const selectedSrc = icon.dataset.selected;

        // Handle hover
        label.addEventListener('mouseenter', () => {
            if (!checkbox.checked && hoverSrc) {
                icon.src = hoverSrc;
            }
        });

        label.addEventListener('mouseleave', () => {
            if (!checkbox.checked) {
                icon.src = normalSrc;
            }
        });

        // Handle checkbox change
        checkbox.addEventListener('change', () => {
            icon.src = checkbox.checked ? selectedSrc : normalSrc;
        });

        // Set initial state
        if (checkbox.checked) {
            icon.src = selectedSrc;
        }
        handleClearFilters();
    });
});

// Help Book Icon Hover/Active States
document.addEventListener('DOMContentLoaded', function() {
    const bookIcon = document.getElementById('help-book-icon');
    const helpLink = document.getElementById('help-download-link');
    if (bookIcon && helpLink) {
        helpLink.addEventListener('mouseenter', () => {
            bookIcon.src = "/static/CorpIssue/images/InvoiceTaskForm Icons/icons V/book-hover.png";
        });
        helpLink.addEventListener('mouseleave', () => {
            bookIcon.src = "/static/CorpIssue/images/InvoiceTaskForm Icons/icons V/book-grey.png";
        });
        helpLink.addEventListener('mousedown', () => {
            bookIcon.src = "/static/CorpIssue/images/InvoiceTaskForm Icons/icons V/book.png";
        });
        helpLink.addEventListener('mouseup', () => {
            bookIcon.src = "/static/CorpIssue/images/InvoiceTaskForm Icons/icons V/book-hover.png";
        });
    }
});