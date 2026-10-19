# MiniIsh

MiniIsh — O‘zbekistondagi yosh boshlovchi ijodkorlarni kichik bizneslarning dizayn, video, web va kontent topshiriqlari bilan bog‘lash g‘oyasiga asoslangan MVP.

## Hozirgi versiya

- Responsive landing page: desktop, planshet va telefon.
- Buyurtmalar ro‘yxati, qidiruv va kategoriya filtrlari.
- Buyurtma tafsilotlari oynasi.
- Demo buyurtma joylash formasi.
- Demo ijodkor profili va ariza formasi.
- Kichik ekranlar uchun menyu, klaviatura navigatsiyasi va reduced-motion qo‘llovi.
- Tashqi JavaScript kutubxonalari va build jarayoni talab qilinmaydi.

## Muhim cheklov

Bu hozircha front-end prototip. Namunaviy buyurtmalar haqiqiy mijoz e’lonlari emas. Forma yuborish, ariza va profil ma’lumotlari faqat ayni brauzerning localStorage xotirasida demo sifatida saqlanadi. Ular serverga, boshqa foydalanuvchilarga yoki buyurtmachiga yuborilmaydi. Sayt yopiq yoki boshqa qurilmada ochilganda ma’lumotlar umumiy bo‘lib ko‘rinmaydi.

Haqiqiy ishga tushirish uchun backend/baza, foydalanuvchi autentifikatsiyasi, server tomonida validatsiya, maxfiylik shartlari, shikoyat/moderatsiya jarayoni va xavfsiz aloqa/to‘lov qoidalari ishlab chiqilishi kerak.

## Lokal ishga tushirish

1. Repository fayllarini yuklab oling yoki klon qiling.
2. index.html faylini brauzerda oching. Qulayroq ishlab chiqish uchun VS Code Live Server ham ishlaydi.
3. styles.css ko‘rinish va responsive dizaynni, app.js esa qidiruv, filtrlar hamda demo shakllarni boshqaradi.

## GitHub Pages orqali joylash

1. GitHub repository ichida Settings → Pages bo‘limini oching.
2. Build and deployment qismida Deploy from a branch ni tanlang.
3. Branch sifatida main, folder sifatida root bo‘limini belgilang va saqlang.
4. Pages holati published bo‘lgach, GitHub ko‘rsatgan sayt havolasini tekshiring.

## Keyingi amaliy bosqich

1. 10 ta kichik biznes va 20 ta ijodkor bilan suhbat orqali talabni tekshirish.
2. Birinchi haqiqiy vazifalar va kelishilgan shartlar bilan kichik pilot o‘tkazish.
3. Shundan keyingina umumiy ma’lumotlar bazasi, login, real arizalar va boshqaruv panelini qurish.

## Brend

Ishchi nom: **MiniIsh**. Nom, domen va ijtimoiy tarmoq username mavjudligi alohida tekshirilishi kerak.