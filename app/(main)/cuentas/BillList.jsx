import React, { useState, useEffect } from 'react'
import cancelVoting from '@/functions/cancelEvent';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Progress,
} from "@material-tailwind/react";

const BillList = () => {

  const [bills, setBills] = useState([]);
  const getCSRFTokenFromCookie = () => {
    return decodeURIComponent(document.cookie.split('; ')
      .find(row => row.startsWith('XSRF-TOKEN'))
      .split('=')[1]);
  };

  useEffect(() => {
    const cuentas = async () => {
      try {
        const token = getCSRFTokenFromCookie();
        const res = await fetch('http://localhost:8000/api/bills', {
          method: 'GET',
          headers: {
            'Origin': 'localhost:3000',
            'X-XSRF-TOKEN': token,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('Error en la solicitud. Código de estado: ' + res.status);
        }
        const datos = await res.json();
        setBills(datos);

      } catch (error) {
        console.error('Error al cargar los datos:', error.message);
      }
    }
    cuentas();
  }, []);
  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Cuentas
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["id", "nombre","type" ,"amount", "cuota", "vence", "", " "].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bills.map(
                ({ id, name, amount, cuota, type, deadline }, key) => {
                  const className = `py-3 px-5 ${key === bills.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                    }`;

                  return (
                    <tr key={id}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {id}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {name}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Chip
                          variant="gradient"
                          color={type ==="scheduled" ? "green" : "blue-gray"}
                          value={type}
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        />
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {amount}$
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {cuota}$
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {deadline}
                        </Typography>
                      </td>
                     
                      <td className={className}>
                        <Typography
                          as="a"
                          href="#"
                          className="text-xs font-semibold text-blue-gray-600"
                        >
                          Ver
                        </Typography>
                      </td>
                      <td>       
                        <button key={id}  onClick={() => cancelVoting(id, setBills, bills, 'bills/cancel')}>X</button>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default BillList;