import React from 'react';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

const initialState = {
  user: {
    avatar: '',
    email: 'teste@teste.com',
    name: 'teste',
    isLoading: false,
    token: '82f9f35384a7256e846de06de153896b06c4730b0418fd539a2e7396e1e7850b',
    ranking: [],
  },
};

const initialRoute = '/game';

const mockedResponse = {
  results: [
    {
      category: 'Science & Nature',
      type: 'multiple',
      difficulty: 'hard',
      question: 'Question 1',
      correct_answer: 'Graviton',
      incorrect_answers: ['Z boson', 'Tau neutrino', 'Gluon'],
    },
    {
      category: 'Science & Nature',
      type: 'multiple',
      difficulty: 'easy',
      question: 'Question 2',
      correct_answer: 'Graviton',
      incorrect_answers: ['Z boson', 'Tau neutrino', 'Gluon'],
    },
    {
      category: 'Science & Nature',
      type: 'multiple',
      difficulty: 'medium',
      question: 'Question 3',
      correct_answer: 'Graviton',
      incorrect_answers: ['Z boson', 'Tau neutrino', 'Gluon'],
    },
    {
      category: 'Science & Nature',
      type: 'multiple',
      difficulty: 'hard',
      question: 'Question 4',
      correct_answer: 'Graviton',
      incorrect_answers: ['Z boson', 'Tau neutrino', 'Gluon'],
    },
    {
      category: 'Science & Nature',
      type: 'multiple',
      difficulty: 'hard',
      question: 'Question 5',
      correct_answer: 'Graviton',
      incorrect_answers: ['Z boson', 'Tau neutrino', 'Gluon'],
    },
  ],
};

describe('Testing game page', () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  beforeEach(() => {
    jest.spyOn(global, 'fetch');

    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockedResponse),
    });

    const token =
      '82f9f35384a7256e846de06de153896b06c4730b0418fd539a2e7396e1e7850b';

    localStorage.setItem('token', token);

    // https://plainenglish.io/blog/testing-local-storage-with-testing-library-580f74e8805b
    // Object.defineProperty(window, 'localStorage', {
    //   value: {
    //     getItem: jest.fn(
    //       () =>
    //         '82f9f35384a7256e846de06de153896b06c4730b0418fd539a2e7396e1e7850b'
    //     ),
    //     setItem: jest.fn(() => null),
    //     clear: jest.fn(() => null),
    //   },
    //   writable: true,
    // });
  });

  it('Checking if game page is rendered', async () => {
    const { history } = renderWithRouterAndRedux(
      <App />,
      initialState,
      initialRoute
    );

    expect(history.location.pathname).toBe('/game');
  });

  it('Checking if initial score is 0', async () => {
    renderWithRouterAndRedux(<App />, initialState, initialRoute);

    const score = screen.queryByTestId('header-score');
    expect(score).toHaveTextContent('0');
  });

  it('Check if questions are rendered', async () => {
    const { token } = initialState.user;

    renderWithRouterAndRedux(<App />, initialState, initialRoute);

    expect(global.fetch).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith(
      `https://opentdb.com/api.php?amount=5&token=${token}`
    );

    const questionText = await screen.findByTestId('question-text');
    expect(questionText).toBeInTheDocument();
    expect(questionText.textContent).toBe(mockedResponse.results[0].question);
  });

  it(`Check if score don't update when user clicks wrong answers`, async () => {
    const { container } = renderWithRouterAndRedux(
      <App />,
      initialState,
      initialRoute
    );

    let finalScore = 0;

    await waitFor(() => {
      const wrongAnswers = container.querySelectorAll('.wrong-answer');
      expect(wrongAnswers.length).toBeGreaterThanOrEqual(1);

      userEvent.click(wrongAnswers[0]);

      const btnNext = screen.getByTestId('btn-next');
      userEvent.click(btnNext);
    });

    await waitFor(() => {
      const correctAnswer = container.querySelectorAll('.correct-answer');
      expect(correctAnswer.length).toBeGreaterThanOrEqual(1);

      userEvent.click(correctAnswer[0]);

      const btnNext = screen.getByTestId('btn-next');
      userEvent.click(btnNext);
    });

    const score = screen.getByTestId('header-score');
    finalScore += parseInt(score.textContent);

    expect(finalScore).toBe(40);
  });

  it('Check if user is redirected to /feedback afters answering 5 questions', async () => {
    const { container, history, store } = renderWithRouterAndRedux(
      <App />,
      initialState,
      initialRoute
    );

    mockedResponse.results.forEach(async () => {
      await waitFor(() => {
        const correctAnswer = container.querySelector('.correct-answer');
        expect(correctAnswer).toBeInTheDocument();
        userEvent.click(correctAnswer);

        const btnNext = screen.getByTestId('btn-next');
        userEvent.click(btnNext);
      });
    });

    const btnNext = screen.queryByTestId('btn-next');
    expect(btnNext).not.toBeInTheDocument();

    await waitFor(() => {
      const { pathname } = history.location;
      expect(pathname).toBe('/feedback');

      expect(store.getState().player.assertions).toBe(5);
    });
  });

  it('Check if user is redirected to / if token is not set', async () => {
    localStorage.removeItem('token');

    const { history } = await renderWithRouterAndRedux(
      <App />,
      initialState,
      initialRoute
    );

    await waitFor(() => {
      expect(history.location.pathname).toBe('/');
    });
  });

  it('Check if user is redirected to / if token is invalid', async () => {
    const { history } = renderWithRouterAndRedux(
      <App />,
      {
        user: {
          ...initialState.user,
          token: 'invalid_token',
        },
      },
      initialRoute
    );

    await waitFor(async () => {
      expect(history.location.pathname).toBe('/');
    });
  });

  it(`Check if timer is decremented when it's time is greater than 0`, async () => {
    const { container, history } = renderWithRouterAndRedux(
      <App />,
      initialState,
      initialRoute
    );

    await waitFor(() => {
      const timer = container.querySelector('.timer');
      expect(timer).toBeInTheDocument();
      expect(timer).toHaveTextContent('Tempo: 30s');
    });

    await waitFor(
      async () => {
        const timer = container.querySelector('.timer');
        expect(timer).toBeInTheDocument();
        expect(timer).toHaveTextContent('Tempo: 28s');
      },
      { timeout: 2000 }
    );

    await waitFor(
      async () => {
        const timer = container.querySelector('.timer');
        expect(timer).toBeInTheDocument();
        expect(timer).not.toHaveTextContent('Tempo: 24s');
      },
      { timeout: 2000 }
    );

    await waitFor(
      async () => {
        const timer = container.querySelector('.timer');
        expect(timer).toBeInTheDocument();
        expect(timer).toHaveTextContent('Tempo: 0');
      },
      { timeout: 30000 }
    );

    await waitFor(
      async () => {
        expect(history.location.pathname).toBe('/feedback');
      },
      { timeout: 2000 }
    );
  }, 60000); // https://stackoverflow.com/questions/68811529/how-can-i-increase-the-test-time-out-value-in-jest
});
