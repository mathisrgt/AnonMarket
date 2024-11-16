export async function POST(request: Request) {
    try {

        // TODO Add back-end logic.

        return new Response(JSON.stringify({ name: "Validation Success" }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error while processing the swap:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
