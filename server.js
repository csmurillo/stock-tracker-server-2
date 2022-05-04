const express =require('express');
const mongoose=require('mongoose');
const app = express();
const {userWatchlistTargetLivePrice}=require('./helpers/userWatchlistTargetLivePrice');
const {WatchList}=require('./models/watchList');

// connect to mongodb
mongoose.connect()
        .then(()=>{console.log('db connected');})
        .catch(()=>{console.log('error db');});

// stocks: check live target price fulfilled
setInterval(()=>{
    // console.log('setInterval');
    WatchList.find((err, watchLists) => {
        if (err) {
            console.log('ERROR'+err)
        } else {
            for(let i=0; i<watchLists.length;i++){
                userWatchlistTargetLivePrice(watchLists[i].owner);
            }
        }
    });
    // console.log('-------------------------------------------------------');
    // console.log('-------------------------------------------------------');
    // console.log('-------------------------------------------------------');
},10000)

const PORT = process.env.PORT||3004;


app.listen(PORT,()=>{
    console.log(`Listening in port ${PORT}`);
});





