import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, User, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { updateProfile } from "@/lib/api";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [skills, setSkills] = useState(user?.skills?.join(", ") || "");
  const [interests, setInterests] = useState(user?.interests?.join(", ") || "");
  const [availability, setAvailability] = useState(user?.availability || "ACTIVE");
  const [bio, setBio] = useState(user?.bio || "");

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!user) {
      toast.error("Please log in first");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const skillsArray = skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);
      const interestsArray = interests
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i);

      const updatedUser = await updateProfile(user.id, {
        name,
        skills: skillsArray,
        interests: interestsArray,
        availability,
        bio: bio || undefined,
      });

      updateUser(updatedUser);
      toast.success("Profile updated successfully!");
      navigate("/intent");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update profile";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Background gradient effect */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-200 to-transparent rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-pink-200 via-purple-200 to-transparent rounded-full blur-3xl opacity-30" style={{ animationDelay: '1s' }} />
      </div>

      {/* Nav */}
      <nav className="relative px-6 py-6 flex items-center justify-between max-w-6xl mx-auto w-full">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          Back
        </button>
      </nav>

      {/* Main content */}
      <main className="relative flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl space-y-10 animate-fade-in">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-40" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-black tracking-tight leading-none">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Create Your Profile
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-lg mx-auto leading-relaxed font-medium">
              Help us understand your strengths so we can find the perfect collaborators for you.
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-3xl bg-white/80 backdrop-blur-xl border-2 border-purple-100 p-8 space-y-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-base font-bold text-gray-900">
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:ring-0 bg-white/50 placeholder-gray-400 font-medium text-base"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="skills" className="text-base font-bold text-gray-900">
                Your Skills
              </Label>
              <Input
                id="skills"
                placeholder="e.g., React, Python, UI Design (comma separated)"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="h-12 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:ring-0 bg-white/50 placeholder-gray-400 font-medium text-base"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="interests" className="text-base font-bold text-gray-900">
                Interests
              </Label>
              <Input
                id="interests"
                placeholder="e.g., AI, Web Development, Startups (comma separated)"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="h-12 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:ring-0 bg-white/50 placeholder-gray-400 font-medium text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio (Optional)</Label>
              <textarea
                id="bio"
                placeholder="Tell us about yourself"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Availability</Label>
              <Select value={availability} onValueChange={setAvailability} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Available</SelectItem>
                  <SelectItem value="INACTIVE">Not Available</SelectItem>
                  <SelectItem value="ON_BREAK">On Break</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleSave}
              disabled={loading}
              className="w-full py-6 text-base font-display font-semibold gap-2 group"
            >
              {loading ? "Saving..." : "Save Profile"}
              {!loading && <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />}
            </Button>
          </div>

          {/* Info note */}
          <div className="flex items-start gap-3 p-5 rounded-xl bg-purple-50 border border-purple-200">
            <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 font-medium">
              Your profile helps us match you with people who have complementary skills and shared interests.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileSetup;
