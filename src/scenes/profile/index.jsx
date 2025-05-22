"use client"

import { useState } from "react"
import { User, Mail, Phone, MapPin, Calendar, Edit, Camera, Lock, Globe, Shield, Save, Clock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Sidebar from "@/components/sidebar"
import { useMobile } from "@/hooks/use-mobile"

const ProfilePage =()=> {
  const isMobile = useMobile()
  const [isEditing, setIsEditing] = useState(false)

  // User profile data
  const [profile, setProfile] = useState({
    name: "Abang Benerin",
    email: "abang@benerin.com",
    phone: "+62 812 3456 7890",
    location: "Jakarta, Indonesia",
    joinDate: "January 2023",
    role: "Admin",
    bio: "Customer service specialist with 5+ years of experience. Passionate about helping customers and solving problems efficiently.",
    avatar: "/placeholder.svg?height=200&width=200",
  })

  const handleSaveProfile = () => {
    setIsEditing(false)
    // Here you would typically save the profile data to your backend
  }

  return (
    <div className="flex flex-col md:flex-row bg-slate-50 min-h-screen">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow ml-0 md:ml-[60px] p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-indigo-700 mb-1">Profile</h1>
            <p className="text-sm text-slate-500">Manage your account settings and preferences</p>
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <Button onClick={handleSaveProfile} className="bg-indigo-700 hover:bg-indigo-800 gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="bg-white border border-slate-200 p-1">
            <TabsTrigger
              value="personal"
              className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"
            >
              Personal Info
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"
            >
              Security
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"
            >
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"
            >
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Card */}
              <Card className="md:col-span-1">
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="relative mb-4 mt-2">
                    <Avatar className="h-32 w-32 border-4 border-white shadow-md">
                      <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                      <AvatarFallback className="text-3xl">{profile.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="icon"
                        className="absolute bottom-0 right-0 bg-indigo-700 hover:bg-indigo-800 h-8 w-8 rounded-full"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-center">{profile.name}</h2>
                  <Badge className="mt-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200">{profile.role}</Badge>

                  <div className="w-full mt-6 space-y-3">
                    <div className="flex items-center gap-3 text-slate-600">
                      <Mail className="h-5 w-5 text-indigo-500" />
                      <span className="text-sm">{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <Phone className="h-5 w-5 text-indigo-500" />
                      <span className="text-sm">{profile.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <MapPin className="h-5 w-5 text-indigo-500" />
                      <span className="text-sm">{profile.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <Calendar className="h-5 w-5 text-indigo-500" />
                      <span className="text-sm">Joined {profile.joinDate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Details */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-indigo-700">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          disabled={!isEditing}
                          className="border-slate-200"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-indigo-500" />
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          disabled={!isEditing}
                          className="border-slate-200"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          disabled={!isEditing}
                          className="border-slate-200"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <Input
                          id="location"
                          value={profile.location}
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                          disabled={!isEditing}
                          className="border-slate-200"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      disabled={!isEditing}
                      className="min-h-[100px] border-slate-200"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Activity Stats */}
              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle className="text-indigo-700">Activity Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-indigo-50 rounded-lg p-4 text-center">
                      <p className="text-3xl font-bold text-indigo-700">127</p>
                      <p className="text-sm text-slate-600">Tickets Resolved</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <p className="text-3xl font-bold text-green-600">98%</p>
                      <p className="text-sm text-slate-600">Satisfaction Rate</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4 text-center">
                      <p className="text-3xl font-bold text-orange-600">4.2</p>
                      <p className="text-sm text-slate-600">Avg. Response Time (min)</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <p className="text-3xl font-bold text-blue-600">32</p>
                      <p className="text-sm text-slate-600">Active Tickets</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-indigo-700">Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-slate-400" />
                        <Input id="current-password" type="password" className="border-slate-200" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-slate-400" />
                        <Input id="new-password" type="password" className="border-slate-200" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-slate-400" />
                        <Input id="confirm-password" type="password" className="border-slate-200" />
                      </div>
                    </div>
                  </div>
                  <Button className="bg-indigo-700 hover:bg-indigo-800">Update Password</Button>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Enable 2FA</div>
                      <div className="text-sm text-slate-500">Add an extra layer of security to your account</div>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <h3 className="text-lg font-medium mb-4">Sessions</h3>
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Current Session</p>
                          <p className="text-sm text-slate-500">Jakarta, Indonesia • Chrome on Windows</p>
                          <p className="text-xs text-green-600 mt-1">Active now</p>
                        </div>
                        <Badge className="bg-green-100 text-green-700">Current</Badge>
                      </div>
                    </div>
                    <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                      Sign Out All Other Devices
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-indigo-700">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Email Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">New Ticket Alerts</Label>
                          <p className="text-sm text-slate-500">
                            Receive notifications when new tickets are assigned to you
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Ticket Updates</Label>
                          <p className="text-sm text-slate-500">Get notified when there are updates to your tickets</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Team Announcements</Label>
                          <p className="text-sm text-slate-500">Receive important team announcements</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 space-y-4">
                    <h3 className="text-lg font-medium">Push Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Browser Notifications</Label>
                          <p className="text-sm text-slate-500">Allow browser notifications for new messages</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Mobile Notifications</Label>
                          <p className="text-sm text-slate-500">Receive notifications on your mobile device</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 space-y-4">
                    <h3 className="text-lg font-medium">Notification Schedule</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="quiet-hours-start">Quiet Hours Start</Label>
                        <Input id="quiet-hours-start" type="time" defaultValue="22:00" className="border-slate-200" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quiet-hours-end">Quiet Hours End</Label>
                        <Input id="quiet-hours-end" type="time" defaultValue="08:00" className="border-slate-200" />
                      </div>
                    </div>
                    <Button className="bg-indigo-700 hover:bg-indigo-800">Save Schedule</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-indigo-700">System Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Language & Region</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-slate-400" />
                          <select
                            id="language"
                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="en">English</option>
                            <option value="id">Bahasa Indonesia</option>
                            <option value="ms">Bahasa Melayu</option>
                            <option value="zh">中文</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-slate-400" />
                          <select
                            id="timezone"
                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="asia/jakarta">Asia/Jakarta (GMT+7)</option>
                            <option value="asia/singapore">Asia/Singapore (GMT+8)</option>
                            <option value="asia/tokyo">Asia/Tokyo (GMT+9)</option>
                            <option value="america/los_angeles">America/Los Angeles (GMT-8)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 space-y-4">
                    <h3 className="text-lg font-medium">Appearance</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Dark Mode</Label>
                          <p className="text-sm text-slate-500">Switch between light and dark theme</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Compact View</Label>
                          <p className="text-sm text-slate-500">Use a more compact layout to fit more content</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 space-y-4">
                    <h3 className="text-lg font-medium">Privacy</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <Label className="text-base">Data Collection</Label>
                            <Badge variant="outline" className="text-xs">
                              Optional
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-500">
                            Allow us to collect usage data to improve our service
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Show Online Status</Label>
                          <p className="text-sm text-slate-500">Let others see when you're online</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                    <Button variant="outline" className="gap-2">
                      <Shield className="h-4 w-4" />
                      View Privacy Policy
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


export default ProfilePage