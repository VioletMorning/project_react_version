import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useShop } from '../ShopContext.jsx';

export default function Login() {
  const navigate = useNavigate();
  const { loadProfile } = useShop();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api('/api/login', 'POST', { username, password });
      await loadProfile();
      // Go back to the page they were trying to open
      const next = sessionStorage.getItem('afterLogin') || '/';
      sessionStorage.removeItem('afterLogin');
      navigate(next, { replace: true });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <main className="page">
      <div className="panel">
        <h2>Log in</h2>
        <form onSubmit={submit}>
          <label>Username
            <input type="text" value={username} required autoComplete="username"
                   onChange={e => setUsername(e.target.value)} />
          </label>
          <label>Password
            <input type="password" value={password} required autoComplete="current-password"
                   onChange={e => setPassword(e.target.value)} />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={busy}>Log in</button>
        </form>
      </div>
    </main>
  );
}