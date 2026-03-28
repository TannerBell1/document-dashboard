import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import StatusBadge from '../components/StatusBadge'
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['#00C49F', '#4e9af1', '#FF8042', '#FF4444']

export default function DashboardPage() {
    const [documents, setDocuments] = useState([])
    const [statusData, setStatusData] = useState([])
    const [uploadedData, setUploadedData] = useState([])
    const [processedData, setProcessedData] = useState([])
    const [statusFilter, setStatusFilter] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [file, setFile] = useState(null)
    const [uploading, setUploading] = useState(false)
    const navigate = useNavigate()

    const fetchData = async () => {
        const [docs, status, uploaded, processed] = await Promise.all([
            api.get('/documents'),
            api.get('/analytics/status'),
            api.get('/analytics/uploaded'),
            api.get('/analytics/processed')
        ])
        setDocuments(docs.data)
        setStatusData(status.data)
        setUploadedData(uploaded.data)
        setProcessedData(processed.data)
    }

    useEffect(() => { fetchData() }, [])

    const handleUpload = async (selectedFile) => {
    if (!selectedFile) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', selectedFile)
    await api.post('/documents/upload', formData)
    setUploading(false)
    fetchData()
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    const filtered = documents.filter(doc => {
        const matchesStatus = statusFilter ? doc.status === statusFilter : true
        const matchesStart = startDate ? new Date(doc.created_at) >= new Date(startDate) : true
        const matchesEnd = endDate ? new Date(doc.created_at) <= new Date(endDate) : true
        return matchesStatus && matchesStart && matchesEnd
    })

    return (
        <div style={styles.page}>
            {/* Header */}
            <div style={styles.header}>
                <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
                <h1 style={styles.title}>Dashboard</h1>
                <div style={{ width: '80px' }} />
            </div>
            {/* Analytics */}
            <div style={styles.container}>
                <div style={styles.chartsRow}>
                    <div style={styles.chartCard}>
                        <h3 style={styles.chartTitle}>Uploads per Day</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={uploadedData}>
                                <XAxis 
                                    dataKey="day" 
                                    tick={{ fontSize: 11 }}
                                    tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="count" stroke="#4e9af1" strokeWidth={2} dot={true} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div style={styles.chartCard}>
                        <h3 style={styles.chartTitle}>Processed per Day</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={processedData}>
                                <XAxis 
                                    dataKey="day" 
                                    tick={{ fontSize: 11 }}
                                    tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="count" stroke="#00C49F" strokeWidth={2} dot={true} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                  <div style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>Status Distribution</h3>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ResponsiveContainer width="60%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        dataKey="count"
                                        nameKey="status"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                    >
                                        {statusData.map((_, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => {
                                        const total = statusData.reduce((sum, d) => sum + d.count, 0)
                                        return [`${Math.round((value / total) * 100)}%`]
                                    }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {statusData.map((entry, index) => {
                                    const total = statusData.reduce((sum, d) => sum + d.count, 0)
                                    const pct = total > 0 ? Math.round((entry.count / total) * 100) : 0
                                    return (
                                        <div key={entry.status} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: COLORS[index % COLORS.length] }} />
                                            <span>{entry.status} ({pct}%)</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Documents Section */}
            <div style={styles.tableCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <select style={styles.select} onChange={e => setStatusFilter(e.target.value)}>
                        <option value="">All Statuses</option>
                        <option value="uploaded">Uploaded</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                     </select>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '14px', color: '#666' }}>From</span>
                            <input type="date" style={styles.select} onChange={e => setStartDate(e.target.value)} />
                            <span style={{ fontSize: '14px', color: '#666' }}>To</span>
                            <input type="date" style={styles.select} onChange={e => setEndDate(e.target.value)} />
                        </div>
                    <input
                        type="file"
                        id="fileInput"
                        style={{ display: 'none' }}
                        onChange={e => {
                            const selectedFile = e.target.files[0]
                            setFile(selectedFile)
                            handleUpload(selectedFile)
                        }}
                    />
                    <button
                        style={styles.uploadBtn}
                        onClick={() => document.getElementById('fileInput').click()}
                    >
                        + Upload Document
                    </button>
                </div>

                <table style={styles.table}>
                    <thead>
                        <tr style={styles.tableHeadRow}>
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>Status</th>
                            <th style={styles.th}>Uploaded at</th>
                            <th style={styles.th}>Processed at</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(doc => (
                            <tr key={doc.id} style={styles.tr}>
                                <td style={styles.td}>{doc.original_name}</td>
                                <td style={styles.td}><StatusBadge status={doc.status} /></td>
                                <td style={styles.td}>{new Date(doc.created_at).toLocaleString()}</td>
                                <td style={styles.td}>{doc.processed_at ? new Date(doc.processed_at).toLocaleString() : '-'}</td>
                                <td style={styles.td}>
                                    <button style={styles.viewBtn} onClick={() => navigate(`/documents/${doc.id}`)}>
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const styles = {
    page: { minHeight: '100vh', background: '#f0f2f5' },
    header: {
        background: 'white',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        marginBottom: '32px',
    },
    title: { fontSize: '24px', fontWeight: '700' },
    logoutBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#666',
        fontSize: '14px',
    },
    container: { maxWidth: '1200px', margin: '0 auto', padding: '0 32px' },
    chartsRow: { display: 'flex', gap: '24px', marginBottom: '32px' },
    chartCard: {
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        flex: 1,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    },
    chartTitle: { fontSize: '16px', fontWeight: '600', marginBottom: '16px' },
    tableCard: {
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        marginBottom: '32px',
    },
    tableHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    tableTitle: { fontSize: '20px', fontWeight: '600' },
    uploadRow: { display: 'flex', alignItems: 'center', gap: '12px' },
    uploadBtn: {
        background: '#1a1a2e',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '10px 16px',
        cursor: 'pointer',
        fontWeight: '600',
    },
    filterRow: { marginBottom: '16px', display: 'flex', gap: '12px' },
    select: {
        padding: '8px 12px',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        fontSize: '14px',
    },
    table: { width: '100%', borderCollapse: 'collapse' },
    tableHeadRow: { borderBottom: '2px solid #f0f2f5' },
    th: { padding: '12px 16px', textAlign: 'left', fontSize: '14px', color: '#666' },
    tr: { borderBottom: '1px solid #f0f2f5' },
    td: { padding: '14px 16px', fontSize: '14px' },
    viewBtn: {
        background: 'none',
        border: '1px solid #e0e0e0',
        borderRadius: '6px',
        padding: '6px 12px',
        cursor: 'pointer',
        fontSize: '13px',
    },
}
