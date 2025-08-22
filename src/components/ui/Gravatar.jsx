/** 
 * Fetching gravatar image.
 */

import CryptoJS from 'crypto-js';

export const Gravatar = ({ email, size = 40, className = "" }) => {

    const getGravatarUrl = (email, size = 40) => {
        const hash = CryptoJS.MD5(email.toLowerCase().trim()).toString();
        return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
    };

    return (
        <img
            src={getGravatarUrl(email, size)}
            alt="Profile"
            className={`rounded-full ${className}`}
        />
    );
};