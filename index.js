const TelegramBot = require('node-telegram-bot-api');
const token = '688904947:AAEKeXAnFeLBn8llbfF2RmNhzP49Xt7Lw0I'
const bot = new TelegramBot(token , {polling: true})
const axios = require('axios')



bot.on('message' , (msg , match) => {
  console.log(match)
  const msgText = msg.text
  console.log(msg)  
  if( msgText.startsWith("/quote") === false){
    bot.sendMessage(msg.chat.id,'Hey, I am the Xchange bot. Which exchange rate would you like to see ?' , {
      reply_markup: {
        inline_keyboard: [[
          {text: 'ZAR/USD', callback_data:  'USDZAR'},
          {text: 'ZAR/EUR' , callback_data:  'USDEUR'},
          {text: 'ZAR/JPY' , callback_data:'USDJPY' },
          {text: 'ZAR/GBP' , callback_data: 'USDGBP' }  
        ]]
      }
    }) 
  }
 
    
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
    
    const [basePair , baseRate] = quotes.find(quote => {
      const [basePair , baseRate] = quote
      return basePair === 'USDZAR'
    })

    let convertedRate

    if (currencyPair != 'USDZAR') {
      convertedRate = baseRate / rate
    } else {
      convertedRate = rate
    }

   
    
    bot.sendMessage(message.chat.id , convertedRate.toFixed(2))
  })
  .catch(error => {
    bot.sendMessage(message.chat.id ,"Please try again there has been an error")
    console.log(error)
  })    
 
})

bot.onText(/\/quote (.+)/ , (msg , match) => {
  const quotePair = match[1]
  
  axios.get('http://apilayer.net/api/live?access_key=dc06fa249f2ea848a27bc0dd50949302&currencies=EUR,GBP,JPY,ZAR')
  .then(response =>{
    const quotes = Object.entries(response.data.quotes) 
    const [pair,rate] = quotes.find(quote => {
      const [pair,rate] = quote  
      
        return pair === quotePair
    })
    bot.sendMessage(msg .chat.id , rate)
  })
  .catch(error => {
    bot.sendMessage(message.chat.id ,"Please try again there has been an error")
    console.log(error)
  })    

})

