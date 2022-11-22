module.exports = {
  apps : [{
      name: 'merge-api',
      script: "./index.js",
      instances: 0,
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      env_production: {
        NODE_ENV: 'production',
      },
    }]
};
