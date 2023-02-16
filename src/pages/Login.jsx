import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchToken, resetUser } from '../redux/actions';
import logo from '../assets/logo.png';
import './Login/styles.css';

class Login extends Component {
  state = {
    email: '',
    name: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(resetUser());
  }

  handleChange({ target }) {
    const { name, value } = target;
    this.setState(
      {
        [name]: value,
      },
    );
  }

  handleSubmit(e) {
    e.preventDefault();
    const { dispatch, history } = this.props;
    const { email, name } = this.state;
    dispatch(fetchToken({
      email,
      name,
    }));

    const ONE_SECOND = 1000;

    setTimeout(() => {
      history.push('/game');
    }, ONE_SECOND);
  }

  render() {
    const { history, isLoading } = this.props;
    const { email, name } = this.state;

    const validName = 1;
    const valid = email.includes('@')
        && email.includes('.com')
        && name.length >= validName;

    return (
      <div className="login-container">
        <img alt="Logotipo Trivia" src={ logo } />
        <form onSubmit={ (e) => this.handleSubmit(e) } className="login">
          <input
            data-testid="input-gravatar-email"
            id="email"
            name="email"
            onChange={ (e) => this.handleChange(e) }
            placeholder="Qual é o seu e-mail do gravatar?"
            type="text"
            value={ email }
          />
          <input
            data-testid="input-player-name"
            id="name"
            name="name"
            onChange={ (e) => this.handleChange(e) }
            placeholder="Qual é o seu nome?"
            type="text"
            value={ name }
          />
          <button
            className="btn-play"
            data-testid="btn-play"
            disabled={ !valid || isLoading }
            type="submit"
          >
            {isLoading && 'Carregando...'}
            {!isLoading && 'Play'}
          </button>
          <button
            className="btn-settings"
            data-testid="btn-settings"
            onClick={ () => history.push('/settings') }
            type="button"
          >
            Settings
          </button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoading: state.user.isLoading,
});

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps)(Login);
