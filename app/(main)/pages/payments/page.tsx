/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { Demo } from '@/types';
import axios from '@/lib/axios';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Crud = () => {

    let emptyBill: Demo.Bill = {
        id: '',
        name: '',
        description: '',
        amount: 0,
        cuota: 0,
        type: 'scheduled',
        deadline: undefined,
    };

    const billsData = [
        {
            "id": 1,
            "name": "Autem natus doloremque magni et.",
            "description": "Voluptatibus at omnis unde tenetur maiores voluptatem. Quia molestiae qui illo totam veniam nisi repellendus. In aut adipisci perferendis dicta temporibus repudiandae. Commodi et nesciunt totam neque consequatur.",
            "type": "scheduled",
            "amount": 5680,
            "cuota": 284,
            "deadline": new Date("2024-08-15T03:32:11.965176Z")
        },
        {
            "id": 2,
            "name": "Ad voluptate perspiciatis maxime tempore et assumenda iusto ipsum.",
            "description": "Similique nihil dolorum ut enim dolor. Consequatur tenetur fuga blanditiis quaerat nisi rem ratione eos. Quaerat et nisi voluptas excepturi incidunt.",
            "type": "scheduled",
            "amount": 5680,
            "cuota": 284,
            "deadline": new Date("2024-08-15T03:32:11.965331Z")
        },
        {
            "id": 3,
            "name": "Est aut ut perferendis vitae architecto.",
            "description": "Dolore est eligendi aut dolores. Quia nihil quae doloremque aperiam saepe.",
            "type": "scheduled",
            "amount": 5680,
            "cuota": 284,
            "deadline": new Date("2024-08-15T03:32:11.965415Z")
        },
        {
            "id": 6,
            "name": "dwadawdawda",
            "description": "dwadwadawdawdawd",
            "type": "occasional",
            "amount": 44440.22,
            "cuota": 444,
            "deadline":  new Date("2024-08-15T04:53:18.686276Z")
        }
    ];

    const [bills, setBills] = useState(billsData);
    const [billDialog, setBillDialog] = useState(false);
    const [deleteBillDialog, setDeleteBillDialog] = useState(false);
    const [deleteBillsDialog, setDeleteBillsDialog] = useState(false);
    const [bill, setBill] = useState<Demo.Bill>(emptyBill);
    const [selectedBills, setSelectedBills] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

    const openNew = () => {
        setBill(emptyBill);
        setSubmitted(false);
        setBillDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setBillDialog(false);
    };

    const hideDeleteBillDialog = () => {
        setDeleteBillDialog(false);
    };

    const hideDeleteBillsDialog = () => {
        setDeleteBillsDialog(false);
    };


    const createBill = async () => {
        try {
            const response = await axios.post('api/bills/create', {
                name: bill.name,
                description: bill.description,
                amount: bill.amount,
                cuota: bill.cuota,
                type: bill.type,
                deadline: bill.deadline,
            });

            if (response.status === 200) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Bill Created',
                    life: 3000,
                });
                console.log(response.data);
                const { data } = response;
                const newBill = {
                    id: data.id,
                    name: data.name,
                    description: data.description,
                    amount: data.amount,
                    cuota: data.cuota,
                    type: data.type,
                    deadline: new Date(data.deadline),
                };
                setBills([...bills, newBill]);
                setBill(emptyBill);
                setBillDialog(false);
            } else {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to create bill',
                    life: 3000,
                });
            }
        } catch (error) {
            console.error('Error creating bill:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to create bill',
                life: 3000,
            });
        }
    };
    const saveBill = () => {
        setSubmitted(true);

        if (bill.name.trim()) {
            let _bills = [...(bills as any)];
            let _bill = { ...bill };
            if (bill.id) {
                const index = findIndexById(bill.id);

                _bills[index] = _bill;
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Bill Updated',
                    life: 3000
                });
            } else {
                _bill.id = createId();
                _bills.push(_bill);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Bill Created',
                    life: 3000
                });
            }

            setBills(_bills as any);
            setBillDialog(false);
            setBill(emptyBill);
        }
    };

    const editBill = (bill: Demo.Bill) => {
        setBill({ ...bill });
        setBillDialog(true);
    };

    const confirmDeleteBill = (bill: Demo.Bill) => {
        setBill(bill);
        setDeleteBillDialog(true);
    };

    const deleteBill = () => {
        let _bills = (bills as any)?.filter((val: any) => val.id !== bill.id);
        setBills(_bills);
        setDeleteBillDialog(false);
        setBill(emptyBill);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Bill Deleted',
            life: 3000
        });
    };

    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < (bills as any)?.length; i++) {
            if ((bills as any)[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteBillsDialog(true);
    };

    const deleteSelectedBills = () => {
        let _bills = (bills as any)?.filter((val: any) => !(selectedBills as any)?.includes(val));
        setBills(_bills);
        setDeleteBillsDialog(false);
        setSelectedBills(null);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Bills Deleted',
            life: 3000
        });
    };

    const onCategoryChange = (e: RadioButtonChangeEvent) => {
        let _bill: Demo.Bill = { ...bill };
        _bill['type'] = e.value;
        setBill(_bill);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _bill = { ...bill };
        _bill[`${name}`] = val;

        setBill(_bill);
    };

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value || 0;
        let _bill = { ...bill };
        _bill[`${name}`] = val;

        setBill(_bill);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedBills || !(selectedBills as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const codeBodyTemplate = (rowData: Demo.Bill) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
        );
    };

    const nameBodyTemplate = (rowData: Demo.Bill) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const dateBodyTemplate = (rowData: Demo.Bill) => {
        const date = rowData.deadline as Date;
        return (
            <>
                <span className="p-column-title">Deadline</span>
                {date.toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                })}
            </>
        );
    };

    const amountBodyTemplate = (rowData: Demo.Bill) => {
        return (
            <>
                <span className="p-column-title">Price</span>
                {formatCurrency(rowData.amount as number)}
            </>
        );
    };
    const cuotaBodyTemplate = (rowData: Demo.Bill) => {
        return (
            <>
                <span className="p-column-title">Price</span>
                {formatCurrency(rowData.cuota as number)}
            </>
        );
    };


    const typeBodyTemplate = (rowData: Demo.Bill) => {
        return (
            <>
                <span className="p-column-title">Type</span>
                {rowData.type}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Demo.Bill) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editBill(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteBill(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Bills</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const billDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={createBill} />
        </>
    );
    const deleteBillDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteBillDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteBill} />
        </>
    );
    const deleteBillsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteBillsDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedBills} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={bills}
                        selection={selectedBills}
                        onSelectionChange={(e) => setSelectedBills(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Bills"
                        globalFilter={globalFilter}
                        emptyMessage="No bills found."
                        header={header}

                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Id" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
                        <Column field="name" header="Name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>

                        <Column field="price" header="Amount" body={amountBodyTemplate} sortable></Column>
                        <Column field="price" header="Fee" body={cuotaBodyTemplate} sortable></Column>

                        <Column field="type" header="Type" sortable body={typeBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>

                        <Column field="deadline" header="Date" sortable body={dateBodyTemplate} style={{ minWidth: '15re' }}></Column>

                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={billDialog} style={{ width: '450px' }} header="Bill Details" modal className="p-fluid" footer={billDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText
                                id="name"
                                value={bill.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !bill.name
                                })}
                            />
                            {submitted && !bill.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea id="description" value={bill.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                        </div>

                        <div className="field">
                            <label className="mb-3">Type</label>
                            <div className="formgrid grid">
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="type1" name="type" value="scheduled" onChange={onCategoryChange} checked={bill.type === 'scheduled'} />
                                    <label htmlFor="type1">Schelduled</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="type2" name="type" value="occasional" onChange={onCategoryChange} checked={bill.type === 'occasional'} />
                                    <label htmlFor="type2">Occasional</label>
                                </div>

                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="price">Amount</label>
                                <InputNumber id="price" value={bill.amount} onValueChange={(e) => onInputNumberChange(e, 'amount')} mode="currency" currency="USD" locale="en-US" />
                            </div>
                            <div className="field col">
                                <label htmlFor="quantity">Cuota</label>
                                <InputNumber id="quantity" value={bill.cuota} onValueChange={(e) => onInputNumberChange(e, 'cuota')} mode="currency" currency="USD" locale="en-US" />
                            </div>
                        </div>
                        <div className="field">
                            <Calendar value={bill.deadline ?? undefined} onChange={(e) => setBill({ ...bill, deadline: e.value ?? undefined })} dateFormat="dd/mm/yy" />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteBillDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteBillDialogFooter} onHide={hideDeleteBillDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {bill && (
                                <span>
                                    Are you sure you want to delete <b>{bill.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteBillsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteBillsDialogFooter} onHide={hideDeleteBillsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {bill && <span>Are you sure you want to delete the selected bills?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;
