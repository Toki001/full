require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(cors())

app.use(express.static('dist'))
app.use(express.json())


morgan.token('body', (request) => {
    return JSON.stringify(request.body)
})

app.use(morgan(':method :url : status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
app.get('/info', (request, response) => {
    Person.countDocuments({}).then(count => 
    {const currentTime = new Date()
    response.send(`
        <div>
            <p>Phonebook has info for ${count} people</p>
            <p>${currentTime}</p>
        </div>
     `)
    })
})

app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findId (request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete (request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body
    Person.findById (request.params.id)
        .then(person => {
            if(!person) {
                return response.status(404).end
            }
            
            person.name = name
            person.number = number

            return person.save().then((updatePerson) => {
                response.json(updatedPerson)
            })
        })
        .catch(error => next(error))
})

const generateRandomId = () => {
    const randomNumber = Math.floor(Math.random() * 1000000000)
    return String(randomNumber)
}

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    
    if(!body.name) {
        return response.status(400).json({
            error: 'name is missing'
        })
    }
    if(!body.number) {
        return response.status(400).json({
            error: 'number is missing'
        })
    }
    if(persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = new Person({
        id: generateRandomId(),
        name: body.name,
        number: body.number,
    })
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})