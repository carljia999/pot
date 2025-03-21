<template>
    <div class="text-center">
        <div class="text-3xl py-4">Performing punchout</div>
        <ProgressSpinner />
    </div>
</template>

<script setup lang="ts">
const route = useRoute();
const loading = ref(false);
const submitForm = useCxmlSubmitForm(loading, useToast());

onMounted(() => {
    const profileStore = useProfileStore();
    const { profiles } = storeToRefs(profileStore);
    const { loadProfiles } = profileStore;

    const pid = route.query.p as string;
    if (pid) {
        loadProfiles();
        const profile = profiles.value.get(pid);
        if (profile) {
            submitForm(profile.data);
        }
    } else {
        navigateTo('/cxml');
    }
});
</script>