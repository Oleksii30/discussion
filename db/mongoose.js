const mongoose = require('mongoose')
const key = '07AHVXxdjcKB14SJ'
mongoose.connect(`mongodb+srv://Oleksii:${key}@cluster0-1moau.mongodb.net/test?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(()=>{
    console.log("Connected to db")
}).catch(()=>{
    console.log("Connection failed")
})