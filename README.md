# Installation
The whole setup is well tested in node >= 8.0.0. Make sure you're using correct version. If you need to switch between versions use NVM (https://github.com/creationix/nvm).

```
nvm use 8.0.0
npm install
```

# Development
To run development server:
```
npm start
```

# Tests
To run tests:
```
npm run test
npm run test:watch
```

# Code test
1. Please create a fork of this repository.
2. For all requests use https://punkapi.com/documentation/v2.
3. Use `resolve` from `ui-router` to fetch first 10 beers and display them in application template `render beers list here` section.
4. Implement `Load more` button in beers list to fetch more beers.
5. Beers list should take full height of browser window and be scrollable.
6. On item click from beers list load beer details and render them in `render beer details here` section.
