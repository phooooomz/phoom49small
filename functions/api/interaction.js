// ฟังก์ชั่นสำหรับแปลง Hex String เป็น Uint8Array
function hexToUint8Array(hex) {
    return new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
}

export async function onRequestPost(context) {
    const { request, env } = context;

    // 1. ดึง Headers สำหรับตรวจสอบ Signature จาก Discord
    const signature = request.headers.get('X-Signature-Ed25519');
    const timestamp = request.headers.get('X-Signature-Timestamp');
    const bodyText = await request.text();

    if (!signature || !timestamp) {
        return new Response('Bad request signature', { status: 401 });
    }

    // 2. ตรวจสอบ Signature ด้วย Web Crypto API (Ed25519)
    try {
        const PUBLIC_KEY = env.DISCORD_PUBLIC_KEY;
        const key = await crypto.subtle.importKey(
            'raw',
            hexToUint8Array(PUBLIC_KEY),
            { name: 'NODE-ED25519', namedCurve: 'NODE-ED25519' },
            false,
            ['verify']
        );

        const encoder = new TextEncoder();
        const verified = await crypto.subtle.verify(
            'NODE-ED25519',
            key,
            hexToUint8Array(signature),
            encoder.encode(timestamp + bodyText)
        );

        if (!verified) {
            return new Response('Invalid request signature', { status: 401 });
        }
    } catch (err) {
        return new Response('Signature verification failed', { status: 401 });
    }

    // แปลงข้อความ Body กลับเป็น JSON
    const body = JSON.parse(bodyText);

    // 3. ตอบกลับ Ping Request จาก Discord (สำคัญที่สุดในการยืนยัน URL)
    if (body.type === 1) {
        return new Response(JSON.stringify({ type: 1 }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // 4. เมื่อมีการกดปุ่ม (Message Component)
    if (body.type === 3) {
        const customId = body.data.custom_id;

        if (customId === "accept_work") {
            let currentCount = parseInt(await env.WORK_STORE.get("work_count") || "0");
            currentCount += 1;
            await env.WORK_STORE.put("work_count", currentCount.toString());

            return new Response(JSON.stringify({
                type: 7, // Update Message
                data: {
                    content: `✅ **รับงานเรียบร้อยแล้ว!** (ปรับสถิติบนหน้าเว็บเป็น: ${currentCount} งาน)`,
                    components: []
                }
            }), { headers: { "Content-Type": "application/json" } });
        } 
        
        else if (customId === "reject_work") {
            return new Response(JSON.stringify({
                type: 7,
                data: {
                    content: `❌ **ปฏิเสธงานนี้แล้ว**`,
                    components: []
                }
            }), { headers: { "Content-Type": "application/json" } });
        }
    }

    return new Response('OK', { status: 200 });
}
