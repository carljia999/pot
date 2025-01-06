<template>
  <header class="flex flex-col gap-4">
    <Panel header="Supported methods">
      <ul>
        <li><nuxt-link to="/cxml">cXML Punchout</nuxt-link></li>
        <li><nuxt-link to="/oci">OCI Punchout</nuxt-link></li>
      </ul>
    </Panel>
    <Panel header="Resources">
      <nuxt-link to="https://punchoutcommerce.com/" external>punchoutcommerce</nuxt-link>
    </Panel>
  </header>
</template>

<style scoped>
header {
  background-color: #f8f9fa;
  padding: 1rem;
  text-align: center;
}

ul {
  list-style-type: none;
  padding: 0;
}

ul li {
  display: inline;
  margin: 0 1rem;
}
</style>