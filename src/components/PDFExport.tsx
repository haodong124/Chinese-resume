import React, { useState } from 'react'
import { FileDown, Loader2 } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { ResumeData } from '../App'

interface PDFExportProps {
  resumeData: ResumeData
  previewElementId: string
}

const PDFExport: React.FC<PDFExportProps> = ({ resumeData, previewElementId }) => {
  const [exporting, setExporting] = useState(false)

  const exportToPDF = async () => {
    setExporting(true)
    
    try {
      const element = document.getElementById(previewElementId)
      if (!element) {
        alert('找不到简历内容')
        return
      }

      // 生成canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      })

      // 创建PDF
      const pdf = new jsPDF('portrait', 'mm', 'a4')
      const imgData = canvas.toDataURL('image/png')
      
      const pdfWidth = 210 // A4宽度
      const pdfHeight = 297 // A4高度
      const imgWidth = pdfWidth - 20 // 留边距
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight)
      
      // 如果内容超过一页，添加新页
      if (imgHeight > pdfHeight - 20) {
        let position = pdfHeight - 20
        while (position < imgHeight) {
          pdf.addPage()
          pdf.addImage(imgData, 'PNG', 10, -position + 10, imgWidth, imgHeight)
          position += pdfHeight - 20
        }
      }

      // 保存PDF
      const fileName = `${resumeData.personalInfo.name || '简历'}.pdf`
      pdf.save(fileName)
      
    } catch (error) {
      console.error('PDF导出失败:', error)
      alert('PDF导出失败，请重试')
    } finally {
      setExporting(false)
    }
  }

  return (
    <button
      onClick={exportToPDF}
      disabled={exporting}
      className="flex items-center justify-center space-x-2 w-full px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-400 rounded-md transition-colors"
    >
      {exporting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>导出中...</span>
        </>
      ) : (
        <>
          <FileDown className="h-4 w-4" />
          <span>导出 PDF</span>
        </>
      )}
    </button>
  )
}

export default PDFExport