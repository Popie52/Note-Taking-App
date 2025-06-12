import mongoose, { mongo } from "mongoose";
import 'dotenv/config'

// if(process.argv.length < 3) {
//     console.log('give password as argument');
//     process.exit(1);
// }


// const password =  process.argv[2];


const url = process.env.MONGODB_URI


mongoose.set('strictQuery', false);


mongoose.connect(url).then(res => {
    console.log('Connected to MongoDB');
}).catch(er => {
    console.log('error connecting ti=o MongoDb:',er);
});

const noteSchema = new mongoose.Schema({
    content: {
      type: String,
      minLength: 5,
      required: true
    },
    important: Boolean,
})


noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// module.exports = mongoose.model('Note', noteSchema);
const Note = mongoose.model('Note', noteSchema);

export default Note;


// const note = new Note({
//     content: "Mongoose makes things easy",
//     important: true,
// })

// Note.find({important:true}).then(res => {
//     res.forEach(note => {
//         console.log(note);
//     })
//     mongoose.connection.close();
// })

// note.save().then(res => {
//     console.log(`note savedd!`);
//     mongoose.connection.close();
// })