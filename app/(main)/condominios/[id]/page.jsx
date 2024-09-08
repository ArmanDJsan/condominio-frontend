"use client"
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import Link from 'next/link';

const CondominiumPage = ({ params: { id } }) => {

    const [condominium, setCondominium] = useState({});
    useEffect(() => {
        if (id) {
            axios.get(`/api/condominiums/${id}`)
                .then(response => {
                    console.log(response.data);
                    setCondominium(response.data);
                })
                .catch(error => {
                    console.error("Error fetching buildings:", error);
                });
        }
    }, [id]);
    return (
        <>
            <h1 className="text-2xl">Condominio: {condominium.name} </h1>
            <h1 className="text-xl">direccion: {condominium.address} </h1>
            <div className='flex flex-column gap-1 '>
                <Link href={`/condominios/${id}/edificios`} className='card h-5rem w-full  flex align-items-center justify-content-center gap-1'>
                    <span className='text-black'>Edificios</span> <span className='pi pi-building'></span>
                </Link>
                <Link href={`/condominios/${id}/cuentas`} className='card h-5rem w-full  flex align-items-center justify-content-center gap-1'>
                    <span className='text-black'>Cuentas</span><span className='pi pi-dollar'></span>
                </Link>
                <Link href={`/condominios/${id}/cuentas`} className='card h-5rem w-full  flex align-items-center justify-content-center gap-1'>
                    <span className='text-black'>Votaciones</span> <span className='pi pi-check-square'></span>
                </Link>
            </div>
        </>
    );
};

export default CondominiumPage;
/* "use client"
import { Card } from 'primereact/card';
import axios from '@/lib/axios';
import { useState } from 'react';
import { useRouter } from 'next/router';

const page = () => {
    const router = useRouter();
    const { id } = router.query;
    const [buildings, setBuildings] = useState([]);
    const condominios = [
        { id: 1, nombre: 'Condominio A', address: 'Dirección A' },
        { id: 2, nombre: 'Condominio B', address: 'Dirección B' },
        { id: 3, nombre: 'Condominio C', address: 'Dirección C' },
        { id: 4, nombre: 'Condominio A', address: 'Dirección A' },
        { id: 5, nombre: 'Condominio B', address: 'Dirección B' },
        { id: 6, nombre: 'Condominio C', address: 'Dirección C' },
        { id: 7, nombre: 'Condominio A', address: 'Dirección A' },
        { id: 8, nombre: 'Condominio B', address: 'Dirección B' },
        { id: 9, nombre: 'Condominio C', address: 'Dirección C' }
    ];

    const showBuildings = (id) => {
        axios.get(`/api/condominiums/${id}`)
            .then(response => {
                console.log(response.data.buildings);
                setBuildings(response.data);
                // Handle the response data here
            })
            .catch(() => {
                console.log("catch");
            });
    }
    return (
        <>
            <p>Lista de condominios</p>
            <div className='grid grid-cols-4 gap-4 mt-10'>
                {condominios.map(condominio => (
                    <div key={condominio.id} className='  h-10rem w-10rem my-6 bg-blue-400 flex align-items-center justify-content-center' onClick={() => { showBuildings(condominio.id) }}>
                        <span>{condominio.nombre}</span>
                    </div>
                ))}
            </div>

            {buildings.length > 0 && (
                <div className='grid grid-cols-4 gap-4 '>
                    {buildings?.map(building => {
                        console.log(building.name);
                        (

                            <div key={building.id} className='  ' onClick={() => { () => { } }}>
                                <span>{building.name}</span>
                            </div>
                        )
                    })}
                </div>
            )}
        </>
    );
};

export default page; */