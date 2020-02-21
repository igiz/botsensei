const env = process.env.NODE_ENV || 'development'
const Slackbot = require('slackbots')
const defaults = require('./defaults')
const format = require('string-format')
const config : Config = require('./config')[env]
const lodash = require('lodash')

defaults.set(config.database).then(() => {
    console.log('Initialization done')
});
