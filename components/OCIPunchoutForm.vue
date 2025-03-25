<template>
    <div>
        <Form v-slot="$form" :initial-values="initialValues" :validate-on-value-update="true"
            :validate-on-value-blur="true" :validate-on-value-submit="true" :resolver="resolver" @submit="submitForm">

            <div class="flex flex-col gap-2 w-96">
                <div class="flex flex-col gap-1">
                    <InputText name="punchoutUrl" type="url" placeholder="Punchout URL" />
                    <Message v-if="$form.punchoutUrl?.invalid" severity="error" size="small">
                        {{ $form.punchoutUrl.error.message }}
                    </Message>
                </div>
                <div class="flex flex-col gap-1">
                    <InputText name="username" type="text" placeholder="Username" />
                    <Message v-if="$form.username?.invalid" severity="error" size="small">
                        {{ $form.username.error.message }}
                    </Message>
                </div>
                <div class="flex flex-col gap-1">
                    <InputText name="password" type="text" placeholder="Password" />
                    <Message v-if="$form.password?.invalid" severity="error" size="small">
                        {{ $form.password.error.message }}
                    </Message>
                </div>
                <div class="flex flex-col gap-1">
                    <InputText name="returnUrl" type="text" placeholder="Return URL" />
                    <Message v-if="$form.returnUrl?.invalid" severity="error" size="small">
                        {{ $form.returnUrl.error.message }}
                    </Message>
                </div>

                <div class="flex gap-1 items-end">
                    <Button type="button" icon="pi pi-plus" size="small" severity="info" @click="addCustomField" />
                    <span>additional custom fields</span>
                </div>

                <!-- Dynamic fields -->
                <div v-for="(field, index) in customFields" :key="index" class="flex gap-1">
                    <InputText :name="`customFieldName${index}`" type="text" size="small" placeholder="Name"
                        v-model="field.name" />
                    <InputText :name="`customFieldValue${index}`" type="text" size="small" placeholder="Value"
                        v-model="field.value" />
                    <Button type="button" icon="pi pi-minus" size="small" @click="removeCustomField(index)" />
                </div>

                <div class="flex gap-4">
                    <Button type="submit" class="w-30" :loading :disabled="!$form.valid" label="Punch Out" />
                    <InputText name="profileName" v-model="profileName" class="flex-grow" size="small"
                        placeholder="Profile name (e.g. URL + Username)" />
                    <Button v-tooltip="'Save as Profile'" type="button" icon="pi pi-save" aria-label="Save as Profile"
                        size="small" severity="info" :disabled="!$form.valid" @click="saveProfile($form)" />
                </div>
            </div>
        </Form>
    </div>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent, FormFieldState, FormResolverOptions } from '@primevue/forms';
import { z } from 'zod';
import { zodResolver } from '@primevue/forms/resolvers/zod';

const initialValues = ref({
    username: '',
    password: '',
    punchoutUrl: '',
    returnUrl: '/oci/hook'
});

const toast = useToast();
const loading = ref(false);
// Active tab value
const profileName = ref('');

interface CustomField {
    name: string;
    value: string;
}

const customFields = ref<CustomField[]>([]);

// Validation schemas
const basicSchema = z.object({
    username: z.string().min(1, { message: 'Username is required' }),
    password: z.string().min(1, { message: 'Password is required' }),
    punchoutUrl: z.string()
        .min(1, { message: 'Punchout URL is required' })
        .url({ message: 'Please enter a valid URL' }),
    returnUrl: z.string()
        .min(1, { message: 'Return URL is required' })
        .regex(/^(\/|http|https)/, { message: 'Please enter a valid path or URL' })
});

type ProfileType = z.infer<typeof basicSchema>;

const zodresolver = zodResolver(basicSchema);

// Form validation resolver
const resolver = async ({ values, names }: FormResolverOptions): Promise<Record<string, unknown>> => {
    const { errors: zerrors } = await zodresolver({ values, names });
    if (Object.keys(zerrors).length) {
        return { values, zerrors };
    }

    // Validate custom fields
    const errors: Record<string, unknown> = {};
    customFields.value.forEach((field, index) => {
        if (!field.name.trim() || !field.value.trim()) {
            errors[`customFieldName${index}`] = { message: 'Field name/value is required' };
        }
    });
    return { values, errors };
};

// Add a new custom field
const addCustomField = () => {
    customFields.value.push({ name: 'Name', value: 'Value' });
};

// Remove a custom field
const removeCustomField = (index: number) => {
    customFields.value.splice(index, 1);
};

async function submitForm({ values }: FormSubmitEvent) {
    const submitFormInner = useOCISubmitForm(loading, toast);
    const custom = customFields.value.reduce<Record<string, string>>((acc, field) => {
        acc[field.name] = field.value;
        return acc;
    }, {});
    submitFormInner({ values, custom });
}

const getProfileCredentials = (profile: ProfileType): { url: string; user: string } => {
    return {
        url: profile.punchoutUrl,
        user: profile.username,
    };
};

const createProfileName = (url: string, user: string): string => {
    if (!url || !user) return 'Custom Profile';

    try {
        return `${new URL(url).hostname} - ${user}`;
    } catch {
        return 'Custom Profile';
    }
};


const { addProfile } = useProfileStore();
const saveProfile = async (values: Record<string, FormFieldState>) => {
    const fields: Record<string, unknown> = {};
    for (const key in values) {
        if (key != 'valid') {
            fields[key] = values[key].value;
        }
    }
    const schema = basicSchema;
    const profileData = await schema.parseAsync(fields);
    const { url, user } = getProfileCredentials(profileData);

    const custom = customFields.value.reduce<Record<string, string>>((acc, field) => {
        acc[field.name] = field.value;
        return acc;
    }, {});

    const name = profileName.value || createProfileName(url, user);
    addProfile(name, url, { values: profileData, custom }, 'oci');
    toast.add({
        severity: 'success',
        summary: 'Profile Saved',
        life: 3000,
    });
};
</script>

<style scoped>
/* Add any specific styles for this page here */
</style>