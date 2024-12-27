// This file contains the API endpoint for handling cXML punchout requests. 
// It processes the input data, generates the cXML, and performs the punchout.

import { defineEventHandler, readBody } from 'h3';
import { v4 as uuidv4 } from 'uuid';
import { createXML } from '../../utils/xml-parser';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { punchoutUrl, username, password } = body;

    if (!punchoutUrl || !username || !password) {
        return {
            statusCode: 400,
            message: 'Missing required fields',
        };
    }

    const payload = generateUniqueId();
    const date = new Date().toISOString();
    
    const cxml = createXML(payload, date, username, password, punchoutUrl).
        replace('HOOK PLACEHOLDER', getRequestProtocol(event) + '://' + getRequestHost(event) + '/cxml/hook');

    // Perform the punchout request (e.g., using fetch or axios)
    const response = await fetch(punchoutUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/xml',
        },
        body: cxml,
    });

    const responseData = await response.text();

    return {
        statusCode: response.status,
        data: responseData,
    };
});

function generateUniqueId() {
    return 'punchout_' + uuidv4();
}