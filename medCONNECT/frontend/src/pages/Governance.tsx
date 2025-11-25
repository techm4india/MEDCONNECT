import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { BarChart3, TrendingUp, Users, Stethoscope } from 'lucide-react'
import { GovernanceDashboard } from './dashboards/GovernanceDashboard'

export function Governance() {
  return <GovernanceDashboard />
}




