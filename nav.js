// --- 1. PIN Security Middleware ---
(function checkSecurity() {
    const sec = JSON.parse(localStorage.getItem('sysSecurity')) || { pin: "", enabled: false };
    const path = window.location.pathname;
    const currentPage = path.split("/").pop() || "index.html";

    // Define which pages require authorization
    const lockedPages = ["inventory.html", "reports.html", "settings.html", "suppliers.html"];

    if (sec.enabled && lockedPages.includes(currentPage)) {
        const authStatus = sessionStorage.getItem("erp_authenticated");

        if (authStatus !== "granted") {
            const userInput = prompt("🔐 Restricted Access\nPlease enter your 4-digit System PIN:");
            
            if (userInput === sec.pin) {
                sessionStorage.setItem("erp_authenticated", "granted");
            } else {
                alert("❌ Incorrect PIN. Access Denied.");
                window.location.href = "index.html"; // Kick back to Dashboard
            }
        }
    }
})();

// --- 2. Navigation Component Injected on Page Load ---
document.addEventListener("DOMContentLoaded", () => {
    const biz = JSON.parse(localStorage.getItem('bizProfile')) || { name: "Enterprise ERP" };
    const sec = JSON.parse(localStorage.getItem('sysSecurity')) || { enabled: false };

    // Create Navigation HTML
    const navHTML = `
    <style>
        :root {
            --sidebar: #1e293b;
            --primary: #6366f1;
            --accent: #10b981;
            --danger: #ef4444;
            --text-light: #f8fafc;
        }
        body { margin: 0; padding-left: 260px; font-family: 'Segoe UI', sans-serif; background: #f1f5f9; }
        .sidebar {
            width: 240px; background: var(--sidebar); height: 100vh;
            position: fixed; left: 0; top: 0; padding: 20px; color: var(--text-light);
            display: flex; flex-direction: column;
        }
        .nav-brand { font-size: 1.4rem; font-weight: bold; margin-bottom: 30px; color: var(--primary); display: flex; align-items: center; gap: 10px; }
        .nav-item { 
            text-decoration: none; color: #94a3b8; padding: 12px 15px; 
            border-radius: 8px; margin-bottom: 5px; display: block; transition: 0.3s;
        }
        .nav-item:hover { background: #334155; color: white; }
        .nav-item.active { background: var(--primary); color: white; }
        .container { padding: 30px; max-width: 1200px; margin: auto; }
        .card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); margin-bottom: 20px; }
        .btn { border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; color: white; background: var(--primary); font-weight: 600; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { text-align: left; padding: 12px; border-bottom: 1px solid #e2e8f0; }
        th { background: #f8fafc; color: #64748b; font-size: 0.85rem; text-transform: uppercase; }
        input, select, textarea { padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; margin-top: 5px; width: 100%; box-sizing: border-box; }
        label { font-size: 0.85rem; font-weight: 600; color: #475569; }
    </style>
    
    <div class="sidebar">
        <div class="nav-brand">
            ${biz.logo ? `<img src="${biz.logo}" style="width:30px; height:30px; border-radius:4px;">` : '📦'}
            <span>${biz.name.substring(0, 15)}</span>
        </div>
        <a href="index.html" class="nav-item" id="nav-index">📊 Dashboard</a>
        <a href="pos.html" class="nav-item" id="nav-pos">🛒 POS Terminal</a>
        <a href="inventory.html" class="nav-item" id="nav-inventory">📦 Inventory</a>
        <a href="customers.html" class="nav-item" id="nav-customers">👥 Customers</a>
        <a href="suppliers.html" class="nav-item" id="nav-suppliers">🚚 Suppliers</a>
        <a href="reports.html" class="nav-item" id="nav-reports">📈 Reports & Audit</a>
        <a href="settings.html" class="nav-item" id="nav-settings">⚙️ Settings</a>
        
        <div style="margin-top: auto; padding-top: 20px; border-top: 1px solid #334155;">
            ${sec.enabled ? `<button onclick="logout()" class="btn" style="background:var(--danger); width:100%;">🔒 Lock System</button>` : ''}
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML("afterbegin", navHTML);

    // Set Active State
    const current = window.location.pathname.split("/").pop() || "index.html";
    const activeLink = document.getElementById("nav-" + current.replace(".html", ""));
    if (activeLink) activeLink.classList.add("active");
});

// Logout Function
function logout() {
    sessionStorage.removeItem("erp_authenticated");
    window.location.href = "index.html";
}