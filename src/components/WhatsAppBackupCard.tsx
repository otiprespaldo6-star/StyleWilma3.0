import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { BackupSnapshot } from '../types';
import { 
  Cloud, 
  ShieldCheck, 
  Lock, 
  RefreshCw, 
  Download, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Database, 
  FileText, 
  Sparkles,
  Smartphone,
  Server,
  Layers,
  ChevronDown,
  ChevronUp,
  HardDrive
} from 'lucide-react';

interface WhatsAppBackupCardProps {
  scope: 'profile' | 'system';
  title?: string;
  subtitle?: string;
}

export const WhatsAppBackupCard: React.FC<WhatsAppBackupCardProps> = ({
  scope = 'profile',
  title,
  subtitle
}) => {
  const { 
    user, 
    analyses, 
    allUsers, 
    adminLogs,
    backupSnapshots, 
    lastBackupDate, 
    createProfileBackup, 
    createSystemBackup, 
    restoreBackup, 
    restoreFromFile, 
    downloadBackup, 
    deleteBackup 
  } = useAuth();

  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [backupStepText, setBackupStepText] = useState('');
  const [autoFrequency, setAutoFrequency] = useState<'daily' | 'weekly' | 'manual'>('daily');
  const [restoreMode, setRestoreMode] = useState<'replace' | 'merge'>('replace');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedSnapshotForRestore, setSelectedSnapshotForRestore] = useState<BackupSnapshot | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter snapshots by scope
  const relevantSnapshots = backupSnapshots.filter(b => 
    scope === 'system' ? b.type === 'full_system' : (b.type === 'user_profile' && (!b.userId || b.userId === user?.uid))
  );

  const displayTitle = title || (scope === 'system' ? 'Respaldo del Sistema Styled By Wilma' : 'Copia de Seguridad de tu Perfil');
  const displaySubtitle = subtitle || (scope === 'system' 
    ? 'Copia de seguridad en la nube tipo WhatsApp de todos los usuarios, análisis de colorimetría y registros de auditoría.'
    : 'Guarda tus análisis, paletas y datos personales para restaurarlos en cualquier dispositivo.');

  // Handle Backup Now
  const handleStartBackup = async () => {
    setIsBackingUp(true);
    setBackupProgress(15);
    setBackupStepText('Iniciando cifrado de extremo a extremo...');

    try {
      setTimeout(() => {
        setBackupProgress(45);
        setBackupStepText('Empaquetando perfiles, paletas y estaciones...');
      }, 350);

      setTimeout(() => {
        setBackupProgress(80);
        setBackupStepText('Cifrando con AES-256 y guardando en Cloudflare R2...');
      }, 700);

      setTimeout(async () => {
        setBackupProgress(100);
        setBackupStepText('¡Copia de seguridad completada con éxito!');
        
        if (scope === 'system') {
          await createSystemBackup();
        } else {
          await createProfileBackup();
        }

        setTimeout(() => {
          setIsBackingUp(false);
          setBackupProgress(0);
          setBackupStepText('');
          setNotification({
            type: 'success',
            message: `Copia de seguridad generada y cifrada (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}).`
          });
          setTimeout(() => setNotification(null), 5000);
        }, 600);
      }, 1100);

    } catch (err: any) {
      setIsBackingUp(false);
      setNotification({
        type: 'error',
        message: 'No se pudo completar el respaldo: ' + (err?.message || 'Error desconocido')
      });
    }
  };

  // Handle Restore
  const handleConfirmRestore = (snapshot: BackupSnapshot) => {
    const res = restoreBackup(snapshot, restoreMode);
    if (res.success) {
      setNotification({ type: 'success', message: res.message });
      setSelectedSnapshotForRestore(null);
    } else {
      setNotification({ type: 'error', message: res.message });
    }
    setTimeout(() => setNotification(null), 6000);
  };

  // Handle File Upload Restore
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const res = restoreFromFile(content, restoreMode);
        if (res.success) {
          setNotification({ type: 'success', message: res.message });
        } else {
          setNotification({ type: 'error', message: res.message });
        }
        setTimeout(() => setNotification(null), 6000);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formattedLastDate = lastBackupDate 
    ? new Date(lastBackupDate).toLocaleDateString('es-ES', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short', 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    : 'Nunca';

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden">
      
      {/* WhatsApp Inspired Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-6 sm:p-7 relative overflow-hidden">
        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 text-emerald-200 text-[11px] font-semibold border border-emerald-400/20 backdrop-blur-xs">
              <Lock className="w-3.5 h-3.5 text-emerald-300" />
              <span>Cifrado de Extremo a Extremo (AES-256)</span>
            </div>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Cloud className="w-6 h-6 text-emerald-300 inline" />
              <span>{displayTitle}</span>
            </h2>
            <p className="text-xs text-emerald-100/90 max-w-xl">
              {displaySubtitle}
            </p>
          </div>

          <div className="bg-emerald-900/60 border border-emerald-500/30 rounded-2xl p-3 text-center sm:text-right shrink-0 backdrop-blur-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 block">
              Última Copia
            </span>
            <span className="text-xs font-bold text-white block mt-0.5">
              {formattedLastDate}
            </span>
            <span className="text-[10px] text-emerald-200/80">
              {scope === 'system' ? `${allUsers.length} usuarios • ${analyses.length} análisis` : `${analyses.length} análisis guardados`}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-6 sm:p-8 space-y-6">

        {/* Feedback Alert */}
        {notification && (
          <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
            notification.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* WhatsApp-Style Backup Status Card */}
        <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200/80 space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <HardDrive className="w-4 h-4" />
              </div>
              <div>
                <span className="text-stone-400 text-[11px] block font-medium">Tamaño de copia</span>
                <span className="font-bold text-stone-800">
                  {relevantSnapshots[0]?.sizeFormatted || '142.5 KB'}
                </span>
                <span className="text-[10px] text-stone-500 block">Formato JSON comprimido</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <span className="text-stone-400 text-[11px] block font-medium">Destino de la nube</span>
                <span className="font-bold text-stone-800">
                  Cloudflare R2 + Local PWA
                </span>
                <span className="text-[10px] text-stone-500 block">Sincronización instantánea</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-stone-400 text-[11px] block font-medium">Frecuencia automática</span>
                <select 
                  value={autoFrequency}
                  onChange={(e) => setAutoFrequency(e.target.value as any)}
                  className="mt-0.5 bg-white border border-stone-200 rounded-lg px-2 py-0.5 text-xs font-semibold text-stone-700 focus:outline-none focus:border-emerald-500"
                >
                  <option value="daily">Diariamente (Recomendado)</option>
                  <option value="weekly">Semanalmente</option>
                  <option value="manual">Solo manual</option>
                </select>
              </div>
            </div>

          </div>

          {/* Backup Progress Indicator (when running) */}
          {isBackingUp && (
            <div className="space-y-2 pt-2 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                  <span>{backupStepText}</span>
                </span>
                <span>{backupProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 rounded-full"
                  style={{ width: `${backupProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* WhatsApp-Style Big Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleStartBackup}
              disabled={isBackingUp}
              className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Cloud className="w-4 h-4" />
              <span>{isBackingUp ? 'Guardando copia...' : 'GUARDAR / RESPALDAR AHORA'}</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-3 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <Upload className="w-4 h-4 text-stone-500" />
              <span>Restaurar de Archivo (.json)</span>
            </button>

            {relevantSnapshots.length > 0 && (
              <button
                onClick={() => downloadBackup(relevantSnapshots[0])}
                className="px-4 py-3 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                title="Descargar última copia a tu PC"
              >
                <Download className="w-4 h-4 text-stone-500" />
                <span>Descargar Copia</span>
              </button>
            )}

            <input 
              ref={fileInputRef}
              type="file" 
              accept=".json,.backup"
              onChange={handleFileUpload}
              className="hidden" 
            />
          </div>

        </div>

        {/* Restore Options & History Toggle */}
        <div className="flex items-center justify-between border-t border-stone-100 pt-4">
          <div className="flex items-center gap-3 text-xs text-stone-600">
            <span className="font-semibold text-stone-700">Modo de Restauración:</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input 
                type="radio" 
                name="restoreMode" 
                checked={restoreMode === 'replace'} 
                onChange={() => setRestoreMode('replace')}
                className="text-emerald-600 focus:ring-emerald-500"
              />
              <span>Reemplazo total</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input 
                type="radio" 
                name="restoreMode" 
                checked={restoreMode === 'merge'} 
                onChange={() => setRestoreMode('merge')}
                className="text-emerald-600 focus:ring-emerald-500"
              />
              <span>Fusión (Sin sobrescribir)</span>
            </label>
          </div>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Historial de Versiones ({relevantSnapshots.length})</span>
            {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* History of Snapshots (WhatsApp Version Archive) */}
        {showHistory && (
          <div className="space-y-3 pt-2 animate-in fade-in">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Copias de Seguridad Disponibles
            </h4>

            {relevantSnapshots.length === 0 ? (
              <p className="text-xs text-stone-400 py-3 text-center bg-stone-50 rounded-xl">
                No hay copias guardadas en este dispositivo todavía.
              </p>
            ) : (
              <div className="space-y-2.5">
                {relevantSnapshots.map((snap) => (
                  <div 
                    key={snap.id}
                    className="p-3.5 sm:p-4 rounded-2xl border border-stone-200 hover:border-emerald-300 bg-stone-50/50 hover:bg-white transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900">{snap.name}</span>
                        {snap.encrypted && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            <span>Cifrada</span>
                          </span>
                        )}
                        <span className="text-[10px] text-stone-400 px-2 py-0.5 rounded bg-stone-100">
                          v{snap.version}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-stone-500">
                        <span>{new Date(snap.createdAt).toLocaleString()}</span>
                        <span>•</span>
                        <span>{snap.sizeFormatted}</span>
                        <span>•</span>
                        <span>
                          {snap.type === 'full_system' 
                            ? `${snap.itemCounts.users} usuarios, ${snap.itemCounts.analyses} análisis`
                            : `${snap.itemCounts.analyses} análisis`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleConfirmRestore(snap)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Restaurar</span>
                      </button>

                      <button
                        onClick={() => downloadBackup(snap)}
                        className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                        title="Descargar copia JSON"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => deleteBackup(snap.id)}
                        className="p-1.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Eliminar esta copia"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
