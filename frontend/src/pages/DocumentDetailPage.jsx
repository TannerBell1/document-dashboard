import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/client'
import StatusBadge from '../components/StatusBadge'

export default function DocumentDetailPage() {
    const { id } = useParams()
    const [document, setDocument] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        api.get(`/documents/${id}`).then(res => setDocument(res.data))
    }, [id])

    if (!document) return <p style={{ padding: '32px' }}>Loading...</p>

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
                    ← Back to Dashboard
                </button>

                <div style={styles.card}>
                    <h1 style={styles.filename}>{document.original_name}</h1>

                    <div style={styles.metaRow}>
                        <div style={styles.metaItem}>
                            <span style={styles.metaLabel}>Status</span>
                            <StatusBadge status={document.status} />
                        </div>
                        <div style={styles.metaItem}>
                            <span style={styles.metaLabel}>Word Count</span>
                            <span style={styles.metaValue}>{document.word_count ?? 'N/A'}</span>
                        </div>
                        <div style={styles.metaItem}>
                            <span style={styles.metaLabel}>Uploaded At</span>
                            <span style={styles.metaValue}>{new Date(document.created_at).toLocaleString()}</span>
                        </div>
                        <div style={styles.metaItem}>
                            <span style={styles.metaLabel}>Processed At</span>
                            <span style={styles.metaValue}>
                                {document.processed_at ? new Date(document.processed_at).toLocaleString() : 'Not yet processed'}
                            </span>
                        </div>
                    </div>

                    {document.preview && (
                        <div style={styles.section}>
                            <h3 style={styles.sectionTitle}>Preview</h3>
                            <p style={styles.sectionContent}>{document.preview}</p>
                        </div>
                    )}

                    {document.summary && (
                        <div style={styles.section}>
                            <h3 style={styles.sectionTitle}>Summary</h3>
                            <p style={styles.sectionContent}>{document.summary}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const styles = {
    page: { minHeight: '100vh', background: '#f0f2f5', padding: '32px' },
    container: { maxWidth: '800px', margin: '0 auto' },
    backBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#666',
        fontSize: '14px',
        marginBottom: '24px',
        padding: '0',
    },
    card: {
        background: 'white',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    },
    filename: { fontSize: '24px', fontWeight: '700', marginBottom: '24px' },
    metaRow: {
        display: 'flex',
        gap: '32px',
        marginBottom: '32px',
        flexWrap: 'wrap',
    },
    metaItem: { display: 'flex', flexDirection: 'column', gap: '8px' },
    metaLabel: { fontSize: '12px', color: '#666', fontWeight: '500', textTransform: 'uppercase' },
    metaValue: { fontSize: '14px', fontWeight: '500' },
    section: {
        borderTop: '1px solid #f0f2f5',
        paddingTop: '24px',
        marginTop: '24px',
    },
    sectionTitle: { fontSize: '16px', fontWeight: '600', marginBottom: '12px' },
    sectionContent: { fontSize: '14px', color: '#444', lineHeight: '1.6' },
}