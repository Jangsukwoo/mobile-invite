export type Invite = {
  groom: string;
  bride: string;

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
    latitude?: number;
    longitude?: number;
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
  cover: {
    image: "images/cover.jpg",
  },

  date: "2026년 3월 28일 토요일",
  time: "오후 5시",
  venue: "메종드아나하 그랜드볼룸홀",

  location: {
    address: "메종드아나하",
    googleMapUrl: "https://www.google.com/maps/search/메종드아나하",
    kakaoMapUrl: "https://map.kakao.com/?q=메종드아나하",
    naverMapUrl: "https://map.naver.com/v5/search/메종드아나하",
    latitude: 37.5006, // 신라스테이 역삼 근처 좌표 (정확한 좌표로 수정 필요)
    longitude: 127.0364,
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
      ],
    },
    {
      group: "신부측",
      items: [
        { bank: "카카오뱅크", number: "3333105871789", holder: "Jooyoung" },
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

  gallery: ["images/1.jpg"],

  music: {
    url: "/music/Morning with U.mp3",
    title: "Morning with U",
  },
};
