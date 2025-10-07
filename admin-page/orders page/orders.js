        function initScrollActionSelector() {
            const actionSelector = document.querySelector('.action-selector');
            const actionOptions = document.querySelectorAll('.action-option');
            const actionCells = document.querySelectorAll('.action-cell');
            let selectedAction = null;
            let activeRow = null;

            // Add click event listeners to action cells
            actionCells.forEach(cell => {
                cell.addEventListener('click', function(e) {
                    e.stopPropagation(); // Prevent row or document click handlers interfering

                    // Remove active class from all rows
                    document.querySelectorAll('tbody tr').forEach(r => r.classList.remove('active'));

                    // Mark this row as active
                    const row = this.closest('tr');
                    row.classList.add('active');
                    activeRow = row;

                    // Position action selector near the active row
                    positionActionSelector(row);

                    // Show action selector
                    actionSelector.style.display = 'flex';
                });
            });

            // Handle action option clicks
            actionOptions.forEach(option => {
                option.addEventListener('click', function() {
                    actionOptions.forEach(opt => opt.classList.remove('active'));
                    this.classList.add('active');
                    selectedAction = this.getAttribute('data-action');

                    if (activeRow) {
                        updateRowAction(activeRow, selectedAction);

                        // Hide selector after a short delay
                        setTimeout(() => {
                            actionSelector.style.display = 'none';
                            activeRow.classList.remove('active');
                            activeRow = null;
                        }, 1000);
                    }
                });
            });

            // Position action selector relative to row
            function positionActionSelector(row) {
                const rowRect = row.getBoundingClientRect();
                const scrollY = window.scrollY || document.documentElement.scrollTop;
                const topPosition = rowRect.top + scrollY + rowRect.height / 2 - actionSelector.offsetHeight / 2;

                actionSelector.style.top = `${topPosition}px`;

                if (window.innerWidth > 768) {
                    actionSelector.style.right = '20px';
                    actionSelector.style.left = 'auto';
                    actionSelector.style.transform = 'none';
                } else {
                    actionSelector.style.left = '50%';
                    actionSelector.style.right = 'auto';
                    actionSelector.style.transform = 'translateX(-50%)';
                }
            }

            // Update row text and status
            function updateRowAction(row, action) {
                const actionCell = row.querySelector('.action-cell');
                const statusCell = row.querySelector('.status');
                let actionText = '';
                let newStatus = '';

                switch(action) {
                    case 'process':
                        actionText = 'Processing order...';
                        newStatus = 'Processing';
                        break;
                    case 'complete':
                        actionText = 'Completing order...';
                        newStatus = 'Completed';
                        break;
                    case 'cancel':
                        actionText = 'Cancelling order...';
                        newStatus = 'Cancelled';
                        break;
                    case 'view':
                        actionText = 'Viewing order details...';
                        break;
                    case 'edit':
                        actionText = 'Editing order...';
                        break;
                    case 'delete':
                        actionText = 'Deleting order...';
                        break;
                }

                actionCell.innerHTML = `<span class="action-applied">${actionText}</span>`;

                if (newStatus) {
                    statusCell.textContent = newStatus;
                    statusCell.className = 'status';

                    switch(newStatus) {
                        case 'Processing': 
                            statusCell.classList.add('status-processing'); 
                            break;
                        case 'Completed': 
                            statusCell.classList.add('status-completed'); 
                            break;
                        case 'Cancelled': 
                            statusCell.classList.add('status-cancelled'); 
                            break;
                    }
                }
            }

            // Close selector when clicking outside
            document.addEventListener('click', function(e) {
                if (!actionSelector.contains(e.target) && !e.target.closest('.action-cell')) {
                    actionSelector.style.display = 'none';
                    if (activeRow) {
                        activeRow.classList.remove('active');
                        activeRow = null;
                    }
                }
            });
        }

        // Search functionality
        function initSearch() {
            const searchInput = document.getElementById('searchOrder');
            
            searchInput.addEventListener('input', function() {
                const query = this.value.toLowerCase();
                const rows = document.querySelectorAll('tbody tr');
                
                rows.forEach(row => {
                    const orderId = row.querySelector('td:first-child').textContent.toLowerCase();
                    const customer = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                    const items = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
                    
                    if (orderId.includes(query) || customer.includes(query) || items.includes(query)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            });
        }

        // Filter functionality
        function initFilters() {
            const filterButtons = document.querySelectorAll('.filter-btn');
            
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Remove active class from all buttons
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    
                    // Add active class to clicked button
                    this.classList.add('active');
                    
                    const filter = this.textContent.toLowerCase();
                    const rows = document.querySelectorAll('tbody tr');
                    
                    rows.forEach(row => {
                        const status = row.querySelector('.status').textContent.toLowerCase();
                        
                        if (filter === 'all' || status.includes(filter)) {
                            row.style.display = '';
                        } else {
                            row.style.display = 'none';
                        }
                    });
                });
            });
        }

        // Run after DOM is ready
        document.addEventListener("DOMContentLoaded", function() {
            initScrollActionSelector();
            initSearch();
            initFilters();
        });