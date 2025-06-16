import React from "react";

export default function Sidebar({ groups, currentGroup, onGroupChange, onAddGroup, onEditGroup, onDeleteGroup }) {
  return (
    <aside style={{
      width: 200,
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      boxShadow: "2px 0 8px #f0f1f2",
      padding: "32px 0",
      minHeight: "100vh",
      color: "#fff"
    }}>
      <div style={{
        fontWeight: 700,
        fontSize: 32,
        textAlign: "center",
        marginBottom: 36,
        color: "#fff",
        letterSpacing: 6,
        fontFamily: 'Brush Script MT, cursive, fantasy, sans-serif',
        textShadow: '0 2px 12px #2226, 0 1px 0 #fff4',
        userSelect: 'none',
      }}>
        我的导航
      </div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {groups.map(group => (
          <li key={group.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
            <button
              onClick={() => onGroupChange(group.id)}
              style={{
                width: "100%",
                padding: "12px 0",
                background: currentGroup === group.id ? "rgba(255,255,255,0.18)" : "none",
                color: currentGroup === group.id ? "#fff" : "#e0e6ff",
                border: "none",
                borderLeft: currentGroup === group.id ? "4px solid #fff" : "4px solid transparent",
                textAlign: "center",
                fontSize: 16,
                cursor: "pointer",
                outline: "none"
              }}
            >
              {group.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
} 