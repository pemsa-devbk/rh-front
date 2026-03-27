import dayjs from "dayjs"
import { FormUser, User } from "../api/interfaces/user"

export const parseuserToForm = (user: User): FormUser => {
    return {
        user_id: user.user_id,
        name: user.name,
        gender: user.gender,
        curp: user.curp,
        contract_date: dayjs(user.contract_date),
        birthdate: dayjs(user.birthdate),
        rol: user.rol,
        position_id: user.position_id,
        phone: user.phone,
        ext: user.ext,
        allergies: user.allergies,
        blood_type: user.blood_type,
        nss: user.nss,
        cuip: user.cuip,
        user_chief_id: user.user_chief_id,
        email: user.email,
        address: user.address,
        cell_phone: user.cell_phone,
        enterprise_id: user.position?.area?.office?.enterprise.enterprise_id || '',
        office_id: user.position?.area?.office?.office_id || 0,
        area_id: user.position?.area?.area_id || 0,
    }
}