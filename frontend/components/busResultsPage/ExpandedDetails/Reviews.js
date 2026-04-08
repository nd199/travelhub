import React from 'react';
import { Star, User } from 'lucide-react';
import { sampleReviews, reviewsSummary } from '../../../lib/data/reviews';

const Reviews = () => {
  return (
    <div className="p-4 bg-white rounded-xl">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Reviews</h2>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl font-bold text-gray-900">{reviewsSummary.averageRating}</span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= 4
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">({reviewsSummary.totalReviews} reviews)</span>
        </div>
      </div>

      <div className="space-y-4">
        {sampleReviews.map((review) => (
          <div
            key={review.id}
            className="p-4 border border-gray-200 rounded-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                  <User className="w-4 h-4 text-gray-500" />
                </div>
                <span className="font-medium text-gray-900">{review.user}</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600">{review.comment}</p>
            <span className="text-xs text-gray-400">{review.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
