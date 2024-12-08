'use strict';

export function select(selector, scope = document) {
    return scope.querySelector(selector);
}

export function listen(event, element, callback) {
    element.addEventListener(event, callback);
}

export function setCookie(name, value, seconds) {
    const date = new Date();
    date.setTime(date.getTime() + seconds * 1000);
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}

export function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === name) return value;
    }
    return null;
}

export function removeHiddenClass(element) {
    element.classList.remove('hidden');
}

export function addHiddenClass(element) {
    element.classList.add('hidden');
}
