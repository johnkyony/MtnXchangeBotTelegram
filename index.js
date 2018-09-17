const TelegramBot = require('node-telegram-bot-api');
const token = '688904947:AAEKeXAnFeLBn8llbfF2RmNhzP49Xt7Lw0I'
const bot = new TelegramBot(token , {polling: true})
const axios = require('axios')



bot.on('message' , (msg) => {
  // console.log(msg)  
  bot.sendMessage(msg.chat.id,'Hey, I am the Xchange bot. Which currency rate would you like to see ?' , {
    reply_markup: {
      inline_keyboard: [[
        {text: 'USD/ZAR', callback_data:  'USDZAR'},
        {text: 'USD/EUR' , callback_data:  'USDEUR'},
        {text: 'USD/JPY' , callback_data:'USDJPY' },
        {text: 'USD/GBP' , callback_data: 'USDGBP' }
      ]]
    }
  }) 
    
})

bot.on("callback_query" ,  (callbackQuery) => {
  const message = callbackQuery.message
  const currencyPair = callbackQuery.data
  axios.get('http://apilayer.net/api/live?access_key=dc06fa249f2ea848a27bc0dd50949302&currencies=EUR,GBP,JPY,ZAR')
  .then(response =>{
    const quotes = Object.entries(response.data.quotes) 
    const [pair,rate] = quotes.find(quote => {
      const [pair,rate] = quote      
        return pair === currencyPair
    })
    bot.sendMessage(message.chat.id , rate)
  })
  .catch(error => {
    bot.sendMessage(message.chat.id ,callbackQuery.data)
    console.log(error)
  })    
 
})

