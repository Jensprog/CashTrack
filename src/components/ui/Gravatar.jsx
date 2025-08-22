/** 
 * Fetching gravatar image.
 */

import CryptoJS from 'crypto-js';

export const Gravatar = ({ email, size = 40, className = "" }) => {
        const hash = CryptoJS.MD5(email.toLowerCase().trim()).toString();
        const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;

    return (
        <img
            src={gravatarUrl}
            alt="Profile"
            className={`rounded-full ${className}`}
        />
    );
};