import React from 'react'
import { ResumeData } from '../../App'
import { Phone, Mail, MapPin, Globe, Award, Briefcase, GraduationCap, Code, FolderOpen } from 'lucide-react'

interface TemplateProps {
  resumeData: ResumeData
  isPreview?: boolean
}

const AcademicCVTemplate: React.FC<TemplateProps> = ({ resumeData, isPreview = false }) => {
  const { personalInfo, experience, education, skills, projects, certificates } = resumeData
  return (
    <div className={`bg-white ${isPreview ? 'text-xs' : 'text-sm'} leading-relaxed`}>
      <div className="p-8 border-b">
        <h1 className="text-3xl font-bold text-gray-900">{personalInfo.name}</h1>
        <p className="text-gray-700">{personalInfo.title}</p>
        <div className="mt-2 flex flex-wrap gap-4 text-gray-700">
          {personalInfo.phone && <span className="flex items-center gap-2"><Phone className="w-4 h-4"/>{personalInfo.phone}</span>}
          {personalInfo.email && <span className="flex items-center gap-2"><Mail className="w-4 h-4"/>{personalInfo.email}</span>}
          {personalInfo.location && <span className="flex items-center gap-2"><MapPin className="w-4 h-4"/>{personalInfo.location}</span>}
          {personalInfo.website && <span className="flex items-center gap-2"><Globe className="w-4 h-4"/>{personalInfo.website}</span>}
        </div>
      </div>
      <div className="p-8 space-y-8">
        {personalInfo.summary && (
          <section>
            <h2 className="text-xs font-semibold tracking-widest text-gray-900">RESEARCH INTERESTS</h2>
            <p className="mt-2 text-gray-800">{personalInfo.summary}</p>
          </section>
        )}

        {education?.length ? (
          <section>
            <h2 className="text-xs font-semibold tracking-widest text-gray-900">EDUCATION</h2>
            <div className="mt-3 space-y-2">
              {education.map((ed, i) => (
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
        ) : null}

        {projects?.length ? (
          <section>
            <h2 className="text-xs font-semibold tracking-widest text-gray-900">PUBLICATIONS & PROJECTS</h2>
            <ol className="mt-2 list-decimal list-inside space-y-2 text-gray-800">
              {projects.map((p, i) => (
                <li key={i}>
                  <span className="font-medium">{p.name}</span>{p.link ? ' · ' : ''}
                  {p.link && <a className="text-blue-600 hover:underline" href={p.link}>{p.link}</a>}
                  {p.description && <span className="block text-gray-700">{p.description}</span>}
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {experience?.length ? (
          <section>
            <h2 className="text-xs font-semibold tracking-widest text-gray-900">TEACHING & EXPERIENCE</h2>
            <div className="mt-3 space-y-3">
              {experience.map((e, i) => (
                <div key={i}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-medium text-gray-900">{e.role} · {e.company}</h3>
                    <span className="text-xs text-gray-500">{e.duration}</span>
                  </div>
                  <p className="text-gray-700">{e.description}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {skills?.length ? (
          <section>
            <h2 className="text-xs font-semibold tracking-widest text-gray-900">SKILLS</h2>
            <ul className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-gray-800">
              {skills.map((s, i) => (
                <li key={i} className="flex items-center justify-between">
                  <span>{s.name}</span>
                  {s.level && <span className="text-xs text-gray-500">{s.level}</span>}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {certificates?.length ? (
          <section>
            <h2 className="text-xs font-semibold tracking-widest text-gray-900">AWARDS</h2>
            <ul className="mt-2 space-y-1 text-gray-800">
              {certificates.map((c, i) => <li key={i} className="flex items-center gap-2"><Award className="w-4 h-4"/><span>{c.name}</span> <span className="text-xs text-gray-500">{c.date}</span></li>)}
            </ul>
          </section>
        ) : null}
      </div>
    </div>
  )
}
export default AcademicCVTemplate
