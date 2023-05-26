const { VanillaExtractPlugin } = require('@vanilla-extract/webpack-plugin');
const browserslist = require('browserslist');
const { lazyPostCSS } = require('next/dist/build/webpack/config/blocks/css');
const {
  getGlobalCssLoader,
} = require('next/dist/build/webpack/config/blocks/css/loaders');

function getSupportedBrowsers(dir, isDevelopment) {
  let browsers;
  try {
    browsers = browserslist.loadConfig({
      path: dir,
      env: isDevelopment ? 'development' : 'production',
    });
  } catch {}

  return browsers;
}

const createVanillaExtractPlugin =
  (pluginOptions = {}) =>
  (nextConfig = {}) =>
    Object.assign({}, nextConfig, {
      webpack(config, options) {
        const { dir, dev, isServer } = options;

        const cssRules = config.module.rules.find(
          (rule) =>
            Array.isArray(rule.oneOf) &&
            rule.oneOf.some(
              ({ test }) =>
                typeof test === 'object' &&
                typeof test.test === 'function' &&
                test.test('filename.css'),
            ),
        ).oneOf;

        cssRules.unshift({
          test: /\.vanilla\.css$/i,
          sideEffects: true,
          use: getGlobalCssLoader(
            {
              assetPrefix: config.assetPrefix,
              isClient: !isServer,
              isServer,
              isDevelopment: dev,
              future: nextConfig.future || {},
              experimental: nextConfig.experimental || {},
              hasAppDir: true,
            },
            () => lazyPostCSS(dir, getSupportedBrowsers(dir, dev), undefined),
            [],
          ),
        });

        config.plugins.push(
          new VanillaExtractPlugin({ outputCss: !isServer, ...pluginOptions }),
        );

        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options);
        }

        return config;
      },
    });

const withVanillaExtract = createVanillaExtractPlugin();

module.exports = withVanillaExtract();
