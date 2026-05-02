import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const animeData = [
  {
    title: 'Naruto Shippuden',
    titleEn: 'Naruto: Hurricane Chronicles',
    logo: 'https://cdn.myanimelist.net/images/anime/1565/111305l.jpg',
    cover: 'https://cdn.myanimelist.net/images/anime/1565/111305l.jpg',
    genres: 'Shounen,Aksiya,Sarguzasht',
    year: 2007,
    description: 'Naruto Uzumaki o\'z qishlog\'iga qaytib keladi va akasi Itachi Uchiha\'ni topish uchun yangi sarguzashtga otlanadi. Chunin examenlaridan o\'tib, jang san\'atlarini mukammallashtiradi. Do\'stlari Sakura va Sasuke bilan birga ko\'plab xavfli missiyalarni bajaradi. Dunyoni qutqarish uchun kuchli dushmanlarga qarshi kurashadi.',
    isOngoing: false,
    status: 'published',
    episodes: [
      { number: 1, title: 'Qaytish', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
      { number: 2, title: 'Akatsuki', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
      { number: 3, title: 'Yangi Dushman', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
      { number: 4, title: 'Kakashi Gaiden', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
      { number: 5, title: 'Jang Boshlanadi', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
    ],
  },
  {
    title: 'One Piece',
    titleEn: 'One Piece',
    logo: 'https://cdn.myanimelist.net/images/anime/6/73245l.jpg',
    cover: 'https://cdn.myanimelist.net/images/anime/6/73245l.jpg',
    genres: 'Shounen,Sarguzasht,Komediya',
    year: 1999,
    description: 'Monkey D. Luffy piratlar kemasi kapitani bo\'lishni orzu qiladi. U elastik kuchga ega bo\'lganidan so\'ng, dengizlarda sarguzashtlarga otlanadi. Do\'stlari Roronoa Zoro, Nami, Usopp, Sanji va boshqalar bilan birga Grand Line\'ni bosib o\'tadi. Ularning maqsadi — afsonaviy One Piece xazinasini topish.',
    isOngoing: true,
    status: 'published',
    episodes: [
      { number: 1, title: 'Romance Dawn', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
      { number: 2, title: 'Luffy Tong Chiqadi', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
      { number: 3, title: 'Morgan Kapitan', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
      { number: 4, title: 'Jangchi Zoro', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
    ],
  },
  {
    title: 'Demon Slayer',
    titleEn: 'Kimetsu no Yaiba',
    logo: 'https://cdn.myanimelist.net/images/anime/1286/99889l.jpg',
    cover: 'https://cdn.myanimelist.net/images/anime/1286/99889l.jpg',
    genres: 'Shounen,Fantastika,Aksiya',
    year: 2019,
    description: 'Tanjiro Kamado oilasi demonlar tomonidan yo\'q qilinadi. Singlisi Nezuko demonga aylangan bo\'lsa ham insoniylikni saqlab qoladi. Tanjiro Demon Slayer Corps\'ga qo\'shilib, singlisini odam qilish va oilasi o\'ldirgan demonni topish uchun kurashadi. Suv va quyosh nafslarini o\'rganadi.',
    isOngoing: true,
    status: 'published',
    episodes: [
      { number: 1, title: 'Qon va Qonpar', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
      { number: 2, title: 'Kapitan Ubuyashiki', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
      { number: 3, title: 'Sabito va Makomo', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
      { number: 4, title: 'Yakuniy Tanlov', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
      { number: 5, title: 'Kidnari', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
    ],
  },
  {
    title: 'Attack on Titan',
    titleEn: 'Shingeki no Kyojin',
    logo: 'https://cdn.myanimelist.net/images/anime/10/47347l.jpg',
    cover: 'https://cdn.myanimelist.net/images/anime/10/47347l.jpg',
    genres: 'Shounen,Aksiya,Drama',
    year: 2013,
    description: 'Insoniyat devlar tomonidan yo\'q qilinish arafasida. Eren Yeager onasini devlar o\'ldirgani uchun o\'ch olishga qasam ichadi. U do\'stlari Mikasa va Armin bilan Survey Corps\'ga qo\'shiladi. Devlar sirlari va insoniyatning haqiqiy tarixi asta-sekin ochiladi. Erenning taqdiri butun dunyoni o\'zgartiradi.',
    isOngoing: false,
    status: 'published',
    episodes: [
      { number: 1, title: 'Troya Devori', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
      { number: 2, title: 'Kundalik Hayot', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
      { number: 3, title: 'Yigitlarorning Vaziyati', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
      { number: 4, title: 'Kechasi Training', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
    ],
  },
  {
    title: 'Jujutsu Kaisen',
    titleEn: 'Jujutsu Kaisen',
    logo: 'https://cdn.myanimelist.net/images/anime/1171/109222l.jpg',
    cover: 'https://cdn.myanimelist.net/images/anime/1171/109222l.jpg',
    genres: 'Shounen,Aksiya,Fantastika',
    year: 2020,
    description: 'Yuji Itadori oddiy o\'quvchi, lekin kuchli jinni Ryomen Sukuna barmog\'ini topib, dunyoga chiqarib qo\'yadi. U Jujutsu Tech\'da o\'qishni boshlab, jinnilarga qarshi kurashuvchi jujutsu afsungarlariga qo\'shiladi. Do\'stlari Megumi va Nobara bilan birga xavli missiyalarni bajaradi.',
    isOngoing: true,
    status: 'published',
    episodes: [
      { number: 1, title: 'Ryomen Sukuna', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
      { number: 2, title: 'Ko\'zli maktab', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
      { number: 3, title: 'Kuchli Jang', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
    ],
  },
  {
    title: 'Dragon Ball Super',
    titleEn: 'Dragon Ball Super',
    logo: 'https://cdn.myanimelist.net/images/anime/7/74606l.jpg',
    cover: 'https://cdn.myanimelist.net/images/anime/7/74606l.jpg',
    genres: 'Shounen,Aksiya,Komediya',
    year: 2015,
    description: 'Son Goku va uning do\'stlari yangi sarguzashtlarga duch kelishadi. Majin Buu mag\'lubiyatga uchratilgandan so\'ng, u dunyoni xavf ostida qo\'yadigan yangi dushmanlar paydo bo\'ladi. Goku Super Saiyan formasini oshirib, boshqa olamlardan kelgan jangchilar bilan tanishadi.',
    isOngoing: false,
    status: 'published',
    episodes: [
      { number: 1, title: 'Xudo Bilan Uchrashuv', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
      { number: 2, title: 'Vegeta O\'rgatadi', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
      { number: 3, title: 'Sayyanlarning Yashash Joyi', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
      { number: 4, title: 'Turnir Boshlanadi', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
    ],
  },
  {
    title: 'My Hero Academia',
    titleEn: 'Boku no Hero Academia',
    logo: 'https://cdn.myanimelist.net/images/anime/10/78745l.jpg',
    cover: 'https://cdn.myanimelist.net/images/anime/10/78745l.jpg',
    genres: 'Shounen,Aksiya,Maktab',
    year: 2016,
    description: 'Izuku Midoriya o\'ta kuchli super qahramon bo\'lishni orzu qiladi, lekin u tug\'ma kuchga ega emas. Biroq eng kuchli qahramon All Might uni tanlaydi va o\'z kuchini beradi. U.A. High School akademiyasiga kirib, eng yaxshi qahramonlardan biri bo\'lish yo\'lida o\'qiydi va ko\'plab yovuz odamlarga qarshi kurashadi.',
    isOngoing: true,
    status: 'published',
    episodes: [
      { number: 1, title: 'Izuku Midoriya: Kelajak', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
      { number: 2, title: 'Qabul Sinovlari', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
      { number: 3, title: 'All Might\'ning Afsunlari', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
      { number: 4, title: 'Birinchi Dars', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
      { number: 5, title: 'Haqiqiy Sinov', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
    ],
  },
  {
    title: 'Spy x Family',
    titleEn: 'Spy x Family',
    logo: 'https://cdn.myanimelist.net/images/anime/1441/139614l.jpg',
    cover: 'https://cdn.myanimelist.net/images/anime/1441/139614l.jpg',
    genres: 'Komediya,Aksiya,Oila',
    year: 2022,
    description: 'Spy Agent Twilight maxfiy missiya uchun soxta oila yaratadi. U bola olish uchun bolalar uyidan Anya deb nomlangan telepat bolani oladi. Rafa qizi Anya va soxta xotini Yor bilan birga yashashga majbur bo\'ladi. Har bir a\'zo o\'z sirlarini berkitgan holda birga yashashga harakat qiladi.',
    isOngoing: true,
    status: 'published',
    episodes: [
      { number: 1, title: 'Operatsiya: Strix', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
      { number: 2, title: 'Yangi Oila', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
      { number: 3, title: 'Maktabga Tayyorgarlik', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
      { number: 4, title: 'Kompalik O\'quvchi', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
    ],
  },
  {
    title: 'Chainsaw Man',
    titleEn: 'Chainsaw Man',
    logo: 'https://cdn.myanimelist.net/images/anime/1806/126216l.jpg',
    cover: 'https://cdn.myanimelist.net/images/anime/1806/126216l.jpg',
    genres: 'Shounen,Aksiya,Qorong\'u',
    year: 2022,
    description: 'Denji yashash uchun demonlarga qarshi ovchi bo\'lib ishlaydi. U o\'z demon iti Pochita bilan birga yashaydi. Pochita yuragiga aylanib, Denjiga mashina boricha kuch beradi. U maxfiy tashkilotga qo\'shilib, kuchli demonlarga qarshi kurashadi. Biroq uning atrofidagi odamlarning hammasi sirlarga ega.',
    isOngoing: false,
    status: 'published',
    episodes: [
      { number: 1, title: 'It va O\'g\'ri', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
      { number: 2, title: 'Keling Chiroqni O\'chiraylik', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
      { number: 3, title: 'Meow Meow Meow', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
    ],
  },
  {
    title: 'Solo Leveling',
    titleEn: 'Solo Leveling',
    logo: 'https://cdn.myanimelist.net/images/anime/1402/142838l.jpg',
    cover: 'https://cdn.myanimelist.net/images/anime/1402/142838l.jpg',
    genres: 'Aksiya,Fantastika,Sarguzasht',
    year: 2024,
    description: 'Sung Jinwoo eng kuchsiz ovchi hisoblanadi. Bir kuni o\'ldirib bo\'lmaydigan dublyon ichida o\'limga yaqin qoladi va maxfiy tizim tomonidan tanlanadi. Har bir missiyada darajasi ko\'tarilib, eng kuchli ovchiga aylanadi. Ammo uning yangi kuchlari qanchalik xavfli ekanligini hech kim bilmaydi.',
    isOngoing: true,
    status: 'published',
    episodes: [
      { number: 1, title: 'Eng Kuchsiz Ovchi', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
      { number: 2, title: 'Nima Uchun Men Tanlandim', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
      { number: 3, title: 'O\'rmon Dublyoni', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
      { number: 4, title: 'Darajalar Sistemi', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
      { number: 5, title: 'Red Gate', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
    ],
  },
  {
    title: 'Death Note',
    titleEn: 'Death Note',
    logo: 'https://cdn.myanimelist.net/images/anime/9/9453l.jpg',
    cover: 'https://cdn.myanimelist.net/images/anime/9/9453l.jpg',
    genres: 'Psixologik,Triller,Detektiv',
    year: 2006,
    description: 'Light Yagami o\'quvchilik yillarida o\'lim daftari topadi — kimning nomini yozsa, u vafot etadi. U dunyodan yovuz odamlarni yo\'q qilib, yangi dunyo yaratmoqchi bo\'ladi. L detektiv uni topishga harakat qiladi. Aql va zukkolik o\'rtasidagi o\'ta qiziqarli o\'yin boshlanadi. Kim g\'alaba qozonadi?',
    isOngoing: false,
    status: 'published',
    episodes: [
      { number: 1, title: 'Qayta tug\'ilish', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
      { number: 2, title: 'Vafot Etni O\'rganish', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
      { number: 3, title: 'Cho\'pon va Bo\'ri', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
      { number: 4, title: 'L Haqida', videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', duration: 1440 },
    ],
  },
]

async function seed() {
  console.log('🌱 Demo animelarni qo\'shish...')

  let totalEpisodes = 0

  for (const anime of animeData) {
    const { episodes, ...animeFields } = anime

    const created = await db.anime.create({
      data: {
        ...animeFields,
        views: Math.floor(Math.random() * 5000) + 500,
        episodes: {
          create: episodes.map(ep => ({
            ...ep,
            views: Math.floor(Math.random() * 1000) + 100,
          })),
        },
      },
      include: { episodes: true },
    })

    totalEpisodes += created.episodes.length
    console.log(`✅ "${created.title}" — ${created.episodes.length} qism`)
  }

  // Set admin user
  const adminUser = await db.user.findUnique({ where: { email: 'admin@gmail.com' } })
  if (adminUser) {
    await db.user.update({ where: { id: adminUser.id }, data: { isAdmin: true } })
    console.log(`👑 Admin: ${adminUser.email}`)
  }

  // Set demo admin token
  if (adminUser) {
    await db.user.update({
      where: { id: adminUser.id },
      data: { sessionToken: 'admin-demo-token' },
    })
    console.log('🔑 Admin token: admin-demo-token')
  }

  console.log(`\n🎉 Jami: ${animeData.length} anime, ${totalEpisodes} qism qo\'shildi!`)
}

seed()
  .catch(console.error)
  .finally(() => db.$disconnect())
