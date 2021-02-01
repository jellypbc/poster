/* eslint-disable @typescript-eslint/no-var-requires */
const { environment } = require('@rails/webpacker')

const webpack = require('webpack');

// const typescript =  require('./loaders/typescript')
// environment.loaders.prepend('typescript', typescript)

environment.loaders.delete('nodeModules')

environment.plugins.prepend('Provide',
  new webpack.ProvidePlugin({
    $: 'jquery/src/jquery',
    jQuery: 'jquery/src/jquery'
  })
)

module.exports = environment
