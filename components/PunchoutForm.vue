<template>
  <div>
    <Form @submit="submitForm">
      <Tabs value="0">
          <TabList>
              <Tab value="0">Basic</Tab>
              <Tab value="1">Advanced</Tab>
          </TabList>
          <TabPanels>
              <TabPanel value="0">
                <div class="flex flex-col gap-2 w-96">
                  <label for="punchoutUrl">Punchout URL:</label>
                  <InputText id="punchoutUrl" v-model="punchoutUrl"/>

                  <label for="username">Username:</label>
                  <InputText id="username" v-model="username"/>

                  <label for="password">Password:</label>
                  <InputText id="password" v-model="password"/>
                </div>
              </TabPanel>
              <TabPanel value="1">
                <div class="flex flex-col gap-2 w-96">
                  <label>Input cXML: <Textarea v-model="cXMLInput" style="width: 600px; height: 360px;" /></label>
                  <label><Checkbox v-model="replacingUrl" binary /> Replace Hook URL</label>
                </div>
              </TabPanel>
          </TabPanels>
      </Tabs>
      <div class="flex px-16">
        <Button type="submit" class="w-24">Submit</Button>
      </div>
    </Form>
  </div>
</template>

<script lang="ts" setup>

const punchoutUrl = ref('');
const username = ref('');
const password = ref('');
const cXMLInput = ref('');
const toast = useToast();
const replacingUrl = ref(true);

async function submitForm() {
  try {
    const response = await $fetch<{statusCode: number, data: string, message?: string}>('/api/cxml', {
      method: 'POST',
      redirect: 'manual',
      body: {
        punchoutUrl: punchoutUrl.value,
        username: username.value,
        password: password.value
      }
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
}
</script>
