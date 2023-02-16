import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import settings from '../../assets/settings.png';
import star from '../../assets/star.png';
import './styles.css';

class Header extends Component {
  render() {
    const { user: { avatar, name }, player: { score } } = this.props;

    return (
      <header className="header">
        <div className="wrapper">
          <div className="header-user">
            <div className="avatar">
              {avatar && (
                <img
                  alt="Foto de perfil"
                  data-testid="header-profile-picture"
                  src={ avatar }
                />
              )}
            </div>
            {name === '' && (
              <span data-testid="header-player-name">Carregando...</span>
            )}
            {name !== '' && (
              <span data-testid="header-player-name">{ name }</span>
            )}
          </div>
          <div className="header-score">
            <img alt="Ícone estrela" src={ star } />
            <span className="score-text">Pontos:</span>

            <span className="score" data-testid="header-score">{ score }</span>
          </div>

          <Link to="/settings">
            <img
              alt="Configurações"
              className="header-settings"
              src={ settings }
            />
          </Link>
        </div>
      </header>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  player: state.player,
});

Header.propTypes = {
  user: PropTypes.shape({
    avatar: PropTypes.string,
    name: PropTypes.string,
    score: PropTypes.number,
  }),
  player: PropTypes.shape({
    score: PropTypes.number,
  }),
};

Header.defaultProps = {
  user: {
    avatar: null,
    name: '',
    score: 0,
  },
  player: {
    score: 0,
  },
};

export default connect(mapStateToProps)(Header);
