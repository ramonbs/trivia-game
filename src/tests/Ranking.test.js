import React from 'react';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

const initialState = {
  player: {
    assertions: 1,
    score: 80,
  },
};

const initialRoute = '/feedback';

describe('Testing ranking page', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('Checking if Ranking page is render', async () => {
    renderWithRouterAndRedux(<App />, initialState, initialRoute);

    const btnRanking = screen.getByTestId('btn-ranking');
    expect(btnRanking).toBeInTheDocument();
    userEvent.click(btnRanking);

    const rankingTitle = screen.queryByRole('heading', {
      level: 1,
      name: 'Ranking',
    });
    expect(rankingTitle).toBeInTheDocument();
  });

  it('Checking if Ranking page has a user', async () => {
    const { container } = renderWithRouterAndRedux(
      <App />,
      initialState,
      initialRoute
    );

    const btnRanking = screen.getByTestId('btn-ranking');
    expect(btnRanking).toBeInTheDocument();
    userEvent.click(btnRanking);

    const tableRows = container.querySelectorAll('tr');
    expect(tableRows).toHaveLength(1);
  });

  it('Checking if Ranking page has more than one user', async () => {
    let container;

    const initialState = [
      {
        player: {
          score: 10,
        },
      },
      {
        player: {
          assertions: 1,
          score: 80,
        },
      },
    ];

    initialState.forEach((state) => {
      const { container: c } = renderWithRouterAndRedux(
        <App />,
        state,
        initialRoute
      );
      container = c;
      const btnRanking = screen.getByTestId('btn-ranking');
      expect(btnRanking).toBeInTheDocument();
      userEvent.click(btnRanking);
    });

    const tableRows = container.querySelectorAll('tr');
    expect(tableRows).toHaveLength(2);
  });
});
