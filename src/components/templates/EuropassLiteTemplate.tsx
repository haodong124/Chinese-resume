import React from 'react'
import { ResumeData } from '../../App'
import { Phone, Mail, MapPin, Globe, Award, Briefcase, GraduationCap, Code, FolderOpen } from 'lucide-react'

interface TemplateProps {
  resumeData: ResumeData
  isPreview?: boolean
}

const EuropassLiteTemplate: React.FC<TemplateProps> = ({ resumeData, isPreview = false }) => {
  const { personalInfo, experience, education, skills, projects, certificates } = resumeData
  return (
    <div className={`bg-white ${isPreview ? 'text-xs' : 'text-sm'} leading-relaxed`}>
      <div className="p-8 border-b-4 border-blue-700">
        <h1 className="text-3xl font-bold text-blue-800">{personalInfo.name}</h1>
        <p className="text-blue-800/80">{personalInfo.title}</p>
      </div>
      <div className="p-8 space-y-8">
        <section>
          <h2 className="text-xs font-semibold tracking-widest text-blue-800">PERSONAL INFORMATION</h2>
          <div className="mt-2 grid md:grid-cols-2 gap-4 text-gray-800">
            <div className="space-y-2">
              {personalInfo.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4"/><span>{personalInfo.phone}</span></div>}
              {personalInfo.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4"/><span>{personalInfo.email}</span></div>}
            </div>
            <div className="space-y-2">
              {personalInfo.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4"/><span>{personalInfo.location}</span></div>}
              {personalInfo.website && <div className="flex items-center gap-2"><Globe className="w-4 h-4"/><span>{personalInfo.website}</span></div>}
            </div>
          </div>
        </section>

        {personalInfo.summary && (
          <section>
            <h2 className="text-xs font-semibold tracking-widest text-blue-800">SUMMARY</h2>
            <p className="mt-2 text-gray-800">{personalInfo.summary}</p>
          </section>
        )}

        {experience?.length ? (
          <section>
            <h2 className="text-xs font-semibold tracking-widest text-blue-800">WORK EXPERIENCE</h2>
            <div className="mt-3 space-y-4">
              {experience.map((e, i) => (
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
        ) : null}

        {education?.length ? (
          <section>
            <h2 className="text-xs font-semibold tracking-widest text-blue-800">EDUCATION AND TRAINING</h2>
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

        {skills?.length ? (
          <section>
            <h2 className="text-xs font-semibold tracking-widest text-blue-800">SKILLS</h2>
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

        {projects?.length ? (
          <section>
            <h2 className="text-xs font-semibold tracking-widest text-blue-800">PROJECTS</h2>
            <div className="mt-3 grid md:grid-cols-2 gap-4">
              {projects.map((p, i) => (
                <div key={i} className="border rounded-md p-3">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-medium text-gray-900">{p.name}</h3>
                    {p.link && <a className="text-xs text-blue-700 hover:underline" href={p.link}>{p.link}</a>}
                  </div>
                  <p className="text-gray-700">{p.description}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {certificates?.length ? (
          <section>
            <h2 className="text-xs font-semibold tracking-widest text-blue-800">CERTIFICATES</h2>
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
export default EuropassLiteTemplate
