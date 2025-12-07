import { useState } from 'react';
import { useWeatherApi } from '@/hooks/useWeatherApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function ExportWeatherData() {
  const { downloadCSV, downloadExcel, getLatestExportInfo, loading } = useWeatherApi();
  const [exportInfo, setExportInfo] = useState<{
    csvFilename?: string;
    csvCreated?: string;
    csvSize?: number;
    excelFilename?: string;
    excelCreated?: string;
    excelSize?: number;
  } | null>(null);



  const loadExportInfo = async () => {
    try {
      const info = await getLatestExportInfo();
      setExportInfo(info);
    } catch (err) {
      console.error('Erro ao carregar informações do export:', err);
    }
  };

  const handleDownloadCSV = async () => {
    try {
      await downloadCSV();
      await loadExportInfo();
    } catch (err) {
      console.error('Erro ao baixar CSV:', err);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      await downloadExcel();
      await loadExportInfo();
    } catch (err) {
      console.error('Erro ao baixar Excel:', err);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
 
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Exportar Dados
        </CardTitle>
        <CardDescription>
          Baixe os dados meteorológicos em formato CSV ou Excel
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {exportInfo && (exportInfo.csvFilename || exportInfo.excelFilename) && (
          <div className="space-y-3">
            {/* CSV Info */}
            {exportInfo.csvFilename && exportInfo.csvSize && (
              <div className="p-3 bg-muted/50 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Arquivo CSV</span>
                  <Badge variant="outline">{formatFileSize(exportInfo.csvSize)}</Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  <p className="truncate">{exportInfo.csvFilename}</p>
                  {exportInfo.csvCreated && (
                    <p>Criado em: {formatDate(exportInfo.csvCreated)}</p>
                  )}
                </div>
              </div>
            )}

            {/* Excel Info */}
            {exportInfo.excelFilename && exportInfo.excelSize && (
              <div className="p-3 bg-muted/50 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <FileSpreadsheet className="h-4 w-4 text-green-700" />
                  <span className="text-sm font-medium">Arquivo Excel</span>
                  <Badge variant="outline">{formatFileSize(exportInfo.excelSize)}</Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  <p className="truncate">{exportInfo.excelFilename}</p>
                  {exportInfo.excelCreated && (
                    <p>Criado em: {formatDate(exportInfo.excelCreated)}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleDownloadCSV}
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            <FileText className="mr-2 h-4 w-4" />
            {loading ? 'Baixando...' : 'CSV'}
          </Button>

          <Button
            onClick={handleDownloadExcel}
            disabled={loading}
            className="w-full"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            {loading ? 'Baixando...' : 'Excel'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
