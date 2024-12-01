// jest.setup.js
import '@testing-library/jest-dom';

// Mock the fetch API globally
// global.fetch = jest.fn(() =>
//     Promise.resolve({
//       ok: true,
//       json: () => Promise.resolve([]),
//       headers: {
//         get: () => 'application/json',
//       },
//     })
//   );