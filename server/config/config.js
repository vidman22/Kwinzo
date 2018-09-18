module.exports = {
    //MongoDB configuration
    development: {
        db: process.env.MONGO_URL || 'mongodb://127.0.0.1/graphql',
        app: {
            name: 'graphql'
        }
    }
    // production: {
    //     db: 'mongodb://<username>:<password>@ds157325.mlab.com:57325/graphql-api',
    //     app: {
    //         name: 'graphql'
    //     }
    // }
};