import falcorExpress from 'falcor-express';
import Router from 'falcor-router';
import express from 'express';

//const $ref = falcorExpress.Model.ref;
//const $atom = falcorExpress.Model.atom;

const app = express();

// TODO: Obviously move to a proper data source
const mockedData = {
  path: ['recipes'],
  value: [
  // ingredientsById: {
  //   1: {
  //     name: 'Flour',
  //     description: 'white and full of carbs'
  //   },
  //   2: {
  //     name: 'Chocolate Chips',
  //     description: 'delicious'
  //   }
  // },
  // recipes: [
    {
      name: "Cookies",
      instructions: "Bake them lol:",
      // ingredients: [
      //   $ref('ingredientsById[1]'),
      //   $ref('ingredientsById[2]')
      // ],
      authors: { $type: "atom", value: ['Ryan', 'John', 'Billy'] }
    },
    {
      name: "Brownies",
      instructions: "Bake them rofl",
      // ingredients: [
      //   $ref('ingredientsById[1]')
      // ],
      authors: { $type: "atom", value: ['Bob', 'Brian'] }
    }
  ]
};

app.use('/model.json', falcorExpress.dataSourceRoute((req, res) => {
  return new Router([{
    route: 'recipes',
    get() {
      return mockedData;
    }
  }]);
}));

app.use(express.static(__dirname + '/'));

let server = app.listen(3000);
