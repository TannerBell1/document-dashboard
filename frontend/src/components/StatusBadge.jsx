export default function StatusBadge({ status }) {
    const colors = {
        uploaded: { background: '#e3f2fd', color: '#1565c0' },
        processing: { background: '#fff3e0', color: '#e65100' },
        completed: { background: '#e8f5e9', color: '#2e7d32' },
        failed: { background: '#ffebee', color: '#c62828' },
    }

    const style = colors[status] || colors.uploaded

    return (
        <span style={{
            ...style,
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
        }}>
            {status}
        </span>
    )
}
