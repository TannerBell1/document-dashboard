import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'

// Setup useState for username, password, and error message
export default function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

// Handle login logic
    const handleLogin = async () => {
        try {
            const res = await api.post('/auth/login', { username, password })
            localStorage.setItem('token', res.data.token)
            navigate('/dashboard')
        } catch {
            setError('Invalid username or password')
        }
    }

    // Render the login form
    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h1 style={styles.title}>Welcome</h1>
                <p style={styles.subtitle}>Sign in to your account</p>

                {error && <p style={styles.error}>{error}</p>}

                <div style={styles.field}>
                    <label style={styles.label}>Username</label>
                    <input
                        style={styles.input}
                        placeholder="Enter your username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </div>

                <div style={styles.field}>
                    <label style={styles.label}>Password</label>
                    <input
                        style={styles.input}
                        placeholder="Enter your password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>

                <button style={styles.button} onClick={handleLogin}>
                    Sign In
                </button>
            </div>
        </div>
    )
}

// Inline styles for the login page
const styles = {
    page: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        width: '400px',
    },
    title: {
        fontSize: '28px',
        fontWeight: '700',
        marginBottom: '8px',
        textAlign: 'center',
    },
    subtitle: {
        color: '#666',
        textAlign: 'center',
        marginBottom: '32px',
    },
    field: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '500',
    },
    input: {
        width: '100%',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        background: '#f5f5f5',
        fontSize: '14px',
    },
    button: {
        width: '100%',
        padding: '14px',
        background: '#1a1a2e',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '8px',
    },
    error: {
        color: 'red',
        marginBottom: '16px',
        textAlign: 'center',
    }
}