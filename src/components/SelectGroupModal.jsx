import React, { useState } from "react";

export default function SelectGroupModal({ visible, groups, onSelect, onCancel }) {
  const [search, setSearch] = useState("");
  if (!visible) return null;
  const filtered = groups.filter(g => g.name.includes(search));
  return (
    <div style={{
      position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.18)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000
    }}>
      <div style={{ background: "#fff", borderRadius: 10, padding: 32, minWidth: 340, boxShadow: "0 4px 24px #ddd", maxHeight: 420, overflowY: 'auto' }}>
        <h3 style={{ marginBottom: 18 }}>选择分组</h3>
        <input
          type="text"
          placeholder="搜索分组名称"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: 8, fontSize: 15, marginBottom: 16, borderRadius: 4, border: '1px solid #eee' }}
        />
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {filtered.length === 0 && <li style={{ color: '#aaa', textAlign: 'center', padding: 16 }}>暂无匹配分组</li>}
          {filtered.map(group => (
            <li key={group.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #f5f6fa', cursor: 'pointer' }} onClick={() => onSelect(group)}>
              <span style={{ fontWeight: 500, color: '#1677ff', fontSize: 15 }}>{group.name}</span>
            </li>
          ))}
        </ul>
        <div style={{ textAlign: 'right', marginTop: 18 }}>
          <button onClick={onCancel} style={{ background: '#f5f6fa', color: '#888', border: 'none', borderRadius: 4, padding: '6px 18px', cursor: 'pointer' }}>取消</button>
        </div>
      </div>
    </div>
  );
} 