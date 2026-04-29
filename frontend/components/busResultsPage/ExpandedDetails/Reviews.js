import React from 'react';
import { IoStar, IoPerson } from 'react-icons/io5';
import { sampleReviews, reviewsSummary } from '../../../lib/data/reviews';

const Reviews = ({ bus }) => {
  return (
    <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Reviews</h2>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-3xl font-bold text-gray-900">{reviewsSummary.averageRating}</span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <IoStar
                key={star}
                className={`w-4 h-4 ${
                  star <= 4
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">({reviewsSummary.totalReviews})</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {sampleReviews.map((review) => (
          <div
            key={review.id}
            className="p-4 border rounded-2xl border-gray-200 bg-gray-50/50 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                  <IoPerson className="w-4 h-4 text-gray-500" />
                </div>
                <span className="font-medium text-gray-900">{review.user}</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <IoStar
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{review.comment}</p>
            <span className="text-xs text-gray-400 mt-2 block text-right">{review.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
