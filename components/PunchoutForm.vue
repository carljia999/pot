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
      <div class="flex px-16 gap-4">
        <Button type="submit" class="w-24" :loading :disabled="!$form.valid" label="Submit" />
        <InputText
            v-model="profileName"
            placeholder="Enter profile name (Default: URL + Username)"
        />
        <Button
            type="button"
            label="Save as Profile"
            @click="saveProfile($form)"
        />
      </div>
    </Form>
  </div>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '@primevue/forms';
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

// Dynamic schema resolver
const resolver = computed(() => zodResolver(activeTab.value === '0' ? basicSchema : advancedSchema));

async function submitForm({ values }: FormSubmitEvent) {
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

const { addProfile } = useProfileStore();
const saveProfile = (values: Record<string, any>) => {
  const defaultName = () =>
      activeTab.value === '0' ? `${values.punchoutUrl.value} - ${values.username.value}` : 'Custom Profile';

  const saved: Record<string, any> = {};
  for (const key in values) {
    if (key != 'valid') {
      saved[key] = values[key].value;
    }
  }
  const name = profileName.value || defaultName();
  addProfile(name, saved);
  toast.add({
    severity: 'success',
    summary: 'Profile Saved',
    life: 3000,
  });
};
</script>
