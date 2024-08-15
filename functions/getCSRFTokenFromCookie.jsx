const getCSRFTokenFromCookie = () => {
    return decodeURIComponent(document.cookie.split('; ')
      .find(row => row.startsWith('XSRF-TOKEN'))
      .split('=')[1]);
  };

export default getCSRFTokenFromCookie;
