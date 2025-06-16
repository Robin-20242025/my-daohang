import React from "react";

const defaultLogo = "https://img.alicdn.com/imgextra/i4/O1CN01Qw2QkB1Qw2Qw2Qw2Q_!!6000000000000-2-tps-64-64.png";

export default function NavList({ links, onDelete, onEdit }) {
  if (links.length === 0) return <p>暂无网址，请添加。</p>;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
      {links.map(link => (
        <div
          key={link.id}
          style={{
            width: 173,
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 8px #e6e6e6",
            padding: 18,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            position: "relative",
            minHeight: 80
          }}
        >
          <img
            src={link.logo || defaultLogo}
            alt="logo"
            style={{ width: 40, height: 40, borderRadius: 8, marginRight: 16, background: "#f5f6fa", objectFit: "contain", flexShrink: 0 }}
            onError={e => { e.target.onerror = null; e.target.src = defaultLogo; }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontWeight: 600,
                fontSize: 17,
                color: "#1677ff",
                textDecoration: "none",
                marginBottom: 4,
                wordBreak: "break-all",
                display: "block"
              }}
            >
              {link.name}
            </a>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 0, wordBreak: "break-all", whiteSpace: 'pre-line' }}>
              {link.desc || "暂无简介"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 