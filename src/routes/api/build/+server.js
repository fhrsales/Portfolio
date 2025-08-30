// src/routes/api/build/+server.js

/**
 * Endpoint para rodar o build do projeto via API (apenas em dev)
 */
export async function POST() {
    if (process.env.NODE_ENV === 'production') {
        return new Response('Proibido em produção', { status: 403 });
    }
    const { exec } = await import('child_process');
    return new Promise((resolve) => {
        exec('npm run build', { cwd: process.cwd() }, (error, stdout, stderr) => {
        if (error) {
            resolve(new Response(stderr, { status: 500 }));
        } else {
            resolve(new Response(stdout, { status: 200 }));
        }
        });
    });
}
