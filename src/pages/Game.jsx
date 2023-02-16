import React, { Component } from 'react';
import sanitizeHtml from 'sanitize-html';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import {
  resetAssertions,
  resetScore,
  updateAssertions,
  updateScore,
} from '../redux/actions';
import Header from '../components/Header';
import timer from '../assets/timer.png';
import { fetchApiQuestion } from '../services/apiFetch';
import './Game/styles.css';

const CORRECT_ANSWER = 'correct-answer';
const ONE_SECOND = 1000;

class Game extends Component {
  state = {
    indexOfQuestion: 0,
    isLoading: true,
    questions: [],
    remainingTime: 30,
    selectedAnswer: false,
  };

  async componentDidMount() {
    const { dispatch, history, settings } = this.props;
    const { category, difficulty, type } = settings;
    const token = localStorage.getItem('token');
    dispatch(resetAssertions());
    dispatch(resetScore());
    try {
      this.setState((currentState) => ({ ...currentState, isLoading: true }));
      const response = await fetchApiQuestion(token, category, difficulty, type);
      setTimeout(() => {
        this.setState({
          isLoading: false,
          questions: response,
        });
        this.countdown = setInterval(this.updateTimer, ONE_SECOND);
      }, ONE_SECOND / 2);
    } catch (error) {
      history.push('/');
    }
  }

  componentDidUpdate() {
    const { history, token } = this.props;
    const { remainingTime } = this.state;
    const TOKEN_LENGTH = 16;
    if (!token || token.length < TOKEN_LENGTH) {
      history.push('/');
      localStorage.clear();
      console.log('Seu token é inválido ou expirou!');
    }

    if (remainingTime === 0) {
      setTimeout(() => {
        history.push('/feedback');
      }, ONE_SECOND);
    }
  }

  componentWillUnmount() {
    clearInterval(this.countdown);
  }

  handleAnswers({ target }, difficulty) {
    const { dispatch, assertions } = this.props;
    const { indexOfQuestion, remainingTime } = this.state;
    const HARD = 3;
    const MAX_QUESTIONS = 5;
    const MEDIUM = 2;
    const POINTS = 10;

    if (target.classList.contains(CORRECT_ANSWER)) {
      let score = POINTS + remainingTime;

      if (difficulty === 'hard') {
        score = POINTS + remainingTime * HARD;
      }

      if (difficulty === 'medium') {
        score = POINTS + remainingTime * MEDIUM;
      }

      this.setState(() => ({
        selectedAnswer: true,
      }));

      dispatch(updateAssertions(assertions + 1));
      dispatch(updateScore(score));
    }

    if (indexOfQuestion < MAX_QUESTIONS) {
      this.setState(() => ({
        selectedAnswer: true,
      }));
    }
  }

  handleClickNextQuestion() {
    this.setState((prevState) => ({
      selectedAnswer: false,
      indexOfQuestion: prevState.indexOfQuestion + 1,
      remainingTime: 30,
    }));
  }

  updateTimer = () => {
    const { selectedAnswer } = this.state;

    if (selectedAnswer) {
      return;
    }

    this.setState(({ remainingTime }) => ({
      remainingTime: remainingTime > 0 ? remainingTime - 1 : remainingTime,
    }));
  };

  renderAnswers() {
    const { questions, indexOfQuestion, selectedAnswer, remainingTime } = this.state;

    return questions[indexOfQuestion]?.answers?.map(
      ({ answer, difficulty, isCorrect }, index) => (
        <button
          className={ `
            ${isCorrect ? CORRECT_ANSWER : 'wrong-answer'}
            ${selectedAnswer ? 'selected' : ''}
          `.trim() }
          data-testid={ isCorrect ? CORRECT_ANSWER : `wrong-answer-${index}` }
          disabled={ remainingTime === 0 || selectedAnswer }
          key={ `answer-option-${index}` }
          onClick={ (e) => this.handleAnswers(e, difficulty) }
          type="button"
        >
          {sanitizeHtml(answer)}
        </button>
      ),
    );
  }

  render() {
    const {
      indexOfQuestion,
      isLoading,
      questions,
      remainingTime,
      selectedAnswer,
    } = this.state;

    const { score } = this.props;

    const MAX_QUESTIONS = 5;

    if (indexOfQuestion === MAX_QUESTIONS) {
      return <Redirect to="/feedback" />;
    }

    return (
      <>
        <Header />
        <main className="game-container">
          {isLoading && <span className="loading-message">Carregando...</span>}
          <div className="wrapper">
            {!isLoading && (
              <>
                {questions?.map((item, index) => (
                  index === indexOfQuestion && (
                    <div className="question-container" key={ `question-${index}` }>
                      <div
                        className="question-category"
                        data-testid="question-category"
                      >
                        { item.category }
                      </div>
                      <p data-testid="question-text">{ sanitizeHtml(item.question) }</p>
                      <div className="timer">
                        <img alt="Ícone timer" src={ timer } />
                        {' '}
                        Tempo:
                        {' '}
                        { remainingTime }
                        { remainingTime > 0 ? 's' : ''}
                      </div>
                    </div>
                  )))}

                <div className="answers-container" data-testid="answer-options">

                  { this.renderAnswers() }

                  {selectedAnswer && (
                    <button
                      className="btn-next"
                      data-testid="btn-next"
                      onClick={ () => this.handleClickNextQuestion() }
                      type="button"
                    >
                      Próxima
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
          {!isLoading && (
            <div className="score-container">
              <p data-testid="question-score">
                Placar:
                {' '}
                {score}
              </p>
            </div>
          )}
        </main>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  assertions: state.player.assertions,
  score: state.player.score,
  token: state.user.token,
  settings: state.settings,
});

Game.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  assertions: PropTypes.number,
  score: PropTypes.number,
  token: PropTypes.string,
  settings: PropTypes.shape({
    category: PropTypes.string,
    difficulty: PropTypes.string,
    type: PropTypes.string,
  }),
};

Game.defaultProps = {
  assertions: 0,
  score: 0,
  token: '',
  settings: { category: '', difficulty: '', type: '' },
};

export default connect(mapStateToProps)(Game);
