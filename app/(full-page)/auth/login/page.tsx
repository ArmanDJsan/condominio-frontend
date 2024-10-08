/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useState, useRef, useEffect } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { useAuth } from '@/hooks/auth';
import InputError from '@/components/InputError';
import { Toast } from 'primereact/toast';

const LoginPage = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errors, setErrors] = useState<ErrorState>({});
    const [status, setStatus] = useState<boolean>(false);
    const [checked, setChecked] = useState<boolean>(false);
    const { layoutConfig } = useContext(LayoutContext);
    const toast = useRef<Toast>(null);

    const { login } = useAuth({ redirectIfAuthenticated: '/', middleware: 'guest' });
    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });
    const handleLogin = () => {
        login({ setErrors, setStatus, email, password });
    }
    const showError = () => {
        toast.current?.show({
            severity: 'error',
            summary: 'Error Message',
            detail: errors.message,
            life: 3000
        });
    };
    useEffect(() => {
        if (errors.message)
            showError();
    }, [errors.message]);
    interface ErrorState {
        [key: string]: string[];
    }
    return (
        <div className={containerClassName}>
            <Toast ref={toast} />
            <div className="flex flex-column align-items-center justify-content-center">
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <span className='pi pi-building text-6xl mb-3'></span>
                            <div className="text-900 text-3xl font-medium mb-3">Bienvenido!</div>
                            <span className="text-600 font-medium">Inicia sesión para continuar</span>
                        </div>

                        <div>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Email
                            </label>
                            <InputText id="email1" value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Email" className={`w-full md:w-30rem mb-5 ${errors?.email ? "p-invalid" : ""}`} style={{ padding: '1rem' }} />
                            <InputError messages={errors?.email} className="mt-2" />

                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                Clave
                            </label>
                            <Password inputId="password1" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Clave" promptLabel="Ingrese su Clave" weakLabel="Seguridad baja" mediumLabel="Seguridad media" strongLabel="Seguridad alta" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem"></Password>
                            <InputError messages={errors?.password} className="mt-2" />


                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <a href={"/auth/register"} className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                    No posee una Cuenta?
                                </a>
                                <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                    Olvido su Clave?
                                </a>
                            </div>
                            <Button label="Entrar" className="w-full p-3 text-xl" onClick={() => handleLogin()}></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
