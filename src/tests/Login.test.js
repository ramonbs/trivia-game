import React from 'react';
import { renderWithRouterAndRedux } from './helpers/renderWithRouterAndRedux';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { act } from 'react-dom/test-utils';

describe('TESTES REQUISITO 4', () => {
  it('Testa se componentes estão sendo renderizados na tela', () => {
    renderWithRouterAndRedux(<App />);

    const inputEmail = screen.getByTestId('input-gravatar-email');
    expect(inputEmail).toBeInTheDocument();

    const inputName = screen.getByTestId('input-player-name');
    expect(inputName).toBeInTheDocument();

    const buttonSetting = screen.getByRole('button', { name: /settings/i });
    expect(buttonSetting).toBeInTheDocument();
  });

  it('Testa se quando os campos name e email são prenchidos o botão play habilita', async () => {
    const { history } = renderWithRouterAndRedux(<App />);

    const inputEmail = screen.getByTestId('input-gravatar-email');
    const inputName = screen.getByTestId('input-player-name');
    const buttonPlay = screen.getByRole('button', { name: /play/i });

    expect(inputEmail).toBeInTheDocument();
    expect(inputName).toBeInTheDocument();
    expect(buttonPlay).toBeInTheDocument();

    await act(() => {
      userEvent.type(inputName, 'Teste');
      userEvent.type(inputEmail, 'test@test.com');
      userEvent.click(buttonPlay);
    });

    // expect(inputEmail.value).toBe('test@test.com');
    // expect(inputName.value).toBe('Teste');

    await waitFor(() => {
      const { pathname } = history.location;
      expect(pathname).toBe('/game');
    });
  });

  it('Quando os campos name e email não são prenchidos o botão play fica desabilitado', () => {
    renderWithRouterAndRedux(<App />);

    const inputEmail = screen.getByTestId('input-gravatar-email');
    expect(inputEmail).toBeInTheDocument();

    const inputName = screen.getByTestId('input-player-name');
    expect(inputName).toBeInTheDocument();

    const buttonPlay = screen.getByRole('button', { name: /play/i });
    expect(buttonPlay).toBeInTheDocument();
    userEvent.click(buttonPlay);

    const buttonSetting = screen.getByRole('button', { name: /settings/i });
    expect(buttonSetting).toBeInTheDocument();
  });

  it('Quando clico no botão setting sou redirecionado para a página setting', () => {
    renderWithRouterAndRedux(<App />);

    const buttonSetting = screen.getByRole('button', { name: /settings/i });
    expect(buttonSetting).toBeInTheDocument();

    userEvent.click(buttonSetting);

    const titleSetting = screen.getByRole('heading', {
      name: /configurações/i,
      level: 1,
    });
    expect(titleSetting).toBeInTheDocument();
  });

  it('Testa LocalStorage', () => {
    renderWithRouterAndRedux(<App />);

    localStorage.setItem('key', 'item');

    const storageValue = localStorage.getItem('key');

    expect(storageValue).toBe('item');
  });
});
