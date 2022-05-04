const fetch = require('node-fetch');
const { WatchList } = require('../models/watchList');
require("dotenv").config();

exports.userWatchlistTargetLivePrice= async(userID)=>{
    WatchList.findOne({ owner: userID}, async (err, watchList) => {
        // console.log('UserID: '+userID);
        // console.log('Stocks: ');
        const date = new Date();
        const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
        const stocks=watchList.stocks;

        for(let i =0; i<stocks.length;i++){        
            console.log(stocks[i]);
            const stockSymbol=stocks[i].tickerSymbol;
            const finnhub=`https://finnhub.io/api/v1/quote?symbol=${stockSymbol}&token=${process.env.STOCK_INFO_FINNHUB_API_KEY}`;
            const finnhubRes=await fetch(finnhub);
            const pricePromise=await finnhubRes.json();
            const stockPrice=pricePromise.c;
            const alertPrice=stocks[i].alertPrice;

            if(stocks[i].alertDirection==='above'){
                if(stockPrice>alertPrice){
                    console.log('stock ALERT fulfilled above'+stockSymbol+'USER: '+userID);
                    console.log('StockSymbol:'+stockSymbol);
                    console.log('stockPrice'+stockPrice+'Alerting at'+alertPrice);
                    console.log('DATE: '+(month+1)+'/'+day+'/'+year);
                    stocks[i].priceTargetReached=true;
                    stocks[i].datePriceTargetReached=month+'/'+day+'/'+year;
                    watchList.save((err,watchlist)=>{
                        if(err){
                            console.log(err);
                        }
                        console.log('~~~~~~~~~~~~~~~~~~~~~~~~');
                        console.log(watchlist);
                    });
                }
            }
            else if(stocks[i].alertDirection==='below'){
                if(stockPrice<alertPrice){
                    console.log('stock ALERT fulfilled below'+'USER: '+userID);
                    console.log('StockSymbol:'+stockSymbol);
                    console.log('stockPrice'+stockPrice+'Alerting at'+alertPrice);
                    console.log('DATE: '+(month+1)+'/'+day+'/'+year);
                    stocks[i].priceTargetReached=true;
                    stocks[i].datePriceTargetReached=month+'/'+day+'/'+year;

                    watchList.save((err,watchlist)=>{
                        if(err){
                            console.log(err);
                        }
                        console.log('~~~~~~~~~~~~~~~~~~~~~~~~');
                        console.log(watchlist);
                    });
                }
            }

        }
    });
};

