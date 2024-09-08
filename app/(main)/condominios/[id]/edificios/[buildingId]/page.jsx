"use client"
import { useEffect, useState, useRef } from 'react';
import axios from '@/lib/axios';
import useSWR from 'swr';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

import { SplitButton } from 'primereact/splitbutton';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';


const CondominiumPage = ({ params: { id, buildingId } }) => {
    let emptyForm = {
        number: '',
        floor: '',
        description: '',
        ownerName: '',
        ownerEmail: '',
        aliquot: '',
    };

    const closedDialog = { create: false, update: false, deleteBill: false, deleteBills: false, aproveBill: false };
    const [dialog, setDialog] = useState(closedDialog);
    const [form, setForm] = useState(emptyForm);
    const [selected, setSelected] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const fetcher = (url) => axios.get(url)
        .then(res => res.data)
        .then(data => {
            console.log('data', data);
            const transformedDepartments = data.departments.map(({ owner_name, owner_email, ...rest }) => ({
                ...rest,
                ownerName: owner_name,
                ownerEmail: owner_email
            }));
            return { ...data, departments: transformedDepartments };
        });
    const { data: building = {}, mutate, isLoading } = useSWR(`/api/condominiums/${id}/buildings/${buildingId}`, fetcher);
    const { name = '', number = '', address = '', departments = [] } = building;
    console.log(departments);
    const toast = useRef(null);


    const createDepartment = async () => {
        try {

            const data = {
                number: form.number,
                floor: form.floor,
                owner_name: form.ownerName,
                owner_email: form.ownerEmail,
                description: form.description,
                aliquot: form.aliquot,
                condominium_id: id,
                building_id: buildingId,
            }
            console.log(data);
            const response = await axios.post('api/departments/create', {
                ...data
            });

            if (response.status === 200) {
                console.log(response.data)
                toast.current?.show({
                    severity: 'success',
                    summary: 'Creado con exito',
                    detail: 'El apartamento fue agregado a la lista',
                    life: 3000,
                });
                const { data } = response;
                const newDepartment = data.department;
                let _departments = [...building.departments, newDepartment];
                mutate({ ...building, departments: _departments });
                setForm(emptyForm);
                setDialog(closedDialog);
            } else {
                console.log("201");
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo agregar el apartamento',
                    life: 3000,
                });
            }
        } catch (error) {
            console.error('Error creating department:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to create department',
                life: 3000,
            });
        }
    };

    const updateDepartment = () => {
        const data = {
            id: form.id,
            number: form.number,
            floor: form.floor,
            owner_name: form.ownerName,
            owner_email: form.ownerEmail,
            description: form.description,
            aliquot: form.aliquot,
            condominium_id: id,
            building_id: buildingId,
        }
        console.log('data', data);
        axios.put(`/api/departments/${data.id}`, { ...data })
            .then(response => {
                if (response.status === 200) {
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Realizado con exito',
                        detail: 'Departamento actualizado',
                        life: 3000,
                    });
                    const { data } = response;
                    console.log(data);
                    /*                     const data = { ...response.data.department, ownerName: response.data.department.owner_name, ownerEmail: response.data.department.owner_email }; */
                    mutate((prev) => ([...prev.departments, data]));
                    setDialog(closedDialog);
                } else {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to update bill',
                        life: 3000,
                    });
                }
            })
            .catch(error => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to update bill',
                    life: 3000,
                });
                console.error('Error updating bill:', error);
            });
    };

    const deleteDepartment = async () => {
        try {
            const response = await axios.post(`/api/departments/delete`, { id: form.id });
            console.log('Departamento eliminado:', response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };



    const title = () => {
        return (
            <div className='flex justify-content-start bg-gray-300 p-4 gap-4'>
                <span className="text-xl">Edificio: {name} - {number} </span>
                <span className="text-xl">Direccion: {address}</span>
            </div>);
    };

    const hideDialog = () => {
        setForm(emptyForm);
        setDialog(closedDialog);
    };
    const CreateOrUpdateFunction = () => {
        return dialog.create ? createDepartment() : updateDepartment();;
    }
    const dialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={CreateOrUpdateFunction} />{/* onClick={CreateOrUpdateFunction} */}
        </>
    );

    const items = [
        {
            label: 'Update',
            icon: 'pi pi-refresh'
        },
        {
            label: 'Delete',
            icon: 'pi pi-times'
        }
    ];

    const header = () => {
        return (
            <div className='flex justify-content-end  gap-4'>
                <div>
                    <Button icon="pi pi-plus " className="mr-2 "  onClick={() => setDialog({ ...closedDialog, create: true })} />
                </div>
            
            </div>);
    };

    const onInputChange = (e, name) => {

        let val;

        if (name === 'floor')
            val = (e.target && e.target.value).replace(/[^0-9]/g, '').substring(0, 2);
        else if (name === 'aliquot')
            val = (e.target && e.target.value).replace(/[^1-3]/g, '').substring(0, 1);
        else
            val = (e.target && e.target.value);

        let _form = { ...form };
        _form[`${name}`] = val;
        setForm(_form);
    };

    const handleUpdateDepartment = (department) => {
        console.log('dep', department);
        setForm({ ...department });
        setDialog({ ...dialog, update: true })
    }
    const handleDeleteDepartment = (department) => {
        console.log('dep', department);
        setForm({ ...department });
        setDialog({ ...dialog, delete: true })
    }
    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => handleUpdateDepartment(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() =>  handleDeleteDepartment(rowData) } />
            </>
        );
    };

    const deleteDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={() => deleteDepartment()} />
        </>
    );


    return (
        <>
            <Toast ref={toast} />
            <div className="orders-subtable">
                {title()}
                <DataTable
                    value={departments}
                    header={header}
                    selectionMode="checkbox"
                    selection={selected}
                    onSelectionChange={(e) => { console.log(e.value); setSelected(e.value) }}

                >
                    <Column selectionMode="single" headerStyle={{ width: '4rem' }}></Column>
                    <Column field="id" header="Id" sortable></Column>
                    <Column field="number" header="Apto/local" sortable></Column>
                    <Column field="floor" header="Piso" sortable></Column>
                    <Column field="ownerName" header="Responsable" sortable></Column>
                    <Column field="aliquot" header="Alicuota" sortable></Column>
                    <Column field="description" header="descripcion" sortable></Column>
                    <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                </DataTable>
            </div>
            <Dialog visible={dialog.create || dialog.update} style={{ width: '450px' }} header="Bill Details" modal className="p-fluid" footer={dialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="name">Numero:</label>
                    <InputText
                        id="name"
                        value={form.number}
                        onChange={(e) => onInputChange(e, 'number')}
                        required
                        autoFocus
                        className={classNames({
                            'p-invalid': submitted && !form.name
                        })}
                    />
                    {submitted && !form.name && <small className="p-invalid">El numero de apartamento es requerido.</small>}
                </div>
                <div className="field">
                    <label htmlFor="floor">Piso:</label>
                    <InputText
                        id="floor"
                        value={form.floor}
                        onChange={(e) => onInputChange(e, 'floor')}
                        required
                        autoFocus
                        className={classNames({
                            'p-invalid': submitted && !form.floor
                        })}
                    />
                    {submitted && !form.name && <small className="p-invalid">El piso es requerido.</small>}
                </div>
                <div className="field">
                    <label htmlFor="description">Description:</label>
                    <InputText
                        id="description"
                        value={form.description}
                        onChange={(e) => onInputChange(e, 'description')}
                        required
                        autoFocus
                        className={classNames({
                            'p-invalid': submitted && !form.description
                        })}
                    />
                    {submitted && !form.name && <small className="p-invalid">La descripcion es requerida.</small>}
                </div>
                <div className="field">
                    <label htmlFor="aliquot">alicuota:</label>
                    <InputText
                        id="aliquot"
                        value={form.aliquot}
                        onChange={(e) => onInputChange(e, 'aliquot')}
                        required
                        autoFocus
                        className={classNames({
                            'p-invalid': submitted && !form.aliquot
                        })}
                    />
                    {submitted && !form.aliquot && <small className="p-invalid">La alicuota es querida</small>}
                </div>
                <div className="field">
                    <label htmlFor="ownerName">Responsable:</label>
                    <InputText
                        id="ownerName"
                        value={form.ownerName}
                        onChange={(e) => onInputChange(e, 'ownerName')}
                        required
                        autoFocus
                        className={classNames({
                            'p-invalid': submitted && !form.ownerName
                        })}
                    />
                    {submitted && !form.ownerName && <small className="p-invalid">Representante requerido</small>}
                </div>
                <div className="field">
                    <label htmlFor="ownerEmail">Email del esponsable:</label>
                    <InputText
                        id="ownerEmail"
                        value={form.ownerEmail}
                        onChange={(e) => onInputChange(e, 'ownerEmail')}
                        required
                        autoFocus
                        className={classNames({
                            'p-invalid': submitted && !form.ownerEmail
                        })}
                    />
                    {submitted && !form.ownerEmail && <small className="p-invalid">Email del representante requerido</small>}
                </div>
            </Dialog>

            <Dialog visible={dialog.delete} style={{ width: '450px' }} header="Confirm" modal footer={deleteDialogFooter} onHide={hideDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {form && (
                        <span>
                            Deseas eliminar el apartamento: <b>{form.number}</b> piso <b>{form.floor}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
        </>
    );
};

export default CondominiumPage;
