module.exports = {
  apps : [{
      name: 'merge-frontend',
      script: "node_modules/next/dist/bin/next",
      args: 'start',
      instances: 0,
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      env_production: {
        NODE_ENV: 'production',
      },
    }]
};
