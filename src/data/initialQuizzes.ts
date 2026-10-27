import { Quiz } from '../types/quiz';

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz-general-knowledge-01',
    title: 'Grand General Knowledge Championship',
    titleTa: 'பெரும் பொது அறிவுப் போட்டி',
    description: 'Test your acumen across world geography, science, art, and iconic global landmarks.',
    descriptionTa: 'உலக புவியியல், அறிவியல், கலை மற்றும் உலகப் புகழ்பெற்ற சின்னங்கள் பற்றிய வினாடி வினா.',
    category: 'generalKnowledge',
    coverImage: '/src/assets/images/quiz_stage_arena_1793097861150.jpg',
    createdBy: 'admin-1',
    authorName: 'Master Host',
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
    isPublished: true,
    timesPlayed: 142,
    questions: [
      {
        id: 'q-gk-1',
        text: 'Which planet in our solar system has the most confirmed natural moons?',
        textTa: 'நமது சூரிய குடும்பத்தில் அதிக நிலவுகளைக் கொண்ட கோள் எது?',
        type: 'mcq',
        timeLimit: 20,
        points: 1000,
        options: [
          { id: 'opt-1-1', text: 'Jupiter', textTa: 'வியாழன் (Jupiter)', isCorrect: false },
          { id: 'opt-1-2', text: 'Saturn', textTa: 'சனி (Saturn)', isCorrect: true },
          { id: 'opt-1-3', text: 'Neptune', textTa: 'நெப்டியூன் (Neptune)', isCorrect: false },
          { id: 'opt-1-4', text: 'Uranus', textTa: 'யுரேனஸ் (Uranus)', isCorrect: false },
        ],
        explanation: 'Saturn has over 140 confirmed natural satellites, surpassing Jupiter in recent astronomical counts.',
        explanationTa: 'சனி கோளுக்கு 140-க்கும் மேற்பட்ட உறுதிப்படுத்தப்பட்ட நிலவுகள் உள்ளன, இது வியாழனை விட அதிகம்.'
      },
      {
        id: 'q-gk-2',
        text: 'The historic Thanjavur Brihadisvara Temple in Tamil Nadu was commissioned by which Chola Emperor?',
        textTa: 'தஞ்சை பிரகதீஸ்வரர் (பெரிய) கோயிலைக் கட்டிய சோழப் பேரரசர் யார்?',
        type: 'mcq',
        timeLimit: 20,
        points: 1000,
        options: [
          { id: 'opt-2-1', text: 'Rajendra Chola I', textTa: 'முதலாம் இராஜேந்திர சோழன்', isCorrect: false },
          { id: 'opt-2-2', text: 'Raja Raja Chola I', textTa: 'முதலாம் இராஜராஜ சோழன்', isCorrect: true },
          { id: 'opt-2-3', text: 'Kulothunga Chola I', textTa: 'முதலாம் குலோத்துங்க சோழன்', isCorrect: false },
          { id: 'opt-2-4', text: 'Karikala Chola', textTa: 'கரிகால சோழன்', isCorrect: false },
        ],
        explanation: 'Raja Raja Chola I built the Great Living Chola Temple in Thanjavur, completed circa 1010 CE.',
        explanationTa: 'கி.பி 1010-ல் முதலாம் இராஜராஜ சோழன் தஞ்சை பெரிய கோவிலைக் கட்டி முடித்தார்.'
      },
      {
        id: 'q-gk-3',
        text: 'True or False: Sound travels faster through water than through air.',
        textTa: 'சரியா / தவறா: ஒலி காற்றில் பரவுவதை விட தண்ணீரில் வேகமாகப் பரவுகிறது.',
        type: 'trueFalse',
        timeLimit: 15,
        points: 1000,
        options: [
          { id: 'opt-3-1', text: 'True', textTa: 'சரி (True)', isCorrect: true },
          { id: 'opt-3-2', text: 'False', textTa: 'தவறு (False)', isCorrect: false },
        ],
        explanation: 'Due to greater density and elasticity of water, sound travels nearly 4.3 times faster in water than in air.',
        explanationTa: 'நீரின் அடர்த்தி காரணமாக, ஒலி காற்றில் பரவுவதை விட தண்ணீரில் சுமார் 4.3 மடங்கு வேகமாகப் பரவுகிறது.'
      },
      {
        id: 'q-gk-4',
        text: 'Which chemical element has the atomic number 79 and symbol "Au"?',
        textTa: 'அணு எண் 79 மற்றும் குறியீடு "Au" கொண்ட தனிமம் எது?',
        type: 'mcq',
        timeLimit: 20,
        points: 1000,
        imageUrl: '/src/assets/images/quiz_trophy_gold_1793097861082.jpg',
        options: [
          { id: 'opt-4-1', text: 'Silver (Argentum)', textTa: 'வெள்ளி (Silver)', isCorrect: false },
          { id: 'opt-4-2', text: 'Gold (Aurum)', textTa: 'தங்கம் (Gold)', isCorrect: true },
          { id: 'opt-4-3', text: 'Platinum', textTa: 'பிளாட்டினம் (Platinum)', isCorrect: false },
          { id: 'opt-4-4', text: 'Copper (Cuprum)', textTa: 'செம்பு (Copper)', isCorrect: false },
        ],
        explanation: 'Au comes from the Latin word "Aurum", which designates Gold.',
        explanationTa: 'Au என்பது இலத்தீன் சொல்லான "Aurum" என்பதிலிருந்து பெறப்பட்டது, இது தங்கத்தைக் குறிக்கிறது.'
      },
      {
        id: 'q-gk-5',
        text: 'Which of the following countries are permanent members of the United Nations Security Council (UNSC)?',
        textTa: 'ஐக்கிய நாடுகள் பாதுகாப்பு கவுன்சிலின் (UNSC) நிரந்தர உறுப்பினர்களாக உள்ள நாடுகள் எவை? (Select all that apply)',
        type: 'multiSelect',
        timeLimit: 25,
        points: 1200,
        options: [
          { id: 'opt-5-1', text: 'France', textTa: 'பிரான்ஸ் (France)', isCorrect: true },
          { id: 'opt-5-2', text: 'United Kingdom', textTa: 'ஐக்கிய இராச்சியம் (UK)', isCorrect: true },
          { id: 'opt-5-3', text: 'Japan', textTa: 'ஜப்பான் (Japan)', isCorrect: false },
          { id: 'opt-5-4', text: 'Germany', textTa: 'ஜெர்மனி (Germany)', isCorrect: false },
        ],
        explanation: 'The UNSC permanent five (P5) are USA, UK, France, Russia, and China.',
        explanationTa: 'ஐ.நா.வின் 5 நிரந்தர உறுப்பு நாடுகள்: அமெரிக்கா, இங்கிலாந்து, பிரான்ஸ், ரஷ்யா, சீனா.'
      }
    ]
  },
  {
    id: 'quiz-bible-history-02',
    title: 'The Great Bible Quiz & Ancient Wisdom',
    titleTa: 'விவிலிய வினாடி வினா & பண்டைய ஞானம்',
    description: 'Engaging, thoughtful questions covering inspiring Old and New Testament events, personalities, and scriptures.',
    descriptionTa: 'பழைய மற்றும் புதிய ஏற்பாட்டின் முக்கிய நிகழ்வுகள், ஆளுமைகள் மற்றும் வேத வசனங்கள் பற்றிய சிறப்பான வினாடி வினா.',
    category: 'bibleQuiz',
    coverImage: '/src/assets/images/quiz_bible_history_1793097861679.jpg',
    createdBy: 'admin-1',
    authorName: 'Grace Scholar',
    createdAt: '2026-03-02T11:00:00Z',
    updatedAt: '2026-03-02T11:00:00Z',
    isPublished: true,
    timesPlayed: 98,
    questions: [
      {
        id: 'q-bq-1',
        text: 'How many books are there in the standard Protestant Bible (Old + New Testament)?',
        textTa: 'பரிசுத்த வேதாகமத்தில் உள்ள மொத்த புத்தகங்களின் எண்ணிக்கை எத்தனை? (பழைய + புதிய ஏற்பாடு)',
        type: 'mcq',
        timeLimit: 20,
        points: 1000,
        imageUrl: '/src/assets/images/quiz_bible_history_1793097861679.jpg',
        options: [
          { id: 'opt-bq-1-1', text: '66 Books (39 OT + 27 NT)', textTa: '66 புத்தகங்கள் (39 பழைய + 27 புதிய)', isCorrect: true },
          { id: 'opt-bq-1-2', text: '73 Books', textTa: '73 புத்தகங்கள்', isCorrect: false },
          { id: 'opt-bq-1-3', text: '60 Books', textTa: '60 புத்தகங்கள்', isCorrect: false },
          { id: 'opt-bq-1-4', text: '70 Books', textTa: '70 புத்தகங்கள்', isCorrect: false },
        ],
        explanation: 'The Protestant canon includes 39 books in the Old Testament and 27 in the New Testament, totalling 66.',
        explanationTa: 'பழைய ஏற்பாட்டில் 39 மற்றும் புதிய ஏற்பாட்டில் 27 என மொத்தம் 66 புத்தகங்கள் உள்ளன.'
      },
      {
        id: 'q-bq-2',
        text: 'On which mount did Moses receive the Ten Commandments according to Exodus?',
        textTa: 'யாத்திராகமத்தின்படி, மோசே பத்துக் கட்டளைகளைப் பெற்ற மலை எது?',
        type: 'mcq',
        timeLimit: 20,
        points: 1000,
        options: [
          { id: 'opt-bq-2-1', text: 'Mount Carmel', textTa: 'கர்மேல் மலை (Mount Carmel)', isCorrect: false },
          { id: 'opt-bq-2-2', text: 'Mount Sinai / Horeb', textTa: 'சீனாய் மலை (Mount Sinai)', isCorrect: true },
          { id: 'opt-bq-2-3', text: 'Mount Ararat', textTa: 'அரராத் மலை (Mount Ararat)', isCorrect: false },
          { id: 'opt-bq-2-4', text: 'Mount Nebo', textTa: 'நேபோ மலை (Mount Nebo)', isCorrect: false },
        ],
        explanation: 'Moses received the stone tablets written with the finger of God on Mount Sinai.',
        explanationTa: 'சீனாய் மலையில் கடவுளின் கைவிரலால் எழுதப்பட்ட கற்பலகைகளை மோசே பெற்றார்.'
      },
      {
        id: 'q-bq-3',
        text: 'What was the profession of the Apostle Matthew before answering the call to follow Jesus?',
        textTa: 'இயேசுவைப் பின்பற்றுவதற்கு முன், அப்போஸ்தலனாகிய மத்தேயுவின் தொழில் என்னவாக இருந்தது?',
        type: 'mcq',
        timeLimit: 20,
        points: 1000,
        options: [
          { id: 'opt-bq-3-1', text: 'Fisherman', textTa: 'மீன்பிடிப்பவர் (Fisherman)', isCorrect: false },
          { id: 'opt-bq-3-2', text: 'Tax Collector (Publican)', textTa: 'வரி வசூலிப்பவர் (Tax Collector)', isCorrect: true },
          { id: 'opt-bq-3-3', text: 'Tentmaker', textTa: 'கூடாரம் செய்பவர் (Tentmaker)', isCorrect: false },
          { id: 'opt-bq-3-4', text: 'Carpenter', textTa: 'தச்சர் (Carpenter)', isCorrect: false },
        ],
        explanation: 'Matthew (Levi) sat at the tax collection booth in Capernaum when Jesus called him.',
        explanationTa: 'மத்தேயு கப்பர்நகூமில் ஆயத்துறையில் (வரி அலுவலகத்தில்) அமர்ந்திருந்தார்.'
      },
      {
        id: 'q-bq-4',
        text: 'True or False: The Book of Psalms contains the shortest and the longest chapters in the Bible.',
        textTa: 'சரியா / தவறா: வேதாகமத்தின் மிகக் குறுகிய மற்றும் மிக நீண்ட அதிகாரங்கள் சங்கீத புத்தகத்தில் உள்ளன.',
        type: 'trueFalse',
        timeLimit: 15,
        points: 1000,
        options: [
          { id: 'opt-bq-4-1', text: 'True (Psalm 117 & Psalm 119)', textTa: 'சரி (சங்கீதம் 117 & 119)', isCorrect: true },
          { id: 'opt-bq-4-2', text: 'False', textTa: 'தவறு (False)', isCorrect: false },
        ],
        explanation: 'Psalm 117 has only 2 verses (shortest), while Psalm 119 has 176 verses (longest).',
        explanationTa: 'சங்கீதம் 117-ல் 2 வசனங்கள் (மிகக் குறுகியது) மற்றும் சங்கீதம் 119-ல் 176 வசனங்கள் (மிக நீண்டது) உள்ளன.'
      }
    ]
  },
  {
    id: 'quiz-science-tech-03',
    title: 'Modern Science & Frontier Technology',
    titleTa: 'நவீன அறிவியல் & எதிர்கால தொழில்நுட்பம்',
    description: 'Quantum physics, computer algorithms, artificial intelligence, and space exploration wonders.',
    descriptionTa: 'குவாண்டம் இயற்பியல், கணினி படிநிலைகள், செயற்கை நுண்ணறிவு மற்றும் விண்வெளி ஆய்வுகள்.',
    category: 'scienceTech',
    coverImage: '/src/assets/images/quiz_stage_arena_1793097861150.jpg',
    createdBy: 'admin-1',
    authorName: 'Dr. Alan Turing',
    createdAt: '2026-03-03T14:00:00Z',
    updatedAt: '2026-03-03T14:00:00Z',
    isPublished: true,
    timesPlayed: 76,
    questions: [
      {
        id: 'q-st-1',
        text: 'What is the theoretical quantum unit that can exist as both 0 and 1 simultaneously through superposition?',
        textTa: 'ஒரே நேரத்தில் 0 மற்றும் 1 ஆகிய இரண்டிலும் நிலைபெறும் குவாண்டம் கணினியின் அடிப்படை அலகு எது?',
        type: 'mcq',
        timeLimit: 20,
        points: 1000,
        options: [
          { id: 'opt-st-1-1', text: 'Qubit (Quantum Bit)', textTa: 'க்யூபிட் (Qubit)', isCorrect: true },
          { id: 'opt-st-1-2', text: 'Byte', textTa: 'பைட் (Byte)', isCorrect: false },
          { id: 'opt-st-1-3', text: 'Quark', textTa: 'குவார்க் (Quark)', isCorrect: false },
          { id: 'opt-st-1-4', text: 'Photon Bit', textTa: 'ஃபோட்டான் பிட் (Photon Bit)', isCorrect: false },
        ],
        explanation: 'A qubit utilizes quantum superposition to store and compute complex state vectors simultaneously.',
        explanationTa: 'க்யூபிட் என்பது குவாண்டம் மேலமைவு (superposition) மூலம் ஒரே நேரத்தில் இயங்கும் தகவல் அலகு ஆகும்.'
      },
      {
        id: 'q-st-2',
        text: 'Who is widely regarded as the worlds first computer programmer for writing an algorithm for the Analytical Engine?',
        textTa: 'பகுப்பாய்வு இயந்திரத்திற்காக (Analytical Engine) உலகின் முதல் கணினி நிரலை எழுதியவர் யார்?',
        type: 'mcq',
        timeLimit: 20,
        points: 1000,
        options: [
          { id: 'opt-st-2-1', text: 'Ada Lovelace', textTa: 'அடா லவ்லேஸ் (Ada Lovelace)', isCorrect: true },
          { id: 'opt-st-2-2', text: 'Grace Hopper', textTa: 'கிரேஸ் ஹாப்பர் (Grace Hopper)', isCorrect: false },
          { id: 'opt-st-2-3', text: 'Charles Babbage', textTa: 'சார்லஸ் பாபேஜ் (Charles Babbage)', isCorrect: false },
          { id: 'opt-st-2-4', text: 'Nikola Tesla', textTa: 'நிகோலா டெஸ்லா (Nikola Tesla)', isCorrect: false },
        ],
        explanation: 'Ada Lovelace published the first algorithm intended for processing on Babbage’s mechanical computer in 1843.',
        explanationTa: 'அடா லவ்லேஸ் 1843-ல் முதல் கணினி படிமுறையை (algorithm) உருவாக்கினார்.'
      },
      {
        id: 'q-st-3',
        text: 'True or False: Light travels faster through optical fiber glass than it does in a vacuum.',
        textTa: 'சரியா / தவறா: ஒளி வெற்றிடத்தை விட ஆப்டிகல் ஃபைபர் கண்ணாடியில் வேகமாகப் பயணிக்கிறது.',
        type: 'trueFalse',
        timeLimit: 15,
        points: 1000,
        options: [
          { id: 'opt-st-3-1', text: 'True', textTa: 'சரி (True)', isCorrect: false },
          { id: 'opt-st-3-2', text: 'False', textTa: 'தவறு (False - Light is fastest in vacuum)', isCorrect: true },
        ],
        explanation: 'The speed of light "c" is fastest in a vacuum; glass slows it down by roughly 30% due to refraction index.',
        explanationTa: 'வெற்றிடத்தில்தான் ஒளியின் வேகம் மிக அதிகம்; கண்ணாடியில் ஒளிவிலகல் காரணமாக வேகம் குறைகிறது.'
      }
    ]
  }
];
