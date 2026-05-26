export default function DashboardHeader() {
  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-cyan-500/5 to-purple-500/5 pointer-events-none" />
      <div className="relative container mx-auto px-4 py-10 sm:py-12">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            {/* Logo Icon */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              W
            </div>
            <div className="flex-1">
              <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 dark:from-indigo-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent leading-tight">
                Weather Insights
              </h1>
            </div>
          </div>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-medium ml-0 leading-relaxed">
            Advanced analytics & real-time weather classification
          </p>
        </div>
      </div>
    </header>
  );
}
