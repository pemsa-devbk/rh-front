import { Area } from "../api/interfaces/area";
import { Department } from "../api/interfaces/department";
import { Enterprise } from "../api/interfaces/enterprise";
import { DefaultOptionType } from "../api/interfaces/general";
import { Office } from "../api/interfaces/office";
import { Position } from "../api/interfaces/position";

interface Send {
    enterprise?: DefaultOptionType<string>,
    office?: DefaultOptionType<number>,
    department?: DefaultOptionType<number>,
    area?: DefaultOptionType<number>,
}
export const getInitialValues = (enterprise?: Enterprise, office?: Office, department?: Department, area?: Area, position?: Position): Send => ({
    enterprise: enterprise ? { value: enterprise.enterprise_id, label: enterprise.name }
        : office ? { value: office.enterprise_id, label: office.enterprise_name }
            : department ? { value: department.enterprise_id, label: department.enterprise_name }
                : area ? { value: area.enterprise_id, label: area.enterprise_name }
                    : position ? { value: position.enterprise_id, label: position.enterprise_name } : undefined,
    office: office ? { value: office.office_id, label: office.name }
        : department ? { value: department.office_id, label: department.office_name }
            : area ? { value: area.office_id, label: area.office_name }
                : position ? { value: position.office_id, label: position.office_name } : undefined,
    department: department ? { value: department.department_id, label: department.name }
        : area ? { value: area.department_id, label: area.department_name }
            : position ? { value: position.department_id, label: position.department_name } : undefined,
    area: area ? { value: area.area_id, label: area.name }
            : position ? { value: position.area_id, label: position.area_name } : undefined,
});

export const getResponsible = (department?: Department, area?: Area) => {
    return (department && department.responsible_user_id && department.responsible_name) ? { value: department.responsible_user_id, label: department.responsible_name }
        : (area && area.responsible_name && area.responsible_user_id) ? { value: area.responsible_user_id, label: area.responsible_name } : undefined
}