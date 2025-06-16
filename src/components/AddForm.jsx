import React, { useState, useEffect } from "react";

export default function AddForm({ onAdd, groups, currentGroup, initial, editMode }) {
  const [name, setName] = useState(initial?.name || "");
  const [url, setUrl] = useState(initial?.url || "");
  const [desc, setDesc] = useState(initial?.desc || "");
  const [groupId, setGroupId] = useState(initial?.groupId || currentGroup);

  // 切换分组或初始值时，自动切换表单内容
  useEffect(() => {
    if (editMode && initial) {
      setName(initial.name || "");
      setUrl(initial.url || "");
      setDesc(initial.desc || "");
      setGroupId(initial.groupId || currentGroup);
    } else {
      setGroupId(currentGroup);
    }
  }, [currentGroup, initial, editMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;
    onAdd({ name: name.trim(), url: url.trim(), desc: desc.trim(), groupId });
    if (!editMode) {
      setName("");
      setUrl("");
      setDesc("");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, marginBottom: 20, alignItems: "center", flexWrap: 'wrap' }}>
      <input
        type="text"
        placeholder="名称"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ flex: 2, padding: 6, minWidth: 80 }}
        required
      />
      <input
        type="url"
        placeholder="网址，如 https://example.com"
        value={url}
        onChange={e => setUrl(e.target.value)}
        style={{ flex: 3, padding: 6, minWidth: 120 }}
        required
      />
      <input
        type="text"
        placeholder="简介（可选）"
        value={desc}
        onChange={e => setDesc(e.target.value)}
        style={{ flex: 3, padding: 6, minWidth: 120 }}
      />
      <select value={groupId} onChange={e => setGroupId(e.target.value)} style={{ flex: 1, padding: 6, minWidth: 60 }}>
        {groups.map(g => (
          <option key={g.id} value={g.id}>{g.name}</option>
        ))}
      </select>
      <button type="submit" style={{ padding: "6px 16px", background: "#1677ff", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>
        {editMode ? "保存" : "添加"}
      </button>
    </form>
  );
} 