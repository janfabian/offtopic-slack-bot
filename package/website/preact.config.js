import preactCliSvgLoader from "preact-cli-svg-loader";

const PREACT_PUBLIC_VAR = /^PREACT_PUBLIC_/;

export default function (config, env, helpers) {
  preactCliSvgLoader(config, helpers);

  // dotenv injection
  const { plugin } = helpers.getPluginsByName(config, "DefinePlugin")[0];
  Object.assign(
    plugin.definitions,
    Object.keys(process.env)
      .filter((key) => PREACT_PUBLIC_VAR.test(key))
      .reduce(
        (env, key) => ({
          ...env,
          [`process.env.${key}`]: JSON.stringify(process.env[key]),
        }),
        {}
      )
  );
}
