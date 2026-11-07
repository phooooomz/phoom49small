export default {
    async fetch(request, env, ctx) {
        // ให้ Worker ทำหน้าที่เสิร์ฟไฟล์หน้าเว็บอย่างเดียว
        return env.ASSETS.fetch(request);
    }
};
