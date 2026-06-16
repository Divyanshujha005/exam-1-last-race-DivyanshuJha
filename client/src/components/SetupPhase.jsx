import {
  Container,
  Button,
  Card
} from 'react-bootstrap';

function LinePill({ line }) {
  const isYellow =
    line?.name?.toLowerCase().includes('yellow');

  return (
    <span
      style={{
        backgroundColor: line?.color || '#6c757d',
        color: isYellow ? '#111' : '#fff',
        borderRadius: '999px',
        padding: '6px 14px',
        fontSize: '14px',
        fontWeight: 700,
        display: 'inline-block',
        marginRight: '8px',
        marginBottom: '8px'
      }}
    >
      {line?.name}
    </span>
  );
}

function MetroSvgMap({
  lines = []
}) {
  const getColor = (lineName) => {
    return (
      lines.find((line) => line.name === lineName)?.color ||
      '#999'
    );
  };

  const stations = {
    Central: {
      x: 120,
      y: 120,
      interchange: true
    },
    'Oak Square': {
      x: 260,
      y: 120
    },
    'East Gate': {
      x: 400,
      y: 120,
      interchange: true
    },
    'Silver Park': {
      x: 540,
      y: 120
    },

    Museum: {
      x: 540,
      y: 230
    },
    'City Hall': {
      x: 680,
      y: 230,
      interchange: true
    },
    'Green Cross': {
      x: 820,
      y: 230
    },

    'Hill Market': {
      x: 120,
      y: 310
    },
    'River End': {
      x: 260,
      y: 310,
      interchange: true
    },
    'West Point': {
      x: 120,
      y: 440
    },

    'North End': {
      x: 680,
      y: 360
    },
    'Sunset Avenue': {
      x: 680,
      y: 490
    }
  };

  const drawLine = (
    from,
    to,
    lineName
  ) => {
    const a = stations[from];
    const b = stations[to];

    return (
      <line
        key={`${from}-${to}-${lineName}`}
        x1={a.x}
        y1={a.y}
        x2={b.x}
        y2={b.y}
        stroke={getColor(lineName)}
        strokeWidth="10"
        strokeLinecap="round"
      />
    );
  };

  const drawStation = (name) => {
    const station = stations[name];

    return (
      <g key={name}>
        <circle
          cx={station.x}
          cy={station.y}
          r={station.interchange ? 14 : 9}
          fill="#fff"
          stroke="#111"
          strokeWidth={station.interchange ? 4 : 3}
        />

        <text
          x={station.x}
          y={station.y - 18}
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
        >
          {name}
        </text>

        {station.interchange && (
          <text
            x={station.x}
            y={station.y + 34}
            textAnchor="middle"
            fontSize="11"
            fill="#555"
          >
            interchange
          </text>
        )}
      </g>
    );
  };

  return (
    <div
      style={{
        overflowX: 'auto'
      }}
    >
      <svg
        width="920"
        height="560"
        viewBox="0 0 920 560"
        style={{
          background: '#f8f9fa',
          border: '1px solid #ddd',
          borderRadius: '14px'
        }}
      >
        {/* Red Line */}
        {drawLine('Central', 'Oak Square', 'Red Line')}
        {drawLine('Oak Square', 'East Gate', 'Red Line')}
        {drawLine('East Gate', 'Silver Park', 'Red Line')}

        {/* Blue Line */}
        {drawLine('Central', 'Hill Market', 'Blue Line')}
        {drawLine('Hill Market', 'River End', 'Blue Line')}
        {drawLine('River End', 'West Point', 'Blue Line')}

        {/* Green Line */}
        {drawLine('East Gate', 'Museum', 'Green Line')}
        {drawLine('Museum', 'City Hall', 'Green Line')}
        {drawLine('City Hall', 'Green Cross', 'Green Line')}

        {/* Yellow Line */}
        {drawLine('River End', 'City Hall', 'Yellow Line')}
        {drawLine('City Hall', 'North End', 'Yellow Line')}
        {drawLine('North End', 'Sunset Avenue', 'Yellow Line')}

        {Object.keys(stations).map(drawStation)}
      </svg>
    </div>
  );
}

function SetupPhase({
  gameData,
  onContinue
}) {
  return (
    <Container className="mt-4">
      <h2>Setup Phase</h2>

      <p>
        Study the full metro network before starting the game.
        During planning, connections will be hidden and you must
        reconstruct the route from the segment list.
      </p>

      <Card className="p-3 mb-4 shadow-sm border-0">
        <h4>Metro Network Map</h4>

        <p className="text-muted">
          Colored lines show the underground connections. Larger
          outlined stations are interchanges where line changes are
          allowed.
        </p>

        <MetroSvgMap
          lines={gameData?.lines || []}
        />
      </Card>

      <h4>Metro Lines</h4>

      <div className="mb-4">
        {gameData?.lines?.map((line) => (
          <LinePill
            key={line.id}
            line={line}
          />
        ))}
      </div>

      <Button onClick={onContinue}>
        Start Planning
      </Button>
    </Container>
  );
}

export default SetupPhase;