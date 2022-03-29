const mongoose = require('mongoose');

const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const db_name = process.env.DB_NAME;

mongoose.connect(`mongodb://root:password@${host}:${port}/${db_name}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: 'admin'
})
.then(() => console.log('Database connection established'))
.catch((e) => console.error(`Database connection error: ${e}`));