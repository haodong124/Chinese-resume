import React from 'react'
import { ResumeData } from '../../App'
import { Phone, Mail, MapPin, Globe, Award, Briefcase, GraduationCap, Code, FolderOpen } from 'lucide-react'

interface TemplateProps {
  resumeData: ResumeData
  isPreview?: boolean
}

const MagazineStyleTemplate: React.FC<TemplateProps> = ({ resumeData, isPreview = false }) => {
  const { personalInfo, experience, education, skills, projects, certificates } = resumeData
  return (
    <div className={`bg-white ${isPreview ? 'text-xs' : 'text-sm'} leading-relaxed`}>
      <div className="p-8 border-b">
        <h1 className="text-4xl font-extrabold tracking-tight">{personalInfo.name}</h1>
        <p className="text-lg text-gray-600">{personalInfo.title}</p>
      </div>

      <div className="p-8 grid md:grid-cols-3 gap-8">
        <aside className="md:col-span-1 space-y-8">
          <section>
            <h2 className="text-xs font-semibold tracking-widest text-gray-900">CONTACT</h2>
            <div className="mt-2 space-y-2 text-gray-700">
              {personalInfo.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4"/>{personalInfo.phone}</div>}
              {personalInfo.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4"/>{personalInfo.email}</div>}
              {personalInfo.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4"/>{personalInfo.location}</div>}
              {personalInfo.website && <div className="flex items-center gap-2"><Globe className="w-4 h-4"/>{personalInfo.website}</div>}
            </div>
          </section>

          {skills?.length ? (
            <section>
              <h2 className="text-xs font-semibold tracking-widest text-gray-900">SKILLS</h2>
              <ul className="mt-2 space-y-1 text-gray-800">
                {skills.map((s, i) => <li key={i} className="flex items-center justify-between"><span>{s.name}</span><span className="text-xs text-gray-500">{s.level}</span></li>)}
              </ul>
            </section>
          ) : null}

          {certificates?.length ? (
            <section>
              <h2 className="text-xs font-semibold tracking-widest text-gray-900">AWARDS</h2>
              <ul className="mt-2 space-y-1 text-gray-800">
                {certificates.map((c, i) => <li key={i} className="flex items-center gap-2"><Award className="w-4 h-4"/><span>{c.name}</span></li>)}
              </ul>
            </section>
          ) : null}
        </aside>

        <main className="md:col-span-2 space-y-8">
          {personalInfo.summary && (
            <section>
              <h2 className="text-xs font-semibold tracking-widest text-gray-900">PROFILE</h2>
              <p className="mt-2 text-gray-800">{personalInfo.summary}</p>
            </section>
          )}

          {experience?.length ? (
            <section>
              <h2 className="text-xs font-semibold tracking-widest text-gray-900">EXPERIENCE</h2>
              <div className="mt-3 space-y-4">
                {experience.map((e, i) => (
                  <article key={i} className="border-b pb-3">
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-medium text-gray-900">{e.role} · {e.company}</h3>
                      <span className="text-xs text-gray-500">{e.duration}</span>
                    </div>
                    <p className="text-gray-700">{e.description}</p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

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
              <h2 className="text-xs font-semibold tracking-widest text-gray-900">PROJECTS</h2>
              <div className="mt-3 grid md:grid-cols-2 gap-4">
                {projects.map((p, i) => (
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
          ) : null}
        </main>
      </div>
    </div>
  )
}
export default MagazineStyleTemplate
