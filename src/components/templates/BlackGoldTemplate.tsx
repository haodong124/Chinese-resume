import React from 'react'
import { ResumeData } from '../../App'
import { Phone, Mail, MapPin, Globe, Award, Briefcase, GraduationCap, Code, FolderOpen } from 'lucide-react'

interface TemplateProps {
  resumeData: ResumeData
  isPreview?: boolean
}

const BlackGoldTemplate: React.FC<TemplateProps> = ({ resumeData, isPreview = false }) => {
  const { personalInfo, experience, education, skills, projects, certificates } = resumeData
  return (
    <div className={`bg-black ${isPreview ? 'text-xs' : 'text-sm'} leading-relaxed text-gray-100`}>
      <div className="p-8 border-b border-yellow-600">
        <h1 className="text-3xl font-bold text-yellow-400">{personalInfo.name}</h1>
        <p className="text-yellow-200/90">{personalInfo.title}</p>
        <div className="mt-2 flex flex-wrap gap-4 text-yellow-200/80">
          {personalInfo.phone && <span className="flex items-center gap-2"><Phone className="w-4 h-4"/>{personalInfo.phone}</span>}
          {personalInfo.email && <span className="flex items-center gap-2"><Mail className="w-4 h-4"/>{personalInfo.email}</span>}
          {personalInfo.location && <span className="flex items-center gap-2"><MapPin className="w-4 h-4"/>{personalInfo.location}</span>}
          {personalInfo.website && <span className="flex items-center gap-2"><Globe className="w-4 h-4"/>{personalInfo.website}</span>}
        </div>
      </div>

      <div className="p-8 space-y-8">
        {personalInfo.summary && (
          <section>
            <h2 className="text-xs tracking-widest text-yellow-400 font-semibold">SUMMARY</h2>
            <p className="mt-2 text-gray-100">{personalInfo.summary}</p>
          </section>
        )}
        {experience?.length ? (
          <section>
            <h2 className="text-xs tracking-widest text-yellow-400 font-semibold flex items-center gap-2"><Briefcase className="w-4 h-4"/>EXPERIENCE</h2>
            <div className="mt-3 space-y-4">
              {experience.map((e, i) => (
                <div key={i} className="border border-yellow-700/40 rounded-md p-3">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-medium text-yellow-200">{e.role} · {e.company}</h3>
                    <span className="text-xs text-yellow-300/70">{e.duration}</span>
                  </div>
                  <p className="text-gray-100">{e.description}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <div className="grid md:grid-cols-2 gap-8">
          {projects?.length ? (
            <section>
              <h2 className="text-xs tracking-widest text-yellow-400 font-semibold flex items-center gap-2"><Code className="w-4 h-4"/>PROJECTS</h2>
              <div className="mt-3 space-y-3">
                {projects.map((p, i) => (
                  <div key={i} className="border border-yellow-700/40 rounded-md p-3">
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-medium text-yellow-200">{p.name}</h3>
                      {p.link && <a className="text-xs text-yellow-300 hover:underline" href={p.link}>{p.link}</a>}
                    </div>
                    <p className="text-gray-100">{p.description}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {skills?.length ? (
            <section>
              <h2 className="text-xs tracking-widest text-yellow-400 font-semibold">SKILLS</h2>
              <ul className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1">
                {skills.map((s, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span className="text-gray-100">{s.name}</span>
                    {s.level && <span className="text-xs text-yellow-300/70">{s.level}</span>}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        {education?.length ? (
          <section>
            <h2 className="text-xs tracking-widest text-yellow-400 font-semibold flex items-center gap-2"><GraduationCap className="w-4 h-4"/>EDUCATION</h2>
            <div className="mt-3 space-y-2">
              {education.map((ed, i) => (
                <div key={i} className="flex items-baseline justify-between">
                  <div>
                    <h3 className="font-medium text-yellow-200">{ed.school} · {ed.degree}</h3>
                    <p className="text-gray-100">{ed.major}</p>
                  </div>
                  <span className="text-xs text-yellow-300/70">{ed.duration}</span>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {certificates?.length ? (
          <section>
            <h2 className="text-xs tracking-widest text-yellow-400 font-semibold flex items-center gap-2"><Award className="w-4 h-4"/>CERTIFICATES</h2>
            <div className="mt-3 grid md:grid-cols-2 gap-4">
              {certificates.map((c, i) => (
                <div key={i} className="border border-yellow-700/40 rounded-md p-3">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-medium text-yellow-200">{c.name}</h3>
                    <span className="text-xs text-yellow-300/70">{c.date}</span>
                  </div>
                  <p className="text-gray-100">{c.issuer}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  )
}
export default BlackGoldTemplate
