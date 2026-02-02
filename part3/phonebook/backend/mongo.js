const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
  }

const password = process.argv[2]

const url = `mongodb+srv://jameskierdoliguez:${password}@cluster0.gbgelep.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4})
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB', error.message)
  })
const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minLength: 3,
      required: true
    },
    number: String,
  })
  
  const Person = mongoose.model('Person', personSchema)

  if (process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]
  
    const person = new Person({
      name: name,
      number: number,
    })
  
    person.save().then(result => {
      console.log(`added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
    })
  }

  else if (process.argv.length === 3) {
    console.log('phonebook:')
    Person.find({}).then(result => {
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
  }
  
  else {
    console.log('Please provide the correct arguments: node mongo.js <password> <name> <number>')
    mongoose.connection.close()
  }