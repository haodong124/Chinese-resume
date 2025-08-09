import React from 'react'
import { ResumeData } from '../../App'
import { Phone, Mail, MapPin, Globe, Award, Briefcase, GraduationCap, Code, FolderOpen } from 'lucide-react'

interface TemplateProps {
  resumeData: ResumeData
  isPreview?: boolean
}

const ModernCardTemplate: React.FC<TemplateProps> = ({ resumeData, isPreview = false }) => {
  const { personalInfo, experience, education, skills, projects, certificates } = resumeData
  return (
    <div className={`bg-gray-50 ${isPreview ? 'text-xs' : 'text-sm'} leading-relaxed`}>
      <div className="max-w-5xl mx-auto p-8 space-y-6">
        <section className="bg-white rounded-xl shadow p-6">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{personalInfo.name}</h1>
              <p className="text-gray-700">{personalInfo.title}</p>
            </div>
            <div className="text-right text-gray-700">
              {personalInfo.phone && <div className="flex items-center gap-2 justify-end"><Phone className="w-4 h-4"/>{personalInfo.phone}</div>}
              {personalInfo.email && <div className="flex items-center gap-2 justify-end"><Mail className="w-4 h-4"/>{personalInfo.email}</div>}
              {personalInfo.location && <div className="flex items-center gap-2 justify-end"><MapPin className="w-4 h-4"/>{personalInfo.location}</div>}
              {personalInfo.website && <div className="flex items-center gap-2 justify-end"><Globe className="w-4 h-4"/>{personalInfo.website}</div>}
            </div>
          </div>
          {personalInfo.summary && <p className="mt-4 text-gray-800">{personalInfo.summary}</p>}
        </section>

        <div className="grid md:grid-cols-2 gap-6">
          <section className="bg-white rounded-xl shadow p-6">
            <h2 className="text-sm font-semibold text-gray-900 tracking-widest flex items-center gap-2"><Briefcase className="w-4 h-4"/>EXPERIENCE</h2>
            <div className="mt-3 space-y-4">
              {experience?.map((e, i) => (
                <div key={i} className="border rounded-md p-3">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-medium text-gray-900">{e.role} · {e.company}</h3>
                    <span className="text-xs text-gray-500">{e.duration}</span>
                  </div>
                  <p className="text-gray-700">{e.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-xl shadow p-6">
            <h2 className="text-sm font-semibold text-gray-900 tracking-widest flex items-center gap-2"><Code className="w-4 h-4"/>PROJECTS</h2>
            <div className="mt-3 space-y-3">
              {projects?.map((p, i) => (
                <div key={i} className="border rounded-md p-3">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-medium text-gray-900">{p.name}</h3>
                    {p.link && <a className="text-xs text-blue-600 hover:underline" href={p.link}>{p.link}</a>}
                  </div>
                  <p className="text-gray-700">{p.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <section className="bg-white rounded-xl shadow p-6">
            <h2 className="text-sm font-semibold text-gray-900 tracking-widest">SKILLS</h2>
            <ul className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-gray-800">
              {skills?.map((s, i) => (
                <li key={i} className="flex items-center justify-between">
                  <span>{s.name}</span>
                  {s.level && <span className="text-xs text-gray-500">{s.level}</span>}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white rounded-xl shadow p-6">
            <h2 className="text-sm font-semibold text-gray-900 tracking-widest flex items-center gap-2"><GraduationCap className="w-4 h-4"/>EDUCATION</h2>
            <div className="mt-3 space-y-2">
              {education?.map((ed, i) => (
                <div key={i} className="flex items-baseline justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{ed.school} · {ed.degree}</h3>
                    <p className="text-gray-700">{ed.major}</p>
                  </div>
                  <span className="text-xs text-gray-500">{ed.duration}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {certificates?.length ? (
          <section className="bg-white rounded-xl shadow p-6">
            <h2 className="text-sm font-semibold text-gray-900 tracking-widest flex items-center gap-2"><Award className="w-4 h-4"/>CERTIFICATES</h2>
            <div className="mt-3 grid md:grid-cols-2 gap-4">
              {certificates.map((c, i) => (
                <div key={i} className="border rounded-md p-3">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-medium text-gray-900">{c.name}</h3>
                    <span className="text-xs text-gray-500">{c.date}</span>
                  </div>
                  <p className="text-gray-700">{c.issuer}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  )
}
export default ModernCardTemplate
