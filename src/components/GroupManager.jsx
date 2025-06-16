import React, { useState } from "react";

export default function GroupManager({
  visible,
  mode, // 'add' | 'edit' | 'delete'
  group,
  onOk,
  onCancel
}) {
  const [name, setName] = useState(group?.name || "");

  React.useEffect(() => {
    setName(group?.name || "");
  }, [group, visible]);

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.18)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000
    }}>
      <div style={{ background: "#fff", borderRadius: 10, padding: 28, minWidth: 320, boxShadow: "0 4px 24px #ddd" }}>
        {mode === 'add' && <h3 style={{ marginBottom: 18 }}>添加分组</h3>}
        {mode === 'edit' && <h3 style={{ marginBottom: 18 }}>重命名分组</h3>}
        {mode === 'delete' && <h3 style={{ marginBottom: 18, color: '#ff4d4f' }}>删除分组</h3>}
        {(mode === 'add' || mode === 'edit') && (
          <form onSubmit={e => { e.preventDefault(); onOk(name); }}>
            <input
              autoFocus
              type="text"
              placeholder="分组名称"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ width: '100%', padding: 8, fontSize: 16, marginBottom: 18, borderRadius: 4, border: '1px solid #eee' }}
              required
            />
            <div style={{ textAlign: 'right' }}>
              <button type="button" onClick={onCancel} style={{ marginRight: 10, background: '#f5f6fa', color: '#888', border: 'none', borderRadius: 4, padding: '6px 18px', cursor: 'pointer' }}>取消</button>
              <button type="submit" style={{ background: '#1677ff', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 18px', cursor: 'pointer' }}>{mode === 'add' ? '添加' : '保存'}</button>
            </div>
          </form>
        )}
        {mode === 'delete' && (
          <>
            <div style={{ marginBottom: 18 }}>确定要删除分组"{group?.name}"吗？该分组下的网址也会被删除！</div>
            <div style={{ textAlign: 'right' }}>
              <button onClick={onCancel} style={{ marginRight: 10, background: '#f5f6fa', color: '#888', border: 'none', borderRadius: 4, padding: '6px 18px', cursor: 'pointer' }}>取消</button>
              <button onClick={() => onOk()} style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 18px', cursor: 'pointer' }}>删除</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 