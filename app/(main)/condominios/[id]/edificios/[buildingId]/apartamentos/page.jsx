"use client"
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import Link from 'next/link';

const CondominiumPage = ({ params: { id , buildingId} }) => {

    const [buildings, setBuildings] = useState([]);
    useEffect(() => {
        if (id) {
            axios.get(`/api/condominiums/${id}`)
                .then(response => {
                    console.log(response.data);
                    setBuildings(response.data.buildings);
                })
                .catch(error => {
                    console.error("Error fetching buildings:", error);
                });
        }
    }, [id]);
    return (
        <>
            <h1 className="text-2xl">Condominios</h1>
            <div className='grid grid-cols-4 gap-4'>

                {buildings?.map(building => (
                    <Link href={`/pages/condominios/${id}/edificios/${building.id}/apartamentos`} key={building.id} className='card h-10rem w-10rem my-6 flex align-items-center justify-content-center '>
                            <span className='text-black'>{building.name}</span>
                    </Link>
                ))}
            </div>
        </>
    );
};

export default CondominiumPage;
