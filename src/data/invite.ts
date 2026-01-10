export type Invite = {
  groom: string;
  bride: string;

  cover: {
    image: string;
    tagline: string;
  };

  date: string;
  time: string;
  venue: string;

  location: {
    address: string;
    googleMapUrl: string;
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
};

export const invite: Invite = {
  groom: "Seokwoo",
  bride: "Jooyoung",
  cover: {
    image: "images/cover.jpg",
    tagline: "두 사람의 이야기가 열리고 있어요",
  },

  date: "2026년 3월 28일 토요일",
  time: "오후 5시",
  venue: "메종드아나하 그랜드볼룸홀",

  location: {
    address: "서울특별시 강남구 언주로 517 신라스테이호텔 역삼 지하 1층",
    googleMapUrl:
      "https://www.google.com/maps/place/%EB%A9%94%EC%A2%85%EB%93%9C%EC%95%84%EB%82%98%ED%95%98/data=!4m2!3m1!1s0x0:0xba0b85c121d17c22?sa=X&ved=1t:2428&ictx=111&cshid=1766921607285359",
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
};
