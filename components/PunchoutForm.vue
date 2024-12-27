<template>
  <div>
    <Form @submit="submitForm">
      <div class="flex flex-row gap-8">
        <div class="flex flex-col gap-2 w-96">
          <label for="punchoutUrl">Punchout URL:</label>
          <InputText id="punchoutUrl" v-model="punchoutUrl"/>

          <label for="username">Username:</label>
          <InputText id="username" v-model="username"/>

          <label for="password">Password:</label>
          <InputText id="password" v-model="password"/>
        </div>
        <div>Or:</div>
        <div class="flex flex-col gap-2">
          <label for="punchoutUrl">Input cXML:</label>
          <Textarea v-model="cXMLInput" style="width: 600px; height: 400px;" />
        </div>
      </div>

      <div class="flex px-16 py-8">
        <Button type="submit" class="w-24">Submit</Button>
      </div>
    </Form>
  </div>
</template>

<script lang="ts" setup>
import { FetchError } from 'ofetch'

const punchoutUrl = ref('');
const username = ref('');
const password = ref('');
const cXMLInput = ref('');

async function submitForm() {
  try {
    const response = await $fetch<{statusCode: string, data: string}>('/api/cxml', {
      method: 'POST',
      redirect: 'manual',
      body: {
        punchoutUrl: punchoutUrl.value,
        username: username.value,
        password: password.value
      }
    });

    const form = useMyFormData();
    form.value['cXML'] = response.data;
  } catch (error) {
    if (error instanceof FetchError && (error.response?.status === 301 || error.response?.status === 302)) {
      const redirectUrl = error.response.headers.get('location')
      if (redirectUrl) {
        window.location.href = redirectUrl; // Redirect to the third-party URL
      }
    } else {
      console.error(error);
    }
  }

  await navigateTo('/cxml/punch');
}
</script>
