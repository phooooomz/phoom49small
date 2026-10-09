export async function onRequestGet(context) {
    const { env } = context;

    // ดึงค่าจาก KV
    const isOpen = await env.WORK_STORE.get("is_open") || "false";
    const workCount = await env.WORK_STORE.get("work_count") || "0";

    return new Response(JSON.stringify({
        is_open: isOpen === "true",
        work_count: parseInt(workCount)
    }), {
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    });
}
