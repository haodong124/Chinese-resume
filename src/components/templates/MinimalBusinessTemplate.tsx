import React from 'react'
import { ResumeData } from '../../App'
import { Phone, Mail, MapPin, Globe, Award, Briefcase, GraduationCap, Code, FolderOpen } from 'lucide-react'

interface TemplateProps {
  resumeData: ResumeData
  isPreview?: boolean
}

const MinimalBusinessTemplate: React.FC<TemplateProps> = ({ resumeData, isPreview = false }) => {
  const { personalInfo, experience, education, skills, projects, certificates } = resumeData
  return (
    <div className={`bg-white ${isPreview ? 'text-xs' : 'text-sm'} leading-relaxed`}>
      <div className="grid grid-cols-12 gap-6 p-8">
        {/* 左侧信息栏 */}
        <aside className="col-span-4 border-r pr-6">
          <h1 className="text-2xl font-semibold text-gray-900">{personalInfo.name}</h1>
          <p className="text-gray-600">{personalInfo.title}</p>
          <div className="mt-4 space-y-2 text-gray-700">
            {personalInfo.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4"/><span>{personalInfo.phone}</span></div>}
            {personalInfo.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4"/><span>{personalInfo.email}</span></div>}
            {personalInfo.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4"/><span>{personalInfo.location}</span></div>}
            {personalInfo.website && <div className="flex items-center gap-2"><Globe className="w-4 h-4"/><span>{personalInfo.website}</span></div>}
          </div>
          {skills?.length ? (
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-gray-900 tracking-widest">技能 SKILLS</h2>
              <ul className="mt-2 grid grid-cols-1 gap-1 text-gray-700">
                {skills.map((s, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span>{s.name}</span>
                    {s.level && <span className="text-xs text-gray-500">{s.level}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {certificates?.length ? (
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-gray-900 tracking-widest">证书 CERTIFICATES</h2>
              <ul className="mt-2 space-y-1 text-gray-700">
                {certificates.map((c, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-gray-500"/><span>{c.name}</span>
                    <span className="text-xs text-gray-500">{c.issuer} {c.date ? '· ' + c.date : ''}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>

        {/* 右侧主体 */}
        <main className="col-span-8">
          {personalInfo.summary && (
            <section className="mb-6">
              <h2 className="text-sm font-semibold text-gray-900 tracking-widest">个人简介 SUMMARY</h2>
              <p className="mt-2 text-gray-700">{personalInfo.summary}</p>
            </section>
          )}

          {experience?.length ? (
            <section className="mb-6">
              <h2 className="text-sm font-semibold text-gray-900 tracking-widest flex items-center gap-2"><Briefcase className="w-4 h-4"/>工作经历 EXPERIENCE</h2>
              <div className="mt-3 space-y-4">
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

          {projects?.length ? (
            <section className="mb-6">
              <h2 className="text-sm font-semibold text-gray-900 tracking-widest flex items-center gap-2"><FolderOpen className="w-4 h-4"/>项目 PROJECTS</h2>
              <div className="mt-3 grid grid-cols-1 gap-3">
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

          {education?.length ? (
            <section>
              <h2 className="text-sm font-semibold text-gray-900 tracking-widest flex items-center gap-2"><GraduationCap className="w-4 h-4"/>教育 EDUCATION</h2>
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
export default MinimalBusinessTemplate
