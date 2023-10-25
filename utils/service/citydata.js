const cityData = [
  {
    name: 'Île-de-France',
    code: '11',
    departement: [
      {
        name: 'Paris',
        cities: [
          { cname: 'Paris 1er arrondissement', code: '75001' },
          { cname: 'Paris 2e arrondissement', code: '75002' },
          { cname: 'Paris 19e arrondissement', code: '75019' },
        ],
      },
      {
        name: 'Seine-Saint-Denis',
        cities: [
          { cname: 'Tremblay-en-France', code: '93290' },
          { cname: 'Vaujours', code: '93410' },
        ],
      },
    ],
  },
  {
    name: 'Grand Est',
    code: '44',
    departement: [
      {
        name: 'Aube',
        cities: [
          { cname: 'Troyes', code: '10000' },
          { cname: 'Sainte-Savine', code: '10300' },
        ],
      },
      {
        name: 'Marne',
        cities: [
          { cname: 'Reims', code: '51100' },
          { cname: 'Châlons-en-Champagne', code: '51000' },
        ],
      },
    ],
  },
];

export default cityData;
