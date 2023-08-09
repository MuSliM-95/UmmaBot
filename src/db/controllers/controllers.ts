import { DataModel } from "../models/dataModel.js";
import { Request } from "express";
import { Response } from 'express';






export const dataController = {
    postData: async (req: Request, res: Response): Promise<void> => {
        try {
            const { title, region, city, place, prayer, address, location
            } = req.body
            const data = await DataModel.create({
                title,
                region,
                city,
                place,
                prayer,
                photo: {
                    image: req?.file?.filename || "",
                    imageSrc: req?.file ? req.file?.path : "",
                },
                address,
                location
            })
 
            res.json(data)
        } catch (error) {
            res.json(error)

        }
    },

    getRegion: async () => {
        try {
            const data = await DataModel.find()

            return data

        } catch (error) {
            console.log((error as Error).message);
        }
    },







}