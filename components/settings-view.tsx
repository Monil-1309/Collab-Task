"use client"

import { useState } from "react"
import { User, Lock, Bell, Palette, Upload, Save } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"

export function SettingsView() {
  const { user, updateProfile } = useAuth()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    inApp: true,
    taskUpdates: true,
    projectUpdates: true,
    mentions: true,
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleProfileSave = async () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      updateProfile({
        name: profileData.name,
        email: profileData.email,
      })

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })

      setIsLoading(false)
    }, 1000)
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Password Changed",
        description: "Your password has been changed successfully.",
      })

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      setIsLoading(false)
    }, 1000)
  }

  const handleNotificationSave = async () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Notifications Updated",
        description: "Your notification preferences have been saved.",
      })

      setIsLoading(false)
    }, 1000)
  }

  const handleAvatarUpload = () => {
    // Simulate file upload
    toast({
      title: "Avatar Upload",
      description: "Avatar upload is simulated in this demo.",
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                  <AvatarFallback className="text-lg">{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <Button onClick={handleAvatarUpload} variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Change Avatar
                  </Button>
                  <p className="text-sm text-muted-foreground mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                </div>
              </div>

              {/* Profile Form */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself"
                  rows={3}
                />
              </div>

              <Button onClick={handleProfileSave} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Enter current password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter new password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <Button onClick={handlePasswordChange} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Changing..." : "Change Password"}
              </Button>

              <div className="pt-6 border-t">
                <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add an extra layer of security to your account by enabling two-factor authentication.
                </p>
                <Button variant="outline">Enable 2FA</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, email: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, push: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="in-app-notifications">In-App Notifications</Label>
                    <p className="text-sm text-muted-foreground">Show notifications within the application</p>
                  </div>
                  <Switch
                    id="in-app-notifications"
                    checked={notifications.inApp}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, inApp: checked }))}
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Notification Types</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="task-updates">Task Updates</Label>
                      <p className="text-sm text-muted-foreground">When tasks are created, updated, or completed</p>
                    </div>
                    <Switch
                      id="task-updates"
                      checked={notifications.taskUpdates}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, taskUpdates: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="project-updates">Project Updates</Label>
                      <p className="text-sm text-muted-foreground">When projects are created or updated</p>
                    </div>
                    <Switch
                      id="project-updates"
                      checked={notifications.projectUpdates}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, projectUpdates: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="mentions">Mentions</Label>
                      <p className="text-sm text-muted-foreground">When you are mentioned in comments or tasks</p>
                    </div>
                    <Switch
                      id="mentions"
                      checked={notifications.mentions}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, mentions: checked }))}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleNotificationSave} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Saving..." : "Save Preferences"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Theme</Label>
                  <p className="text-sm text-muted-foreground mb-4">Choose your preferred theme for the application</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        theme === "light" ? "border-primary bg-primary/5" : "border-border"
                      }`}
                      onClick={() => setTheme("light")}
                    >
                      <div className="w-full h-20 bg-white border rounded mb-2"></div>
                      <p className="text-sm font-medium text-center">Light</p>
                    </div>

                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        theme === "dark" ? "border-primary bg-primary/5" : "border-border"
                      }`}
                      onClick={() => setTheme("dark")}
                    >
                      <div className="w-full h-20 bg-gray-900 border rounded mb-2"></div>
                      <p className="text-sm font-medium text-center">Dark</p>
                    </div>

                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        theme === "system" ? "border-primary bg-primary/5" : "border-border"
                      }`}
                      onClick={() => setTheme("system")}
                    >
                      <div className="w-full h-20 bg-gradient-to-r from-white to-gray-900 border rounded mb-2"></div>
                      <p className="text-sm font-medium text-center">System</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Display Options</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">Use a more compact layout to fit more content</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Animations</Label>
                      <p className="text-sm text-muted-foreground">Enable smooth animations and transitions</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
