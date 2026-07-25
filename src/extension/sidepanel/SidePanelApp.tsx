import React, { useState } from 'react';
import { MainLayout } from '@/layouts';
import { Button, Textarea, Select, SectionHeader, PostPreview } from '@/components';
import { aiService } from '@/services';
import type { AIResponsePayload } from '@/types';

const POST_TYPE_OPTIONS = [
  { value: 'learning_journey', label: 'Learning Journey' },
  { value: 'project_showcase', label: 'Project Showcase' },
  { value: 'achievement', label: 'Achievement' },
  { value: 'career_update', label: 'Career Update' },
  { value: 'tutorial', label: 'Tutorial' },
  { value: 'opinion', label: 'Opinion' },
  { value: 'personal_story', label: 'Personal Story' },
];

const TONE_OPTIONS = [
  { value: 'storytelling', label: 'Storytelling' },
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'inspirational', label: 'Inspirational' },
  { value: 'technical', label: 'Technical' },
  { value: 'casual', label: 'Casual' },
];

const AUDIENCE_OPTIONS = [
  { value: 'developers', label: 'Developers' },
  { value: 'recruiters', label: 'Recruiters' },
  { value: 'students', label: 'Students' },
  { value: 'founders', label: 'Founders' },
  { value: 'general', label: 'General' },
];

const LENGTH_OPTIONS = [
  { value: 'short', label: 'Short' },
  { value: 'medium', label: 'Medium' },
  { value: 'long', label: 'Long' },
];

const PLACEHOLDER_TEXT = `Describe your idea...

Example:
• Completed Day 5 of #30DaysToUpskill
• Built my first Chrome Extension
• Learned React Hooks`;

export const SidePanelApp: React.FC = () => {
  const [idea, setIdea] = useState<string>('');
  const [postType, setPostType] = useState<string>('learning_journey');
  const [tone, setTone] = useState<string>('storytelling');
  const [audience, setAudience] = useState<string>('developers');
  const [length, setLength] = useState<string>('medium');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AIResponsePayload | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim() || isLoading) return;

    setIsLoading(true);
    setResult(null);

    try {
      const response = await aiService.generate({
        idea,
        postType,
        tone,
        audience,
        length,
      });

      setResult(response);
    } catch {
      setResult({
        success: false,
        error: 'An unexpected client error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isGenerateDisabled = idea.trim().length === 0 || isLoading;

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <form onSubmit={handleGenerate} className="flex flex-col gap-5">
          <SectionHeader title="What do you want to post about?" />

          <Textarea
            value={idea}
            onChange={(e) => {
              setIdea(e.target.value);
            }}
            placeholder={PLACEHOLDER_TEXT}
            rows={5}
            disabled={isLoading}
          />

          <div className="flex flex-col gap-4">
            <Select
              label="Post Type"
              value={postType}
              onChange={(e) => setPostType(e.target.value)}
              options={POST_TYPE_OPTIONS}
              disabled={isLoading}
            />

            <Select
              label="Tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              options={TONE_OPTIONS}
              disabled={isLoading}
            />

            <Select
              label="Audience"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              options={AUDIENCE_OPTIONS}
              disabled={isLoading}
            />

            <Select
              label="Length"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              options={LENGTH_OPTIONS}
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            disabled={isGenerateDisabled}
            className="w-full mt-1 py-3 text-sm font-semibold"
          >
            {isLoading ? 'Generating LinkedIn Post...' : 'Generate Post'}
          </Button>
        </form>

        {result && !result.success && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs font-medium text-red-300">
            {result.error}
          </div>
        )}

        {result && result.success && result.post && (
          <PostPreview post={result.post} />
        )}
      </div>
    </MainLayout>
  );
};
