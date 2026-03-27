import { PostalCode } from "./interfaces/mx";
import { instance } from "./rh"

export const getColoniesByPostal = async(postalCode: string) => {
    const {data} = await instance.get<PostalCode>(`postal_code/${postalCode}`);
    return data;
}