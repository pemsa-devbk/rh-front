import { Button, Drawer, Form, Input, message, Space } from 'antd'
import { Enterprise, FormGetSignature } from '../../../../api/interfaces/enterprise';
import { downloadSignature } from '../../../../api/enterprise';

interface Props {
    open: boolean;
    onClose: () => void;
    enterprise?: Enterprise;
}

export const DrawerSignature = ({ onClose, open, enterprise }: Props) => {
    const [form] = Form.useForm<FormGetSignature>();

    const handleFormSubmit = (values: FormGetSignature) => {
        downloadSignature(enterprise!.enterprise_id, values)
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `firma-${values.name}.png`);
                document.body.appendChild(link);
                link.click()
            })
            .catch(err => {
                message.error(`Error al descargar ${err.message}`)
            })
    }
    return (
        <Drawer
            title="Obtener firma"
            open={open}
            onClose={onClose}
            extra={
                <Space>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button type="primary" onClick={() => form.submit()}>
                        Descargar
                    </Button>
                </Space>
            }
        >
            <Form
                layout='vertical'
                form={form}
                onFinish={handleFormSubmit}
            >
                <Form.Item label="Nombre" name='name' rules={[{ required: true, message: "El nombre es requerido" }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Telefono" style={{ marginBottom: 0 }}>
                    <Form.Item name="phone" style={{ display: 'inline-block', width: 'calc(72%)' }}>
                        <Input placeholder="Ingrese el telefono del empleado" />
                    </Form.Item>
                    <Form.Item name="ext" style={{ display: 'inline-block', width: 'calc(23%)' }}>
                        <Input placeholder="ext" />
                    </Form.Item>
                </Form.Item>

                <Form.Item label="Celular" name='cell_phone'>
                    <Input />
                </Form.Item>

                <Form.Item label="Puesto" name='position'>
                    <Input />
                </Form.Item>
            </Form>
        </Drawer>
    )
}
