import { toast } from 'svelte-sonner';
import { t } from './i18n/translate.svelte';

export const notify = {
	success: (message, opts = {}) => toast.success(message, { duration: 2500, ...opts }),
	error: (message, opts = {}) => toast.error(message, { duration: 5000, ...opts }),
	info: (message, opts = {}) => toast.info(message, opts),
	warning: (message, opts = {}) => toast.warning(message, opts),

	apiError: (errCode) => {
		const errKey = `errors.${errCode}`;
		let msg = t(errKey);

		if(msg === errKey){
			msg = t('errors.genericApi', { values: { msg: errCode } })
		}

		toast.error(msg);
	}
};