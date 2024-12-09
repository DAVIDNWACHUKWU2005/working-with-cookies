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

const MAX_COOKIE_AGE = 15; // Cookie lifespan in seconds


toggleSwitches.forEach((toggle) => {
    toggle.checked = true;
});

// Function to get the browser name
function getBrowserName() {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome') ) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari') ) return 'Safari';
    if (userAgent.includes('Edg')) return 'Edge';
    return 'Unknown Browser';
}
function getOSName() {
    return new Promise((resolve) => {
        if (navigator.userAgentData && navigator.userAgentData.platform) {
            resolve(navigator.userAgentData.platform); 
        } else {
            const userAgent = navigator.userAgent.toLowerCase();
            if (userAgent.includes('win')) resolve('Windows');
            else if (userAgent.includes('mac')) resolve('MacOS');
            else if (userAgent.includes('linux')) resolve('Linux');
            else if (userAgent.includes('android')) resolve('Android');
            else if (/iphone|ipad|ipod/.test(userAgent)) resolve('iOS');
            else resolve('Unknown OS');
        }
    });
}


const osName = getOSName();
setCookie('os', osName, 15); 

function setScreenDimensions() {
    const screenWidth = screen.width;
    const screenHeight = screen.height;
    setCookie('screenWidth', screenWidth, MAX_COOKIE_AGE);
    setCookie('screenHeight', screenHeight, MAX_COOKIE_AGE);
}


setCookie('browser', getBrowserName(), MAX_COOKIE_AGE);
getOSName().then((os) => setCookie('os', os, MAX_COOKIE_AGE));
setScreenDimensions(); 


document.addEventListener('DOMContentLoaded', () => {
    if (!getCookie('consent')) {
        setTimeout(() => removeHiddenClass(cookiePopUp), 2000); // Show popup after 2 seconds
    }
});

// Accept All Button Logic
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
