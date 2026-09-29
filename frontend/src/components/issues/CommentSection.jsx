import React, { useState } from 'react';
import { Button } from '../common/Button';
import { formatTimeAgo } from '../../utils/formatters';
import { MessageSquare, Send, User, Shield, UserCheck, GraduationCap } from 'lucide-react';

export const CommentSection = ({ comments = [], onAddComment, currentUserId }) => {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;

    setSubmitting(true);
    try {
      await onAddComment(content.trim());
      setContent('');
    } catch (err) {
      console.error('Failed to submit comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
        <MessageSquare className="w-5 h-5 text-slate-400" />
        <h3 className="text-sm font-bold text-white">
          Activity & Comments ({comments.length})
        </h3>
      </div>

      {/* Comment List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-xs text-slate-400 py-3 text-center">
            No comments yet. Post the first update or question below.
          </p>
        ) : (
          comments.map((comment) => {
            const isMe = comment.userId === currentUserId;
            let RoleIcon = GraduationCap;
            if (comment.userRole === 'ROLE_ADMIN') RoleIcon = Shield;
            if (comment.userRole === 'ROLE_STAFF') RoleIcon = UserCheck;

            return (
              <div
                key={comment.id}
                className={`flex gap-3 text-left ${
                  isMe ? 'flex-row-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                  <RoleIcon className="w-4 h-4" />
                </div>

                <div
                  className={`max-w-[80%] rounded-2xl p-4 text-xs ${
                    isMe
                      ? 'bg-brand-600 text-white rounded-tr-none'
                      : 'bg-slate-800/90 text-slate-200 rounded-tl-none border border-slate-700/80 shadow-md'
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 mb-1 text-[11px] ${
                      isMe ? 'text-brand-100 justify-end' : 'text-slate-400'
                    }`}
                  >
                    <span className={`font-semibold ${isMe ? 'text-white' : 'text-brand-400'}`}>
                      {isMe ? 'You' : comment.userName}
                    </span>
                    <span>•</span>
                    <span>{formatTimeAgo(comment.createdAt)}</span>
                  </div>
                  <p className="leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input box */}
      <form onSubmit={handleSubmit} className="pt-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Write a comment or resolution note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={submitting}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-950 text-white placeholder-slate-500"
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={submitting}
            disabled={!content.trim()}
            icon={Send}
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};
