import React, { useState } from 'react'
import LandingPage from './components/LandingPage'
import InformationCollection from './components/InformationCollection'
import EnhancedAISkillRecommendation from './components/EnhancedAISkillRecommendation'
import ResumeEditor from './components/ResumeEditor'

export type TemplateType = 'modern' | 'classic' | 'azurill' | 'bronzor'
export type CurrentPage = 'landing' | 'info-collection' | 'ai-recommendation' | 'editor'

export interface PersonalInfo {
  name: string
  email: string
  phone: string
  location: string
  title?: string
  summary?: string
}

export interface Education {
  id: string
  school: string
  degree: string
  major: string
  duration: string
  description: string
  gpa?: string
}

export interface Experience {
  id: string
  company: string
  position: string
  duration: string
  description: string
}

export interface Project {
  id: string
  name: string
  role: string
  duration: string
  description: string
  technologies: string
  link?: string
}

export interface Skill {
  id: string
  name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  category: string
  description?: string
}

export interface Certificate {
  id: string
  name: string
  issuer: string
  date: string
  link?: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  type: 'education' | 'work' | 'project' | 'other'
  date?: string
}

export interface IndustryAnalysis {
  trends: string[]
  emergingSkills: string[]
  decliningSkills: string[]
  aiImpact: string
  remoteWorkImpact: string
}

export interface ResumeData {
  personalInfo: PersonalInfo
  education: Education[]
  experience: Experience[]
  projects: Project[]
  skills: Skill[]
  certificates: Certificate[]
  skillsSummary?: string
  achievements: Achievement[]
  industryAnalysis?: IndustryAnalysis
}

function App() {
  const [currentPage, setCurrentPage] = useState<CurrentPage>('landing')
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern')
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      title: '',
      summary: ''
    },
    education: [],
    experience: [],
    projects: [],
    skills: [],
    certificates: [],
    skillsSummary: '',
    achievements: [],
    industryAnalysis: {
      trends: [],
      emergingSkills: [],
      decliningSkills: [],
      aiImpact: '',
      remoteWorkImpact: ''
    }
  })

  const handleNavigate = (page: CurrentPage) => {
    setCurrentPage(page)
  }

  const handleGetStarted = () => {
    setCurrentPage('info-collection')
  }

  const handleInfoComplete = (info: PersonalInfo, education: Education[]) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: info,
      education: education
    }))
    setCurrentPage('ai-recommendation')
  }

  const handleSkillsComplete = (data: {
    skills: Skill[]
    skillsSummary: string
    achievements: Achievement[]
    industryAnalysis: IndustryAnalysis
  }) => {
    setResumeData(prev => ({
      ...prev,
      skills: data.skills,
      skillsSummary: data.skillsSummary,
      achievements: data.achievements,
      industryAnalysis: data.industryAnalysis
    }))
    setCurrentPage('editor')
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onGetStarted={handleGetStarted} />
      
      case 'info-collection':
        return (
          <InformationCollection
            initialData={resumeData.personalInfo}
            initialEducation={resumeData.education}
            onComplete={handleInfoComplete}
            onBack={() => handleNavigate('landing')}
          />
        )
      
      case 'ai-recommendation':
        return (
          <EnhancedAISkillRecommendation
            personalInfo={resumeData.personalInfo}
            education={resumeData.education}
            experience={resumeData.experience}
            initialSkills={resumeData.skills}
            onComplete={handleSkillsComplete}
            onBack={() => handleNavigate('info-collection')}
          />
        )
      
      case 'editor':
        return (
          <ResumeEditor
            resumeData={resumeData}
            setResumeData={setResumeData}
            selectedTemplate={selectedTemplate}
            onTemplateChange={setSelectedTemplate}
            onBack={() => handleNavigate('ai-recommendation')}
          />
        )
      
      default:
        return <LandingPage onGetStarted={handleGetStarted} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {renderCurrentPage()}
    </div>
  )
}

export default App
