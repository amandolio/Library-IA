import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Zap, 
  Tag, 
  BarChart3, 
  Clock,
  Search,
  FileText,
  TrendingUp,
  Activity,
  Layers,
  Target
} from 'lucide-react';
import { 
  extractKeywords, 
  analyzeResourceKeywords,
  KeywordExtractionResult 
} from '../data/mockData';

export function KeywordAnalysisPanel() {
  const [inputText, setInputText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<KeywordExtractionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'tf-idf' | 'textrank' | 'yake' | 'hybrid'>('hybrid');
  const [topK, setTopK] = useState(15);

  const methods = [
    {
      id: 'tf-idf' as const,
      name: 'TF-IDF',
      description: 'Frecuencia de términos e inversa de frecuencia de documentos',
      color: 'blue',
      icon: BarChart3
    },
    {
      id: 'textrank' as const,
      name: 'TextRank',
      description: 'Algoritmo basado en grafos similar a PageRank',
      color: 'green',
      icon: Activity
    },
    {
      id: 'yake' as const,
      name: 'YAKE',
      description: 'Extracción no supervisada de keywords',
      color: 'purple',
      icon: Target
    },
    {
      id: 'hybrid' as const,
      name: 'Híbrido',
      description: 'Combinación de múltiples métodos para mejor precisión',
      color: 'orange',
      icon: Layers
    }
  ];

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const result = await extractKeywords(inputText, selectedMethod, topK);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error analyzing keywords:', error);
    }
    setIsAnalyzing(false);
  };

  const sampleTexts = [
    {
      title: 'Inteligencia Artificial',
      text: 'La inteligencia artificial es una rama de la informática que se ocupa de la creación de sistemas capaces de realizar tareas que normalmente requieren inteligencia humana. Esto incluye el aprendizaje automático, el procesamiento del lenguaje natural, la visión por computadora y la robótica. Los algoritmos de machine learning permiten a las máquinas aprender de los datos sin ser programadas explícitamente para cada tarea específica.'
    },
    {
      title: 'Ciberseguridad',
      text: 'La ciberseguridad es la práctica de proteger sistemas, redes y programas de ataques digitales. Estos ataques cibernéticos generalmente tienen como objetivo acceder, cambiar o destruir información confidencial, extorsionar dinero de los usuarios o interrumpir procesos comerciales normales. La implementación de medidas efectivas de ciberseguridad es particularmente desafiante hoy en día porque hay más dispositivos que personas, y los atacantes se están volviendo más innovadores.'
    },
    {
      title: 'Ciencia de Datos',
      text: 'La ciencia de datos es un campo interdisciplinario que utiliza métodos científicos, procesos, algoritmos y sistemas para extraer conocimiento e insights de datos estructurados y no estructurados. La ciencia de datos está relacionada con la minería de datos, el aprendizaje automático y el big data. Un científico de datos reúne datos de múltiples fuentes y aplica aprendizaje automático, análisis predictivo y análisis de sentimientos para extraer información crítica de los conjuntos de datos recopilados.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="h-8 w-8" />
          <h2 className="text-3xl font-bold">Análisis de Keywords con PLN</h2>
        </div>
        <p className="text-purple-100 text-lg">
          Extracción automática de palabras clave utilizando técnicas avanzadas de procesamiento de lenguaje natural.
        </p>
      </div>

      {/* Method Selection */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Zap className="h-5 w-5 mr-2 text-yellow-500" />
          Métodos de Extracción PLN
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {methods.map((method) => {
            const Icon = method.icon;
            return (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`p-4 border rounded-lg transition-all text-left ${
                  selectedMethod === method.id
                    ? `border-${method.color}-500 bg-${method.color}-50`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Icon className={`h-5 w-5 ${
                    selectedMethod === method.id ? `text-${method.color}-600` : 'text-gray-500'
                  }`} />
                  <span className={`font-semibold ${
                    selectedMethod === method.id ? `text-${method.color}-900` : 'text-gray-900'
                  }`}>
                    {method.name}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{method.description}</p>
              </button>
            );
          })}
        </div>

        {/* Parameters */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Keywords a extraer:</label>
            <select
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-purple-500"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={25}>25</option>
            </select>
          </div>
        </div>
      </div>

      {/* Text Input */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-blue-500" />
          Texto para Análisis
        </h3>
        
        {/* Sample Texts */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Textos de ejemplo:</p>
          <div className="flex flex-wrap gap-2">
            {sampleTexts.map((sample, index) => (
              <button
                key={index}
                onClick={() => setInputText(sample.text)}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                {sample.title}
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Introduce el texto del cual deseas extraer keywords automáticamente..."
          className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
        />
        
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            {inputText.length} caracteres | {inputText.split(/\s+/).filter(w => w.length > 0).length} palabras
          </div>
          <button
            onClick={handleAnalyze}
            disabled={!inputText.trim() || isAnalyzing}
            className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Analizando...</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span>Extraer Keywords</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <Tag className="h-5 w-5 mr-2 text-green-500" />
            Resultados del Análisis PLN
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Keywords */}
            <div className="lg:col-span-2">
              <h4 className="font-semibold text-gray-900 mb-3">Keywords Extraídas</h4>
              <div className="flex flex-wrap gap-2">
                {analysisResult.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${
                      index < 5 
                        ? 'bg-purple-100 text-purple-800 border-purple-200'
                        : index < 10
                        ? 'bg-blue-100 text-blue-800 border-blue-200'
                        : 'bg-gray-100 text-gray-800 border-gray-200'
                    }`}
                  >
                    #{index + 1} {keyword}
                  </span>
                ))}
              </div>
              
              {/* Top Keywords Highlight */}
              <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                <h5 className="font-semibold text-purple-900 mb-2">Top 5 Keywords Más Relevantes</h5>
                <div className="space-y-2">
                  {analysisResult.keywords.slice(0, 5).map((keyword, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-purple-800 font-medium">{keyword}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-purple-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${100 - (index * 15)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-purple-600">{100 - (index * 15)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Metrics */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Métricas de Análisis</h4>
              
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Confianza</span>
                    <span className="font-bold text-green-600">
                      {Math.round(analysisResult.confidence * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${analysisResult.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Método</span>
                    <span className="font-bold text-blue-600 capitalize">
                      {analysisResult.method}
                    </span>
                  </div>
                </div>
                
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tiempo</span>
                    <span className="font-bold text-orange-600">
                      {analysisResult.processingTime}ms
                    </span>
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Keywords</span>
                    <span className="font-bold text-purple-600">
                      {analysisResult.keywords.length}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Algorithm Info */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h5 className="font-semibold text-gray-900 mb-2">Información del Algoritmo</h5>
                <div className="text-sm text-gray-600 space-y-1">
                  {analysisResult.method === 'tf-idf' && (
                    <p>Calcula la importancia de términos basándose en su frecuencia en el texto y rareza en el corpus.</p>
                  )}
                  {analysisResult.method === 'textrank' && (
                    <p>Utiliza un algoritmo de ranking basado en grafos para identificar términos centrales.</p>
                  )}
                  {analysisResult.method === 'yake' && (
                    <p>Extracción no supervisada que considera posición, frecuencia y co-ocurrencia de términos.</p>
                  )}
                  {analysisResult.method === 'hybrid' && (
                    <p>Combina TF-IDF, TextRank y YAKE para obtener resultados más precisos y robustos.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PLN Techniques Info */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Brain className="h-5 w-5 mr-2 text-indigo-500" />
          Técnicas de PLN Implementadas
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Preprocesamiento</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Tokenización automática</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Eliminación de palabras vacías (stopwords)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Normalización de texto</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Filtrado por longitud de términos</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Algoritmos Avanzados</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Análisis de co-ocurrencia de términos</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Cálculo de centralidad en grafos</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <span>Análisis estadístico de frecuencias</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <span>Combinación de múltiples métricas</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}