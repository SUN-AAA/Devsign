import React, { useMemo, useState } from "react";
import NavbarPage from "./NavbarPage";

const SignUpPage = () => {
  const initialValues = useMemo(
    () => ({
      name: "",
      birth: "",
      studentId: "",
      department: "",
      phone: "",
      email: "",
      currentAddress: "",
      addressDetail: "",
      userId: "",
      password: "",
      discordId: "",
      interests: "",
      licenses: "",
      bio: "",
      privacy: false,
      policy: false,
    }),
    []
  );

  const [formValues, setFormValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [usernameStatus, setUsernameStatus] = useState(null);
  const [modalState, setModalState] = useState({ type: null, isOpen: false });

  const takenUsernames = useMemo(
    () => ["admin", "test", "devsign", "guest"],
    []
  );

  const requiredFields = useMemo(
    () => [
      "name",
      "birth",
      "studentId",
      "department",
      "phone",
      "email",
      "currentAddress",
      "addressDetail",
      "userId",
      "password",
      "discordId",
    ],
    []
  );

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    let nextValue;
    if (type === "checkbox") {
      nextValue = checked;
    } else if (name === "birth") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 8);
      if (digitsOnly.length <= 4) {
        nextValue = digitsOnly;
      } else if (digitsOnly.length <= 6) {
        nextValue = `${digitsOnly.slice(0, 4)}-${digitsOnly.slice(4)}`;
      } else {
        nextValue = `${digitsOnly.slice(0, 4)}-${digitsOnly.slice(4, 6)}-${digitsOnly.slice(6)}`;
      }
    } else if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 11);
      if (digitsOnly.length <= 3) {
        nextValue = digitsOnly;
      } else if (digitsOnly.length <= 7) {
        nextValue = `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
      } else {
        nextValue = `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 7)}-${digitsOnly.slice(7)}`;
      }
    } else if (name === "studentId") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 8);
      nextValue = digitsOnly;
    } else if (name === "userId") {
      nextValue = value;
      setUsernameStatus(null);
    } else if (name === "email") {
      nextValue = value.trim();
    } else {
      nextValue = value;
    }

    setFormValues((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const openModal = (type) => {
    setModalState({ type, isOpen: true });
  };

  const closeModal = () => {
    setModalState({ type: null, isOpen: false });
  };

  const handleModalAgree = () => {
    if (modalState.type === "privacy" || modalState.type === "policy") {
      const key = modalState.type;
      setFormValues((prev) => ({
        ...prev,
        [key]: true,
      }));
      setTouched((prev) => ({
        ...prev,
        [key]: true,
      }));
    }
    closeModal();
  };

  //TODO: 로그인 중복 확인 로직
  const handleUsernameCheck = () => {
    const trimmed = formValues.userId.trim();
    setTouched((prev) => ({ ...prev, userId: true }));

    if (!trimmed) {
      setUsernameStatus({ type: "error", message: "아이디를 입력한 뒤 다시 시도해주세요." });
      return;
    }

    setUsernameStatus({ type: "checking", message: "중복 확인 중입니다..." });

    setTimeout(() => {
      const isTaken = takenUsernames.includes(trimmed.toLowerCase());
      if (isTaken) {
        setUsernameStatus({ type: "error", message: "이미 사용 중인 아이디입니다." });
      } else {
        setUsernameStatus({ type: "available", message: "사용 가능한 아이디입니다." });
      }
    }, 600);
  };

  const isInvalid = (field) => {
    const value = formValues[field];
    if (field === "studentId" && touched[field]) {
      return value.length !== 8;
    }
    if (!touched[field]) {
      return false;
    }
    if (typeof value === "boolean") {
      return !value;
    }
    return value.trim() === "";
  };
  const renderHint = (field, className = "ml-2 text-xs text-purple-300") => {
    if (!isInvalid(field)) {
      return null;
    }

    if (field === "studentId") {
      return (
        <span className={className}>* 학번은 8자리입니다.</span>
      );
    }

    return <span className={className}>* 이 요소는 필수 작성요소입니다.</span>;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const missing = requiredFields.filter((field) => {
      const value = formValues[field];
      if (typeof value === "boolean") {
        return !value;
      }
      return value.trim() === "";
    });

    if (missing.length > 0) {
      setTouched((prev) => ({
        ...prev,
        ...missing.reduce((acc, field) => {
          acc[field] = true;
          return acc;
        }, {}),
      }));
      return;
    }

    if (!formValues.privacy || !formValues.policy) {
      setTouched((prev) => ({
        ...prev,
        privacy: true,
        policy: true,
      }));
      if (!formValues.privacy) {
        openModal("privacy");
      } else if (!formValues.policy) {
        openModal("policy");
      }
      return;
    }

    if (usernameStatus?.type !== "available") {
      setTouched((prev) => ({ ...prev, userId: true }));
      setUsernameStatus((prev) =>
        prev?.type === "error"
          ? prev
          : {
              type: "error",
              message: "아이디 중복 확인을 완료해주세요.",
            }
      );
      return;
    }

    // TODO: 실제 가입 제출 로직으로 대체
    console.log("Sign-up payload", formValues);
  };

  const isFormValid = requiredFields.every((field) => {
    const value = formValues[field];
    if (typeof value === "boolean") {
      return value;
    }
    return value.trim() !== "";
  });

  const isStudentIdValid = formValues.studentId.length === 8;

  const canSubmit =
    isFormValid &&
    isStudentIdValid &&
    formValues.privacy &&
    formValues.policy &&
    formValues.email.trim() !== "" &&
    usernameStatus?.type === "available";

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-gray-800 to-gray-700 font-esamanru text-white">
      <NavbarPage />
      <main className="flex min-h-screen items-center justify-center px-4 pb-16 pt-32">
        <div className="w-full max-w-2xl rounded-2xl bg-gray-900 p-6 text-gray-100 shadow-2xl md:max-w-3xl md:p-10 lg:max-w-4xl xl:max-w-5xl">
          <p className="text-center text-3xl font-bold leading-9">SignUp</p>
          <form
            className="mt-8 space-y-6 text-sm leading-5"
            noValidate
            onSubmit={handleSubmit}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-slate-100" htmlFor="name">
                  이름 (필수)
                  {renderHint("name")}
                </label>
                <input
                  aria-invalid={isInvalid("name")}
                  className="font-roboto w-full rounded-md border border-gray-700 bg-gray-900 px-4 py-3 text-gray-100 outline-none focus:border-purple-300"
                  id="name"
                  name="name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={formValues.name}
                  placeholder="이름을 입력하세요"
                />
              </div>
              <div>
                <label className="mb-1 block text-slate-100" htmlFor="birth">
                  생년월일 (필수)
                  {renderHint("birth")}
                </label>
                <input
                  aria-invalid={isInvalid("birth")}
                  className="font-roboto w-full rounded-md border border-gray-700 bg-gray-900 px-4 py-3 text-gray-100 outline-none focus:border-purple-300"
                  id="birth"
                  name="birth"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="YYYY-MM-DD 형식으로 입력하세요"
                  type="text"
                  value={formValues.birth}
                />
              </div>
              <div>
                <label className="mb-1 block text-slate-100" htmlFor="studentId">
                  학번 (필수)
                  {renderHint("studentId")}
                </label>
                <input
                  aria-invalid={isInvalid("studentId")}
                  className="font-roboto w-full rounded-md border border-gray-700 bg-gray-900 px-4 py-3 text-gray-100 outline-none focus:border-purple-300"
                  id="studentId"
                  name="studentId"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={formValues.studentId}
                  placeholder="학번을 입력하세요"
                />
              </div>
              <div>
                <label className="mb-1 block text-slate-100" htmlFor="department">
                  학과 (필수)
                  {renderHint("department")}
                </label>
                <input
                  aria-invalid={isInvalid("department")}
                  className="font-roboto w-full rounded-md border border-gray-700 bg-gray-900 px-4 py-3 text-gray-100 outline-none focus:border-purple-300"
                  id="department"
                  name="department"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={formValues.department}
                  placeholder="학과를 입력하세요"
                />
              </div>
              <div>
                <label className="mb-1 block text-slate-100" htmlFor="phone">
                  전화번호 (필수)
                  {renderHint("phone")}
                </label>
                <input
                  aria-invalid={isInvalid("phone")}
                  className="font-roboto w-full rounded-md border border-gray-700 bg-gray-900 px-4 py-3 text-gray-100 outline-none focus:border-purple-300"
                  id="phone"
                  name="phone"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="tel"
                  value={formValues.phone}
                  placeholder="010-0000-0000"
                />
              </div>
              <div>
                <label className="mb-1 block text-slate-100" htmlFor="email">
                  E-mail (필수)
                  {renderHint("email")}
                </label>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="flex-1 rounded-md border border-gray-700 bg-gray-900 px-4 py-3">
                    <input
                      aria-invalid={isInvalid("email")}
                      className="font-roboto w-full bg-transparent text-gray-100 outline-none"
                      id="email"
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      type="email"
                      value={formValues.email}
                    />
                  </div>
                    <button
                    className="whitespace-nowrap rounded-md bg-purple-300 px-4 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-purple-200"
                      type="button"
                    >
                      인증요청
                    </button>
                  </div>
                </div>
              <div>
                <label className="mb-1 block text-slate-100" htmlFor="currentAddress">
                  현 거주지 (필수)
                  {renderHint("currentAddress")}
                </label>
                <div className="relative">
                  <select
                    aria-invalid={isInvalid("currentAddress")}
                    className="select-residence font-roboto w-full cursor-pointer appearance-none rounded-md px-4 py-3 pr-12 text-gray-100 outline-none"
                    id="currentAddress"
                    name="currentAddress"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={formValues.currentAddress}
                  >
                    <option value="">선택하세요</option>
                    <option value="dorm">기숙사</option>
                    <option value="home">자택</option>
                    <option value="offcampus">학교 인근 자취</option>
                    <option value="other">기타</option>
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-purple-200">
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 10 6"
                    >
                      <path d="M1 1l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-slate-100" htmlFor="addressDetail">
                  집 주소 (필수)
                  {renderHint("addressDetail")}
                </label>
                <input
                  aria-invalid={isInvalid("addressDetail")}
                  className="font-roboto w-full rounded-md border border-gray-700 bg-gray-900 px-4 py-3 pr-12 text-gray-100 outline-none focus:border-purple-300"
                  id="addressDetail"
                  name="addressDetail"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={formValues.addressDetail}
                  placeholder="상세 주소를 입력하세요"
                />
              </div>
              <div>
                <label className="mb-1 block text-slate-100" htmlFor="userId">
                  아이디 (필수)
                  {renderHint("userId")}
                </label>
                <div className="flex gap-2">
                  <input
                    aria-invalid={isInvalid("userId")}
                    className="font-roboto w-full rounded-md border border-gray-700 bg-gray-900 px-4 py-3 text-gray-100 outline-none focus:border-purple-300"
                    id="userId"
                    name="userId"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="text"
                    value={formValues.userId}
                    placeholder="아이디를 입력하세요"
                  />
                  <button
                    className="whitespace-nowrap rounded-md border border-purple-300/70 bg-transparent px-3 py-2 text-sm font-medium text-purple-200 transition-colors hover:border-purple-200 hover:text-purple-100"
                    onClick={handleUsernameCheck}
                    type="button"
                  >
                    중복 확인
                  </button>
                </div>
                {usernameStatus && (
                  <p
                    className={`mt-1 text-xs ${
                      usernameStatus.type === "available"
                        ? "text-emerald-300"
                        : usernameStatus.type === "checking"
                        ? "text-purple-200"
                        : "text-rose-300"
                    }`}
                  >
                    {usernameStatus.type === "checking"
                      ? "중복 확인 중입니다..."
                      : usernameStatus.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-slate-100" htmlFor="password">
                  비밀번호 (필수)
                  {renderHint("password")}
                </label>
                <input
                  aria-invalid={isInvalid("password")}
                  className="font-roboto w-full rounded-md border border-gray-700 bg-gray-900 px-4 py-3 text-gray-100 outline-none focus:border-purple-300"
                  id="password"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={formValues.password}
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
              <div>
                <label className="mb-1 block text-slate-100" htmlFor="discordId">
                  디스코드 사용자명 (필수)
                  {renderHint("discordId")}
                </label>
                <input
                  aria-invalid={isInvalid("discordId")}
                  className="font-roboto w-full rounded-md border border-gray-700 bg-gray-900 px-4 py-3 text-gray-100 outline-none focus:border-purple-300"
                  id="discordId"
                  name="discordId"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={formValues.discordId}
                  placeholder="username#0000"
                />
              </div>
              <div>
                <label className="mb-1 block text-gray-400" htmlFor="interests">
                  관심분야 (선택)
                </label>
                <input
                  className="font-roboto w-full rounded-md border border-gray-700 bg-gray-900 px-4 py-3 text-gray-100 outline-none focus:border-purple-300"
                  id="interests"
                  name="interests"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={formValues.interests}
                  placeholder="예: 웹 개발, 디자인, AI"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-gray-400" htmlFor="licenses">
                  자격증 (선택)
                </label>
                <input
                  className="font-roboto w-full rounded-md border border-gray-700 bg-gray-900 px-4 py-3 text-gray-100 outline-none focus:border-purple-300"
                  id="licenses"
                  name="licenses"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={formValues.licenses}
                  placeholder="보유 자격증을 입력하세요"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-gray-400" htmlFor="bio">
                  자기소개 (선택)
                </label>
                <textarea
                  className="font-roboto h-32 w-full rounded-md border border-gray-700 bg-gray-900 px-4 py-3 text-gray-100 outline-none focus:border-purple-300"
                  id="bio"
                  name="bio"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="자기소개를 입력하세요"
                  value={formValues.bio}
                />
              </div>
            </div>

            <div className="space-y-2 rounded-md border border-gray-800 bg-gray-950/40 p-4 text-xs text-gray-300">
              <div className="flex items-start gap-3">
                <input
                  aria-invalid={isInvalid("privacy")}
                  aria-labelledby="privacy-label"
                  className="h-4 w-4 rounded border border-gray-600 bg-gray-900 accent-purple-300"
                  id="privacy"
                  name="privacy"
                  checked={formValues.privacy}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="checkbox"
                />
                <div className="flex-1">
                  <button
                    id="privacy-label"
                    className="text-left text-gray-100 underline decoration-dotted underline-offset-4 transition hover:text-purple-200"
                    onClick={() => openModal("privacy")}
                    type="button"
                  >
                    개인정보 이용약관에 동의합니다. (필수)
                  </button>
                  {renderHint("privacy", "block pt-1 text-[10px] text-purple-300")}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <input
                  aria-invalid={isInvalid("policy")}
                  aria-labelledby="policy-label"
                  className="h-4 w-4 rounded border border-gray-600 bg-gray-900 accent-purple-300"
                  id="policy"
                  name="policy"
                  checked={formValues.policy}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="checkbox"
                />
                <div className="flex-1">
                  <button
                    id="policy-label"
                    className="text-left text-gray-100 underline decoration-dotted underline-offset-4 transition hover:text-purple-200"
                    onClick={() => openModal("policy")}
                    type="button"
                  >
                    개인정보 처리방침에 동의합니다. (필수)
                  </button>
                  {renderHint("policy", "block pt-1 text-[10px] text-purple-300")}
                </div>
              </div>
            </div>

            {modalState.isOpen && (
              <div
                className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 px-4 font-esamanru"
                onClick={closeModal}
              >
                <div
                  className="relative w-full max-w-xl rounded-2xl bg-gray-900 p-8 text-gray-200 shadow-2xl"
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    aria-label="닫기"
                    className="absolute right-3 top-3 text-gray-500 transition hover:text-gray-200"
                    onClick={closeModal}
                    type="button"
                  >
                    ✕
                  </button>
                  <h2 className="text-2xl font-bold text-purple-200">
                    {modalState.type === "privacy" ? "개인정보 이용약관" : "개인정보 처리방침"}
                  </h2>
                  <div className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-2 text-sm leading-6 text-gray-300">
                    {modalState.type === "privacy" ? (
                      <>
                        <p>
                          본 약관은 DEVSIGN 서비스 이용 시 개인정보 수집, 이용 및 보관에 관한 사항을 규정합니다. 이용자는 서비스 이용을 위해 필요한 최소한의 개인정보를 제공하며, 제공된 정보는 회원 관리, 서비스 제공, 고지사항 전달에 활용됩니다.
                        </p>
                        <p>
                          수집되는 항목은 이름, 생년월일, 연락처, 이메일, 학적 정보 등 서비스 운영에 필요한 범위 내에서 이루어집니다. 수집된 정보는 회원 탈퇴 시 또는 법령에서 정한 보존 기간 이후 지체 없이 파기됩니다.
                        </p>
                        <p>
                          이용자는 개인정보 제공에 대한 동의를 거부할 권리가 있으며, 다만 동의 거부 시 일부 서비스 이용이 제한될 수 있습니다.
                        </p>
                      </>
                    ) : (
                      <>
                        <p>
                          DEVSIGN은 이용자의 개인정보를 안전하게 처리하기 위해 관련 법령과 내부 정책에 따라 다음과 같은 보호 조치를 시행합니다.
                        </p>
                        <p>
                          - 개인정보는 암호화되어 저장되며, 접근 권한은 최소한의 인원으로 제한합니다.<br />
                          - 개인정보 처리 위탁 시 신뢰할 수 있는 업체를 선정하고 관리 감독을 철저히 수행합니다.<br />
                          - 이용자의 요청이 있는 경우 열람·정정·삭제·처리정지 등의 조치를 신속하게 진행합니다.
                        </p>
                        <p>
                          보다 자세한 내용은 DEVSIGN 공식 홈페이지에서 확인할 수 있으며, 정책에 변경이 있을 경우 사전에 공지합니다.
                        </p>
                      </>
                    )}
                  </div>
                  <div className="mt-6 flex justify-end gap-3 text-sm">
                    <button
                      className="rounded-md border border-gray-600 px-4 py-2 text-gray-300 transition hover:border-gray-400 hover:text-gray-100"
                      onClick={closeModal}
                      type="button"
                    >
                      닫기
                    </button>
                    <button
                      className="rounded-md bg-purple-300 px-4 py-2 font-semibold text-gray-900 transition hover:bg-purple-200"
                      onClick={handleModalAgree}
                      type="button"
                    >
                      동의함
                    </button>
                  </div>
                </div>
              </div>
            )}

            <button
              className="w-full rounded-md bg-purple-300 py-3 text-center text-base font-semibold text-gray-900 transition-colors hover:bg-purple-200 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!canSubmit}
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SignUpPage;
