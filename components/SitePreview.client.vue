<template>
    <img :src="screenshotUrl" alt="Captured screenshot">
</template>

<script setup lang="ts">
import html2canvas from 'html2canvas'

const { siteUrl } = defineProps<{ siteUrl: string }>()

interface FetchPageResponse {
    html: string
}

interface ApiError {
    message: string
    status?: number
    statusCode?: number
}

const cache = useLocalStorage('sitePreviewCache', new Map<string, string>())
const url = computed(() => new URL(siteUrl).origin)
const screenshotUrl = ref(cache.value.get(url.value) || 'https://demofree.sirv.com/nope-not-here.jpg?w=250')
const isLoading = ref(false)
const error = ref('')

const captureScreenshot = async () => {
    try {
        isLoading.value = true
        error.value = ''

        const { html } = await $fetch<FetchPageResponse>('/api/fetch-page', {
            method: 'POST',
            body: { url: url.value }
        })

        const container = document.createElement('div')
        container.style.position = 'absolute'
        container.style.left = '-9999px'
        container.style.width = '1024px'
        container.innerHTML = html
        document.body.appendChild(container)

        const canvas = await html2canvas(container, {
            allowTaint: true,
            useCORS: true,
            width: 1024,
            height: 768,
            scale: 0.4,
        })

        screenshotUrl.value = canvas.toDataURL()
        document.body.removeChild(container)
        cache.value.set(url.value, screenshotUrl.value)
    } catch (err) {
        const apiError = err as ApiError
        error.value = `Error capturing screenshot: ${apiError.message || 'Unknown error occurred'}`
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    if (url.value && !cache.value.get(url.value)) {
        captureScreenshot()
    }
})
</script>

<style scoped>
img {
    max-width: 100%;
}
</style>