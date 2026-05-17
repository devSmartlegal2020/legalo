import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import KeywordMetricsBadge from './KeywordMetricsBadge';

interface KeywordRecommendation {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  trafficPotential: number;
  relevance: number;
  isEstimated: boolean;
}

interface KeywordRecommendationsProps {
  isOpen: boolean;
  onClose: () => void;
  keywords: KeywordRecommendation[];
  isLoading: boolean;
  loadingStep: number;
  error: string | null;
  source: string;
  onApply: (selectedKeywords: string[]) => void;
}

const LOADING_STEPS = [
  'Analyzing content with AI...',
  'Fetching SEO data from Ahrefs...',
  'Ranking keywords by relevance...',
];

const KeywordRecommendations: React.FC<KeywordRecommendationsProps> = ({
  isOpen,
  onClose,
  keywords,
  isLoading,
  loadingStep,
  error,
  source,
  onApply,
}) => {
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'relevance' | 'volume' | 'difficulty'>('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const toggleKeyword = (keyword: string) => {
    const newSelected = new Set(selectedKeywords);
    if (newSelected.has(keyword)) {
      newSelected.delete(keyword);
    } else {
      newSelected.add(keyword);
    }
    setSelectedKeywords(newSelected);
  };

  const toggleAll = () => {
    if (selectedKeywords.size === keywords.length) {
      setSelectedKeywords(new Set());
    } else {
      setSelectedKeywords(new Set(keywords.map((k) => k.keyword)));
    }
  };

  const handleSort = (field: 'relevance' | 'volume' | 'difficulty') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const sortedKeywords = [...keywords].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'relevance':
        comparison = a.relevance - b.relevance;
        break;
      case 'volume':
        comparison = a.volume - b.volume;
        break;
      case 'difficulty':
        comparison = a.difficulty - b.difficulty;
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleApply = () => {
    onApply(Array.from(selectedKeywords));
    setSelectedKeywords(new Set());
    onClose();
  };

  const isAllSelected = keywords.length > 0 && selectedKeywords.size === keywords.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] lg:max-w-[1200px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            Keyword Recommendations
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-gray-900">
                {LOADING_STEPS[Math.min(loadingStep, LOADING_STEPS.length - 1)]}
              </p>
              <div className="flex gap-1 justify-center">
                {LOADING_STEPS.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 w-8 rounded-full ${
                      index <= loadingStep ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {error && !isLoading && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {!isLoading && !error && keywords.length > 0 && (
          <div className="flex-1 overflow-y-auto pr-2">
            {source === 'kimi-estimated' && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <p className="text-sm text-yellow-700">
                  Ahrefs data unavailable. Showing AI-estimated metrics.
                </p>
              </div>
            )}

            <div className="border rounded-lg overflow-auto">
              <table className="w-full text-sm min-w-[800px]">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={toggleAll}
                      />
                    </th>
                     <th className="px-4 py-3 text-left font-medium text-gray-700 min-w-[200px]">
                       Keyword
                     </th>
                    <th
                      className="px-4 py-3 text-left font-medium text-gray-700 cursor-pointer hover:text-blue-600"
                      onClick={() => handleSort('volume')}
                    >
                      Volume {sortBy === 'volume' && (sortOrder === 'desc' ? '↓' : '↑')}
                    </th>
                    <th
                      className="px-4 py-3 text-left font-medium text-gray-700 cursor-pointer hover:text-blue-600"
                      onClick={() => handleSort('difficulty')}
                    >
                      KD {sortBy === 'difficulty' && (sortOrder === 'desc' ? '↓' : '↑')}
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">CPC</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">
                      Traffic
                    </th>
                    <th
                      className="px-4 py-3 text-left font-medium text-gray-700 cursor-pointer hover:text-blue-600"
                      onClick={() => handleSort('relevance')}
                    >
                      Relevance{' '}
                      {sortBy === 'relevance' && (sortOrder === 'desc' ? '↓' : '↑')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {sortedKeywords.map((keyword) => (
                    <tr
                      key={keyword.keyword}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={selectedKeywords.has(keyword.keyword)}
                          onCheckedChange={() => toggleKeyword(keyword.keyword)}
                        />
                      </td>
                       <td className="px-4 py-3 min-w-[200px]">
                         <div className="flex items-center gap-2 whitespace-nowrap">
                           <span className="font-medium text-gray-900 truncate max-w-[180px] inline-block" title={keyword.keyword}>
                             {keyword.keyword}
                           </span>
                           {keyword.isEstimated && (
                             <span className="text-xs text-gray-400 shrink-0">(est.)</span>
                           )}
                         </div>
                       </td>
                      <td className="px-4 py-3">
                        <KeywordMetricsBadge
                          value={keyword.volume}
                          type="volume"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <KeywordMetricsBadge
                          value={keyword.difficulty}
                          type="difficulty"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <KeywordMetricsBadge value={keyword.cpc} type="cpc" />
                      </td>
                      <td className="px-4 py-3">
                        <KeywordMetricsBadge
                          value={keyword.trafficPotential}
                          type="traffic"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full transition-all"
                              style={{ width: `${keyword.relevance * 10}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">
                            {keyword.relevance}/10
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              Selected: {selectedKeywords.size} of {keywords.length} keywords
            </div>
          </div>
        )}

        {!isLoading && !error && keywords.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No keywords found. Try expanding your content.
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {!isLoading && !error && keywords.length > 0 && (
            <Button
              onClick={handleApply}
              disabled={selectedKeywords.size === 0}
            >
              Apply Selected ({selectedKeywords.size})
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default KeywordRecommendations;
