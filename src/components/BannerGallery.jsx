import React, { useEffect, useRef, useState } from "react";

export default function BannerGallery({ images }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef();

  // 自动轮播
  useEffect(() => {
    if (images.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % images.length);
    }, 3500);
    return () => clearInterval(timerRef.current);
  }, [images]);

  if (images.length === 0) {
    return (
      <div style={{
        width: '100%',
        height: 220,
        background: 'rgba(255,255,255,0.7)',
        borderRadius: 18,
        boxShadow: '0 4px 24px #e6e6e6',
        margin: '0 auto 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        color: '#aaa',
        minHeight: 180
      }}>
        暂无横幅图片
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      height: 220,
      background: '#fff',
      borderRadius: 18,
      boxShadow: '0 4px 24px #e6e6e6',
      margin: '0 auto 32px',
      position: 'relative',
      overflow: 'hidden',
      minHeight: 180
    }}>
      {images.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt="banner"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            left: 0,
            top: 0,
            opacity: idx === current ? 1 : 0,
            transition: 'opacity 0.7s',
            zIndex: idx === current ? 2 : 1
          }}
        />
      ))}
      {/* 指示点 */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 16, display: 'flex', justifyContent: 'center', gap: 8 }}>
        {images.map((_, idx) => (
          <span key={idx} style={{
            width: 10, height: 10, borderRadius: '50%', background: idx === current ? '#667eea' : '#eee', display: 'inline-block', transition: 'background 0.3s'
          }} />
        ))}
      </div>
    </div>
  );
} 