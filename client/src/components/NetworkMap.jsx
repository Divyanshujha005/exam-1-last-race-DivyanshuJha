function LinePill({ line }) {
  const isYellow = line?.name?.toLowerCase().includes('yellow');

  return (
    <span
      style={{
        backgroundColor: line?.color || '#6c757d',
        color: isYellow ? '#111' : '#fff',
        borderRadius: '999px',
        padding: '4px 10px',
        fontSize: '12px',
        fontWeight: 700,
        display: 'inline-block',
        marginRight: '6px',
        marginTop: '4px'
      }}
    >
      {line?.name}
    </span>
  );
}

function NetworkMap({
  connections = [],
  selectedSegments = [],
  onSelectSegment,
  interactive = false
}) {
  return (
    <div>
      {connections.map((segment) => {
        const selected = selectedSegments.includes(segment.id);
        const mainLine = segment.lines?.[0];

        return (
          <div
            key={segment.id}
            style={{
              border: '1px solid #ddd',
              borderLeft: `8px solid ${mainLine?.color || '#999'}`,
              borderRadius: '12px',
              padding: '12px',
              marginBottom: '10px',
              backgroundColor: selected ? '#eef6ff' : '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
          >
            <div
              style={{
                fontWeight: 700,
                display: 'flex',
                gap: '10px',
                alignItems: 'center'
              }}
            >
              <span>{segment.station1_name}</span>
              <span>—</span>
              <span>{segment.station2_name}</span>
            </div>

            <div>
              {segment.lines?.map((line) => (
                <LinePill key={line.id} line={line} />
              ))}
            </div>

            {interactive && (
              <button
                onClick={() => onSelectSegment?.(segment.id)}
                disabled={selected}
                style={{
                  marginTop: '8px',
                  backgroundColor: selected ? '#999' : '#111827',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 14px'
                }}
              >
                {selected ? 'Added' : 'Add'}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default NetworkMap;