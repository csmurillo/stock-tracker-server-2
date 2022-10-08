const fetch = require('node-fetch');
const { WatchList } = require('../models/watchList');
require("dotenv").config();

// function that looks up if stocks live price has reached alert price
// if so save the date alert price was reached and
// mark the alert price for the particular stock as reached.
exports.userWatchlistLivePriceTargetAlertPrice= (userID)=>{    
        WatchList.findOne({ owner: userID}, async (err, watchList) => {
            // console.log('UserID: '+userID);
            // console.log('Stocks: ');
            const date = new Date();
            const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
            const stocks=watchList.stocks;

            for(let i =0; i<stocks.length;i++){        
                // console.log(stocks[i]);
                const stockSymbol=stocks[i].tickerSymbol;
                // mock data
                const finnhub=`https://mockstockapi.herokuapp.com/api/stockLivePrice?stock=${stockSymbol}`;
                // live data
                // const finnhub=`https://finnhub.io/api/v1/quote?symbol=${stockSymbol}&token=${process.env.STOCK_INFO_FINNHUB_API_KEY}`;
                // const finnhubRes=await fetch(finnhub);
                // const pricePromise=await finnhubRes.json();
                // mock data
                const finnhubRes=await fetch(finnhub);
                const pricePromise=await finnhubRes.json();
                // mock data
                const stockPrice=pricePromise.price;
                // live data
                // const stockPrice=pricePromise.c;
                const alertPrice=stocks[i].alertPrice;
                if(!stocks[i].priceTargetReached){
                    if(stocks[i].alertDirection==='above'){
                        if(parseFloat(stockPrice)>parseFloat(alertPrice)){
                            // console.log('stock ALERT fulfilled above'+stockSymbol+'USER: '+userID);
                            // console.log('StockSymbol:'+stockSymbol);
                            // console.log('stockPrice'+stockPrice+'Alerting at'+alertPrice);
                            // console.log('DATE: '+(month+1)+'/'+day+'/'+year);
                            stocks[i].priceTargetReached=true;
                            stocks[i].datePriceTargetReached=(month+1)+'/'+day+'/'+year;
                            
                            
                            const stock={
                                tickerName:stocks[i].tickerName,
                                tickerSymbol:stocks[i].tickerSymbol,
                                priceAlert:stocks[i].alertPrice,
                                alertDirection:stocks[i].alertDirection,
                                datePriceTargetReached:stocks[i].datePriceTargetReached
                            };
                            // 
                            const stockHistoryRes=fetch(`https://stocktracker-demo-backend.herokuapp.com/api/add/to/stock/history?owner=${watchList.owner}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Accept: 'application/json',
                                },
                                body: JSON.stringify(stock)
                            })
                            .then(response => {
                                return response.json();
                            })
                            .catch(err =>{ return err;});
                            // 

                            // console.log('server 2:(ABOVE)'+JSON.stringify(stockHistoryRes));
                            // console.log('------------------------------------------------');

                            // 
                            // stocks[i].priceTargetReached=true;
                            // stocks[i].datePriceTargetReached=month+'/'+day+'/'+year;
                            // watchList.save((err,watchlist)=>{
                            //     if(err){}
                            // });
                            // 
                            watchList.stocks=watchList.stocks.filter(stock=>stock.tickerSymbol!=stocks[i].tickerSymbol);
                            watchList.save((err,watchlist)=>{
                                if(err){
                                    console.log('error'+err);
                                }
                                console.log(watchlist);
                            });
                        }
                    }
                    else if(stocks[i].alertDirection==='below'){
                        if(parseFloat(stockPrice)<parseFloat(alertPrice)){
                            // console.log('stock ALERT fulfilled below'+'USER: '+userID);
                            // console.log('StockSymbol:'+stockSymbol);
                            // console.log('stockPrice'+stockPrice+'Alerting at'+alertPrice);
                            // console.log('DATE: '+(month+1)+'/'+day+'/'+year);
                            stocks[i].priceTargetReached=true;
                            stocks[i].datePriceTargetReached=(month+1)+'/'+day+'/'+year;


                            const stock={
                                tickerName:stocks[i].tickerName,
                                tickerSymbol:stocks[i].tickerSymbol,
                                priceAlert:stocks[i].alertPrice,
                                alertDirection:stocks[i].alertDirection,
                                datePriceTargetReached:stocks[i].datePriceTargetReached
                            };
                            // 
                            const stockHistoryRes=fetch(`https://stocktracker-demo-backend.herokuapp.com/api/add/to/stock/history?owner=${watchList.owner}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Accept: 'application/json',
                                },
                                body: JSON.stringify(stock)
                            })
                            .then(response => {
                                return response.json();
                            })
                            .catch(err =>{ return err;});
                            // 
                            
                            // console.log('server 2(BELOW):'+JSON.stringify(stockHistoryRes));
                            // console.log('------------------------------------------------');

                            // 
                            // stocks[i].priceTargetReached=true;
                            // stocks[i].datePriceTargetReached=month+'/'+day+'/'+year;
                            // watchList.save((err,watchlist)=>{
                            // });
                            // 
                            watchList.stocks=watchList.stocks.filter(stock=>stock.tickerSymbol!=stocks[i].tickerSymbol);
                            watchList.save((err,watchlist)=>{
                                if(err){
                                    console.log('error'+err);
                                }
                                console.log(watchlist);
                            });
                        }
                    }
                }

            }
        });
};

