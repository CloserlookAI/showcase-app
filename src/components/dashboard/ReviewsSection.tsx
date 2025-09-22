'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils";
import {
  Star,
  Users,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  Building2,
  ShoppingBag,
  BarChart3,
} from "lucide-react";

const reviewsData = {
  employee: {
    glassdoor: {
      overall: 4.2,
      reviewCount: 89,
      categories: {
        workLifeBalance: 4.1,
        compensation: 3.8,
        culture: 4.3,
        careerOpportunities: 3.9,
        management: 4.0
      },
      recentTrend: 0.3,
      recommendations: 78
    },
    indeed: {
      overall: 4.0,
      reviewCount: 156,
      categories: {
        workLifeBalance: 4.2,
        compensation: 3.7,
        management: 3.9,
        jobSecurity: 4.1
      }
    }
  },
  customer: {
    amazon: {
      overall: 4.6,
      reviewCount: 2847,
      fiveStars: 68,
      fourStars: 22,
      threeStars: 7,
      twoStars: 2,
      oneStar: 1,
      recentTrend: 0.1
    },
    trustpilot: {
      overall: 4.3,
      reviewCount: 156,
      excellent: 62,
      great: 28,
      average: 8,
      poor: 2
    },
    walmart: {
      overall: 4.4,
      reviewCount: 1923,
      recentTrend: 0.2
    }
  },
  social: {
    facebook: {
      likes: 45000,
      followers: 52000,
      rating: 4.5,
      reviewCount: 234
    },
    instagram: {
      followers: 128000,
      engagement: 3.2,
      mentions: 1450
    }
  }
};

const recentReviews = [
  {
    id: 1,
    platform: "Amazon",
    rating: 5,
    title: "Best kefir on the market!",
    text: "I've tried many kefir brands, but Lifeway's quality and taste are unmatched. The probiotic benefits are amazing.",
    author: "Sarah M.",
    date: "3 days ago",
    helpful: 12,
    category: "Product Quality"
  },
  {
    id: 2,
    platform: "Glassdoor",
    rating: 4,
    title: "Great company culture",
    text: "Lifeway Foods has a wonderful team environment. Management is supportive and values work-life balance.",
    author: "Current Employee",
    date: "1 week ago",
    helpful: 8,
    category: "Work Environment"
  },
  {
    id: 3,
    platform: "Trustpilot",
    rating: 5,
    title: "Excellent customer service",
    text: "Had an issue with a shipment and customer service resolved it quickly and professionally.",
    author: "Mike D.",
    date: "2 weeks ago",
    helpful: 15,
    category: "Customer Service"
  }
];

export default function ReviewsSection() {

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reviews & Ratings</h1>
              <p className="text-gray-600">Comprehensive review analysis across all platforms</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center space-x-2">
              <Building2 className="w-4 h-4" />
              <span>Employee Reviews</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-2">
              <div className="text-2xl font-bold text-gray-900">{reviewsData.employee.glassdoor.overall}</div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(reviewsData.employee.glassdoor.overall) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </div>
            <div className="text-sm text-gray-600">{formatNumber(reviewsData.employee.glassdoor.reviewCount)} reviews</div>
            <div className="flex items-center space-x-1 text-sm mt-1">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span className="text-green-600 font-medium">+{reviewsData.employee.glassdoor.recentTrend} this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Product Reviews</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-2">
              <div className="text-2xl font-bold text-gray-900">{reviewsData.customer.amazon.overall}</div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(reviewsData.customer.amazon.overall) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </div>
            <div className="text-sm text-gray-600">{formatNumber(reviewsData.customer.amazon.reviewCount)} reviews</div>
            <div className="flex items-center space-x-1 text-sm mt-1">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span className="text-green-600 font-medium">+{reviewsData.customer.amazon.recentTrend} this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Social Media</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-2">
              <div className="text-2xl font-bold text-gray-900">{reviewsData.social.facebook.rating}</div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(reviewsData.social.facebook.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </div>
            <div className="text-sm text-gray-600">{formatNumber(reviewsData.social.facebook.followers)} followers</div>
            <div className="text-sm text-green-600 mt-1">{reviewsData.social.instagram.engagement}% engagement</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reviews Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <Building2 className="w-5 h-5" />
              <span>Employee Satisfaction</span>
            </CardTitle>
            <CardDescription className="text-gray-600">Glassdoor breakdown by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(reviewsData.employee.glassdoor.categories).map(([category, rating]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">{rating}</span>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Would Recommend</span>
                  <span className="font-semibold text-green-600">{reviewsData.employee.glassdoor.recommendations}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <Star className="w-5 h-5" />
              <span>Customer Rating Distribution</span>
            </CardTitle>
            <CardDescription className="text-gray-600">Amazon reviews breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { stars: 5, percentage: reviewsData.customer.amazon.fiveStars },
                { stars: 4, percentage: reviewsData.customer.amazon.fourStars },
                { stars: 3, percentage: reviewsData.customer.amazon.threeStars },
                { stars: 2, percentage: reviewsData.customer.amazon.twoStars },
                { stars: 1, percentage: reviewsData.customer.amazon.oneStar }
              ].map(({ stars, percentage }) => (
                <div key={stars} className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600 w-6">{stars}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reviews */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-900">
            <MessageCircle className="w-5 h-5" />
            <span>Recent Reviews</span>
          </CardTitle>
          <CardDescription className="text-gray-600">Latest feedback from customers and employees</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {recentReviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <Badge variant="secondary">{review.platform}</Badge>
                    <Badge variant="outline">{review.category}</Badge>
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                <p className="text-gray-700 text-sm leading-relaxed mb-3">{review.text}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">by {review.author}</span>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <ThumbsUp className="w-3 h-3" />
                    <span>{review.helpful} helpful</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Platform Comparison */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-900">
            <BarChart3 className="w-5 h-5" />
            <span>Platform Comparison</span>
          </CardTitle>
          <CardDescription className="text-gray-600">Review performance across different platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">Amazon</div>
              <div className="text-2xl font-bold text-yellow-600">{reviewsData.customer.amazon.overall}</div>
              <div className="text-sm text-gray-600">{formatNumber(reviewsData.customer.amazon.reviewCount)} reviews</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">Glassdoor</div>
              <div className="text-2xl font-bold text-blue-600">{reviewsData.employee.glassdoor.overall}</div>
              <div className="text-sm text-gray-600">{formatNumber(reviewsData.employee.glassdoor.reviewCount)} reviews</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">Trustpilot</div>
              <div className="text-2xl font-bold text-green-600">{reviewsData.customer.trustpilot.overall}</div>
              <div className="text-sm text-gray-600">{formatNumber(reviewsData.customer.trustpilot.reviewCount)} reviews</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">Walmart</div>
              <div className="text-2xl font-bold text-purple-600">{reviewsData.customer.walmart.overall}</div>
              <div className="text-sm text-gray-600">{formatNumber(reviewsData.customer.walmart.reviewCount)} reviews</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}