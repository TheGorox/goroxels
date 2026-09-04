// translate.svelte.js
import { register, init, getLocaleFromNavigator, unwrapFunctionStore, _, locale } from 'svelte-i18n';
import { persistent } from '../game/stores/persistent.svelte.js';
import { untrack } from 'svelte';
import { get } from 'svelte/store';

register('ru', () => import('../../locales/ru.js'));

const defaultLocale = getLocaleFromNavigator() || 'ru';

init({
    fallbackLocale: 'ru',
    initialLocale: defaultLocale
});

let curLanguage = persistent('language', defaultLocale);

// TODO clear the effects when routes!!!
// update locale when persistent changed
$effect.root(() => {
    $effect(() => {
        const newLang = curLanguage.v;
        untrack(() => {
            if (newLang && newLang !== get(locale)) {
                locale.set(newLang);
            }
        });
    });
});

// and vice-versa
$effect.root(() => {
    const unsubscribe = locale.subscribe((current) => {
        untrack(() => {
            if (current && current !== curLanguage.v) {
                curLanguage.v = current;
            }
        });
    });

    return unsubscribe;
});

// wrapper for regular js files
export const t = unwrapFunctionStore(_);

// for .svelte files
export { _ };