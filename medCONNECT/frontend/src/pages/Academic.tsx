import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { BookOpen, Plus, Search, FileText, Video, Image as ImageIcon, Box, Play, Download } from 'lucide-react'
import { Viewer3D } from '@/components/3DViewer'

// Static fake data
const FAKE_SUBJECTS = [
  { id: '1', name: 'Anatomy', code: 'ANAT101', year: 1, description: 'Study of human body structure' },
  { id: '2', name: 'Physiology', code: 'PHYS101', year: 1, description: 'Study of body functions' },
  { id: '3', name: 'Pathology', code: 'PATH201', year: 2, description: 'Study of diseases' },
  { id: '4', name: 'Pharmacology', code: 'PHAR201', year: 2, description: 'Study of drugs and medications' },
  { id: '5', name: 'Medicine', code: 'MED301', year: 3, description: 'Clinical medicine' },
]

const FAKE_MODULES: Record<string, any[]> = {
  '1': [
    { 
      id: '1', 
      title: 'Cardiovascular System', 
      description: 'Heart, blood vessels, and circulation',
      topics: ['Heart Anatomy', 'Blood Vessels', 'Circulation'],
      resources: [
        { 
          id: '1', 
          title: 'Heart Anatomy Image', 
          type: '3d', 
          viewer_type: 'anatomy', 
          interactive: true,
          embed_code: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=800&fit=crop&q=80'
        },
        { id: '2', title: 'Cardiovascular Video', type: 'video' },
        { id: '3', title: 'Heart Anatomy Notes', type: 'pdf' },
      ]
    },
    { 
      id: '2', 
      title: 'Respiratory System', 
      description: 'Lungs, airways, and gas exchange',
      topics: ['Lung Anatomy', 'Breathing Mechanism', 'Gas Exchange'],
      resources: [
        { 
          id: '4', 
          title: 'Lung Anatomy Image', 
          type: '3d', 
          viewer_type: 'anatomy', 
          interactive: true,
          embed_code: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1200&h=800&fit=crop&q=80'
        },
        { id: '5', title: 'Respiratory Video', type: 'video' },
      ]
    },
    { 
      id: '3', 
      title: 'Nervous System', 
      description: 'Brain, spinal cord, and nerves',
      topics: ['Brain Anatomy', 'Neurons', 'Nerve Pathways'],
      resources: [
        { 
          id: '6', 
          title: 'Brain Anatomy Image', 
          type: '3d', 
          viewer_type: 'anatomy', 
          interactive: true,
          embed_code: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1200&h=800&fit=crop&q=80'
        },
      ]
    },
    { 
      id: '4', 
      title: 'Musculoskeletal System', 
      description: 'Bones, muscles, and joints',
      topics: ['Skeleton', 'Muscles', 'Joints'],
      resources: [
        { 
          id: '7', 
          title: 'Skeleton Anatomy Image', 
          type: '3d', 
          viewer_type: 'anatomy', 
          interactive: true,
          embed_code: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1200&h=800&fit=crop&q=80'
        },
      ]
    },
  ],
  '2': [
    { 
      id: '3', 
      title: 'Cardiac Physiology', 
      description: 'Heart function and cardiac cycle',
      topics: ['Cardiac Cycle', 'ECG', 'Heart Sounds'],
      resources: [
        { 
          id: '6', 
          title: 'Cardiac Function Image', 
          type: '3d', 
          viewer_type: 'physiology', 
          interactive: true,
          embed_code: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=800&fit=crop&q=80'
        },
      ]
    },
  ],
  '3': [
    { 
      id: '4', 
      title: 'Cardiovascular Pathology', 
      description: 'Diseases of heart and blood vessels',
      topics: ['Myocardial Infarction', 'Atherosclerosis', 'Hypertension'],
      resources: [
        { 
          id: '7', 
          title: 'Pathology Images', 
          type: '3d', 
          viewer_type: 'pathology', 
          interactive: true,
          embed_code: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1200&h=800&fit=crop&q=80'
        },
      ]
    },
  ],
  '4': [
    { 
      id: '5', 
      title: 'Cardiovascular Drugs', 
      description: 'Medications for heart conditions',
      topics: ['Antihypertensives', 'Antiarrhythmics', 'Anticoagulants'],
      resources: [
        { 
          id: '8', 
          title: 'Drug Mechanism Images', 
          type: '3d', 
          viewer_type: 'pharmacology', 
          interactive: true,
          embed_code: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1200&h=800&fit=crop&q=80'
        },
      ]
    },
  ],
}

const FAKE_RESOURCES: Record<string, any[]> = {
  '1': [
    { 
      id: '1', 
      title: 'Heart Anatomy Image', 
      type: '3d', 
      viewer_type: 'anatomy', 
      interactive: true,
      embed_code: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=800&fit=crop&q=80'
    },
    { id: '2', title: 'Cardiovascular System Video', type: 'video', external_url: '#' },
    { id: '3', title: 'Heart Anatomy Notes PDF', type: 'pdf', file_url: '#' },
    { id: '4', title: 'Heart Diagram', type: 'image', file_url: '#' },
  ],
  '2': [
    { 
      id: '4', 
      title: 'Lung Anatomy Image', 
      type: '3d', 
      viewer_type: 'anatomy', 
      interactive: true,
      embed_code: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1200&h=800&fit=crop&q=80'
    },
  ],
  '3': [
    { 
      id: '6', 
      title: 'Brain Anatomy Image', 
      type: '3d', 
      viewer_type: 'anatomy', 
      interactive: true,
      embed_code: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1200&h=800&fit=crop&q=80'
    },
  ],
  '4': [
    { 
      id: '7', 
      title: 'Skeleton Anatomy Image', 
      type: '3d', 
      viewer_type: 'anatomy', 
      interactive: true,
      embed_code: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1200&h=800&fit=crop&q=80'
    },
  ],
}

export function Academic() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [selectedResource, setSelectedResource] = useState<any | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSubjects = FAKE_SUBJECTS.filter(subject =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const modules = selectedSubject ? (FAKE_MODULES[selectedSubject] || []) : []
  const resources = selectedModule ? (FAKE_RESOURCES[selectedModule] || []) : []

  const getResourceIcon = (type: string) => {
    switch (type) {
      case '3d':
        return <Box className="h-5 w-5 text-purple-600" />
      case 'video':
        return <Play className="h-5 w-5 text-red-600" />
      case 'pdf':
        return <FileText className="h-5 w-5 text-blue-600" />
      case 'image':
        return <ImageIcon className="h-5 w-5 text-green-600" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Academic Resources
          </h1>
          <p className="text-muted-foreground mt-1">Explore subjects, modules, and 3D learning resources</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search subjects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Subjects Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Subjects</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSubjects.map((subject) => (
            <Card
              key={subject.id}
              className={`cursor-pointer hover:shadow-lg transition-all border-2 ${
                selectedSubject === subject.id ? 'border-blue-500 ring-2 ring-blue-200' : ''
              }`}
              onClick={() => {
                setSelectedSubject(subject.id)
                setSelectedModule(null)
                setSelectedResource(null)
              }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  {subject.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">Code: {subject.code}</p>
                <p className="text-sm text-muted-foreground mb-2">Year: {subject.year}</p>
                {subject.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{subject.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Modules */}
      {selectedSubject && modules.length > 0 && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Modules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className={`border-2 rounded-lg p-4 hover:bg-muted/50 transition-colors ${
                    selectedModule === module.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{module.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                      {module.topics && module.topics.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {module.topics.map((topic: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-xs bg-secondary px-3 py-1 rounded-full font-medium"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                      {module.resources && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{module.resources.length} resources available</span>
                          {module.resources.some((r: any) => r.type === '3d') && (
                            <span className="flex items-center gap-1 text-purple-600">
                              <Box className="h-4 w-4" />
                              3D Models
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedModule(module.id)
                        setSelectedResource(null)
                      }}
                    >
                      View Resources
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resources */}
      {selectedModule && !selectedResource && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Learning Resources</h2>
            <Button variant="outline" onClick={() => setSelectedModule(null)}>
              Back to Modules
            </Button>
          </div>

          {/* 3D Models Section */}
          {resources.filter((r: any) => r.type === '3d').length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Box className="h-5 w-5 text-purple-600" />
                3D Interactive Models
              </h3>
              <div className="grid gap-4">
                {resources
                  .filter((r: any) => r.type === '3d')
                  .map((resource: any) => (
                    <Card
                      key={resource.id}
                      className="border-2 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => setSelectedResource(resource)}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Box className="h-5 w-5 text-purple-600" />
                          {resource.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Interactive anatomy image for enhanced learning experience
                        </p>
                        <Button 
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedResource(resource)
                          }}
                        >
                          View Image
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {/* Other Resources */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Other Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {resources
                  .filter((r: any) => r.type !== '3d')
                  .map((resource: any) => (
                    <Card
                      key={resource.id}
                      className="border hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => setSelectedResource(resource)}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          {getResourceIcon(resource.type)}
                          {resource.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground capitalize">
                            {resource.type}
                          </span>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 3D Viewer */}
      {selectedResource && selectedResource.type === '3d' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">3D Model Viewer</h2>
            <Button variant="outline" onClick={() => setSelectedResource(null)}>
              Back to Resources
            </Button>
          </div>
          <Viewer3D
            title={selectedResource.title}
            viewerType={selectedResource.viewer_type || 'anatomy'}
            embedCode={selectedResource.embed_code}
            fileUrl={selectedResource.file_url || selectedResource.embed_code}
          />
        </div>
      )}

      {/* Empty State */}
      {!selectedSubject && (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Select a subject to view modules and resources</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
