<template>
    <header class="header">
        <Toolbar pt:center:class="gap-2">
            <template #start>
                <NuxtLink href="/">
                    <i class="pi pi-shop text-3xl text-teal-700"/>
                </NuxtLink>
            </template>

            <template #center>
                <h1 class="text-xl font-bold">Punchout Tester</h1>
                <NuxtLink href="/cxml">
                    <img src="/cxml-32x32.png" alt="cXML" class="w-7 h-7">
                </NuxtLink>
                <NuxtLink href="/oci">
                    <div class="oci"><span class="oci-i">OCI</span></div>
                </NuxtLink>
            </template>
        </Toolbar>
    </header>
</template>

<style lang="css">
.oci {
    line-height: 29px;
    background-repeat: no-repeat;
    background-image: url(data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgNDEyLjM4IDIwNCI+PGRlZnM+PHN0eWxlPi5jbHMtMSwuY2xzLTJ7ZmlsbC1ydWxlOmV2ZW5vZGQ7fS5jbHMtMXtmaWxsOnVybCgjbGluZWFyLWdyYWRpZW50KTt9LmNscy0ye2ZpbGw6I2ZmZjt9PC9zdHlsZT48bGluZWFyR3JhZGllbnQgaWQ9ImxpbmVhci1ncmFkaWVudCIgeDE9IjIwNi4xOSIgeDI9IjIwNi4xOSIgeTI9IjIwNCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzAwYjhmMSIvPjxzdG9wIG9mZnNldD0iMC4wMiIgc3RvcC1jb2xvcj0iIzAxYjZmMCIvPjxzdG9wIG9mZnNldD0iMC4zMSIgc3RvcC1jb2xvcj0iIzBkOTBkOSIvPjxzdG9wIG9mZnNldD0iMC41OCIgc3RvcC1jb2xvcj0iIzE3NzVjOCIvPjxzdG9wIG9mZnNldD0iMC44MiIgc3RvcC1jb2xvcj0iIzFjNjViZiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzFlNWZiYiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjx0aXRsZT5TQVBfZ3JhZF9SX3Njcm5fWmVpY2hlbmZsw6RjaGUgMTwvdGl0bGU+PHBvbHlsaW5lIGNsYXNzPSJjbHMtMSIgcG9pbnRzPSIwIDIwNCAyMDguNDEgMjA0IDQxMi4zOCAwIDAgMCAwIDIwNCIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTI0NC43MywzOC4zNmwtNDAuNiwwdjk2LjUyTDE2OC42NywzOC4zM0gxMzMuNTFsLTMwLjI3LDgwLjcyQzEwMCw5OC43LDc5LDkxLjY3LDYyLjQsODYuNCw1MS40Niw4Mi44OSwzOS44NSw3Ny43Miw0MCw3MmMuMDktNC42OCw2LjIzLTksMTguMzgtOC4zOCw4LjE3LjQzLDE1LjM3LDEuMDksMjkuNzEsOGwxNC4xLTI0LjU1Qzg5LjA2LDQwLjQyLDcxLDM2LjIxLDU2LjE3LDM2LjE5aC0uMDljLTE3LjI4LDAtMzEuNjgsNS42LTQwLjYsMTQuODNBMzQuMjMsMzQuMjMsMCwwLDAsNS43Nyw3NC43QzUuNTQsODcuMTUsMTAuMTEsOTYsMTkuNzEsMTAzYzguMSw1Ljk0LDE4LjQ2LDkuNzksMjcuNiwxMi42MiwxMS4yNywzLjQ5LDIwLjQ3LDYuNTMsMjAuMzYsMTNBOS41Nyw5LjU3LDAsMCwxLDY1LDEzNWMtMi44MSwyLjktNy4xMyw0LTEzLjA5LDQuMS0xMS40OS4yNC0yMC0xLjU2LTMzLjYxLTkuNTlMNS43NywxNTQuNDJhOTMuNzcsOTMuNzcsMCwwLDAsNDYsMTIuMjJsMi4xMSwwYzE0LjI0LS4yNSwyNS43NC00LjMxLDM0LjkyLTExLjcxLjUzLS40MSwxLS44NCwxLjQ5LTEuMjhMODYuMTcsMTY0LjVIMTIzbDYuMTktMTguODJhNjcuNDYsNjcuNDYsMCwwLDAsMjEuNjgsMy40Myw2OC4zMyw2OC4zMywwLDAsMCwyMS4xNi0zLjI1bDYsMTguNjRoNjAuMTR2LTM5aDEzLjExYzMxLjcxLDAsNTAuNDYtMTYuMTUsNTAuNDYtNDMuMkMzMDEuNzQsNTIuMTksMjgzLjUyLDM4LjM2LDI0NC43MywzOC4zNlpNMTUwLjkxLDEyMWEzNi45MywzNi45MywwLDAsMS0xMy0yLjI4bDEyLjg3LTQwLjU5SDE1MWwxMi42NSw0MC43MUEzOC41LDM4LjUsMCwwLDEsMTUwLjkxLDEyMVptOTYuMi0yMy4zM2gtOC45NFY2NC45MWg4Ljk0YzExLjkzLDAsMjEuNDQsNCwyMS40NCwxNi4xNCwwLDEyLjYtOS41MSwxNi41Ny0yMS40NCwxNi41NyIvPjwvc3ZnPg==);
    background-size: 1.8rem;
}
.oci-i {
    display: inline-block;
    line-height: 18px;
    vertical-align: bottom;
}
</style>