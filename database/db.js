const mongoose=require('mongoose');
mongoose.connect('mongodb+srv://Doctor360:doctor360admin@doctor360cluster.qyi5g.mongodb.net/Doctor360DB',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true

})