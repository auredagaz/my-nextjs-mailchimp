export async function GET(request: Request) {
  return new Response(
    JSON.stringify({
      message: "Hello, Next.js!",
      origin: request.headers.get("origin")!,
    }),
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}
