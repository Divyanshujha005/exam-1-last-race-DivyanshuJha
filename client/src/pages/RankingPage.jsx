import {
  useEffect,
  useState
} from 'react';

import {
  Card,
  Table,
  Spinner,
  Alert
} from 'react-bootstrap';

import * as API from '../API';

function RankingPage() {
  const [ranking,
    setRanking] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [error,
    setError] =
    useState('');

  useEffect(() => {
    const loadRanking =
      async () => {
        try {
          const data =
            await API.getRanking();

          const sorted =
            [...data].sort(
              (a, b) =>
                b.bestScore -
                a.bestScore
            );

          setRanking(
            sorted
          );
        } catch (
          err
        ) {
          console.error(
            err
          );

          setError(
            'Could not load ranking'
          );
        } finally {
          setLoading(
            false
          );
        }
      };

    loadRanking();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>
          General Ranking
        </Card.Title>

        <p className="text-muted">
          Best result
          achieved by
          registered
          players.
        </p>

        {error && (
          <Alert variant="danger">
            {error}
          </Alert>
        )}

        <Table
          striped
          bordered
          hover
        >
          <thead>
            <tr>
              <th>
                Position
              </th>

              <th>
                Username
              </th>

              <th>
                Best Score
              </th>
            </tr>
          </thead>

          <tbody>
            {ranking.map(
              (
                player,
                index
              ) => (
                <tr
                  key={
                    player.username
                  }
                >
                  <td>
                    #
                    {index +
                      1}
                  </td>

                  <td>
                    {
                      player.username
                    }
                  </td>

                  <td>
                    <strong>
                      {
                        player.bestScore
                      }
                    </strong>{' '}
                    coins
                  </td>
                </tr>
              )
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

export default RankingPage;
/*
import {
  useEffect,
  useState
} from 'react';

import {
  Table,
  Card,
  Spinner
} from 'react-bootstrap';

import * as API from '../API';

function RankingPage() {
  const [ranking,
    setRanking] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {
    const loadRanking =
      async () => {
        try {
          const data =
            await API.getRanking();

          setRanking(data);
        } catch (err) {
          console.error(
            err
          );
        } finally {
          setLoading(
            false
          );
        }
      };

    loadRanking();
  }, []);

  if (loading) {
    return (
      <Spinner animation="border" />
    );
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>
          Ranking
        </Card.Title>

        <Table striped bordered>
          <thead>
            <tr>
              <th>
                Username
              </th>

              <th>
                Best Score
              </th>
            </tr>
          </thead>

          <tbody>
            {ranking.map(
              (player) => (
                <tr
                  key={
                    player.username
                  }
                >
                  <td>
                    {
                      player.username
                    }
                  </td>

                  <td>
                    {
                      player.bestScore
                    }
                  </td>
                </tr>
              )
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

export default RankingPage;
*/