import React from 'react';
import { renderWithRouterAndRedux } from './helpers/renderWithRouterAndRedux';
import { screen, waitFor } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { before } from 'mocha';

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

describe('Testing Settings page', () => {
  it('Page is rendered correctly', () => {
    const { container } = renderWithRouterAndRedux(<App />, {}, '/settings');

    const title = screen.getByTestId('settings-title');
    const category = container.querySelector('[name=category]');
    const difficulty = container.querySelector('[name=difficulty]');
    const type = container.querySelector('[name=type]');

    expect(title).toBeInTheDocument();
    expect(category).toBeInTheDocument();
    expect(difficulty).toBeInTheDocument();
    expect(type).toBeInTheDocument();
  });

  it('User can selected question category', async () => {
    const { history } = renderWithRouterAndRedux(<App />);

    const btnSettings = screen.getByTestId('btn-settings');
    expect(btnSettings).toBeInTheDocument();

    await act(() => {
      userEvent.click(btnSettings);
    });

    await waitFor(async () => {
      const category = screen.getAllByRole('combobox')[0];
      const difficulty = screen.getAllByRole('combobox')[1];
      const type = screen.getAllByRole('combobox')[2];

      const history = screen.getByText(/history/i);
      const hard = screen.getByText(/hard/i);
      const multiple = screen.getByText(/multiple/i);

      expect(category).toBeInTheDocument();
      expect(history).toBeInTheDocument();

      userEvent.selectOptions(category, history);
      userEvent.selectOptions(difficulty, hard);
      userEvent.selectOptions(type, multiple);

      expect(category.value).toBe(history.value);
      expect(difficulty.value).toBe(hard.value);
      expect(type.value).toBe(multiple.value);
    });

    const btnPlay = screen.getByTestId('btn-play');

    await act(() => {
      userEvent.click(btnPlay);
    });

    expect(history.location.pathname).toBe('/');
  });

  it('User is redirected to /game after selecting desired categories if is already authenticated', async () => {
    const { history } = renderWithRouterAndRedux(<App />);

    const inputEmail = screen.getByTestId('input-gravatar-email');
    const inputName = screen.getByTestId('input-player-name');
    const buttonPlay = screen.getByRole('button', { name: /play/i });

    await act(() => {
      userEvent.type(inputName, 'Teste');
      userEvent.type(inputEmail, 'test@test.com');
      userEvent.click(buttonPlay);
    });

    await act(() => {
      history.push('/settings');
    });

    expect(history.location.pathname).toBe('/settings');

    await waitFor(async () => {
      const category = screen.getAllByRole('combobox')[0];
      const difficulty = screen.getAllByRole('combobox')[1];
      const type = screen.getAllByRole('combobox')[2];

      const history = screen.getByText(/history/i);
      const hard = screen.getByText(/hard/i);
      const multiple = screen.getByText(/multiple/i);

      expect(category).toBeInTheDocument();
      expect(history).toBeInTheDocument();

      userEvent.selectOptions(category, history);
      userEvent.selectOptions(difficulty, hard);
      userEvent.selectOptions(type, multiple);

      expect(category.value).toBe(history.value);
      expect(difficulty.value).toBe(hard.value);
      expect(type.value).toBe(multiple.value);
    });

    const btnPlay = screen.getByTestId('btn-play');
    expect(btnPlay).toBeInTheDocument();

    await act(() => {
      userEvent.click(btnPlay);
    });

    expect(history.location.pathname).toBe('/game');
  });
});
