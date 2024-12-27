export function createXML(payload: string, date: string, username: string, password: string, punchoutUrl: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE cXML SYSTEM "http://xml.cxml.org/schemas/cXML/1.1.007/cXML.dtd">
<cXML version="1.1.007" xml:lang="en-US" payloadID="${payload}" timestamp="$date">
    <Header>
        <From>
            <Credential domain="DUNS">
                <Identity>${username}</Identity>
            </Credential>
        </From>
        <To>
            <Credential domain="Name">
                <Identity>Somewhere</Identity>
            </Credential>
        </To>
        <Sender>
            <Credential domain="DUNS">
                <Identity>${username}</Identity>
                <SharedSecret>${password}</SharedSecret>
            </Credential>
            <UserAgent>Lan2k cXML Punchout</UserAgent>
        </Sender>
    </Header>
    <Request deploymentMode="production">
        <PunchOutSetupRequest operation="create">
            <BuyerCookie>${payload}</BuyerCookie>
            <Extrinsic name="User">xxx-008</Extrinsic>
            <Extrinsic name="UserEmail">john.spence@ce.com.au</Extrinsic>
            <Extrinsic name="FirstName">John</Extrinsic>
            <Extrinsic name="LastName">Spence</Extrinsic>
            <BrowserFormPost>
                <URL>HOOK PLACEHOLDER</URL>
            </BrowserFormPost>
            <Contact role="endUser">
                <Name xml:lang="en-US">John Spence</Name>
                <Email>john.spence@ce.com.au</Email>
            </Contact>
            <SupplierSetup>
                <URL>${punchoutUrl}</URL>
            </SupplierSetup>
        </PunchOutSetupRequest>
    </Request>
</cXML>`
}

export function parseXML(xmlString: string): Document {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml')

    const parserError = xmlDoc.getElementsByTagName('parsererror')
    if (parserError.length) {
        throw new Error('Error parsing XML: ' + parserError[0].textContent)
    }

    return xmlDoc
}
