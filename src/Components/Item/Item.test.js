import React, { Component } from 'react';

//Extiendo el expect
import '@testing-library/jest-dom';

//Para el render de lso componentes
import { render } from '@testing-library/react';
import Item from './Item';

//Prettier
import { prettyDOM } from '@testing-library/react';

test('Render component', () => {
  const element = {
    id: 18,
    name: 'Merluza ',
    image:
      'https://res.cloudinary.com/dm8b2resp/image/upload/v1694697116/o1nsy3x43aq8srvcsiwe.png',
    description: 'Congelada por 100 gr',
    category: 'Congelados',
    unit_price: [
      {
        id: 6,
        name: '100gr',
        value: 433,
        blocked: true,
        productId: 18,
      },
    ],
  };

  const view = render(<Item element={element} />);

  // view.getByText('Merluza');
  view.getByText('Merluza');

  // Una alternativa seria hacer lo siguiente
  expect(view.container).toHaveTextContent(element.name);

  //Para ver el problema
  view.debug();

  //Seleccionar los componentes que se renderizan
  const img = view.container.querySelector('img');

  //Prettier de la consola
  console.log(prettyDOM(img));
});

//Estoy en la rama
