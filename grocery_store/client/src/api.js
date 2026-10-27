// EDIT to match login
export const LOGIN_URL = '/grocery_store/login'     //'/login.html';   // the page where people log in
export const TOKEN_KEY = 'token';         // only matters if your login saves a JWT in localStorage


export const money = (n) => '$' + Number(n).toFixed(2);
export const fmtDate = (d) => new Date(d + 'T00:00:00').toLocaleDateString();

function authHeaders() {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: 'Bearer ' + token } : {};
}

export async function api(url, method = 'GET', body) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json', ...authHeaders() }
  };
  if (body) options.body = JSON.stringify(body);
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(data.error || 'Something went wrong.');
    err.status = response.status;
    throw err;
  }
  return data;
}