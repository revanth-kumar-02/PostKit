import React, { useState } from 'react';
import type { GeneratedPost } from '@/types/ai';
import { Button } from './Button';

export interface PostPreviewProps {
  post: GeneratedPost;
  className?: string;
}

export const PostPreview: React.FC<PostPreviewProps> = ({ post, className = '' }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const sections: string[] = [post.hook, post.body];
  if (post.reflection) sections.push(post.reflection);
  sections.push(post.cta);
  if (post.hashtags.length > 0) sections.push(post.hashtags.join(' '));

  const fullPostText = sections.join('\n\n');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullPostText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = fullPostText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900/90 p-4.5 backdrop-blur-sm ${className}`}>
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
          Generated Post Preview
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="text-xs font-medium py-1 px-3"
        >
          {copied ? '✓ Copied!' : 'Copy Post'}
        </Button>
      </div>

      <div className="flex flex-col gap-3 text-sm text-zinc-100 leading-relaxed font-normal">
        {/* Hook */}
        <p className="font-semibold text-zinc-50 text-base leading-snug">{post.hook}</p>

        {/* Body */}
        <div className="whitespace-pre-wrap text-zinc-300 space-y-2">{post.body}</div>

        {/* Reflection */}
        {post.reflection && (
          <p className="text-zinc-300 bg-zinc-950/60 p-3 rounded-lg border-l-2 border-blue-500 text-xs italic leading-relaxed">
            {post.reflection}
          </p>
        )}

        {/* CTA */}
        <p className="text-zinc-300 font-medium pt-1">{post.cta}</p>

        {/* Hashtags */}
        {post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {post.hashtags.map((tag, idx) => (
              <span
                key={`${tag}-${idx}`}
                className="rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-400 border border-blue-500/20"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
