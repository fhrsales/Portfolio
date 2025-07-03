// Este arquivo impede o build da rota /admin em produção
export const ssr = false;

if (import.meta.env.PROD) {
  throw new Error('A rota /admin só está disponível em desenvolvimento.');
}
