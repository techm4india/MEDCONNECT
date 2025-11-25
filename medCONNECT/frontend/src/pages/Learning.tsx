import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/Dialog'
import { 
  BookOpen, Search, FileText, Video, Image as ImageIcon, Box, Play, Download, 
  Bookmark, BookmarkCheck, Calendar, Clock, Bell, MessageSquare, TrendingUp,
  Target, Award, Users, FileCheck, Download as DownloadIcon, Wifi, WifiOff,
  Brain, GraduationCap, Clock3, CheckCircle2, AlertCircle, Star, Filter, Stethoscope, Copy
} from 'lucide-react'
import { Viewer3D } from '@/components/3DViewer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Progress } from '@/components/ui/Progress'
import { Badge } from '@/components/ui/Badge'
import toast from 'react-hot-toast'

// Static fake data - Curriculum-based learning
const CURRICULUM_SUBJECTS = [
  { 
    id: '1', 
    name: 'Anatomy', 
    code: 'ANAT101', 
    year: 1, 
    progress: 75,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    iconColor: 'text-blue-600'
  },
  { 
    id: '2', 
    name: 'Physiology', 
    code: 'PHYS101', 
    year: 1, 
    progress: 82,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
    iconColor: 'text-purple-600'
  },
  { 
    id: '3', 
    name: 'Pathology', 
    code: 'PATH201', 
    year: 2, 
    progress: 68,
    color: 'from-red-500 to-orange-500',
    bgColor: 'bg-red-50 dark:bg-red-950',
    iconColor: 'text-red-600'
  },
  { 
    id: '4', 
    name: 'Pharmacology', 
    code: 'PHAR201', 
    year: 2, 
    progress: 71,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50 dark:bg-green-950',
    iconColor: 'text-green-600'
  },
]

// Topic resources
const TOPIC_RESOURCES = [
  {
    id: '1',
    topic: 'Cardiovascular System',
    subject: 'Anatomy',
    resources: [
      { id: '1', title: 'Heart Anatomy Notes', type: 'notes', format: 'pdf', size: '2.5 MB', bookmarked: true },
      { id: '2', title: 'Cardiovascular Flowchart', type: 'flowchart', format: 'png', size: '1.2 MB', bookmarked: false },
      { id: '3', title: 'Heart Anatomy Diagram', type: 'diagram', format: 'jpg', size: '800 KB', bookmarked: true },
      { id: '4', title: 'Cardiac Cycle Video', type: 'video', format: 'mp4', size: '45 MB', bookmarked: false },
      { id: '5', title: 'PYQ 2023-2024', type: 'pyq', format: 'pdf', size: '3.1 MB', bookmarked: true },
      { id: '6', title: '3D Heart Model', type: '3d', format: 'interactive', size: 'Online', bookmarked: false },
    ]
  },
  {
    id: '2',
    topic: 'Respiratory System',
    subject: 'Physiology',
    resources: [
      { id: '7', title: 'Lung Physiology Notes', type: 'notes', format: 'pdf', size: '2.1 MB', bookmarked: false },
      { id: '8', title: 'Gas Exchange Flowchart', type: 'flowchart', format: 'png', size: '950 KB', bookmarked: true },
      { id: '9', title: 'Respiratory Video Lecture', type: 'video', format: 'mp4', size: '52 MB', bookmarked: false },
      { id: '10', title: 'PYQ 2022-2023', type: 'pyq', format: 'pdf', size: '2.8 MB', bookmarked: true },
    ]
  },
]

// Daily Timetable
const DAILY_TIMETABLE = [
  { time: '09:00 AM', subject: 'Anatomy', topic: 'Cardiovascular System', room: 'Lecture Hall 1', type: 'lecture' },
  { time: '10:30 AM', subject: 'Physiology', topic: 'Cardiac Cycle', room: 'Lab 3', type: 'practical' },
  { time: '12:00 PM', subject: 'Pathology', topic: 'Cardiovascular Diseases', room: 'Lecture Hall 2', type: 'lecture' },
  { time: '02:00 PM', subject: 'Pharmacology', topic: 'Cardiac Drugs', room: 'Lab 1', type: 'practical' },
  { time: '04:00 PM', subject: 'Self Study', topic: 'Revision', room: 'Library', type: 'self-study' },
]

// Postings
const POSTINGS = [
  { id: '1', department: 'Cardiology', start_date: '2024-11-16', end_date: '2024-11-30', status: 'active', days_left: 8 },
  { id: '2', department: 'Pediatrics', start_date: '2024-12-01', end_date: '2024-12-15', status: 'upcoming', days_left: 15 },
  { id: '3', department: 'Surgery', start_date: '2024-10-01', end_date: '2024-10-15', status: 'completed', days_left: 0 },
]

// Reminders
const REMINDERS = [
  { id: '1', title: 'Submit Assignment - Pathology', time: '2024-11-25 11:59 PM', priority: 'high', completed: false },
  { id: '2', title: 'Quiz - Cardiovascular System', time: '2024-11-26 10:00 AM', priority: 'medium', completed: false },
  { id: '3', title: 'Lab Report Submission', time: '2024-11-27 05:00 PM', priority: 'high', completed: false },
]

// Announcements
const ANNOUNCEMENTS = [
  { id: '1', title: 'NMC Curriculum Update', department: 'Academic', date: '2024-11-23', priority: 'high' },
  { id: '2', title: 'Workshop on Clinical Skills', department: 'Cardiology', date: '2024-11-22', priority: 'medium' },
  { id: '3', title: 'Library Timings Extended', department: 'Administration', date: '2024-11-21', priority: 'low' },
]

// Weekly Learning Summary
const WEEKLY_SUMMARY = {
  hours_studied: 28.5,
  topics_completed: 12,
  assignments_submitted: 5,
  quizzes_taken: 3,
  progress: [
    { day: 'Mon', hours: 4.5, topics: 2 },
    { day: 'Tue', hours: 5.0, topics: 3 },
    { day: 'Wed', hours: 4.0, topics: 2 },
    { day: 'Thu', hours: 6.0, topics: 3 },
    { day: 'Fri', hours: 4.5, topics: 1 },
    { day: 'Sat', hours: 3.5, topics: 1 },
    { day: 'Sun', hours: 1.5, topics: 0 },
  ]
}

// NMC Academic Calendar
const NMC_CALENDAR = [
  { month: 'November 2024', events: [
    { date: '2024-11-25', event: 'Mid-term Examinations', type: 'exam' },
    { date: '2024-11-28', event: 'NMC Compliance Review', type: 'meeting' },
  ]},
  { month: 'December 2024', events: [
    { date: '2024-12-05', event: 'End Semester Exams Begin', type: 'exam' },
    { date: '2024-12-15', event: 'Clinical Posting Rotation', type: 'posting' },
    { date: '2024-12-20', event: 'Winter Break Starts', type: 'holiday' },
  ]},
  { month: 'January 2025', events: [
    { date: '2025-01-05', event: 'New Semester Begins', type: 'academic' },
    { date: '2025-01-15', event: 'NMC Inspection', type: 'meeting' },
  ]},
]

// Mentor Messages
const MENTOR_MESSAGES = [
  { id: '1', from: 'Dr. Rajesh Kumar', role: 'Mentor', message: 'Great progress on Cardiovascular System! Keep it up.', time: '2 hours ago', unread: true },
  { id: '2', from: 'Dr. Priya Sharma', role: 'HOD - Cardiology', message: 'Reminder: Submit your logbook entries by Friday.', time: '5 hours ago', unread: true },
  { id: '3', from: 'Dr. Amit Patel', role: 'Faculty', message: 'Your assignment was excellent. Well done!', time: '1 day ago', unread: false },
]

// Fake AI responses data
const AI_RESPONSES = {
  explanation: {
    title: 'AI Explanation: Cardiovascular System',
    content: `# Cardiovascular System - Detailed Explanation

## Overview
The cardiovascular system is responsible for circulating blood throughout the body, delivering oxygen and nutrients to tissues while removing waste products.

## Key Components

### 1. Heart
- **Location**: Mediastinum, between the lungs
- **Function**: Pumps blood through the circulatory system
- **Structure**:
  - 4 chambers: Right atrium, Right ventricle, Left atrium, Left ventricle
  - 4 valves: Tricuspid, Pulmonary, Mitral, Aortic
  - Pericardium: Protective sac around the heart

### 2. Blood Vessels
- **Arteries**: Carry oxygenated blood away from heart (except pulmonary artery)
- **Veins**: Carry deoxygenated blood back to heart (except pulmonary vein)
- **Capillaries**: Site of gas and nutrient exchange

### 3. Blood Flow Pathway
1. Deoxygenated blood enters right atrium via superior/inferior vena cava
2. Right atrium → Right ventricle (through tricuspid valve)
3. Right ventricle → Pulmonary artery → Lungs (gas exchange)
4. Oxygenated blood → Pulmonary vein → Left atrium
5. Left atrium → Left ventricle (through mitral valve)
6. Left ventricle → Aorta → Systemic circulation

## Clinical Significance
- **Heart Rate**: Normal 60-100 bpm
- **Blood Pressure**: Normal <120/80 mmHg
- **Common Disorders**: Hypertension, Heart failure, Arrhythmias

## NMC Competency Codes
- AN1.1: Describe the anatomy of cardiovascular system
- PH1.2: Explain cardiac cycle and hemodynamics
- CL1.3: Identify common cardiovascular diseases`
  },
  mnemonic: {
    title: 'AI Generated Mnemonic: Cranial Nerves',
    content: `# Mnemonic for 12 Cranial Nerves

## Primary Mnemonic
**"On Old Olympus Towering Tops, A Finn And German Viewed Some Hops"**

### Breakdown:
1. **O**lfactory (I) - Smell
2. **O**ptic (II) - Vision
3. **O**culomotor (III) - Eye movement, pupil constriction
4. **T**rochlear (IV) - Eye movement (superior oblique)
5. **T**rigeminal (V) - Facial sensation, mastication
6. **A**bducens (VI) - Eye movement (lateral rectus)
7. **F**acial (VII) - Facial expression, taste (anterior 2/3)
8. **A**uditory/Vestibulocochlear (VIII) - Hearing, balance
9. **G**lossopharyngeal (IX) - Taste (posterior 1/3), swallowing
10. **V**agus (X) - Parasympathetic, visceral functions
11. **S**pinal Accessory (XI) - Head/neck movement
12. **H**ypoglossal (XII) - Tongue movement

## Alternative Mnemonics

### Sensory/Motor/Both Classification:
**"Some Say Marry Money, But My Brother Says Big Brains Matter More"**
- S: Sensory
- M: Motor
- B: Both

### Functional Groups:
- **Sensory Only**: I, II, VIII
- **Motor Only**: III, IV, VI, XI, XII
- **Mixed**: V, VII, IX, X

## Study Tip
Create your own mnemonic using words that are meaningful to you!`
  },
  notes: {
    title: 'AI Generated Study Notes: Cardiac Cycle',
    content: `# Cardiac Cycle - Comprehensive Study Notes

## Definition
The cardiac cycle refers to the sequence of events that occur during one complete heartbeat, including systole (contraction) and diastole (relaxation).

## Phases of Cardiac Cycle

### 1. Atrial Systole (0.1 seconds)
- Atria contract
- AV valves open
- Blood flows from atria to ventricles
- **Volume**: ~70% of blood already in ventricles
- **ECG**: P wave

### 2. Ventricular Systole (0.3 seconds)
#### Isovolumetric Contraction
- Ventricles contract
- AV and semilunar valves closed
- Pressure increases, volume constant
- **ECG**: QRS complex

#### Ejection Phase
- Semilunar valves open
- Blood ejected into arteries
- **Stroke Volume**: ~70ml
- **ECG**: ST segment

### 3. Ventricular Diastole (0.4 seconds)
#### Isovolumetric Relaxation
- Ventricles relax
- All valves closed
- Pressure decreases
- **ECG**: T wave

#### Filling Phase
- AV valves open
- Ventricles fill with blood
- **Rapid Filling**: 70% of blood
- **Atrial Systole**: Remaining 30%

## Key Measurements

| Parameter | Normal Value |
|-----------|-------------|
| Heart Rate | 60-100 bpm |
| Stroke Volume | 70 ml |
| Cardiac Output | 5-6 L/min |
| Ejection Fraction | 55-70% |

## Clinical Correlations
- **Tachycardia**: HR >100 bpm
- **Bradycardia**: HR <60 bpm
- **Heart Failure**: Reduced ejection fraction
- **Arrhythmias**: Abnormal ECG patterns

## Practice Questions
1. What happens during isovolumetric contraction?
2. Explain the relationship between stroke volume and cardiac output.
3. How does exercise affect the cardiac cycle?

## Related Topics
- ECG interpretation
- Heart sounds
- Hemodynamics
- Cardiac output regulation`
  },
  revision: {
    title: 'AI Generated Revision Plan: Cardiovascular System',
    content: `# Personalized Revision Plan - Cardiovascular System

## Week Overview
**Target Topic**: Cardiovascular System  
**Current Progress**: 75%  
**Recommended Study Time**: 12 hours this week

## Day-by-Day Schedule

### Day 1: Monday (2 hours)
**Focus**: Heart Anatomy
- [ ] Review heart structure and chambers (30 min)
- [ ] Study cardiac valves and their functions (30 min)
- [ ] Practice labeling heart diagrams (30 min)
- [ ] Watch 3D heart model (30 min)

**Resources**:
- Heart Anatomy Notes
- 3D Heart Model
- Cardiovascular Flowchart

### Day 2: Tuesday (2 hours)
**Focus**: Cardiac Cycle
- [ ] Study phases of cardiac cycle (45 min)
- [ ] Understand ECG correlation (30 min)
- [ ] Practice questions on cardiac cycle (45 min)

**Resources**:
- Cardiac Cycle Video
- ECG Interpretation Guide
- PYQ 2023-2024

### Day 3: Wednesday (1.5 hours)
**Focus**: Blood Vessels
- [ ] Review arterial system (30 min)
- [ ] Study venous system (30 min)
- [ ] Capillary exchange mechanisms (30 min)

**Resources**:
- Vascular System Diagram
- Blood Flow Animation

### Day 4: Thursday (2 hours)
**Focus**: Hemodynamics
- [ ] Blood pressure regulation (45 min)
- [ ] Cardiac output and factors affecting it (45 min)
- [ ] Practice calculations (30 min)

**Resources**:
- Hemodynamics Notes
- Practice Problems Set

### Day 5: Friday (1.5 hours)
**Focus**: Clinical Applications
- [ ] Common cardiovascular diseases (45 min)
- [ ] Case studies (45 min)

**Resources**:
- Clinical Cases PDF
- Pathology Notes

### Day 6: Saturday (2 hours)
**Focus**: Review & Integration
- [ ] Complete review of all topics (60 min)
- [ ] Solve previous year questions (60 min)

**Resources**:
- PYQ 2022-2023
- PYQ 2023-2024
- Comprehensive Review Sheet

### Day 7: Sunday (1 hour)
**Focus**: Self-Assessment
- [ ] Take practice quiz (30 min)
- [ ] Review weak areas (30 min)

## Study Techniques
1. **Active Recall**: Test yourself after each session
2. **Spaced Repetition**: Review previous topics daily
3. **Visual Learning**: Use diagrams and 3D models
4. **Practice**: Solve at least 10 questions daily

## Milestones
- [ ] Complete all anatomy topics
- [ ] Understand cardiac cycle completely
- [ ] Score >80% on practice quiz
- [ ] Complete all PYQs

## Tips for Success
- Take 10-minute breaks every 45 minutes
- Use mnemonics for memorization
- Create mind maps for complex topics
- Teach concepts to a study partner

## Next Week Preview
- Respiratory System
- Gas Exchange Mechanisms
- Respiratory Disorders`
  }
}

export function Learning() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false)
  const [activeTab, setActiveTab] = useState('curriculum')
  const [aiDialogOpen, setAiDialogOpen] = useState(false)
  const [aiDialogContent, setAiDialogContent] = useState<{ title: string; content: string } | null>(null)
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set(['1', '3', '5', '8', '10']))

  // Check URL params for tab and filters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tab = params.get('tab')
    if (tab) setActiveTab(tab)
    const bookmarked = params.get('bookmarked')
    if (bookmarked === 'true') setBookmarkedOnly(true)
  }, [])

  const toggleBookmark = (resourceId: string) => {
    setBookmarks(prev => {
      const newSet = new Set(prev)
      if (newSet.has(resourceId)) {
        newSet.delete(resourceId)
      } else {
        newSet.add(resourceId)
      }
      return newSet
    })
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'notes': return <FileText className="h-5 w-5" />
      case 'flowchart': return <ImageIcon className="h-5 w-5" />
      case 'diagram': return <ImageIcon className="h-5 w-5" />
      case 'video': return <Video className="h-5 w-5" />
      case 'pyq': return <FileCheck className="h-5 w-5" />
      case '3d': return <Box className="h-5 w-5" />
      default: return <FileText className="h-5 w-5" />
    }
  }

  const getResourceColor = (type: string) => {
    switch (type) {
      case 'notes': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'flowchart': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'diagram': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'video': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'pyq': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case '3d': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
  }

  const filteredResources = TOPIC_RESOURCES.flatMap(t => t.resources).map(r => ({
    ...r,
    bookmarked: bookmarks.has(r.id)
  })).filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesBookmark = !bookmarkedOnly || r.bookmarked
    return matchesSearch && matchesBookmark
  })

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Student Learning Hub
          </h1>
          <p className="text-muted-foreground mt-1">Pillar 1 - Complete Learning Experience</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Wifi className="h-3 w-3" />
            Online
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <DownloadIcon className="h-3 w-3" />
            Offline Available
          </Badge>
        </div>
      </div>

      {/* Smart Search Bar */}
      <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Smart Search: Search notes, videos, diagrams, PYQs, topics, subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
            <Button
              variant={bookmarkedOnly ? "default" : "outline"}
              size="lg"
              onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
              className="h-12"
            >
              <BookmarkCheck className="h-4 w-4 mr-2" />
              {bookmarkedOnly ? 'Show All' : 'Bookmarks Only'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12"
              onClick={() => {
                setSearchQuery('')
                setBookmarkedOnly(false)
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
          {searchQuery && (
            <p className="text-sm text-muted-foreground mt-2">
              Found {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''} matching "{searchQuery}"
            </p>
          )}
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="curriculum" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Curriculum
          </TabsTrigger>
          <TabsTrigger value="timetable" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Timetable
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Progress
          </TabsTrigger>
          <TabsTrigger value="communication" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Communication
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendar
          </TabsTrigger>
        </TabsList>

        {/* Curriculum Tab */}
        <TabsContent value="curriculum" className="space-y-6">
          {/* Subjects Grid */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              Curriculum-Based Learning
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {CURRICULUM_SUBJECTS.map((subject) => (
                <Card
                  key={subject.id}
                  className={`cursor-pointer hover:shadow-lg transition-all border-2 ${
                    selectedSubject === subject.id ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedSubject(subject.id)}
                >
                  <CardHeader className={`${subject.bgColor} rounded-t-lg`}>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <BookOpen className={`h-5 w-5 ${subject.iconColor}`} />
                        {subject.name}
                      </span>
                      <Badge>{subject.code}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold">{subject.progress}%</span>
                      </div>
                      <Progress value={subject.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground">Year {subject.year}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Topics and Resources */}
          {selectedSubject && (
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    Topics & Resources
                  </span>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Search resources..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64"
                    />
                    <Button
                      variant={bookmarkedOnly ? "default" : "outline"}
                      size="sm"
                      onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
                    >
                      <BookmarkCheck className="h-4 w-4 mr-1" />
                      Bookmarks
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {TOPIC_RESOURCES.map((topicData) => (
                    <div key={topicData.id} className="space-y-3">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        {topicData.topic}
                        <Badge variant="outline">{topicData.subject}</Badge>
                      </h3>
                      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {topicData.resources
                          .map(r => ({
                            ...r,
                            bookmarked: bookmarks.has(r.id)
                          }))
                          .filter(r => {
                            const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase())
                            const matchesBookmark = !bookmarkedOnly || r.bookmarked
                            return matchesSearch && matchesBookmark
                          })
                          .map((resource) => (
                            <Card
                              key={resource.id}
                              className="border hover:shadow-md transition-shadow cursor-pointer"
                            >
                              <CardHeader className="pb-2">
                                <CardTitle className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-2">
                                    <div className={`p-2 rounded-lg ${getResourceColor(resource.type)}`}>
                                      {getResourceIcon(resource.type)}
                                    </div>
                                    <span className="text-xs font-medium">{resource.type.toUpperCase()}</span>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleBookmark(resource.id)
                                    }}
                                    className="hover:scale-110 transition-transform"
                                  >
                                    {resource.bookmarked ? (
                                      <BookmarkCheck className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                    ) : (
                                      <Bookmark className="h-4 w-4 text-muted-foreground" />
                                    )}
                                  </button>
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="font-medium text-sm mb-2">{resource.title}</p>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span>{resource.format} • {resource.size}</span>
                                  <div className="flex items-center gap-1">
                                    {resource.type === '3d' ? (
                                      <Button variant="ghost" size="sm" className="h-6 text-xs">
                                        <Box className="h-3 w-3 mr-1" />
                                        View 3D
                                      </Button>
                                    ) : (
                                      <Button variant="ghost" size="sm" className="h-6 text-xs">
                                        <Download className="h-3 w-3 mr-1" />
                                        Download
                                      </Button>
                                    )}
                                  </div>
                                </div>
                                {resource.type !== '3d' && (
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline" className="text-xs">
                                      <WifiOff className="h-3 w-3 mr-1" />
                                      Offline Available
                                    </Badge>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 text-xs"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        // Simulate download for offline
                                        toast.success(`${resource.title} downloaded for offline access`)
                                      }}
                                    >
                                      <Download className="h-3 w-3 mr-1" />
                                      Download
                                    </Button>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Instructor Section */}
          <Card className="border-2 border-gradient-to-r from-purple-200 to-pink-200 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                AI Instructor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors"
                  onClick={() => {
                    setAiDialogContent(AI_RESPONSES.explanation)
                    setAiDialogOpen(true)
                  }}
                >
                  <Brain className="h-6 w-6 text-purple-600" />
                  <span className="text-sm font-medium">Get Explanation</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-yellow-50 dark:hover:bg-yellow-950 transition-colors"
                  onClick={() => {
                    setAiDialogContent(AI_RESPONSES.mnemonic)
                    setAiDialogOpen(true)
                  }}
                >
                  <Star className="h-6 w-6 text-yellow-600" />
                  <span className="text-sm font-medium">Create Mnemonic</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                  onClick={() => {
                    setAiDialogContent(AI_RESPONSES.notes)
                    setAiDialogOpen(true)
                  }}
                >
                  <FileText className="h-6 w-6 text-blue-600" />
                  <span className="text-sm font-medium">Generate Notes</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-green-50 dark:hover:bg-green-950 transition-colors"
                  onClick={() => {
                    setAiDialogContent(AI_RESPONSES.revision)
                    setAiDialogOpen(true)
                  }}
                >
                  <Target className="h-6 w-6 text-green-600" />
                  <span className="text-sm font-medium">Revision Plan</span>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Click any button above to get AI-generated content, or use the AI Bot icon (bottom-right) to chat
              </p>
            </CardContent>
          </Card>

          {/* AI Dialog */}
          <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
            <DialogContent className="max-w-4xl">
              <DialogClose onClose={() => setAiDialogOpen(false)} />
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  {aiDialogContent?.title}
                </DialogTitle>
                <DialogDescription>
                  AI-generated content based on NMC curriculum standards
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {aiDialogContent?.content}
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between border-t pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (aiDialogContent?.content) {
                        navigator.clipboard.writeText(aiDialogContent.content)
                        // You could add a toast notification here
                      }
                    }}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Content
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAiDialogOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Timetable Tab */}
        <TabsContent value="timetable" className="space-y-6">
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Daily Timetable - {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {DAILY_TIMETABLE.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-lg border-2 hover:shadow-md transition-shadow"
                  >
                    <div className="flex-shrink-0 w-24 text-center">
                      <div className="font-semibold text-blue-600">{item.time}</div>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{item.subject}</div>
                      <div className="text-sm text-muted-foreground">{item.topic}</div>
                      <div className="text-xs text-muted-foreground mt-1">📍 {item.room}</div>
                    </div>
                    <Badge className={
                      item.type === 'lecture' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      item.type === 'practical' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                    }>
                      {item.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Postings */}
          <Card className="border-2 border-orange-200 dark:border-orange-800">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-orange-600" />
                Clinical Postings
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {POSTINGS.map((posting) => (
                  <div
                    key={posting.id}
                    className="flex items-center justify-between p-4 rounded-lg border-2 hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="font-semibold">{posting.department}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(posting.start_date).toLocaleDateString()} - {new Date(posting.end_date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {posting.status === 'active' && (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          {posting.days_left} days left
                        </Badge>
                      )}
                      <Badge className={
                        posting.status === 'active' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        posting.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                      }>
                        {posting.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reminders */}
          <Card className="border-2 border-red-200 dark:border-red-800">
            <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-red-600" />
                Reminders
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {REMINDERS.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="flex items-center justify-between p-4 rounded-lg border-2 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      {reminder.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className={`h-5 w-5 ${
                          reminder.priority === 'high' ? 'text-red-600' :
                          reminder.priority === 'medium' ? 'text-orange-600' :
                          'text-blue-600'
                        }`} />
                      )}
                      <div>
                        <div className="font-semibold">{reminder.title}</div>
                        <div className="text-sm text-muted-foreground">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {reminder.time}
                        </div>
                      </div>
                    </div>
                    <Badge className={
                      reminder.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      reminder.priority === 'medium' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }>
                      {reminder.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <CardHeader className="bg-blue-50 dark:bg-blue-950">
                <CardTitle className="text-sm font-medium text-blue-600">Hours Studied</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-bold">{WEEKLY_SUMMARY.hours_studied}</div>
                <p className="text-xs text-muted-foreground mt-1">This Week</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-green-200 dark:border-green-800">
              <CardHeader className="bg-green-50 dark:bg-green-950">
                <CardTitle className="text-sm font-medium text-green-600">Topics Completed</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-bold">{WEEKLY_SUMMARY.topics_completed}</div>
                <p className="text-xs text-muted-foreground mt-1">This Week</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-purple-200 dark:border-purple-800">
              <CardHeader className="bg-purple-50 dark:bg-purple-950">
                <CardTitle className="text-sm font-medium text-purple-600">Assignments</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-bold">{WEEKLY_SUMMARY.assignments_submitted}</div>
                <p className="text-xs text-muted-foreground mt-1">Submitted</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-orange-200 dark:border-orange-800">
              <CardHeader className="bg-orange-50 dark:bg-orange-950">
                <CardTitle className="text-sm font-medium text-orange-600">Quizzes</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-bold">{WEEKLY_SUMMARY.quizzes_taken}</div>
                <p className="text-xs text-muted-foreground mt-1">Taken</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Weekly Learning Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {WEEKLY_SUMMARY.progress.map((day, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{day.day}</span>
                      <span className="text-muted-foreground">{day.hours}h • {day.topics} topics</span>
                    </div>
                    <Progress value={(day.hours / 6) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Communication Tab */}
        <TabsContent value="communication" className="space-y-6">
          {/* Mentor Messages */}
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Mentor Communication
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {MENTOR_MESSAGES.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-lg border-2 hover:shadow-md transition-shadow ${
                      msg.unread ? 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{msg.from}</span>
                          <Badge variant="outline" className="text-xs">{msg.role}</Badge>
                          {msg.unread && <Badge className="bg-blue-600 text-white text-xs">New</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{msg.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">{msg.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Announcements */}
          <Card className="border-2 border-purple-200 dark:border-purple-800">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-purple-600" />
                Announcements & Department Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {ANNOUNCEMENTS.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="p-4 rounded-lg border-2 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{announcement.title}</span>
                          <Badge className={
                            announcement.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                            announcement.priority === 'medium' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }>
                            {announcement.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{announcement.department}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(announcement.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="space-y-6">
          <Card className="border-2 border-green-200 dark:border-green-800">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                NMC-Aligned Academic Calendar
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {NMC_CALENDAR.map((monthData, index) => (
                  <div key={index} className="space-y-3">
                    <h3 className="font-semibold text-lg text-green-600">{monthData.month}</h3>
                    <div className="space-y-2">
                      {monthData.events.map((event, eventIndex) => (
                        <div
                          key={eventIndex}
                          className="flex items-center gap-4 p-3 rounded-lg border-2 hover:shadow-md transition-shadow"
                        >
                          <div className="flex-shrink-0 w-24 text-center">
                            <div className="font-semibold text-green-600">
                              {new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{event.event}</div>
                          </div>
                          <Badge className={
                            event.type === 'exam' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                            event.type === 'meeting' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            event.type === 'posting' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                            event.type === 'holiday' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          }>
                            {event.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

