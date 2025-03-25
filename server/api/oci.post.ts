import { defineEventHandler, type H3Event, readBody } from 'h3';

export default defineEventHandler(async (event) => {
    const { values, custom } = await readBody(event);
    const { username, password, hookUrl, punchoutUrl } = values;

    if (!punchoutUrl || !username || !password) {
        return {
            statusCode: 400,
            message: 'Missing required fields',
        };
    }

    const form = new FormData();
    form.append('USERNAME', username);
    form.append('PASSWORD', password);
    form.append('HOOK_URL', hookUrl || getLocalHookUrl(event));

    // standard fields
    form.append('~OkCode', "ADDI");
    form.append('~TARGET', "_top");
    form.append('~CALLER', "CTLG");

    // custom fields
    for (const key in custom) {
        form.append(key, custom[key]);
    }

    // Perform the punchout request (e.g., using fetch or axios)
    const response = await fetch(punchoutUrl, {
        method: 'POST',
        body: form,
        redirect: 'manual',
    });

    const redirectUrl = response.headers.get('Location') || '';
    const responseData = await response.text();

    return {
        statusCode: response.status,
        data: responseData,
        redirectUrl,
    };
});

function getLocalHookUrl(event:H3Event) {
    return getRequestProtocol(event) + '://' + getRequestHost(event) + '/oci/hook';
}