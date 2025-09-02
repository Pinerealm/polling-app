import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Users, Plus, Eye, ArrowRight, CheckCircle, Zap, Globe, TrendingUp } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation Header */}
      <nav className="bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Polling App
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" asChild className="text-gray-600 hover:text-gray-900">
                <a href="/login">Sign In</a>
              </Button>
              <Button size="sm" asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                <a href="/signup">Get Started</a>
              </Button>
            </div>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <div className="relative text-center py-24 px-4 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-5xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 rounded-2xl shadow-2xl">
                <BarChart3 className="h-16 w-16 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium mb-4">
              ✨ Trusted by 10,000+ creators
            </span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
              Create, Share & 
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Analyze Polls
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Build interactive polls for your community in minutes. Get instant results, 
            track voting trends, and make informed decisions with real-time analytics.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl px-8 py-4 text-lg">
              <a href="/polls/create">
                <Plus className="h-6 w-6 mr-3" />
                Start Creating Polls
                <ArrowRight className="h-5 w-5 ml-2" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild className="border-2 border-gray-300 hover:border-gray-400 px-8 py-4 text-lg">
              <a href="/polls">
                <Eye className="h-6 w-6 mr-3" />
                Explore Polls
              </a>
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Free to use</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span>Real-time results</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              <span>Share anywhere</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              🚀 Powerful Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need for 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Powerful Polls</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional-grade features to create, manage, and analyze engaging polls that drive real engagement
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-white border-0 shadow-lg group">
              <CardHeader className="pb-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Plus className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-4">Quick & Easy Setup</CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed text-lg">
                  Create professional polls in under 2 minutes. Add unlimited options, 
                  set expiration dates, and configure voting rules with our intuitive interface.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-white border-0 shadow-lg group">
              <CardHeader className="pb-4">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-4">Real-Time Engagement</CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed text-lg">
                  Share polls instantly via links or QR codes. Watch votes come in live, 
                  see participation rates, and engage your audience with interactive content.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-white border-0 shadow-lg group">
              <CardHeader className="pb-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-4">Advanced Analytics</CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed text-lg">
                  Get comprehensive insights with visual charts, vote percentages, and 
                  participation trends. Export data and make data-driven decisions.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium">
              🎉 Join thousands of creators
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start 
            <span className="block">Creating Amazing Polls?</span>
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Join our community of creators building engaging polls and gathering valuable insights from their audiences
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button size="lg" asChild className="bg-white text-gray-900 hover:bg-gray-100 shadow-2xl px-8 py-4 text-lg font-semibold">
              <a href="/signup">
                Get Started Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg">
              <a href="/login">Sign In</a>
            </Button>
          </div>
          
          {/* Social proof */}
          <div className="mt-16 text-white/80">
            <p className="text-sm mb-4">Trusted by creators worldwide</p>
            <div className="flex justify-center items-center gap-8 text-2xl font-bold">
              <div className="text-center">
                <div className="text-3xl">10K+</div>
                <div className="text-sm font-normal">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl">50K+</div>
                <div className="text-sm font-normal">Polls Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl">1M+</div>
                <div className="text-sm font-normal">Votes Cast</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
