import React from 'react';
import { Server, CheckCircle, XCircle } from 'lucide-react';
import { RepoStatus } from '../../services/plagiarismRepositoryService';

interface Props {
  statuses: RepoStatus[];
  sourceCount: number;
}

export function RepositoryStatusPanel({ statuses, sourceCount }: Props) {
  if (statuses.length === 0) return null;

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
      <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
        <Server className="h-4 w-4 mr-2 text-blue-500" />
        Repositorios Científicos Consultados
        <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
          {sourceCount} documentos recuperados
        </span>
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statuses.map(repo => (
          <div key={repo.name} className={`flex items-center justify-between p-3 rounded-lg border ${
            repo.status === 'ok' ? 'bg-green-50 border-green-200' :
            repo.status === 'error' ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center space-x-2 min-w-0">
              {repo.status === 'ok'
                ? <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                : repo.status === 'error'
                ? <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                : <div className="h-4 w-4 rounded-full border-2 border-gray-400 animate-spin flex-shrink-0" />
              }
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate">{repo.name}</p>
                <p className="text-xs text-gray-500">
                  {repo.status === 'ok' ? `${repo.count} docs` : repo.status === 'error' ? 'Sin conexión' : 'Esperando...'}
                </p>
              </div>
            </div>
            {repo.latencyMs !== undefined && repo.status === 'ok' && (
              <span className="text-xs text-gray-400 ml-1 flex-shrink-0">{repo.latencyMs}ms</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
