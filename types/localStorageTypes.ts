export type LocalStorageValues = {
    darkMode: boolean,
    sitePreviewCache: Record<string, string>,
}

export type LocalStorageKeys = keyof LocalStorageValues
