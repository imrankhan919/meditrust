const Loader = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
            <div className="flex flex-col items-center">

                {/* Logo */}
                <div className="relative mb-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500 shadow-lg shadow-teal-500/20">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-8 w-8 text-white"
                        >
                            <path
                                d="M12 21s-7-4.35-9.5-9.2C.7 8.1 2.8 4.5 6.5 4.5c2.1 0 3.8 1.2 5.5 3.1 1.7-1.9 3.4-3.1 5.5-3.1 3.7 0 5.8 3.6 4 7.3C19 16.65 12 21 12 21Z"
                                fill="currentColor"
                            />
                            <path
                                d="M12 8v7M8.5 11.5h7"
                                stroke="white"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>

                    {/* Pulse */}
                    <div className="absolute inset-0 -z-10 animate-ping rounded-2xl bg-teal-400/30" />
                </div>

                {/* Brand */}
                <div className="text-center">
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">
                        Medi<span className="text-teal-600">Trust</span>
                    </h1>

                    <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.25em] text-slate-400">
                        Healthcare Made Simple
                    </p>
                </div>

                {/* Loading indicator */}
                <div className="mt-8 flex items-center gap-2">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-teal-500 [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-teal-500 [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-teal-500" />
                </div>

                <p className="mt-4 text-xs text-slate-400">
                    Preparing your healthcare experience...
                </p>

            </div>
        </div>
    );
};

export default Loader;