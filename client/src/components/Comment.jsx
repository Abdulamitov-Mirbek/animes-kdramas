import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { MessageSquare, Heart, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const Comments = ({ episodeId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [episodeId]);

  const fetchComments = async () => {
    try {
      const response = await api.get(`/comments/episode/${episodeId}`);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to comment');
      return;
    }
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const response = await api.post(`/comments/episode/${episodeId}`, {
        content: newComment,
      });
      setComments([response.data.comment, ...comments]);
      setNewComment('');
      toast.success('Comment added!');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId) => {
    if (!user) {
      toast.error('Please login to like');
      return;
    }
    try {
      const response = await api.post(`/comments/${commentId}/like`);
      setComments(comments.map(c => 
        c._id === commentId 
          ? { ...c, likes: response.data.likes }
          : c
      ));
    } catch (error) {
      toast.error('Failed to like');
    }
  };

  if (loading) {
    return <div className="text-gray-400">Loading comments...</div>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        Comments ({comments.length})
      </h3>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-3">
          {user?.avatar ? (
            <img src={user.avatar} className="w-10 h-10 rounded-full" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-white font-bold">{user?.username?.[0] || '?'}</span>
            </div>
          )}
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={user ? "Write a comment..." : "Login to comment..."}
              disabled={!user}
              rows="2"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
            />
            <button
              type="submit"
              disabled={!user || submitting || !newComment.trim()}
              className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold disabled:opacity-50 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Post Comment
            </button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment._id} className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              {comment.userId?.avatar ? (
                <img src={comment.userId.avatar} className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {comment.userId?.username?.[0]?.toUpperCase() || '?'}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-white">{comment.userId?.username}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-300">{comment.content}</p>
                <button
                  onClick={() => handleLike(comment._id)}
                  className="mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Heart className={`w-3 h-3 ${comment.likes?.includes(user?._id) ? 'fill-red-500 text-red-500' : ''}`} />
                  <span>{comment.likes?.length || 0} likes</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;