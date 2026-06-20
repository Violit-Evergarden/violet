interface InputPanelProps {
  value: string
  loading: boolean
  onChange: (value: string) => void
  onSubmit: () => void
}

export function InputPanel({ value, loading, onChange, onSubmit }: InputPanelProps) {
  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-6 shadow-xl">
      <label htmlFor="share-text" className="mb-2 block text-sm font-medium text-slate-300">
        粘贴抖音分享文本
      </label>
      <textarea
        id="share-text"
        rows={6}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="可直接粘贴完整分享文本，例如：9.20 :4pm ... https://v.douyin.com/OBrtQhfNGFU/ ..."
        className="w-full resize-y rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30"
        disabled={loading}
      />
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading || !value.trim()}
          className="rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-600"
        >
          {loading ? '处理中...' : '提取文案'}
        </button>
      </div>
    </section>
  )
}
