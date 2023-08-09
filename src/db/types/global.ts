export interface Data {
    _id: string,
    region: string,
    city: string,
    title: string,
    place: string,
    prayer: string,
    photo?: {
        image: string,
        imageSrc: string,
    },
    location: string[],
    address: string,

}
export interface File {
    filename: string,
    path: string,
}

export enum Callback {
    BACK_REGION_KEYBOARD
}
