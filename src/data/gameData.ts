export interface HostProfile {
  id: string;
  name: string;
  koreanName: string;
  role: string;
  personality: string;
  specialty: string;
  signatureDrink: string;
  description: string;
  quote: string;
  image: string;
  badge: string;
}

export interface MenuItem {
  category: 'Cocktail' | 'Coffee & Tea' | 'Dessert' | 'Tapas & Dining';
  name: string;
  subName: string;
  price: string;
  description: string;
  recommendedHost: string;
}

export const GAME_INFO = {
  title: 'Bunny Cafe',
  subTitle: 'Modern Private Lounge & Novel',
  genre: '프라이빗 라운지 미스터리 로맨스 비주얼 노벨',
  targetPlatforms: ['PC (Steam)', 'Mobile (iOS / Android)'],
  releaseDate: '2026. Coming Soon',
  synopsis: `서울의 화려한 네온사인 이면, 조용한 골목길 지하에 자리한 프라이빗 모던 라운지 'Bunny cafe'.
단순한 칵테일 바도, 평범한 디저트 카페도 아닌 이곳은 깊숙하고 은밀한 프라이빗 룸에서
여러분의 지친 일상을 위로하는 특별한 안식처입니다.

우아한 바니 수트를 입은 전문 호스트들이
당신만을 위한 시그니처 칵테일과 달콤한 디저트를 준비하고 기다리고 있습니다.

바쁜 하루하루에 지쳐가는 여러분의 일상 속에 스며드는 작은 휴식.
허기도 외로움도 채워주는 달콤한 시간이,
이 메뉴판을 펼치는 순간부터 시작됩니다.`,
  barRules: [
    {
      title: '1. 건전하고 합법적인 공간',
      desc: '버니 카페는 정식으로 허가 받은 유흥 음식점으로써, 안심할 수 있는 휴식처입니다.',
    },
    {
      title: '2. 전 좌석 프라이빗 룸',
      desc: '버니 카페의 모든 테이블은 방음 파티션과 암막 커튼으로 분리되어 있어 타인에게 방해받지 않는 휴식을 보장합니다.',
    },
    {
      title: '3. 전문적인 직원들',
      desc: '버니 카페의 전문 주방 인력들은 항상 변치 않는 맛의 음식을 제공하며, 카페의 얼굴인 호스트들은 개성 넘치는 모습으로 즐거움을 채워줍니다.',
    },
  ],
};

export const HOSTS: HostProfile[] = [
  {
    id: 'elara',
    name: 'Elara',
    koreanName: '엘라라',
    role: '헤드 바텐더 & 플로어 매니저',
    personality: '기품 있는 침착함, 날카로운 관찰력, 다정한 어른의 매력',
    specialty: '클래식 위스키 베이스 칵테일 & 감정 테이스팅',
    signatureDrink: 'Midnight Velvet (블랙베리 & 스모키 싱글몰트)',
    description: `Bunny cafe의 시작부터 함께해온 듬직한 헤드 바텐더.
손님의 표정과 억양만으로도 그날의 기분에 꼭 맞는 잔을 조용히 건네는 섬세함을 지녔습니다.
완벽주의자 같은 겉모습 뒤에 홀로 바를 지키게 된 남모를 사연이 숨겨져 있습니다.`,
    quote: `"어서오세요, 손님. 오늘 밤 당신의 마음에 필요한 온도는... 차가운 알코올일까요, 아니면 따뜻한 위로일까요?"`,
    image: '',
    badge: 'Chief Host',
  },
  {
    id: 'seah',
    name: 'Seah',
    koreanName: '세아',
    role: '쇼콜라티에 & 스위트 디저트 담당',
    personality: '발랄함, 솔직한 감정 표현, 호기심 많은 장난꾸러기',
    specialty: '수제 퐁당 쇼콜라 & 베리 블렌딩 에이드',
    signatureDrink: 'Sweet Bunny Fizz (스트로베리 크림 & 탄산수)',
    description: `단것을 좋아하는 손님들에게 언제나 눈부신 미소를 안겨주는 막내 호스트.
낮에는 갓 구운 제과 향기로 바를 채우고, 밤에는 손님들의 잔에 어울리는 달콤한 핑거푸드를 페어링해줍니다.
호스트 지명 시 손님에게 직접 만든 미공개 디저트를 몰래 선물하기도 합니다.`,
    quote: `"후후, 오늘은 특별히 손님만을 위해 준비한 스위츠가 있답니다. 기대하셔도 좋아요!"`,
    image: '', // fallback to stylish illustration/placeholder
    badge: 'Patissier Host',
  },
  {
    id: 'yuna',
    name: 'Yuna',
    koreanName: '유나',
    role: '수석 소믈리에 & 프라이빗 VIP 케어',
    personality: '도도하면서도 몽환적인 분위기, 은근한 배려심',
    specialty: '내추럴 와인 페어링 & 재즈 셀렉션',
    signatureDrink: 'Moonlit Nocturne (피노 누아 & 오크 스파이스)',
    description: `말수가 적지만 눈빛만으로 깊은 교감을 이끌어내는 심야 전담 호스트.
와인과 재즈에 대한 조예가 깊어 프라이빗 룸에서 나지막이 담소를 나누길 원하는 단골들에게 가장 많은 지명을 받습니다.`,
    quote: `"가끔은 침묵조차 가장 좋은 안주가 되기도 해요. 편히 기대세요, 아무도 우리를 방해하지 못하니까."`,
    image: '',
    badge: 'Sommelier Host',
  },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    category: 'Tapas & Dining',
    name: 'Cheesy baked spaghetti',
    subName: '치즈 오븐 스파게티',
    price: '₩ 18,000',
    description: '최상급 다진 소고기, 리코타, 모짜렐라, 파마산. 특제 토마토 소스의 깊은 풍미.',
    recommendedHost: '고온으로 가열되어 매우 뜨거우니 화상에 주의하세요!',
  },
  {
    category: 'Tapas & Dining',
    name: 'French toast & Bacon salad',
    subName: '프렌치 토스트 & 베이컨 샐러드',
    price: '₩ 13,900',
    description: '달콤고소한 프렌치 토스트와 신선한 샐러드, 바삭하게 익힌 베이컨의 조합. 가볍게 먹기 좋은 메뉴.',
    recommendedHost: '함께 나오는 수란은 기본 반숙 제공입니다. 완숙 원할 시 호스트에게 문의하세요.',
  },
  {
    category: 'Tapas & Dining',
    name: 'Chicken steak & Shrimp pilaf',
    subName: '쉬림프 치킨 필라프',
    price: '₩ 20,500',
    description: '칵테일 새우와 볶은 알싸한 필라프에 겉바속촉 닭가슴살 스테이크를 올린 메뉴.',
    recommendedHost: '마늘과 고추기름이 들어가 다소 매워요!',
  },
  {
    category: 'Tapas & Dining',
    name: 'Peanut sauce guobaorou',
    subName: '땅콩 꿔바로우',
    price: '₩ 26,000',
    description: '최상급 돼지고기를 바삭하게 튀겨 깊은 풍미의 땅콩 소스에 버무린 메뉴.',
    recommendedHost: '땅콩 소스가 포함되어 알레르기 보유 시 주의가 필요합니다. 소스 변경은 호스트에게 문의하세요.',
  },
  {
    category: 'Cocktail',
    name: 'Midnight Velvet',
    subName: '미드나잇 벨벳',
    price: '₩ 24,000',
    description: '12년 싱글몰트 위스키와 야생 블랙베리 퓨레, 다크 초콜릿 리큐어의 농밀한 여운.',
    recommendedHost: '논알콜 변경 원할 시 호스트에게 문의하세요.',
  },
  {
    category: 'Cocktail',
    name: 'Silver Ribbon Fizz',
    subName: '실버 리본 피즈',
    price: '₩ 21,000',
    description: '런던 드라이 진과 엘더플라워, 신선한 유자 폼을 얹은 상큼하고 청량한 시그니처.',
    recommendedHost: '논알콜 변경 원할 시 호스트에게 문의하세요.',
  },
  {
    category: 'Cocktail',
    name: 'Earl Grey Smoked Highball',
    subName: '얼그레이 스모크드 하이볼',
    price: '₩ 15,000',
    description: '향긋한 베르가못 얼그레이 시럽과 스모키한 스카치 위스키, 청량한 탄산의 조화.',
    recommendedHost: '논알콜 변경 원할 시 호스트에게 문의하세요.',
  },
  {
    category: 'Cocktail',
    name: 'Manbeer',
    subName: '맨주',
    price: '₩ 30,000',
    description: '남자의 향이 담긴 맥주.',
    recommendedHost: '남성 호스트에게만 주문 가능합니다.',
  },
  {
    category: 'Coffee & Tea',
    name: 'Chocolat cafe einspanner',
    subName: '쇼콜라 카페 아인슈페너',
    price: '₩ 14,000',
    description: '카카오와 커피의 진한 풍미 위에 부드럽게 덮인 크림.',
    recommendedHost: '가니쉬 변경 원할 시 호스트에게 문의하세요.',
  },
  {
    category: 'Coffee & Tea',
    name: 'Grapefruit honey black tea',
    subName: '자몽 허니 블랙 티',
    price: '₩ 6,500',
    description: '새콤달콤쌉싸름이 자연스레 어우러져 누구나 가볍게 마시기 좋은 메뉴.',
    recommendedHost: '알콜 추가 가능. 호스트에게 문의하세요.',
  },
  {
    category: 'Coffee & Tea',
    name: 'Blue lemonade',
    subName: '블루 레모네이드',
    price: '₩ 4,500',
    description: '상큼한 레몬, 달콤한 블루 큐라소. 청량함을 원할 때 최고의 선택.',
    recommendedHost: '알콜 추가 가능. 호스트에게 문의하세요.',
  },
];

export const GAME_SYSTEMS = [
  {
    number: '01',
    title: '전담 호스트 지명 & 1:1 교감',
    desc: '매 방문마다 취향에 맞는 바니 호스트를 지명할 수 있습니다. 지명 횟수와 대화 선택지에 따라 친밀도가 상승하며 전용 개별 서브 스토리 및 비밀 시나리오가 해금됩니다.',
  },
  {
    number: '02',
    title: '낮과 밤의 이중 라이프사이클',
    desc: '낮 시간대에는 감미로운 음악과 커피 향이 맴도는 디저트 카페로, 밤에는 은밀하고 관능적인 칵테일 바로 변모합니다. 시간대에 따라 다른 이벤트와 호스트의 새로운 면모를 발견하세요.',
  },
  {
    number: '03',
    title: '칵테일 블렌딩 & 시크릿 레시피',
    desc: '당신의 취향과 호스트의 상태에 맞춰 재료를 조합하여 칵테일을 주문하거나 직접 만들어 선물할 수 있습니다. 특정 레시피는 예상치 못한 심야의 특별 대화로 이어집니다.',
  },
];

export interface HostDetailProfile {
  id: string;
  nickname: string;
  realName: string;
  quote: string;
  page: number;
  spread: number;
  profileDetails: { label: string; value: string }[];
  bodySpecs: { label: string; value: string }[];
}

export const HERA_PAGE_DETAIL: HostDetailProfile = {
  id: 'hera',
  nickname: '헤라',
  realName: '박수아',
  quote: '"날 고른다면, 반드시 만족할거야~♡"',
  page: 9,
  spread: 4,
  profileDetails: [
    { label: '나이', value: '31세' },
    { label: '성격', value: '상냥·능글·차분·성숙' },
    { label: '호불호', value: '호: 남자·여자·술·진한 스킨십 / 불호: 내숭 떠는 사람·기름진 음식' },
    { label: '애교 서비스', value: '테이블 위에 앉아 섹시 포즈' },
  ],
  bodySpecs: [
    { label: '신장', value: '171 cm' },
    { label: '체중', value: '65 kg' },
    { label: '체지방', value: '25 %' },
    { label: '골격근', value: '23 kg' },
    { label: '어깨', value: '40 cm' },
    { label: '윗가슴', value: '101 cm' },
    { label: '아랫가슴', value: '78 cm' },
    { label: '허리', value: '68 cm' },
    { label: '엉덩이', value: '102 cm' },
    { label: '상완', value: '27 cm' },
    { label: '허벅지', value: '54 cm' },
    { label: '양물(이완/팽창)', value: '- / -' },
  ],
};

export const GLASS_PAGE_DETAIL: HostDetailProfile = {

  id: 'glass',
  nickname: '글래스',
  realName: '여미진',
  quote: '"시킬 거면 빨리 말해. 아무거나 상관 없으니까."',
  page: 10,
  spread: 4,
  profileDetails: [
    { label: '나이', value: '27세' },
    { label: '성격', value: '차분·신중·까칠·현실적' },
    { label: '호불호', value: '호: 성숙한 사람·고요함 / 불호: 시끄러운 사람' },
    { label: '애교 서비스', value: '가슴 움켜쥐기' },
  ],
  bodySpecs: [
    { label: '신장', value: '164 cm' },
    { label: '체중', value: '55 kg' },
    { label: '체지방', value: '22 %' },
    { label: '골격근', value: '21 kg' },
    { label: '어깨', value: '38 cm' },
    { label: '윗가슴', value: '91 cm' },
    { label: '아랫가슴', value: '74 cm' },
    { label: '허리', value: '66 cm' },
    { label: '엉덩이', value: '94 cm' },
    { label: '상완', value: '27 cm' },
    { label: '허벅지', value: '52 cm' },
    { label: '양물(이완/팽창)', value: '- / -' },
  ],
};

export const LILY_PAGE_DETAIL: HostDetailProfile = {

  id: 'lily',
  nickname: '릴리',
  realName: '배수정',
  quote: '"환영합니다~ 최상의 서비스로 보답할게요!"',
  page: 11,
  spread: 5,
  profileDetails: [
    { label: '나이', value: '25세' },
    { label: '성격', value: '친절·정중·섬세·사교적' },
    { label: '호불호', value: '호: 달콤한 음식·여행·토끼 / 불호: 쓴 커피' },
    { label: '애교 서비스', value: '볼 찌르기' },
  ],
  bodySpecs: [
    { label: '신장', value: '162 cm' },
    { label: '체중', value: '52 kg' },
    { label: '체지방', value: '22 %' },
    { label: '골격근', value: '19 kg' },
    { label: '어깨', value: '37 cm' },
    { label: '윗가슴', value: '86 cm' },
    { label: '아랫가슴', value: '72 cm' },
    { label: '허리', value: '65 cm' },
    { label: '엉덩이', value: '90 cm' },
    { label: '상완', value: '25 cm' },
    { label: '허벅지', value: '50 cm' },
    { label: '양물(이완/팽창)', value: '- / -' },
  ],
};

export const CARROT_PAGE_DETAIL: HostDetailProfile = {
  id: 'carrot',
  nickname: '캐럿',
  realName: '이연아',
  quote: '"꺄~ 우리 뭐하고 놀까요? 저 애교 완전 잘해요!"',
  page: 12,
  spread: 5,
  profileDetails: [
    { label: '나이', value: '20세' },
    { label: '성격', value: '순수·활발·솔직·외향적' },
    { label: '호불호', value: '호: 무서운 것 빼고 전부 / 불호: 무서운 것' },
    { label: '애교 서비스', value: '볼 꼬집기' },
  ],
  bodySpecs: [
    { label: '신장', value: '158 cm' },
    { label: '체중', value: '46 kg' },
    { label: '체지방', value: '19 %' },
    { label: '골격근', value: '18 kg' },
    { label: '어깨', value: '36 cm' },
    { label: '윗가슴', value: '79 cm' },
    { label: '아랫가슴', value: '68 cm' },
    { label: '허리', value: '57 cm' },
    { label: '엉덩이', value: '84 cm' },
    { label: '상완', value: '22 cm' },
    { label: '허벅지', value: '45 cm' },
    { label: '양물(이완/팽창)', value: '- / -' },
  ],
};

export const LOKI_PAGE_DETAIL: HostDetailProfile = {
  id: 'loki',
  nickname: '로키',
  realName: '김현진',
  quote: '"오호, 제게 무엇을 원하실까요~?"',
  page: 13,
  spread: 6,
  profileDetails: [
    { label: '나이', value: '27세' },
    { label: '성격', value: '성숙·차분·능청·장난기' },
    { label: '호불호', value: '호: 편안한 관계 / 불호: 딱히 없음' },
    { label: '애교 서비스', value: '모델 포즈' },
  ],
  bodySpecs: [
    { label: '신장', value: '186 cm' },
    { label: '체중', value: '73 kg' },
    { label: '체지방', value: '12 %' },
    { label: '골격근', value: '35 kg' },
    { label: '어깨', value: '46 cm' },
    { label: '윗가슴', value: '98 cm' },
    { label: '아랫가슴', value: '87 cm' },
    { label: '허리', value: '75 cm' },
    { label: '엉덩이', value: '92 cm' },
    { label: '상완', value: '31 cm' },
    { label: '허벅지', value: '52 cm' },
    { label: '양물(이완/팽창)', value: '10 cm / 19 cm' },
  ],
};

export const INDIGO_PAGE_DETAIL: HostDetailProfile = {
  id: 'indigo',
  nickname: '인디고',
  realName: '고석진',
  quote: '"하아... 뭘 도와드릴까요..?"',
  page: 14,
  spread: 6,
  profileDetails: [
    { label: '나이', value: '30세' },
    { label: '성격', value: '차분·내성적·현실적·책임감' },
    { label: '호불호', value: '호: 책임감 강한 사람·공부·제육볶음 / 불호: 부담스럽게 다가오는 사람·시끄러운 사람' },
    { label: '애교 서비스', value: '트월킹' },
  ],
  bodySpecs: [
    { label: '신장', value: '180 cm' },
    { label: '체중', value: '72 kg' },
    { label: '체지방', value: '11 %' },
    { label: '골격근', value: '35 kg' },
    { label: '어깨', value: '47 cm' },
    { label: '윗가슴', value: '99 cm' },
    { label: '아랫가슴', value: '90 cm' },
    { label: '허리', value: '76 cm' },
    { label: '엉덩이', value: '92 cm' },
    { label: '상완', value: '32 cm' },
    { label: '허벅지', value: '53 cm' },
    { label: '양물(이완/팽창)', value: '9 cm / 15 cm' },
  ],
};

export const THOR_PAGE_DETAIL: HostDetailProfile = {
  id: 'thor',
  nickname: '토르',
  realName: '남덕배',
  quote: '"지, 진짜 날 고르려는 거여..? 거참, 특이한 손님이구먼..."',
  page: 15,
  spread: 7,
  profileDetails: [
    { label: '나이', value: '50세' },
    { label: '성격', value: '소심·순수·섬세·내성적' },
    { label: '호불호', value: '호: 운동·국밥·남자 / 불호: 외모만 보고 판단하는 사람' },
    { label: '애교 서비스', value: '고양이 포즈' },
  ],
  bodySpecs: [
    { label: '신장', value: '205 cm' },
    { label: '체중', value: '128 kg' },
    { label: '체지방', value: '14 %' },
    { label: '골격근', value: '57 kg' },
    { label: '어깨', value: '57 cm' },
    { label: '윗가슴', value: '130 cm' },
    { label: '아랫가슴', value: '109 cm' },
    { label: '허리', value: '98 cm' },
    { label: '엉덩이', value: '116 cm' },
    { label: '상완', value: '43 cm' },
    { label: '허벅지', value: '70 cm' },
    { label: '양물(이완/팽창)', value: '19 cm / 31 cm' },
  ],
};

export const RIO_PAGE_DETAIL: HostDetailProfile = {
  id: 'rio',
  nickname: '리오',
  realName: '이호승',
  quote: '"뭐하고 놀까? 오늘 시간 많아? 나랑 쭉 놀자!"',
  page: 16,
  spread: 7,
  profileDetails: [
    { label: '나이', value: '22세' },
    { label: '성격', value: '쾌활·능글·자유분방·외향적' },
    { label: '호불호', value: '호: 여자·바이크·술 / 불호: 지루한 것' },
    { label: '애교 서비스', value: '손하트' },
  ],
  bodySpecs: [
    { label: '신장', value: '183 cm' },
    { label: '체중', value: '81 kg' },
    { label: '체지방', value: '12 %' },
    { label: '골격근', value: '38 kg' },
    { label: '어깨', value: '49 cm' },
    { label: '윗가슴', value: '104 cm' },
    { label: '아랫가슴', value: '94 cm' },
    { label: '허리', value: '80 cm' },
    { label: '엉덩이', value: '97 cm' },
    { label: '상완', value: '35 cm' },
    { label: '허벅지', value: '58 cm' },
    { label: '양물(이완/팽창)', value: '8 cm / 16 cm' },
  ],
};









