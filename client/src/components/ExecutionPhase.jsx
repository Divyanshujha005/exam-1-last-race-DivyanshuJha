
import {
  useMemo,
  useState
} from 'react';

import {
  Card,
  Button,
  Alert,
  Badge
} from 'react-bootstrap';

function ExecutionPhase({
  resultData,
  gameData,
  onFinish
}) {
  const [stepIndex,
    setStepIndex] =
    useState(0);

  /* -----------------------------
     INVALID ROUTE
  ----------------------------- */

  if (!resultData.valid) {
    return (
      <Card>
        <Card.Body>
          <Alert variant="danger">
            <h4>
              Invalid or
              incomplete
              route
            </h4>

            <p>
              The route
              could not be
              executed.
            </p>

            <h5>
              Final Score:
              0 coins
            </h5>
          </Alert>

          <Button
            onClick={
              onFinish
            }
          >
            Continue
          </Button>
        </Card.Body>
      </Card>
    );
  }

  const stationMap =
    useMemo(() => {
      const map = {};

      gameData.stations.forEach(
        (station) => {
          map[
            station.id
          ] =
            station.name;
        }
      );

      return map;
    }, [
      gameData.stations
    ]);

  const currentStep =
    resultData
      .executionSteps[
      stepIndex
    ];

  const isLastStep =
    stepIndex ===
    resultData
      .executionSteps
      .length -
      1;

  const nextStep =
    () => {
      if (
        isLastStep
      ) {
        onFinish();
      } else {
        setStepIndex(
          (
            prev
          ) =>
            prev +
            1
        );
      }
    };

  return (
    <Card>
      <Card.Body>
        <Card.Title>
          Journey
          Execution
        </Card.Title>

        <p>
          Step{' '}
          {stepIndex +
            1}{' '}
          of{' '}
          {
            resultData
              .executionSteps
              .length
          }
        </p>

        <Card className="mb-3">
          <Card.Body>
            <h5>
              Route
              Segment
            </h5>

            <Badge bg="primary">
              {
                stationMap[
                  currentStep
                    .from
                ]
              }
            </Badge>

            {' → '}

            <Badge bg="success">
              {
                stationMap[
                  currentStep
                    .to
                ]
              }
            </Badge>
          </Card.Body>
        </Card>

        <Alert
          variant={
            currentStep
              .event
              .coins_effect >=
            0
              ? 'success'
              : 'danger'
          }
        >
          <h5>
            Random
            Event
          </h5>

          <p>
            {
              currentStep
                .event
                .description
            }
          </p>

          <strong>
            Coin
            Effect:{' '}
            {
              currentStep
                .event
                .coins_effect
            }
          </strong>
        </Alert>

        <h4>
          Coins:{' '}
          {
            currentStep.coins
          }
        </h4>

        <Button
          onClick={
            nextStep
          }
        >
          {isLastStep
            ? 'Finish'
            : 'Next Step'}
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ExecutionPhase;


/*
import {
  useState
} from 'react';

import {
  Card,
  Button
} from 'react-bootstrap';

function ExecutionPhase({
  resultData,
  onFinish
}) {
  const [index,
    setIndex] =
    useState(0);

  const steps =
    resultData.executionSteps;

  if (
    !resultData.valid
  ) {
    return (
      <Card>
        <Card.Body>
          <h3>
            Invalid
            Route
          </h3>

          <p>
            Score: 0
          </p>

          <Button
            onClick={
              onFinish
            }
          >
            Continue
          </Button>
        </Card.Body>
      </Card>
    );
  }

  const currentStep =
    steps[index];

  const nextStep =
    () => {
      if (
        index ===
        steps.length -
          1
      ) {
        onFinish();
      } else {
        setIndex(
          index + 1
        );
      }
    };

  return (
    <Card>
      <Card.Body>
        <Card.Title>
          Journey
          Execution
        </Card.Title>

        <p>
          Event:{' '}
          {
            currentStep
              .event
              .description
          }
        </p>

        <p>
          Coins:{' '}
          {
            currentStep.coins
          }
        </p>

        <Button
          onClick={
            nextStep
          }
        >
          Next Step
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ExecutionPhase;
*/