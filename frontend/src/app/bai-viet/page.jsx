export default function TrangBaiViet() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-emerald-950 mb-6">Mẹo Hay & Cẩm Nang Sức Khỏe</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {[1, 2].map((post) => (
          <article key={post} className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm flex gap-4">
            <div className="w-24 h-24 bg-emerald-100 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl">🥗</div>
            <div>
              <h3 className="font-bold text-gray-800 line-clamp-2">Cách chọn rau củ quả không chứa thuốc trừ sâu đơn giản</h3>
              <p className="text-xs text-gray-400 mt-2">28/09/2026 • 5 phút đọc</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}