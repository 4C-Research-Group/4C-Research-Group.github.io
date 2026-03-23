import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Users,
  Tag,
  ExternalLink,
  ArrowLeft,
  Brain,
  Activity,
  Eye,
  BookOpen,
  Target,
  DollarSign,
  FileText,
  Share2,
} from "lucide-react";
import { projects, type Project } from "@/data/projectsData";
import ProjectClient from "./ProjectClient";

const categoryIcons = {
  "Implementation Science": Brain,
  "Clinical Research": Activity,
  "Clinical Trial": Eye,
  Registry: BookOpen,
};

const statusColors = {
  active: "bg-green-100 text-green-800 border-green-200",
  completed: "bg-blue-100 text-blue-800 border-blue-200",
  upcoming: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

// Generate static params for all project IDs
export async function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }));
}

interface ProjectPageProps {
  params: { id: string };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  return <ProjectClient project={project} />;
}
