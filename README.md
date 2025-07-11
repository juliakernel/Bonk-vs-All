# Bonk's Challenge 🎮

Một game nhịp điệu PvP thú vị được xây dựng với Next.js và TypeScript, nơi Bonk phải đánh bại 5 đối thủ mạnh mẽ bằng combo tấn công nhịp điệu!

## 🎯 Mục tiêu game

Điều khiển Bonk qua 5 màn đấu với các đối thủ:

- **Màn 1**: Jup Studio
- **Màn 2**: LaunchLab
- **Màn 3**: Moonshot
- **Màn 4**: Believe
- **Màn 5**: Pumpfun

## 🎮 Cách chơi

### Combo tấn công gồm 2 bước:

#### 1. Skill Click (Click Nhanh)

- Click chính xác **10 lần** trong **3 giây**
- Sau khi đạt đủ 10 lần, **đợi 1 giây** mà không click thêm
- Nếu click thêm trong thời gian chờ → **THẤT BẠI**

#### 2. Hold & Release (Nhấn Giữ)

- Nhấn và giữ phím **SPACE** hoặc **chuột**
- Thời gian giữ phải trong khoảng **1.5s - 2.5s**
- Thành công → Đối thủ mất **2 HP**
- Thất bại → Bonk mất **1 HP**

### Điều kiện thắng/thua:

- **Thắng màn**: Đối thủ hết HP trước
- **Thua game**: Bonk hết HP trước
- **HP của Bonk** được giữ nguyên qua các màn

## 🚀 Cài đặt và chạy

```bash
# Clone repository
git clone <repo-url>
cd bonk-vs-all

# Install dependencies
npm install

# Start development server
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để chơi game!

## 🎨 Thêm Assets

### Hình ảnh (PNG format)

Đặt các file vào thư mục `public/imgs/`:

#### Background cho mỗi màn:

- `jup-bg.png` - Background màn Jup Studio
- `launchlab-bg.png` - Background màn LaunchLab
- `moonshot-bg.png` - Background màn Moonshot
- `believe-bg.png` - Background màn Believe
- `pumpfun-bg.png` - Background màn Pumpfun

#### Hiệu ứng cho mỗi màn:

- `jup-attack.png` - Hiệu ứng khi Bonk tấn công thành công
- `jup-defend.png` - Hiệu ứng khi Bonk bị tấn công/thất bại
- `launchlab-attack.png` / `launchlab-defend.png`
- `moonshot-attack.png` / `moonshot-defend.png`
- `believe-attack.png` / `believe-defend.png`
- `pumpfun-attack.png` / `pumpfun-defend.png`

#### Nhân vật:

- `bonk.png` - Avatar của Bonk

### Âm thanh (WAV format)

Đặt các file vào thư mục `public/sounds/`:

- `click.wav` - Âm thanh khi click
- `success.wav` - Âm thanh khi combo thành công
- `fail.wav` - Âm thanh khi combo thất bại
- `attack.wav` - Âm thanh khi bắt đầu tấn công
- `damage.wav` - Âm thanh khi nhận sát thương
- `victory.wav` - Âm thanh khi thắng game
- `defeat.wav` - Âm thanh khi thua game
- `bg-music.wav` - Nhạc nền game

## 🛠️ Công nghệ sử dụng

- **Framework**: Next.js 14 với App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useEffect, useCallback)
- **Audio**: HTML5 Audio API

## 🎯 Tính năng

- ✅ Cơ chế combo tấn công phức tạp và thách thức
- ✅ 5 màn chơi với các đối thủ khác nhau
- ✅ Hệ thống HP duy trì qua các màn
- ✅ Giao diện responsive (desktop + mobile)
- ✅ Hiệu ứng âm thanh và nhạc nền
- ✅ Hiệu ứng hình ảnh cho mỗi hành động
- ✅ Keyboard và mouse/touch support
- ✅ Real-time feedback và animations

## 🎮 Controls

- **Phím SPACE**: Thực hiện combo click/hold
- **Mouse Click**: Alternative cho SPACE
- **Touch**: Hỗ trợ mobile devices

## 📱 Responsive Design

Game được thiết kế hoạt động tốt trên:

- Desktop (1024px+)
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

Chúc bạn chơi game vui vẻ! 🎉
