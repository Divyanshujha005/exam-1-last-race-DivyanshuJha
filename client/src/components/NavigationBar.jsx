
import {
  Navbar,
  Container,
  Nav,
  Button
} from 'react-bootstrap';

function NavigationBar({
  user,
  setPage,
  onLogout
}) {
  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
    >
      <Container>
        <Navbar.Brand
          style={{
            cursor:
              'pointer',
            fontWeight:
              'bold'
          }}
          onClick={() =>
            setPage(
              'home'
            )
          }
        >
          🚇 Last Race
        </Navbar.Brand>

        <Nav className="ms-auto align-items-center">
          {user ? (
            <>
              <Nav.Link
                onClick={() =>
                  setPage(
                    'ranking'
                  )
                }
              >
                Ranking
              </Nav.Link>

              <Navbar.Text className="me-3">
                Logged in
                as:{' '}
                <strong>
                  {
                    user.username
                  }
                </strong>
              </Navbar.Text>

              <Button
                variant="outline-light"
                onClick={
                  onLogout
                }
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              variant="outline-light"
              onClick={() =>
                setPage(
                  'login'
                )
              }
            >
              Login
            </Button>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;

/*
import {
  Navbar,
  Container,
  Nav,
  Button
} from 'react-bootstrap';

function NavigationBar({
  user,
  setPage,
  onLogout
}) {
  return (
    <Navbar
      bg="dark"
      variant="dark"
    >
      <Container>
        <Navbar.Brand
          style={{
            cursor:
              'pointer'
          }}
          onClick={() =>
            setPage(
              'home'
            )
          }
        >
          Last Race
        </Navbar.Brand>

        <Nav className="ms-auto">
          {user && (
            <>
              <Nav.Link
                onClick={() =>
                  setPage(
                    'ranking'
                  )
                }
              >
                Ranking
              </Nav.Link>

              <Navbar.Text className="me-3">
                {user.username}
              </Navbar.Text>

              <Button
                variant="outline-light"
                onClick={
                  onLogout
                }
              >
                Logout
              </Button>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
*/