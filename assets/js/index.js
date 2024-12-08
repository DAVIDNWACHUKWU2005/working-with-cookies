'use strict';

import {
    select,
    listen,
    setCookie,
    getCookie,
    addHiddenClass,
    removeHiddenClass,
} from './utils.js';

const cookiePopUp = select('.cookie-pop-up');
const settingsPopUp = select('.settings-pop-up');
const acceptAllBtn = select('.accept-all');
const settingsBtn = select('.settings');
const savePreferencesBtn = select('.save-preferences');
const toggleSwitches = document.querySelectorAll('.switch input');


const MAX_COOKIE_AGE = 15; 

toggleSwitches.forEach((toggle) => {
    toggle.checked = true;
});

function getBrowserName() {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome') && !userAgent.includes('Chromium')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Edg')) return 'Edge';
    if (userAgent.includes('MSIE') || userAgent.includes('Trident')) return 'Internet Explorer';
    return 'Unknown Browser';
}

async function getOSName() {
    if (navigator.userAgentData && navigator.userAgentData.platform) {
        return navigator.userAgentData.platform; /* Modern way*/
    } else {
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.includes('win')) return 'Windows';
        if (userAgent.includes('mac')) return 'MacOS';
        if (userAgent.includes('linux')) return 'Linux';
        if (userAgent.includes('android')) return 'Android';
        if (/iphone|ipad|ipod/.test(userAgent)) return 'iOS';
        return 'Unknown OS';
    }
}


setCookie('browser', getBrowserName(), MAX_COOKIE_AGE);
getOSName().then((os) => setCookie('os', os, MAX_COOKIE_AGE));


document.addEventListener('DOMContentLoaded', () => {
    if (!getCookie('consent')) {
        setTimeout(() => removeHiddenClass(cookiePopUp), 2000); 
    }
});


listen('click', acceptAllBtn, () => {
    setCookie('consent', 'all', MAX_COOKIE_AGE);
    toggleSwitches.forEach((toggle) => {
        setCookie(toggle.name, true, MAX_COOKIE_AGE);
    });
    addHiddenClass(cookiePopUp);
    addHiddenClass(settingsPopUp);
});

listen('click', settingsBtn, () => {
    addHiddenClass(cookiePopUp);
    removeHiddenClass(settingsPopUp);
});


listen('click', savePreferencesBtn, () => {
    toggleSwitches.forEach((toggle) => {
        setCookie(toggle.name, toggle.checked, MAX_COOKIE_AGE);
    });
    setCookie('consent', 'custom', MAX_COOKIE_AGE);
    addHiddenClass(settingsPopUp);
});
