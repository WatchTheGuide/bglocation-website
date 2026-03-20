const QUICK_REPLIES = [
  "What features does the plugin include?",
  "How does pricing work?",
  "How do I set up background tracking?",
  "Does the trial mode have limitations?",
] as const;

type QuickRepliesProps = {
  onSelect: (question: string) => void;
};

export function QuickReplies({ onSelect }: QuickRepliesProps) {
  return (
    <div className="mb-3 flex flex-wrap gap-2">
      {QUICK_REPLIES.map((q) => (
        <button
          key={q}
          onClick={() => onSelect(q)}
          className="rounded-full border bg-background px-3 py-1.5 text-xs transition-colors hover:bg-muted"
        >
          {q}
        </button>
      ))}
    </div>
  );
}
