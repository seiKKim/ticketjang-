import {
  MousePointerClick,
  Keyboard,
  ShieldCheck,
  Banknote,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { SubPageHero } from "@/components/SubPageHero";

const STEPS = [
  {
    step: "01",
    title: "상품권 선택",
    description:
      "판매하실 상품권의 종류를 선택해주세요.\n문화상품권, 해피머니 등 다양한 상품권 매입이 가능합니다.",
    icon: MousePointerClick,
    color: "bg-indigo-50 text-indigo-600",
    blobColor: "bg-indigo-500",
  },
  {
    step: "02",
    title: "핀번호 입력",
    description:
      "상품권의 핀번호를 정확하게 입력해주세요.\n교환권의 경우 교환권 번호를 입력해주시면 됩니다.",
    icon: Keyboard,
    color: "bg-sky-50 text-sky-600",
    blobColor: "bg-sky-500",
  },
  {
    step: "03",
    title: "실시간 확인",
    description:
      "입력하신 핀번호를 시스템이 실시간으로 확인합니다.\n통상 1~3분 내외의 시간이 소요됩니다.",
    icon: ShieldCheck,
    color: "bg-emerald-50 text-emerald-600",
    blobColor: "bg-emerald-500",
  },
  {
    step: "04",
    title: "즉시 입금",
    description:
      "확인이 완료되면 입력하신 계좌로 즉시 입금됩니다.\n365일 24시간 언제든지 이용 가능합니다.",
    icon: Banknote,
    color: "bg-rose-50 text-rose-600",
    blobColor: "bg-rose-500",
  },
];

const FAQS = [
  {
    q: "입금까지 얼마나 걸리나요?",
    a: "핀번호 확인 후 즉시 입금처리 됩니다. 통상적으로 신청 후 입금까지 1~5분 정도 소요됩니다. 다만 은행 점검시간(23:50 ~ 00:10)에는 입금이 지연될 수 있습니다.",
  },
  {
    q: "핀번호를 잘못 입력했어요.",
    a: "잘못된 핀번호를 입력하신 경우 '확인대기' 상태로 전환될 수 있습니다. 이 경우 고객센터로 문의주시면 신속하게 확인해드립니다.",
  },
  {
    q: "수수료는 얼마인가요?",
    a: "매입 시세표 페이지에서 실시간 매입 수수료를 확인하실 수 있습니다. 대량 판매 시에는 추가 우대 혜택을 드립니다.",
  },
  {
    q: "24시간 이용 가능한가요?",
    a: "네, 티켓장은 365일 24시간 연중무휴로 운영됩니다. 언제든지 편리하게 이용해주세요.",
  },
];

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="w-full">
        {/* Header Section */}
        <SubPageHero
          title="이용 안내"
          description={
            <>
              티켓장을 더 편리하게 이용하는 방법을 안내해드립니다.
              <br className="hidden sm:block" />
              <span className="text-emerald-400 font-bold">
                간편하고 안전한
              </span>{" "}
              상품권 현금화 서비스를 경험해보세요.
            </>
          }
          badgeText="티켓장 가이드"
          category="Guide"
        />

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-32 relative z-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
          {STEPS.map((step, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="relative z-10">
                <span className="text-4xl font-black text-slate-100 absolute -top-4 -right-4 select-none opacity-50 group-hover:opacity-100 group-hover:text-indigo-50 transition-all duration-300 transform group-hover:scale-110">
                  {step.step}
                </span>

                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-xl ${step.color} shadow-sm group-hover:scale-110 transition-transform`}
                >
                  <step.icon className="w-7 h-7" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed break-keep">
                  {step.description}
                </p>
              </div>

              {/* Background Gradient Blob */}
              <div
                className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500 ${step.blobColor}`}
              />
            </div>
          ))}
        </div>

        {/* Verification System Banner */}
        <div className="bg-indigo-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-left">
              <div className="inline-block px-3 py-1 bg-indigo-800 rounded-full text-xs font-bold text-indigo-200 border border-indigo-700">
                Auto System
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold">
                빠르고 안전한 자동화 시스템
              </h3>
              <p className="text-indigo-200 leading-relaxed max-w-lg">
                티켓장은 자체 구축한 24시간 자동화 검증 시스템을 통해
                <br className="hidden sm:block" />
                신청 즉시 핀번호를 확인하고 입금 처리를 진행합니다.
              </p>
            </div>
            <div className="flex-shrink-0">
              <button className="px-8 py-4 bg-white text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg">
                판매 신청하러 가기
              </button>
            </div>
          </div>

          {/* Tech Decoration */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
          <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] bg-sky-500 rounded-full blur-3xl opacity-20 mix-blend-screen animate-pulse-slow" />
          <div className="absolute -bottom-1/2 -left-1/4 w-[500px] h-[500px] bg-indigo-500 rounded-full blur-3xl opacity-20 mix-blend-screen" />
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto space-y-8 mt-20">
          <h3 className="text-2xl font-bold text-slate-900 text-center">
            자주 묻는 질문
          </h3>
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:border-indigo-100 transition-colors shadow-sm"
              >
                <div className="p-6 flex gap-4">
                  <div className="text-lg font-bold text-indigo-600">Q.</div>
                  <div className="flex-1 space-y-2">
                    <h4 className="font-bold text-slate-800 text-lg">
                      {faq.q}
                    </h4>
                    <p className="text-slate-500 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
