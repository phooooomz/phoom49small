// ฟังก์ชั่นแปลง Hex String เป็น Uint8Array
function hexToUint8Array(hex) {
    if (!hex) return new Uint8Array();
    const bytes = new Uint8Array(Math.ceil(hex.length / 2));
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return bytes;
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // 1. Endpoint ดึงสถานะและตัวเลข (GET /api/status)
        if (url.pathname === '/api/status' && request.method === 'GET') {
            const isOpen = await env.WORK_STORE.get('is_open') || 'false';
            const workCount = await env.WORK_STORE.get('work_count') || '0';

            return new Response(JSON.stringify({
                is_open: isOpen === 'true',
                work_count: parseInt(workCount)
            }), {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        // 2. Endpoint ส่งฟอร์มติดต่องานเข้า Discord (POST /api/submit)
        if (url.pathname === '/api/submit' && request.method === 'POST') {
            try {
                const data = await request.json();
                const BOT_TOKEN = env.DISCORD_BOT_TOKEN;
                const CHANNEL_ID = env.DISCORD_CHANNEL_ID;

                const payload = {
                    embeds: [{
                        title: "📩 มีรายการติดต่องานใหม่!",
                        color: 388988,
                        fields: [
                            { name: "👤 ชื่อผู้ติดต่อ", value: data.name || "-", inline: true },
                            { name: "🎂 อายุ", value: (data.age || "-") + " ปี", inline: true },
                            { name: "📸 Instagram", value: data.instagram || "-", inline: true },
                            { name: "📝 รายละเอียดงาน", value: data.details || "-" }
                        ],
                        footer: { text: "Phoom49small Contact System" },
                        timestamp: new Date().toISOString()
                    }],
                    components: [{
                        type: 1,
                        components: [
                            { type: 2, style: 3, label: "✅ รับงาน (+1)", custom_id: "accept_work" },
                            { type: 2, style: 4, label: "❌ ปฏิเสธ", custom_id: "reject_work" }
                        ]
                    }]
                };

                const res = await fetch(`https://discord.com/api/v10/channels/${CHANNEL_ID}/messages`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bot ${BOT_TOKEN}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
                }
                return new Response(JSON.stringify({ success: false }), { status: 400 });
            } catch (err) {
                return new Response(JSON.stringify({ error: err.message }), { status: 500 });
            }
        }

        // 3. Endpoint รับกดปุ่มจาก Discord (POST /api/interaction)
        if (url.pathname === '/api/interaction' && request.method === 'POST') {
            const signature = request.headers.get('X-Signature-Ed25519');
            const timestamp = request.headers.get('X-Signature-Timestamp');
            const rawBody = await request.text();

            // ตรวจสอบ Signature ผ่าน Web Crypto API
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
                    encoder.encode(timestamp + rawBody)
                );

                if (!verified) {
                    return new Response('Invalid request signature', { status: 401 });
                }
            } catch (err) {
                return new Response('Signature verification failed', { status: 401 });
            }

            const message = JSON.parse(rawBody);

            // ตอบกลับ Ping (Type 1) เพื่อยืนยัน URL ใน Discord Developer Portal
            if (message.type === 1) {
                return new Response(JSON.stringify({ type: 1 }), {
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            // ตอบกลับเมื่อกดปุ่ม (Type 3)
            if (message.type === 3) {
                const customId = message.data.custom_id;

                if (customId === "accept_work") {
                    let currentCount = parseInt(await env.WORK_STORE.get("work_count") || "0");
                    currentCount += 1;
                    await env.WORK_STORE.put("work_count", currentCount.toString());

                    return new Response(JSON.stringify({
                        type: 7,
                        data: {
                            content: `✅ **รับงานเรียบร้อยแล้ว!** (ปรับสถิติบนหน้าเว็บเป็น: ${currentCount} งาน)`,
                            components: []
                        }
                    }), { headers: { 'Content-Type': 'application/json' } });
                }

                if (customId === "reject_work") {
                    return new Response(JSON.stringify({
                        type: 7,
                        data: {
                            content: `❌ **ปฏิเสธงานนี้แล้ว**`,
                            components: []
                        }
                    }), { headers: { 'Content-Type': 'application/json' } });
                }
            }

            return new Response('OK', { status: 200 });
        }

        // หากเป็น Path อื่น ให้ Cloudflare Pages เสิร์ฟไฟล์หน้าเว็บ (index.html) ตามปกติ
        return env.ASSETS.fetch(request);
    }
};
