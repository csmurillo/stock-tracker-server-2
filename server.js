const http = require('http');
const express =require('express');
const mongoose=require('mongoose');
const app = express();
const server = http.createServer(app);

const {userWatchlistLivePriceTargetAlertPrice}=require('./helpers/userWatchlistLivePriceTargetAlertPrice');
const {userWatchlist}=require('./helpers/userWatchlist');
const {WatchList}=require('./models/watchList');

const io = require('socket.io')(server,{
    cors: {
        origin: "http://localhost:3000",
    },
});

// socketio middleware
io.use((socket, next) => {
    const userID = socket.handshake.auth.id;
    
    socket.userID = userID;
    next();
});

io.on('connection',async(socket)=>{

    socket.on('checkLivePrices',async(stocks)=>{
        WatchList.findOne({ owner: socket.userID}, async (err, watchList) => {
            console.log(watchList);
            socket.emit('updateWatchlistLivePrice',{liveWatchList:watchList.stocks.reverse()});
        });
    });
    
    socket.on('onWatchList',async({stockSymbol})=>{
        // console.log('onWatchList');
        let inWatchList=false;
        WatchList.findOne({ owner: socket.userID}, (err, watchList) => {
            const userWatchListStocks = watchList.stocks;
            for(let stockList of userWatchListStocks){
                const watchListSymbol=stockList.tickerSymbol;
                console.log(stockList.priceTargetReached+'~+~');
                console.log(watchListSymbol+'WATCHLIST');
                console.log(stockSymbol+'STOCKSYMBOL');
                if(stockSymbol===watchListSymbol){
                    console.log('inside');
                    console.log(stockList.priceTargetReached);
                    if(!stockList.priceTargetReached){
                        socket.emit('updateOnWatchList',{insideWatchList:true});
                        inWatchList=true;
                    }
                }
            }
            console.log(inWatchList);
            if(!inWatchList){
                socket.emit('updateOnWatchList',{insideWatchList:false});
            }
            console.log('~~~~~~~~~~');
        });
    });
});


// end of io

// connect to mongodb
mongoose.connect(process.env.MONGO_URL)
        .then(()=>{console.log('db connected');})
        .catch(()=>{console.log('error db');});

// stocks: check if a user watchlist stocks live target price reaches alertPrice
setInterval(()=>{
    WatchList.find((err, watchLists) => {
        if (err) {
            console.log('ERROR'+err)
        } else {
            for(let i=0; i<watchLists.length;i++){
                userWatchlistLivePriceTargetAlertPrice(watchLists[i].owner,io);
            }
        }
    });
},10000)

const PORT = process.env.PORT||3008;


server.listen(PORT,()=>{
    console.log(`Listening in port ${PORT}`);
});





