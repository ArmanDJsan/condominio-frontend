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
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');


    const [errors, setErrors] = useState<ErrorState>({});
    const [status, setStatus] = useState<boolean>(false);
    const [checked, setChecked] = useState<boolean>(false);
    const { layoutConfig } = useContext(LayoutContext);
    const toast = useRef<Toast>(null);

    const { register } = useAuth({ redirectIfAuthenticated: '/', middleware: 'guest' });
    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const formatedData = {
        name: name,
        email: email,
        password: password,
        password_confirmation: passwordConfirmation,
    }

    const validateFields = () => {
        let isValid = true;
        const errors: ErrorState = {};

        if (!email) {
            errors.email = ['Email el email es requerido'];
            isValid = false;
        }
        if (email && !/\S+@\S+\.\S+/.test(email)) {
            errors.email = ['Debe ingresar un email valido'];
            isValid = false;
        }
        if (!password) {
            errors.password = ['La Clave es requerida'];
            isValid = false;
        }

        if (!passwordConfirmation) {
            errors.passwordConfirmation = ['La confirmacion de clave es requerida'];
            isValid = false;
        } else if (password !== passwordConfirmation) {
            errors.passwordConfirmation = ['Las Claves no coinciden'];
            isValid = false;
        }
        setErrors(errors);
        return isValid;
    }

    const handleRegister = () => {
        if (validateFields()) {
            register({ setErrors, ...formatedData });
        }
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
                <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <img src="/demo/images/login/avatar.png" alt="Image" height="50" className="mb-3" />
                            <div className="text-900 text-3xl font-medium mb-3">Resgistro</div>
                            <span className="text-600 font-medium">Ingresa tus datos para continuar</span>
                        </div>

                        <div>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Nombre
                            </label>
                            <InputText id="name" value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Nombre" className={`w-full md:w-30rem mb-5 ${errors?.name ? "p-invalid" : ""}`} style={{ padding: '1rem' }} />
                            <InputError messages={errors?.name} className="mt-2" />

                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Email
                            </label>
                            <InputText id="email1" value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Email" className={`w-full md:w-30rem mb-5 ${errors?.email ? "p-invalid" : ""}`} style={{ padding: '1rem' }} />
                            <InputError messages={errors?.email} className="mt-2" />

                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                Clave
                            </label>
                            <Password inputId="password1" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Clave" promptLabel="Elige una Clave" weakLabel="Seguridad baja" mediumLabel="Seguridad media" strongLabel="Seguridad alta" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem"></Password>
                            <InputError messages={errors?.password} className="mt-2" />

                            <label htmlFor="password2" className="block text-900 font-medium text-xl mb-2">
                                Confirma tu clave
                            </label>
                            <Password inputId="password2" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} placeholder="Confirmacion de clave" promptLabel="Confirme su Clave" weakLabel="Seguridad baja" mediumLabel="Seguridad media" strongLabel="Seguridad alta" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem"></Password>
                            <InputError messages={errors?.password} className="mt-2" />



                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <a href={"/auth/login"} className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                    Ya posse una cuenta?
                                </a>
                            </div>
                            <Button label="Registrar" className="w-full p-3 text-xl" onClick={() => handleRegister()}></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
