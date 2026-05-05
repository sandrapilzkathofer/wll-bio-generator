exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const { email, bios } = body;

  if (!email) {
    return { statusCode: 400, body: JSON.stringify({ error: 'E-Mail fehlt' }) };
  }

  const AC_API_URL = process.env.AC_API_URL;   // z.B. https://deineaccount.api-us1.com
  const AC_API_KEY = process.env.AC_API_KEY;

  try {
    // 1. Kontakt in Active Campaign anlegen oder aktualisieren
    const contactRes = await fetch(`${AC_API_URL}/api/3/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Token': AC_API_KEY
      },
      body: JSON.stringify({
        contact: {
          email: email,
          fieldValues: []
        }
      })
    });

    const contactData = await contactRes.json();
    const contactId = contactData.contact?.id;

    // 2. Optional: Tag "Bio Generator" setzen
    if (contactId && process.env.AC_TAG_ID) {
      await fetch(`${AC_API_URL}/api/3/contactTags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Token': AC_API_KEY
        },
        body: JSON.stringify({
          contactTag: {
            contact: contactId,
            tag: process.env.AC_TAG_ID
          }
        })
      });
    }

    // 3. Optional: Liste hinzufügen
    if (contactId && process.env.AC_LIST_ID) {
      await fetch(`${AC_API_URL}/api/3/contactLists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Token': AC_API_KEY
        },
        body: JSON.stringify({
          contactList: {
            list: process.env.AC_LIST_ID,
            contact: contactId,
            status: 1
          }
        })
      });
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true })
    };

  } catch (err) {
    console.error('Active Campaign error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'E-Mail konnte nicht gespeichert werden' }) };
  }
};
