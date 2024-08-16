import useSWR from 'swr';
import axios from '@/lib/axios';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

const fetcher = (url) =>
    axios
        .get(url)
        .then((res) => res.data?.data)
        .catch((error) => {
            if (error.response.status !== 409) throw error;
        });

export const useAuth = ({ middleware='guest', redirectIfAuthenticated='' } = {}) => {
    const router = useRouter();
    const params = useParams();

    const { data: user, error, mutate } = useSWR('/api/user', fetcher, { revalidate: false });

    const csrf = () => axios.get('/sanctum/csrf-cookie');

    const register = async ({ setErrors, ...props }) => {
        await csrf();

        setErrors([]);
        axios
        .post('/register', props)
        .then(() => mutate())
        .catch((error) => {
            if (error.response.status !== 422) throw error;

            setErrors(error.response.data.errors);
        });
    };

    const login = async ({ setErrors, setStatus, ...props }) => {
        await csrf();

        setErrors([]);
        setStatus(null);

        axios
            .post('/api/login', props)
            .then(() => {
                mutate();
            })
            .catch((error) => {

                if (error.response.status === 401){
                    setErrors({'message':[error.response.data.message]});
                }
                if (error.response.status !== 422) throw error;
            
                const errors= error.response.data.errors;
                const errors2 = {...errors,'message':[error.response.data.message]}
                setErrors(errors2);
            });
    };

    const forgotPassword = async ({ setErrors, setStatus, email }) => {
        await csrf();

        setErrors([]);
        setStatus(null);

        axios
            .post('/forgot-password', { email })
            .then((response) => setStatus(response.data.status))
            .catch((error) => {
                if (error.response.status !== 422) throw error;

                setErrors(error.response.data.errors);
            });
    };

    const resetPassword = async ({ setErrors, setStatus, ...props }) => {
        await csrf();

        setErrors([]);
        setStatus(null);

        axios
            .post('/reset-password', { token: params.token, ...props })
            .then((response) => router.push('/login?reset=' + btoa(response.data.status)))
            .catch((error) => {
                if (error.response.status !== 422) throw error;

                setErrors(error.response.data.errors);
            });
    };

    const resendEmailVerification = ({ setStatus }) => {
        axios.post('/email/verification-notification').then((response) => setStatus(response.data.status));
    };

    const logout = async () => {
        if (!error) {
            await axios.post('/api/logout').then(() => mutate());
        }

        window.location.pathname = '/auth/login';
    };

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user) {router.push(redirectIfAuthenticated), console.log(redirectIfAuthenticated), console.log("push")};
        if (window.location.pathname === '/verify-email' && user?.email_verified_at) router.push(redirectIfAuthenticated);
        if (middleware === 'auth' && error) logout();
    }, [user, error]);

    return {
        user,
        register,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout
    };
};
