'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Calendar } from 'primereact/calendar';
import axios from '@/lib/axios';
import useSWR from 'swr';
import { Dropdown } from 'primereact/dropdown';

const Crud = () => {

    let emptyBill = {
        id: '',
        name: '',
        description: '',
        amount: 0,
        cuota: 0,
        type: 'scheduled',
        deadline: undefined,
        created_at: undefined,
        updated_at: undefined,
        payment: undefined,
    };

    let emptyPayment = {
        id: null,
        number: null,
        floor: null,
        owner: '',
        amount: null,
        status: 'Pending',
        method: { label: 'Cash', value: 'Cash' },
        date: undefined,

    };

    const methodOptions = [
        { label: 'Credit', value: 'Credit' },
        { label: 'Debit', value: 'Debit' },
        { label: 'PagoMovil', value: 'PagoMovil' },
        { label: 'Cash', value: 'Cash' },
        { label: 'Transfer', value: 'Transfer' },
    ];

    const closedDialog = { create: false, update: false, deleteBill: false, deleteBills: false, aproveBill: false };

    const [billDialog, setBillDialog] = useState(closedDialog);

    const [bill, setBill] = useState(emptyBill);
    const [payment, setPayment] = useState(emptyPayment);
    const [selectedBills, setSelectedBills] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [expandedRows, setExpandedRows] = useState({});

    const toast = useRef(null);
    const dt = useRef(null);


    const fetcher = (url) => axios.get(url).then(res => res.data).then(data => data.map((bill) => ({ ...bill, deadline: new Date(bill.deadline), created_at: new Date(bill.created_at), updated_at: new Date(bill.updated_at) })));
    const { data: bills = [], mutate, isLoading } = useSWR('/api/bills', fetcher);
    console.log(bills);

    const formatCurrency = (value) => {
        return value?.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

    const openNew = () => {
        setBill(emptyBill);
        setSubmitted(false);
        setBillDialog({ ...closedDialog, create: true });
    };

    const hideDialog = () => {
        setSubmitted(false);
        setBillDialog(closedDialog);
    };

    const hideDeleteBillDialog = () => {
        setBillDialog(closedDialog);
    };

    const hideDeleteBillsDialog = () => {
        setBillDialog(closedDialog);
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
                mutate([...bills, newBill]);
                setBill(emptyBill);
                setBillDialog({ ...closedDialog });
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

    const updateBill = (bill) => {
        const formattedBill = {
            ...bill,
            deadline: bill.deadline?.toISOString(),
            created_at: bill.created_at?.toISOString(),
            updated_at: bill.updated_at?.toISOString(),
        };
        axios.put(`/api/bills/${bill.id}`, formattedBill)
            .then(response => {
                if (response.status === 200) {
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Bill Updated',
                        life: 3000,
                    });
                    const data = { ...response.data, deadline: new Date(bill.deadline), created_at: new Date(bill.created_at), updated_at: new Date(bill.updated_at)};
                    mutate((prev) => ([ ...prev, data ]));
                    setBillDialog({ ...closedDialog });
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
    const deleteBill = (id) => {
        axios.post('/api/bills/cancel', { id })
            .then(response => {
                if (response.status === 200) {
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Bill Deleted',
                        life: 3000,
                    });
                    const { data: deletedBill } = response;
                    mutate(bills.filter((bill) => bill.id !== deletedBill.id));
                    setBillDialog({ ...closedDialog });
                    setBill(emptyBill);
                } else {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to delete bill',
                        life: 3000,
                    });
                }
            })
            .catch(error => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete bill',
                    life: 3000,
                });
                console.error('Error deleting bill:', error);
            });
    };

    const updateBillPaymentStatus = (billId) => {
        mutate(() => {
            return bills.map((bill) => {
                if (bill.id == billId) {
                    const updatedPayments = bill.payments?.map(p => {
                        if (p.id === payment.id) {
                            return { ...p, status: 'Paid' };
                        }
                        return p;
                    });
                    return { ...bill, payments: updatedPayments };
                }
                return bill;
            });
        });
    };

    const aprovePayment = () => {
        const data = {
            department_id: payment.id,
            bill_id: Object.keys(expandedRows)[0],
            status: 'Paid',
            method: payment.method,
            amount: payment.amount,
        };
        axios.post('/api/bills/' + data.bill_id + '/pay', { ...data })
            .then(response => {
                if (response.status === 200) {
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Payment Aproved',
                        life: 3000,
                    });
                    updateBillPaymentStatus(data.bill_id);
                    setBillDialog({ ...closedDialog });
                    setBill(emptyBill);

                } else {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to delete bill',
                        life: 3000,
                    });
                }
            })
            .catch(error => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete bill',
                    life: 3000,
                });
                console.error('Error deleting bill:', error);
            });

    }

    const editBill = (bill) => {
        setBill({ ...bill });
        setBillDialog({ ...closedDialog, update: true });
    };

    const aproveBill = (roWpayment) => {
        setPayment({ ...payment, ...roWpayment });
        setBillDialog({ ...closedDialog, aproveBill: true });
    }

    const confirmDeleteBill = (bill) => {
        setBill(bill);
        setBillDialog({ ...closedDialog, deleteBill: true });
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setBillDialog({ ...closedDialog, deleteBills: true });
    };

    const deleteSelectedBills = () => {
        let _bills = (bills)?.filter((val) => !(selectedBills)?.includes(val));
        mutate(_bills);
        setBillDialog({ ...closedDialog });
        setSelectedBills(null);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Bills Deleted',
            life: 3000
        });
    };

    const onCategoryChange = (e) => {
        let _bill = { ...bill };
        _bill['type'] = e.value;
        setBill(_bill);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _bill = { ...bill };
        _bill[`${name}`] = val;

        setBill(_bill);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _bill = { ...bill };
        _bill[`${name}`] = val;

        setBill(_bill);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nueva" icon="pi pi-plus" className=" mr-2" onClick={openNew} />
                   {/*  <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedBills || !(selectedBills).length} /> */}
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
             {/*    <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" /> */}
                <Button label="Exportar a excel" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const codeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
        );
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const dateBodyTemplate = (rowData) => {
        const date = rowData.deadline;
        return (
            <>
                <span className="p-column-title">Deadline</span>
                {date?.toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                })}
            </>
        );
    };
    const updatedAtBodyTemplate = (rowData) => {
        const date = rowData.updated_at;

        return (
            <>
                <span className="p-column-title">Deadline</span>
                {date?.toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                })}
            </>
        );
    };
    const createdAtBodyTemplate = (rowData) => {
        const date = rowData.created_at;
        return (
            <>
                <span className="p-column-title">Deadline</span>
                {date?.toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                })}
            </>
        );
    };

    const amountBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Price</span>
                {formatCurrency(rowData.amount)}
            </>
        );
    };
   


    const typeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Type</span>
                {rowData.type}
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editBill(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteBill(rowData)} />
            </>
        );
    };

    const paymentsActionsBodyTemplate = (rowData) => {

        return (
            <>
                {rowData.status == 'Pending' && <Button icon="pi pi-check" rounded severity="success" className="mr-2" onClick={() => aproveBill(rowData)} />}
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Administrar cuentas</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const CreateOrUpdateFunction = () => {
        return billDialog.create ? createBill() : updateBill(bill);
    }

    const billDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-save" text onClick={CreateOrUpdateFunction} />
        </>
    );
    const deleteBillDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteBillDialog} />
            <Button label="Yes" icon="pi pi-trash" text onClick={(rowData) => deleteBill(bill.id)} />
        </>
    );
    const deleteBillsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteBillsDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedBills} />
        </>
    );

    const aprovePaymentDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteBillsDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={aprovePayment} />
        </>
    );

    const rowExpansionTemplate = (bill) => {
        return (
            <div className="orders-subtable">
                <h5>Payments</h5>
                <DataTable value={bill.payments} >
                    <Column field="id" header="Id" sortable></Column>
                    <Column field="number" header="Apto/local" sortable></Column>
                    <Column field="floor" header="Piso" sortable></Column>
                    <Column field="building" header="Edificio" sortable></Column>
                    <Column field="owner" header="Responsable" sortable></Column>
                    <Column field="amount" header="Monto" body={amountBodyTemplate} sortable></Column>
                    <Column field="status" header="Estatus" sortable></Column>
                    <Column body={paymentsActionsBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                </DataTable>
            </div>
        );
    };

    const handleExpandeRow = (data) => {
        const dataString = data.toString();
        let _expandedRows = {};

        if (expandedRows[dataString]) {
            setExpandedRows({});
            return;
        } else {
            _expandedRows[data] = true;
        }

        setExpandedRows(_expandedRows);
    };

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
                        onSelectionChange={(e) => setSelectedBills(e.value)}
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
                        loading={isLoading}

                        onRowClick={(rowData) => { handleExpandeRow(rowData.data.id) }}

                        expandedRows={expandedRows}


                        rowExpansionTemplate={rowExpansionTemplate}
                    >

                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Id" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
                        <Column field="name" header="Descripcion" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="price" header="Monto" body={amountBodyTemplate} sortable></Column>
                        <Column field="type" header="Tipo" sortable body={typeBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="created_at" header="Creada" sortable body={createdAtBodyTemplate} style={{ minWidth: '15re' }}></Column>
                        <Column field="deadline" header="Vence" sortable body={dateBodyTemplate} style={{ minWidth: '15re' }}></Column>
                        <Column field="updated_at" header="Actualizada" sortable body={updatedAtBodyTemplate} style={{ minWidth: '15re' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={billDialog.create || billDialog.update} style={{ width: '450px' }} header="Detalle de cuenta" modal className="p-fluid" footer={billDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Nombre</label>
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
                            {submitted && !bill.name && <small className="p-invalid">El nombre es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Descripcion</label>
                            <InputTextarea id="description" value={bill.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                        </div>

                        <div className="field">
                            <label className="mb-3">Tipo de cuenta</label>
                            <div className="formgrid grid">
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="type1" name="type" value="scheduled" onChange={onCategoryChange} checked={bill.type === 'scheduled'} />
                                    <label htmlFor="type1">Programada</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="type2" name="type" value="occasional" onChange={onCategoryChange} checked={bill.type === 'occasional'} />
                                    <label htmlFor="type2">Eventual</label>
                                </div>

                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="price">Monto</label>
                                <InputNumber id="price" value={bill.amount} onValueChange={(e) => onInputNumberChange(e, 'amount')} mode="currency" currency="USD" locale="en-US" />
                            </div>
                            <div className="field col">
                                <label htmlFor="quantity">Cuota</label>
                                <InputNumber id="quantity" value={bill.cuota} onValueChange={(e) => onInputNumberChange(e, 'cuota')} mode="currency" currency="USD" locale="en-US" />
                            </div>
                        </div>
                        <div className="field">
                        <label htmlFor="quantity">Fecha vencimiento</label>
                            <Calendar value={bill.deadline ?? undefined} onChange={(e) => setBill({ ...bill, deadline: e.value ?? undefined, payment: undefined })} dateFormat="dd/mm/yy" placeholder='Seleccione la fecha de vencimiento'/>
                        </div>
                        <div className="field">
                            <label htmlFor="method">Metodo de pago</label>
                            <Dropdown
                                placeholder='Seleccione un metodo de pago'
                                value={bill.method}
                                options={methodOptions}
                                onChange={(e) => setBill({ ...bill, method: e.value, payment: undefined })}
                                required
                                className={classNames({
                                    'p-invalid': submitted && !bill.method
                                })}
                            />
                            {submitted && !bill.method && <small className="p-invalid">El metodo de pago es requerido.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={billDialog.deleteBill} style={{ width: '450px' }} header="Confirm" modal footer={deleteBillDialogFooter} onHide={hideDeleteBillDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {bill && (
                                <span>
                                  Estas seguro que deseas borrar <b>{bill.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={billDialog.deleteBills} style={{ width: '450px' }} header="Confirm" modal footer={deleteBillsDialogFooter} onHide={hideDeleteBillsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {bill && <span>Are you sure you want to delete the selected bills?</span>}
                        </div>


                    </Dialog>

                    <Dialog visible={billDialog.aproveBill} style={{ width: '450px' }} header="Confirm" modal footer={aprovePaymentDialogFooter} onHide={hideDeleteBillsDialog}>


                        <div className="field flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {payment && <span>Confirmas que deseas aprobar este pago?</span>}
                        </div>
                        <div className='field'>
                            <p>Apartamento: {payment.number}, Piso: {payment.floor} </p>
                            <p>Responsable: {payment.owner} </p>
                            <p>Monto: {payment.amount} </p>

                        </div>
                        <div className="field">
                            <label htmlFor="method">Metodo de pago: </label>
                            <Dropdown
                                value={payment?.method}
                                options={methodOptions}
                                onChange={(e) => setPayment({ ...payment, method: e.value })}
                                required
                                className={classNames({
                                    'p-invalid': submitted && !bill.method
                                })}
                            />
                            {submitted && !bill.method && <small className="p-invalid">Metodo de pago es requerido.</small>}
                        </div>
                     {/*    <div className="field">
                            <label htmlFor="date">Date: </label>
                            <Calendar value={payment.date ?? undefined} id='date' onChange={(e) => setPayment({ ...payment, date: e.value || undefined })} dateFormat="dd/mm/yy" />
                        </div> */}
                    </Dialog>
                </div>
            </div >
        </div >
    );
};

export default Crud;
