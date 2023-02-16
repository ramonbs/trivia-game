import React from 'react';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import { screen, waitFor } from '@testing-library/react';
import { within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import Feedback from '../pages/Feedback';

const initialRoute = '/feedback';

const initialState = {
  player: {
    assertions: 2,
    score: 91,
  },
};

describe('Testes tela de feedback', () => {
  it('Verificando renderização de elementos na tela', async () => {
    renderWithRouterAndRedux(<Feedback />);

    await waitFor(() => {
      const dotText = screen.getByText(/pontos:/i);
      expect(dotText).toBeInTheDocument();

      const imgSetting = screen.getByRole('img', { name: /configurações/i });
      expect(imgSetting).toBeInTheDocument();

      const points = screen.getByText(/pontos:/i);
      within(dotText).getByText(/0/i);
      expect(points).toBeInTheDocument();

      const performanceMsg = screen.getByText(/could be better\.\.\./i);
      expect(performanceMsg).toBeInTheDocument();

      const hitsMsg = screen.getByText(/acertos/i);
      const hits = screen.getByText(/acertos/i);
      within(hitsMsg).getByText(/0/i);
      expect(hits).toBeInTheDocument();

      const totalPoints = screen.getByText(/totalizando pontos/i);
      expect(totalPoints).toBeInTheDocument();

      const rankingButton = screen.getByRole('button', {
        name: /ver ranking/i,
      });
      expect(rankingButton).toBeInTheDocument();

      const replayButton = screen.getByRole('button', {
        name: /jogar novamente\?/i,
      });
      expect(replayButton).toBeInTheDocument();
    });
  });

  // Vamos verificar agora o caminho dos botões
  it('Quando clicar no botão "Jogar novamente" e redirecionado para página "/"', async () => {
    const { history } = renderWithRouterAndRedux(
      <App />,
      initialState,
      initialRoute
    );

    const playAgainButton = screen.getByRole('button', {
      name: /jogar novamente\?/i,
    });
    expect(playAgainButton).toBeInTheDocument();

    userEvent.click(playAgainButton);

    const { pathname } = history.location;
    expect(pathname).toBe('/');
  });

  it('Quando clicar no botão "Ver ranking" e redirecionado para página "/ranking"', async () => {
    const { history } = renderWithRouterAndRedux(
      <App />,
      initialState,
      initialRoute
    );

    const playAgainButton = screen.getByRole('button', {
      name: /ver ranking/i,
    });
    expect(playAgainButton).toBeInTheDocument();

    userEvent.click(playAgainButton);

    const { pathname } = history.location;
    expect(pathname).toBe('/ranking');
  });

  it('Exiba a menssagem "WELL DONE!" quando o usuario acerte 3 perguntas ou mais', async () => {
    renderWithRouterAndRedux(
      <App />,
      {
        player: {
          assertions: 4,
          score: 138,
        },
      },
      initialRoute
    );

    const text = screen.getByText(/well done!/i);
    expect(text).toBeInTheDocument();

    const quantiyAcert = screen.getByText(/4/i);
    expect(quantiyAcert).toBeInTheDocument();
    const acertMsg = screen.getByText(/você acertou questões/i);
    expect(acertMsg).toBeInTheDocument();

    const totalPoints = screen.getByText(/totalizando pontos/i);
    expect(within(totalPoints).getByText('138')).toBeInTheDocument();
  });

  it('Exiba a menssagem "Could be better..." quando o usuario acerta menos de 3 perguntas', async () => {
    renderWithRouterAndRedux(<App />, initialState, initialRoute);

    const text = screen.getByText(/could be better\.\.\./i);
    expect(text).toBeInTheDocument();

    const quantiyAcert = screen.getByText(/2/i);
    expect(quantiyAcert).toBeInTheDocument();
    const acertMsg = screen.getByText(/você acertou questões/i);
    expect(acertMsg).toBeInTheDocument();

    const totalPoints = screen.getByText(/totalizando pontos/i);
    expect(within(totalPoints).getByText('91')).toBeInTheDocument();
  });
});
