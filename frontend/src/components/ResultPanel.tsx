interface ResultPanelProps {
  title: string
  videoId: string
  transcript: string
  durationSeconds: number
}

export function ResultPanel({
  title,
  videoId,
  transcript,
  durationSeconds,
}: ResultPanelProps) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(transcript)
  }

  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-6 shadow-xl">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="mt-1 text-sm text-slate-400">
            视频 ID: {videoId} · 时长: {Math.round(durationSeconds)} 秒
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-200 transition hover:border-sky-400 hover:text-sky-300"
        >
          一键复制
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto rounded-xl bg-slate-950 p-4 text-sm leading-7 text-slate-200 whitespace-pre-wrap">
        {transcript}
      </div>
    </section>
  )
}
