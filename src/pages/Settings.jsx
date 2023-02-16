import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import logo from '../assets/logo.png';
import { updateSettings } from '../redux/actions';
import { fetchSettingsPageData } from '../services/fetchCategories';

const Loading = 'Carregando...';

class Settings extends Component {
  state = {
    availableCategories: [],
    availableDifficulties: [],
    availableTypes: [],
    isLoading: true,
  };

  async componentDidMount() {
    const data = await fetchSettingsPageData();
    // console.log(data);
    this.setState((currentState) => ({
      ...currentState,
      ...data,
      isLoading: false,
    }));
  }

  handleClick() {
    const { history } = this.props;
    const token = localStorage.getItem('token');
    if (token) {
      return history.push('/game');
    }
    return history.push('/');
  }

  handleChange({ target }) {
    const { name, value } = target;
    const { dispatch } = this.props;
    dispatch(updateSettings({
      name,
      value,
    }));
  }

  render() {
    const {
      availableCategories,
      availableDifficulties,
      availableTypes,
      isLoading,
    } = this.state;

    return (
      <div className="settings-container">
        <img alt="Logotipo Trivia" src={ logo } />
        <form className="settings" onSubmit={ (e) => e.preventDefault() }>
          <h1 data-testid="settings-title">Configurações</h1>
          <select
            defaultValue="DEFAULT"
            name="category"
            onChange={ (e) => this.handleChange(e) }
            required
          >
            <option value="DEFAULT" disabled hidden>
              Categoria
            </option>
            {isLoading && Loading}
            {!isLoading
            && availableCategories?.map(({ id, name }) => (
              <option key={ `category_${id}` } value={ id }>
                {name}
              </option>
            ))}
          </select>

          <select
            defaultValue="DEFAULT"
            name="difficulty"
            onChange={ (e) => this.handleChange(e) }
            required
          >
            <option value="DEFAULT" disabled hidden>
              Dificuldade
            </option>
            {isLoading && Loading}
            {!isLoading
            && availableDifficulties?.map(({ id, name }) => (
              <option key={ `difficulty_${id}` } value={ id }>
                {name}
              </option>
            ))}
          </select>

          <select
            defaultValue="DEFAULT"
            name="type"
            onChange={ (e) => this.handleChange(e) }
            required
          >
            <option value="DEFAULT" disabled hidden>
              Tipo
            </option>
            {isLoading && Loading}
            {!isLoading
            && availableTypes?.map(({ id, name }) => (
              <option key={ `type_${id}` } value={ id }>
                {name}
              </option>
            ))}
          </select>

          <button
            className="btn-play"
            data-testid="btn-play"
            disabled={ isLoading }
            onClick={ () => this.handleClick() }
            type="submit"
          >
            {isLoading && Loading}
            {!isLoading && 'Play'}
          </button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => state.settings;

Settings.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape(({
    push: PropTypes.func,
  })).isRequired,
  settings: PropTypes.shape({
    category: PropTypes.string,
    difficulty: PropTypes.string,
    type: PropTypes.string,
  }),
};

Settings.defaultProps = {
  settings: { category: '', difficulty: '', type: '' },
};

export default connect(mapStateToProps)(Settings);
