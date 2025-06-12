import express, { request, response } from "express";
import cors from "cors";
// import 'dotenv/config'
import Note from "./db.js";

const app = express();

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if(error.name === 'ValidationError') {
    return response.status(400).json({error: error.message});
  }
  next(error);
};

app.use(express.static("dist"));
app.use(cors());
app.use(express.json());
app.use(requestLogger);


app.get("/api/notes", (request, response) => {
  Note.find({}).then((res) => {
    console.log(res);
    response.json(res);
  });
});

app.get("/api/notes/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((er) => next(er));
});


app.post("/api/notes", (request, response, next) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  // notes = notes.concat(note)
  note.save().then((res) => {
    console.log("Success");
    response.json(res);
  }).catch(er => next(er));
});

app.put("/api/notes/:id", (req, res, next) => {
  const id = req.params.id;
  const {content, important} = req.body;

  Note.findById(id).then(note => {
    if(!note) {
      return res.status(404).end();
    }

    note.content = content;
    note.important = important;
    return note.save().then(result => {
      res.json(result);
    })

  }).catch(err => next(err));

});

app.delete("/api/notes/:id", (request, response, next) => {
  const id = request.params.id;
  Note.findByIdAndDelete(id).then(res => {
    if(res) {
      response.status(204).end()
    } else {
      response.status(404).end()
    }
  }).catch(next);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
