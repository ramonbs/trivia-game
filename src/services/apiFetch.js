const URL_API_TOKEN = 'https://opentdb.com/api_token.php?command=request';

async function fetchAPI() {
  try {
    const response = await fetch(URL_API_TOKEN);
    const data = await response.json();
    return data.token;
  } catch (error) {
    return error;
  }
}

async function fetchApiQuestion(
  token,
  category = 'any',
  difficulty = 'any',
  type = 'any',
) {
  const TOKEN_LENGTH = 16;
  if (!token || token.lenght < TOKEN_LENGTH) throw new Error('Token inválido');
  try {
    let endpoint = `https://opentdb.com/api.php?amount=5&token=${token}`;
    if (category !== 'any') {
      endpoint += `&category=${category}`;
    }
    if (difficulty !== 'any') {
      endpoint += `&difficulty=${difficulty}`;
    }
    if (type !== 'any') {
      endpoint += `&type=${type}`;
    }
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error('Something went wrong');
    }
    const { results } = await response.json();
    const FACTOR_RANDOM = 0.5;
    const questions = results.map((item) => {
      // criar array com as respostas da pergunta
      let answers = [item.correct_answer];
      if (typeof item.incorrect_answers !== 'object') {
        answers.push(item.incorrect_answers);
      } else {
        answers = [...answers, ...item.incorrect_answers];
      }
      // criar propriedade answers
      answers = answers
        // organizar as respostas de forma aleatória
        .sort(() => Math.random() - FACTOR_RANDOM)
        // criar propriedade isCorrect para cada resposta
        .map((answer) => ({
          answer,
          difficulty: item.difficulty,
          isCorrect: answer === item.correct_answer,
        }));
      return {
        ...item,
        answers,
      };
    });
    // console.log(questions);
    return questions;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export { fetchAPI, fetchApiQuestion };
