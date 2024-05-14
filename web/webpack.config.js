const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");
const share = mf.share;
const Dotenv = require('dotenv-webpack');
const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  path.join(__dirname, 'tsconfig.json'),
  [/* mapped paths to share */]);

module.exports = {
  output: {
    uniqueName: "plan",
    publicPath: "auto",
    scriptType: 'text/javascript'
  },
  optimization: {
    runtimeChunk: false
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    },
    symlinks: true
  },
  experiments: {
    outputModule: true
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "plan",
      filename: "remoteEntry.js",
      exposes: {
        './Module': './src/app/plan/plan.module.ts',
        './Component': './src/app/plan/components/task-readonly/task-readonly.component.ts',
      },
      // remotes: {
      //   "au": "au@https://au2.vercel.app/remoteEntry.js",
      //   // "au": "au@http://localhost:4204/remoteEntry.js"
      // },

      shared: share({
        "@angular/core": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/common": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/common/http": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/router": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/forms": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "typlib": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        ...sharedMappings.getDescriptors()
      }),

    }),
    sharedMappings.getPlugin(),
    // new Dotenv({
    //   path: './.env', // Path to .env file (this is the default)
    // })
  ],
};
