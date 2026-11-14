import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged,
  signInWithEmailAndPassword, signOut
} from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { 
  Users, 
  CreditCard, 
  BookOpen, 
  PhoneCall, 
  BarChart3, 
  Sparkles, 
  Settings, 
  Filter, 
  FileText, 
  Check, 
  TrendingUp, 
  DollarSign, 
  ImageIcon, 
  AlertTriangle, 
  Send, 
  X, 
  MessageSquare, 
  MessageCircle, 
  User, 
  CheckCheck,
  Globe,
  Plus,
  Edit3,
  Cloud,
  CheckCircle2,
  Receipt,
  Menu,
  Upload,
  Link2,
  FileSpreadsheet,
  Download,
  Trash2,
  RefreshCw
} from 'lucide-react';

// --- NAV ITEM COMPONENT ---
function NavItem({ icon, label, active, onClick, badge, badgeColor }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition ${
        active 
          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <div className="flex items-center space-x-3">
        <span className={active ? 'text-white' : 'text-slate-500'}>{icon}</span>
        <span className="tracking-tight">{label}</span>
      </div>
      {badge !== undefined && badge > 0 && (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeColor || 'bg-amber-500 text-white'}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

// --- CLOUD STORAGE INITIALIZATION ---
// Vite 배포에서는 Firebase 환경변수가 없으면 데모 모드로 실행합니다.
const firebaseConfig = import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID
  ? {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    }
  : null;
const app = firebaseConfig ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;
const appId = import.meta.env.VITE_ACADEMY_APP_ID || 'academy-demo';

// --- TRANSLATIONS FOR MULTI-LANGUAGE SUPPORT ---
const TRANSLATIONS = {
  KR: {
    appTitle: 'Agent AI',
    appSubtitle: '영어학원 통합관리 OS',
    navDashboard: '경영 & 매출 대시보드',
    navUnpaid: '문자 발송',
    navStudents: '학생 & 반 관리',
    navPayments: '수강료 정산 & 현금영수증',
    navCashReceipt: '현금영수증 발행 리스트',
    navConsultations: 'AI 상담 자동 요약',
    navHomework: 'AI 숙제 검사 & 피드백',
    navStaffMsg: '직원 메시지 & 공지',
    aiStatus: 'AI Agent 가동 중',
    adminRole: '원장님 / 원어민 선생님 계정',
    headerDashboard: '경영 분석 및 종합 대시보드',
    headerUnpaid: '문자 발송',
    headerStudents: '학생 기본정보 & 반별 대기자 관리',
    headerPayments: '국민은행 / 카드 / Chak 입금 자동 대조 & 현금영수증',
    headerCashReceipt: '학원 계좌 입금자 대상 현금영수증 발급 상태 관리 및 국세청 전송',
    headerConsultations: 'AI 음성/통화 상담 자동 기록관',
    headerHomework: '카카오톡 숙제 사진 수신 & AI 교재 자동 채점',
    headerStaffMsg: '학원 강사 및 직원 대상 사내 공지 및 업무 메시지 발송',
    totalRevenue: '이번 달 총 매출',
    unpaidAmount: '미납금 총액',
    conversionRate: '신규 상담 대비 등록률',
    activeStudents: '현재 재원 학생 수',
    cashReceiptStatus: '자동 현금영수증 처리',
    quickAttendanceTitle: '빠른 출결 & 학생 프로필 확인 (학생 이름을 클릭하세요)',
    customFieldSettings: '학생 정보 확장 설정',
    newFieldPlaceholder: '새 항목명 (예: 셔틀지점)',
    addBtn: '추가',
    monthlyTrendTitle: '월별 재원생 변동 및 신규/퇴원 추이 그래프',
    totalEnrolledLabel: '총 재원생',
    newEnrolledLabel: '신규 등록',
    withdrawnLabel: '퇴원생',
    revenueAnalysisTitle: '학원 매출 심층 분석 (수업료 vs 교재비 및 연도별 비교)',
    combinedRevenue: '합산 총 매출',
    splitRevenue: '수업료/교재비 각각 분할',
    yearlyComparison: '연도별 비교 (YoY)',
    tuitionRevLabel: '수업료 매출',
    bookRevLabel: '교재비 매출',
    studentName: '학생명',
    className: '소속 반',
    phone: '연락처',
    shuttle: '통학 셔틀',
    status: '상태',
    close: '닫기',
    editStudent: '정보 수정',
    tuition: '수강료',
    bookFee: '교재비',
    unpaidTuition: '미납 학원비',
    unpaidBook: '미납 교재비',
    totalUnpaid: '총 미납액',
    dueDate: '납부 기한 / 연체일',
    actions: '관리 작업',
    invoice: '청구서',
    reminder: '미납문자발송',
    reminderTemplateTitle: '문자 발송 편집',
    markAsPaid: '완납처리',
    allClasses: '전체 클래스',
    unpaidCountBadge: '건 미납중',
    bulkReminderBtn: '미납 전체 일괄 알림톡 발송',
    unpaidHeaderDesc: '미납금 자동 대조, 원클릭 카카오 알림톡/문자 발송 및 완납 처리 시 자동 현금영수증 발급 연동',
    unpaidRosterTitle: '미납 원생 리스트',
    noUnpaid: '현재 조건에 해당하는 미납 내역이 없습니다.',
    newStudentTitle: '신규 원생 등록',
    korNamePlaceholder: '학생 이름 (한글)',
    engNamePlaceholder: '영어 이름 (예: Leo)',
    parentPhonePlaceholder: '학부모 연락처',
    addStudentBtn: '원생 신규 추가',
    studentClassStatusTitle: '재원 학생 및 클래스 현황',
    customFieldsTitle: '확장 커스텀 속성',
    reconciliationTitle: '외부 결제 기관 입금 데이터 자동 연동 & AI 정산',
    reconciliationDesc: '국민은행 입금, 카드사 승인 내역, 지역사랑상품권(Chak) 결제 내역을 수집하여 학생 미납금과 자동 대조합니다.',
    kbBankSync: 'KB국민은행 뱅킹 연동',
    cardSync: '여신금융협회 카드 매출',
    chakSync: '지역사랑상품권 (Chak)',
    paymentRecordsTitle: '최근 자동 대조 정산 내역',
    issuedComplete: '국세청 자동발행 완료',
    cardExcluded: '카드 결제 (발급 대상 제외)',
    consultationTitle: 'AI 음성/통화 상담 자동 요약 이력',
    actionItem: '조치사항',
    homeworkTitle: '과목별 (Grammar, Phonics, Listening, Writing) AI 숙제 자동 채점',
    score: '점',
    totalClassDays: '총 수업일수',
    present: '출석',
    absent: '결석',
    late: '지각',
    kakaoSimulatorTitle: '카카오톡 학부모 출결/결석 사유 수신 시뮬레이터',
    kakaoMsgPlaceholder: '학부모 카톡 메시지',
    kakaoTestBtn: '카카오톡 사유 전송 수신 테스트',
    attendanceTab: '등원일수 & 카카오톡 사유',
    profileTab: '기본 인적사항 & 커스텀 항목',
    confirmed: '확인완료',
    save: '저장하기',
    cancel: '취소',
    kakaoHwSimulatorTitle: '카카오톡 숙제 사진 제출 & AI 피드백 자동 발송 테스트',
    selectStudent: '학생 선택',
    selectBook: '교재 선택',
    simulatedAnswerText: '학생 작성 답안 (사진 OCR 인식값)',
    simulateHwSubmitBtn: '카카오톡 사진 전송 & AI 자동 피드백 실행',
    kakaoPreviewTitle: '카카오톡 자동 전송 피드백 메시지 미리보기',
    addClassTitle: '새로운 클래스 등록',
    classNamePlaceholder: '클래스 명칭 (예: Junior Masterclass)',
    classTypeLabel: '클래스 유형',
    groupClass: '정규 그룹 클래스',
    privateClass: '1:1 개인 맞춤 수업',
    timeSlotLabel: '시간대 분류',
    schedulePlaceholder: '수업 요일 및 시간 (예: 월수금 15:20~17:10)',
    addClassBtn: '클래스 추가하기',
    unitStudent: '명',
    unitTenThousand: '만',
    unitCount: '건',
    unitDay: '일',
    receiptIssued: '발급완료',
    receiptNotIssued: '미발급',
    issueReceiptBtn: '현금영수증 즉시발행',
    templateTitleLabel: '템플릿 제목 (입력 또는 선택)',
    newMsgBtn: '새로운 문자 작성',
    msgContentLabel: '문자 내용',
    msgContentPlaceholder: '발송할 문자 내용을 입력하세요...',
    saveTemplateBtn: '문자 템플릿 저장',
    savedTemplatesTitle: '저장된 문자 템플릿 (클릭시 불러오기)',
    kakaoRecipientTitle: '카카오톡 문자 발송 대상 선택 및 개별 체크',
    selectAllBtn: '모두 선택',
    deselectAllBtn: '모두 해제',
    scopeAll: '재원생 전체 선택',
    scopeClass: '클래스별 선택',
    scopeIndividual: '개별 학생 검색 및 선택',
    searchStudentPlaceholder: '학생 이름 또는 연락처 검색...',
    sendKakaoBtn: '카카오 알림톡 발송하기',
    parentPhoneHeader: '학부모 연락처',
    sentHistoryTitle: '날짜별 문자 발송 내역 조회 및 관리',
    sentDateHeader: '발송 일시',
    recipientHeader: '수신자',
    msgTitleHeader: '문자 제목',
    msgSummaryHeader: '내용 요약',
    deleteHeader: '삭제'
  },
  EN: {
    appTitle: 'Agent AI',
    appSubtitle: 'Academy Management OS',
    navDashboard: 'Dashboard & Revenue',
    navUnpaid: 'Message Sending',
    navStudents: 'Students & Classes',
    navPayments: 'Tuition & Receipts',
    navCashReceipt: 'Cash Receipt List',
    navConsultations: 'AI Consultation Logs',
    navHomework: 'AI Homework Grading',
    navStaffMsg: 'Staff Messaging',
    aiStatus: 'AI Agent Active',
    adminRole: 'Admin / Native Teacher Account',
    headerDashboard: 'Performance Analysis & Executive Dashboard',
    headerUnpaid: 'Message Sending',
    headerStudents: 'Student Directory & Waiting List Management',
    headerPayments: 'KB Bank / Credit Card / Chak Reconciliation',
    headerCashReceipt: 'Cash Receipt Issuance Status & NTS Transmission',
    headerConsultations: 'AI Voice & Call Consultation Records',
    headerHomework: 'KakaoTalk Homework Photo Submission & AI Auto-Grading',
    headerStaffMsg: 'Internal Notices and Staff Messaging Center',
    totalRevenue: 'Total Monthly Revenue',
    unpaidAmount: 'Total Unpaid Fees',
    conversionRate: 'Lead Conversion Rate',
    activeStudents: 'Enrolled Students',
    cashReceiptStatus: 'Cash Receipt Automation',
    quickAttendanceTitle: 'Quick Attendance & Student Profiles (Click a name)',
    customFieldSettings: 'Custom Field Settings',
    newFieldPlaceholder: 'New field name (e.g. Bus Stop)',
    addBtn: 'Add',
    monthlyTrendTitle: 'Monthly Student Enrollment & Trend Chart',
    totalEnrolledLabel: 'Total Enrolled',
    newEnrolledLabel: 'New Enrolled',
    withdrawnLabel: 'Withdrawn',
    revenueAnalysisTitle: 'Deep Revenue Analysis (Tuition vs Books & YoY Comparison)',
    combinedRevenue: 'Combined Total',
    splitRevenue: 'Split Tuition/Books',
    yearlyComparison: 'Yearly YoY',
    tuitionRevLabel: 'Tuition Revenue',
    bookRevLabel: 'Book Revenue',
    studentName: 'Student Name',
    className: 'Class',
    phone: 'Phone Number',
    shuttle: 'Shuttle Bus',
    status: 'Status',
    close: 'Close',
    editStudent: 'Edit Info',
    tuition: 'Tuition',
    bookFee: 'Book Fee',
    unpaidTuition: 'Unpaid Tuition',
    unpaidBook: 'Unpaid Book Fee',
    totalUnpaid: 'Total Unpaid',
    dueDate: 'Due Date / Overdue Days',
    actions: 'Actions',
    invoice: 'Invoice',
    reminder: 'Send Unpaid Notice',
    reminderTemplateTitle: 'Message Sending & Editing',
    markAsPaid: 'Mark Paid',
    allClasses: 'All Classes',
    unpaidCountBadge: ' unpaid',
    bulkReminderBtn: 'Send Bulk Kakao Notices',
    unpaidHeaderDesc: 'Automated payment matching, 1-click Kakao payment notices, and automatic cash receipt generation upon payment completion.',
    unpaidRosterTitle: 'Unpaid Student List',
    noUnpaid: 'No unpaid records found matching criteria.',
    newStudentTitle: 'Add New Student',
    korNamePlaceholder: 'Korean Name',
    engNamePlaceholder: 'English Name (e.g. Leo)',
    parentPhonePlaceholder: 'Parent Phone Number',
    addStudentBtn: 'Add Student',
    studentClassStatusTitle: 'Enrolled Students & Class Status',
    customFieldsTitle: 'Custom Fields',
    reconciliationTitle: 'Payment Data Auto Reconciliation & AI Settlement',
    reconciliationDesc: 'Collect payment records from KB Bank, Credit Card Processors, and Local Chak Voucher to match with unpaid balances.',
    kbBankSync: 'KB Bank Sync',
    cardSync: 'Card Sales Sync',
    chakSync: 'Local Chak Voucher Sync',
    paymentRecordsTitle: 'Recent Automated Reconciliation Log',
    issuedComplete: 'NTS Cash Receipt Issued',
    cardExcluded: 'Card Payment (Receipt Excluded)',
    consultationTitle: 'AI Voice & Call Consultation Log',
    actionItem: 'Action Items',
    homeworkTitle: 'AI Homework Grading by Subject (Grammar, Phonics, Listening, Writing)',
    score: 'pts',
    totalClassDays: 'Total Days',
    present: 'Present',
    absent: 'Absent',
    late: 'Late',
    kakaoSimulatorTitle: 'KakaoTalk Attendance Reason Simulator',
    kakaoMsgPlaceholder: 'KakaoTalk message from parent',
    kakaoTestBtn: 'Simulate Receiving Kakao Msg',
    attendanceTab: 'Attendance & Kakao Reasons',
    profileTab: 'Student Profile & Custom Fields',
    confirmed: 'Confirmed',
    save: 'Save',
    cancel: 'Cancel',
    kakaoHwSimulatorTitle: 'KakaoTalk Homework Photo Submission & AI Auto-Feedback Test',
    selectStudent: 'Select Student',
    selectBook: 'Select Textbook',
    simulatedAnswerText: 'Student Answer Text (OCR Extracted from Photo)',
    simulateHwSubmitBtn: 'Simulate Photo Upload & Run AI Feedback',
    kakaoPreviewTitle: 'KakaoTalk Automated Feedback Message Preview',
    addClassTitle: 'Add New Class',
    classNamePlaceholder: 'Class Name (e.g. Junior Masterclass)',
    classTypeLabel: 'Class Type',
    groupClass: 'Regular Group Class',
    privateClass: '1:1 Private Tutoring',
    timeSlotLabel: 'Time Slot Category',
    schedulePlaceholder: 'Schedule (e.g. Mon/Wed/Fri 15:20~17:10)',
    addClassBtn: 'Add Class',
    unitStudent: 'students',
    unitTenThousand: 'M KRW',
    unitCount: 'cases',
    unitDay: 'days',
    receiptIssued: 'Issued',
    receiptNotIssued: 'Not Issued',
    issueReceiptBtn: 'Issue Cash Receipt',
    templateTitleLabel: 'Template Title (Enter or Select)',
    newMsgBtn: 'New Message',
    msgContentLabel: 'Message Content',
    msgContentPlaceholder: 'Enter message content...',
    saveTemplateBtn: 'Save Template',
    savedTemplatesTitle: 'Saved Templates (Click to load)',
    kakaoRecipientTitle: 'Select Recipients & Individual Check',
    selectAllBtn: 'Select All',
    deselectAllBtn: 'Deselect All',
    scopeAll: 'All Enrolled Students',
    scopeClass: 'By Class',
    scopeIndividual: 'Search & Select Individual',
    searchStudentPlaceholder: 'Search student name or phone...',
    sendKakaoBtn: 'Send Kakao AlimTalk',
    parentPhoneHeader: 'Parent Phone',
    sentHistoryTitle: 'Sent Message History & Management',
    sentDateHeader: 'Sent Date',
    recipientHeader: 'Recipient',
    msgTitleHeader: 'Title',
    msgSummaryHeader: 'Content Summary',
    deleteHeader: 'Delete'
  }
};

// --- INITIAL MOCK DATA DEFINITIONS ---
const INITIAL_CLASSES = [
  { id: 'cls-9', name: 'Special Speaking Intensive', schedule: '월화목 14:30~15:20', maxCap: 8, current: 2, type: 'GROUP', timeSlot: '14:30~15:20' },
  { id: 'cls-10', name: 'Bridge Phonics & Reading', schedule: '화수금 14:30~15:20', maxCap: 8, current: 2, type: 'GROUP', timeSlot: '14:30~15:20' },
  { id: 'cls-11', name: 'Master Vocabulary Builder', schedule: '월수목금 14:30~15:20', maxCap: 8, current: 2, type: 'GROUP', timeSlot: '14:30~15:20' },
  { id: 'cls-1', name: 'Elementary Phonics A', schedule: '월수금 15:20~17:10', maxCap: 12, current: 3, type: 'GROUP', timeSlot: '15:20~17:10' },
  { id: 'cls-2', name: 'Elementary Phonics B', schedule: '월수금 15:20~17:10', maxCap: 12, current: 3, type: 'GROUP', timeSlot: '15:20~17:10' },
  { id: 'cls-5', name: 'Advanced Essay A', schedule: '화목 15:20~17:10', maxCap: 10, current: 3, type: 'GROUP', timeSlot: '15:20~17:10' },
  { id: 'cls-6', name: 'Advanced Essay B', schedule: '화목 15:20~17:10', maxCap: 10, current: 3, type: 'GROUP', timeSlot: '15:20~17:10' },
  { id: 'cls-3', name: 'Intermediate Grammar A', schedule: '월수금 17:10~19:00', maxCap: 15, current: 3, type: 'GROUP', timeSlot: '17:10~19:00' },
  { id: 'cls-4', name: 'Intermediate Grammar B', schedule: '월수금 17:10~19:00', maxCap: 15, current: 3, type: 'GROUP', timeSlot: '17:10~19:00' },
  { id: 'cls-7', name: 'TOEFL Junior A', schedule: '화목 17:10~19:00', maxCap: 12, current: 3, type: 'GROUP', timeSlot: '17:10~19:00' },
  { id: 'cls-8', name: 'TOEFL Junior B', schedule: '화목 17:10~19:00', maxCap: 12, current: 3, type: 'GROUP', timeSlot: '17:10~19:00' },
  { id: 'cls-12', name: '1:1 Masterclass A', schedule: '시간 협의 (1:1 전용)', maxCap: 1, current: 1, type: 'PRIVATE', timeSlot: 'CUSTOM' },
  { id: 'cls-13', name: '1:1 Masterclass B', schedule: '시간 협의 (1:1 전용)', maxCap: 1, current: 1, type: 'PRIVATE', timeSlot: 'CUSTOM' },
  { id: 'cls-14', name: '1:1 Masterclass C', schedule: '시간 협의 (1:1 전용)', maxCap: 1, current: 1, type: 'PRIVATE', timeSlot: 'CUSTOM' }
];

const INITIAL_STUDENTS = [
  {
    id: 'std-1',
    korName: '김민준',
    engName: 'Minjun Kim',
    classId: 'cls-1',
    parentPhone: '010-1234-5678',
    studentPhone: '010-9999-1111',
    shuttleStatus: '1호차 A노선',
    customFields: { '학교': '중앙초등학교', '특이사항': '복학생', '알레르기': '없음' },
    status: 'ACTIVE',
    enrolledDate: '2025-01-10'
  },
  {
    id: 'std-2',
    korName: '이서윤',
    engName: 'Chloe Lee',
    classId: 'cls-3',
    parentPhone: '010-8765-4321',
    studentPhone: '010-8888-2222',
    shuttleStatus: '2호차 B노선',
    customFields: { '학교': '한빛초등학교', '특이사항': '영단어 암기 우수', '알레르기': '땅콩' },
    status: 'ACTIVE',
    enrolledDate: '2024-11-01'
  },
  {
    id: 'std-3',
    korName: '박하은',
    engName: 'Hannah Park',
    classId: 'cls-5',
    parentPhone: '010-5555-7777',
    studentPhone: '010-7777-3333',
    shuttleStatus: '자녀 도보',
    customFields: { '학교': '성남중학교', '특이사항': 'Writing 특화', '알레르기': '없음' },
    status: 'ACTIVE',
    enrolledDate: '2025-02-15'
  },
  {
    id: 'std-4',
    korName: '정도현',
    engName: 'Kevin Jung',
    classId: 'cls-7',
    parentPhone: '010-2222-3333',
    studentPhone: '010-2222-4444',
    shuttleStatus: '1호차 A노선',
    customFields: { '학교': '늘푸른초등학교', '특이사항': '말하기 적극적', '알레르기': '유제품' },
    status: 'ACTIVE',
    enrolledDate: '2025-01-20'
  },
  {
    id: 'std-5',
    korName: '강서아',
    engName: 'Sophia Kang',
    classId: 'cls-12',
    parentPhone: '010-4444-5555',
    studentPhone: '010-4444-6666',
    shuttleStatus: '2호차 B노선',
    customFields: { '학교': '백현초등학교', '특이사항': '1:1 맞춤 발음 교정', '알레르기': '없음' },
    status: 'ACTIVE',
    enrolledDate: '2024-12-05'
  },
  {
    id: 'std-6',
    korName: '한지호',
    engName: 'Mason Han',
    classId: 'cls-13',
    parentPhone: '010-6666-7777',
    studentPhone: '010-6666-8888',
    shuttleStatus: '자녀 도보',
    customFields: { '학교': '서현중학교', '특이사항': '1:1 토플 스피킹 집중', '알레르기': '복숭아' },
    status: 'ACTIVE',
    enrolledDate: '2025-02-01'
  },
  {
    id: 'std-7',
    korName: '오윤서',
    engName: 'Olivia Oh',
    classId: 'cls-9',
    parentPhone: '010-7777-8888',
    studentPhone: '010-7777-9999',
    shuttleStatus: '1호차 A노선',
    customFields: { '학교': '불정초등학교', '특이사항': '독서 토론 우수', '알레르기': '없음' },
    status: 'ACTIVE',
    enrolledDate: '2025-01-15'
  },
  {
    id: 'std-8',
    korName: '윤도윤',
    engName: 'Lucas Yoon',
    classId: 'cls-10',
    parentPhone: '010-9999-0000',
    studentPhone: '010-1111-2222',
    shuttleStatus: '2호차 B노선',
    customFields: { '학교': '수내중학교', '특이사항': '내신 1등급 목표', '알레르기': '메밀' },
    status: 'ACTIVE',
    enrolledDate: '2024-10-10'
  },
  {
    id: 'std-9',
    korName: '임서준',
    engName: 'Ethan Lim',
    classId: 'cls-11',
    parentPhone: '010-3333-1111',
    studentPhone: '010-3333-2222',
    shuttleStatus: '1호차 A노선',
    customFields: { '학교': '정자초등학교', '특이사항': '파닉스 수강 중', '알레르기': '없음' },
    status: 'ACTIVE',
    enrolledDate: '2025-02-10'
  },
  {
    id: 'std-10',
    korName: '조유나',
    engName: 'Emma Cho',
    classId: 'cls-14',
    parentPhone: '010-4444-2222',
    studentPhone: '010-4444-3333',
    shuttleStatus: '자녀 도보',
    customFields: { '학교': '내정초등학교', '특이사항': '1:1 에세이 첨삭', '알레르기': '계란' },
    status: 'ACTIVE',
    enrolledDate: '2025-01-05'
  }
];

const INITIAL_UNPAID_LIST = [
  {
    id: 'unpaid-1',
    studentId: 'std-1',
    studentName: '김민준',
    engName: 'Minjun Kim',
    parentPhone: '010-1234-5678',
    classId: 'cls-1',
    unpaidTuition: 280000,
    unpaidBook: 35000,
    dueDate: '2025-02-25',
    daysOverdue: 6,
    status: 'UNPAID'
  },
  {
    id: 'unpaid-2',
    studentId: 'std-2',
    studentName: '이서윤',
    engName: 'Chloe Lee',
    classId: 'cls-2',
    unpaidTuition: 320000,
    unpaidBook: 0,
    dueDate: '2025-02-20',
    daysOverdue: 11,
    status: 'UNPAID'
  },
  {
    id: 'unpaid-3',
    studentId: 'std-5',
    studentName: '강서아',
    engName: 'Sophia Kang',
    classId: 'cls-2',
    unpaidTuition: 320000,
    unpaidBook: 40000,
    dueDate: '2025-02-28',
    daysOverdue: 3,
    status: 'UNPAID'
  },
  {
    id: 'unpaid-4',
    studentId: 'std-9',
    studentName: '임서준',
    engName: 'Ethan Lim',
    classId: 'cls-1',
    unpaidTuition: 280000,
    unpaidBook: 35000,
    dueDate: '2025-02-27',
    daysOverdue: 4,
    status: 'UNPAID'
  }
];

const INITIAL_SENT_MESSAGES = [
  {
    id: 'msg-101',
    date: '2025-03-01 10:30',
    recipientName: '김민준 학부모님',
    phone: '010-1234-5678',
    title: '미납 및 행정 안내 (신속형)',
    content: '[스마트영어학원] 긴급 안내: 김민준 학부모님, 미납된 학원비(₩315,000)가 있어 안내드립니다.',
    channel: 'KAKAO_ALIMTALK'
  }
];

const INITIAL_WAITING_LIST = [
  { id: 'wait-1', studentName: '정예준', parentPhone: '010-3333-4444', requestedClassId: 'cls-2', regDate: '2025-02-20' }
];

const INITIAL_CONSULTATIONS = [
  {
    id: 'con-1',
    studentId: 'std-1',
    studentName: '김민준',
    date: '2025-02-28',
    summary: 'Phonics 발음 향상 경과 안내 및 주 1회 단어 테스트 추가 요청',
    actionItems: '교재 오디오 파일 추가 전달 완료'
  }
];

const INITIAL_PAYMENTS = [
  {
    id: 'pay-101',
    studentName: '박하은',
    amountTuition: 350000,
    amountBook: 45000,
    paymentType: 'KB국민은행 계좌입금',
    date: '2025-02-28',
    cashReceiptIssued: true,
    cashReceiptNo: '20250228-84729',
    status: 'MATCHED'
  }
];

const INITIAL_HOMEWORKS = [
  {
    id: 'hw-1',
    studentId: 'std-1',
    studentName: '김민준',
    category: 'Grammar',
    score: 95,
    studentAnswer: 'Q1: She goes to school. (정답) / Q2: They speaks English. (오답)',
    aiFeedback: '3인칭 복수 주어(They) 뒤에는 동사 원형 speak를 사용해야 합니다.'
  }
];

const INITIAL_ATTENDANCE_LOGS = {
  'std-1': {
    totalDays: 20,
    present: 18,
    absent: 1,
    late: 1,
    records: [
      {
        id: 'att-1',
        date: '2025-02-24',
        status: 'ABSENT',
        typeName: '결석 (병결)',
        reason: '소아과 진료로 인한 결석',
        source: 'KAKAO',
        kakaoMessage: '선생님 오늘 민준이 독감 증세로 소아과 다녀오느라 수업 못들어갑니다.',
        sender: '김민준 학부모',
        time: '오전 09:15',
        approved: true
      }
    ]
  }
};

const MONTHLY_TREND_DATA = [
  { month: '2024.10', total: 42, enrolled: 6, withdrawn: 2, revenue: 12400000, tuitionRev: 9800000, bookRev: 2600000, year: 2024 },
  { month: '2024.11', total: 47, enrolled: 7, withdrawn: 2, revenue: 13850000, tuitionRev: 10900000, bookRev: 2950000, year: 2024 },
  { month: '2024.12', total: 49, enrolled: 5, withdrawn: 3, revenue: 14200000, tuitionRev: 11200000, bookRev: 3000000, year: 2024 },
  { month: '2025.01', total: 56, enrolled: 9, withdrawn: 2, revenue: 16500000, tuitionRev: 13100000, bookRev: 3400000, year: 2025 },
  { month: '2025.02', total: 64, enrolled: 10, withdrawn: 2, revenue: 19100000, tuitionRev: 15100000, bookRev: 4000000, year: 2025 }
];

const INITIAL_STAFF_MESSAGES = [
  {
    id: 'staff-1',
    date: '2025-03-01 09:00',
    recipient: '전체 강사 및 직원',
    title: '3월 첫째 주 셔틀버스 운행표 확인 협조',
    content: '선생님들 환영합니다. 이번 주부터 변경된 1호차 및 2호차 노선표를 학원 인트라넷에서 확인해 주세요.'
  }
];

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lang, setLang] = useState('KR');
  const [user, setUser] = useState(null);
  const [isCloudLoaded, setIsCloudLoaded] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  
  const t = TRANSLATIONS[lang];
  const handleLogin = async (e) => {
  e.preventDefault();
  setLoginError('');

  try {
    await signInWithEmailAndPassword(auth, email, password);
    setPassword('');
  } catch (error) {
    console.error('Login error:', error);
    setLoginError(
      '로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.'
    );
  }
};
  // App States
  const [classes, setClasses] = useState(INITIAL_CLASSES);
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [unpaidList, setUnpaidList] = useState(INITIAL_UNPAID_LIST);
  const [sentMessages, setSentMessages] = useState(INITIAL_SENT_MESSAGES);
  const [waitingList, setWaitingList] = useState(INITIAL_WAITING_LIST);
  const [consultations, setConsultations] = useState(INITIAL_CONSULTATIONS);
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [homeworks, setHomeworks] = useState(INITIAL_HOMEWORKS);
  const [attendanceLogs, setAttendanceLogs] = useState(INITIAL_ATTENDANCE_LOGS);
  const [bankSettings, setBankSettings] = useState({
    bankName: 'KB국민은행',
    accountNumber: '',
    accountHolder: '',
    cardMerchantId: '',
    chakMerchantId: ''
  });

  const [selectedStudentForModal, setSelectedStudentForModal] = useState(null);
  const [customFieldKeys, setCustomFieldKeys] = useState(['학교', '특이사항', '알레르기']);
  const [newCustomKey, setNewCustomKey] = useState('');
  const [staffMessages, setStaffMessages] = useState(INITIAL_STAFF_MESSAGES);

  const updateStaffMessages = (val) => {
    setStaffMessages(val);
    saveToCloud({ staffMessages: val });
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleDownloadBackup = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      students,
      classes,
      unpaidList,
      payments,
      consultations,
      homeworks,
      attendanceLogs
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `academy_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('암호화되지 않은 JSON 백업 파일이 다운로드되었습니다. 안전하게 보관하세요.');
  };

 
useEffect(() => {
  if (!auth) {
    setAuthLoading(false);
    return;
  }

  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    setAuthLoading(false);
  });

  return () => unsubscribe();
}, []);


  useEffect(() => {
    if (!db || !user) return;
    
const stateDocRef = doc(
  db,
  'academies',
  appId,
  'users',
  user.uid,
  'data',
  'main_state'
);

    
    const unsubscribe = onSnapshot(
      stateDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data.classes) setClasses(data.classes);
          if (data.students) setStudents(data.students);
          if (data.unpaidList) setUnpaidList(data.unpaidList);
          if (data.sentMessages) setSentMessages(data.sentMessages);
          if (data.waitingList) setWaitingList(data.waitingList);
          if (data.consultations) setConsultations(data.consultations);
          if (data.payments) setPayments(data.payments);
          if (data.homeworks) setHomeworks(data.homeworks);
          if (data.attendanceLogs) setAttendanceLogs(data.attendanceLogs);
          if (data.customFieldKeys) setCustomFieldKeys(data.customFieldKeys);
          if (data.bankSettings) setBankSettings(data.bankSettings);
          if (data.staffMessages) setStaffMessages(data.staffMessages);
        } else {
          setDoc(stateDocRef, {
            classes: INITIAL_CLASSES,
            students: INITIAL_STUDENTS,
            unpaidList: INITIAL_UNPAID_LIST,
            sentMessages: INITIAL_SENT_MESSAGES,
            waitingList: INITIAL_WAITING_LIST,
            consultations: INITIAL_CONSULTATIONS,
            payments: INITIAL_PAYMENTS,
            homeworks: INITIAL_HOMEWORKS,
            attendanceLogs: INITIAL_ATTENDANCE_LOGS,
            customFieldKeys: ['학교', '특이사항', '알레르기'],
            staffMessages: INITIAL_STAFF_MESSAGES
          }).catch(e => console.error('Initial save failed:', e));
        }
        setIsCloudLoaded(true);
      },
      (error) => {
        console.error('Sync listener error:', error);
       
const stateDocRef = doc(
  db,
  'academies',
  appId,
  'users',
  user.uid,
  'data',
  'main_state'
);

      }
    );

    return () => unsubscribe();
  }, [user]);

  const saveToCloud = async (updatedFields) => {
    if (!db || !user) return;
    try {
      const stateDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'academy_os', 'main_state');
      await setDoc(stateDocRef, updatedFields, { merge: true });
    } catch (err) {
      console.error('Cloud save error:', err);
    }
  };

  const updateClasses = (val) => { setClasses(val); saveToCloud({ classes: val }); };
  const updateStudents = (val) => { setStudents(val); saveToCloud({ students: val }); };
  const updateUnpaidList = (val) => { setUnpaidList(val); saveToCloud({ unpaidList: val }); };
  const updateSentMessages = (val) => { setSentMessages(val); saveToCloud({ sentMessages: val }); };
  const updatePayments = (val) => { setPayments(val); saveToCloud({ payments: val }); };
  const updateHomeworks = (val) => { setHomeworks(val); saveToCloud({ homeworks: val }); };
  const updateCustomFieldKeys = (val) => { setCustomFieldKeys(val); saveToCloud({ customFieldKeys: val }); };
  const updateBankSettings = (val) => { setBankSettings(val); saveToCloud({ bankSettings: val }); };
  const updateAttendanceLogs = (updater) => {
    setAttendanceLogs(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveToCloud({ attendanceLogs: next });
      return next;
    });
  };

  const totalRevenue = payments.reduce((acc, curr) => acc + curr.amountTuition + curr.amountBook, 0);
  const totalTuition = payments.reduce((acc, curr) => acc + curr.amountTuition, 0);
  const totalBook = payments.reduce((acc, curr) => acc + curr.amountBook, 0);
  const totalUnpaidAmount = unpaidList.filter(u => u.status === 'UNPAID').reduce((acc, curr) => acc + curr.unpaidTuition + curr.unpaidBook, 0);
  const totalUnpaidCount = unpaidList.filter(u => u.status === 'UNPAID').length;

  const stats = {
    totalRevenue,
    totalTuition,
    totalBook,
    totalUnpaidAmount,
    totalUnpaidCount,
    conversionRate: 85,
    newInquiries: 12,
    newEnrolled: 10,
    withdrawn: 1,
    totalStudents: students.length
  };

  // Firebase 로그인 상태 확인
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        로그인 상태 확인 중...
      </div>
    );
  }

  // Firebase 설정이 없으면 대시보드 접근 차단
  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Firebase 연결 설정을 확인해 주세요.
      </div>
    );
  }

  // 로그인하지 않은 경우 관리자 로그인 화면 표시
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm space-y-4"
        >
          <h1 className="text-2xl font-bold text-center text-indigo-600">
            Agent AI 관리자 로그인
          </h1>

          <input
            type="email"
            placeholder="관리자 이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded-lg p-3"
          />

          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border rounded-lg p-3"
          />

          {loginError && (
            <p className="text-red-600 text-sm">
              {loginError}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-lg"
          >
            로그인
          </button>
        </form>
      </div>
    );
  }

  // 로그인 성공 후 기존 대시보드 표시

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white text-slate-900 font-sans tracking-tight antialiased" style={{ fontFamily: '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif' }}>
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex w-64 bg-slate-50 border-r border-slate-200 flex-col justify-between shrink-0">
        <div>
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-600/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-base text-slate-900 leading-snug tracking-tight">Agent AI</h1>
                <p className="text-[11px] text-indigo-600 font-bold">{t.appSubtitle}</p>
              </div>
            </div>
          </div>

          <nav className="p-3 space-y-1">
            <NavItem 
              icon={<BarChart3 className="w-5 h-5" />} 
              label={t.navDashboard} 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
            />
            <NavItem 
              icon={<AlertTriangle className="w-5 h-5 text-amber-500" />} 
              label={t.navUnpaid} 
              active={activeTab === 'unpaid'} 
              badge={stats.totalUnpaidCount}
              badgeColor="bg-amber-500 text-white"
              onClick={() => setActiveTab('unpaid')} 
            />
            <NavItem 
              icon={<Users className="w-5 h-5" />} 
              label={t.navStudents} 
              active={activeTab === 'students'} 
              onClick={() => setActiveTab('students')} 
            />
            <NavItem 
              icon={<CreditCard className="w-5 h-5" />} 
              label={t.navPayments} 
              active={activeTab === 'payments'} 
              onClick={() => setActiveTab('payments')} 
            />
            <NavItem 
              icon={<Receipt className="w-5 h-5 text-indigo-600" />} 
              label={t.navCashReceipt} 
              active={activeTab === 'cashReceipt'} 
              onClick={() => setActiveTab('cashReceipt')} 
            />
            <NavItem 
              icon={<PhoneCall className="w-5 h-5" />} 
              label={t.navConsultations} 
              active={activeTab === 'consultations'} 
              onClick={() => setActiveTab('consultations')} 
            />
            <NavItem 
              icon={<BookOpen className="w-5 h-5" />} 
              label={t.navHomework} 
              active={activeTab === 'homework'} 
              onClick={() => setActiveTab('homework')} 
            />
            <NavItem 
              icon={<MessageSquare className="w-5 h-5 text-emerald-600" />} 
              label={t.navStaffMsg} 
              active={activeTab === 'staff'} 
              onClick={() => setActiveTab('staff')} 
            />
          </nav>
        </div>

        {/* Local Backup & Security Action */}
        <div className="p-4 border-t border-slate-200 bg-slate-100/60 space-y-3">
          <button 
            onClick={handleDownloadBackup}
            className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs py-2 px-3 rounded-xl font-bold flex items-center justify-center space-x-2 transition shadow-2xs"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            <span>학원 PC 로컬 백업 다운로드</span>
          </button>

          <div className="text-xs font-bold text-slate-600 flex items-center justify-between pt-1">
            <span>{t.customFieldSettings}</span>
            <Settings className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="flex space-x-1 mb-2">
            <input 
              type="text" 
              placeholder={t.newFieldPlaceholder} 
              value={newCustomKey}
              onChange={(e) => setNewCustomKey(e.target.value)}
              className="w-full bg-white border border-slate-300 text-xs text-slate-900 rounded px-2 py-1.5 focus:outline-none focus:border-indigo-600 font-medium"
            />
            <button 
              onClick={() => {
                if (newCustomKey.trim() && !customFieldKeys.includes(newCustomKey.trim())) {
                  updateCustomFieldKeys([...customFieldKeys, newCustomKey.trim()]);
                  setNewCustomKey('');
                  showToast('새 커스텀 항목이 추가 및 저장되었습니다.');
                }
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-1.5 rounded text-xs px-2.5 shrink-0 font-bold transition"
            >
              {t.addBtn}
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {customFieldKeys.map(key => (
              <span key={key} className="bg-white text-slate-700 text-[10px] px-2 py-0.5 rounded-full flex items-center space-x-1 border border-slate-200 font-medium shadow-2xs">
                <span>{key}</span>
                <button onClick={() => updateCustomFieldKeys(customFieldKeys.filter(k => k !== key))} className="hover:text-red-600">×</button>
              </span>
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile Slide-over Menu */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setIsMobileDrawerOpen(false)} />
          <div className="relative w-72 max-w-[82vw] bg-white border-r border-slate-200 h-full flex flex-col justify-between z-10 p-4 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center space-x-2.5">
                  <div className="bg-indigo-600 p-1.5 rounded-xl text-white">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="font-bold text-base text-slate-900 leading-snug">Agent AI Mobile</h1>
                    <p className="text-[11px] text-indigo-600 font-bold">하이브리드 보안 백업 OS</p>
                  </div>
                </div>
                <button onClick={() => setIsMobileDrawerOpen(false)} className="p-2 text-slate-500 hover:text-slate-900 rounded-lg bg-slate-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="py-3 space-y-1">
                <NavItem 
                  icon={<BarChart3 className="w-5 h-5" />} 
                  label={t.navDashboard} 
                  active={activeTab === 'dashboard'} 
                  onClick={() => { setActiveTab('dashboard'); setIsMobileDrawerOpen(false); }} 
                />
                <NavItem 
                  icon={<AlertTriangle className="w-5 h-5 text-amber-500" />} 
                  label={t.navUnpaid} 
                  active={activeTab === 'unpaid'} 
                  badge={stats.totalUnpaidCount}
                  badgeColor="bg-amber-500 text-white"
                  onClick={() => { setActiveTab('unpaid'); setIsMobileDrawerOpen(false); }} 
                />
                <NavItem 
                  icon={<Users className="w-5 h-5" />} 
                  label={t.navStudents} 
                  active={activeTab === 'students'} 
                  onClick={() => { setActiveTab('students'); setIsMobileDrawerOpen(false); }} 
                />
                <NavItem 
                  icon={<CreditCard className="w-5 h-5" />} 
                  label={t.navPayments} 
                  active={activeTab === 'payments'} 
                  onClick={() => { setActiveTab('payments'); setIsMobileDrawerOpen(false); }} 
                />
                <NavItem 
                  icon={<Receipt className="w-5 h-5 text-indigo-600" />} 
                  label={t.navCashReceipt} 
                  active={activeTab === 'cashReceipt'} 
                  onClick={() => { setActiveTab('cashReceipt'); setIsMobileDrawerOpen(false); }} 
                />
                <NavItem 
                  icon={<PhoneCall className="w-5 h-5" />} 
                  label={t.navConsultations} 
                  active={activeTab === 'consultations'} 
                  onClick={() => { setActiveTab('consultations'); setIsMobileDrawerOpen(false); }} 
                />
                <NavItem 
                  icon={<BookOpen className="w-5 h-5" />} 
                  label={t.navHomework} 
                  active={activeTab === 'homework'} 
                  onClick={() => { setActiveTab('homework'); setIsMobileDrawerOpen(false); }} 
                />
                <NavItem 
                  icon={<MessageSquare className="w-5 h-5 text-emerald-600" />} 
                  label={t.navStaffMsg} 
                  active={activeTab === 'staff'} 
                  onClick={() => { setActiveTab('staff'); setIsMobileDrawerOpen(false); }} 
                />
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-3">
              <button 
                onClick={handleDownloadBackup}
                className="w-full bg-slate-100 border border-slate-200 text-slate-800 text-xs py-2.5 px-3 rounded-xl font-bold flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4 text-indigo-600" />
                <span>로컬 백업 다운로드</span>
              </button>

              <div className="text-xs font-bold text-slate-600 mb-2 flex items-center justify-between">
                <span>{t.customFieldSettings}</span>
                <Settings className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <div className="flex space-x-1 mb-2">
                <input 
                  type="text" 
                  placeholder={t.newFieldPlaceholder} 
                  value={newCustomKey}
                  onChange={(e) => setNewCustomKey(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-xs text-slate-900 rounded-lg px-2.5 py-2 focus:outline-none focus:border-indigo-600 font-medium"
                />
                <button 
                  onClick={() => {
                    if (newCustomKey.trim() && !customFieldKeys.includes(newCustomKey.trim())) {
                      updateCustomFieldKeys([...customFieldKeys, newCustomKey.trim()]);
                      setNewCustomKey('');
                      showToast('새 커스텀 항목이 추가 및 저장되었습니다.');
                    }
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs px-3 py-2 shrink-0 font-bold"
                >
                  {t.addBtn}
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {customFieldKeys.map(key => (
                  <span key={key} className="bg-slate-100 text-slate-800 text-[11px] px-2.5 py-1 rounded-full flex items-center space-x-1 border border-slate-200 font-medium">
                    <span>{key}</span>
                    <button onClick={() => updateCustomFieldKeys(customFieldKeys.filter(k => k !== key))} className="hover:text-red-600 ml-1">×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-50 relative">
        {toastMessage && (
          <div className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:right-6 z-50 bg-indigo-600 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl border border-indigo-500 flex items-center space-x-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header */}
        <header className="h-14 md:h-16 border-b border-slate-200 bg-white/90 backdrop-blur px-3 md:px-6 flex items-center justify-between shrink-0 gap-2 shadow-2xs">
          <div className="flex items-center space-x-2.5 min-w-0">
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="md:hidden p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm md:text-base font-bold text-slate-900 truncate tracking-tight">
              {activeTab === 'dashboard' && t.headerDashboard}
              {activeTab === 'unpaid' && t.headerUnpaid}
              {activeTab === 'students' && t.headerStudents}
              {activeTab === 'payments' && t.headerPayments}
              {activeTab === 'cashReceipt' && t.headerCashReceipt}
              {activeTab === 'consultations' && t.headerConsultations}
              {activeTab === 'homework' && t.headerHomework}
              {activeTab === 'staff' && t.headerStaffMsg}
            </h2>
          </div>

          <div className="flex items-center space-x-1.5 md:space-x-3 shrink-0">
            <button
              onClick={handleDownloadBackup}
              className="bg-slate-100 hover:bg-slate-200 text-indigo-700 border border-slate-200 text-[11px] md:text-xs px-2.5 py-1.5 rounded-xl font-bold transition flex items-center space-x-1 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">PC 백업</span>
            </button>

            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 rounded-full font-bold flex items-center space-x-1 shadow-2xs">
              <Cloud className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
              <span className="hidden sm:inline">{!db ? '데모 모드 (저장 안 됨)' : isCloudLoaded ? '클라우드 연결 확인 필요' : 'Syncing...'}</span>
              <span className="sm:hidden">{!db ? '데모' : isCloudLoaded ? '연결 확인' : '...'}</span>
            </span>

            <button
              onClick={() => setLang(prev => prev === 'KR' ? 'EN' : 'KR')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-[11px] md:text-xs px-2.5 md:px-3 py-1.5 rounded-xl font-bold transition flex items-center space-x-1 shadow-2xs"
            >
              <Globe className="w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-600" />
              <span>{lang === 'KR' ? 'EN' : 'KR'}</span>
            </button>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <div className="flex-1 overflow-y-auto p-3.5 md:p-6 pb-24 md:pb-6 space-y-5 md:space-y-6">
          {activeTab === 'dashboard' && (
            <DashboardView 
              stats={stats} 
              payments={payments} 
              students={students} 
              unpaidList={unpaidList} 
              setActiveTab={setActiveTab} 
              setSelectedStudentForModal={setSelectedStudentForModal}
              t={t}
              lang={lang}
            />
          )}

          {activeTab === 'unpaid' && (
            <UnpaidManagementView 
              unpaidList={unpaidList} 
              setUnpaidList={updateUnpaidList} 
              sentMessages={sentMessages}
              setSentMessages={updateSentMessages}
              students={students} 
              classes={classes} 
              setPayments={updatePayments}
              payments={payments}
              setSelectedStudentForModal={setSelectedStudentForModal}
              showToast={showToast}
              t={t}
            />
          )}

          {activeTab === 'students' && (
            <StudentManagementView 
              students={students} 
              setStudents={updateStudents}
              classes={classes}
              setClasses={updateClasses}
              waitingList={waitingList}
              setWaitingList={setWaitingList}
              customFieldKeys={customFieldKeys}
              setSelectedStudentForModal={setSelectedStudentForModal}
              showToast={showToast}
              t={t}
            />
          )}

          {activeTab === 'payments' && (
            <PaymentReconciliationView 
              payments={payments} 
              setPayments={updatePayments} 
              students={students} 
              setSelectedStudentForModal={setSelectedStudentForModal}
              bankSettings={bankSettings}
              setBankSettings={updateBankSettings}
              showToast={showToast}
              t={t}
            />
          )}

          {activeTab === 'cashReceipt' && (
            <CashReceiptManagementView
              payments={payments}
              setPayments={updatePayments}
              students={students}
              showToast={showToast}
              t={t}
            />
          )}

          {activeTab === 'consultations' && (
            <ConsultationAIView 
              consultations={consultations} 
              setConsultations={setConsultations} 
              students={students} 
              setSelectedStudentForModal={setSelectedStudentForModal}
              t={t}
            />
          )}

          {activeTab === 'homework' && (
            <HomeworkAIView 
              homeworks={homeworks} 
              setHomeworks={updateHomeworks} 
              students={students} 
              setSelectedStudentForModal={setSelectedStudentForModal}
              showToast={showToast}
              t={t}
            />
          )}

          {activeTab === 'staff' && (
            <StaffMessagingView 
              staffMessages={staffMessages}
              setStaffMessages={updateStaffMessages}
              showToast={showToast}
              t={t}
            />
          )}
        </div>
      </main>

      {/* Student Profile & Attendance Modal */}
      {selectedStudentForModal && (
        <StudentDetailModal
          student={selectedStudentForModal}
          onClose={() => setSelectedStudentForModal(null)}
          attendanceLogs={attendanceLogs}
          setAttendanceLogs={updateAttendanceLogs}
          customFieldKeys={customFieldKeys}
          students={students}
          setStudents={updateStudents}
          sentMessages={sentMessages}
          showToast={showToast}
          t={t}
        />
      )}
    </div>
  );
}

// --- CONSULTATION AI VIEW COMPONENT ---
function ConsultationAIView({ consultations, setConsultations, students, setSelectedStudentForModal, t }) {
  const [newSummary, setNewSummary] = useState('');
  const [selectedStName, setSelectedStName] = useState(students[0]?.korName || '');

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
          <PhoneCall className="w-4 h-4 text-indigo-600" />
          <span>{t.consultationTitle}</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select
            value={selectedStName}
            onChange={(e) => setSelectedStName(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
          >
            {students.map(s => (
              <option key={s.id} value={s.korName}>{s.korName} ({s.engName})</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="상담 요약 내용 입력..."
            value={newSummary}
            onChange={(e) => setNewSummary(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold sm:col-span-2"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => {
              if (!newSummary.trim()) return;
              const newItem = {
                id: `con-${Date.now()}`,
                studentName: selectedStName,
                date: new Date().toISOString().split('T')[0],
                summary: newSummary,
                actionItems: '교재 오디오 전달 완료'
              };
              setConsultations([newItem, ...consultations]);
              setNewSummary('');
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md"
          >
            AI 상담 기록 저장
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 font-bold text-slate-900 text-sm">상담 이력 아카이브</div>
        <div className="divide-y divide-slate-100">
          {consultations.map(con => (
            <div key={con.id} className="p-4 space-y-1 text-xs">
              <div className="flex justify-between font-bold text-slate-900">
                <span>{con.studentName} 학생 상담</span>
                <span className="text-slate-400 font-mono">{con.date}</span>
              </div>
              <div className="text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                {con.summary}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- HOMEWORK AI VIEW COMPONENT ---
function HomeworkAIView({ homeworks, setHomeworks, students, setSelectedStudentForModal, showToast, t }) {
  const [selectedStudentName, setSelectedStudentName] = useState(students[0]?.korName || '');
  const [category, setCategory] = useState('Grammar');
  const [answerText, setAnswerText] = useState('Q1: She goes to school. / Q2: They speaks English.');

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>{t.homeworkTitle}</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select
            value={selectedStudentName}
            onChange={(e) => setSelectedStudentName(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
          >
            {students.map(s => (
              <option key={s.id} value={s.korName}>{s.korName} ({s.engName})</option>
            ))}
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
          >
            <option value="Grammar">Grammar (문법)</option>
            <option value="Phonics">Phonics (파닉스)</option>
            <option value="Listening">Listening (듣기)</option>
            <option value="Writing">Writing (에세이)</option>
          </select>
          <input
            type="text"
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder={t.simulatedAnswerText}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold sm:col-span-3"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => {
              const newHw = {
                id: `hw-${Date.now()}`,
                studentName: selectedStudentName,
                category,
                score: 92,
                studentAnswer: answerText,
                aiFeedback: '3인칭 단복수 일치 규칙에 맞게 문장 구조가 훌륭히 작성되었습니다.'
              };
              setHomeworks([newHw, ...homeworks]);
              showToast('AI 자동 채점 및 피드백 카카오톡 발송이 완료되었습니다.');
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md"
          >
            {t.simulateHwSubmitBtn}
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 font-bold text-slate-900 text-sm">과제 채점 및 AI 피드백 내역</div>
        <div className="divide-y divide-slate-100">
          {homeworks.map(hw => (
            <div key={hw.id} className="p-4 space-y-2 text-xs">
              <div className="flex justify-between items-center font-bold">
                <span className="text-slate-900">{hw.studentName} ({hw.category})</span>
                <span className="bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-full font-mono">{hw.score}{t.score}</span>
              </div>
              <div className="text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                답안: {hw.studentAnswer}
              </div>
              <div className="text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                🤖 AI 피드백: {hw.aiFeedback}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- STAFF MESSAGING VIEW COMPONENT ---
function StaffMessagingView({ staffMessages, setStaffMessages, showToast, t }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
          <MessageSquare className="w-4 h-4 text-emerald-600" />
          <span>직원 및 강사 공지사항 전송</span>
        </h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="공지 제목 입력..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
          />
          <textarea
            rows="3"
            placeholder="공지 내용 입력..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => {
              if (!title.trim() || !content.trim()) return;
              const newMsg = {
                id: `staff-${Date.now()}`,
                date: new Date().toISOString().replace('T', ' ').substring(0, 16),
                recipient: '전체 강사 및 직원',
                title,
                content
              };
              setStaffMessages([newMsg, ...staffMessages]);
              setTitle('');
              setContent('');
              showToast('강사 및 직원 단톡방으로 공지가 발송되었습니다.');
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md"
          >
            직원 공지 즉시 전송
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 font-bold text-slate-900 text-sm">사내 공지 및 메시지 이력</div>
        <div className="divide-y divide-slate-100">
          {staffMessages.map(msg => (
            <div key={msg.id} className="p-4 space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900">{msg.title}</span>
                <span className="text-slate-400 font-mono">{msg.date}</span>
              </div>
              <div className="text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 leading-relaxed">
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- DASHBOARD VIEW COMPONENT ---
function DashboardView({ stats, payments, students, unpaidList, setActiveTab, setSelectedStudentForModal, t, lang }) {
  return (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500">{t.totalRevenue}</div>
            <div className="text-xl font-bold text-slate-900 font-mono mt-1">₩{stats.totalRevenue.toLocaleString()}</div>
            <div className="text-[11px] text-emerald-600 font-bold mt-1">↑ 14.2% from last month</div>
          </div>
          <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500">{t.unpaidAmount}</div>
            <div className="text-xl font-bold text-amber-600 font-mono mt-1">₩{stats.totalUnpaidAmount.toLocaleString()}</div>
            <div className="text-[11px] text-amber-600 font-bold mt-1">{stats.totalUnpaidCount}{t.unpaidCountBadge}</div>
          </div>
          <div className="bg-amber-50 p-3 rounded-xl text-amber-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500">{t.conversionRate}</div>
            <div className="text-xl font-bold text-indigo-600 font-mono mt-1">{stats.conversionRate}%</div>
            <div className="text-[11px] text-indigo-600 font-bold mt-1">Target: 60% (Achieved)</div>
          </div>
          <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500">{t.activeStudents}</div>
            <div className="text-xl font-bold text-slate-900 font-mono mt-1">{stats.totalStudents}{t.unitStudent}</div>
            <div className="text-[11px] text-slate-500 font-bold mt-1">자동 현금영수증 처리</div>
          </div>
          <div className="bg-slate-100 p-3 rounded-xl text-slate-600">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Monthly Trend Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-900 text-sm">{t.monthlyTrendTitle}</h3>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">실시간 데이터 연동</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {MONTHLY_TREND_DATA.map((item, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span>{item.month}</span>
                <span className="text-indigo-600">{item.total}{t.unitStudent}</span>
              </div>
              <div className="space-y-1 text-[11px] text-slate-600">
                <div className="flex justify-between">
                  <span>총 재원생</span>
                  <span className="font-bold font-mono">{item.total}명</span>
                </div>
                <div className="flex justify-between">
                  <span>신규 등록</span>
                  <span className="font-bold text-emerald-600 font-mono">+{item.enrolled}</span>
                </div>
                <div className="flex justify-between">
                  <span>퇴원생</span>
                  <span className="font-bold text-red-600 font-mono">-{item.withdrawn}</span>
                </div>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${(item.total / 80) * 100}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Analysis Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-900 text-sm">{t.revenueAnalysisTitle}</h3>
          <div className="flex space-x-1">
            <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-lg font-bold">합산 총 매출</span>
            <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-lg font-bold">수업료/교재비 각각 분할</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {MONTHLY_TREND_DATA.map((item, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
              <div className="text-xs font-bold text-slate-700">{item.month} 합산 매출</div>
              <div className="text-sm font-bold font-mono text-slate-900">₩{item.revenue.toLocaleString()}</div>
              <div className="text-[10px] text-slate-500 space-y-0.5 pt-1 border-t border-slate-200">
                <div className="flex justify-between">
                  <span>수업료:</span>
                  <span className="font-mono">₩{item.tuitionRev.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>교재비:</span>
                  <span className="font-mono">₩{item.bookRev.toLocaleString()}</span>
                </div>
              </div>
              <div className="w-full bg-emerald-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${(item.revenue / 20000000) * 100}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Attendance & Student Profile Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 text-sm">{t.quickAttendanceTitle}</h3>
          <button
            onClick={() => setActiveTab('students')}
            className="text-xs font-bold text-indigo-600 hover:underline"
          >
            재원생 프로필 바로가기
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="p-3.5">{t.studentName}</th>
                <th className="p-3.5">{t.phone}</th>
                <th className="p-3.5">{t.shuttle}</th>
                <th className="p-3.5 text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map(st => (
                <tr key={st.id} className="hover:bg-slate-50 transition">
                  <td className="p-3.5 font-bold text-slate-900">
                    <button
                      onClick={() => setSelectedStudentForModal(st)}
                      className="text-indigo-600 hover:underline flex items-center space-x-1.5"
                    >
                      <User className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{st.korName} ({st.engName})</span>
                    </button>
                  </td>
                  <td className="p-3.5 font-mono text-slate-600">{st.parentPhone}</td>
                  <td className="p-3.5 text-slate-700">{st.shuttleStatus || '도보'}</td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setSelectedStudentForModal(st)}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-3 py-1.5 rounded-xl border border-indigo-200 transition text-[11px]"
                    >
                      프로필 보기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- STUDENT MANAGEMENT VIEW COMPONENT ---
function StudentManagementView({ students, setStudents, classes, setClasses, waitingList, setWaitingList, customFieldKeys, setSelectedStudentForModal, showToast, t }) {
  const [activeViewMode, setActiveViewMode] = useState('ALL'); // 'ALL' or classId
  const [isNewStudentModalOpen, setIsNewStudentModalOpen] = useState(false);
  const [isNewClassModalOpen, setIsNewClassModalOpen] = useState(false);

  // New Student Form States
  const [korName, setKorName] = useState('');
  const [engName, setEngName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [shuttleStatus, setShuttleStatus] = useState('1호차 A노선');

  // New Class Form States
  const [newClassName, setNewClassName] = useState('');
  const [newClassType, setNewClassType] = useState('GROUP');
  const [newTimeSlot, setNewTimeSlot] = useState('14:30~15:20');
  const [newSchedule, setNewSchedule] = useState('월화목 14:30~15:20');

  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!korName.trim() || !parentPhone.trim()) {
      showToast('학생 이름과 연락처를 입력해주세요.');
      return;
    }
    const newSt = {
      id: `std-${Date.now()}`,
      korName: korName.trim(),
      engName: engName.trim() || 'Student',
      classId: selectedClassId,
      parentPhone: parentPhone.trim(),
      studentPhone: '010-0000-0000',
      shuttleStatus: shuttleStatus,
      customFields: {},
      status: 'ACTIVE',
      enrolledDate: new Date().toISOString().split('T')[0]
    };
    setStudents([newSt, ...students]);
    setKorName('');
    setEngName('');
    setParentPhone('');
    setIsNewStudentModalOpen(false);
    showToast(`${newSt.korName} 신규 원생이 성공적으로 등록되었습니다.`);
  };

  const handleAddClass = (e) => {
    e.preventDefault();
    if (!newClassName.trim()) {
      showToast('클래스 명칭을 입력해주세요.');
      return;
    }
    const newCls = {
      id: `cls-${Date.now()}`,
      name: newClassName.trim(),
      schedule: newSchedule.trim(),
      maxCap: newClassType === 'PRIVATE' ? 1 : 12,
      current: 0,
      type: newClassType,
      timeSlot: newTimeSlot
    };
    setClasses([...classes, newCls]);
    setNewClassName('');
    setIsNewClassModalOpen(false);
    showToast(`새로운 클래스 [${newCls.name}]가 성공적으로 등록되었습니다.`);
  };

  // Group classes by time slot
  const timeSlotsOrder = ['14:30~15:20', '15:20~17:10', '17:10~19:00', 'CUSTOM'];

  return (
    <div className="space-y-6">
      {/* Top Toggle Switch */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveViewMode('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeViewMode === 'ALL' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            전체 재원생 보기 ({students.length}명)
          </button>
          <div className="h-5 w-[1px] bg-slate-300 mx-1"></div>
          <select
            value={activeViewMode}
            onChange={(e) => setActiveViewMode(e.target.value)}
            className="bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
          >
            <option value="ALL">-- 클래스별 선택 보기 --</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.schedule})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Regular Classes & Enrollment Status Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-6 shadow-sm">
        <div className="border-b border-slate-200 pb-3">
          <h3 className="font-bold text-slate-900 text-sm">정규 클래스 시간표 및 재원 현황</h3>
          <p className="text-xs text-slate-500 mt-0.5">시간대별 정규 그룹 클래스 및 1:1 개인 맞춤 수업 현황입니다.</p>
        </div>

        <div className="space-y-6">
          {timeSlotsOrder.map(slot => {
            const slotClasses = classes.filter(c => c.timeSlot === slot);
            if (slotClasses.length === 0) return null;

            return (
              <div key={slot} className="space-y-3">
                <div className="bg-indigo-50 border border-indigo-200 text-indigo-900 px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2">
                  <span className="bg-indigo-600 text-white px-2 py-0.5 rounded text-[11px] font-mono">{slot} 시간대</span>
                  <span>({slotClasses.map(c => c.schedule).join(', ')})</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {slotClasses.map(cls => {
                    const enrolledStudents = students.filter(s => s.classId === cls.id);
                    return (
                      <div key={cls.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-slate-900 text-xs">{cls.name}</h4>
                            <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                              {enrolledStudents.length}명
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">{cls.schedule}</div>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-slate-200">
                          {enrolledStudents.length === 0 ? (
                            <div className="text-[11px] text-slate-400 py-3 text-center">배정된 학생이 없습니다.</div>
                          ) : (
                            enrolledStudents.map(st => (
                              <div key={st.id} className="bg-white border border-slate-200 rounded-xl p-2.5 flex items-center justify-between text-xs">
                                <div>
                                  <div className="font-bold text-slate-900">{st.korName} ({st.engName})</div>
                                  <div className="text-[10px] text-slate-500 font-mono">{st.parentPhone} | {st.shuttleStatus || '도보'}</div>
                                </div>
                                <button
                                  onClick={() => setSelectedStudentForModal(st)}
                                  className="text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded font-bold text-[11px]"
                                >
                                  프로필
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* New Student & New Class Buttons Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-end gap-3 shadow-sm">
        <button
          onClick={() => setIsNewStudentModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md transition flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>원생 신규 추가</span>
        </button>
        <button
          onClick={() => setIsNewClassModalOpen(true)}
          className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md transition flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>클래스 추가하기</span>
        </button>
      </div>

      {/* Student List View based on filter */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 font-bold text-slate-900 text-sm">
          {activeViewMode === 'ALL' ? '전체 재원생 명단' : `선택된 클래스 재원생 명단`}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="p-3.5">{t.studentName}</th>
                <th className="p-3.5">{t.className}</th>
                <th className="p-3.5">{t.parentPhoneHeader}</th>
                <th className="p-3.5">{t.shuttle}</th>
                <th className="p-3.5 text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students
                .filter(s => activeViewMode === 'ALL' || s.classId === activeViewMode)
                .map(st => {
                  const assignedClass = classes.find(c => c.id === st.classId);
                  return (
                    <tr key={st.id} className="hover:bg-slate-50 transition">
                      <td className="p-3.5 font-bold text-slate-900">
                        <button onClick={() => setSelectedStudentForModal(st)} className="text-indigo-600 hover:underline">
                          {st.korName} ({st.engName})
                        </button>
                      </td>
                      <td className="p-3.5 text-slate-700">{assignedClass ? assignedClass.name : '미배정'}</td>
                      <td className="p-3.5 font-mono text-slate-600">{st.parentPhone}</td>
                      <td className="p-3.5 text-slate-600">{st.shuttleStatus || '도보'}</td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setSelectedStudentForModal(st)}
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-3 py-1.5 rounded-xl border border-indigo-200 transition text-[11px]"
                        >
                          프로필 보기
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Student Modal */}
      {isNewStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-base">신규 원생 등록</h3>
              <button onClick={() => setIsNewStudentModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddStudent} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">학생 이름 (한글)</label>
                <input
                  type="text"
                  required
                  value={korName}
                  onChange={(e) => setKorName(e.target.value)}
                  placeholder="예: 김민준"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">영어 이름</label>
                <input
                  type="text"
                  value={engName}
                  onChange={(e) => setEngName(e.target.value)}
                  placeholder="예: Minjun"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">학부모 연락처</label>
                <input
                  type="text"
                  required
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  placeholder="010-0000-0000"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">소속 클래스 선택</label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.schedule})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">통학 셔틀 노선</label>
                <input
                  type="text"
                  value={shuttleStatus}
                  onChange={(e) => setShuttleStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewStudentModalOpen(false)}
                  className="bg-slate-100 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md"
                >
                  원생 신규 추가
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Class Modal */}
      {isNewClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-base">새로운 클래스 등록</h3>
              <button onClick={() => setIsNewClassModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddClass} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">클래스 명칭</label>
                <input
                  type="text"
                  required
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="예: TOEFL Masterclass"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">클래스 유형</label>
                <select
                  value={newClassType}
                  onChange={(e) => setNewClassType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                >
                  <option value="GROUP">정규 그룹 클래스</option>
                  <option value="PRIVATE">1:1 개인 맞춤 수업</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">시간대 분류</label>
                <select
                  value={newTimeSlot}
                  onChange={(e) => setNewTimeSlot(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                >
                  <option value="14:30~15:20">14:30 ~ 15:20 시간대</option>
                  <option value="15:20~17:10">15:20 ~ 17:10 시간대</option>
                  <option value="17:10~19:00">17:10 ~ 19:00 시간대</option>
                  <option value="CUSTOM">1:1 맞춤 시간 협의</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">수업 요일 및 시간</label>
                <input
                  type="text"
                  value={newSchedule}
                  onChange={(e) => setNewSchedule(e.target.value)}
                  placeholder="예: 월수금 15:20~17:10"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewClassModalOpen(false)}
                  className="bg-slate-100 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md"
                >
                  클래스 추가하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- PAYMENT RECONCILIATION VIEW COMPONENT ---
function PaymentReconciliationView({ payments, setPayments, students, setSelectedStudentForModal, bankSettings, setBankSettings, showToast, t }) {
  const [amountTuition, setAmountTuition] = useState(300000);
  const [amountBook, setAmountBook] = useState(35000);
  const [selectedStudentName, setSelectedStudentName] = useState(students[0]?.korName || '');
  const [paymentType, setPaymentType] = useState('KB국민은행 계좌입금');

  const handleManualPaymentAdd = (e) => {
    e.preventDefault();
    const newPay = {
      id: `pay-${Date.now()}`,
      studentName: selectedStudentName,
      amountTuition: Number(amountTuition),
      amountBook: Number(amountBook),
      paymentType: paymentType,
      date: new Date().toISOString().split('T')[0],
      cashReceiptIssued: true,
      cashReceiptNo: `2025-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'MATCHED'
    };
    setPayments([newPay, ...payments]);
    showToast(`${selectedStudentName} 학생의 수납 및 현금영수증 자동발행이 완료되었습니다.`);
  };

  return (
    <div className="space-y-6">
      {/* Reconciliation Description */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
          <Receipt className="w-4 h-4 text-indigo-600" />
          <span>{t.reconciliationTitle}</span>
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">{t.reconciliationDesc}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">{t.kbBankSync}</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">연동완료</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">{t.cardSync}</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">연동완료</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">{t.chakSync}</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">연동완료</span>
          </div>
        </div>
      </div>

      {/* Manual Payment & Auto-Receipt Registration */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h3 className="font-bold text-slate-900 text-sm">입금 내역 수동 등록 & 현금영수증 자동발행</h3>
        <form onSubmit={handleManualPaymentAdd} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">{t.studentName}</label>
            <select
              value={selectedStudentName}
              onChange={(e) => setSelectedStudentName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
            >
              {students.map(s => (
                <option key={s.id} value={s.korName}>{s.korName} ({s.engName})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">수업료 (₩)</label>
            <input
              type="number"
              value={amountTuition}
              onChange={(e) => setAmountTuition(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">교재비 (₩)</label>
            <input
              type="number"
              value={amountBook}
              onChange={(e) => setAmountBook(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold font-mono"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition"
            >
              입금 확정 및 현금영수증 발행
            </button>
          </div>
        </form>
      </div>

      {/* Payment Records Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 font-bold text-slate-900 text-sm">
          {t.paymentRecordsTitle}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="p-3.5">학생명</th>
                <th className="p-3.5">결제 채널</th>
                <th className="p-3.5">수업료</th>
                <th className="p-3.5">교재비</th>
                <th className="p-3.5">현금영수증 번호</th>
                <th className="p-3.5 text-right">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map(pay => (
                <tr key={pay.id} className="hover:bg-slate-50 transition">
                  <td className="p-3.5 font-bold text-slate-900">{pay.studentName}</td>
                  <td className="p-3.5 text-slate-700">{pay.paymentType}</td>
                  <td className="p-3.5 font-mono">₩{pay.amountTuition.toLocaleString()}</td>
                  <td className="p-3.5 font-mono">₩{pay.amountBook.toLocaleString()}</td>
                  <td className="p-3.5 font-mono text-indigo-600">{pay.cashReceiptNo || '-'}</td>
                  <td className="p-3.5 text-right">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">발행완료</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- CASH RECEIPT MANAGEMENT VIEW COMPONENT ---
function CashReceiptManagementView({ payments, setPayments, students, showToast, t }) {
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL', 'ISSUED', 'NOT_ISSUED'

  const handleIssueReceipt = (paymentId) => {
    const updated = payments.map(p => {
      if (p.id === paymentId) {
        return {
          ...p,
          cashReceiptIssued: true,
          cashReceiptNo: `2025-${Math.floor(10000 + Math.random() * 90000)}`
        };
      }
      return p;
    });
    setPayments(updated);
    showToast('현금영수증이 국세청으로 즉시 발급 및 전송되었습니다.');
  };

  const filteredPayments = payments.filter(p => {
    if (filterStatus === 'ISSUED') return p.cashReceiptIssued;
    if (filterStatus === 'NOT_ISSUED') return !p.cashReceiptIssued;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
            <Receipt className="w-4 h-4 text-indigo-600" />
            <span>학원 계좌 입금 교육비 현금영수증 발행 관리</span>
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${filterStatus === 'ALL' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              전체 보기
            </button>
            <button
              onClick={() => setFilterStatus('ISSUED')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${filterStatus === 'ISSUED' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              발급완료
            </button>
            <button
              onClick={() => setFilterStatus('NOT_ISSUED')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${filterStatus === 'NOT_ISSUED' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              미발급
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          학원 무통장 입금 계좌로 입금된 수강료 및 교재비 내역에 대해 학부모 요청 시 즉시 현금영수증을 발급하고 국세청 전송 상태를 실시간으로 확인할 수 있습니다.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 font-bold text-slate-900 text-sm">
          입금 및 현금영수증 발급 현황 리스트
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="p-3.5">입금일자</th>
                <th className="p-3.5">{t.studentName}</th>
                <th className="p-3.5">결제 채널</th>
                <th className="p-3.5">수업료 / 교재비</th>
                <th className="p-3.5">발급 상태</th>
                <th className="p-3.5">국세청 승인번호</th>
                <th className="p-3.5 text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">조회된 입금 내역이 없습니다.</td>
                </tr>
              ) : (
                filteredPayments.map(pay => (
                  <tr key={pay.id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-mono text-slate-500">{pay.date}</td>
                    <td className="p-3.5 font-bold text-slate-900">{pay.studentName}</td>
                    <td className="p-3.5 text-slate-700">{pay.paymentType}</td>
                    <td className="p-3.5 font-mono">
                      ₩{(pay.amountTuition + pay.amountBook).toLocaleString()} <span className="text-[10px] text-slate-400">(수업료 ₩{pay.amountTuition.toLocaleString()})</span>
                    </td>
                    <td className="p-3.5">
                      {pay.cashReceiptIssued ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full">{t.receiptIssued}</span>
                      ) : (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full">{t.receiptNotIssued}</span>
                      )}
                    </td>
                    <td className="p-3.5 font-mono text-indigo-600 font-bold">{pay.cashReceiptNo || '-'}</td>
                    <td className="p-3.5 text-right">
                      {!pay.cashReceiptIssued ? (
                        <button
                          onClick={() => handleIssueReceipt(pay.id)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-xl transition text-[11px] shadow-2xs"
                        >
                          {t.issueReceiptBtn}
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px] font-bold">발급 완료됨</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- UNPAID MANAGEMENT VIEW COMPONENT ---
function UnpaidManagementView({ unpaidList, setUnpaidList, sentMessages, setSentMessages, students, classes, setPayments, payments, setSelectedStudentForModal, showToast, t }) {
  const [selectedTemplateTitle, setSelectedTemplateTitle] = useState('미납 및 행정 안내 (신속형)');
  const [msgContent, setMsgContent] = useState('[스마트영어학원] 학부모님, 금원 미납된 수강료/교재비가 있어 안내드립니다. 원활한 수업 진행을 위해 납부를 부탁드립니다.');
  const [savedTemplates, setSavedTemplates] = useState([
    { id: 'tpl-1', title: '미납 및 행정 안내 (신속형)', content: '[스마트영어학원] 학부모님, 금원 미납된 수강료/교재비가 있어 안내드립니다. 원활한 수업 진행을 위해 납부를 부탁드립니다.' },
    { id: 'id-2', title: '독촉 및 수업 제한 경고', content: '[스마트영어학원] 장기 미납으로 인해 다음 주 수업 참여에 제한이 있을 수 있으니 빠른 정산을 부탁드립니다.' }
  ]);
  const [recipientScope, setRecipientScope] = useState('ALL'); // 'ALL', 'CLASS', 'INDIVIDUAL'
  const [targetClassId, setTargetClassId] = useState(classes[0]?.id || '');
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState(students.map(s => s.id));

  const handleSelectAll = () => setSelectedStudentIds(students.map(s => s.id));
  const handleDeselectAll = () => setSelectedStudentIds([]);

  const handleToggleStudentCheck = (stId) => {
    if (selectedStudentIds.includes(stId)) {
      setSelectedStudentIds(selectedStudentIds.filter(id => id !== stId));
    } else {
      setSelectedStudentIds([...selectedStudentIds, stId]);
    }
  };

  const currentFilteredStudents = students.filter(st => {
    if (recipientScope === 'CLASS') return st.classId === targetClassId;
    if (recipientScope === 'INDIVIDUAL' && studentSearchQuery.trim()) {
      return st.korName.includes(studentSearchQuery) || st.parentPhone.includes(studentSearchQuery);
    }
    return true;
  });

  const handleSendKakaoBatch = () => {
    if (selectedStudentIds.length === 0) {
      showToast('발송할 학생을 한 명 이상 선택해주세요.');
      return;
    }
    const newHistory = selectedStudentIds.map(stId => {
      const st = students.find(s => s.id === stId);
      return {
        id: `msg-${Date.now()}-${Math.random()}`,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        recipientName: st ? `${st.korName} 학부모님` : '학부모님',
        phone: st ? st.parentPhone : '010-0000-0000',
        title: selectedTemplateTitle,
        content: msgContent,
        channel: 'KAKAO_ALIMTALK'
      };
    });
    setSentMessages([...newHistory, ...sentMessages]);
    showToast(`선택된 ${selectedStudentIds.length}명에게 카카오 알림톡이 성공적으로 발송되었습니다.`);
  };

  const handleMarkAsPaid = (item) => {
    const updated = unpaidList.filter(u => u.id !== item.id);
    setUnpaidList(updated);
    const newPay = {
      id: `pay-${Date.now()}`,
      studentName: item.studentName,
      amountTuition: item.unpaidTuition,
      amountBook: item.unpaidBook,
      paymentType: 'KB국민은행 계좌입금 (미납 완납)',
      date: new Date().toISOString().split('T')[0],
      cashReceiptIssued: true,
      cashReceiptNo: `2025-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'MATCHED'
    };
    setPayments([newPay, ...payments]);
    showToast(`${item.studentName} 학생의 미납금이 완납 처리되었으며 현금영수증이 자동 발급되었습니다.`);
  };

  return (
    <div className="space-y-6">
      {/* 3-Column Layout for Message Sending & Templates & Recipients */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. 저장된 문자 템플릿 (클릭시 불러오기) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>{t.savedTemplatesTitle}</span>
            </h3>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {savedTemplates.map((tpl) => (
                <div
                  key={tpl.id}
                  className="bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 rounded-xl p-3 cursor-pointer transition text-xs space-y-1 relative group"
                >
                  <div 
                    onClick={() => {
                      setSelectedTemplateTitle(tpl.title);
                      setMsgContent(tpl.content);
                      showToast('템플릿이 좌측 편집창에 불러와졌습니다.');
                    }}
                    className="space-y-1 pr-6"
                  >
                    <div className="font-bold text-slate-900">{tpl.title}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-2">{tpl.content}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSavedTemplates(savedTemplates.filter(t => t.id !== tpl.id));
                      showToast('문자 템플릿이 삭제되었습니다.');
                    }}
                    className="absolute top-3 right-3 text-slate-400 hover:text-red-600 p-1"
                    title="삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="text-[11px] text-amber-600 font-medium bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center space-x-1.5">
            <span>💡</span>
            <span>저장된 템플릿을 클릭하면 중앙 편집창에 즉시 불러와집니다.</span>
          </div>
        </div>

        {/* 2. 문자 발송 편집 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <MessageCircle className="w-4 h-4 text-indigo-600" />
              <span>{t.reminderTemplateTitle}</span>
            </h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t.templateTitleLabel}</label>
              <input
                type="text"
                value={selectedTemplateTitle}
                onChange={(e) => setSelectedTemplateTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold resize-y"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t.msgContentLabel}</label>
              <textarea
                rows="5"
                value={msgContent}
                onChange={(e) => setMsgContent(e.target.value)}
                placeholder={t.msgContentPlaceholder}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs leading-relaxed resize-y"
              />
            </div>
          </div>
          <div>
            <button
              onClick={() => {
                if (!selectedTemplateTitle.trim() || !msgContent.trim()) return;
                setSavedTemplates([...savedTemplates, { id: `tpl-${Date.now()}`, title: selectedTemplateTitle, content: msgContent }]);
                showToast('문자 템플릿이 안전하게 저장되었습니다.');
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-2xs transition"
            >
              {t.saveTemplateBtn}
            </button>
          </div>
        </div>

        {/* 3. 카카오톡 문자 발송 대상 선택 및 개별 체크 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>{t.kakaoRecipientTitle}</span>
              </h3>
              <div className="flex space-x-1.5">
                <button
                  onClick={handleSelectAll}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-200"
                >
                  {t.selectAllBtn}
                </button>
                <button
                  onClick={handleDeselectAll}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-200"
                >
                  {t.deselectAllBtn}
                </button>
              </div>
            </div>

            <select
              value={recipientScope}
              onChange={(e) => {
                const scope = e.target.value;
                setRecipientScope(scope);
                if (scope === 'ALL') setSelectedStudentIds(students.map(s => s.id));
                else if (scope === 'CLASS') setSelectedStudentIds(students.filter(s => s.classId === targetClassId).map(s => s.id));
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
            >
              <option value="ALL">{t.scopeAll} ({students.length}명)</option>
              <option value="CLASS">{t.scopeClass}</option>
              <option value="INDIVIDUAL">{t.scopeIndividual}</option>
            </select>

            {recipientScope === 'CLASS' && (
              <select
                value={targetClassId}
                onChange={(e) => {
                  const clId = e.target.value;
                  setTargetClassId(clId);
                  setSelectedStudentIds(students.filter(s => s.classId === clId).map(s => s.id));
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.schedule})</option>
                ))}
              </select>
            )}

            {recipientScope === 'INDIVIDUAL' && (
              <input
                type="text"
                placeholder={t.searchStudentPlaceholder}
                value={studentSearchQuery}
                onChange={(e) => {
                  const q = e.target.value;
                  setStudentSearchQuery(q);
                  const matched = students.filter(s => s.korName.includes(q) || s.parentPhone.includes(q));
                  setSelectedStudentIds(matched.map(s => s.id));
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
              />
            )}

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 max-h-40 overflow-y-auto space-y-1.5">
              <div className="text-[10px] font-bold text-slate-500">
                선택된 대상 ({selectedStudentIds.length}명 / 총 {students.length}명)
              </div>
              <div className="grid grid-cols-1 gap-1">
                {currentFilteredStudents.map(st => {
                  const isChecked = selectedStudentIds.includes(st.id);
                  return (
                    <div
                      key={st.id}
                      onClick={() => handleToggleStudentCheck(st.id)}
                      className={`border rounded-lg p-2 flex items-center space-x-2 cursor-pointer transition text-xs ${
                        isChecked ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold' : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                      />
                      <div className="truncate text-[11px]">
                        <span>{st.korName}</span>
                        <span className="text-[10px] text-slate-500 ml-1 font-mono">({st.parentPhone})</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={handleSendKakaoBatch}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>선택된 학생({selectedStudentIds.length}명) 카카오 알림톡 발송</span>
            </button>
          </div>
        </div>
      </div>

      {/* Unpaid Student List */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 text-sm">{t.unpaidRosterTitle}</h3>
          <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full font-mono">
            {unpaidList.filter(u => u.status === 'UNPAID').length}{t.unpaidCountBadge}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="p-3.5">{t.studentName}</th>
                <th className="p-3.5">{t.parentPhoneHeader}</th>
                <th className="p-3.5">{t.tuition} 미납</th>
                <th className="p-3.5">{t.bookFee} 미납</th>
                <th className="p-3.5">{t.dueDate}</th>
                <th className="p-3.5 text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {unpaidList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">{t.noUnpaid}</td>
                </tr>
              ) : (
                unpaidList.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-bold text-slate-900">
                      <button
                        onClick={() => {
                          const foundSt = students.find(s => s.id === item.studentId);
                          if (foundSt) setSelectedStudentForModal(foundSt);
                        }}
                        className="text-indigo-600 hover:underline"
                      >
                        {item.studentName} ({item.engName})
                      </button>
                    </td>
                    <td className="p-3.5 font-mono text-slate-600">{item.parentPhone}</td>
                    <td className="p-3.5 font-mono font-bold text-slate-900">₩{item.unpaidTuition.toLocaleString()}</td>
                    <td className="p-3.5 font-mono text-slate-600">₩{item.unpaidBook.toLocaleString()}</td>
                    <td className="p-3.5 font-mono text-red-600 font-bold">{item.dueDate} ({item.daysOverdue}일 연체)</td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleMarkAsPaid(item)}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-3 py-1.5 rounded-xl border border-emerald-200 transition text-[11px]"
                      >
                        {t.markAsPaid}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sent Message History */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 font-bold text-slate-900 text-sm">
          {t.sentHistoryTitle}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="p-3.5">{t.sentDateHeader}</th>
                <th className="p-3.5">{t.recipientHeader}</th>
                <th className="p-3.5">{t.msgTitleHeader}</th>
                <th className="p-3.5">{t.msgSummaryHeader}</th>
                <th className="p-3.5 text-right">{t.deleteHeader}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sentMessages.map(msg => (
                <tr key={msg.id} className="hover:bg-slate-50 transition">
                  <td className="p-3.5 font-mono text-slate-500">{msg.date}</td>
                  <td className="p-3.5 font-bold text-slate-900">{msg.recipientName} ({msg.phone})</td>
                  <td className="p-3.5 text-indigo-700 font-bold">{msg.title}</td>
                  <td className="p-3.5 text-slate-600 truncate max-w-xs">{msg.content}</td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => {
                        setSentMessages(sentMessages.filter(m => m.id !== msg.id));
                        showToast('발송 내역이 삭제되었습니다.');
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- STUDENT DETAIL & ATTENDANCE MODAL ---
function StudentDetailModal({ student, onClose, attendanceLogs, setAttendanceLogs, customFieldKeys, students, setStudents, sentMessages, showToast, t }) {
  const [activeModalTab, setActiveModalTab] = useState('attendance'); // 'attendance' or 'profile' or 'messages'
  const [customValues, setCustomValues] = useState(student.customFields || {});
  const [simulatedKakaoText, setSimulatedKakaoText] = useState('선생님 오늘 민준이 독감 증세로 소아과 다녀오느라 수업 못들어갑니다.');

  const stLog = attendanceLogs[student.id] || { totalDays: 20, present: 18, absent: 1, late: 1, records: [] };

  const handleSimulateAttendance = (e) => {
    e.preventDefault();
    const newRecord = {
      id: `att-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'ABSENT',
      typeName: '결석 (병결)',
      reason: simulatedKakaoText,
      source: 'KAKAO',
      kakaoMessage: simulatedKakaoText,
      sender: `${student.korName} 학부모`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      approved: true
    };

    setAttendanceLogs(prev => ({
      ...prev,
      [student.id]: {
        ...stLog,
        absent: stLog.absent + 1,
        records: [newRecord, ...stLog.records]
      }
    }));
    showToast(`카카오톡 사유 전송 수신 테스트가 완료되었습니다.`);
  };

  const studentSentMessages = sentMessages.filter(m => m.recipientName.includes(student.korName) || m.phone === student.parentPhone);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200">
        <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2.5 rounded-2xl text-white">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{student.korName} ({student.engName})</h3>
              <p className="text-xs text-indigo-600 font-bold font-mono">{student.parentPhone} | {student.shuttleStatus || '도보'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl bg-white border border-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-slate-200 px-5 bg-slate-50/50 space-x-2">
          <button
            onClick={() => setActiveModalTab('attendance')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition ${
              activeModalTab === 'attendance' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {t.attendanceTab}
          </button>
          <button
            onClick={() => setActiveModalTab('profile')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition ${
              activeModalTab === 'profile' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {t.profileTab}
          </button>
          <button
            onClick={() => setActiveModalTab('messages')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition ${
              activeModalTab === 'messages' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            문자 전송 내역 ({studentSentMessages.length})
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {activeModalTab === 'attendance' && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
                  <div className="text-[11px] font-bold text-slate-500">{t.totalClassDays}</div>
                  <div className="text-lg font-bold text-slate-900 font-mono mt-1">{stLog.totalDays}{t.unitDay}</div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center">
                  <div className="text-[11px] font-bold text-emerald-700">{t.present}</div>
                  <div className="text-lg font-bold text-emerald-800 font-mono mt-1">{stLog.present}{t.unitDay}</div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center">
                  <div className="text-[11px] font-bold text-amber-700">{t.absent}</div>
                  <div className="text-lg font-bold text-amber-800 font-mono mt-1">{stLog.absent}{t.unitDay}</div>
                </div>
                <div className="bg-slate-100 border border-slate-200 rounded-2xl p-3 text-center">
                  <div className="text-[11px] font-bold text-slate-700">{t.late}</div>
                  <div className="text-lg font-bold text-slate-900 font-mono mt-1">{stLog.late}{t.unitDay}</div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <h4 className="font-bold text-slate-900 text-xs flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-indigo-600" />
                  <span>{t.kakaoSimulatorTitle}</span>
                </h4>
                <form onSubmit={handleSimulateAttendance} className="space-y-2">
                  <input
                    type="text"
                    value={simulatedKakaoText}
                    onChange={(e) => setSimulatedKakaoText(e.target.value)}
                    placeholder={t.kakaoMsgPlaceholder}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                  <div className="flex justify-end">
                    <button type="submit" className="bg-indigo-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md">
                      {t.kakaoTestBtn}
                    </button>
                  </div>
                </form>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs">결석 및 사유 제출 로그</h4>
                {stLog.records.length === 0 ? (
                  <div className="text-xs text-slate-400 py-4 text-center">등록된 사유 로그가 없습니다.</div>
                ) : (
                  stLog.records.map(rec => (
                    <div key={rec.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{rec.typeName}</span>
                        <span className="text-slate-400 font-mono">{rec.date} {rec.time}</span>
                      </div>
                      <div className="text-slate-800 font-mono bg-white p-2.5 rounded-xl border border-slate-200">
                        💬 {rec.kakaoMessage}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeModalTab === 'profile' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">학생 이름 (한글)</label>
                  <input
                    type="text"
                    value={student.korName}
                    onChange={(e) => {
                      const updated = { ...student, korName: e.target.value };
                      setStudents(students.map(s => s.id === student.id ? updated : s));
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">영어 이름</label>
                  <input
                    type="text"
                    value={student.engName}
                    onChange={(e) => {
                      const updated = { ...student, engName: e.target.value };
                      setStudents(students.map(s => s.id === student.id ? updated : s));
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t.parentPhoneHeader}</label>
                  <input
                    type="text"
                    value={student.parentPhone}
                    onChange={(e) => {
                      const updated = { ...student, parentPhone: e.target.value };
                      setStudents(students.map(s => s.id === student.id ? updated : s));
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t.shuttle}</label>
                  <input
                    type="text"
                    value={student.shuttleStatus || ''}
                    onChange={(e) => {
                      const updated = { ...student, shuttleStatus: e.target.value };
                      setStudents(students.map(s => s.id === student.id ? updated : s));
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 text-xs">{t.customFieldsTitle}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {customFieldKeys.map(key => (
                    <div key={key}>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{key}</label>
                      <input
                        type="text"
                        value={customValues[key] || ''}
                        onChange={(e) => {
                          const nextVals = { ...customValues, [key]: e.target.value };
                          setCustomValues(nextVals);
                          const updated = { ...student, customFields: nextVals };
                          setStudents(students.map(s => s.id === student.id ? updated : s));
                        }}
                        placeholder={`${key} 입력...`}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  onClick={() => {
                    showToast('학생 정보가 성공적으로 저장되었습니다.');
                    onClose();
                  }}
                  className="bg-indigo-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md"
                >
                  {t.save}
                </button>
              </div>
            </div>
          )}

          {activeModalTab === 'messages' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-xs">{student.korName} 학생에게 발송된 문자 내역</h4>
              {studentSentMessages.length === 0 ? (
                <div className="text-xs text-slate-400 py-6 text-center">발송된 문자 내역이 없습니다.</div>
              ) : (
                studentSentMessages.map(msg => (
                  <div key={msg.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-indigo-700">{msg.title}</span>
                      <span className="text-slate-400 font-mono">{msg.date}</span>
                    </div>
                    <div className="text-slate-700 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
