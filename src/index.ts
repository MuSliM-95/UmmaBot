import express, { Application } from "express"
import { connect } from "mongoose";
import { Telegraf } from "telegraf"
import { Context } from "vm";
import {
    addressInfo, keyboardAddressContainer,
    keyboardCityContainer, keyboardRegionСontainer, keyboardСontainer,
    prayerKeyboardСontainer
} from "./options.js";
import { prayerTime, prayerTimeCity } from "./fetch/fetch.js";
import rgx from "./hooks/regExp/regExp.js";
import router from "./db/routs/rout.js"
import cors from "cors"
import dotenv from 'dotenv'
import { dataController } from "./db/controllers/controllers.js";
import { Data } from "./db/types/global.js";
dotenv.config()


const app: Application = express();
const PORT = process.env.PORT || 5000

const corsOptions = {
    origin: 'https://example.com', // Страница, откуда можно будет получать запрос, еще в разработке
    methods: 'POST'
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(router)




await connect(process.env.MONGODB!)

app.listen(PORT, async () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});


const bot = new Telegraf(process.env.TOKEN!)

const start = async () => {
    let newText: boolean | string[] | undefined = false

    bot.telegram.setMyCommands([
        { command: "/start", description: "Приветствие" },
    ])
    bot.on("message", async (msg: Context) => {


        const { text } = msg.message;
        const { id } = msg.chat;
        const timestamp = msg.update.message.date
        const { location } = msg.update.message

// Получаем данные с базы данных и проводим фильтрацию по региону городу и адресам
        const addressAll = await dataController.getRegion()

        const arrNameRegion = addressAll?.map((address) => address.region)
            .filter((region, index, arrCopy) => arrCopy.indexOf(region) === index);

        const city = addressAll?.map((address) => address.region === text ? address.city : undefined)
            .filter(city => city !== undefined)
            .filter((city, index, arrCopy) => arrCopy.indexOf(city) === index)

        const address = addressAll?.map((address) => address.city === text ? address : undefined)
            .filter((address) => address !== undefined)

        const title = text?.split(": ")[1]

        const sendAddress = addressAll?.filter((address) => address.title === title)

 // Обработка команд кнопок
        if (text === "/start") {
            await msg.reply("Выберите действие", keyboardСontainer);
            console.log(1);
            return

        }

        if (text === "Время молитв") {
            await msg.reply("Выберите действие", prayerKeyboardСontainer);
            console.log(2);
            return
        }

        if (text === "По названию города") {
            newText = true
            await msg.reply("Введите названия города в таком формате: Египет, Каир");
            console.log(3);
            return
        }

        if (!location && newText) {
            newText = rgx(text)
            await prayerTimeCity(newText!, { bot, id })
            console.log(4);
            newText = false
            return
        }

        if (text === "Посмотреть адреса") {
            keyboardRegionСontainer(arrNameRegion as string[], { bot, id })
            console.log(5);
            return
        }

        if (text === "Назад к регионам") {

            keyboardRegionСontainer(arrNameRegion as string[], { bot, id })
            console.log(7);
            return
        }

        if (text === "На главную") {
            console.log(8);
            await msg.reply("Выберите действие", keyboardСontainer);
            return
        }

        if (arrNameRegion && arrNameRegion.indexOf(text) !== -1) {
            console.log(9);
            keyboardCityContainer(city as string[], { bot, id })
            return
        }

        if (text === "Назад к городам") {
            console.log(address);

            keyboardAddressContainer(address as Data[], { bot, id })
            console.log(6);
            return
        }

        if (!location && !title && address) {
            console.log(10);
            keyboardAddressContainer(address as Data[], { bot, id })
            return
        }

        if (!location && sendAddress) {
            console.log(11);
            addressInfo(sendAddress, { bot, id })
            return
        }

        if (location && location.latitude) {
            console.log(12);
            await prayerTime(timestamp, location, { bot, id })
            return
        }
    })


    bot.launch();




}


start()


