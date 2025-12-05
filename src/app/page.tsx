"use client";

import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";

// Snowflake component
const Snowflake = ({ style }: { style: React.CSSProperties }) => (
  <div
    className="snowflake"
    style={style}
  >
    ❄
  </div>
);

// Fireworks component
const Fireworks = () => {
  const fireworksData = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: 10 + (i % 4) * 25 + Math.random() * 10,
    delay: (i % 3) * 0.8,
    color: ['#ccff00', '#ff0000', '#00ff00', '#ffff00', '#ff00ff', '#00ffff'][i % 6]
  }));

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {fireworksData.map((fw) => (
        <div
          key={fw.id}
          className="firework"
          style={{
            left: `${fw.left}%`,
            animationDelay: `${fw.delay}s`,
          }}
        >
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="firework-particle"
              style={{
                '--angle': `${(360 / 30) * i}deg`,
                '--color': fw.color,
                animationDelay: `${fw.delay}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// Countdown Timer Component
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const newYear = new Date('2026-01-01T00:00:00').getTime();
      const now = new Date().getTime();
      const difference = newYear - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-[#1a1a1a]/90 to-[#0f0f0f]/90 backdrop-blur-md border-2 border-[#ccff00] neon-border p-6 rounded-2xl text-center mb-8">
      <h3 className="text-xl md:text-2xl font-bold text-[#ccff00] mb-4 uppercase" style={{ fontFamily: "'Orbitron', sans-serif" }}>
        ⏰ До Нового 2026 Года осталось:
      </h3>
      <div className="grid grid-cols-4 gap-4">
        {[
          { value: timeLeft.days, label: 'Дней' },
          { value: timeLeft.hours, label: 'Часов' },
          { value: timeLeft.minutes, label: 'Минут' },
          { value: timeLeft.seconds, label: 'Секунд' }
        ].map((item, index) => (
          <div key={index} className="bg-[#0a0a0a]/80 border-2 border-[#ccff00]/50 rounded-xl p-4">
            <div className="text-3xl md:text-5xl font-black text-[#ccff00] neon-text" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              {String(item.value).padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-400 mt-2 uppercase">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Background Music Hook
const useBackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState(0);

  const tracks = [
    "/music/jingle-bells.mp3",
    "/music/silent-night.mp3",
    "/music/merry-christmas.mp3",
  ];

  useEffect(() => {
    // Создаем аудио элемент
    audioRef.current = new Audio(tracks[currentTrack]);
    audioRef.current.volume = 0.3; // Тихая фоновая музыка
    audioRef.current.loop = false;

    // Автоматически переключаем на следующий трек
    const handleEnded = () => {
      setCurrentTrack((prev) => (prev + 1) % tracks.length);
    };

    audioRef.current.addEventListener('ended', handleEnded);

    // Пытаемся автоматически запустить музыку
    const playAudio = () => {
      audioRef.current?.play().catch(() => {
        // Если автовоспроизведение заблокировано, ждем первого клика пользователя
        const startMusic = () => {
          audioRef.current?.play().catch(() => {});
          document.removeEventListener('click', startMusic);
        };
        document.addEventListener('click', startMusic);
      });
    };

    // Небольшая задержка перед запуском
    setTimeout(playAudio, 1000);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current && currentTrack > 0) {
      audioRef.current.src = tracks[currentTrack];
      audioRef.current.load();
      audioRef.current.play().catch(() => {});
    }
  }, [currentTrack]);

  return null;
};

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    telegram: "",
    phone: "",
    brand: "",
    model: "",
    year: "",
    color: "",
    mileage: "",
    transmission: "",
    fuel: "",
    drive: "",
    budget: "",
    comment: "",
  });

  const [snowflakes, setSnowflakes] = useState<Array<{ id: number; left: number; delay: number; duration: number }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

  // Запускаем фоновую музыку
  useBackgroundMusic();

  useEffect(() => {
    // Generate snowflakes with animation
    const flakes = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 12,
    }));
    setSnowflakes(flakes);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Формируем сообщение для Telegram
      const message = `
🎄 *НОВАЯ ЗАЯВКА НА ПОДБОР АВТО* 🎄

👤 *Контактная информация:*
Имя: ${formData.name}
Telegram: ${formData.telegram}
Телефон: ${formData.phone || 'Не указан'}

🚗 *Желаемый автомобиль:*
Марка: ${formData.brand}
Модель: ${formData.model}
Год: ${formData.year}
Цвет: ${formData.color || 'Не указан'}
Пробег: ${formData.mileage || 'Не указан'}

⚙️ *Технические характеристики:*
Коробка передач: ${formData.transmission}
Топливо: ${formData.fuel}
Привод: ${formData.drive}
Бюджет: ${formData.budget}

💬 *Комментарий:*
${formData.comment || 'Не указан'}

🎅 Заявка отправлена: ${new Date().toLocaleString('ru-RU')}
      `.trim();

      // Здесь вы можете добавить свой Telegram Bot Token и Chat ID
      const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN'; // Замените на ваш токен
      const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID'; // Замените на ваш chat ID

      // Отправка в Telegram (раскомментируйте и добавьте реальные данные)
      /*
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      });
      */

      // Для демонстрации просто показываем алерт
      console.log("Сообщение для Telegram:", message);

      // Запускаем салют!
      setShowFireworks(true);

      // Показываем сообщение через секунду (когда салют уже виден)
      setTimeout(() => {
        alert("🎄 Заявка принята!\n\nСкоро свяжемся с вами.\nС наступающим Новым Годом! 🎅");
      }, 500);

      // Скрываем салют через 6 секунд
      setTimeout(() => {
        setShowFireworks(false);
      }, 6000);

      // Очищаем форму
      setFormData({
        name: "",
        telegram: "",
        phone: "",
        brand: "",
        model: "",
        year: "",
        color: "",
        mileage: "",
        transmission: "",
        fuel: "",
        drive: "",
        budget: "",
        comment: "",
      });
    } catch (error) {
      console.error("Ошибка отправки:", error);
      alert("Произошла ошибка. Попробуйте еще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Background Image */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('https://media.istockphoto.com/id/1065560790/photo/merry-christmas-and-happy-new-year-background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/80 to-black/75" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/90" />
      </div>

      {/* Snowflakes */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {snowflakes.map((flake) => (
          <Snowflake
            key={flake.id}
            style={{
              left: `${flake.left}%`,
              animationDelay: `${flake.delay}s`,
              animationDuration: `${flake.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Fireworks celebration */}
      {showFireworks && <Fireworks />}

      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-64 h-64 border-t-4 border-l-4 border-[#ccff00] opacity-20 z-0" />
      <div className="fixed bottom-0 right-0 w-64 h-64 border-b-4 border-r-4 border-[#ccff00] opacity-20 z-0" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#ccff00] opacity-5 blur-3xl rounded-full z-0" />

      {/* Floating ornaments */}
      <div className="fixed top-1/4 left-1/4 w-12 h-12 rounded-full bg-red-500/30 blur-sm animate-pulse z-5" style={{ animationDuration: '2s' }} />
      <div className="fixed top-1/3 right-1/3 w-16 h-16 rounded-full bg-yellow-400/20 blur-md animate-pulse z-5" style={{ animationDuration: '3s' }} />
      <div className="fixed bottom-1/4 left-1/3 w-14 h-14 rounded-full bg-green-500/25 blur-sm animate-pulse z-5" style={{ animationDuration: '2.5s' }} />

      {/* Christmas Lights */}
      <div className="fixed top-0 left-0 right-0 h-12 z-30 flex justify-around items-center">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full animate-pulse"
            style={{
              backgroundColor: ['#ff0000', '#00ff00', '#ffff00', '#0000ff', '#ccff00'][i % 5],
              animationDelay: `${i * 0.2}s`,
              boxShadow: `0 0 10px ${['#ff0000', '#00ff00', '#ffff00', '#0000ff', '#ccff00'][i % 5]}`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center py-16 px-4">
        <div className="w-full max-w-6xl">
          {/* Header with Christmas decorations */}
          <div className="text-center mb-8">
            <div className="mb-6 relative inline-block">
              <div className="text-6xl mb-2">🎄</div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-wider text-white mb-3" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                EU DRIVE
              </h1>
              <div className="h-1 w-32 bg-[#ccff00] neon-glow mx-auto" />
              <div className="absolute -top-2 -right-8 text-4xl animate-bounce">⭐</div>
              <div className="absolute -top-2 -left-8 text-4xl animate-bounce" style={{ animationDelay: '0.5s' }}>⭐</div>
            </div>

            <div className="mb-6 relative">
              <h2 className="text-4xl md:text-6xl font-black uppercase mb-4" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                <span className="neon-text">АНКЕТА ПОДБОРА</span>
              </h2>
              <h3 className="text-3xl md:text-5xl font-black uppercase" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                <span className="neon-text">АВТОМОБИЛЯ</span>
              </h3>
              <div className="text-2xl mt-4">🎁</div>
            </div>

            <div className="relative inline-block mb-6">
              <p className="text-xl text-gray-400 max-w-2xl mx-auto bg-black/40 backdrop-blur-sm px-6 py-3 rounded-lg border border-[#ccff00]/30">
                🎅 Заполните форму, и мы подберем для вас идеальный автомобиль из Европы к Новому Году!
              </p>
            </div>
          </div>

          {/* Countdown Timer */}
          <CountdownTimer />

          {/* Form Card with enhanced design */}
          <Card className="bg-gradient-to-br from-[#1a1a1a]/90 to-[#0f0f0f]/90 backdrop-blur-md border-2 border-[#ccff00] neon-border p-8 md:p-12 rounded-2xl shadow-2xl relative overflow-hidden">
            {/* Decorative corner elements */}
            <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-[#ccff00]/50" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-[#ccff00]/50" />

            {/* Christmas decoration on form */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-5xl z-10">🎄</div>

            <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
              {/* Contact Information */}
              <div>
                <h3 className="text-2xl font-bold mb-6 text-[#ccff00] uppercase tracking-wide flex items-center justify-center gap-3" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  <span className="text-3xl">🎅</span> Контактная информация
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="group">
                    <label className="block text-sm font-bold mb-2 text-[#ccff00] uppercase tracking-wide">
                      Ваше имя *
                    </label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="bg-[#0a0a0a]/80 border-2 border-[#444] focus:border-[#ccff00] text-white h-14 rounded-lg transition-all group-hover:border-[#ccff00]/50 px-4"
                      placeholder="Иван Иванов"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-bold mb-2 text-[#ccff00] uppercase tracking-wide">
                      Telegram контакт *
                    </label>
                    <Input
                      required
                      value={formData.telegram}
                      onChange={(e) => setFormData({...formData, telegram: e.target.value})}
                      className="bg-[#0a0a0a]/80 border-2 border-[#444] focus:border-[#ccff00] text-white h-14 rounded-lg transition-all group-hover:border-[#ccff00]/50 px-4"
                      placeholder="@username"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-bold mb-2 text-[#ccff00] uppercase tracking-wide">
                      Телефон
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="bg-[#0a0a0a]/80 border-2 border-[#444] focus:border-[#ccff00] text-white h-14 rounded-lg transition-all group-hover:border-[#ccff00]/50 px-4"
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-[#333] pt-10">
                <h3 className="text-2xl font-bold mb-6 text-[#ccff00] uppercase tracking-wide flex items-center justify-center gap-3" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  <span className="text-3xl">🚗</span> Интересующий автомобиль
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="group">
                    <label className="block text-sm font-bold mb-2 text-[#ccff00] uppercase tracking-wide">
                      Марка *
                    </label>
                    <Input
                      required
                      value={formData.brand}
                      onChange={(e) => setFormData({...formData, brand: e.target.value})}
                      className="bg-[#0a0a0a]/80 border-2 border-[#444] focus:border-[#ccff00] text-white h-14 rounded-lg transition-all group-hover:border-[#ccff00]/50 px-4"
                      placeholder="BMW"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-bold mb-2 text-[#ccff00] uppercase tracking-wide">
                      Модель *
                    </label>
                    <Input
                      required
                      value={formData.model}
                      onChange={(e) => setFormData({...formData, model: e.target.value})}
                      className="bg-[#0a0a0a]/80 border-2 border-[#444] focus:border-[#ccff00] text-white h-14 rounded-lg transition-all group-hover:border-[#ccff00]/50 px-4"
                      placeholder="X5"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-bold mb-2 text-[#ccff00] uppercase tracking-wide">
                      Год *
                    </label>
                    <Input
                      required
                      value={formData.year}
                      onChange={(e) => setFormData({...formData, year: e.target.value})}
                      className="bg-[#0a0a0a]/80 border-2 border-[#444] focus:border-[#ccff00] text-white h-14 rounded-lg transition-all group-hover:border-[#ccff00]/50 px-4"
                      placeholder="2020-2024"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-bold mb-2 text-[#ccff00] uppercase tracking-wide">
                      Цвет
                    </label>
                    <Input
                      value={formData.color}
                      onChange={(e) => setFormData({...formData, color: e.target.value})}
                      className="bg-[#0a0a0a]/80 border-2 border-[#444] focus:border-[#ccff00] text-white h-14 rounded-lg transition-all group-hover:border-[#ccff00]/50 px-4"
                      placeholder="Черный"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-bold mb-2 text-[#ccff00] uppercase tracking-wide">
                      Пробег
                    </label>
                    <Input
                      value={formData.mileage}
                      onChange={(e) => setFormData({...formData, mileage: e.target.value})}
                      className="bg-[#0a0a0a]/80 border-2 border-[#444] focus:border-[#ccff00] text-white h-14 rounded-lg transition-all group-hover:border-[#ccff00]/50 px-4"
                      placeholder="до 50 000 км"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-[#333] pt-10">
                <h3 className="text-2xl font-bold mb-6 text-[#ccff00] uppercase tracking-wide flex items-center justify-center gap-3" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  <span className="text-3xl">⚙️</span> Технические характеристики
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="group">
                    <label className="block text-sm font-bold mb-2 text-[#ccff00] uppercase tracking-wide">
                      Коробка передач *
                    </label>
                    <select
                      required
                      value={formData.transmission}
                      onChange={(e) => setFormData({...formData, transmission: e.target.value})}
                      className="w-full bg-[#0a0a0a]/80 border-2 border-[#444] focus:border-[#ccff00] text-white h-14 px-4 rounded-lg transition-all group-hover:border-[#ccff00]/50"
                    >
                      <option value="">Выберите</option>
                      <option value="automatic">Автоматическая</option>
                      <option value="manual">Механическая</option>
                      <option value="robot">Роботизированная</option>
                    </select>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-bold mb-2 text-[#ccff00] uppercase tracking-wide">
                      Тип топлива *
                    </label>
                    <select
                      required
                      value={formData.fuel}
                      onChange={(e) => setFormData({...formData, fuel: e.target.value})}
                      className="w-full bg-[#0a0a0a]/80 border-2 border-[#444] focus:border-[#ccff00] text-white h-14 px-4 rounded-lg transition-all group-hover:border-[#ccff00]/50"
                    >
                      <option value="">Выберите</option>
                      <option value="petrol">Бензин</option>
                      <option value="diesel">Дизель</option>
                      <option value="hybrid">Гибрид</option>
                      <option value="electric">Электро</option>
                    </select>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-bold mb-2 text-[#ccff00] uppercase tracking-wide">
                      Тип привода *
                    </label>
                    <select
                      required
                      value={formData.drive}
                      onChange={(e) => setFormData({...formData, drive: e.target.value})}
                      className="w-full bg-[#0a0a0a]/80 border-2 border-[#444] focus:border-[#ccff00] text-white h-14 px-4 rounded-lg transition-all group-hover:border-[#ccff00]/50"
                    >
                      <option value="">Выберите</option>
                      <option value="fwd">Передний</option>
                      <option value="rwd">Задний</option>
                      <option value="awd">Полный</option>
                    </select>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-bold mb-2 text-[#ccff00] uppercase tracking-wide">
                      Бюджет *
                    </label>
                    <Input
                      required
                      value={formData.budget}
                      onChange={(e) => setFormData({...formData, budget: e.target.value})}
                      className="bg-[#0a0a0a]/80 border-2 border-[#444] focus:border-[#ccff00] text-white h-14 rounded-lg transition-all group-hover:border-[#ccff00]/50 px-4"
                      placeholder="1-2 млн руб"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-[#333] pt-10">
                <label className="block text-sm font-bold mb-2 text-[#ccff00] uppercase tracking-wide text-center flex items-center justify-center gap-2">
                  <span className="text-2xl">💬</span> Дополнительные пожелания
                </label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({...formData, comment: e.target.value})}
                  className="w-full bg-[#0a0a0a]/80 border-2 border-[#444] focus:border-[#ccff00] text-white p-4 rounded-lg min-h-32 transition-all hover:border-[#ccff00]/50"
                  placeholder="Укажите пожелания..."
                />
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-400 pt-4 bg-[#0a0a0a]/50 p-4 rounded-lg border border-[#ccff00]/30">
                <svg className="w-6 h-6 text-[#ccff00]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-base">🎄 Бесплатная консультация по подбору + Новогодние скидки!</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full neon-btn py-7 text-2xl rounded-xl mt-8 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isSubmitting ? '⏳ ОТПРАВКА...' : '🎁 ОТПРАВИТЬ ЗАЯВКУ 🎁'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#ccff00] via-[#99ff00] to-[#ccff00] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </form>
          </Card>
        </div>
      </div>

      {/* Footer with Christmas theme */}
      <footer className="relative z-10 bg-black/80 backdrop-blur-sm py-8 border-t-2 border-[#ccff00] mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 flex items-center justify-center gap-2">
            🎄 © 2024 EU DRIVE. Все права защищены. С Наступающим Новым Годом! 🎅
          </p>
        </div>
      </footer>
    </div>
  );
}
