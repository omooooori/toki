export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Toki - AI日記アプリ
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          AIを活用して日記を書く、新しい体験を始めましょう。
        </p>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">機能</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• AIによる日記の自動分析</li>
            <li>• 感情分析とトレンド追跡</li>
            <li>• 美しいUI/UX</li>
            <li>• モバイル対応</li>
          </ul>
        </div>
      </div>
    </main>
  )
} 