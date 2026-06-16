
import {
  useEffect,
  useState
} from 'react';

import SetupPhase from '../components/SetupPhase';
import PlanningPhase from '../components/PlanningPhase';
import ExecutionPhase from '../components/ExecutionPhase';
import ResultPhase from '../components/ResultPhase';

function GamePage({
  gameData,
  resultData,
  onSubmitRoute,
  playAgain
}) {
  const [phase,
    setPhase] =
    useState(
      'setup'
    );

  const [
    selectedSegments,
    setSelectedSegments
  ] = useState(
    []
  );

  /* -----------------------------
     RESET STATE
     WHEN NEW GAME STARTS
  ----------------------------- */

  useEffect(() => {
    setPhase(
      'setup'
    );

    setSelectedSegments(
      []
    );
  }, [gameData]);

  /* -----------------------------
     SETUP → PLANNING
  ----------------------------- */

  const startPlanning =
    () => {
      setPhase(
        'planning'
      );
    };

  /* -----------------------------
     PLANNING → EXECUTION
  ----------------------------- */

  const submitRoute =
    async (
      segments
    ) => {
      await onSubmitRoute(
        segments
      );

      setPhase(
        'execution'
      );
    };

  /* -----------------------------
     EXECUTION → RESULT
  ----------------------------- */

  const finishExecution =
    () => {
      setPhase(
        'result'
      );
    };

  return (
    <>
      {phase ===
        'setup' && (
        <SetupPhase
          gameData={
            gameData
          }
          onContinue={
            startPlanning
          }
        />
      )}

      {phase ===
        'planning' && (
        <PlanningPhase
          gameData={
            gameData
          }
          selectedSegments={
            selectedSegments
          }
          setSelectedSegments={
            setSelectedSegments
          }
          onSubmit={
            submitRoute
          }
        />
      )}

      {phase ===
        'execution' &&
        resultData && (
          <ExecutionPhase
            resultData={
              resultData
            }
            gameData={
              gameData
            }
            onFinish={
              finishExecution
            }
          />
        )}

      {phase ===
        'result' &&
        resultData && (
          <ResultPhase
            resultData={
              resultData
            }
            playAgain={
              playAgain
            }
          />
        )}
    </>
  );
}

export default GamePage;

/*
import { useState } from 'react';

import SetupPhase from '../components/SetupPhase';
import PlanningPhase from '../components/PlanningPhase';
import ExecutionPhase from '../components/ExecutionPhase';
import ResultPhase from '../components/ResultPhase';

function GamePage({
  gameData,
  resultData,
  onSubmitRoute,
  playAgain
}) {
  const [phase, setPhase] =
    useState('setup');

  const [selectedSegments,
    setSelectedSegments] =
    useState([]);

  // -----------------------------
  //   SETUP → PLANNING
  //----------------------------- 

  const startPlanning =
    () => {
      setPhase(
        'planning'
      );
    };

  // -----------------------------
  //   SUBMIT ROUTE
  //----------------------------- 

  const submitRoute =
    async (
      segments
    ) => {
      await onSubmitRoute(
        segments
      );

      setPhase(
        'execution'
      );
    };

  // -----------------------------
  //   EXECUTION → RESULT
  //----------------------------- 

  const finishExecution =
    () => {
      setPhase(
        'result'
      );
    };

  //-----------------------------
  //   UI
  //----------------------------- 

  return (
    <>
      {phase ===
        'setup' && (
        <SetupPhase
          gameData={
            gameData
          }
          onContinue={
            startPlanning
          }
        />
      )}

      {phase ===
        'planning' && (
        <PlanningPhase
          gameData={
            gameData
          }
          selectedSegments={
            selectedSegments
          }
          setSelectedSegments={
            setSelectedSegments
          }
          onSubmit={
            submitRoute
          }
        />
      )}

      {phase ===
        'execution' &&
        resultData && (
          <ExecutionPhase
            resultData={
              resultData
            }
            onFinish={
              finishExecution
            }
          />
        )}

      {phase ===
        'result' &&
        resultData && (
          <ResultPhase
            resultData={
              resultData
            }
            playAgain={
              playAgain
            }
          />
        )}
    </>
  );
}

export default GamePage;
*/