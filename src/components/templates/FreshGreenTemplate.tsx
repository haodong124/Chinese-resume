import React from 'react'
import { ResumeData } from '../../App'
import { Phone, Mail, MapPin, Globe, Award, Briefcase, GraduationCap, Code, FolderOpen } from 'lucide-react'

interface TemplateProps {
  resumeData: ResumeData
  isPreview?: boolean
}

const FreshGreenTemplate: React.FC<TemplateProps> = ({ resumeData, isPreview = false }) => {
  const { personalInfo, experience, education, skills, projects, certificates } = resumeData
  return (
    <div className={`bg-white ${isPreview ? 'text-xs' : 'text-sm'} leading-relaxed`}>
      <div className="p-8 border-b-4 border-emerald-500">
        <h1 className="text-3xl font-bold text-emerald-700">{personalInfo.name}</h1>
        <p className="text-emerald-700/80">{personalInfo.title}</p>
        <div className="mt-2 flex flex-wrap gap-4 text-emerald-800/80">
          {personalInfo.phone && <span className="flex items-center gap-2"><Phone className="w-4 h-4"/>{personalInfo.phone}</span>}
          {personalInfo.email && <span className="flex items-center gap-2"><Mail className="w-4 h-4"/>{personalInfo.email}</span>}
          {personalInfo.location && <span className="flex items-center gap-2"><MapPin className="w-4 h-4"/>{personalInfo.location}</span>}
          {personalInfo.website && <span className="flex items-center gap-2"><Globe className="w-4 h-4"/>{personalInfo.website}</span>}
        </div>
      </div>
      <div className="p-8 space-y-8">
        {personalInfo.summary && (
          <section className="bg-emerald-50 border border-emerald-100 rounded-md p-4">
            <h2 className="text-emerald-800 font-semibold tracking-widest text-xs">SUMMARY</h2>
            <p className="text-gray-800 mt-2">{personalInfo.summary}</p>
          </section>
        )}
        <div className="grid md:grid-cols-2 gap-8">
          {experience?.length ? (
            <section>
              <h2 className="text-sm font-semibold text-gray-900 tracking-widest flex items-center gap-2"><Briefcase className="w-4 h-4 text-emerald-600"/>EXPERIENCE</h2>
              <div className="mt-3 space-y-4">
                {experience.map((e, i) => (
                  <div key={i} className="rounded-md border border-emerald-100 p-3">
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
            <section>
              <h2 className="text-sm font-semibold text-gray-900 tracking-widest flex items-center gap-2"><Code className="w-4 h-4 text-emerald-600"/>PROJECTS</h2>
              <div className="mt-3 space-y-3">
                {projects.map((p, i) => (
                  <div key={i} className="rounded-md border border-emerald-100 p-3">
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-medium text-gray-900">{p.name}</h3>
                      {p.link && <a className="text-xs text-emerald-700 hover:underline" href={p.link}>{p.link}</a>}
                    </div>
                    <p className="text-gray-700">{p.description}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        {skills?.length ? (
          <section>
            <h2 className="text-sm font-semibold text-gray-900 tracking-widest">SKILLS</h2>
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

        {education?.length ? (
          <section>
            <h2 className="text-sm font-semibold text-gray-900 tracking-widest flex items-center gap-2"><GraduationCap className="w-4 h-4 text-emerald-600"/>EDUCATION</h2>
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

        {certificates?.length ? (
          <section>
            <h2 className="text-sm font-semibold text-gray-900 tracking-widest flex items-center gap-2"><Award className="w-4 h-4 text-emerald-600"/>CERTIFICATES</h2>
            <div className="mt-3 grid md:grid-cols-2 gap-4">
              {certificates.map((c, i) => (
                <div key={i} className="rounded-md border border-emerald-100 p-3">
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
export default FreshGreenTemplate
