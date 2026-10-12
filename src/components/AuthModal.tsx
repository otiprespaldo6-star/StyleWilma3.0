import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Sparkles, 
  User, 
  Mail, 
  Lock, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Check, 
  AlertCircle, 
  ArrowLeft, 
  CheckCircle2, 
  KeyRound,
  Send,
  HelpCircle,
  Crown
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { getAgeFromBirthDate, getAgeGroupFromBirthDate, AGE_GROUPS_CONFIG } from '../data/ageGroups';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    login, 
    loginWithGoogle, 
    loginWithFacebook,
    loginAsMaster,
    register,
    verifyEmailCode,
    requestPasswordReset,
    resetPassword,
    securityConfig 
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'recovery' | 'verification' | 'master'>(authModalMode);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('1998-05-15');
  const [sexo, setSexo] = useState<'femenino' | 'masculino' | 'otro'>('femenino');
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);

  // Master login state
  const [masterPassword, setMasterPassword] = useState('');

  // Verification code state
  const [verificationCode, setVerificationCode] = useState('');
  
  // Password Recovery state
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [recoveryStep, setRecoveryStep] = useState<'email' | 'code'>('email');

  // Feedback
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isAuthModalOpen) return null;

  const calculatedAge = birthDate ? getAgeFromBirthDate(birthDate) : 28;
  const calculatedGroup = birthDate ? getAgeGroupFromBirthDate(birthDate) : 'adulta_joven';
  const groupInfo = AGE_GROUPS_CONFIG[calculatedGroup];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const input = usernameOrEmail.trim();
    if (!input) {
      setErrorMessage('Ingresa tu usuario o correo electrónico.');
      return;
    }
    const res = login(input, password, rememberMe);
    if (!res.success) {
      setErrorMessage(res.error || 'Credenciales incorrectas.');
    }
  };

  const handleMasterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const res = loginAsMaster(masterPassword);
    if (!res.success) {
      setErrorMessage(res.error || 'Contraseña de Master inválida.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !email.trim() || !firstName.trim() || !lastName.trim()) {
      setErrorMessage('Por favor completa todos los campos requeridos.');
      return;
    }

    if (password.length < (securityConfig.passwordMinLength || 6)) {
      setErrorMessage(`La contraseña debe tener al menos ${securityConfig.passwordMinLength || 6} caracteres.`);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    if (!acceptTerms) {
      setErrorMessage('Debes aceptar los Términos y la Política de Privacidad.');
      return;
    }

    const res = register({
      username: username.trim(),
      email: email.trim(),
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      birthDate,
      sexo,
      rememberMe
    });

    if (res.success) {
      if (securityConfig.requireEmailVerification) {
        setMode('verification');
        setSuccessMessage(`¡Cuenta creada! Revisa tu correo ${email} para el código de activación.`);
      }
    } else {
      setErrorMessage(res.error || 'Error al registrar.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200/80 overflow-hidden my-6">
        
        {/* Top Header Banner */}
        <div className="relative bg-gradient-to-r from-rose-100/60 via-amber-50 to-emerald-50/50 p-6 pb-5 border-b border-rose-100">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-white/80 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex justify-center mb-2">
            <BrandLogo size="md" showSubtitle={false} />
          </div>
          <p className="text-center text-xs text-stone-600 font-medium">
            Atelier de Asesoría de Imagen & Colorimetría Personal
          </p>
        </div>

        {/* Tab Selector */}
        {mode !== 'master' && mode !== 'verification' && mode !== 'recovery' && (
          <div className="flex border-b border-stone-100 text-sm font-semibold">
            <button
              onClick={() => { setMode('login'); setErrorMessage(''); }}
              className={`flex-1 py-3.5 text-center transition-colors cursor-pointer ${
                mode === 'login'
                  ? 'text-rose-700 border-b-2 border-rose-500 bg-rose-50/20'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => { setMode('register'); setErrorMessage(''); }}
              className={`flex-1 py-3.5 text-center transition-colors cursor-pointer ${
                mode === 'register'
                  ? 'text-rose-700 border-b-2 border-rose-500 bg-rose-50/20'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Registrarme
            </button>
          </div>
        )}

        <div className="p-6">
          {/* Error Message Toast */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Message Toast */}
          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════ */}
          {/* TAB: INICIAR SESIÓN */}
          {/* ═══════════════════════════════════════════════════ */}
          {mode === 'login' && (
            <div>
              {/* Social Login Buttons */}
              <div className="space-y-2.5 mb-5">
                {securityConfig.allowGoogle && (
                  <button
                    onClick={loginWithGoogle}
                    className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white border border-stone-200 hover:bg-stone-50 hover:border-stone-300 rounded-xl text-stone-700 font-semibold text-xs shadow-xs transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    Continuar con Google
                  </button>
                )}

                {securityConfig.allowFacebook && (
                  <button
                    onClick={loginWithFacebook}
                    className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-xl font-semibold text-xs shadow-xs transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Continuar con Facebook
                  </button>
                )}
              </div>

              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-stone-200 w-full"></div>
                <span className="bg-white px-3 text-[11px] font-medium text-stone-400 uppercase">o con tus datos</span>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Usuario o correo electrónico
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      value={usernameOrEmail}
                      onChange={(e) => setUsernameOrEmail(e.target.value)}
                      placeholder="ej. valeriam o nombre@ejemplo.com"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Tu contraseña secreta"
                      className="w-full pl-10 pr-10 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-stone-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-rose-600 focus:ring-rose-400"
                    />
                    <span>Recordarme</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => { setMode('recovery'); setRecoveryStep('email'); setErrorMessage(''); }}
                    className="text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold rounded-xl text-xs shadow-md shadow-rose-200 transition-all cursor-pointer mt-2"
                >
                  Iniciar Sesión
                </button>
              </form>

              {/* Master login secret shortcut link */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                <span>¿Eres la asesora titular?</span>
                <button
                  type="button"
                  onClick={() => { setMode('master'); setErrorMessage(''); }}
                  className="text-stone-500 hover:text-purple-600 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-500" />
                  Acceso Máster
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════ */}
          {/* TAB: REGISTRARME */}
          {/* ═══════════════════════════════════════════════════ */}
          {mode === 'register' && (
            <div>
              {/* Social Register */}
              <div className="space-y-2 mb-4">
                {securityConfig.allowGoogle && (
                  <button
                    onClick={loginWithGoogle}
                    className="w-full flex items-center justify-center gap-3 py-2 px-4 bg-white border border-stone-200 hover:bg-stone-50 rounded-xl text-stone-700 font-semibold text-xs shadow-xs transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    Registrarme con Google
                  </button>
                )}
                {securityConfig.allowFacebook && (
                  <button
                    onClick={loginWithFacebook}
                    className="w-full flex items-center justify-center gap-3 py-2 px-4 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-xl font-semibold text-xs shadow-xs transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Registrarme con Facebook
                  </button>
                )}
              </div>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-stone-200 w-full"></div>
                <span className="bg-white px-3 text-[11px] font-medium text-stone-400 uppercase">o con correo</span>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Nombres *</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Camila"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Apellidos *</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="García"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Usuario único *</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="camila_biobio"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Correo electrónico *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="camila@gmail.com"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                {/* Age & Group Personalization Badge */}
                <div className="p-2.5 bg-rose-50/50 rounded-xl border border-rose-100">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-stone-800">Fecha de Nacimiento</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold">
                      {groupInfo.title} ({groupInfo.range})
                    </span>
                  </div>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-400"
                    required
                  />
                  <p className="text-[10px] text-stone-500 mt-1 italic">
                    {groupInfo.focus}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Contraseña *</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mín. 6 caracteres"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Confirmar *</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repite clave"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <label className="flex items-start gap-2 text-[11px] text-stone-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-0.5 rounded text-rose-600 focus:ring-rose-400"
                    />
                    <span>
                      Acepto los <a href="#terminos" className="text-rose-600 underline">Términos del Servicio</a> y la <a href="#privacidad" className="text-rose-600 underline">Política de Privacidad</a> del atelier en Concepción.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold rounded-xl text-xs shadow-md shadow-rose-200 transition-all cursor-pointer mt-2"
                >
                  Completar Registro
                </button>
              </form>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════ */}
          {/* TAB: ACCESO MÁSTER (SUPERADMIN) */}
          {/* ═══════════════════════════════════════════════════ */}
          {mode === 'master' && (
            <div className="space-y-4">
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl flex items-center gap-3">
                <Crown className="w-6 h-6 text-purple-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-purple-900">Acceso Máster Superadministradora</h4>
                  <p className="text-[11px] text-purple-700">Acceso privilegiado al panel completo de 15 secciones.</p>
                </div>
              </div>

              <form onSubmit={handleMasterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Usuario Máster
                  </label>
                  <input
                    type="text"
                    value="MASTER"
                    disabled
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-100 border border-stone-200 rounded-xl text-stone-600 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Contraseña Máster
                  </label>
                  <input
                    type="password"
                    value={masterPassword}
                    onChange={(e) => setMasterPassword(e.target.value)}
                    placeholder="Ingresa clave de superusuario"
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-mono"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setErrorMessage(''); }}
                    className="flex-1 py-2.5 bg-stone-100 text-stone-700 font-semibold text-xs rounded-xl hover:bg-stone-200 cursor-pointer"
                  >
                    Volver
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                  >
                    Ingresar al Panel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════ */}
          {/* TAB: RECUPERACIÓN DE CONTRASEÑA */}
          {/* ═══════════════════════════════════════════════════ */}
          {mode === 'recovery' && (
            <div className="space-y-4">
              <div className="text-center mb-3">
                <h3 className="font-serif text-lg font-bold text-stone-900">Recuperar Contraseña</h3>
                <p className="text-xs text-stone-500">Te enviaremos las instrucciones de restablecimiento</p>
              </div>

              {recoveryStep === 'email' ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const res = requestPasswordReset(email);
                    if (res.success) {
                      setSuccessMessage(res.message);
                      setRecoveryStep('code');
                    } else {
                      setErrorMessage(res.message);
                    }
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@correo.com"
                      className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-400"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                  >
                    Enviar Código PIN
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="w-full py-2 text-stone-500 text-xs hover:text-stone-700 cursor-pointer"
                  >
                    Volver a Iniciar Sesión
                  </button>
                </form>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const res = resetPassword(email, recoveryCode, newPassword);
                    if (res.success) {
                      setSuccessMessage('¡Contraseña actualizada con éxito! Ya puedes iniciar sesión.');
                      setTimeout(() => setMode('login'), 1500);
                    } else {
                      setErrorMessage(res.error || 'Código incorrecto.');
                    }
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Código PIN (6 dígitos)</label>
                    <input
                      type="text"
                      value={recoveryCode}
                      onChange={(e) => setRecoveryCode(e.target.value)}
                      placeholder="741258"
                      className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-400 text-center font-mono text-base tracking-widest"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Nueva Contraseña</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-400"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                  >
                    Cambiar Contraseña
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════ */}
          {/* TAB: VERIFICACIÓN PIN */}
          {/* ═══════════════════════════════════════════════════ */}
          {mode === 'verification' && (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-600">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Verifica tu Correo</h3>
              <p className="text-xs text-stone-500">
                Ingresa el código PIN de 6 dígitos que enviamos a <strong>{email}</strong>
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const res = verifyEmailCode(email, verificationCode);
                  if (!res.success) {
                    setErrorMessage(res.error || 'Código incorrecto');
                  }
                }}
                className="space-y-3"
              >
                <input
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="582914"
                  className="w-44 mx-auto py-2.5 text-center text-lg font-mono font-bold tracking-widest bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-400"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Activar Mi Cuenta
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
