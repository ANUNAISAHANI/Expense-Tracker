/* ==========================================
   INDIVIDUAL JS FOR DASHBOARD.HTML (NO MIXING)
   ========================================== */

let draftExpenses = [];
let finalizedRecords = [];
let userIncome = 0;
let metricResetActive = false; // Flag for fresh start metrics reset without deleting main records

document.addEventListener("DOMContentLoaded", function () {
    const targetBody = document.getElementById('dashboard-body-container');
    const savedTheme = localStorage.getItem('theme_preference');
    if (savedTheme === 'dark') {
        targetBody.classList.add('dark-mode-active');
    }

    loadUserProfileAndRegions();

    const datePicker = document.getElementById("item-expense-date");
    if (datePicker) {
        const today = new Date().toISOString().split('T')[0];
        datePicker.value = today;
    }

    const incomeInput = document.getElementById("user-income-input");
    if (incomeInput) {
        incomeInput.addEventListener("input", function () {
            userIncome = parseFloat(incomeInput.value) || 0;
            updateDashboardMetrics(finalizedRecords);
        });
    }

    const expenseForm = document.getElementById("expense-item-form");
    if (expenseForm) {
        expenseForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("item-name").value.trim();
            const price = parseFloat(document.getElementById("item-price").value) || 0;
            const selectedDate = document.getElementById("item-expense-date").value;

            if (name === "" || price <= 0 || !selectedDate) return;

            const tax = price * 0.05;

            draftExpenses.push({
                name: name,
                price: price,
                tax: tax,
                date: selectedDate
            });

            renderDraftTable();
            expenseForm.reset();
            document.getElementById("item-expense-date").value = selectedDate;
        });
    }

    const saveProfileBtn = document.getElementById("save-profile-btn");
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener("click", function () {
            const name = document.getElementById("settings-fullname").value;
            const email = document.getElementById("settings-email").value;
            const phone = document.getElementById("settings-phone").value;
            const photoInput = document.getElementById("settings-profile-photo");

            if (name) localStorage.setItem('user_name', name);
            if (email) localStorage.setItem('user_email', email);
            if (phone) localStorage.setItem('user_phone', phone);

            if (photoInput.files && photoInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    localStorage.setItem('user_dp', e.target.result);
                    loadUserProfileAndRegions();
                    toggleProfileModal();
                    alert("Profile updated successfully!");
                };
                reader.readAsDataURL(photoInput.files[0]);
            } else {
                loadUserProfileAndRegions();
                toggleProfileModal();
                alert("Profile details updated successfully!");
            }
        });
    }

    updateRegionalInsights();
});

function toggleProfileModal() {
    const modal = document.getElementById("profile-settings-modal");
    if (modal) {
        modal.style.display = modal.style.display === "flex" ? "none" : "flex";
    }
}

function switchDashboardTab(tabName) {
    const finPanel = document.getElementById("panel-financial-overview");
    const regPanel = document.getElementById("panel-regional-insights");
    const finBtn = document.getElementById("tab-btn-financial");
    const regBtn = document.getElementById("tab-btn-regional");

    if (tabName === 'financial') {
        finPanel.style.display = "block";
        regPanel.style.display = "none";
        finBtn.style.background = "var(--btn-bg)";
        finBtn.style.color = "var(--btn-text)";
        regBtn.style.background = "var(--card-bg)";
        regBtn.style.color = "var(--text-color)";
    } else {
        finPanel.style.display = "none";
        regPanel.style.display = "block";
        regBtn.style.background = "var(--btn-bg)";
        regBtn.style.color = "var(--btn-text)";
        finBtn.style.background = "var(--card-bg)";
        finBtn.style.color = "var(--text-color)";
        updateRegionalInsights();
    }
}

function toggleThemeMode() {
    const targetBody = document.getElementById('dashboard-body-container');
    targetBody.classList.toggle('dark-mode-active');
    localStorage.setItem('theme_preference', targetBody.classList.contains('dark-mode-active') ? 'dark' : 'light');
}

function renderDraftTable() {
    const tbody = document.getElementById("expense-table-body");
    if (!tbody) return;
    tbody.innerHTML = "";

    draftExpenses.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>₹${item.price.toFixed(2)}</td>
            <td>₹${item.tax.toFixed(2)}</td>
            <td>${item.date}</td>
            <td><button onclick="deleteDraftItem(${index})" style="background: #ff3b30; color: #fff; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">Remove</button></td>
        `;
        tbody.appendChild(row);
    });
}

function deleteDraftItem(index) {
    draftExpenses.splice(index, 1);
    renderDraftTable();
}

function performFinalSubmit() {
    if (draftExpenses.length === 0) {
        alert("No draft records to submit!");
        return;
    }

    const now = new Date();
    const timestamp = now.toLocaleDateString() + " " + now.toLocaleTimeString();

    draftExpenses.forEach(item => {
        finalizedRecords.push({
            ...item,
            submittedAt: timestamp
        });
    });

    draftExpenses = [];
    metricResetActive = false; // New submit lifts the temporary reset view
    renderDraftTable();
    updateDashboardMetrics(finalizedRecords);
    renderFinalizedDataTable(finalizedRecords);
    renderFinancialCharts(finalizedRecords);
    updateRegionalInsights();

    alert("Records Final Submitted & Locked successfully!");
}

function updateDashboardMetrics(recordsToCalc) {
    if (metricResetActive) {
        document.getElementById("display-total-balance").innerText = `₹${userIncome.toFixed(2)}`;
        document.getElementById("display-total-spent").innerText = `₹0.00`;
        document.getElementById("display-total-tax").innerText = `₹0.00`;
        return;
    }

    let totalSpent = 0;
    let totalTax = 0;

    recordsToCalc.forEach(item => {
        totalSpent += item.price;
        totalTax += item.tax;
    });

    const totalBalance = userIncome - totalSpent;

    document.getElementById("display-total-balance").innerText = `₹${totalBalance.toFixed(2)}`;
    document.getElementById("display-total-spent").innerText = `₹${totalSpent.toFixed(2)}`;
    document.getElementById("display-total-tax").innerText = `₹${totalTax.toFixed(2)}`;
}

function renderFinalizedDataTable(recordsToDisplay) {
    const tbody = document.getElementById("finalized-table-body");
    if (!tbody) return;

    if (recordsToDisplay.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="padding: 10px; color: #86868b;">No records found</td></tr>`;
        return;
    }

    tbody.innerHTML = "";
    recordsToDisplay.forEach(item => {
        const row = document.createElement("tr");
        row.style.borderBottom = "1px solid var(--border-color)";
        row.innerHTML = `
            <td style="padding: 8px;">${item.name}</td>
            <td style="padding: 8px;">₹${item.price.toFixed(2)}</td>
            <td style="padding: 8px;">₹${item.tax.toFixed(2)}</td>
            <td style="padding: 8px; font-size: 11px; color: #86868b;">${item.date} (${item.submittedAt})</td>
        `;
        tbody.appendChild(row);
    });
}

function filterFinancialRecordsByDate() {
    const selectedDate = document.getElementById("financial-calendar-filter").value;
    if (!selectedDate) return;

    metricResetActive = false;
    const filtered = finalizedRecords.filter(item => item.date === selectedDate || item.date.startsWith(selectedDate));
    renderFinalizedDataTable(filtered);
    renderFinancialCharts(filtered);
    updateDashboardMetrics(filtered);
}

function resetFinancialDateFilter() {
    document.getElementById("financial-calendar-filter").value = "";
    document.getElementById("financial-month-selector").value = "";
    metricResetActive = false;
    renderFinalizedDataTable(finalizedRecords);
    renderFinancialCharts(finalizedRecords);
    updateDashboardMetrics(finalizedRecords);
}

// Filter Financial Records by Month / Year
function filterFinancialByMonth() {
    const selectedMonth = document.getElementById("financial-month-selector").value; // Format: YYYY-MM
    if (!selectedMonth) return;

    metricResetActive = false;
    const filtered = finalizedRecords.filter(item => item.date.startsWith(selectedMonth));
    renderFinalizedDataTable(filtered);
    renderFinancialCharts(filtered);
    updateDashboardMetrics(filtered);
}

// Fresh Start Reset Metrics only (Does NOT delete main stored finalizedRecords data)
function resetMonthlyMetricsOnly() {
    metricResetActive = true;
    renderFinalizedDataTable(finalizedRecords);
    renderFinancialCharts(finalizedRecords);
    updateDashboardMetrics(finalizedRecords);
    alert("Financial metrics refreshed for a fresh start! Stored records remain safe.");
}

function renderFinancialCharts(recordsToUse) {
    const chartView = document.getElementById("financial-bar-chart-view");
    if (!chartView) return;

    if (metricResetActive || !recordsToUse || recordsToUse.length === 0) {
        chartView.innerHTML = `<span style="font-size: 13px; color: #86868b;">No data to display</span>`;
        return;
    }

    let totalSpent = recordsToUse.reduce((sum, i) => sum + i.price, 0);
    let totalTax = recordsToUse.reduce((sum, i) => sum + i.tax, 0);

    chartView.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="width: 35px; height: 100px; background: #0066cc; border-radius: 6px 6px 0 0;"></div>
            <span style="font-size: 11px; margin-top: 5px;">Spent (₹${totalSpent})</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="width: 35px; height: 60px; background: #28a745; border-radius: 6px 6px 0 0;"></div>
            <span style="font-size: 11px; margin-top: 5px;">Tax (₹${totalTax.toFixed(2)})</span>
        </div>
    `;
}

// Regional Insights with Day, Month, Year Filter support (No Reset button)
function updateRegionalInsights() {
    const selectedDate = document.getElementById("regional-calendar-filter") ? document.getElementById("regional-calendar-filter").value : "";
    const selectedMonth = document.getElementById("regional-month-filter") ? document.getElementById("regional-month-filter").value : "";
    
    let regionalRecords = finalizedRecords;
    if (selectedDate) {
        regionalRecords = regionalRecords.filter(item => item.date === selectedDate || item.date.startsWith(selectedDate));
    } else if (selectedMonth) {
        regionalRecords = regionalRecords.filter(item => item.date.startsWith(selectedMonth));
    }

    let totalSpent = regionalRecords.reduce((sum, i) => sum + i.price, 0);
    let totalTax = regionalRecords.reduce((sum, i) => sum + i.tax, 0);

    document.getElementById("reg-total-spending").innerText = `₹${totalSpent.toFixed(2)}`;
    document.getElementById("reg-total-tax").innerText = `₹${totalTax.toFixed(2)}`;

    const regTbody = document.getElementById("regional-table-body");
    if (regTbody) {
        if (regionalRecords.length === 0) {
            regTbody.innerHTML = `<tr><td colspan="4" style="padding: 10px; color: #86868b;">No records found</td></tr>`;
        } else {
            regTbody.innerHTML = "";
            regionalRecords.forEach(item => {
                const row = document.createElement("tr");
                row.style.borderBottom = "1px solid var(--border-color)";
                row.innerHTML = `
                    <td style="padding: 8px;">${item.name}</td>
                    <td style="padding: 8px;">₹${item.price.toFixed(2)}</td>
                    <td style="padding: 8px;">₹${item.tax.toFixed(2)}</td>
                    <td style="padding: 8px;">${item.date}</td>
                `;
                regTbody.appendChild(row);
            });
        }
    }

    const regChartView = document.getElementById("regional-chart-view");
    if (regChartView) {
        if (regionalRecords.length === 0) {
            regChartView.innerHTML = `<span style="font-size: 13px; color: #86868b;">No data to display</span>`;
        } else {
            regChartView.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <div style="width: 45px; height: 90px; background: #ff9500; border-radius: 6px 6px 0 0;"></div>
                    <span style="font-size: 11px; margin-top: 5px;">Tax Contributed (₹${totalTax.toFixed(2)})</span>
                </div>
            `;
        }
    }
}

function resetRegionalDateFilter() {
    if (document.getElementById("regional-calendar-filter")) {
        document.getElementById("regional-calendar-filter").value = "";
    }
    if (document.getElementById("regional-month-filter")) {
        document.getElementById("regional-month-filter").value = "";
    }
    updateRegionalInsights();
}

function loadUserProfileAndRegions() {
    const savedName = localStorage.getItem('user_name') || "User";
    const savedDp = localStorage.getItem('user_dp');

    document.getElementById("header-username-display").innerText = savedName;
    const headerAvatar = document.getElementById("header-user-avatar");
    const headerDefault = document.getElementById("header-default-avatar");

    if (savedDp) {
        headerAvatar.src = savedDp;
        headerAvatar.style.display = "block";
        headerDefault.style.display = "none";
    } else {
        headerAvatar.style.display = "none";
        headerDefault.style.display = "flex";
        headerDefault.innerText = savedName.charAt(0).toUpperCase();
    }

    if (document.getElementById("settings-fullname")) {
        document.getElementById("settings-fullname").value = localStorage.getItem('user_name') || "";
        document.getElementById("settings-email").value = localStorage.getItem('user_email') || "";
        document.getElementById("settings-phone").value = localStorage.getItem('user_phone') || "";
    }

    const regState = localStorage.getItem('reg_state') || "Uttar Pradesh";
    const regDistrict = localStorage.getItem('reg_district') || "Lucknow";
    const regCity = localStorage.getItem('reg_city') || "Central City";

    document.getElementById("filter-state").innerHTML = `<option value="${regState}">${regState}</option>`;
    document.getElementById("filter-district").innerHTML = `<option value="${regDistrict}">${regDistrict}</option>`;
    document.getElementById("filter-city").innerHTML = `<option value="${regCity}">${regCity}</option>`;
}

function removeProfilePhoto() {
    localStorage.removeItem('user_dp');
    loadUserProfileAndRegions();
    toggleProfileModal();
    alert("Profile photo removed.");
}

function clearAllUserData() {
    if (confirm("Are you sure you want to delete all your records and reset account data?")) {
        draftExpenses = [];
        finalizedRecords = [];
        localStorage.clear();
        renderDraftTable();
        updateDashboardMetrics([]);
        renderFinalizedDataTable([]);
        renderFinancialCharts([]);
        updateRegionalInsights();
        loadUserProfileAndRegions();
        toggleProfileModal();
        alert("All data wiped successfully.");
    }
}