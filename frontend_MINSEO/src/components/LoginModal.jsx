import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

//TODO: 로그인 전체 페이지 결정 -> 로그인 페이지 크기를 키울까 말까?
const LoginModal = ({ isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      document.body.classList.remove("overflow-hidden");
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.body.classList.add("overflow-hidden");
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("overflow-hidden");
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center backdrop-blur-xl px-4 font-esamanru"
      onClick={onClose}
    >
      <div
        className="relative w-80 rounded-xl bg-gray-800 p-8 text-gray-100 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          aria-label="Close login modal"
          className="absolute right-3 top-3 text-gray-400 transition hover:text-gray-200"
          onClick={onClose}
          type="button"
        >
          ✕
        </button>
        <p className="text-center text-2xl font-bold leading-8">Login</p>
        <form className="mt-6 space-y-4">
          <div className="text-sm leading-5">
            <label
              className="mb-1 block text-gray-400"
              htmlFor="userId"
            >
              UserId
            </label>
            <input
              className="w-full rounded-md border border-gray-700 bg-gray-900 px-4 py-3 text-gray-100 outline-none focus:border-purple-300 font-roboto"
              id="userid"
              name="userId"
              placeholder=""
              type="text"
            />
          </div>
          <div className="text-sm leading-5">
            <label
              className="mb-1 block text-gray-400"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="w-full rounded-md border border-gray-700 bg-gray-900 px-4 py-3 pr-10 text-gray-100 outline-none focus:border-purple-300 font-roboto"
                id="password"
                name="password"
                placeholder=""
                type={showPassword ? "text" : "password"}
              />
              <button
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 px-3 text-sm text-gray-400 transition hover:text-gray-200 focus:outline-none"
                onClick={() => setShowPassword((prev) => !prev)}
                type="button"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="mt-2 mb-3 flex justify-end text-xs text-gray-400">
              <a
                className="text-gray-100 hover:underline hover:decoration-purple-300"
                href="#"
                rel="noopener noreferrer"
              >
                Forgot Password ?
              </a>
            </div>
          </div>
          <button
            className="w-full rounded-md bg-purple-300 py-3 text-center font-semibold text-gray-900 transition-colors hover:bg-purple-200"
            type="submit"
          >
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          Don&apos;t have an account?{" "}
          <a
            className="text-gray-100 hover:underline hover:decoration-purple-300"
            href="/signup"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>,
    document.body
  );
};

export default LoginModal;
