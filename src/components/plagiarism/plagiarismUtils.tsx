import React from 'react';
import { FileWarning, MessageSquareText, Brain, Copy, Link2, Globe, LayoutGrid as Layout, Table2, FlaskConical, UserX } from 'lucide-react';
import { PlagiarismType } from '../../services/advancedPlagiarismDetector';

export const typeIcons: Record<PlagiarismType, React.ReactNode> = {
  'direct': <FileWarning className="h-4 w-4 text-red-600" />,
  'paraphrase': <MessageSquareText className="h-4 w-4 text-orange-600" />,
  'idea': <Brain className="h-4 w-4 text-purple-600" />,
  'self': <Copy className="h-4 w-4 text-yellow-600" />,
  'ghost_citation': <Link2 className="h-4 w-4 text-pink-600" />,
  'translation': <Globe className="h-4 w-4 text-blue-600" />,
  'structure': <Layout className="h-4 w-4 text-indigo-600" />,
  'data': <Table2 className="h-4 w-4 text-teal-600" />,
  'methodology': <FlaskConical className="h-4 w-4 text-cyan-600" />,
  'author_omission': <UserX className="h-4 w-4 text-rose-600" />
};

export const typeColors: Record<PlagiarismType, string> = {
  'direct': 'bg-red-50 border-red-300',
  'paraphrase': 'bg-orange-50 border-orange-300',
  'idea': 'bg-purple-50 border-purple-300',
  'self': 'bg-yellow-50 border-yellow-300',
  'ghost_citation': 'bg-pink-50 border-pink-300',
  'translation': 'bg-blue-50 border-blue-300',
  'structure': 'bg-indigo-50 border-indigo-300',
  'data': 'bg-teal-50 border-teal-300',
  'methodology': 'bg-cyan-50 border-cyan-300',
  'author_omission': 'bg-rose-50 border-rose-300'
};

export const plagiarismTypeLabels = [
  'Directo', 'Paráfrasis', 'Ideas', 'Autoplagio',
  'Citas Fantasma', 'Traducción', 'Estructura', 'Datos', 'Metodología', 'Omisión Autoría'
];
