import { useEffect, useRef, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ListGroup
} from 'react-bootstrap';

import Timer from './Timer';

function LinePill({ line }) {
  const isYellow =
    line?.name?.toLowerCase().includes('yellow');

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

function PlanningPhase({
  gameData,
  selectedSegments,
  setSelectedSegments,
  onSubmit
}) {
  const [timeLeft, setTimeLeft] = useState(90);
  const submittedRef = useRef(false);

  useEffect(() => {
    if (timeLeft <= 0 && !submittedRef.current) {
      submittedRef.current = true;
      onSubmit(selectedSegments);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, selectedSegments, onSubmit]);

  const addSegment = (segmentId) => {
    if (selectedSegments.includes(segmentId)) return;

    setSelectedSegments((prev) => [
      ...prev,
      segmentId
    ]);
  };

  const undoLast = () => {
    setSelectedSegments((prev) =>
      prev.slice(0, -1)
    );
  };

  const clearRoute = () => {
    setSelectedSegments([]);
  };

  const submitRoute = () => {
    if (submittedRef.current) return;

    submittedRef.current = true;
    onSubmit(selectedSegments);
  };

  const selectedRoute = selectedSegments
    .map((id) =>
      gameData?.segments?.find((s) => s.id === id)
    )
    .filter(Boolean);

  return (
    <Container className="mt-4">
      <h2>Planning Phase</h2>

      <Timer timeLeft={timeLeft} />

      <Card className="p-3 mb-4 shadow-sm border-0">
        <h5>Assigned Journey</h5>

        <p>
          <strong>Start:</strong>{' '}
          {gameData?.startStation?.name}
        </p>

        <p className="mb-0">
          <strong>Destination:</strong>{' '}
          {gameData?.destinationStation?.name}
        </p>
      </Card>

      <Row>
        <Col md={5}>
          <Card className="p-3 shadow-sm border-0 mb-3">
            <h4>Station Map</h4>

            <p className="text-muted">
              Station names are shown only. The player must reconstruct
              the network from the segment list.
            </p>

            <div className="d-flex flex-wrap gap-2">
              {gameData?.stations?.map((station) => (
                <span
                  key={station.id}
                  style={{
                    backgroundColor: '#fff',
                    color: '#111',
                    border: station.is_interchange
                      ? '2px solid #111'
                      : '1px solid #ccc',
                    borderRadius: '999px',
                    padding: '6px 12px',
                    fontWeight: station.is_interchange ? 700 : 500
                  }}
                >
                  {station.name}
                  {station.is_interchange ? ' ⟲' : ''}
                </span>
              ))}
            </div>
          </Card>

          <Card className="p-3 shadow-sm border-0">
            <h4>Your Route</h4>

            {selectedRoute.length === 0 ? (
              <p>No segments selected</p>
            ) : (
              <ListGroup>
                {selectedRoute.map((segment, index) => (
                  <ListGroup.Item key={segment.id}>
                    <strong>{index + 1}.</strong>{' '}
                    {segment.station1_name} — {segment.station2_name}

                    <div>
                      {segment.lines?.map((line) => (
                        <LinePill key={line.id} line={line} />
                      ))}
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}

            <div className="d-flex gap-2 mt-3 flex-wrap">
              <Button variant="secondary" onClick={clearRoute}>
                Clear
              </Button>

              <Button
                variant="warning"
                onClick={undoLast}
                disabled={selectedSegments.length === 0}
              >
                Undo Last
              </Button>

              <Button variant="success" onClick={submitRoute}>
                Submit Route
              </Button>
            </div>
          </Card>
        </Col>

        <Col md={7}>
          <Card className="p-3 shadow-sm border-0">
            <h4>All Available Segments</h4>

            <p className="text-muted">
              Select segment pairs in sequence to build your route.
              The server validates connectivity and line changes.
            </p>

            <ListGroup>
              {gameData?.segments?.map((segment) => {
                const selected =
                  selectedSegments.includes(segment.id);

                return (
                  <ListGroup.Item
                    key={segment.id}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>
                        {segment.station1_name} — {segment.station2_name}
                      </strong>

                      <div>
                        {segment.lines?.map((line) => (
                          <LinePill key={line.id} line={line} />
                        ))}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      disabled={selected}
                      onClick={() => addSegment(segment.id)}
                    >
                      {selected ? 'Added' : 'Add'}
                    </Button>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default PlanningPhase;