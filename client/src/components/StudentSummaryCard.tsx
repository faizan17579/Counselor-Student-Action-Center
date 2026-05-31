import { StudentSummary } from "../types/actionCenter";

interface StudentSummaryCardProps {
  student: StudentSummary;
}

export function StudentSummaryCard({ student }: StudentSummaryCardProps) {
  return (
    <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-glow ring-1 ring-slate-900/60">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-200/80">Student Profile</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance">{student.name}</h1>
          <p className="mt-2 text-sm text-slate-200/80">
            Grade {student.grade} · {student.email}
          </p>
        </div>

        <div className="grid gap-3 text-sm sm:min-w-72 sm:grid-cols-2">
          <div className="rounded-2xl bg-white/5 p-3">
            <div className="text-xs uppercase tracking-wide text-slate-300/70">Counselor Id</div>
            <div className="mt-1 font-medium text-white">{student.counselorId}</div>
          </div>
          <div className="rounded-2xl bg-white/5 p-3">
            <div className="text-xs uppercase tracking-wide text-slate-300/70">GPA</div>
            <div className="mt-1 font-medium text-white">{student.gpa.toFixed(1)}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-100">
          Enrollment: {student.enrollmentStatus}
        </span>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-100">
          Grade {student.grade}
        </span>
      </div>
    </section>
  );
}
