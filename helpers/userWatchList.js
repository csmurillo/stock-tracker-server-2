const fetch = require('node-fetch');
const { WatchList } = require('../models/watchList');
require("dotenv").config();

exports.userWatchlist= async(userID)=>{  
    //    console.log('userWatchLIST!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        let userWatchlist=[];
        // let outside="outside!!!";
        WatchList.findOne({ owner: userID}, async (err, watchList) => {
            console.log(watchList);
        });
        // console.log(userWatchlist);
        return userWatchlist;
};


