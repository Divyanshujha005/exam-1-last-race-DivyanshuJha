import {
  useEffect,
  useState
} from 'react';

import {
  Container,
  Spinner,
  Alert
} from 'react-bootstrap';

import * as API from './API';

import NavigationBar from './components/NavigationBar';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import RankingPage from './pages/RankingPage';

function App() {
  /* -----------------------------
     GLOBAL STATE
  ----------------------------- */

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [
    errorMsg,
    setErrorMsg
  ] = useState('');

  const [page, setPage] =
    useState('home');

  const [
    gameData,
    setGameData
  ] = useState(null);

  const [
    resultData,
    setResultData
  ] = useState(null);

  /* -----------------------------
     SESSION CHECK
  ----------------------------- */

  useEffect(() => {
    const checkAuth =
      async () => {
        try {
          const currentUser =
            await API.getUserInfo();

          setUser(
            currentUser
          );
        } catch {
          setUser(null);
        } finally {
          setLoading(
            false
          );
        }
      };

    checkAuth();
  }, []);

  /* -----------------------------
     LOGIN
  ----------------------------- */

  const handleLogin =
    async (
      credentials
    ) => {
      try {
        setErrorMsg('');

        const loggedUser =
          await API.logIn(
            credentials
          );

        setUser(
          loggedUser
        );

        setPage(
          'home'
        );
      } catch (
        err
      ) {
        setErrorMsg(
          err.error ||
            'Invalid credentials'
        );
      }
    };

  /* -----------------------------
     LOGOUT
  ----------------------------- */

  const handleLogout =
    async () => {
      try {
        await API.logOut();
      } catch {
        // ignore
      }

      setUser(null);
      setGameData(
        null
      );
      setResultData(
        null
      );
      setPage(
        'home'
      );
      setErrorMsg('');
    };

  /* -----------------------------
     PROTECTED NAVIGATION
  ----------------------------- */

  const navigate = (
    targetPage
  ) => {
    const protectedPages =
      [
        'game',
        'ranking'
      ];

    if (
      protectedPages.includes(
        targetPage
      ) &&
      !user
    ) {
      setPage(
        'home'
      );
      return;
    }

    setPage(
      targetPage
    );
  };

  /* -----------------------------
     START GAME
  ----------------------------- */

  const handleStartGame =
    async () => {
      try {
        setErrorMsg('');

        setResultData(
          null
        );

        const game =
          await API.startGame();

        setGameData(
          game
        );

        setPage(
          'game'
        );
      } catch (
        err
      ) {
        console.error(
          err
        );

        setErrorMsg(
          'Could not start game'
        );
      }
    };

  /* -----------------------------
     SUBMIT ROUTE
  ----------------------------- */

  const handleSubmitRoute =
    async (
      routeSegments
    ) => {
      try {
        const result =
          await API.submitRoute(
            routeSegments,
            gameData
              .startStation
              .id,
            gameData
              .destinationStation
              .id
          );

        setResultData(
          result
        );
      } catch (
        err
      ) {
        console.error(
          err
        );

        setErrorMsg(
          'Failed to submit route'
        );
      }
    };

  /* -----------------------------
     LOADING
  ----------------------------- */

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  /* -----------------------------
     UI
  ----------------------------- */

  return (
    <>
      <NavigationBar
        user={user}
        setPage={
          navigate
        }
        onLogout={
          handleLogout
        }
      />

      <Container className="mt-4">
        {errorMsg && (
          <Alert
            variant="danger"
            dismissible
            onClose={() =>
              setErrorMsg(
                ''
              )
            }
          >
            {
              errorMsg
            }
          </Alert>
        )}

        {page ===
          'login' && (
          <LoginPage
            onLogin={
              handleLogin
            }
            errorMsg={
              errorMsg
            }
          />
        )}

        {page ===
          'home' && (
          <HomePage
            user={user}
            onStartGame={
              handleStartGame
            }
            goToLogin={() =>
              navigate(
                'login'
              )
            }
          />
        )}

        {page ===
          'game' &&
          gameData && (
            <GamePage
              gameData={
                gameData
              }
              resultData={
                resultData
              }
              onSubmitRoute={
                handleSubmitRoute
              }
              playAgain={
                handleStartGame
              }
            />
          )}

        {page ===
          'ranking' &&
          user && (
            <RankingPage />
          )}
      </Container>
    </>
  );
}

export default App;