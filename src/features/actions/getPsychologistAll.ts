
export async function getPsychologistAll() {
    const res = await fetch('https://n8n-v2.hrani.live/webhook/get-filtered-psychologists-test-contur', {
        cache: 'no-cache'
    })
    return res.json();
}