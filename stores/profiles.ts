import { v4 as uuidv4 } from 'uuid';

interface Profile {
    id: string;
    name: string;
    previewUrl: string;
    type: string;
    data: Record<string, unknown>;
}

export const useProfileStore = defineStore('profile', () => {
    // Profiles stored as a Map
    const profiles = ref<Map<string, Profile>>(new Map());

    // Load profiles from localStorage
    const loadProfiles = () => {
        if (import.meta.client) {
            const storedProfiles = JSON.parse(localStorage.getItem('profiles') || '{}');
            profiles.value = new Map(Object.entries(storedProfiles));
        }
    };

    const getProfiles = (type: string) => {
        return Array.from(profiles.value.values()).filter(profile => profile.type === type);
    };

    // Save profiles to localStorage
    const saveProfiles = () => {
        if (import.meta.client) {
            const serializedProfiles = Object.fromEntries(profiles.value.entries());
            localStorage.setItem('profiles', JSON.stringify(serializedProfiles));
        }
    };

    // Add a new profile
    const addProfile = (profileName: string, previewUrl: string, profileData: Record<string, unknown>, type: string = 'cxml') => {
        const id = uuidv4();
        const profile: Profile = { id, previewUrl, name: profileName, data: profileData, type };
        profiles.value.set(id, profile);
        saveProfiles();
    };

    // Delete a profile
    const deleteProfile = (id: string) => {
        if (profiles.value.has(id)) {
            profiles.value.delete(id);
            saveProfiles();
        }
    };

    return {
        profiles,
        getProfiles,
        addProfile,
        deleteProfile,
        loadProfiles,
    };
});
