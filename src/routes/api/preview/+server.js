// src/routes/api/preview/+server.js

/**
 * Endpoint para rodar o preview do build via API (apenas em dev)
 */
export async function POST() {
    if (process.env.NODE_ENV === 'production') {
        return new Response('Proibido em produção', { status: 403 });
    }
    // Apenas retorna o endereço do preview (assumindo que já está rodando)
    const previewUrl = 'http://localhost:4173';
    return new Response(JSON.stringify({ url: previewUrl }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
