/**
 *  @type {import('@jsverse/transloco-keys-manager').TranslocoExtractKeysWebpackPlugin['config']}
 */
module.exports = {
  defaultValue: '{{key}}',
  fileFormat: 'json',
  sort: true,
  unflat: true,
  langs: [
    'en',
    'sk'
  ],
  rootTranslationsPath: 'assets/i18n/'
}
