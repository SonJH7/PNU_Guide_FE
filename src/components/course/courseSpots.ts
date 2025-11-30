/* eslint-disable */
import humanitiesImg from '@/assets/images/humanities-building.jpg';
import libraryImg from '@/assets/images/saebyeok-library.jpg';
import museumImg from '@/assets/images/museum.jpg';
import vSpaceImg from '@/assets/images/v_space.jpg';
import lawImg from '@/assets/images/법학관 모의법정.jpg';
import phamarcyImg from '@/assets/images/약학관약국.jpg';
import geomuseumImg from '@/assets/images/지질박물관.jpg';
import stuResImg from '@/assets/images/학생회관 식당.png';
import centerLibImg from '@/assets/images/중앙도서관.png';
import sculptureparkImg from '@/assets/images/조각 공원.png';
import musicBuildingImg from '@/assets/images/음악관.png';
import cafeImg from '@/assets/images/운죽정.png';
import yewonjeongImg from '@/assets/images/예원정.png';
import phamarcyBuildingImg from '@/assets/images/약학관.png';
import octsquareImg from '@/assets/images/시월광장.png';
import saetbyealResImg from '@/assets/images/샛별회관 식당.png';
import demoHillImg from '@/assets/images/민주 언덕.png';
import mirinaeImg from '@/assets/images/미리내골.png';
import uniHeadImg from '@/assets/images/대학본부.png';
import neokHillImg from '@/assets/images/넉넉한 터.png';
import jinliImg from '@/assets/images/진리의 뜰.png';
import geumjeongResImg from '@/assets/images/금정회관 식당.png';
import businessBuildImg from '@/assets/images/경영관.png';
import sportBuildImg from '@/assets/images/경암체육관.png';
import constructBuildImg from '@/assets/images/건설관.png';
import memorialImg from '@/assets/images/10.16 기념관.png';

export type CourseOperatingHours = {
  label: string;
  times: string[];
};

export type CourseFloor = {
  title: string;
  description?: string;
};

export type CourseSpot = {
  id: string;
  title: string;
  description: string;
  buildingNumber: string;
  badge?: string | null;
  image: string;
  operatingHours?: CourseOperatingHours[];
  floors?: CourseFloor[];
  contact?: string;
};

const imageMap: Record<string, string> = {
  'saebyeok-library': libraryImg,
  humanities: humanitiesImg,
  'pnu-museum': museumImg,
  'v-space': vSpaceImg,
};

export const courseSpots: CourseSpot[] = [
  {
    id: 'saebyeok-library',
    title: '새벽벌도서관',
    description:
      "24시간 운영하는 '새벽 별당' 열람실을 통해 새벽까지 빛나는 도서관. 문화·휴식·학업이 공존하는 복합문화공간.",
    buildingNumber: '420',
    badge: '인기',
    image: imageMap['saebyeok-library'],
    operatingHours: [
      {
        label: '월~금',
        times: ['09:00~21:00 (학기중)', '09:00~18:00 (방학중)'],
      },
      {
        label: '토',
        times: ['09:00~13:00'],
      },
      {
        label: '공휴일',
        times: ['휴관'],
      },
    ],
    floors: [
      { title: '이노베이션파크', description: '스마트 TV로 DVD·OTT 감상' },
      { title: '러닝커먼스', description: '카페형 학습 분위기, 대규모 행사' },
      { title: '오디토리움', description: '영화 감상, 강연회 활용' },
    ],
    contact: '051-510-1303',
  },
  {
    id: 'humanities',
    title: '인문관',
    description: '부산대 인문대 학생들의 주요 강의와 교양 수업이 열리는 공간',
    buildingNumber: '306',
    badge: null,
    image: imageMap.humanities,
  },
  {
    id: 'pnu-museum',
    title: '박물관',
    description:
      '부산·경남의 대표적인 선사 및 고대문화 연구기관(1964년 개관). 문화재 발굴, 기증, 보존처리, 학술연구, 국제교류, 전시, 교육, 다양한 분야 유물 2만 5천여 점 소장',
    buildingNumber: '412',
    badge: '인기',
    image: imageMap['pnu-museum'],
    operatingHours: [
      { label: '월~토', times: ['10:00~17:00', '전시해설 가능'] },
      { label: '공휴일', times: ['휴관'] },
    ],
    floors: [{ title: '관람료무료' }],
    contact: '051-510-1836',
  },
  {
    id: 'v-space',
    title: 'V-SPACE',
    description:
      '부산대 학생 및 시민·초기창업자 등 자신의 아이디어를 기술적으로 구현해, 누구나가 원하는 거의 모든 시제품을 만들어 낼 수 있는 꿈의 공간. 3D프린터·CNC밀링머신·레이저 조각기·웨어러블 디바이스 제작을 위한 컴퓨터 재봉틀 등 최고의 장비 구축',
    buildingNumber: '303',
    badge: '인기',
    image: imageMap['v-space'],
    operatingHours: [
      { label: '월~금', times: ['09:30~11:30', '13:30~17:30'] },
      {
        label: '안내',
        times: [
          '점심시간 12:00~13:00 전후 30분은 장비 점검/출력물 회수',
          '원활한 사용을 위해 운영시간을 지켜주세요',
        ],
      },
    ],
    floors: [{ title: '기계관 2층' }],
    contact: '051-510-3261',
  },
  {
    id: 'mock-court',
    title: '법학관 모의법정',
    description:
      '실제 법정과 같은 모습 재현. 인터넷, 온라인, 시뮬레이션, 화상회의 등을 통한 모의재판 가능',
    buildingNumber: '609',
    badge: '인기',
    image: lawImg,
    operatingHours: [{ label: '운영', times: ['문의 (051-510-1574)'] }],
    floors: [{ title: '제 1 법학관 3층' }],
    contact: '051-510-1574',
  },
  {
    id: 'pharmacy-lab',
    title: '약학관 부속실습약국',
    description:
      '약사 실무 현장에서 필요한 지식과 기술을 배우는 시뮬레이션 약국',
    buildingNumber: '503',
    badge: '인기',
    image: phamarcyImg,
    operatingHours: [{ label: '운영시간', times: ['문의 (051-510-1683)'] }],
    floors: [{ title: '약학관 3층', description: '실습약국 위치' }],
    contact: '051-510-1683',
  },
  {
    id: 'geo-museum',
    title: '지질박물관',
    description:
      '시대별 주요 화석 및 인류의 두개골, 각종 화산 분출물, 특이 암석, 운석, 형광 광물, 다양한 색상과 결정의 광물 등 5백여 점 전시',
    buildingNumber: '414',
    badge: '인기',
    image: geomuseumImg,
    operatingHours: [
      { label: '월~금', times: ['09:30~18:00'] },
      { label: '토', times: ['사전신청 시 단체방문 가능'] },
      { label: '공휴일', times: ['휴관'] },
    ],
  },
  {
    id: 'student-hall-cafeteria',
    title: '학생회관 식당',
    description:
      '학생회관 내부에 위치한 대표 학생식당으로, 다양한 메뉴와 합리적인 가격으로 점심시간마다 붐비는 공간.',
    buildingNumber: '708',
    badge: null,
    image: stuResImg,
  },
  {
    id: 'garden-of-truth',
    title: '진리의 뜰',
    description:
      '운죽정과 인문관 사이에 위치한 연못과 잔디 정원으로, 잉어 먹이 주기와 산책을 즐길 수 있는 힐링 스팟.',
    buildingNumber: '303과 306 사이',
    badge: null,
    image: jinliImg,
  },
  {
    id: 'central-library',
    title: '중앙도서관',
    description:
      '부산대의 메인 도서관으로, 방대한 장서와 열람실·스터디룸 등 학습 인프라가 모여 있는 지식 허브.',
    buildingNumber: '510',
    badge: null,
    image: centerLibImg,
  },
  {
    id: 'sculpture-park',
    title: '조각 공원',
    description:
      '캠퍼스 곳곳의 야외 조형물이 모여 있는 공간으로, 산책하면서 작품을 감상하기 좋은 야외 갤러리.',
    buildingNumber: '416 앞',
    badge: null,
    image: sculptureparkImg,
  },
  {
    id: 'music-hall',
    title: '음악관',
    description:
      '콘서트홀과 연습실을 갖춘 예술대 음악 전용 건물로, 각종 연주회와 공연이 열리는 문화 예술의 중심지.',
    buildingNumber: '707',
    badge: null,
    image: musicBuildingImg,
  },
  {
    id: 'unjukjeong',
    title: '운죽정',
    description:
      '대나무 숲과 잔디정원을 품은 북카페로, 테라스에서 넉넉한 터를 바라보며 여유를 즐길 수 있는 인기 카페.',
    buildingNumber: '202',
    badge: null,
    image: cafeImg,
  },
  {
    id: 'yewonjeong',
    title: '예원정',
    description:
      '사회관 인근에 위치해 오랫동안 학생들의 쉼터이자 문화 공간 역할을 해온 부산대의 상징적인 정자.',
    buildingNumber: '421 앞',
    badge: null,
    image: yewonjeongImg,
  },
  {
    id: 'pharmacy-building',
    title: '약학관',
    description:
      '첨단 실험실과 실습약국을 갖춘 약학대학 건물로, 미래 약사를 위한 교육과 연구가 이루어지는 공간.',
    buildingNumber: '503',
    badge: null,
    image: phamarcyBuildingImg,
  },
  {
    id: 'october-square',
    title: '시월광장',
    description:
      '넓은 잔디와 계단식 공간이 어우러진 광장으로, 축제·행사와 집회가 자주 열리는 캠퍼스의 상징적 오픈 스페이스.',
    buildingNumber: '203 옆',
    badge: null,
    image: octsquareImg,
  },
  {
    id: 'saetbyeol-hall-cafeteria',
    title: '샛별회관 식당',
    description:
      '샛별회관(샛벌회관) 내부 학생식당으로, 자연대·사범대 인근 학생들이 자주 찾는 생활 밀착형 식사 공간.',
    buildingNumber: '415',
    badge: null,
    image: saetbyealResImg,
  },
  {
    id: 'democracy-hill',
    title: '민주 언덕',
    description:
      '부마민주항쟁의 역사를 기억하기 위해 조성된 공간으로, 새벽벌도서관 앞 언덕을 정비해 만든 기념의 장.',
    buildingNumber: '420 옆',
    badge: null,
    image: demoHillImg,
  },
  {
    id: 'mirinae-gul',
    title: '미리내골',
    description:
      '자연대와 공대 사이를 흐르는 작은 계곡과 산책로 일대의 애칭으로, 사시사철 캠퍼스 분위기를 느낄 수 있는 길.',
    buildingNumber: '409 옆',
    badge: null,
    image: mirinaeImg,
  },
  {
    id: 'main-admin',
    title: '대학본부',
    description:
      '총장실과 주요 행정 부서가 모여 있는 본관 건물로, 부산대학교의 행정과 의사결정이 이루어지는 중심 공간.',
    buildingNumber: '205',
    badge: null,
    image: uniHeadImg,
  },
  {
    id: 'neokneok-hill',
    title: '넉넉한 터',
    description:
      '잔디광장과 나무가 어우러진 대표 야외 공간으로, 피크닉·공연·행사가 열리는 개방형 녹지공간.',
    buildingNumber: '203',
    badge: null,
    image: neokHillImg,
  },
  {
    id: 'geumjeong-hall-cafeteria',
    title: '금정회관 식당',
    description:
      '금정회관 내 학생식당으로, 공대·자연대 학생들이 많이 이용하는 대형 식당 공간.',
    buildingNumber: '419',
    badge: null,
    image: geumjeongResImg,
  },
  {
    id: 'business-building',
    title: '경영관',
    description:
      '경영학과 강의실과 연구실, 취업 지원 공간이 모여 있는 건물로, 경영대 학생들의 주요 활동 무대.',
    buildingNumber: '514',
    badge: null,
    image: businessBuildImg,
  },
  {
    id: 'kyeongam-gym',
    title: '경암체육관',
    description:
      '실내 체육 수업과 각종 경기·행사가 열리는 체육관으로, 관람석을 갖춘 대형 스포츠 시설.',
    buildingNumber: '706',
    badge: null,
    image: sportBuildImg,
  },
  {
    id: 'construction-hall',
    title: '건설관',
    description:
      '공대 인근에 위치한 건물로, 건설·공학 관련 강의실과 연구실, 미리내 열람실 등이 자리한 학습 공간.',
    buildingNumber: '401',
    badge: null,
    image: constructBuildImg,
  },
  {
    id: 'memorial-1016',
    title: '10.16 기념관',
    description:
      '10·16 민주항쟁을 기념해 조성된 공연·행사 공간으로, 각종 강연과 문화공연이 열리는 캠퍼스 대표 홀.',
    buildingNumber: '403',
    badge: null,
    image: memorialImg,
  },
];
