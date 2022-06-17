const {
  override,
  addWebpackResolve,
  removeModuleScopePlugin
} = require("customize-cra");

module.exports = override(
  addWebpackResolve({
    symlinks: false
  }),
  removeModuleScopePlugin()
);