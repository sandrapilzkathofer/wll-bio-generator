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

  const prompt = `Du bist eine der besten Instagram-Copywriterinnen im deutschsprachigen Raum. Du schreibst Bios die sofort Aufmerksamkeit erzeugen, Vertrauen aufbauen und zum Folgen oder Klicken animieren.

Du bekommst Rohdaten von einer Unternehmerin. Deine Aufgabe: Verwandle diese Infos in 3 verkaufsstarke, magnetische Instagram-Bios. Schreib NICHT einfach die Infos ab – veredle sie mit echtem Copywriting.

ROHDATEN:
Name/Titel: ${name}
Zielgruppe: ${zielgruppe}
Transformation/Ergebnis: ${transformation}
${persoenlichkeit ? `Persönlichkeit: ${persoenlichkeit}` : ''}
Call-to-Action: ${cta || 'keinen angegeben'}
Gewünschter Ton: ${ton}
Emojis: ${emoji}

COPYWRITING-REGELN für magnetische Bios:
- Sprich die Zielgruppe direkt an oder zeig ihr Problem/Wunsch auf
- Nutze starke Verben statt schwacher Substantive ("du wirst sichtbar" statt "Sichtbarkeit")
- Konkret statt vage ("3 Kunden in 30 Tagen" statt "mehr Kunden gewinnen")
- Keine leeren Worthülsen wie "leidenschaftlich", "authentisch", "holistisch"
- Die Bio soll ein Gefühl erzeugen – nicht nur informieren
- Maximal 150 Zeichen (ohne Zeilenumbrüche)
- 3-4 Zeilen mit sinnvollen Zeilenumbrüchen
- Jede Zeile hat einen eigenen Job: Aufmerksamkeit → Relevanz → Vertrauen → Aktion

VARIANTEN:
- Variante 1 "Die Transformations-Bio": Fokus auf das konkrete Ergebnis/den Vorher-Nachher Effekt. Die Leserin soll denken "genau das will ich!"
- Variante 2 "Die Persönlichkeits-Bio": Fokus auf wer sie ist, was sie einzigartig macht. Menschlich, warm, nahbar – aber trotzdem professionell
- Variante 3 "Der Pattern Interrupt": Unerwarteter Einstieg, provokant oder überraschend, bricht das typische Bio-Muster auf. Mutig und unvergesslich.

Antworte NUR mit einem JSON-Array, ohne Erklärungen, ohne Markdown-Backticks:
[
  {"label": "Variante 1 – Transformation", "bio": "..."},
  {"label": "Variante 2 – Persönlichkeit", "bio": "..."},
  {"label": "Variante 3 – Pattern Interrupt", "bio": "..."}
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
