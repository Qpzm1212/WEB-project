/**
 * Meat Point Astana: Menu Database & Restaurant Metadata
 * Real restaurant data: Uly Dala 45, Astana | 24/7 | 100% Halal
 * Prices in Kazakhstani Tenge (₸)
 * Anti-Vibe-Coding Refactored: Zero emojis, Zero em-dashes, Factual culinary descriptions
 */

(function (window) {
  'use strict';

  const RESTAURANT_INFO = {
    name: 'Meat Point Astana',
    tagline: 'Турецкий мясной ресторан и стейк-хаус',
    halal: '100% Halal Certified',
    address: 'г. Астана, проспект Ұлы Дала, 45',
    district: 'Район EXPO и Ботанического сада',
    phonePrimary: '+7 (778) 422-11-00',
    phoneSecondary: '+7 (775) 038-00-02',
    phoneCall: '+77784221100',
    whatsappNumber: '77784221100',
    instagram: '@meatpoint.astana',
    hours: 'Круглосуточно (24/7, без выходных)',
    rating: 4.4,
    reviewCount: 780,
    averageCheck: 7000,
    businessLunchPrice: 4290,
    coordinates: { lat: 51.0906, lng: 71.4184 },
    team: [
      { name: 'Kamza Asset', role: 'Frontend Architect & UI Lead' },
      { name: 'Tangzharyk', role: 'Product Engineer & Interactive Systems' }
    ],
    university: 'Astana IT University',
    group: 'SE-2532'
  };

  const MENU_CATEGORIES = [
    { id: 'all', name: 'Все блюда' },
    { id: 'steaks', name: 'Стейки и гриль' },
    { id: 'kebabs', name: 'Кебабы и мангал' },
    { id: 'burgers-mains', name: 'Бургеры и горячее' },
    { id: 'soups-meze', name: 'Супы и закуски' },
    { id: 'desserts-drinks', name: 'Десерты и напитки' }
  ];

  const DONENESS_OPTIONS = [
    { id: 'rare', name: 'Rare', temp: '48–52°C', label: 'Слабая обжарка, выраженный красный сок' },
    { id: 'medium-rare', name: 'Medium Rare', temp: '54–57°C', label: 'Оптимальный баланс сочности и текстуры' },
    { id: 'medium', name: 'Medium', temp: '60–63°C', label: 'Средняя обжарка, розовое мясо по центру' },
    { id: 'medium-well', name: 'Medium Well', temp: '65–68°C', label: 'Почти полная прожарка, светлый сок' },
    { id: 'well-done', name: 'Well Done', temp: '70°C+', label: 'Глубокая прожарка без розовых волокон' }
  ];

  const SIDE_OPTIONS = [
    { id: 'baked-potato', name: 'Запеченный картофель с розмарином', price: 0 },
    { id: 'grilled-veg', name: 'Овощи на углях: цукини, томаты, сладкий перец', price: 0 },
    { id: 'turkish-rice', name: 'Турецкий рис шехрие', price: 0 },
    { id: 'french-fries', name: 'Картофель фри с паприкой', price: 0 }
  ];

  const MENU_ITEMS = [
    // 1. Стейки и гриль
    {
      id: 'steak-ribeye',
      name: 'Рибай стейк (Ribeye Steak)',
      category: 'steaks',
      price: 9800,
      weight: '350 г',
      isSteak: true,
      tags: ['hit', 'chef', 'halal'],
      tagLabels: ['Хит продаж', 'Выбор шефа', '100% Halal'],
      description: 'Мраморная говядина зернового откорма. Сухое вызревание 21 день в соляной камере, обжарка на березовых углях.',
      image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80',
      calories: '720 ккал',
      prepTime: '20-25 мин'
    },
    {
      id: 'steak-tbone',
      name: 'Тибон стейк (T-Bone Steak)',
      category: 'steaks',
      price: 10500,
      weight: '400 г',
      isSteak: true,
      tags: ['chef', 'halal'],
      tagLabels: ['Премиум', '100% Halal'],
      description: 'Отруб на Т-образной кости, соединяющий нежное филе-миньон и насыщенный стриплойн. Обжарка на открытом огне.',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      calories: '810 ккал',
      prepTime: '22-26 мин'
    },
    {
      id: 'steak-dallas',
      name: 'Даллас стейк на кости (Dallas Steak)',
      category: 'steaks',
      price: 11900,
      weight: '450 г',
      isSteak: true,
      tags: ['premium', 'halal'],
      tagLabels: ['Эксклюзив', '100% Halal'],
      description: 'Толстый край на зачищенном ребре с высокой степенью мраморности. Насыщенный древесный аромат.',
      image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80',
      calories: '920 ккал',
      prepTime: '25-30 мин'
    },
    {
      id: 'steak-lamb-chops',
      name: 'Каре ягненка на углях (Lamb Chops)',
      category: 'steaks',
      price: 7900,
      weight: '360 г',
      isSteak: true,
      tags: ['hit', 'halal'],
      tagLabels: ['Хит', 'Халяль ягненок'],
      description: 'Ребра молодого ягненка в маринаде из оливкового масла, чеснока, горного чабреца и турецкой зиры.',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      calories: '680 ккал',
      prepTime: '18-22 мин'
    },
    {
      id: 'steak-filet-mignon',
      name: 'Филе-миньон с перечным соусом',
      category: 'steaks',
      price: 8900,
      weight: '280 г',
      isSteak: true,
      tags: ['tender', 'chef'],
      tagLabels: ['Вырезка', 'Сливочный соус'],
      description: 'Центральная часть говяжьей вырезки без жировых прослоек. Подается со сливочным соусом на зеленом дробленом перце.',
      image: 'https://images.unsplash.com/photo-1504973959464-98e0449669e2?auto=format&fit=crop&w=800&q=80',
      calories: '540 ккал',
      prepTime: '18-20 мин'
    },

    // 2. Турецкие кебабы и мангал
    {
      id: 'kebab-adana',
      name: 'Адана-кебаб (Adana Kebap)',
      category: 'kebabs',
      price: 4400,
      weight: '350 г',
      isSteak: false,
      tags: ['hit', 'spicy', 'halal'],
      tagLabels: ['Острое', '100% Halal'],
      description: 'Рубленая баранина и говядина на широком кованом шампуре с острым турецким перцем. Гарнир: булгур, запеченный томат.',
      image: 'images/kebab.png',
      calories: '610 ккал',
      prepTime: '15-18 мин'
    },
    {
      id: 'kebab-urfa',
      name: 'Урфа-кебаб (Urfa Kebap)',
      category: 'kebabs',
      price: 4400,
      weight: '350 г',
      isSteak: false,
      tags: ['halal', 'mild'],
      tagLabels: ['Мягкий вкус', '100% Halal'],
      description: 'Рубленое мясо с анатолийскими специями без кайенского перца. Обжарка на мангале, подача с булгуром.',
      image: 'images/menu1.jpg',
      calories: '590 ккал',
      prepTime: '15-18 мин'
    },
    {
      id: 'kebab-beyti',
      name: 'Бейти-кебаб в лаваше с йогуртом',
      category: 'kebabs',
      price: 5200,
      weight: '400 г',
      isSteak: false,
      tags: ['hit', 'chef'],
      tagLabels: ['Хит Meat Point', 'Сюзьме-йогурт'],
      description: 'Кебаб с мангала в тонком лаваше. Порционная подача с горячим томатным соусом, топленым маслом и сюзьме-йогуртом.',
      image: 'images/menu2.jpg',
      calories: '710 ккал',
      prepTime: '20 мин'
    },
    {
      id: 'kebab-iskender',
      name: 'Искендер-кебаб на подушке из питы',
      category: 'kebabs',
      price: 5400,
      weight: '420 г',
      isSteak: false,
      tags: ['tradition', 'halal'],
      tagLabels: ['Рецепт Бурсы', '100% Halal'],
      description: 'Тонкие ломтики мяса на кубиках теплой питы. Пряный томатный соус, горячее топленое сливочное масло и йогурт.',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
      calories: '780 ккал',
      prepTime: '18-20 мин'
    },
    {
      id: 'kebab-platter',
      name: 'Ассорти шашлыков «Meat Point Мезе Гриль»',
      category: 'kebabs',
      price: 22900,
      weight: '1400 г',
      isSteak: false,
      tags: ['party', 'hit', 'halal'],
      tagLabels: ['На 4 персоны', '100% Halal'],
      description: 'Сет на компанию: Адана-кебаб, Урфа-кебаб, каре ягненка, шашлык из телятины, куриные крылья, овощи гриль и лепешки пуф-экмек.',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      calories: '2400 ккал',
      prepTime: '30-35 мин'
    },

    // 3. Бургеры и горячее
    {
      id: 'burger-meatpoint',
      name: 'Фирменный бургер Meat Point',
      category: 'burgers-mains',
      price: 3900,
      weight: '380 г',
      isSteak: false,
      tags: ['hit', 'halal'],
      tagLabels: ['Хит', 'Мраморная говядина'],
      description: 'Котлета из мраморной говядины с углей, двойной чеддер, карамелизированный лук, соленый огурец, копченый соус.',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      calories: '860 ккал',
      prepTime: '15-18 мин'
    },
    {
      id: 'main-lokum',
      name: 'Локум из телятины (Veal Lokum)',
      category: 'burgers-mains',
      price: 7400,
      weight: '320 г',
      isSteak: true,
      tags: ['chef', 'premium'],
      tagLabels: ['Нежная телятина', 'Сливочное масло'],
      description: 'Тонкие медальоны из телячьей вырезки, обжаренные на натуральном сливочном масле.',
      image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80',
      calories: '590 ккал',
      prepTime: '15 мин'
    },
    {
      id: 'main-business-lunch',
      name: 'Бизнес-ланч дня (Суп, Горячее, Салат, Чай)',
      category: 'burgers-mains',
      price: 4290,
      weight: '650 г',
      isSteak: false,
      tags: ['lunch', 'hit'],
      tagLabels: ['Пн-Пт 12:00-15:00', 'Фиксированная цена'],
      description: 'По будням с 12:00 до 15:00: суп Мерджимек, кебаб с рисом шехрие, салат Чобан и свежий турецкий чай в армуде.',
      image: 'https://images.unsplash.com/photo-1547496502-affa22d38842?auto=format&fit=crop&w=800&q=80',
      calories: '750 ккал',
      prepTime: '10-12 мин'
    },

    // 4. Супы и закуски (Мезе)
    {
      id: 'soup-mercimek',
      name: 'Чечевичный крем-суп (Mercimek Çorbası)',
      category: 'soups-meze',
      price: 1800,
      weight: '300 г',
      isSteak: false,
      tags: ['vegetarian', 'hit'],
      tagLabels: ['Вегетарианское', 'Красная чечевица'],
      description: 'Суп из анатолийской красной чечевицы с сушеной мятой, папричным топленым маслом и долькой лимона.',
      image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
      calories: '260 ккал',
      prepTime: '8-10 мин'
    },
    {
      id: 'meze-hummus',
      name: 'Хумус классический с теплой питой',
      category: 'soups-meze',
      price: 2100,
      weight: '240 г',
      isSteak: false,
      tags: ['vegetarian', 'halal'],
      tagLabels: ['Нут и тахини', 'Оливковое масло'],
      description: 'Паста из отварного нута, кунжутной пасты тахини, чеснока и оливкового масла холодного отжима. Теплая пита.',
      image: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=800&q=80',
      calories: '340 ккал',
      prepTime: '5 мин'
    },
    {
      id: 'salad-choban',
      name: 'Салат «Чобан» с брынзой (Çoban Salatası)',
      category: 'soups-meze',
      price: 2400,
      weight: '280 г',
      isSteak: false,
      tags: ['vegetarian', 'fresh'],
      tagLabels: ['Свежие овощи', 'Сыр брынза'],
      description: 'Огурцы, спелые томаты, сладкий перец, красный лук, петрушка и слабосоленая брынза. Заправка: оливковое масло.',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      calories: '210 ккал',
      prepTime: '7 мин'
    },
    {
      id: 'bread-puf',
      name: 'Свежая лепешка Пуф-экмек (Puf Ekmek)',
      category: 'soups-meze',
      price: 900,
      weight: '180 г',
      isSteak: false,
      tags: ['bakery', 'hot'],
      tagLabels: ['Каменная печь', 'Кунжут'],
      description: 'Воздушная куполообразная лепешка прямо из каменной печи, посыпанная белым и черным кунжутом.',
      image: 'images/menu3.jpg',
      calories: '320 ккал',
      prepTime: '8 мин'
    },

    // 5. Десерты и напитки
    {
      id: 'dessert-kunefe',
      name: 'Горячий Кюнефе с сыром и фисташками',
      category: 'desserts-drinks',
      price: 3400,
      weight: '220 г',
      isSteak: false,
      tags: ['hit', 'sweet'],
      tagLabels: ['Хатайский сыр', 'Антепские фисташки'],
      description: 'Хрустящее тесто кадаиф с несоленым хатайским сыром в сиропе, посыпанное тертыми антепскими фисташками.',
      image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80',
      calories: '580 ккал',
      prepTime: '15 мин'
    },
    {
      id: 'dessert-baklava',
      name: 'Пахлава фисташковая с мороженым Мараш',
      category: 'desserts-drinks',
      price: 3200,
      weight: '200 г',
      isSteak: false,
      tags: ['hit', 'sweet'],
      tagLabels: ['Тесто филло', 'Мороженое Мараш'],
      description: 'Тонкие слои теста филло с начинкой из тертых фисташек. Шарик тягучего турецкого мороженого dondurma.',
      image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=800&q=80',
      calories: '520 ккал',
      prepTime: '5 мин'
    },
    {
      id: 'drink-ayran',
      name: 'Домашний Айран с мятой',
      category: 'desserts-drinks',
      price: 950,
      weight: '300 мл',
      isSteak: false,
      tags: ['drink', 'halal'],
      tagLabels: ['Освежающий', 'С мятой'],
      description: 'Кисломолочный напиток из натурального турецкого йогурта с добавлением щепотки морской соли и свежей мяты.',
      image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
      calories: '110 ккал',
      prepTime: '3 мин'
    },
    {
      id: 'drink-turkish-tea',
      name: 'Турецкий чай в армудах (чайник на двоих)',
      category: 'desserts-drinks',
      price: 1600,
      weight: '800 мл',
      isSteak: false,
      tags: ['drink', 'tea'],
      tagLabels: ['Чай Ризе', 'Армуды'],
      description: 'Черный чай двухъярусного заваривания из провинции Ризе. Подается в стеклянных стаканчиках-армудах.',
      image: 'images/tea.png',
      calories: '5 ккал',
      prepTime: '5 мин'
    },
    {
      id: 'drink-lemonade',
      name: 'Лимонад манго-маракуйя',
      category: 'desserts-drinks',
      price: 2200,
      weight: '450 мл',
      isSteak: false,
      tags: ['drink', 'ice'],
      tagLabels: ['Манго и маракуйя', 'Лед'],
      description: 'Натуральное пюре манго, сок маракуйи, веточка розмарина, содовая и кусковой лед.',
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
      calories: '160 ккал',
      prepTime: '5 мин'
    }
  ];

  window.MeatPointMenu = {
    info: RESTAURANT_INFO,
    categories: MENU_CATEGORIES,
    donenessList: DONENESS_OPTIONS,
    sidesList: SIDE_OPTIONS,
    items: MENU_ITEMS,
    getById: function (id) {
      return MENU_ITEMS.find(function (item) { return item.id === id; }) || null;
    },
    getByCategory: function (catId) {
      if (!catId || catId === 'all') return MENU_ITEMS;
      return MENU_ITEMS.filter(function (item) { return item.category === catId; });
    },
    formatPrice: function (amount) {
      const num = Number(amount) || 0;
      return new Intl.NumberFormat('ru-RU').format(Math.round(num)) + ' ₸';
    }
  };
})(window);
