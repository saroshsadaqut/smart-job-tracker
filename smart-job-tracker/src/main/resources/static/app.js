const API_BASE_URL = 'http://localhost:8080/api';

const loginContainer = document.getElementById('login-container');
const dashboardContainer = document.getElementById('dashboard-container');
const tableBody = document.querySelector('#applications-table tbody');

if (sessionStorage.getItem('jwt')) showDashboard();

document.getElementById('register-btn').addEventListener('click', async () => {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: u, password: p })
    });
    if(res.ok) alert('Registered! Now you can login.');
    else alert('Registration failed. Username might exist.');
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: u, password: p })
    });
    if (res.ok) {
        const data = await res.json();
        sessionStorage.setItem('jwt', data.token);
        showDashboard();
    } else document.getElementById('login-error').style.display = 'block';
});

document.getElementById('logout-btn').addEventListener('click', () => {
    sessionStorage.removeItem('jwt');
    loginContainer.style.display = 'block';
    dashboardContainer.style.display = 'none';
});

function showDashboard() {
    loginContainer.style.display = 'none';
    dashboardContainer.style.display = 'block';
    fetchApplications();
}

async function fetchWithAuth(url, options = {}) {
    return fetch(url, { ...options, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`, ...options.headers } });
}

async function fetchApplications() {
    const res = await fetchWithAuth(`${API_BASE_URL}/applications`);
    if (res.status === 403) return document.getElementById('logout-btn').click();
    const apps = await res.json();

    tableBody.innerHTML = apps.map(app => `
        <tr>
            <td>${app.company}</td>
            <td>${app.role}</td>
            <td>${app.location || 'N/A'}</td>
            <td>${app.packageAmount || 'N/A'}</td>
            <td>${app.appliedDate}</td>
            <td>
                <select onchange="updateStatus(${app.id}, this.value)">
                    <option value="APPLIED" ${app.status==='APPLIED'?'selected':''}>Applied</option>
                    <option value="OA" ${app.status==='OA'?'selected':''}>OA</option>
                    <option value="INTERVIEW" ${app.status==='INTERVIEW'?'selected':''}>Interview</option>
                    <option value="OFFER" ${app.status==='OFFER'?'selected':''}>Offer</option>
                    <option value="REJECTED" ${app.status==='REJECTED'?'selected':''}>Rejected</option>
                </select>
            </td>
            <td><button onclick="deleteApp(${app.id})">Delete</button></td>
        </tr>`).join('');
}

document.getElementById('add-app-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await fetchWithAuth(`${API_BASE_URL}/applications`, {
        method: 'POST', body: JSON.stringify({
            company: document.getElementById('company').value, role: document.getElementById('role').value,
            location: document.getElementById('location').value, packageAmount: document.getElementById('packageAmt').value,
            appliedDate: document.getElementById('appliedDate').value
        })
    });
    document.getElementById('add-app-form').reset();
    fetchApplications();
});

async function updateStatus(id, s) { await fetchWithAuth(`${API_BASE_URL}/applications/${id}/status?status=${s}`, { method: 'PATCH' }); }
async function deleteApp(id) { await fetchWithAuth(`${API_BASE_URL}/applications/${id}`, { method: 'DELETE' }); fetchApplications(); }