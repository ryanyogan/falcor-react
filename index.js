import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { pick, union } from 'lodash';

const $ref = falcor.Model.ref;
const $atom = falcor.Model.atom;

const model = new falcor.Model({ source: new falcor.HttpDataSource('/model.json') });
// const model = new falcor.Model({
  // cache: {
  //   ingredientsById: {
  //     1: {
  //       name: 'Flour',
  //       description: 'white and full of carbs'
  //     },
  //     2: {
  //       name: 'Chocolate Chips',
  //       description: 'delicious'
  //     }
  //   },
  //   recipes: [
  //     {
  //       name: "Cookies",
  //       instructions: "Bake them lol:",
  //       ingredients: [
  //         $ref('ingredientsById[1]'),
  //         $ref('ingredientsById[2]')
  //       ],
  //       authors: { $type: "atom", value: ['Ryan', 'John', 'Billy'] }
  //     },
  //     {
  //       name: "Brownies",
  //       instructions: "Bake them rofl",
  //       ingredients: [
  //         $ref('ingredientsById[1]')
  //       ],
  //       authors: { $type: "atom", value: ['Bob', 'Brian'] }
  //     }
  //   ]
  // }
// });

class App extends Component {
  render() {
    return (
      <RecipeList  />
    );
  }
}

class RecipeList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recipes: []
    };
  }

  componentWillMount() {
    model.get(
      ['recipes', {from: 0, to: 9}, Recipe.queries.recipe() ],
      ['recipes', {from: 0, to: 9}, 'ingredients', {from: 0, to: 9}, Ingredients.queries.ingredients() ]
    )
    .then((data) => {
      this.setState({
        recipes: _.values(data.json.recipes)
      });
    });
  }

  render() {
    const recipes = this.state.recipes.map((recipe, i) => {
        return <Recipe key={i} {...recipe} />;
    });

    return (
      <div>
        {recipes}
      </div>
    )
  }
}

class Recipe extends Component {
  render() {
    return (
      <div>
        <Name {...pick(this.props, Name.queries.recipe() )} />
        <Instructions {... pick(this.props, Instructions.queries.recipe() )} />
        <Ingredients ingredients={this.props.ingredients} />
      </div>
    );
  }
}

Recipe.queries = {
  recipe() {
    return union(Name.queries.recipe(), Instructions.queries.recipe());
  }
}

class Name extends Component {
  render() {
    return (
      <div>
        <h1>{this.props.name}</h1>
        <h1>{this.props.authors.join(', ')}</h1>
      </div>
    );
  }
}

Name.queries = {
  recipe() {
    return ["name", "authors"];
  }
}

class Instructions extends Component {
  render() {
    return (
      <h1>{this.props.instructions}</h1>
    );
  }
}

Instructions.queries = {
  recipe() {
    return ["instructions"];
  }
}

class Ingredients extends Component {
  render() {
    return (
      <h1>{JSON.stringify(this.props.ingredients)}</h1>
    );
  }
}

Ingredients.queries = {
  ingredients() {
    return ["name", "description"];
  }
}

ReactDOM.render(
  <App />,
   window.document.getElementById('target')
 );
