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
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // 1. API ดึงสถานะสำหรับหน้าเว็บ (GET /api/status)
        if (url.pathname === '/api/status' && request.method === 'GET') {
            let isOpen = 'false';
            let workCount = '0';

            try {
                // เช็คความปลอดภัยก่อนดึง KV เพื่อป้องกัน Error 1011
                if (env && env.WORK_STORE) {
                    isOpen = (await env.WORK_STORE.get('is_open', { cacheTtl: 0 })) || 'false';
                    workCount = (await env.WORK_STORE.get('work_count', { cacheTtl: 0 })) || '0';
                }
            } catch (e) {
                console.error("KV Read Error:", e);
            }

            return new Response(JSON.stringify({
                is_open: isOpen === 'true' || isOpen === true,
                work_count: parseInt(workCount) || 0
            }), {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Cache-Control': 'no-cache, no-store, must-revalidate'
                }
            });
        }

        // 2. API รับฟอร์มติดต่องานแล้วส่งเข้า Discord (POST /api/submit)
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

        // 3. API รับ Interactions จาก Discord (POST /api/interaction)
        if (url.pathname === '/api/interaction' && request.method === 'POST') {
            const signature = request.headers.get('X-Signature-Ed25519');
            const timestamp = request.headers.get('X-Signature-Timestamp');
            const rawBody = await request.text();

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

                if (!verified) return new Response('Invalid request signature', { status: 401 });
            } catch (err) {
                return new Response('Signature verification failed', { status: 401 });
            }

            const message = JSON.parse(rawBody);

            // 1. ตอบกลับ Ping (Type 1)
            if (message.type === 1) {
                return new Response(JSON.stringify({ type: 1 }), {
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            // 2. ตอบกลับเมื่อพิมพ์คำสั่ง /status (Type 2)
            if (message.type === 2) {
                if (message.data && message.data.name === "status") {
                    return new Response(JSON.stringify({
                        type: 4,
                        data: {
                            content: "⚙️ **เลือกสถานะการรับงานที่ต้องการตั้งค่า:**",
                            flags: 64, // เห็นเฉพาะผู้สั่งคำสั่ง (Ephemeral)
                            components: [{
                                type: 1,
                                components: [
                                    { type: 2, style: 3, label: "🟢 เปิดรับงาน", custom_id: "toggle_open" },
                                    { type: 2, style: 4, label: "🔴 ปิดรับงาน", custom_id: "toggle_close" }
                                ]
                            }]
                        }
                    }), { headers: { 'Content-Type': 'application/json' } });
                }
            }

            // 3. ตอบกลับเมื่อกดปุ่ม (Type 3)
            if (message.type === 3) {
                const customId = message.data.custom_id;

                if (!env || !env.WORK_STORE) {
                    return new Response(JSON.stringify({
                        type: 4,
                        data: { content: "⚠️ **เกิดข้อผิดพลาด:** ยังไม่ได้ผูก KV Binding ใน Cloudflare", flags: 64 }
                    }), { headers: { 'Content-Type': 'application/json' } });
                }

                // กดรับงาน (+1)
                if (customId === "accept_work") {
                    ctx.waitUntil((async () => {
                        let currentCount = parseInt(await env.WORK_STORE.get("work_count") || "0");
                        currentCount += 1;
                        await env.WORK_STORE.put("work_count", currentCount.toString());
                    })());

                    return new Response(JSON.stringify({
                        type: 7,
                        data: { content: `✅ **รับงานเรียบร้อยแล้ว!**`, components: [] }
                    }), { headers: { 'Content-Type': 'application/json' } });
                }

                // กดปฏิเสธงาน
                if (customId === "reject_work") {
                    return new Response(JSON.stringify({
                        type: 7,
                        data: { content: `❌ **ปฏิเสธงานนี้แล้ว**`, components: [] }
                    }), { headers: { 'Content-Type': 'application/json' } });
                }

                // กดสลับสถานะ: เปิดรับงาน
                if (customId === "toggle_open") {
                    ctx.waitUntil(env.WORK_STORE.put("is_open", "true"));
                    return new Response(JSON.stringify({
                        type: 7,
                        data: { content: `🟢 **เปลี่ยนสถานะเป็น: พร้อมรับงาน (Open) เรียบร้อยแล้ว!**`, components: [] }
                    }), { headers: { 'Content-Type': 'application/json' } });
                }

                // กดสลับสถานะ: ปิดรับงาน
                if (customId === "toggle_close") {
                    ctx.waitUntil(env.WORK_STORE.put("is_open", "false"));
                    return new Response(JSON.stringify({
                        type: 7,
                        data: { content: `🔴 **เปลี่ยนสถานะเป็น: ไม่พร้อมรับงาน (Close) เรียบร้อยแล้ว!**`, components: [] }
                    }), { headers: { 'Content-Type': 'application/json' } });
                }
            }

            return new Response('OK', { status: 200 });
        }

        return env.ASSETS.fetch(request);
    }
};
