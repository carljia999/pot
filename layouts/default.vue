<template>
  <NuxtLayout>
    <header>
      <h1>Punch Out Application</h1>
      <nav>
        <ul>
          <li><nuxt-link to="/cxml">cXML Punchout</nuxt-link></li>
          <li><nuxt-link to="/oci">OCI Punchout</nuxt-link></li>
        </ul>
      </nav>
    </header>
    <main>
      <slot />
    </main>
    <footer>
      <p>&copy; 2023 Punch Out Application</p>
    </footer>
  </NuxtLayout>
</template>

<script lang="ts">
export default {
  layout: 'default',
}
</script>

<style scoped>
header {
  background-color: #f8f9fa;
  padding: 1rem;
  text-align: center;
}

nav ul {
  list-style-type: none;
  padding: 0;
}

nav ul li {
  display: inline;
  margin: 0 1rem;
}

footer {
  text-align: center;
  padding: 1rem;
  background-color: #f8f9fa;
}
</style>