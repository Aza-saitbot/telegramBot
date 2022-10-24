const TelegramApi = require('node-telegram-bot-api')
const {againOptions,gameOptions} =require('./options')

const token = '5718329506:AAHcyV5hFvF6Og1J6rQxk4ISFfVxkwnfvHI'

const bot = new TelegramApi(token, {polling:true })

const chats={}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId,`сейчас я загадаю число от 0 до 9, а ты должен отгадать`)
    const randomRandom=Math.floor(Math.random()*10)
    chats[chatId]=randomRandom
    await bot.sendMessage(chatId,'Отгадай',gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command:'/start',description:'Приветствие!'},
        {command:'/info',description:'Хочешь узнать свое имя?'},
        {command:'/game',description:'Игра в отгадай число'},
    ])

    bot.on('message',async msg=>{
        const text = msg.text
        const chatId=msg.chat.id

        if (text === '/start'){
            await bot.sendSticker(chatId,'https://tlgrm.ru/_/stickers/7ee/1ac/7ee1ac07-8e74-4da4-b4b3-4a17ac329a6b/1.webp')
            return  bot.sendMessage(chatId,`Добро пожаловать в телеграм ${msg.from.first_name} !`)
        }
        if (text === '/info'){
            return  bot.sendMessage(chatId,`Тебя зовут ${msg.from.first_name} !`)
        }
        if (text === '/game'){
            return startGame(chatId)
        }

        return bot.sendMessage(chatId,`${msg.from.first_name} я тебя не понимаю, попробую еще раз)`)
    })

    bot.on('callback_query',async (msg)=>{
        const data=msg.data
        const chatId=msg.message.chat.id
        const hiddenNumber=chats[chatId]

        if (data === '/again'){
            return  startGame(chatId)
        }
        if (data === hiddenNumber){
            return bot.sendMessage(chatId,`Поздравляю! ты угадал цифру ${hiddenNumber}`)
        }else {
            return bot.sendMessage(chatId,`К сожалению ты не угадал, бот загад цирфру  ${hiddenNumber}`,againOptions)
        }
    })
}

start()