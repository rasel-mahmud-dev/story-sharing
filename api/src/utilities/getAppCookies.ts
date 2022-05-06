
const getAppCookies = (req) => {
  // We extract the raw cookies from the request headers
    const parsedCookies: any = {};
  
    if(req.headers && req.headers.cookie) {
    const rawCookies = req.headers.cookie.split('; ');
    // rawCookies = ['myapp=secretcookie, 'analytics_cookie=beacon;']
  
    rawCookies.forEach(rawCookie => {
      const parsedCookie = rawCookie.split('=');
      if (parsedCookie && parsedCookie.length > 1) {
        // parsedCookie = ['myapp', 'secretcookie'], ['analytics_cookie', 'beacon']
        parsedCookies[parsedCookie[0]] = parsedCookie[1];
      }
    });
  }
  return parsedCookies;
};

export default getAppCookies