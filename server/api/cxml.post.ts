// This file contains the API endpoint for handling cXML punchout requests. 
// It processes the input data, generates the cXML, and performs the punchout.

import { defineEventHandler, type H3Event, readBody } from 'h3';
import { v4 as uuidv4 } from 'uuid';
import { createXML } from '../../utils/xml-parser';
import { Parser, Builder } from 'xml2js';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { username, password, cXMLInput: rawXml, replacingUrl: replacing } = body;

    let cxml = '';
    let punchoutUrl = body.punchoutUrl;
    if (rawXml) {
        const parser = new Parser({explicitArray: false});
        try {
            const result = await parser.parseStringPromise(rawXml);
            punchoutUrl = result.cXML.Request.PunchOutSetupRequest.SupplierSetup.URL;
            if (replacing) {
                result.cXML.Request.PunchOutSetupRequest.BrowserFormPost.URL = getLocalHookUrl(event);
            }
            cxml = new Builder().buildObject(result);
        } catch (e) {
            return {
                statusCode: 400,
                message: 'Invalid XML' + e,
            }
        }
    } else if (!punchoutUrl || !username || !password) {
        return {
            statusCode: 400,
            message: 'Missing required fields',
        };
    } else {
        const payload = generateUniqueId();
        const date = new Date().toISOString();
        cxml = createXML(payload, date, username, password, punchoutUrl, getLocalHookUrl(event));
    }

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

function getLocalHookUrl(event:H3Event) {
    return getRequestProtocol(event) + '://' + getRequestHost(event) + '/cxml/hook';
}