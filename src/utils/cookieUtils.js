/**
 * Attaches a cookie with a secure attribute based on the environment.
 * Will be used for the CSRF-token to avoid CSRF attacks.
 */
export const setCookie = (name, value, maxAge = 604800) => {
    const isSecureEnvironment = process.env.NEXT_PUBLIC_SECURE_COOKIES === 'true';
    document.cookie = `${name}=${value}; path=/ SameSite=Strict${isSecureEnvironment ? '; Secure' : ''}; max-age=${maxAge}`;
};

export const removeCookie = (name) => {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export const getCookie = (name) => {
    if (typeof document === 'undefined') return null;

    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split('=');
        if (cookieName === name) {
            return cookieValue;
        }
    }
    return null;
};