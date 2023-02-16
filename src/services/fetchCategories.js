const PREVIOUS_POSITION = -1;
const NEXT_POSITION = 1;
const SAME_POSITION = 0;

export async function fetchSettingsPageData() {
  try {
    const triviaCategories = await fetch(
      'https://opentdb.com/api_category.php',
    );
    const { trivia_categories: categories } = await triviaCategories.json();
    return {
      // https://stackoverflow.com/questions/6712034/sort-array-by-firstname-alphabetically-in-javascript
      availableCategories: [
        {
          id: 'any',
          name: 'Any',
        },
        ...categories.sort((a, b) => {
          if (a.name < b.name) {
            return PREVIOUS_POSITION;
          }
          if (a.name > b.name) {
            return NEXT_POSITION;
          }
          return SAME_POSITION;
        }),
      ],
      availableDifficulties: [
        {
          id: 'any',
          name: 'Any',
        },
        {
          id: 'easy',
          name: 'Easy',
        },
        {
          id: 'medium',
          name: 'Medium',
        },
        {
          id: 'hard',
          name: 'Hard',
        },
      ],
      availableTypes: [
        { id: 'any', name: 'Any' },
        { id: 'multiple', name: 'Multiple' },
        { id: 'boolean', name: 'Boolean' },
      ],
    };
  } catch (error) {
    return error;
  }
}
