const mongoose = require('mongoose');

mongoose.connect('mongodb://root:password@localhost:27017/settle_challenge', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: 'admin'
})
.then(() => console.log('Database connection established'))
.catch((e) => console.error(`Database connection error: ${e}`));