function SegmentList({
  selectedSegments = [],
  segments = []
}) {
  const chosenSegments =
    segments.filter(
      (segment) =>
        selectedSegments.includes(
          segment.id
        )
    );

  if (
    chosenSegments.length ===
    0
  ) {
    return (
      <p>
        No segments
        selected
      </p>
    );
  }

  return (
    <ul className="list-group">
      {chosenSegments.map(
        (segment) => (
          <li
            key={
              segment.id
            }
            className="list-group-item"
          >
            {
              segment.station1_name
            }{' '}
            —{' '}
            {
              segment.station2_name
            }
          </li>
        )
      )}
    </ul>
  );
}

export default SegmentList;