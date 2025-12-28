export const invite = {
  groom: "석우",
  bride: "주영",

  date: "2026년 4월 11일 토요일",
  time: "오후 5시",
  venue: "○○ 웨딩홀 3층 그랜드홀",

  location: {
    address: "서울특별시 강남구 언주로 517 지하 1층",
    googleMapUrl:
      "https://www.google.com/maps/place/%EB%A9%94%EC%A2%85%EB%93%9C%EC%95%84%EB%82%98%ED%95%98/data=!4m2!3m1!1s0x0:0xba0b85c121d17c22?sa=X&ved=1t:2428&ictx=111&cshid=1766921607285359",
  },

  contacts: {
    groom: {
      name: "석우",
      tel: "010-1234-5678",
    },
    bride: {
      name: "주영",
      tel: "010-2345-6789",
    },
  },

  accounts: [
    {
      group: "신랑측",
      items: [
        { bank: "국민은행", number: "123-45-678901", holder: "장석우" },
        { bank: "신한은행", number: "110-123-456789", holder: "장석우" },
      ],
    },
    {
      group: "신부측",
      items: [{ bank: "우리은행", number: "1002-123-456789", holder: "주영" }],
    },
  ],

  message: `
서로 다른 길을 걸어온 두 사람이
이제 같은 방향을 바라보며
한 걸음을 내딛으려 합니다.

소중한 분들을 모시고
그 시작의 순간을 함께하고 싶습니다.
`,

  gallery: ["/images/1.jpg", "/images/2.jpg", "/images/3.jpg"],
};
