import React, { useState } from 'react';
import { BookOpen, FileText, ExternalLink, MapPin, Calendar, User, Bookmark } from 'lucide-react';

interface CubanDocument {
  id: string;
  title: string;
  author: string;
  year: number;
  category: string;
  description: string;
  url: string;
  source: string;
  format: 'PDF' | 'HTML' | 'EPUB';
}

const CUBAN_DOCUMENTS: Record<string, CubanDocument[]> = {
  'Historia': [
    {
      id: 'ch-001',
      title: 'La Historia de Cuba',
      author: 'Instituto de Historia de Cuba',
      year: 2005,
      category: 'Historia',
      description: 'Análisis completo de la historia cubana desde la colonia hasta la actualidad, con documentos de archivo y testimonios.',
      url: 'https://www.ejemplo.cu/historia-cuba.pdf',
      source: 'Biblioteca Virtual Cubana',
      format: 'PDF'
    },
    {
      id: 'ch-002',
      title: 'Revoluciones en América Latina: El Caso Cubano',
      author: 'Juan José Hernández',
      year: 2010,
      category: 'Historia',
      description: 'Estudio comparativo de revoluciones latinoamericanas con énfasis en la Revolución Cubana de 1959.',
      url: 'https://www.ejemplo.cu/revoluciones-latinoamericanas.pdf',
      source: 'Casa de las Américas',
      format: 'PDF'
    },
    {
      id: 'ch-003',
      title: 'Independencia y Martí',
      author: 'Carlos Rafael Rodríguez',
      year: 2015,
      category: 'Historia',
      description: 'Ensayo sobre la independencia cubana y el legado de José Martí en la formación de la nación.',
      url: 'https://www.ejemplo.cu/marti-independencia.pdf',
      source: 'Editorial de Ciencias Sociales',
      format: 'PDF'
    }
  ],
  'Literatura': [
    {
      id: 'cl-001',
      title: 'Obras Completas de José Martí',
      author: 'José Martí',
      year: 2013,
      category: 'Literatura',
      description: 'Compilación de la obra literaria completa del apóstol de la independencia cubana con análisis crítico.',
      url: 'https://www.ejemplo.cu/marti-obras-completas.pdf',
      source: 'Centro de Estudios Martianos',
      format: 'PDF'
    },
    {
      id: 'cl-002',
      title: 'La Narrativa Cubana Contemporánea',
      author: 'Ambrosio Fornet',
      year: 2008,
      category: 'Literatura',
      description: 'Estudio crítico de la literatura narrativa cubana desde 1959 hasta el presente.',
      url: 'https://www.ejemplo.cu/narrativa-cubana.pdf',
      source: 'Letras Cubanas',
      format: 'PDF'
    },
    {
      id: 'cl-003',
      title: 'La Poesía Negra en Cuba',
      author: 'Nancy Morejón',
      year: 2012,
      category: 'Literatura',
      description: 'Antología y análisis de la poesía afrocubana y su desarrollo en la literatura nacional.',
      url: 'https://www.ejemplo.cu/poesia-negra.pdf',
      source: 'Casa de las Américas',
      format: 'PDF'
    }
  ],
  'Ciencia': [
    {
      id: 'cc-001',
      title: 'Avances en Biotecnología Cubana',
      author: 'Centro de Ingeniería Genética y Biotecnología',
      year: 2020,
      category: 'Ciencia',
      description: 'Investigaciones cubanas en biotecnología y su aplicación en medicina y agricultura.',
      url: 'https://www.ejemplo.cu/biotecnologia-cuba.pdf',
      source: 'CIGB',
      format: 'PDF'
    },
    {
      id: 'cc-002',
      title: 'La Medicina Tropical Cubana',
      author: 'Instituto Pedro Kourí',
      year: 2018,
      category: 'Ciencia',
      description: 'Estudios sobre enfermedades tropicales y su prevención mediante investigación cubana.',
      url: 'https://www.ejemplo.cu/medicina-tropical.pdf',
      source: 'Instituto Pedro Kourí',
      format: 'PDF'
    },
    {
      id: 'cc-003',
      title: 'Energías Renovables en Cuba',
      author: 'Centro de Investigaciones Ambientales',
      year: 2019,
      category: 'Ciencia',
      description: 'Investigaciones sobre aplicación de energías renovables en la isla caribeña.',
      url: 'https://www.ejemplo.cu/energias-renovables.pdf',
      source: 'CITMA',
      format: 'PDF'
    }
  ],
  'Educación': [
    {
      id: 'ce-001',
      title: 'Sistema Educativo Cubano: Teoría y Práctica',
      author: 'Ministerio de Educación de Cuba',
      year: 2016,
      category: 'Educación',
      description: 'Análisis integral del sistema educativo cubano y sus fundamentos pedagógicos.',
      url: 'https://www.ejemplo.cu/sistema-educativo.pdf',
      source: 'MINED',
      format: 'PDF'
    },
    {
      id: 'ce-002',
      title: 'Educación Inclusiva en Cuba',
      author: 'Universidad de Ciencias Pedagógicas',
      year: 2017,
      category: 'Educación',
      description: 'Metodologías cubanas para la educación inclusiva y atención a la diversidad.',
      url: 'https://www.ejemplo.cu/educacion-inclusiva.pdf',
      source: 'UCP',
      format: 'PDF'
    },
    {
      id: 'ce-003',
      title: 'Tecnología Educativa en Cuba',
      author: 'Centro de Informática Educativa',
      year: 2021,
      category: 'Educación',
      description: 'Integración de tecnologías digitales en los procesos educativos cubanos.',
      url: 'https://www.ejemplo.cu/tecnologia-educativa.pdf',
      source: 'CIE',
      format: 'PDF'
    }
  ],
  'Economía': [
    {
      id: 'cec-001',
      title: 'Economía Cubana: Retos y Perspectivas',
      author: 'Centro de Estudios de la Economía Cubana',
      year: 2019,
      category: 'Economía',
      description: 'Análisis de la economía cubana y sus desafíos en el siglo XXI.',
      url: 'https://www.ejemplo.cu/economia-cuba.pdf',
      source: 'CEEC',
      format: 'PDF'
    },
    {
      id: 'cec-002',
      title: 'Turismo Sostenible en Cuba',
      author: 'Ministerio de Turismo',
      year: 2020,
      category: 'Economía',
      description: 'Estrategias de desarrollo turístico sostenible en la isla.',
      url: 'https://www.ejemplo.cu/turismo-sostenible.pdf',
      source: 'MINTUR',
      format: 'PDF'
    },
    {
      id: 'cec-003',
      title: 'Cooperativas y Desarrollo Local en Cuba',
      author: 'ACPA',
      year: 2018,
      category: 'Economía',
      description: 'Rol de las cooperativas en el desarrollo económico local cubano.',
      url: 'https://www.ejemplo.cu/cooperativas-desarrollo.pdf',
      source: 'ACPA',
      format: 'PDF'
    }
  ],
  'Ambiente': [
    {
      id: 'ca-001',
      title: 'Biodiversidad de Cuba',
      author: 'Instituto de Ecología y Sistemática',
      year: 2017,
      category: 'Ambiente',
      description: 'Estudio comprensivo de la flora y fauna endémica de Cuba.',
      url: 'https://www.ejemplo.cu/biodiversidad-cuba.pdf',
      source: 'IES',
      format: 'PDF'
    },
    {
      id: 'ca-002',
      title: 'Cambio Climático en el Caribe: Caso Cuba',
      author: 'Instituto de Meteorología',
      year: 2020,
      category: 'Ambiente',
      description: 'Análisis del cambio climático y su impacto en Cuba.',
      url: 'https://www.ejemplo.cu/cambio-climatico.pdf',
      source: 'INSMET',
      format: 'PDF'
    },
    {
      id: 'ca-003',
      title: 'Gestión de Residuos en Cuba',
      author: 'CITMA',
      year: 2019,
      category: 'Ambiente',
      description: 'Políticas y prácticas de gestión ambiental y manejo de residuos.',
      url: 'https://www.ejemplo.cu/gestion-residuos.pdf',
      source: 'CITMA',
      format: 'PDF'
    }
  ],
  'Cultura': [
    {
      id: 'ccu-001',
      title: 'Patrimonio Cultural Cubano',
      author: 'UNESCO Cuba',
      year: 2016,
      category: 'Cultura',
      description: 'Documentación del patrimonio cultural inmaterial y material de Cuba.',
      url: 'https://www.ejemplo.cu/patrimonio-cultural.pdf',
      source: 'UNESCO',
      format: 'PDF'
    },
    {
      id: 'ccu-002',
      title: 'Música Tradicional Cubana',
      author: 'Museo de la Música',
      year: 2018,
      category: 'Cultura',
      description: 'Historia y análisis de la música tradicional cubana y sus raíces.',
      url: 'https://www.ejemplo.cu/musica-tradicional.pdf',
      source: 'Museo de la Música',
      format: 'PDF'
    },
    {
      id: 'ccu-003',
      title: 'Artes Plásticas Cubanas Contemporáneas',
      author: 'Ministerio de Cultura',
      year: 2021,
      category: 'Cultura',
      description: 'Panorama de las artes visuales cubanas en el siglo XXI.',
      url: 'https://www.ejemplo.cu/artes-plasticas.pdf',
      source: 'Ministerio de Cultura',
      format: 'PDF'
    }
  ]
};

export function NationalRecommendations() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Historia');
  const [selectedDocument, setSelectedDocument] = useState<CubanDocument | null>(null);

  const categories = Object.keys(CUBAN_DOCUMENTS);
  const currentDocuments = CUBAN_DOCUMENTS[selectedCategory];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-8 border border-amber-200">
        <div className="flex items-start space-x-4">
          <MapPin className="h-8 w-8 text-orange-600 mt-1 flex-shrink-0" />
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Recomendación Nacional</h2>
            <p className="text-gray-700 mb-3">
              Acceso a documentos, libros y recursos cubanos en español sobre diversos temas de interés nacional e internacional.
            </p>
            <p className="text-sm text-gray-600">
              Recursos compilados de instituciones académicas, centros de investigación y editoriales cubanas.
            </p>
          </div>
        </div>
      </div>

      {/* Category Selector */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Selecciona un tema</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setSelectedDocument(null);
              }}
              className={`p-4 rounded-lg border transition-all text-center ${
                selectedCategory === category
                  ? 'bg-orange-50 border-orange-400 text-orange-900 font-semibold shadow-md'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentDocuments.map((doc) => (
          <div
            key={doc.id}
            onClick={() => setSelectedDocument(doc)}
            className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg hover:border-orange-300 transition-all cursor-pointer overflow-hidden group"
          >
            <div className="bg-gradient-to-br from-orange-100 to-amber-100 p-6 h-32 flex items-center justify-center group-hover:from-orange-200 group-hover:to-amber-200 transition-colors">
              <FileText className="h-12 w-12 text-orange-600 opacity-80" />
            </div>
            <div className="p-6">
              <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-700 transition-colors">
                {doc.title}
              </h4>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{doc.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-xs text-gray-600">
                  <User className="h-3 w-3 mr-2" />
                  <span className="line-clamp-1">{doc.author}</span>
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <Calendar className="h-3 w-3 mr-2" />
                  <span>{doc.year}</span>
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <BookOpen className="h-3 w-3 mr-2" />
                  <span>{doc.source}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                  {doc.format}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(doc.url, '_blank');
                  }}
                  className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 font-medium transition-colors"
                >
                  <span className="text-sm">Acceder</span>
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Document Detail Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200 p-6 flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedDocument.title}</h3>
                <p className="text-gray-600">{selectedDocument.description}</p>
              </div>
              <button
                onClick={() => setSelectedDocument(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-light ml-4"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Autor</h4>
                  <p className="text-gray-900">{selectedDocument.author}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Año de Publicación</h4>
                  <p className="text-gray-900">{selectedDocument.year}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Institución/Fuente</h4>
                  <p className="text-gray-900">{selectedDocument.source}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Formato</h4>
                  <p className="text-gray-900">{selectedDocument.format}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Descripción Completa</h4>
                <p className="text-gray-700 leading-relaxed">{selectedDocument.description}</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">Nota:</span> Este documento está disponible en español y pertenece al patrimonio académico y cultural cubano.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => window.open(selectedDocument.url, '_blank')}
                  className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="h-5 w-5" />
                  <span>Acceder al Documento</span>
                </button>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
