# Beer Wiki

Brewery searcher with localStorage favorites functionality. Implements PWA approach with Workbox so the project can function when 'offline'.

It uses the [Open Brewery DB](https://www.openbrewerydb.org/) as the API.

The app is fully functional and responsive.

# What you can do:

- Search for breweries
- Add favorite brewerie
- Remove favorite brewerie
- See details for any selected brewerie
- Interact with cached content when offline

\*The project doesn't run with **_Nodejs_** and **_Express_** (purposely), so in order to test the PWA part you can just use the 'serve' as indicated on the instructions.\*

## Tech & 3rd party used in the project:

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Axios](https://axios-http.com/docs/intro)
- [React Router](https://reactrouter.com/)
- [Workbox](https://developer.chrome.com/docs/workbox)
- [Material UI](https://mui.com/)
- [Webpack](https://webpack.js.org/)

# How to run the project:

- Clone the repository
- Install the modules, run

```bash
  npm install
```

- Since we are not using Nodejs and Express, in the main folder, run

```bash
  REACT_APP_API=https://api.openbrewerydb.org/v1/ npm run build
```

- And then start the server with the 'dist' folder as the root

```bash
  serve -s dist
```

- To test the 'offline' functionality, in your DevTools, on the tab 'Network', instead of the option 'No Throttling', select 'Offline'.

_The cache stores anything that has been previously fetched in the API, so before going 'offline' visit some areas that fetch content from the API_

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)
