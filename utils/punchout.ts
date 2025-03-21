import type { ToastServiceMethods } from 'primevue/toastservice';

export function useCxmlSubmitForm(loading: Ref<boolean, boolean>, toast: ToastServiceMethods) {
    return async function submitForm(values: Record<string, unknown>) {
        loading.value = true;
        try {
            const response = await $fetch<{ statusCode: number, data: string, message?: string }>('/api/cxml', {
                method: 'POST',
                redirect: 'manual',
                body: values,
            });

            const form = useMyFormData();
            if (response.statusCode === 200) {
                form.value['cXML'] = response.data;
                await navigateTo('/cxml/punch');
            }
            else {
                toast.add({ severity: 'info', summary: 'error', detail: response.message, life: 3000 });
                console.error(response.message);
            }
        } catch (error) {
            toast.add({ severity: 'info', summary: 'error', detail: error, life: 3000 });
            console.error(error);
        }
        loading.value = false;
    }
}
