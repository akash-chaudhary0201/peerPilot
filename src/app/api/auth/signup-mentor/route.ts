import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, password, roleTitle, company, yoe, bio, specialties, skills, phone, availableDays, availableSlots } = data;

    if (!name || !email || !roleTitle || !company || !yoe || !bio) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if email already exists in any table
    const existingStudent = await prisma.student.findUnique({ where: { email: cleanEmail } });
    const existingMentor = await prisma.mentor.findUnique({ where: { email: cleanEmail } });
    const existingAdmin = await prisma.admin.findUnique({ where: { email: cleanEmail } });

    if (existingStudent || existingMentor || existingAdmin) {
      return NextResponse.json({ error: "A user with this email address already exists." }, { status: 400 });
    }

    // Generate Custom MEN ID
    const mentorCount = await prisma.mentor.count();
    const idNumber = `MEN-${10005 + mentorCount}`;

    // Hash "1234" for mentor password as requested by the user: "so mentor password would be 1234"
    const passwordHash = await bcrypt.hash("1234", 10);

    // Process skills array
    let skillsArray: string[] = [];
    if (Array.isArray(skills) && skills.length > 0) {
      skillsArray = skills;
    } else if (typeof skills === "string" && skills.trim().length > 0) {
      skillsArray = skills.split(",").map(s => s.trim()).filter(Boolean);
    } else {
      skillsArray = ["Generalist"];
    }

    // Map entered skills to a primary specialty
    let primarySpecialty = "Backend";
    const lowerSkills = skillsArray.map(s => s.toLowerCase());
    
    if (lowerSkills.some(s => s.includes("frontend") || s.includes("react") || s.includes("vue") || s.includes("css") || s.includes("html") || s.includes("ui") || s.includes("ux") || s.includes("web"))) {
      primarySpecialty = "Frontend";
    } else if (lowerSkills.some(s => s.includes("design") || s.includes("system design") || s.includes("architecture") || s.includes("scale") || s.includes("scalability"))) {
      primarySpecialty = "System Design";
    } else if (lowerSkills.some(s => s.includes("hr") || s.includes("behavioral") || s.includes("resume") || s.includes("interview prep") || s.includes("career") || s.includes("coaching") || s.includes("communication"))) {
      primarySpecialty = "HR & Behavioral";
    } else {
      primarySpecialty = "Backend"; // default fallback
    }

    const newMentor = await prisma.mentor.create({
      data: {
        idNumber,
        name,
        email: cleanEmail,
        passwordHash, // default "1234" hashed
        phone: phone || null,
        role: roleTitle,
        company,
        specialty: primarySpecialty,
        bio,
        rating: 5.0,
        completedSessions: 0,
        experience: yoe.toLowerCase().includes("years") ? yoe : `${yoe} Years`,
        skills: skillsArray,
        availableDays: Array.isArray(availableDays) && availableDays.length > 0 ? availableDays : ["Monday", "Wednesday", "Friday"],
        availableSlots: Array.isArray(availableSlots) && availableSlots.length > 0 ? availableSlots : ["10:00 AM", "2:00 PM", "4:30 PM", "7:00 PM"],
        blockedDates: [],
        approved: false, // Must be approved by super admin
      },
    });

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully.",
      mentor: {
        email: newMentor.email,
        name: newMentor.name,
      },
    });
  } catch (error: any) {
    console.error("Signup Mentor API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
