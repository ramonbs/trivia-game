import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Ranking/styles.css';
import { connect } from 'react-redux';

class Ranking extends Component {
  state = {
    ranking: [],
  };

  componentDidMount() {
    this.getRanking();
  }

  getRanking() {
    const ranking = JSON.parse(localStorage.getItem('ranking'));
    if (ranking.length > 1) {
      ranking.sort((a, b) => b.score - a.score);
    }
    this.setState({ ranking });
  }

  render() {
    const { ranking } = this.state;
    return (
      <section className="container">
        <div className="ranking-container">
          <header className="title-container">
            <h1 data-testid="ranking-title">Ranking</h1>
          </header>
          <table>
            <thead>
              <tr>
              <th>Nome</th>
              <th>Score</th>
              <th>Picture</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((player, index) => (
                <tr key={ index }>
                  <td data-testid={ `player-name-${index}` }>
                    {index === 0 && <span data-testid="trophy">🏆</span>}
                    {index === 1 && <span data-testid="trophy">🥈</span>}
                    {index === 2 && <span data-testid="trophy">🥉</span>}
                    {player.name}
                  </td>
                  <td data-testid={ `player-score-${index}` }>{player.score}</td>
                  <td>
                    <img
                      src={ player.picture }
                      alt={ player.name }
                      data-testid={ `player-picture-${index}` }
                      className="player-picture"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Link to="/">
            <button className="btn-home" data-testid="btn-go-home">
              Jogar Novamente
            </button>
          </Link>
        </div>
      </section>
    );
  }
}

const mapStateToProps = (state) => ({
  player: state.player,
});

export default connect(mapStateToProps)(Ranking);
