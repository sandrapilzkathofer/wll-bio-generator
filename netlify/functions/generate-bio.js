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

  const { name, zielgruppe, transformation, persoenlichkeit, cta, ton, emoji } = body;

  if (!name || !zielgruppe || !transformation) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Pflichtfelder fehlen' }) };
  }

  const prompt = `Du bist eine Expertin für Instagram-Bios für deutschsprachige Unternehmerinnen und Coaches.

Erstelle 3 verschiedene Instagram-Bio-Varianten basierend auf diesen Infos:

Name/Titel: ${name}
Zielgruppe: ${zielgruppe}
Transformation/Ergebnis: ${transformation}
${persoenlichkeit ? `Persönlichkeit/besonderes Merkmal: ${persoenlichkeit}` : ''}
Call-to-Action: ${cta || 'keinen angegeben'}
Ton: ${ton}
Emojis: ${emoji}

Regeln für Instagram-Bios:
- Maximal 150 Zeichen pro Bio (ohne Zeilenumbrüche gezählt)
- Jede Bio soll einzigartig sein in Struktur und Fokus
- Nutze Zeilenumbrüche sinnvoll (max. 3-4 Zeilen)
- Die Bio soll sofort klar machen: WER sie ist, WEM sie hilft, was der nächste Schritt ist
- Variante 1: Fokus auf Transformation / konkretes Ergebnis
- Variante 2: Fokus auf Persönlichkeit & Authentizität
- Variante 3: Mutig, klar, direkter Hook der sofort neugierig macht

Antworte NUR mit einem JSON-Array, ohne Erklärungen, ohne Markdown-Backticks:
[
  {"label": "Variante 1 – Transformation", "bio": "..."},
  {"label": "Variante 2 – Persönlichkeit", "bio": "..."},
  {"label": "Variante 3 – Direkter Hook", "bio": "..."}
]`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic error:', err);
      return { statusCode: 500, body: JSON.stringify({ error: 'AI-Fehler' }) };
    }

    const data = await response.json();
    const text = data.content.map(i => i.text || '').join('');
    const clean = text.replace(/```json|```/g, '').trim();
    const bios = JSON.parse(clean);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bios })
    };

  } catch (err) {
    console.error('Function error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Server-Fehler' }) };
  }
};
