export function setTokenWithExpiry(token, expiresInDays) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + expiresInDays);
    
    const tokenData = {
      token: token,
      expiresAt: expirationDate.getTime(), // Store the expiration timestamp
    };
    
    localStorage.setItem('tokenData', JSON.stringify(tokenData));
  }
  
 export function getToken() {
    const tokenData = JSON.parse(localStorage.getItem('tokenData'));
    if (tokenData && tokenData.expiresAt > Date.now()) {
      return tokenData.token;
    } else {
      // Remove token from LocalStorage if it has expired or doesn't exist
      localStorage.removeItem('tokenData');
      return null;
    }
  }
  
 export function deleteTokenIfExpired() {
    const tokenData = JSON.parse(localStorage.getItem('tokenData'));
    if (tokenData && tokenData.expiresAt <= Date.now()) {
      localStorage.removeItem('tokenData');
      localStorage.removeItem('user')
    }
  }