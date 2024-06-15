/**
 *  @type {import('svgo').Config}
 */
export default {
  multipass: false,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // NOTE: here override default plugins
        }
      }
    }
  ]
};
