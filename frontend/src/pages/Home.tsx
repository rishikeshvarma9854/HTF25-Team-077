import { Link } from 'react-router-dom';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-brand-900 mb-6">
          Your Personal
          <br />
          <span className="text-brand-600">AI Stylist</span>
        </h1>
        <p className="text-lg md:text-xl text-brand-600 max-w-2xl mx-auto mb-10">
          Upload your wardrobe, get personalized outfit recommendations, and never wonder what to wear again.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/wardrobe">
            <Button className="px-8 py-3 text-base">Build Your Wardrobe</Button>
          </Link>
          <Link to="/outfits">
            <Button variant="outline" className="px-8 py-3 text-base">Explore Outfits</Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section>
        <h2 className="font-display text-3xl font-semibold text-brand-900 mb-8 text-center">
          Everything You Need
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="group hover:shadow-lg transition-shadow">
            <div className="mb-4 h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-brand-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-brand-900 mb-2">Smart Wardrobe</h3>
            <p className="text-brand-600 mb-4">
              Upload photos of your clothes and let AI automatically categorize and organize them.
            </p>
            <Link to="/wardrobe" className="text-brand-700 font-medium hover:text-brand-900 inline-flex items-center gap-1">
              Get Started
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </Card>

          <Card className="group hover:shadow-lg transition-shadow">
            <div className="mb-4 h-12 w-12 rounded-full bg-accent-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-accent-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-brand-900 mb-2">AI Recommendations</h3>
            <p className="text-brand-600 mb-4">
              Get personalized outfit combinations based on occasion, weather, and your personal style.
            </p>
            <Link to="/outfits" className="text-brand-700 font-medium hover:text-brand-900 inline-flex items-center gap-1">
              View Outfits
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </Card>

          <Card className="group hover:shadow-lg transition-shadow">
            <div className="mb-4 h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-brand-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-brand-900 mb-2">Personal Stylist</h3>
            <p className="text-brand-600 mb-4">
              Chat with our AI stylist for personalized fashion advice and styling tips.
            </p>
            <Link to="/chat" className="text-brand-700 font-medium hover:text-brand-900 inline-flex items-center gap-1">
              Start Chatting
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-12 px-6 bg-gradient-to-br from-brand-100 to-brand-200 rounded-3xl">
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-brand-900 mb-4">
          Ready to transform your style?
        </h2>
        <p className="text-brand-700 mb-8 max-w-xl mx-auto">
          Join thousands of users who have simplified their morning routine with AI-powered outfit planning.
        </p>
        <Link to="/wardrobe">
          <Button className="px-8 py-3 text-base">Get Started Free</Button>
        </Link>
      </section>
    </div>
  );
}