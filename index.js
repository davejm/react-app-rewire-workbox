const workboxPlugin = require('workbox-webpack-plugin')

const defaultConfig = {
  exclude: [/\.map$/, /^(?:asset-)manifest.*\.js(?:on)?$/],
  navigateFallback: '/index.html',
  navigateFallbackWhitelist: [/^(?!\/__).*/]
}

function findSWPrecachePlugin(element) {
  return element.constructor.name === 'SWPrecacheWebpackPlugin'
}

function removeSWPrecachePlugin(config) {
  const swPrecachePluginIndex = config.plugins.findIndex(findSWPrecachePlugin)
  // Remove the swPrecachePlugin if it was found
  if (swPrecachePluginIndex !== -1) {
    config.plugins.splice(swPrecachePluginIndex, 1) // mutates
  }
}

function rewireWorkboxGenerate(workboxConfig) {
  workboxConfig = workboxConfig || defaultConfig
  return function rewireWorkboxInner(config, env) {
    removeSWPrecachePlugin(config)

    // Add the Workbox plugin
    config.plugins.push(new workboxPlugin.GenerateSW(workboxConfig))

    return config
  }
}

function rewireWorkboxInject(workboxConfig) {
  workboxConfig = workboxConfig || {exclude: defaultConfig.exclude}
  return function rewireWorkboxInner(config, env) {
    removeSWPrecachePlugin(config)

    // Add the Workbox plugin
    config.plugins.push(new workboxPlugin.InjectManifest(workboxConfig))

    return config
  }
}

module.exports = {rewireWorkboxGenerate, rewireWorkboxInject}
