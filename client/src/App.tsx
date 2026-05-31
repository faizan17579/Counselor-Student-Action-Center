import { ActionCenterPage } from "./pages/ActionCenterPage";

export default function App() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.12),_transparent_25%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] text-slate-950">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <header className="mb-6 flex flex-col gap-3 rounded-3xl border border-white/70 bg-white/55 p-5 shadow-sm backdrop-blur xl:mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">
            Counselor Student Action Center
          </p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            A focused view for student support workflows
          </h2>
        </header>

        <ActionCenterPage />
      </div>
    </div>
  );
}
