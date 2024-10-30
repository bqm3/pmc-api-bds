

module.exports = {
    apps: [
        {
            name: "api-bds",
            script: "./index.js",
            env: {
                NODE_ENV: 'production',
                PORT: 8386
            }
        }
    ]
}