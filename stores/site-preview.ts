export const useSitePreviewCache = defineStore('sitepreview', () => {
    const sitePreviewCache = ref(LocalStorageHandler.getItem('sitePreviewCache') || {});

    const saveCache = (key: string, value: string) => { 
        sitePreviewCache.value[key]=value;
        LocalStorageHandler.setItem('sitePreviewCache', sitePreviewCache.value);
    };

    return { sitePreviewCache, saveCache };
})

