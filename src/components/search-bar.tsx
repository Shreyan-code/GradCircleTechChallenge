'use client';

import { useEffect, useState } from 'react';
import { Search, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { aiSearchSuggester, type AiSearchSuggesterOutput } from '@/ai/flows/ai-search-suggester';
import Link from 'next/link';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [recommendations, setRecommendations] = useState<AiSearchSuggesterOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPopoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    if (query.length < 3) {
      setRecommendations(null);
      setPopoverOpen(false);
      return;
    }

    const debounce = setTimeout(async () => {
      setIsLoading(true);
      try {
        const result = await aiSearchSuggester({ query });
        setRecommendations(result);
        setPopoverOpen(true);
      } catch (e) {
        console.error('Failed to get search suggestions:', e);
      } finally {
        setIsLoading(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div className="relative flex-1 md:w-[300px] lg:w-[400px]">
      <Popover open={isPopoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="AI Search..."
              className="w-full rounded-lg bg-secondary pl-8"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {isLoading ? (
                <Loader2 className="absolute right-9 top-2.5 h-4 w-4 text-muted-foreground animate-spin" />
            ) : (
                <Sparkles className="absolute right-9 top-2.5 h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          {recommendations && recommendations.suggestions.length > 0 && (
            <div className="flex flex-col gap-1 p-2">
                <p className="text-xs font-semibold text-muted-foreground px-2 py-1">AI Suggestions</p>
                {recommendations.suggestions.map((rec) => (
                    <Link
                        href={rec.url}
                        key={rec.url}
                        className="group flex items-center justify-between rounded-md p-2 text-sm hover:bg-accent"
                        onClick={() => setPopoverOpen(false)}
                    >
                        <div>
                            <p className="font-medium">{rec.title}</p>
                            <p className="text-xs text-muted-foreground">{rec.reason}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                ))}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
