'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Monitor, Shield, Users, Activity, Clock, CheckCircle, ArrowRight, Stethoscope, Heart, UserCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { icon: Users, label: 'Patients Served', value: '10,000+', color: 'text-blue-600' },
    { icon: Stethoscope, label: 'Medical Staff', value: '150+', color: 'text-green-600' },
    { icon: Activity, label: 'Surgeries Monthly', value: '500+', color: 'text-purple-600' },
    { icon: Clock, label: 'Average Wait Time', value: '< 15min', color: 'text-orange-600' }
  ];

  const features = [
    {
      icon: Shield,
      title: 'NHS Secure & Data Protection Act Compliance',
      description: 'Role-based authentication ensures only authorized personnel access sensitive patient information',
      image: 'nicolas-j-leclercq-fbovpZ4GuLg-unsplash.jpg'
    },
    {
      icon: Users,
      title: 'Real-Time Patient Tracking',
      description: 'Monitor patient progress through surgical procedures with live status updates and notifications',
      image: 'ian-taylor-4hWvAJP8ofM-unsplash.jpg'
    },
    {
      icon: Monitor,
      title: 'Family-Friendly Status Board',
      description: 'Public display board allows families to track surgical progress without compromising privacy',
      image: 'cdc-OJF3lYjC6vg-unsplash.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-green-200 rounded-full opacity-20 animate-float-delayed"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-200 rounded-full opacity-20 animate-float"></div>

        <div className="container mx-auto px-4 py-20">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Main Hero Content */}
            <div className="max-w-4xl mx-auto mb-16">
              <div className="flex items-center justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse"></div>
                  <div className="relative bg-primary p-4 rounded-full shadow-lg">
                    <Activity className="h-12 w-12 text-white animate-pulse" />
                  </div>
                </div>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Surgery Status Board
                <span className="block text-3xl md:text-4xl text-primary mt-2 font-medium">
                  Real-Time Surgical Tracking
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Streamline surgical workflows and keep families informed with our comprehensive 
                real-time tracking system designed for modern healthcare facilities.
              </p>

              {/* User Welcome Message */}
              {user && user.role !== 'guest' && (
                <div className={`mb-8 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                  <div className="inline-flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-sm">
                    <UserCheck className="h-6 w-6 text-green-600 mr-3" />
                    <div className="text-left">
                      <p className="text-green-800 font-semibold">Welcome back, {user.name}!</p>
                      <p className="text-green-600 text-sm">You have {user.role.replace('_', ' ')} access</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                {!user || user.role === 'guest' ? (
                  <>
                    <Link href="/login" className="w-full sm:w-auto">
                      <Button size="lg" className="w-full sm:w-64 h-14 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary group">
                        <Shield className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                        Staff Login
                        <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    <Link href="/status-board" className="w-full sm:w-auto">
                      <Button variant="outline" size="lg" className="w-full sm:w-64 h-14 text-lg font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-white shadow-lg hover:shadow-xl transition-all duration-300 group">
                        <Monitor className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                        View Status Board
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/dashboard" className="w-full sm:w-auto">
                      <Button size="lg" className="w-full sm:w-64 h-14 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary group">
                        <Activity className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                        Go to Dashboard
                        <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    <Link href="/patients" className="w-full sm:w-auto">
                      <Button variant="outline" size="lg" className="w-full sm:w-64 h-14 text-lg font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-white shadow-lg hover:shadow-xl transition-all duration-300 group">
                        <Users className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                        Manage Patients
                      </Button>
                    </Link>
                    <Link href="/status-board" className="w-full sm:w-auto">
                      <Button variant="secondary" size="lg" className="w-full sm:w-48 h-14 text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 bg-gray-100 hover:bg-gray-200 text-gray-700 group">
                        <Monitor className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                        Status Board
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Stats Section */}
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-20 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                  <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3 group-hover:scale-110 transition-transform`} />
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Healthcare Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge technology with healthcare expertise to deliver 
              seamless surgical workflow management and family communication.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className={`group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 shadow-lg overflow-hidden ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${800 + index * 200}ms` }}>
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg">
                      <feature.icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-primary to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <div className={`max-w-3xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Heart className="h-16 w-16 text-white mx-auto mb-6 animate-pulse" />
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Surgical Workflow?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Join thousands of healthcare professionals who trust our platform to deliver 
              exceptional patient care and family communication.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chat">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto h-14 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group">
                  <Activity className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Get Help & Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className={`flex flex-wrap justify-center items-center gap-8 opacity-60 transition-all duration-1000 ${isVisible ? 'opacity-60 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">NHS and Data Protection Act Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">SOC 2 Certified</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-gray-700">99.9% Uptime</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}