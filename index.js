const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {db} = require("./config/db");
const app = express();
const port = 3000;
const Match = require('./model/match');

app.use(cors());
app.use(bodyParser.json());

const main = () => {
    return new Promise( (resolve,reject)=>
    {
        mongoose
            .connect(db)
            .then(() => {
                console.log('DB Connected');
                app.listen(port, () => {
                    console.log('Server started' + port)
                    resolve();
                })
            })
            .catch((err)=>{
                console.log(err)
            })
    })
}

app.get('/', (req, res) => {
    res.send('Stack Mean. Task 3!!');
});

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('MongoDB disconnected due to app termination');
        process.exit(0);
    });
});

Match.collection.createIndex({ team_1: 1 });
Match.collection.createIndex({ team_2: 1 });
Match.collection.createIndex({ date: 1 });
Match.collection.createIndex({ result_1: 1 });
Match.collection.createIndex({ result_2: 1 });

// Total matches
Match.countDocuments({})
    .then(count => console.log("Total matches:", count))
    .catch(err => console.error("Error:", err));

// Most popular map
Match.aggregate([
    {
        $group: {
            _id: "$_map",
            count: { $sum: 1 }
        }
    },
    {
        $sort: { count: -1 }
    },
    {
        $limit: 1
    }
])
    .then(result => {
        if (result.length > 0) {
            console.log("Most popular map:", result[0]._id);
        } else {
            console.log("No results found for the most popular map.");
        }
    })
    .catch(err => console.error("Error:", err));


// Search for matches that ended with a score of 16:0
Match.countDocuments({ result_1: 16, result_2: 0 })
    .then(count => console.log("Number of matches with result 16:0:", count))
    .catch(err => console.error("Error:", err));


const generateTestData = async () => {
    const testData = [];
    for (let i = 0; i < 1000000; i++) {
        testData.push({
            _id: mongoose.Types.ObjectId(),
            date: new Date(),
            team_1: "TeamOne",
            team_2: "TeamTwo",
            _map: "MapName",
            result_1: Math.floor(Math.random() * 17), // случайный результат от 0 до 16
            result_2: Math.floor(Math.random() * 17), // случайный результат от 0 до 16
            map_winner: Math.random() < 0.5 ? 1 : 2, // случайный победитель
            starting_ct: Math.random() < 0.5 ? 1 : 2,
            ct_1: Math.floor(Math.random() * 16),
            t_2: Math.floor(Math.random() * 16),
            t_1: Math.floor(Math.random() * 16),
            ct_2: Math.floor(Math.random() * 16),
            event_id: Math.floor(Math.random() * 10000),
            match_id: Math.floor(Math.random() * 10000000),
            rank_1: Math.floor(Math.random() * 100),
            rank_2: Math.floor(Math.random() * 100),
            map_wins_1: Math.floor(Math.random() * 3),
            map_wins_2: Math.floor(Math.random() * 3),
            match_winner: Math.random() < 0.5 ? 1 : 2
        });
    }
    await Match.insertMany(testData);
};

const testPerformance = async () => {
    console.time("Query without aggregation");
    await Match.countDocuments({ result_1: 16, result_2: 0 });
    console.timeEnd("Query without aggregation");

    console.time("Query with aggregation");
    await Match.aggregate([
        {
            $match: {
                result_1: 16,
                result_2: 0
            }
        },
        {
            $count: "totalMatches"
        }
    ]);
    console.timeEnd("Query with aggregation");
};

(async () => {
    await generateTestData(); // Генерация данных
    await testPerformance(); // Тестирование производительности
})();

main()
    .then(() => {
        console.log("Success")
    })
    .catch((err)=>{
        console.log("ERROR")
    })

