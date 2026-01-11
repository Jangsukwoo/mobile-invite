export type Invite = {
  groom: string;
  bride: string;
  groomKorean?: string;
  brideKorean?: string;

  cover: {
    image: string;
    tagline?: string;
  };

  date: string;
  time: string;
  venue: string;

  location: {
    address: string;
    googleMapUrl: string;
    kakaoMapUrl?: string;
    naverMapUrl?: string;
    tmapUrl?: string;
    latitude?: number;
    longitude?: number;
    transportation?: {
      subway?: string[];
      bus?: string[];
      car?: string;
      shuttle?: string[];
    };
  };

  contacts: {
    groom: { name: string; tel: string };
    bride: { name: string; tel: string };
  };

  accounts: Array<{
    group: string;
    items: Array<{ bank: string; number: string; holder: string }>;
  }>;

  site: {
    title: string;
    description: string;
    url: string;
    ogImage: string;
  };

  message: string;
  gallery: string[];

  music?: {
    url: string;
    title?: string;
  };
};

export const invite: Invite = {
  groom: "Seokwoo",
  bride: "Jooyoung",
  groomKorean: "장석우",
  brideKorean: "박주영",
  cover: {
    image: "images/cover.jpg",
  },

  date: "2026년 3월 28일 토요일",
  time: "오후 5시",
  venue: "메종드아나하 그랜드볼룸홀",

  location: {
    address: "서울특별시 강남구 언주로 517 메종드아나하 (신라스테이 역삼 B1층)",
    googleMapUrl: "https://www.google.com/maps/search/메종드아나하",
    kakaoMapUrl: "https://map.kakao.com/?q=메종드아나하",
    naverMapUrl: "https://map.naver.com/v5/search/메종드아나하",
    // 티맵 앱 딥링크 (앱이 설치되어 있으면 앱 열림)
    tmapUrl: "tmap://search?name=메종드아나하",
    latitude: 37.5017, // 메종드아나하 (신라스테이 호텔 강남 B1) 정확한 좌표
    longitude: 127.036,
    transportation: {
      subway: [
        "2호선/ 수인분당선 선릉역 5번출구 (도보 10분)",
        "2호선 역삼역 8번 출구 (도보 10분)",
      ],
      bus: [
        "141, 242, 361, 6411 정류장 : KT강남지사",
      ],
      car: "신라스테이 B2~B5 (2시간 무료 주차)\n주차 혼잡이 예상되오니 가급적 대중교통 이용 부탁드립니다.",
      shuttle: [
        "선릉역 6번출구 10분 간격 수시 운행",
      ],
    },
  },

  contacts: {
    groom: { name: "Seokwoo", tel: "010-2005-8527" },
    bride: { name: "Jooyoung", tel: "010-8332-3341" },
  },

  accounts: [
    {
      group: "신랑측",
      items: [
        { bank: "하나은행", number: "177-910539-09607", holder: "Seokwoo" },
        { bank: "", number: "", holder: "[아버지] 장광용" },
      ],
    },
    {
      group: "신부측",
      items: [
        { bank: "카카오뱅크", number: "3333105871789", holder: "Jooyoung" },
        { bank: "", number: "", holder: "[아버지] 박덕영" },
        { bank: "", number: "", holder: "[어머니] 김정임" },
      ],
    },
  ],

  site: {
    title: "Seokwoo ♥ Jooyoung 모바일 청첩장",
    description: "소중한 분들을 초대합니다. 2026년 3월 28일 오후 5시",
    url: "https://SeokwooJ.github.io/mobile-invite/",
    ogImage: "og.png",
  },

  message: `
서로 다른 길을 걸어온 두 사람이
이제 같은 방향을 바라보며
한 걸음을 내딛으려 합니다.

소중한 분들을 모시고
그 시작의 순간을 함께하고 싶습니다.
`,

  gallery: [
    "images/1.jpg",
    "images/2.jpg",
    "images/3.jpg",
    "images/4.jpg",
    "images/5.jpg",
    "images/6.jpg",
    "images/7.jpg",
    "images/8.jpg",
    "images/9.jpg",
    "images/10.jpg",
    "images/11.jpg",
  ],

  music: {
    url: "/music/Morning with U.mp3",
    title: "Morning with U",
  },
};
