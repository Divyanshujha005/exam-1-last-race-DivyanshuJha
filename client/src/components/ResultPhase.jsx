import {
  Container,
  Card,
  Button,
  Alert
} from 'react-bootstrap';

function ResultPhase({
  resultData,
  playAgain
}) {
  const rawScore =
    Number(
      resultData?.finalScore ??
      resultData?.score ??
      0
    );

  const finalScore =
    Math.max(rawScore, 0);

  const isValid =
    resultData?.valid === true;

  return (
    <Container className="mt-4">
      <h2>Game Result</h2>

      <Card className="p-4 text-center shadow-sm border-0">
        {!isValid && (
          <Alert variant="danger">
            Invalid or incomplete route. You lost all coins.
          </Alert>
        )}

        {isValid && (
          <Alert variant="success">
            Route completed successfully.
          </Alert>
        )}

        <h3>Final Score</h3>

        <h1>
          {finalScore} coins
        </h1>

        <Button
          className="mt-3"
          onClick={playAgain}
        >
          Start New Game
        </Button>
      </Card>
    </Container>
  );
}

export default ResultPhase;