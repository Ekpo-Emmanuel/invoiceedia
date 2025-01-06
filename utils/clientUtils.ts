export function getOrgSlugFromUrl() {
    if (typeof window === 'undefined') return ''
    return window.location.pathname.split('/')[1]
} 