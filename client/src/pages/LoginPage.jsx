
import { useState } from 'react';

import {
  Card,
  Form,
  Button
} from 'react-bootstrap';

function LoginPage({
  onLogin
}) {
  const [username, setUsername] =
    useState('');

  const [password, setPassword] =
    useState('');

  const handleSubmit = (
    event
  ) => {
    event.preventDefault();

    onLogin({
      username,
      password
    });
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>
          Login
        </Card.Title>

        <Form
          onSubmit={
            handleSubmit
          }
        >
          <Form.Group className="mb-3">
            <Form.Label>
              Username
            </Form.Label>

            <Form.Control
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(
                  e.target
                    .value
                )
              }
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Password
            </Form.Label>

            <Form.Control
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target
                    .value
                )
              }
              required
            />
          </Form.Group>

          <Button type="submit">
            Login
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default LoginPage;
