import getCSRFTokenFromCookie from "./getCSRFTokenFromCookie";

const cancelEvent = async (id, setStates, states, query) => {
  try {
    const token = getCSRFTokenFromCookie();
    const response = await fetch('http://localhost:8000/api/'+query, {  
      method: 'POST',
      body: JSON.stringify({id}),
      headers: {
        'Origin': 'localhost:3000',
        'X-XSRF-TOKEN': token,
        'Accept': 'Application/json',
        'Content-Type': 'Application/json',
      },
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Error en la solicitud, estado: ' + response.status);
    }
    const AuxEvent= states.filter((state ) => state.id != id);
    setStates(AuxEvent);
  } catch (error) {
    console.log('Error al intentar eliminar, error:' + error.message)
  }
};

export default cancelEvent;