import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Users, Plus, Eye } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="text-center py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-full">
              <BarChart3 className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Create and Share Polls
          </h1>
          
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Build engaging polls for your community. Get real-time results, 
            share insights, and make data-driven decisions together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <a href="/polls/create">
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Poll
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="/polls">
                <Eye className="h-5 w-5 mr-2" />
                Browse Polls
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need for great polls
            </h2>
            <p className="text-lg text-gray-700">
              Powerful features to create engaging and insightful polls
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Plus className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-gray-900">Easy Creation</CardTitle>
                <CardDescription className="text-gray-700 leading-relaxed">
                  Create polls in minutes with our intuitive interface. 
                  Add multiple options, set expiration dates, and customize settings.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-gray-900">Community Engagement</CardTitle>
                <CardDescription className="text-gray-700 leading-relaxed">
                  Share polls with your community and get real-time results. 
                  See how people vote and engage with your content.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-purple-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-gray-900">Rich Analytics</CardTitle>
                <CardDescription className="text-gray-700 leading-relaxed">
                  Get detailed insights with charts, percentages, and voting trends. 
                  Make informed decisions based on real data.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Join thousands of users creating engaging polls every day
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <a href="/signup">Sign Up Free</a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="/login">Sign In</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
