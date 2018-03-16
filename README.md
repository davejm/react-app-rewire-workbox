# `react-app-rewire-workbox`

Add the [`workbox-webpack-plugin`](https://github.com/GoogleChrome/workbox) to your `create-react-app` app via [`react-app-rewired`](https://github.com/timarney/react-app-rewired) **without having to eject OR fork**.

By default, create react app uses SWPrecacheWebpackPlugin under the hood to generate a service worker which pre-caches your app shell and assets. sw-precache and sw-toolbox are being phased out in favour of Workbox so ideally we'd like to use Workbox instead!

Create react app also doesn't let you customise your service worker AT ALL! This plugin allows you to easily use the GenerateSW and InjectManifest functions from Workbox Webpack plugin. See [here](https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin) for details on the configuration options for each method.

This plugin will remove the SWPrecacheWebpackPlugin from the Webpack plugin configuration and add the Workbox GenerateSW/InjectManifest plugin with your desired configuration.

## Installation

```sh
npm install --save react-app-rewire-workbox

# If you don't already, you also need:
npm install --save react-app-rewired
```

## Usage

1. In the `config-overrides.js` of the root of your project you created for `react-app-rewired` add this code (this example uses the GenerateSW version of Workbox for easy pre-caching functionality):

```js
/* config-overrides.js */
const {rewireWorkboxGenerate} = require('react-app-rewire-workbox');

module.exports = function override(config, env) {
  if (env === "production") {
    console.log("Production build - Adding Workbox for PWAs");
    config = rewireWorkboxGenerate()(config, env);
  }

  return config;
};
```

2. Replace 'react-scripts' with 'react-app-rewired' in package.json

```json
  "scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test --env=jsdom"
  },
```

That's it, you now have Workbox for all your service worker / 'progressive web app' needs!!


## Advanced Usage / Configuration

Two functions are exported from this module: `rewireWorkboxGenerate` and `rewireWorkboxInject`. For info on how each Webpack plugin works, see the [Google documentation](https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin).

If you call either function with no parameters, it will set a default configuration that works well with create-react-app. If you would like to add custom config, pass it in as the parameter e.g.

```js
const {rewireWorkboxGenerate} = require('react-app-rewire-workbox');

module.exports = function override(config, env) {
  if (env === "production") {
    console.log("Production build - Adding Workbox for PWAs");
    const workboxConfig = {
      // Define runtime caching rules.
      runtimeCaching: [
        {
          // Match any request ends with .png, .jpg, .jpeg or .svg.
          urlPattern: /\.(?:png|jpg|jpeg|svg)$/,

          // Apply a cache-first strategy.
          handler: 'cacheFirst',

          options: {
            // Only cache 10 images.
            expiration: {
              maxEntries: 10,
            },
          },
        },
      ]
    };
    config = rewireWorkboxGenerate(workboxConfig)(config, env);
  }

  return config;
};
```

For your convenience the default configs for both functions are also exported so you can easily override them. They are exported as `defaultGenerateConfig` and `defaultInjectConfig`.

## License

Licensed under the MIT License, Copyright ©️ 2018 David Moodie. See [LICENSE.md](LICENSE.md) for more information.
