import { ValidContact } from "../request/contact";

export interface Contact{
    id: number;
    contact: string;
    type: ValidContact;
    notes: string;
}