<template>
  <div>
    <Form
      v-slot="$form"
      :initial-values="{ username: '', password: '', punchoutUrl: '', cXMLInput: '', replacingUrl: true }"
      :validate-on-value-update="true" :validate-on-value-blur="true" :validate-on-value-submit="true"
      :resolver="resolver" @submit="submitForm">
      <Tabs v-model:value="activeTab">
        <TabList>
          <Tab value="0">Basic</Tab>
          <Tab value="1">Advanced</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="0">
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
            </div>
          </TabPanel>
          <TabPanel value="1">
            <div class="flex flex-col gap-2 w-96">
              <div class="flex flex-col gap-1">
                <Textarea name="cXMLInput" rows="4" cols="30" placeholder="cXML Input" />
                <Message v-if="$form.cXMLInput?.invalid" severity="error" size="small">
                  {{ $form.cXMLInput.error.message }}
                </Message>
              </div>
              <label>
                <Checkbox name="replacingUrl" binary /> Replace Hook URL
              </label>
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <div class="flex px-4 gap-4">
        <Button type="submit" class="w-30" :loading :disabled="!$form.valid" label="Punch Out" />
        <InputText
            v-model="profileName"
            class="flex-grow"
            size="small"
            placeholder="Profile name (e.g. URL + Username)"
        />
        <Button
            v-tooltip="'Save as Profile'"
            type="button"
            icon="pi pi-save"
            aria-label="Save as Profile"
            size="small"
            severity="info"
            :disabled="!$form.valid"
            @click="saveProfile($form)"
        />
      </div>
    </Form>
  </div>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent, FormFieldState } from '@primevue/forms';
import { z } from 'zod';
import { parseStringPromise } from 'xml2js';
import { zodResolver } from '@primevue/forms/resolvers/zod';

const toast = useToast();
const loading = ref(false);
// Active tab value
const activeTab = ref('0');
const profileName = ref('');

// XML validation function
const validateXml = async (value: string) => {
  try {
    await parseStringPromise(value);
    return true;
  } catch {
    return false;
  }
};

// Validation schemas
const basicSchema = z.object({
  username: z.string().nonempty('Username is required'),
  password: z.string().nonempty('Password is required'),
  punchoutUrl: z.string().url('Invalid URL'),
});

const advancedSchema = z.object({
  cXMLInput: z
    .string()
    .nonempty('XML Input is required')
    .refine(async (val) => validateXml(val), { message: 'Invalid XML format' }),
  replacingUrl: z.boolean(),
});

type BasicProfile = z.infer<typeof basicSchema>;
type AdvancedProfile = z.infer<typeof advancedSchema>;
type ProfileType = BasicProfile | AdvancedProfile;

// Dynamic schema resolver
const resolver = computed(() => zodResolver(activeTab.value === '0' ? basicSchema : advancedSchema));

async function submitForm({ values }: FormSubmitEvent) {
  const submitFormInner = useCxmlSubmitForm(loading, toast);
  submitFormInner(values);
}

const getProfileCredentials = async (profile: ProfileType): Promise<{ url: string; user: string }> => {
  if ('punchoutUrl' in profile) {
    return {
      url: profile.punchoutUrl,
      user: profile.username,
    };
  }
  const extracted = await extractPunchoutUrl(profile.cXMLInput);
  return {
    url: extracted.punchoutUrl,
    user: extracted.punchoutUser,
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
  const schema = activeTab.value === '0' ? basicSchema : advancedSchema;
  const profileData = await schema.parseAsync(fields);
  const { url, user } = await getProfileCredentials(profileData);

  const name = profileName.value || createProfileName(url, user);
  addProfile(name, url, profileData);
  toast.add({
    severity: 'success',
    summary: 'Profile Saved',
    life: 3000,
  });
};
</script>
