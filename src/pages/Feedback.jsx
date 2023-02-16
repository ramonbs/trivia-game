import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import logo from '../assets/logo.png';
import './Feedback/styles.css';
import { saveRanking } from '../redux/actions';

class Feedback extends Component {
  componentDidMount() {
    this.saveUserRanking();
  }

  handleClickPlayAgain = () => {
    const { history } = this.props;
    history.push('/');
  };

  handleClickRanking = () => {
    const { history } = this.props;
    history.push('/ranking');
  };

  saveUserRanking() {
    const {
      user: { avatar, email, name },
      player: { score },
      dispatch,
    } = this.props;
    const user = {
      name,
      score,
      picture: avatar,
      gravatarEmail: email,
    };
    dispatch(saveRanking(user));
  }

  render() {
    const {
      player: { score, assertions },
    } = this.props;
    const minimalCorrect = 3;

    return (
      <>
        <Header />
        <main className="main-feedback">
          <img alt="Logotipo Trivia" className="logo" src={ logo } />
          <section>
            {assertions < minimalCorrect ? (
              <p data-testid="feedback-text">Could be better...</p>
            ) : (
              <p className="congrats" data-testid="feedback-text">
                Well Done!
              </p>
            )}
            <span className="feedback-message">
              {assertions > 0 && 'Você acertou'}
              {' '}
              <span data-testid="feedback-total-question">{assertions}</span>
              {' '}
              {assertions === 0 && 'acertos'}
              {assertions > 0 && assertions === 1 && 'questão'}
              {assertions > 1 && 'questões'}
            </span>
            {/* mensagem referente à pontuação final */}
            <span className="feedback-message">
              Totalizando
              {' '}
              <span data-testid="feedback-total-score">{score}</span>
              {' '}
              pontos
            </span>
          </section>
          <div className="buttons">
            <button
              type="button"
              onClick={ this.handleClickRanking }
              data-testid="btn-ranking"
            >
              Ver ranking
            </button>
            <button
              data-testid="btn-play-again"
              onClick={ this.handleClickPlayAgain }
              type="button"
            >
              Jogar novamente?
            </button>
          </div>
        </main>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  player: state.player,
});

Feedback.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  player: PropTypes.shape({
    score: PropTypes.number,
    assertions: PropTypes.number,
  }),
  user: PropTypes.shape({
    avatar: PropTypes.string,
    name: PropTypes.string,
    score: PropTypes.number,
    email: PropTypes.string,
  }),
  dispatch: PropTypes.func.isRequired,
};

Feedback.defaultProps = {
  player: {
    score: 0,
    assertions: 0,
  },
  user: {
    avatar: null,
    name: '',
    score: 0,
    email: '',
  },
};

export default connect(mapStateToProps)(Feedback);
