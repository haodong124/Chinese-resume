import React from 'react'
import { ResumeData } from '../../App'
import { Phone, Mail, MapPin, Globe, Award, Briefcase, GraduationCap, Code, FolderOpen } from 'lucide-react'

interface TemplateProps {
  resumeData: ResumeData
  isPreview?: boolean
}

const CreativeDuoToneTemplate: React.FC<TemplateProps> = ({ resumeData, isPreview = false }) => {
  const { personalInfo, experience, education, skills, projects, certificates } = resumeData
  return (
    <div className={`bg-white ${isPreview ? 'text-xs' : 'text-sm'} leading-relaxed`}>
      <div className="grid grid-cols-12 min-h-full">
        <aside className="col-span-4 bg-purple-600 text-white p-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{personalInfo.name}</h1>
            <p className="opacity-90">{personalInfo.title}</p>
          </div>
          <div className="space-y-2 opacity-95">
            {personalInfo.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4"/><span>{personalInfo.phone}</span></div>}
            {personalInfo.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4"/><span>{personalInfo.email}</span></div>}
            {personalInfo.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4"/><span>{personalInfo.location}</span></div>}
            {personalInfo.website && <div className="flex items-center gap-2"><Globe className="w-4 h-4"/><span>{personalInfo.website}</span></div>}
          </div>
          {skills?.length ? (
            <div>
              <h2 className="text-xs tracking-widest font-semibold">SKILLS</h2>
              <ul className="mt-2 space-y-1">
                {skills.map((s, i) => <li key={i} className="flex items-center justify-between"><span>{s.name}</span><span className="text-xs opacity-90">{s.level}</span></li>)}
              </ul>
            </div>
          ) : null}
          {certificates?.length ? (
            <div>
              <h2 className="text-xs tracking-widest font-semibold">CERTIFICATES</h2>
              <ul className="mt-2 space-y-1">
                {certificates.map((c, i) => <li key={i} className="flex items-center gap-2"><Award className="w-4 h-4"/><span>{c.name}</span></li>)}
              </ul>
            </div>
          ) : null}
        </aside>
        <main className="col-span-8 p-8">
          {personalInfo.summary && (
            <section className="mb-6">
              <h2 className="text-xs font-semibold tracking-widest text-purple-600">SUMMARY</h2>
              <p className="mt-2 text-gray-800">{personalInfo.summary}</p>
            </section>
          )}
          {experience?.length ? (
            <section className="mb-6">
              <h2 className="text-xs font-semibold tracking-widest text-purple-600 flex items-center gap-2"><Briefcase className="w-4 h-4"/>EXPERIENCE</h2>
              <div className="mt-3 space-y-4">
                {experience.map((e, i) => (
                  <div key={i} className="border-b pb-3">
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
          {projects?.length ? (
            <section className="mb-6">
              <h2 className="text-xs font-semibold tracking-widest text-purple-600 flex items-center gap-2"><Code className="w-4 h-4"/>PROJECTS</h2>
              <div className="mt-3 grid md:grid-cols-2 gap-4">
                {projects.map((p, i) => (
                  <div key={i} className="border rounded-md p-3">
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-medium text-gray-900">{p.name}</h3>
                      {p.link && <a className="text-xs text-purple-600 hover:underline" href={p.link}>{p.link}</a>}
                    </div>
                    <p className="text-gray-700">{p.description}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
          {education?.length ? (
            <section>
              <h2 className="text-xs font-semibold tracking-widest text-purple-600 flex items-center gap-2"><GraduationCap className="w-4 h-4"/>EDUCATION</h2>
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
        </main>
      </div>
    </div>
  )
}
export default CreativeDuoToneTemplate
