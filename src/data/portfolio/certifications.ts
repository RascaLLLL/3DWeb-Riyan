import type { Certification } from "@/types/portfolio";
import { sourceComponent } from "./source";

function certificate(id: string, title: string, issuer: string): Certification {
  return { id, title, issuer, date: null, credentialUrl: null, source: sourceComponent("Certificates"),
    todos: [{ field: "date", message: "Add the actual issue date if available." }, { field: "credentialUrl", message: "Supply the issuer’s verified credential URL or approved certificate document." }] };
}
export const certifications: Certification[] = [
  certificate("aws-cloud-gen-ai", "Belajar Dasar Cloud dan Gen AI di AWS", "Dicoding Indonesia × AWS"),
  certificate("solid-principles", "Belajar Prinsip Pemrograman SOLID", "Dicoding Indonesia"),
  certificate("prompt-engineering", "Prompt Engineering untuk Software Developer", "Dicoding Indonesia"),
  certificate("amazon-ebs", "Managing and Monitoring Amazon Elastic Block Store (EBS)", "Amazon Web Services"),
  certificate("network-engineering", "Certificate of Competence in Computer Network Engineering", "BNSP"),
];
