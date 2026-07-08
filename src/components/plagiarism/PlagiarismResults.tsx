import React from 'react';
import { BarChart3, BookOpen, ExternalLink, PieChart } from 'lucide-react';
import { PlagiarismReport, PlagiarismMatch, PlagiarismType } from '../../services/advancedPlagiarismDetector';
import { typeIcons, typeColors } from './plagiarismUtils';

interface Props {
  report: PlagiarismReport;
  liveSourceCount: number;
  filterType: PlagiarismType | 'all';
  setFilterType: (t: PlagiarismType | 'all') => void;
  showBreakdown: boolean;
  setShowBreakdown: (b: boolean) => void;
}

export function PlagiarismResults({ report, liveSourceCount, filterType, setFilterType, showBreakdown, setShowBreakdown }: Props) {
  const filteredMatches = report.matches.filter(m => filterType === 'all' || m.type === filterType);
  const totalPlagiarismTypes = Object.values(report.breakdownByType).reduce((sum, b) => sum + b.count, 0);

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-orange-600" />
          Resumen del Análisis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Percentage Display */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-3">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                    <circle cx="64" cy="64" r="56" stroke={report.plagiarismPercentage > 30 ? '#dc2626' : report.plagiarismPercentage > 15 ? '#f59e0b' : '#10b981'}
                      strokeWidth="12" fill="none" strokeDasharray={`${report.plagiarismPercentage * 3.52} 352`} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-3xl font-bold text-gray-900">{Math.round(report.plagiarismPercentage)}%</span>
                      <span className="block text-xs text-gray-500">Plagio</span>
                    </div>
                  </div>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                  report.status === 'safe' ? 'bg-green-100 text-green-700' :
                  report.status === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}>
                  {report.status === 'safe' ? 'Documento Original' : report.status === 'warning' ? 'Plagio Moderado' : 'Alto Plagio'}
                </span>
              </div>
              <div className="space-y-3">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <span className="text-2xl font-bold text-green-600">{Math.round(report.nonPlagiarismPercentage)}%</span>
                  <span className="block text-xs text-green-700">No Plagio</span>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <span className="text-2xl font-bold text-red-600">{Math.round(report.plagiarismPercentage)}%</span>
                  <span className="block text-xs text-red-700">Plagio</span>
                </div>
              </div>
            </div>
          </div>
          {/* Stats */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Estadísticas</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Total palabras:</span><span className="font-semibold">{report.totalWords}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Palabras plagiadas:</span><span className="font-semibold text-red-600">{report.plagiarizedWords}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Fuentes analizadas:</span><span className="font-semibold">{report.sourcesChecked} ({liveSourceCount} en vivo)</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Citas verificadas:</span><span className="font-semibold text-green-600">{report.citationsVerified}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Citas fantasma:</span><span className="font-semibold text-pink-600">{report.ghostCitationsFound}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Tiempo análisis:</span><span className="font-semibold">{report.analysisTimeMs}ms</span></div>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Detecciones</h4>
            <div className="p-4 bg-gray-50 rounded-lg">
              <span className="text-3xl font-bold text-gray-900">{report.matches.length}</span>
              <span className="block text-sm text-gray-600">fragmentos detectados</span>
            </div>
            <div className="text-xs text-gray-500">En {totalPlagiarismTypes} categorías</div>
          </div>
        </div>
      </div>

      {/* Breakdown by Type */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <PieChart className="h-5 w-5 mr-2 text-purple-600" />
            Desglose por Tipo de Plagio
          </h3>
          <button onClick={() => setShowBreakdown(!showBreakdown)} className="text-sm text-gray-500 hover:text-gray-700">
            {showBreakdown ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
        {showBreakdown && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {(Object.entries(report.breakdownByType) as [PlagiarismType, { count: number; percentage: number }][]).map(([type, data]) => (
              <button key={type} onClick={() => setFilterType(filterType === type ? 'all' : type)}
                className={`p-3 rounded-lg border transition-all ${filterType === type ? 'ring-2 ring-red-500 ring-offset-2' : ''} ${typeColors[type]}`}>
                <div className="flex items-center space-x-2 mb-2">
                  {typeIcons[type]}
                  <span className="text-xs font-medium text-gray-900 truncate">
                    {type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold text-gray-900">{data.count}</span>
                  <span className="block text-xs text-gray-600">{data.percentage}% del plagio</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detailed Matches */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-orange-600" />
            Fragmentos Detectados ({filteredMatches.length})
          </h3>
          <select value={filterType} onChange={e => setFilterType(e.target.value as PlagiarismType | 'all')}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-red-500">
            <option value="all">Todos los tipos</option>
            {Object.entries(report.breakdownByType).filter(([_, d]) => d.count > 0).map(([type]) => (
              <option key={type} value={type}>{type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</option>
            ))}
          </select>
        </div>
        {filteredMatches.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No se encontraron fragmentos con plagio</div>
        ) : (
          <div className="space-y-4">
            {filteredMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MatchCard({ match }: { match: PlagiarismMatch }) {
  return (
    <div className={`border-l-4 rounded-lg p-4 ${typeColors[match.type]}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {typeIcons[match.type]}
            <span className="font-semibold text-gray-900">{match.typeLabel}</span>
          </div>
          <span className="text-xs bg-white px-2 py-0.5 rounded">{match.similarityScore}% similitud</span>
          <span className="text-xs text-gray-500">Confianza: {match.confidence}%</span>
        </div>
        {match.sourceUrl && (
          <a href={match.sourceUrl} target="_blank" rel="noopener noreferrer" className="p-1 text-blue-500 hover:text-blue-700">
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
      <div className="space-y-3">
        <div>
          <h5 className="text-xs font-semibold text-gray-700 uppercase mb-1">Fragmento Infractor:</h5>
          <div className="p-3 bg-white bg-opacity-70 rounded border border-gray-200">
            <p className="text-sm text-gray-800">"{match.infractingFragment}"</p>
          </div>
        </div>
        {match.originalText && (
          <div>
            <h5 className="text-xs font-semibold text-gray-700 uppercase mb-1">Texto Original:</h5>
            <div className="p-3 bg-gray-100 rounded border border-gray-200">
              <p className="text-sm text-gray-600">"{match.originalText}"</p>
            </div>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
          <span className="flex items-center"><BookOpen className="h-3 w-3 mr-1" /><strong>Fuente:</strong> {match.sourceDocument}</span>
          <span className="flex items-center"><span className="font-semibold">Autor:</span> {match.sourceAuthor}</span>
          <span className="flex items-center"><span className="font-semibold">Año:</span> {match.sourceYear}</span>
          {match.locationPage && <span className="flex items-center"><span className="font-semibold">Página:</span> ~{match.locationPage}</span>}
          <span className="flex items-center"><span className="font-semibold">Palabras:</span> {match.wordCount}</span>
          {match.sourceDoi && <span className="flex items-center text-blue-600">DOI: {match.sourceDoi}</span>}
        </div>
      </div>
    </div>
  );
}
