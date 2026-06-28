module.exports = {
  apps: [
    {
      name: "alphadev-landing-api",
      script: "dist/server.js",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
