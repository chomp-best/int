/**
 * ELISEO STUDIO - SERVERLESS CORE
 * Archivo: /api/generate.js
 */

export default async function handler(req, res) {
    // Solo permitir POST
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const apiKey = process.env.GEMINI_KEY;
    const { name, industry, details } = req.body;

    const systemPrompt = `Eres el Arquitecto de IA Senior de Eliseo Studio. 
    Diseña una arquitectura operativa de autoridad máxima. Responde solo en JSON.`;

    const userPrompt = `Brief: ${name}, Rubro: ${industry}, Desafíos: ${details}`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userPrompt }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] },
                generationConfig: { responseMimeType: "application/json" }
            })
        });

        const result = await response.json();
        const jsonText = result.candidates[0].content.parts[0].text;
        return res.status(200).json(JSON.parse(jsonText));
    } catch (error) {
        return res.status(500).json({ error: 'Fallo en el motor Pulse' });
    }
}