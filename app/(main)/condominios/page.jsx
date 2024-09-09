'use client';
import { Suspense } from 'react';
import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from '@/lib/axios';
import useSWR from 'swr';
import Link from 'next/link';

const fetcher = (url) =>
    axios
        .get(url)
        .then((res) =>
            res.data
        )
        .catch((error) => {
            if (error.response.status !== 409) throw error;
        });
const Condominio = () => {

    const { data: condominiums, error, isLoading } = useSWR('/api/condominiums', fetcher, { revalidate: false });
    console.log(condominiums);
    const clearCondominium = {
        name: '',
        address: '',
        buildings: 2,
    };

    const clearBuilding = {
        name: '',
        number: '',
    }


    const [form, setForm] = useState({
        condominium: clearCondominium,
        buildings: [{ ...clearBuilding, ...clearBuilding }],
    });

    const clearForm = () => {
        setForm({
            condominium: clearCondominium,
            buildings: [],
        });
    }

    const sentForm = () => {
        axios.post('/api/condominiums/create', form)
            .then(response => {
                if (response.status === 200) {
                    console.log('Condominio registrado');
                    clearForm();
                }
            })
            .catch(error => {
                console.error(error);
            });
    };

    const registerCondominium = () => {
        sentForm();
    }


    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value);
        let _condominium = form.condominium;
        _condominium = { ...form.condominium, [name]: val };
        let _buildings;
        if (val < form.condominium.buildings) {
            _buildings = form.buildings.slice(0, val);
        }
        else
            _buildings = form.buildings;

        setForm({ ...form, buildings: _buildings, condominium: _condominium });
    };

    const onBuildingsChange = (e, index, name) => {

        const val = (e.target && e.target.value);
        let _buildings = form.buildings;
        _buildings[index] = { ..._buildings[index], [name]: val };
        const data = { ...form, buildings: _buildings };
        setForm(data);
    };

    const formBuildings = (cant) => {
        return Array.from({ length: cant }, (_, index) => (
            <div key={index} className='col-3 '>
                <div>
                    <div className='col-12 flex-auto'>
                        <label htmlFor={`buildingName${index}`} className="font-bold block mb-2">Nombre del edificio {index + 1}?</label>
                        <InputText value={form.buildings[index]?.name || ''} onChange={(e) => onBuildingsChange(e, index, 'name')} />
                    </div>
                    <div className='col-12 flex-auto'>
                        <label htmlFor={`buildingNumber${index}`} className="font-bold block mb-2">Numero del edificio {index + 1}?</label>
                        <InputText value={form.buildings[index]?.number || ''} onChange={(e) => onBuildingsChange(e, index, 'number')} />
                    </div>
                </div>
            </div>
        ));
    };
    if (isLoading) return (
        <>
            Loading...
        </>
    )

    if (condominiums.length) return (
        <>
            <h1 className="text-2xl">Condominios</h1>
            <div className='grid grid-cols-4 gap-4'>

                {condominiums.map(condominio => (
                    <Link href={`/condominios/${condominio.id}`} key={condominio.id} className='card h-10rem w-10rem my-6  flex align-items-center justify-content-center '>
                        <span className='text-black'>{condominio.name}</span>
                    </Link>
                ))}
            </div>
        </>
    );
    return (
        <>
            <h1 className="text-2xl">Condominio</h1>
            <div className='grid grid-cols-12 '>
                <div className='col-12 flex-auto'>
                    <label htmlFor="condominiumName" className="font-bold block mb-2">Nombre del condominio?</label>
                    <InputText value={form.condominium.name} onChange={(e) => onInputChange(e, 'name')} />
                </div>
                <div className='col-12 flex-auto'>
                    <label htmlFor="address" className="font-bold block mb-2">Direccion?</label>
                    <InputText value={form.condominium.address} onChange={(e) => onInputChange(e, 'address')} />
                </div>
                <div className='col-12 flex-auto'>
                    <label htmlFor="buildings" className="font-bold block mb-2">Cantidad de edificios?</label>
                    <InputText type="number" value={form.condominium.buildings} onChange={(e) => onInputChange(e, 'buildings')} />
                </div>
            </div>

            <h1 className="text-2xl">Edificios</h1>
            <div className='grid grid-cols-12 w-full justify-between gap-2'>
                {formBuildings(form.condominium.buildings)}
            </div>

            <div className='grid grid-cols-12 '>
                <Button label="Cancelar" icon="pi pi-arrow-left" severity="secondary" onClick={() => { clearForm() }} />
                <Button label="Guardar" icon="pi pi-save" severity="primary" className=" mr-2" onClick={() => { registerCondominium() }} />
            </div>
        </>
    );

};



const CondominioPage = () => {
    // existing code...

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Condominio />
        </Suspense>
    );
};

export default CondominioPage;