const https = require('https');
const http = require('http');

const BASE_URL = 'https://con-dfr-web-production.up.railway.app';

// Store session cookie
let sessionCookie = '';

// Helper function to make HTTP requests
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionCookie
      }
    };

    const req = https.request(options, (res) => {
      // Capture session cookie
      if (res.headers['set-cookie']) {
        sessionCookie = res.headers['set-cookie'][0].split(';')[0];
      }

      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Login function
async function login() {
  console.log('Logging in...');
  const result = await makeRequest('POST', '/api/login', {
    username: 'admin',
    password: 'Congress@2025!Secure'
  });
  
  if (result.status === 200 && result.data.success) {
    console.log('Login successful!');
    return true;
  } else {
    console.error('Login failed:', result.data);
    return false;
  }
}

// Partner organizations from con-dfr.org
const partners = [
  {
    name_en: 'Hamnava Umbrella Group',
    name_fa: 'گروه چتری همنوا',
    partner_type: 'organization',
    website_url: 'http://hamnava.org',
    image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/68966f13bc950e2457719d95_Hamnava-p-500.png',
    description_en: 'Hamnava is an umbrella organization working for democracy in Iran.',
    description_fa: 'همنوا یک سازمان چتری است که برای دموکراسی در ایران فعالیت می‌کند.'
  },
  {
    name_en: 'Dana Research Society',
    name_fa: 'انجمن پژوهشی دانا',
    partner_type: 'organization',
    website_url: 'https://www.danasociety.org/',
    image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/photo_2026-01-02_19-04-17.jpg',
    description_en: 'Dana Research Society is dedicated to research and education for a democratic Iran.',
    description_fa: 'انجمن پژوهشی دانا به تحقیق و آموزش برای ایران دموکراتیک اختصاص دارد.'
  },
  {
    name_en: 'Group 25 Shahrivar',
    name_fa: 'گروه ۲۵ شهریور',
    partner_type: 'organization',
    website_url: 'https://group25shahrivar.org/',
    image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/Mlogo-3.png',
    description_en: 'Group 25 Shahrivar advocates for democratic change in Iran.',
    description_fa: 'گروه ۲۵ شهریور برای تغییر دموکراتیک در ایران فعالیت می‌کند.'
  },
  {
    name_en: 'Democratic Turkmens of Iran',
    name_fa: 'ترکمن‌های دموکرات ایران',
    partner_type: 'organization',
    website_url: '',
    image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/photo_2026-01-02_19-04-08.jpg',
    description_en: 'Democratic Turkmens of Iran represents the Turkmen community in the democratic movement.',
    description_fa: 'ترکمن‌های دموکرات ایران نماینده جامعه ترکمن در جنبش دموکراتیک است.'
  },
  {
    name_en: 'Azerbaijan Democrat Party',
    name_fa: 'حزب دموکرات آذربایجان',
    partner_type: 'organization',
    website_url: 'https://adparty.org/',
    image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/photo_2026-01-02_19-03-33.jpg',
    description_en: 'Azerbaijan Democrat Party works for democracy and regional autonomy.',
    description_fa: 'حزب دموکرات آذربایجان برای دموکراسی و خودمختاری منطقه‌ای فعالیت می‌کند.'
  },
  {
    name_en: 'Ahwaz Assembly',
    name_fa: 'تجمع احواز',
    partner_type: 'organization',
    website_url: 'https://ahwaziassembly.org/',
    image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/photo_2026-01-02_19-03-55.jpg',
    description_en: 'Ahwaz Assembly represents the Ahwazi Arab community in the democratic movement.',
    description_fa: 'تجمع احواز نماینده جامعه عرب اهوازی در جنبش دموکراتیک است.'
  },
  {
    name_en: 'No to Execution Campaign',
    name_fa: 'گروه نه به اعدام',
    partner_type: 'organization',
    website_url: 'https://linktr.ee/notoexecutioncampaign',
    image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/NoToExecution.png',
    description_en: 'No to Execution Campaign advocates against capital punishment in Iran.',
    description_fa: 'گروه نه به اعدام علیه مجازات اعدام در ایران فعالیت می‌کند.'
  },
  {
    name_en: 'Bakhtiari Unity Party',
    name_fa: 'حزب اتحاد بختیاری',
    partner_type: 'organization',
    website_url: 'https://www.instagram.com/etehad_bakhtiari/',
    image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/photo_2026-01-05_18-44-57-977x1024.jpg',
    description_en: 'Bakhtiari Unity Party represents the Bakhtiari community in the democratic movement.',
    description_fa: 'حزب اتحاد بختیاری نماینده جامعه بختیاری در جنبش دموکراتیک است.'
  },
  {
    name_en: 'Azerbaijan Democratic Faction',
    name_fa: 'فرقه دموکرات آذربایجان',
    partner_type: 'organization',
    website_url: 'https://adfmk.com/',
    image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/photo_2026-01-05_18-44-41.jpg',
    description_en: 'Azerbaijan Democratic Faction works for democracy and rights in Azerbaijan region.',
    description_fa: 'فرقه دموکرات آذربایجان برای دموکراسی و حقوق در منطقه آذربایجان فعالیت می‌کند.'
  },
  {
    name_en: 'Iranian Republicans of Australia (YAR)',
    name_fa: 'گروه ایرانیان جمهوری خواه استرالیا (یار)',
    partner_type: 'organization',
    website_url: 'https://linktr.ee/IAR.Official',
    image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/Screenshot-2026-01-15-221103.png',
    description_en: 'Iranian Republicans of Australia supports democratic change in Iran from Australia.',
    description_fa: 'ایرانیان جمهوری خواه استرالیا از استرالیا از تغییر دموکراتیک در ایران حمایت می‌کند.'
  },
  {
    name_en: 'Woman Life Freedom Association Graz',
    name_fa: 'انجمن زن زندگی آزادی گراتس',
    partner_type: 'organization',
    website_url: 'https://woman-life-freedom.at/',
    image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/WLF-Austria.png',
    description_en: 'Woman Life Freedom Association Graz supports the women\'s movement in Iran.',
    description_fa: 'انجمن زن زندگی آزادی گراتس از جنبش زنان در ایران حمایت می‌کند.'
  },
  {
    name_en: 'Azerbaijan Democracy and Development Center',
    name_fa: 'کانون دموکراسی و توسعه آذربایجان',
    partner_type: 'organization',
    website_url: 'https://azdemocracy.org/',
    image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/photo_2026-01-02_19-04-22.jpg',
    description_en: 'Azerbaijan Democracy and Development Center promotes democracy in the Azerbaijan region.',
    description_fa: 'کانون دموکراسی و توسعه آذربایجان دموکراسی را در منطقه آذربایجان ترویج می‌کند.'
  },
  {
    name_en: 'Iranian Republicans Convergence',
    name_fa: 'همگرایی جمهوری خواهان ایران',
    partner_type: 'organization',
    website_url: 'https://www.instagram.com/hamgerayeejomhoori/',
    image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/Hamgerayi.png',
    description_en: 'Iranian Republicans Convergence brings together republican forces for a democratic Iran.',
    description_fa: 'همگرایی جمهوری خواهان ایران نیروهای جمهوری‌خواه را برای ایران دموکراتیک گرد هم می‌آورد.'
  },
  {
    name_en: 'Toronto Iranian Republicans Association (TIRA)',
    name_fa: 'انجمن ایرانیان جمهوری خواه تورنتو',
    partner_type: 'organization',
    website_url: 'https://www.instagram.com/tira4iran',
    image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/TIRA-1003x1024.png',
    description_en: 'Toronto Iranian Republicans Association supports democratic change from Canada.',
    description_fa: 'انجمن ایرانیان جمهوری خواه تورنتو از کانادا از تغییر دموکراتیک حمایت می‌کند.'
  },
  {
    name_en: 'United for Iran Australia',
    name_fa: 'اتحاد برای ایران استرالیا',
    partner_type: 'organization',
    website_url: 'https://www.instagram.com/unitedforiranaustralia/',
    image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/434641411_356248903413056_4836227175912321910_n.jpg',
    description_en: 'United for Iran Australia advocates for human rights and democracy in Iran.',
    description_fa: 'اتحاد برای ایران استرالیا برای حقوق بشر و دموکراسی در ایران فعالیت می‌کند.'
  },
  {
    name_en: 'Iranian Republicans of Southern Sweden',
    name_fa: 'کانون ایرانیان جمهوری خواه جنوب سوئد',
    partner_type: 'organization',
    website_url: 'https://linktr.ee/Iranian.republicans.sweden',
    image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/Prorepublicans-1024x1024.png',
    description_en: 'Iranian Republicans of Southern Sweden supports democratic change from Sweden.',
    description_fa: 'کانون ایرانیان جمهوری خواه جنوب سوئد از سوئد از تغییر دموکراتیک حمایت می‌کند.'
  },
  {
    name_en: 'Rahe Farda Group',
    name_fa: 'گروه راه فردا',
    partner_type: 'organization',
    website_url: 'https://www.instagram.com/rahefarda.group/',
    image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/Rahe-Farda.png',
    description_en: 'Rahe Farda Group works for a democratic future for Iran.',
    description_fa: 'گروه راه فردا برای آینده دموکراتیک ایران فعالیت می‌کند.'
  },
  {
    name_en: 'Iran Democratic Left Party',
    name_fa: 'حزب دموکرات چپ ایران',
    partner_type: 'organization',
    website_url: 'https://www.bepish.org/fa',
    image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/6199645014309145353-1024x1024.jpg',
    description_en: 'Iran Democratic Left Party advocates for social democracy in Iran.',
    description_fa: 'حزب دموکرات چپ ایران برای سوسیال دموکراسی در ایران فعالیت می‌کند.'
  },
  {
    name_en: 'Mahsa Foundation',
    name_fa: 'گروه بنیاد مهسا',
    partner_type: 'organization',
    website_url: 'https://linktr.ee/mahsafoundation',
    image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/Mahsa.png',
    description_en: 'Mahsa Foundation honors the memory of Mahsa Amini and supports the women\'s movement.',
    description_fa: 'بنیاد مهسا یاد مهسا امینی را گرامی می‌دارد و از جنبش زنان حمایت می‌کند.'
  },
  // Individual members
  {
    name_en: 'Hassan Shariatmadari',
    name_fa: 'حسن شریعتمداری',
    partner_type: 'individual',
    website_url: '',
    image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/openart-image_db9xIKps_1766540652029_raw-1024x1024.jpg',
    description_en: 'Republican and Federalist Politician - Germany',
    description_fa: 'سیاستمدار جمهوریخواه و فدرالیست - آلمان'
  },
  {
    name_en: 'Reza Moridi',
    name_fa: 'رضا مریدی',
    partner_type: 'individual',
    website_url: '',
    image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/openart-image_db9xIKps_1766540652029_raw-1024x1024.jpg',
    description_en: 'Republican and Federalist Politician - Canada',
    description_fa: 'سیاستمدار جمهوریخواه و فدرالیست - کانادا'
  },
  {
    name_en: 'Alan Ekbatani',
    name_fa: 'آلن اکباتانی',
    partner_type: 'individual',
    website_url: '',
    image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/openart-image_db9xIKps_1766540652029_raw-1024x1024.jpg',
    description_en: 'Independent Activist and Researcher - USA',
    description_fa: 'کنشگر و پژوهشگر مستقل - آمریکا'
  },
  {
    name_en: 'Mehdi Ansari',
    name_fa: 'مهدی انصاری',
    partner_type: 'individual',
    website_url: '',
    image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/openart-image_db9xIKps_1766540652029_raw-1024x1024.jpg',
    description_en: 'Political Activist and Federal Republican - Germany',
    description_fa: 'فعال سیاسی و جمهوری‌خواه فدرال - آلمان'
  }
];

// Hero images
const heroImages = [
  {
    image_url: '/images/hero/hero1.png',
    title_en: 'Congress of Democratic & Federalist Republicans',
    title_fa: 'کنگره مشترک جمهوری خواهان دموکرات و فدرال دموکرات',
    subtitle_en: 'For freedom, justice, equality, and the distribution of power in the future of Iran',
    subtitle_fa: 'برای آزادی، عدالت، برابری شهروندی و توزیع قدرت در ایران آینده',
    display_order: 1,
    is_active: true
  },
  {
    image_url: 'https://con-dfr.org/wp-content/uploads/2026/01/ap22295557118668-f885dccf941fcda7f93c9bde311371fff5b7e73d.jpg',
    title_en: 'United for Democracy',
    title_fa: 'متحد برای دموکراسی',
    subtitle_en: 'Organizations and individuals working together for a democratic Iran',
    subtitle_fa: 'سازمان‌ها و افراد در کنار هم برای ایران دموکراتیک',
    display_order: 2,
    is_active: true
  }
];

async function addPartners() {
  console.log('\n--- Adding Partners ---');
  for (let i = 0; i < partners.length; i++) {
    const partner = partners[i];
    try {
      const result = await makeRequest('POST', '/api/admin/partners', partner);
      if (result.status === 200 || result.status === 201) {
        console.log(`✓ Added partner: ${partner.name_en}`);
      } else {
        console.log(`✗ Failed to add partner ${partner.name_en}: ${JSON.stringify(result.data)}`);
      }
    } catch (err) {
      console.error(`Error adding partner ${partner.name_en}:`, err.message);
    }
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

async function addHeroImages() {
  console.log('\n--- Adding Hero Images ---');
  for (const hero of heroImages) {
    try {
      const result = await makeRequest('POST', '/api/admin/hero-images', hero);
      if (result.status === 200 || result.status === 201) {
        console.log(`✓ Added hero image: ${hero.title_en}`);
      } else {
        console.log(`✗ Failed to add hero image ${hero.title_en}: ${JSON.stringify(result.data)}`);
      }
    } catch (err) {
      console.error(`Error adding hero image ${hero.title_en}:`, err.message);
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

async function main() {
  console.log('Starting production data population...');
  console.log('Target:', BASE_URL);
  
  const loggedIn = await login();
  if (!loggedIn) {
    console.error('Failed to login. Exiting.');
    process.exit(1);
  }
  
  await addPartners();
  await addHeroImages();
  
  console.log('\n--- Done! ---');
}

main().catch(console.error);