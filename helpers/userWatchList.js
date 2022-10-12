const { WatchList } = require('../models/watchList');
require("dotenv").config();

exports.userWatchlist= async(userID)=>{  
        let userWatchlist=[];
        WatchList.findOne({ owner: userID}, async (err, watchList) => {
            console.log(watchList);
        });
        return userWatchlist;
};


