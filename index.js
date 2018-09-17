const TelegramBot = require('node-telegram-bot-api');
const token = '688904947:AAEKeXAnFeLBn8llbfF2RmNhzP49Xt7Lw0I'
const bot = new TelegramBot(token , {polling: true})
const axios = require('axios')





// let siteUrl;

// bot.onText(/\/bookmark (.+)/, (msg, match) => {
//   siteUrl = match[1];

//   bot.sendMessage(msg.chat.id,'Got it, in which category?', {
//     reply_markup: {
//       inline_keyboard: [[
//         {
//           text: 'Development',
//           callback_data: 'development'
//         },{
//           text: 'Music',
//           callback_data: 'music'
//         },{
//           text: 'Cute monkeys',
//           callback_data: 'cute-monkeys'
//         }
//       ]]
//     }
//   });
// });
// `${response.data.quotes.USDZAR}`

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
  let currencyData 
  let rates 
  axios.get('http://apilayer.net/api/live?access_key=dc06fa249f2ea848a27bc0dd50949302&currencies=EUR,GBP,JPY,ZAR')
  .then(response =>{
    currencyData = Object.entries(response.data.quotes) 
    rates = currencyData.reduce((accu,data) => {
      const [currency,value] = data
      console.log(`currency: ${currency}, value: ${value}`)
      accu[currency] = value
      return accu
    }, {})
    console.log(rates)
    const rate = rates[callbackQuery.data]  
  
    bot.sendMessage(message.chat.id , rate)
  })
  .catch(error => {
    bot.sendMessage(message.chat.id ,callbackQuery.data)
    console.log(error)
  })
  
  
  // .then(function (response) {
  //   bot.sendMessage(message.chat.id , response.data.quotes.USDEUR) 

  //   console.log(response)
  // }).catch(function (error){
  //   console.log(error)
  //   bot.sendMessage(message.chat.id , error)
  // })
  
  console.log(callbackQuery)
 
})

// bot.on("callback_query" , (callbackQuery) => {
//     const message = callbackQuery.message

//     ogs({'url': siteUrl} , function(error , results){
//         if(results.success){
//             sitesRef.push().set({
//                 name: results.data.ogSiteName,
//                 title: results.data.ogTitle,
//                 description: results.data.ogDescription,
//                 url: siteUrl,
//                 thumbnail: results.data.ogImage.url,
//                 category: callbackQuery.data
//             })

//             bot.sendMessage(message.chat.id, 'Added \"' + results.data.ogTitle + '\" to category \"' + callbackQuery.data + '\"!')
//         } else{
//             sitesRef.push().set({
//                 url: siteUrl
//             })
//             bot.sendMessage(message.chat.id , 'Added new website , but there was no og Data !')
//         }
//     })
// })