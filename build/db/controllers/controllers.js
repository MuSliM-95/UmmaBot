import { DataModel } from "../models/dataModel.js";
export const dataController = {
    postData: async (req, res) => {
        var _a, _b;
        try {
            const { title, region, city, place, prayer, address, location } = req.body;
            const data = await DataModel.create({
                title,
                region,
                city,
                place,
                prayer,
                photo: {
                    image: ((_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.filename) || "",
                    imageSrc: (req === null || req === void 0 ? void 0 : req.file) ? (_b = req.file) === null || _b === void 0 ? void 0 : _b.path : "",
                },
                address,
                location
            });
            res.json(data);
        }
        catch (error) {
            res.json(error);
        }
    },
    getRegion: async () => {
        try {
            const data = await DataModel.find();
            return data;
        }
        catch (error) {
            console.log(error.message);
        }
    },
};
//# sourceMappingURL=controllers.js.map