import React, { useState } from 'react';
import { CommunityPost, Product } from '../types';
import { Heart, MessageCircle, Share2, Tag, ShieldCheck, Plus, Sparkles } from 'lucide-react';

interface CommunityFeedViewProps {
  posts: CommunityPost[];
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onLikePost: (postId: string) => void;
}

export const CommunityFeedView: React.FC<CommunityFeedViewProps> = ({
  posts,
  products,
  onSelectProduct,
  onLikePost,
}) => {
  const [newPostText, setNewPostText] = useState('');

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      
      {/* Create Post Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white">
            A
          </div>
          <input
            type="text"
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder="Share a product story, craft progress, or service review..."
            className="flex-1 bg-slate-100 dark:bg-slate-800 text-xs px-4 py-2.5 rounded-full text-slate-900 dark:text-white focus:outline-none"
          />
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          <span className="flex items-center gap-1 font-medium text-purple-600 dark:text-purple-400">
            <Sparkles className="w-3.5 h-3.5" /> AI Product Tagging Enabled
          </span>
          <button
            onClick={() => {
              if (newPostText.trim()) {
                alert('Post published to NeedHub Community feed!');
                setNewPostText('');
              }
            }}
            className="px-4 py-1.5 rounded-full bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition"
          >
            Publish Post
          </button>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => {
          const taggedProd = products.find((p) => p.id === post.taggedProductId);
          return (
            <div
              key={post.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs space-y-3"
            >
              {/* Author Bar */}
              <div className="p-4 pb-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1">
                      {post.authorName}
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 inline" />
                    </h4>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 font-semibold text-slate-500">
                      {post.authorRole} • {post.createdAt}
                    </span>
                  </div>
                </div>
              </div>

              {/* Text content */}
              <p className="px-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {post.content}
              </p>

              {/* Image */}
              {post.image && (
                <div className="aspect-16/9 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <img src={post.image} alt="" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Tagged Buyable Product Box */}
              {taggedProd && (
                <div className="mx-4 p-3 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={taggedProd.images[0]}
                      alt={taggedProd.title}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[9px] font-bold uppercase text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                        <Tag className="w-3 h-3" /> Tagged Product
                      </span>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {taggedProd.title}
                      </h5>
                      <span className="text-xs font-black text-slate-900 dark:text-white font-mono">
                        ₹{taggedProd.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectProduct(taggedProd)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shrink-0"
                  >
                    View Item
                  </button>
                </div>
              )}

              {/* Actions Bar */}
              <div className="p-4 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
                <button
                  onClick={() => onLikePost(post.id)}
                  className={`flex items-center gap-1.5 font-semibold transition ${
                    post.isLiked ? 'text-rose-500' : 'hover:text-rose-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                  <span>{post.likesCount} Likes</span>
                </button>
                <button className="flex items-center gap-1.5 font-semibold hover:text-indigo-500 transition">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.commentsCount} Comments</span>
                </button>
                <button className="flex items-center gap-1.5 font-semibold hover:text-indigo-500 transition">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
