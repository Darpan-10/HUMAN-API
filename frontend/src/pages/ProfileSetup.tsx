import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, User } from "lucide-react";
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
    <div className="min-h-screen flex flex-col">
      <nav className="px-6 py-5 flex items-center justify-between max-w-5xl mx-auto w-full">
        <span
          className="font-display text-xl font-bold tracking-tight text-foreground cursor-pointer"
          onClick={() => navigate("/")}
        >
          Human API
        </span>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4">
              <User className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Set Up Your Profile
            </h1>
            <p className="text-muted-foreground">
              Tell us about yourself so we can find the best matches.
            </p>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Input
                id="skills"
                placeholder="React, Python, Design (comma separated)"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests">Interests</Label>
              <Input
                id="interests"
                placeholder="AI, Web Development, Open Source"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
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
        </div>
      </main>
    </div>
  );
};

export default ProfileSetup;
