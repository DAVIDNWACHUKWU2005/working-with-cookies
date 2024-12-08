'use strict';

import {
    select,
    listen,
    setCookie,
    getCookie,
    addHiddenClass,
    removeHiddenClass,
} from './utils.js';

// DOM Elements
const cookiePopUp = select('.cookie-pop-up');
const settingsPopUp = select('.settings-pop-up');
const acceptAllBtn = select('.accept-all');
const settingsBtn = select('.settings');
const savePreferencesBtn = select('.save-preferences');
const toggleSwitches = document.querySelectorAll('.switch input');
const popUpContent = select('.settings-pop-up .pop-up-content');

// Constants
const MAX_COOKIE_AGE = 20 * 24 * 60 * 60; // 20 days in seconds

// Browser and OS Detection
function getBrowserName() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('opera') || userAgent.includes('opr')) return 'Opera';
    if (userAgent.includes('edg')) return 'Edge';
    if (userAgent.includes('chrome') && !userAgent.includes('edg')) return 'Chrome';
    if (userAgent.includes('safari') && !userAgent.includes('chrome')) return 'Safari';
    if (userAgent.includes('firefox')) return 'Firefox';
    return 'Unknown';
}

function getOSName() {
    const platform = navigator.userAgentData?.platform || navigator.platform || 'Unknown';
    if (/win/i.test(platform)) return 'Windows';
    if (/mac/i.test(platform)) return 'MacOS';
    if (/linux/i.test(platform)) return 'Linux';
    if (/iphone|ipad|ipod/i.test(platform)) return 'iOS';
    if (/android/i.test(platform)) return 'Android';
    return 'Unknown';
}


const browserName = getBrowserName();
const osName = getOSName();
if (popUpContent) {
    popUpContent.innerHTML += `<p>Browser: ${browserName}, OS: ${osName}</p>`;
}

listen('DOMContentLoaded', window, () => {
    if (!getCookie('consent')) {
        setTimeout(() => removeHiddenClass(cookiePopUp), 5000); 
    } else {
        addHiddenClass(cookiePopUp);
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


const rejectAllBtn = document.createElement('button');
rejectAllBtn.textContent = 'Reject All';
rejectAllBtn.classList.add('reject-all');
popUpContent.appendChild(rejectAllBtn);

listen('click', rejectAllBtn, () => {
    setCookie('consent', 'none', MAX_COOKIE_AGE);
    toggleSwitches.forEach((toggle) => {
        setCookie(toggle.name, false, MAX_COOKIE_AGE);
    });
    addHiddenClass(cookiePopUp);
});


