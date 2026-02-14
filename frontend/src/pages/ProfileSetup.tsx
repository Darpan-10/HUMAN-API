import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [availability, setAvailability] = useState("");

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    // Store profile locally for now
    localStorage.setItem(
      "humanapi_profile",
      JSON.stringify({ name, skills, interests, availability })
    );
    toast.success("Profile saved!");
    navigate("/intent");
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
              <Label>Availability</Label>
              <Select value={availability} onValueChange={setAvailability}>
                <SelectTrigger>
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleSave}
              className="w-full py-6 text-base font-display font-semibold gap-2 group"
            >
              Save Profile
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileSetup;
