import express from "express";
import { connect } from "mongoose";
import { Telegraf } from "telegraf";
import { addressInfo, keyboardAddressContainer, keyboardCityContainer, keyboardRegionСontainer, keyboardСontainer, prayerKeyboardСontainer } from "./options.js";
import { prayerTime, prayerTimeCity } from "./fetch/fetch.js";
import rgx from "./hooks/regExp/regExp.js";
import router from "./db/routs/rout.js";
import cors from "cors";
import dotenv from 'dotenv';
import { dataController } from "./db/controllers/controllers.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {
    origin: 'https://example.com',
    methods: 'POST'
};
app.use(express.json());
app.use(cors(corsOptions));
app.use(router);
await connect(process.env.MONGODB);
app.listen(PORT, async () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
const bot = new Telegraf(process.env.TOKEN);
const start = async () => {
    let newText = false;
    bot.telegram.setMyCommands([
        { command: "/start", description: "Приветствие" },
    ]);
    bot.on("message", async (msg) => {
        const { text } = msg.message;
        const { id } = msg.chat;
        const timestamp = msg.update.message.date;
        const { location } = msg.update.message;
        const addressAll = await dataController.getRegion();
        const arrNameRegion = addressAll === null || addressAll === void 0 ? void 0 : addressAll.map((address) => address.region).filter((region, index, arrCopy) => arrCopy.indexOf(region) === index);
        const city = addressAll === null || addressAll === void 0 ? void 0 : addressAll.map((address) => address.region === text ? address.city : undefined).filter(city => city !== undefined).filter((city, index, arrCopy) => arrCopy.indexOf(city) === index);
        const address = addressAll === null || addressAll === void 0 ? void 0 : addressAll.map((address) => address.city === text ? address : undefined).filter((address) => address !== undefined);
        const title = text === null || text === void 0 ? void 0 : text.split(": ")[1];
        const sendAddress = addressAll === null || addressAll === void 0 ? void 0 : addressAll.filter((address) => address.title === title);
        if (text === "/start") {
            await msg.reply("Выберите действие", keyboardСontainer);
            console.log(1);
            return;
        }
        if (text === "Время молитв") {
            await msg.reply("Выберите действие", prayerKeyboardСontainer);
            console.log(2);
            return;
        }
        if (text === "По названию города") {
            newText = true;
            await msg.reply("Введите названия города в таком формате: Египет, Каир");
            console.log(3);
            return;
        }
        if (!location && newText) {
            newText = rgx(text);
            await prayerTimeCity(newText, { bot, id });
            console.log(4);
            newText = false;
            return;
        }
        if (text === "Посмотреть адреса") {
            keyboardRegionСontainer(arrNameRegion, { bot, id });
            console.log(5);
            return;
        }
        if (text === "Назад к регионам") {
            keyboardRegionСontainer(arrNameRegion, { bot, id });
            console.log(7);
            return;
        }
        if (text === "На главную") {
            console.log(8);
            await msg.reply("Выберите действие", keyboardСontainer);
            return;
        }
        if (arrNameRegion && arrNameRegion.indexOf(text) !== -1) {
            console.log(9);
            keyboardCityContainer(city, { bot, id });
            return;
        }
        if (text === "Назад к городам") {
            console.log(address);
            keyboardAddressContainer(address, { bot, id });
            console.log(6);
            return;
        }
        if (!location && !title && address) {
            console.log(10);
            keyboardAddressContainer(address, { bot, id });
            return;
        }
        if (!location && sendAddress) {
            console.log(11);
            addressInfo(sendAddress, { bot, id });
            return;
        }
        if (location && location.latitude) {
            console.log(12);
            await prayerTime(timestamp, location, { bot, id });
            return;
        }
    });
    bot.launch();
};
start();
//# sourceMappingURL=index.js.map