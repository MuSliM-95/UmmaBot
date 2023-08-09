import { Markup } from "telegraf";
import { fileURLToPath } from 'url';
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const latitude = 43.290502;
const longitude = 45.312061;
const urlButton = [Markup.button.webApp("Добавить место", "https://forms.yandex.ru/cloud/64b84610068ff03c122822b1/")];
const callbackButton = [Markup.button.webApp("Яндекс карты ", `https://yandex.com/maps/?ll=${longitude},${latitude}&z=2`)];
const callback = [Markup.button.callback("Время молитв", "Время молитв")];
const addressButton = [Markup.button.text("Посмотреть адреса")];
const prayerButtonlocation = [Markup.button.locationRequest("По геолокации")];
const prayerButton = [Markup.button.callback("По названию города", "По названию города")];
const backButtonRegion = Markup.button.callback("Назад к регионам", "");
const backButtonHome = Markup.button.callback("На главную", "");
export const keyboardСontainer = Markup.keyboard([
    urlButton,
    addressButton,
    callbackButton,
    callback,
]);
export const prayerKeyboardСontainer = Markup.keyboard([
    prayerButton,
    prayerButtonlocation,
    [backButtonHome]
]);
export const keyboardRegionСontainer = async (data, obj) => {
    const { bot, id } = obj;
    const keyboardContainer = [];
    const region = data.sort();
    try {
        region.forEach(el => {
            const button = Markup.button.callback(el, el);
            keyboardContainer.push(button);
        });
        keyboardContainer.push(backButtonHome);
        const keyboardOptions = Markup.keyboard(keyboardContainer);
        await bot.telegram.sendMessage(id, "Выберите регион", keyboardOptions);
    }
    catch (error) {
        console.log(error.message);
    }
};
export const keyboardCityContainer = async (data, obj) => {
    const { bot, id } = obj;
    const keyboardContainer = [];
    const city = data.sort();
    try {
        city === null || city === void 0 ? void 0 : city.forEach(el => {
            const button = Markup.button.callback(el, "");
            keyboardContainer.push(button);
        });
        keyboardContainer.push(backButtonRegion);
        const keyboardOptions = Markup.keyboard(keyboardContainer);
        await bot.telegram.sendMessage(id, "Выберите город", keyboardOptions);
    }
    catch (error) {
        console.log(error.message);
    }
};
export const keyboardAddressContainer = async (data, obj) => {
    const { bot, id } = obj;
    const address = data.sort((a, b) => a.title.localeCompare(b.title));
    const keyboardContainer = [];
    try {
        address === null || address === void 0 ? void 0 : address.forEach(el => {
            const button = Markup.button.callback(`${el.place}: ${el.title}`, ``);
            keyboardContainer.push(button);
        });
        keyboardContainer.push(backButtonHome);
        const keyboardOptions = Markup.keyboard(keyboardContainer);
        await bot.telegram.sendMessage(id, "Выберите Адрес", keyboardOptions);
    }
    catch (error) {
        console.log(error.message);
    }
};
export const addressInfo = async (data, obj) => {
    const { bot, id } = obj;
    try {
        data === null || data === void 0 ? void 0 : data.forEach(async (el) => {
            var _a;
            const inlineKeyboard = {
                inline_keyboard: [
                    [
                        Markup.button.webApp("Открыть в Яндекс картах", `${el === null || el === void 0 ? void 0 : el.address}`)
                    ]
                ]
            };
            const caption = `<strong>${el.title}</strong>\n\n<strong>${el.region}</strong>\n\n<strong>${el.city}</strong>\n\n<strong>${el.place}</strong>\n\n<strong>${el.prayer}</strong>\n\n
                `;
            await bot.telegram.sendPhoto(id, { source: path.join(__dirname, `./db/imagedb/${(_a = el === null || el === void 0 ? void 0 : el.photo) === null || _a === void 0 ? void 0 : _a.image}`) }, { caption, parse_mode: "HTML", reply_markup: inlineKeyboard });
        });
    }
    catch (error) {
        console.error("Ошибка при отправке фото:", error);
    }
};
//# sourceMappingURL=options.js.map