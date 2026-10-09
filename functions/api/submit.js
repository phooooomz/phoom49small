export async function onRequestPost(context) {
    const { request, env } = context;
    const data = await request.json();

    // ดึง URL Webhook จาก Environment Variables หรือใส่ลงไปตรงๆ
    const WEBHOOK_URL = env.DISCORD_WEBHOOK_URL;

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
        }]
    };

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            return new Response(JSON.stringify({ success: true }), {
                headers: { "Content-Type": "application/json" }
            });
        }
        return new Response(JSON.stringify({ success: false }), { status: 400 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
