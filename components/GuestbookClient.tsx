'use client';

import { useEffect, useState } from 'react';

interface Post {
  id: number;
  author_name: string;
  author_email: string;
  content: string;
  created_at: string;
}

export default function GuestbookClient({ userEmail, userName }: { userEmail: string; userName: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPosts = () => {
    fetch('/api/guestbook')
      .then((r) => r.json())
      .then((data) => { setPosts(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    const res = await fetch('/api/guestbook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (res.ok) {
      setContent('');
      fetchPosts();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    await fetch('/api/guestbook', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchPosts();
  };

  return (
    <div className="space-y-6">
      {/* 글쓰기 폼 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-base font-semibold text-gray-700 mb-3">방명록 남기기</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="text-sm text-gray-500">{userName || userEmail}</div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="방문 소감이나 메시지를 남겨주세요. (500자 이내)"
            maxLength={500}
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{content.length} / 500</span>
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white text-sm font-medium px-5 py-2 rounded-lg transition cursor-pointer"
            >
              {submitting ? '등록 중...' : '등록'}
            </button>
          </div>
        </form>
      </div>

      {/* 방명록 목록 */}
      <div className="space-y-3">
        {loading && (
          <div className="text-center text-gray-400 py-10">불러오는 중...</div>
        )}
        {!loading && posts.length === 0 && (
          <div className="text-center text-gray-400 py-10 bg-white rounded-xl border border-gray-100">
            아직 방명록이 없습니다. 첫 번째 글을 남겨보세요!
          </div>
        )}
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="font-medium text-gray-800 text-sm">{post.author_name}</span>
                <span className="text-gray-400 text-xs ml-2">{post.author_email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {new Date(post.created_at).toLocaleString('ko-KR')}
                </span>
                {post.author_email === userEmail && (
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-xs text-red-400 hover:text-red-600 transition cursor-pointer"
                  >
                    삭제
                  </button>
                )}
              </div>
            </div>
            <p className="text-gray-700 text-sm whitespace-pre-wrap">{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
