import getCSRFTokenFromCookie from "./getCSRFTokenFromCookie";

const fetchCSRFToken = async () => {
    try {
      const response = await fetch('http://localhost:8000/sanctum/csrf-cookie', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Origin': 'localhost:3000',
      },
      }).then(getSanctumResponse => {
        console.log("Sanctum", getSanctumResponse.status);  
      });
      
    } catch (error) {
      console.error('Error al obtener el token CSRF:', error.message);
    }
  };

  export default fetchCSRFToken;