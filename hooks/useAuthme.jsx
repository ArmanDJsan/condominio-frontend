
import getCSRFTokenFromCookie from '../functions/getCSRFTokenFromCookie';

export const useAuth = () => {

  const login = async (email, password) => {
    try {
      const token = getCSRFTokenFromCookie();
      const response = await fetch('http://localhost:8000/api/login', {
          method: 'POST',
          headers: {
            'Origin': 'localhost:3000',
              'X-XSRF-TOKEN': token,
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
              email,
              password,
          }),
      });
      if (!response.ok) {
          throw new Error('Inicio de sesión fallido');
      }
      const usuario = await response.json();
      console.log(usuario);
  }
  catch (error) {
      console.error('Error al iniciar sesión:', error.message);
  }
   
  };

  // call this function to sign out logged in user
  const logout = async () => {
    try {
      const token = getCSRFTokenFromCookie();
      const response = await fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        headers: {
          'Origin': 'localhost:3000',
          'X-XSRF-TOKEN': token,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorMessage = `Logout fallido. Código de estado: ${response.status}`;
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
    }
   
  };

  return ({
    login,
    logout
  });
};
