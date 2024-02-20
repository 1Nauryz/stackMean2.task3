const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    _id: String,
    date: Date,
    team_1: String,
    team_2: String,
    _map: String,
    result_1: Number,
    result_2: Number,
    map_winner: Number,
    starting_ct: Number,
    ct_1: Number,
    t_2: Number,
    t_1: Number,
    ct_2: Number,
    event_id: Number,
    match_id: Number,
    rank_1: Number,
    rank_2: Number,
    map_wins_1: Number,
    map_wins_2: Number,
    match_winner: Number
});

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;
