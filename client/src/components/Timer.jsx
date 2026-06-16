
import {
  useEffect,
  useRef,
  useState
} from 'react';

function Timer({
  seconds = 90,
  onTimeout
}) {
  const [timeLeft,
    setTimeLeft] =
    useState(seconds);

  const hasTimedOut =
    useRef(false);

  useEffect(() => {
    const interval =
      setInterval(() => {
        setTimeLeft(
          (prev) => {
            if (
              prev <= 1
            ) {
              clearInterval(
                interval
              );

              if (
                !hasTimedOut.current
              ) {
                hasTimedOut.current =
                  true;

                onTimeout();
              }

              return 0;
            }

            return (
              prev - 1
            );
          }
        );
      }, 1000);

    return () =>
      clearInterval(
        interval
      );
  }, [onTimeout]);

  const minutes =
    Math.floor(
      timeLeft / 60
    );

  const secondsPart =
    timeLeft % 60;

  return (
    <div
      style={{
        fontWeight:
          'bold',
        fontSize:
          '1.2rem',
        marginBottom:
          '1rem'
      }}
    >
      ⏱ Time Left:{' '}
      {minutes}:
      {String(
        secondsPart
      ).padStart(2, '0')}
    </div>
  );
}

export default Timer;


/*
import {
  useEffect,
  useState
} from 'react';

function Timer({
  seconds,
  onTimeout
}) {
  const [timeLeft,
    setTimeLeft] =
    useState(seconds);

  useEffect(() => {
    if (
      timeLeft <= 0
    ) {
      onTimeout();
      return;
    }

    const timer =
      setInterval(() => {
        setTimeLeft(
          (prev) =>
            prev - 1
        );
      }, 1000);

    return () =>
      clearInterval(
        timer
      );
  }, [
    timeLeft,
    onTimeout
  ]);

  return (
    <h5>
      Time Left:{' '}
      {timeLeft}s
    </h5>
  );
}

export default Timer;
*/