const mongoose = require("mongoose");

const db = require("../models");

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true });

module.exports = (app) => {
    app.post('/api/workouts', ({ body }, res) => {
        body.day = new Date();
        db.Workout.create(body)
        .then(dbRes => {
            res.json(dbRes);
        })
        .catch(err => {
            res.status(500).json(err);
        });
    });

    app.get('/api/workouts/range', (req, res) => {
        db.Workout.find({})
        .then(dbRes => {
            res.json(dbRes);
        })
        .catch(err => {
            res.status(500).json(err);
        });
    });

    app.get('/api/workouts', (req, res) => {
        db.Workout.find({})
        .then(dbRes => {
            console.log(dbRes);
            res.json(dbRes);
        })
        .catch(err => {
            res.status(500).json(err);
        });
    });

    app.get('api/workouts/:id', ({ params }, res) => {
        const id = params.id;
        
        db.Workout.find({ _id: id } , 'name', (dbRes => {
            console.log(dbRes);
            if (!dbRes) return res.status(404).json({"Error": "Workout ID not found!"})
            res.json(dbRes);
        })
        .catch(err => {
            res.status(500).json(err);
        }));
    });


    app.put('/api/workouts/:id', ({ params, body }, res) => {
        const id = params.id;

        db.Workout.findByIdAndUpdate(
            id,
            { $push :  { exercises: body } },
            {}, ((err, dbRes) => {
                if (!dbRes) return res.status(404).json({"Error": "Workout ID not found!"});
                if (err) return res.status(500).json({"Error": "Something went wrong!"});
                res.json(dbRes);
        }));
    });

};
