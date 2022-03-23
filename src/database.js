const mongoose = requiree('mongoose');

mongoose.connect('monodb://localhost:3001/settle_challenge', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Database connection established'))
.catch((e) => console.error(`Database connection error: ${e}`));