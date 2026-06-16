
import {
  Card,
  Button,
  Alert
} from 'react-bootstrap';

function HomePage({
  user,
  onStartGame,
  goToLogin
}) {
  return (
    <>
      {/* GAME INFO */}

      <Card className="mb-4">
        <Card.Body>
          <Card.Title>
            Welcome to
            Last Race
          </Card.Title>

          <Card.Text>
            Build a valid
            underground
            route before
            time runs out.
            During the
            journey,
            random events
            will increase
            or decrease
            your coins.
          </Card.Text>

          <h5>
            Rules
          </h5>

          <ul>
            <li>
              Start with{' '}
              <strong>
                20 coins
              </strong>
            </li>

            <li>
              Plan your
              route in{' '}
              <strong>
                90 seconds
              </strong>
            </li>

            <li>
              Segments
              cannot be
              reused
            </li>

            <li>
              Reach the
              destination
              with the
              highest
              score
            </li>
          </ul>
        </Card.Body>
      </Card>

      {/* ANONYMOUS */}

      {!user && (
        <Alert variant="info">
          <h5>
            Login
            Required
          </h5>

          <p>
            Anonymous
            users can
            only read the
            game
            instructions.
          </p>

          <p>
            Login to play
            games and
            access the
            ranking.
          </p>

          <Button
            onClick={
              goToLogin
            }
          >
            Login
          </Button>
        </Alert>
      )}

      {/* LOGGED USER */}

      {user && (
        <Card>
          <Card.Body>
            <h4>
              Welcome{' '}
              {
                user.username
              }
            </h4>

            <p>
              Ready for
              another
              race?
            </p>

            <Button
              size="lg"
              onClick={
                onStartGame
              }
            >
              Start New
              Game
            </Button>
          </Card.Body>
        </Card>
      )}
    </>
  );
}

export default HomePage;


/*
import {
  Card,
  Button
} from 'react-bootstrap';

function HomePage({
  user,
  onStartGame,
  goToLogin
}) {
  return (
    <Card>
      <Card.Body>
        <Card.Title>
          Last Race
        </Card.Title>

        <Card.Text>
          Plan your metro
          route before time
          runs out and try
          to reach the
          destination with
          the highest
          number of coins.
        </Card.Text>

        {!user && (
          <>
            <p>
              Anonymous
              users can only
              read the game
              instructions.
            </p>

            <Button
              onClick={
                goToLogin
              }
            >
              Login
            </Button>
          </>
        )}

        {user && (
          <>
            <p>
              Welcome{' '}
              <strong>
                {
                  user.username
                }
              </strong>
            </p>

            <Button
              onClick={
                onStartGame
              }
            >
              Start New
              Game
            </Button>
          </>
        )}
      </Card.Body>
    </Card>
  );
}

export default HomePage;
*/