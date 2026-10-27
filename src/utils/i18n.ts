/**
 * Bilingual Tamil and English Localization Dictionary for QUIZ MASTER.
 * Authentic, culturally natural Tamil translations alongside clean English.
 */

export type Language = 'en' | 'ta';

export interface Translations {
  // Navigation & Branding
  brandName: string;
  tagline: string;
  heroHeadline: string;
  heroSubtitle: string;
  createQuiz: string;
  joinLiveQuiz: string;
  exploreQuizzes: string;
  howItWorks: string;
  features: string;
  pricing: string;
  adminDashboard: string;
  myDashboard: string;
  login: string;
  register: string;
  logout: string;
  profile: string;

  // Live Join
  enterGamePin: string;
  gamePinPlaceholder: string;
  enterYourName: string;
  namePlaceholder: string;
  chooseAvatar: string;
  joinGameButton: string;
  invalidPin: string;
  roomFull: string;
  gameAlreadyStarted: string;

  // Waiting Lobby
  waitingForHost: string;
  playersJoined: string;
  youAreIn: string;
  seeNameOnScreen: string;
  gamePin: string;
  startGame: string;
  copyInviteLink: string;
  inviteCopied: string;
  maxPlayersNotice: string;

  // Host Screen
  question: string;
  of: string;
  timeRemaining: string;
  answersReceived: string;
  nextQuestion: string;
  showCorrectAnswer: string;
  showLeaderboard: string;
  endQuiz: string;
  hostControls: string;

  // Player Screen
  tapToAnswer: string;
  answerSubmitted: string;
  waitingForOtherPlayers: string;
  correct: string;
  incorrect: string;
  timeUp: string;
  pointsEarned: string;
  streakBonus: string;
  currentRank: string;
  totalScore: string;

  // Leaderboard & Winners
  leaderboard: string;
  rank: string;
  player: string;
  score: string;
  speed: string;
  finalPodium: string;
  champion: string;
  runnerUp: string;
  thirdPlace: string;
  playAgain: string;
  backToHome: string;

  // Quiz Creator
  quizCreator: string;
  createNewQuiz: string;
  quizTitle: string;
  quizTitlePlaceholder: string;
  quizDescription: string;
  quizDescPlaceholder: string;
  category: string;
  selectCategory: string;
  questionsCount: string;
  addQuestion: string;
  saveQuiz: string;
  previewQuiz: string;
  questionText: string;
  questionTextPlaceholder: string;
  questionType: string;
  timeLimitSecs: string;
  pointsValue: string;
  imageUrlOptional: string;
  options: string;
  correctAnswer: string;
  optionPlaceholder: string;
  deleteQuestion: string;
  deleteQuiz: string;
  editQuiz: string;
  hostLive: string;

  // Question Types
  mcq: string;
  trueFalse: string;
  multiSelect: string;
  imageQuiz: string;

  // Categories
  generalKnowledge: string;
  bibleQuiz: string;
  educational: string;
  scienceTech: string;
  custom: string;

  // Admin Dashboard
  adminOverview: string;
  totalUsers: string;
  totalQuizzes: string;
  totalGamesPlayed: string;
  totalParticipants: string;
  recentSessions: string;
  manageUsers: string;
  manageQuizzes: string;
  role: string;
  actions: string;

  // Common
  loading: string;
  save: string;
  cancel: string;
  delete: string;
  confirm: string;
  success: string;
  error: string;
  seconds: string;
  points: string;
  soundOn: string;
  soundOff: string;
  languageName: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    brandName: "QUIZ MASTER",
    tagline: "Live Interactive Quiz Platform",
    heroHeadline: "Play. Learn. Win.",
    heroSubtitle: "Experience thrilling real-time live quizzes for schools, churches, corporate competitions, and friends. Play together with up to 50 players instantly.",
    createQuiz: "Create Quiz",
    joinLiveQuiz: "Join Live Quiz",
    exploreQuizzes: "Explore Quizzes",
    howItWorks: "How It Works",
    features: "Features",
    pricing: "Pricing",
    adminDashboard: "Admin Dashboard",
    myDashboard: "My Dashboard",
    login: "Sign In",
    register: "Register",
    logout: "Sign Out",
    profile: "User Profile",

    enterGamePin: "Enter 6-Digit Game PIN",
    gamePinPlaceholder: "e.g. 849201",
    enterYourName: "Enter Your Nickname",
    namePlaceholder: "Your full or nick name",
    chooseAvatar: "Pick Your Avatar Emoji",
    joinGameButton: "Join Competition",
    invalidPin: "Invalid game PIN or quiz has already finished.",
    roomFull: "Room is full (Maximum 50 players limit reached).",
    gameAlreadyStarted: "Quiz is already in progress. Please wait for the next game.",

    waitingForHost: "Waiting for the host to launch the game...",
    playersJoined: "Competitors in Room",
    youAreIn: "You are in! See your name on the host screen.",
    seeNameOnScreen: "Look up at the main display screen",
    gamePin: "GAME PIN",
    startGame: "Start Quiz",
    copyInviteLink: "Copy Room PIN",
    inviteCopied: "Game PIN copied to clipboard!",
    maxPlayersNotice: "Max 50 players per room",

    question: "Question",
    of: "of",
    timeRemaining: "Time Remaining",
    answersReceived: "Answers In",
    nextQuestion: "Next Question",
    showCorrectAnswer: "Show Correct Answer",
    showLeaderboard: "View Leaderboard",
    endQuiz: "Finish Quiz & Podium",
    hostControls: "Host Controls",

    tapToAnswer: "Select your answer quickly for maximum speed bonus!",
    answerSubmitted: "Answer Locked In! Waiting for question timer...",
    waitingForOtherPlayers: "Analyzing submissions...",
    correct: "Brilliant! Correct Answer!",
    incorrect: "Oops! Incorrect",
    timeUp: "Time is Up!",
    pointsEarned: "Points Earned",
    streakBonus: "Speed Bonus",
    currentRank: "Current Rank",
    totalScore: "Total Score",

    leaderboard: "Live Leaderboard",
    rank: "Rank",
    player: "Competitor",
    score: "Score",
    speed: "Speed",
    finalPodium: "Championship Winners",
    champion: "1st Place Gold Champion",
    runnerUp: "2nd Place Silver",
    thirdPlace: "3rd Place Bronze",
    playAgain: "Play Again",
    backToHome: "Return to Home",

    quizCreator: "Quiz Creator Studio",
    createNewQuiz: "Create New Quiz",
    quizTitle: "Quiz Title",
    quizTitlePlaceholder: "e.g. World History & Science Championship",
    quizDescription: "Description",
    quizDescPlaceholder: "Explain what this quiz is about...",
    category: "Category",
    selectCategory: "Choose category",
    questionsCount: "Questions",
    addQuestion: "Add New Question",
    saveQuiz: "Save Quiz to Library",
    previewQuiz: "Preview Quiz",
    questionText: "Question Prompt",
    questionTextPlaceholder: "Type your question here...",
    questionType: "Question Type",
    timeLimitSecs: "Time Limit (seconds)",
    pointsValue: "Base Points",
    imageUrlOptional: "Image URL (Optional)",
    options: "Answer Choices",
    correctAnswer: "Mark as Correct Answer",
    optionPlaceholder: "Option",
    deleteQuestion: "Remove Question",
    deleteQuiz: "Delete Quiz",
    editQuiz: "Edit Quiz",
    hostLive: "Host Live Game",

    mcq: "Multiple Choice",
    trueFalse: "True / False",
    multiSelect: "Multiple Select",
    imageQuiz: "Image Based",

    generalKnowledge: "General Knowledge",
    bibleQuiz: "Bible Quiz",
    educational: "Educational & STEM",
    scienceTech: "Science & Technology",
    custom: "Custom Quiz",

    adminOverview: "System & Platform Overview",
    totalUsers: "Total Users",
    totalQuizzes: "Total Quizzes",
    totalGamesPlayed: "Total Live Sessions",
    totalParticipants: "Total Competitors",
    recentSessions: "Live Room Audit History",
    manageUsers: "User Directory",
    manageQuizzes: "Quiz Library Directory",
    role: "Role",
    actions: "Actions",

    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    confirm: "Confirm",
    success: "Success!",
    error: "An error occurred",
    seconds: "sec",
    points: "pts",
    soundOn: "Sound On",
    soundOff: "Sound Muted",
    languageName: "English",
  },
  ta: {
    brandName: "குவிஸ் மாஸ்டர்",
    tagline: "நேரடி வினாடி வினா களம்",
    heroHeadline: "விளையாடு. கற்போம். வெல்வோம்.",
    heroSubtitle: "பள்ளிகள், திருச்சபைகள், நிறுவனங்கள் மற்றும் நண்பர்களுக்கான பிரம்மாண்டமான நேரடி வினாடி வினா தளம். ஒரே அறையில் 50 வீரர்கள் வரை உடனடியாக விளையாடலாம்.",
    createQuiz: "வினாடி வினா உருவாக்கு",
    joinLiveQuiz: "நேரடி போட்டியில் சேர்",
    exploreQuizzes: "வினாடி வினாக்களை காண்க",
    howItWorks: "எப்படி செயல்படுகிறது",
    features: "சிறப்பம்சங்கள்",
    pricing: "கட்டண விபரம்",
    adminDashboard: "நிர்வாகக் குழு (Admin)",
    myDashboard: "எனது கணக்கு",
    login: "உள்நுழை",
    register: "பதிவு செய்",
    logout: "வெளியேறு",
    profile: "பயனர் விவரம்",

    enterGamePin: "6-இலக்க விளையாட்டு பின் எண்ணை உள்ளிடவும்",
    gamePinPlaceholder: "எ.கா. 849201",
    enterYourName: "உங்கள் பெயரை உள்ளிடவும்",
    namePlaceholder: "உங்கள் பெயர் அல்லது செல்லப்பெயர்",
    chooseAvatar: "உங்கள் எமோஜியைத் தேர்ந்தெடுக்கவும்",
    joinGameButton: "போட்டியில் சேரவும்",
    invalidPin: "தவறான பின் எண் அல்லது போட்டி முடிந்துவிட்டது.",
    roomFull: "அறை நிரம்பிவிட்டது (அதிகபட்சம் 50 வீரர்கள் வரம்பு).",
    gameAlreadyStarted: "போட்டி ஏற்கனவே தொடங்கிவிட்டது. அடுத்த ஆட்டத்திற்காக காத்திருக்கவும்.",

    waitingForHost: "போட்டி ஒருங்கிணைப்பாளர் தொடங்க காத்திருக்கிறது...",
    playersJoined: "இணைந்துள்ள வீரர்கள்",
    youAreIn: "நீங்கள் இணைந்துவிட்டீர்கள்! உங்கள் பெயரை திரையில் காண்க.",
    seeNameOnScreen: "முக்கிய திரையைப் பார்க்கவும்",
    gamePin: "விளையாட்டு பின்",
    startGame: "போட்டியைத் தொடங்கு",
    copyInviteLink: "பின் நகலெடு",
    inviteCopied: "பின் எண் நகலெடுக்கப்பட்டது!",
    maxPlayersNotice: "ஒரு அறைக்கு அதிகபட்சம் 50 வீரர்கள்",

    question: "கேள்வி",
    of: "இல்",
    timeRemaining: "மீதமுள்ள நேரம்",
    answersReceived: "பதில்கள் வந்துள்ளன",
    nextQuestion: "அடுத்த கேள்வி",
    showCorrectAnswer: "சரியான விடையைக் காட்டு",
    showLeaderboard: "மதிப்பெண் பட்டியல்",
    endQuiz: "போட்டியை முடித்து வெற்றியாளரைக் காட்டு",
    hostControls: "ஒருங்கிணைப்பாளர் கட்டுப்பாடுகள்",

    tapToAnswer: "வேகமாக பதிலளித்து அதிக வேக புள்ளிகளைப் பெறுங்கள்!",
    answerSubmitted: "உங்கள் பதில் பதிவாகிவிட்டது! காத்திருக்கவும்...",
    waitingForOtherPlayers: "பதில்கள் ஆராயப்படுகின்றன...",
    correct: "அற்புதம்! சரியான விடை!",
    incorrect: "மன்னிக்கவும்! தவறான விடை",
    timeUp: "நேரம் முடிந்தது!",
    pointsEarned: "பெற்ற புள்ளிகள்",
    streakBonus: "வேக போனஸ்",
    currentRank: "தற்போதைய இடம்",
    totalScore: "மொத்த மதிப்பெண்",

    leaderboard: "நேரடி தரவரிசைப் பட்டியல்",
    rank: "இடம்",
    player: "வீரர்",
    score: "மதிப்பெண்",
    speed: "வேகம்",
    finalPodium: "சாம்பியன் வெற்றியாளர்கள் மேடை",
    champion: "1-ம் இடம் தங்க சாம்பியன்",
    runnerUp: "2-ம் இடம் வெள்ளி",
    thirdPlace: "3-ம் இடம் வெண்கலம்",
    playAgain: "மீண்டும் விளையாடு",
    backToHome: "முகப்புக்குத் திரும்பு",

    quizCreator: "வினாடி வினா உருவாக்குநர் அரங்கம்",
    createNewQuiz: "புதிய வினாடி வினா உருவாக்கு",
    quizTitle: "வினாடி வினா தலைப்பு",
    quizTitlePlaceholder: "எ.கா: பொது அறிவு மற்றும் விவிலிய வினாடி வினா",
    quizDescription: "விளக்கம்",
    quizDescPlaceholder: "இந்த வினாடி வினா பற்றிய சுருக்கமான விளக்கம்...",
    category: "பிரிவு",
    selectCategory: "பிரிவைத் தேர்ந்தெடுக்கவும்",
    questionsCount: "கேள்விகள்",
    addQuestion: "புதிய கேள்வியைச் சேர்",
    saveQuiz: "சேமிக்கவும்",
    previewQuiz: "முன்னோட்டம்",
    questionText: "கேள்வி வாசகம்",
    questionTextPlaceholder: "இங்கே உங்கள் கேள்வியைத் தட்டச்சு செய்க...",
    questionType: "கேள்வி வகை",
    timeLimitSecs: "நேர வரம்பு (வினாடிகள்)",
    pointsValue: "அடிப்படை புள்ளிகள்",
    imageUrlOptional: "பட முகவரி URL (விருப்பத்தேர்வு)",
    options: "விடை தெரிவுகள்",
    correctAnswer: "சரியான விடையாகக் குறிக்கவும்",
    optionPlaceholder: "தெரிவு",
    deleteQuestion: "கேள்வியை நீக்கு",
    deleteQuiz: "வினாடி வினாவை நீக்கு",
    editQuiz: "திருத்தவும்",
    hostLive: "நேரலையாக நடத்து",

    mcq: "பல்தெரிவு வினா (MCQ)",
    trueFalse: "சரியா / தவறா",
    multiSelect: "பல்வேறு தேர்வுகள்",
    imageQuiz: "பட அடிப்படையிலான வினா",

    generalKnowledge: "பொது அறிவு",
    bibleQuiz: "விவிலிய வினாடி வினா (Bible Quiz)",
    educational: "கல்வி & அறிவியல்",
    scienceTech: "அறிவியல் & தொழில்நுட்பம்",
    custom: "தனிப்பயன் வினாடி வினா",

    adminOverview: "தளத்தின் நிர்வாக கண்ணோட்டம்",
    totalUsers: "மொத்த பயனர்கள்",
    totalQuizzes: "மொத்த வினாடி வினாக்கள்",
    totalGamesPlayed: "நடத்தப்பட்ட போட்டிகள்",
    totalParticipants: "பங்கேற்ற வீரர்கள்",
    recentSessions: "சமீபத்திய போட்டிகள்",
    manageUsers: "பயனர் பட்டியல்",
    manageQuizzes: "வினாடி வினாக்கள் மேலாண்மை",
    role: "பொறுப்பு",
    actions: "செயல்கள்",

    loading: "காத்திருக்கவும்...",
    save: "சேமி",
    cancel: "ரத்து செய்",
    delete: "நீக்கு",
    confirm: "உறுதிப்படுத்து",
    success: "வெற்றி!",
    error: "பிழை ஏற்பட்டது",
    seconds: "விநாடி",
    points: "புள்ளிகள்",
    soundOn: "ஒலி இயக்கத்தில்",
    soundOff: "ஒலி முடக்கப்பட்டது",
    languageName: "தமிழ்",
  }
};
