import React from 'react';

interface KeywordMetricsBadgeProps {
  value: number;
  type: 'difficulty' | 'volume' | 'cpc' | 'traffic';
}

const KeywordMetricsBadge: React.FC<KeywordMetricsBadgeProps> = ({
  value,
  type,
}) => {
  const getDifficultyColor = (difficulty: number): string => {
    if (difficulty <= 30) {
      return 'bg-green-100 text-green-800 border-green-200';
    } else if (difficulty <= 60) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    } else {
      return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getDifficultyLabel = (difficulty: number): string => {
    if (difficulty <= 30) return 'Easy';
    if (difficulty <= 60) return 'Medium';
    return 'Hard';
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (type === 'difficulty') {
    return (
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getDifficultyColor(value)}`}
        >
          {getDifficultyLabel(value)}
        </span>
        <span className="text-xs text-gray-500">{value}/100</span>
      </div>
    );
  }

  if (type === 'volume') {
    return (
      <span className="text-sm font-medium text-gray-900">
        {formatNumber(value)}
      </span>
    );
  }

  if (type === 'cpc') {
    return (
      <span className="text-sm font-medium text-gray-900">
        ${value.toFixed(2)}
      </span>
    );
  }

  if (type === 'traffic') {
    return (
      <span className="text-sm font-medium text-gray-900">
        {formatNumber(value)}
      </span>
    );
  }

  return null;
};

export default KeywordMetricsBadge;
